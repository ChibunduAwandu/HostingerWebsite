import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Pause,
  Play,
  ScanLine,
} from "lucide-react";
import {
  actionPhase,
  chapters,
  isObstructed,
  workerShares,
  type Chapter,
  type Surface,
} from "./labState";
import "./laboratory.css";

const World = lazy(() => import("./LaboratoryWorld"));
class WorldBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Laboratory({
  reducedMotion,
  onInspect,
}: {
  reducedMotion: boolean;
  onInspect: () => void;
}) {
  const [chapter, setChapter] = useState<Chapter>(0);
  const [surface, setSurface] = useState<Surface>("material");
  const [obstacle, setObstacle] = useState(1.8);
  const [failed, setFailed] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touring, setTouring] = useState(false);
  const [paused, setPaused] = useState(reducedMotion);
  const [unavailable, setUnavailable] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const root = useRef<HTMLElement>(null);
  const running = inView && pageVisible && !paused && !reducedMotion;
  const content = chapters[chapter];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    if (root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (reducedMotion) {
      setPaused(true);
      setPlaying(false);
      setTouring(false);
    }
  }, [reducedMotion]);
  useEffect(() => {
    if (!playing || !running || chapter !== 2 || !ready || unavailable) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - last) / 9500, 0.05);
      last = now;
      setProgress((value) => Math.min(1, value + delta));
    }, 40);
    return () => clearInterval(timer);
  }, [playing, running, chapter, ready, unavailable]);
  useEffect(() => {
    if (progress >= 1) {
      setPlaying(false);
      setTouring(false);
    }
  }, [progress]);
  useEffect(() => {
    if (!touring || !running || !ready || unavailable) return;
    if (chapter === 2) {
      setPlaying(true);
      return;
    }
    let elapsed = 0;
    const timer = window.setInterval(() => {
      elapsed += 0.2;
      if (chapter === 0) {
        setSurface(elapsed > 1.5 ? "scan" : "material");
        setObstacle(elapsed > 4 ? 2 : elapsed > 2 ? 0 : 1.8);
      } else setFailed(elapsed > 4 ? null : elapsed > 1.5 ? 1 : null);
      if (elapsed >= 6) {
        setReady(false);
        setChapter((chapter + 1) as Chapter);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [touring, running, ready, unavailable, chapter]);
  function selectChapter(next: Chapter) {
    setTouring(false);
    if (next === chapter) return;
    setPlaying(false);
    setReady(false);
    setChapter(next);
  }
  return (
    <section
      className="motion-lab"
      id="laboratory"
      tabIndex={-1}
      ref={root}
      aria-labelledby="lab-title"
      data-chapter={chapter}
      data-touring={touring}
    >
      <div className="lab-heading">
        <div>
          <span className="lab-kicker">The lab</span>
          <h2 id="lab-title">Perceive. Process. Act.</h2>
        </div>
        <div>
          <p>
            Three small experiments I built with Three.js and open robotics
            models. Change an input and watch the system respond.
          </p>
          <button
            className="guided-tour"
            aria-pressed={touring}
            disabled={reducedMotion || unavailable || !ready}
            onClick={() => {
              if (touring) {
                setTouring(false);
                setPlaying(false);
                return;
              }
              if (chapter !== 0) setReady(false);
              setChapter(0);
              setProgress(0);
              setFailed(null);
              setSurface("material");
              setObstacle(1.8);
              setPaused(false);
              setPlaying(false);
              setTouring(true);
            }}
          >
            {touring ? <Pause size={13} /> : <Play size={13} />}
            {touring ? "Stop guided sequence" : "Follow the signal"}
          </button>
          {reducedMotion && (
            <p className="motion-note">
              Reduced motion is on. Use the chapter buttons and timeline to
              explore without autoplay.
            </p>
          )}
        </div>
      </div>
      <div className="lab-navigation">
        <div role="tablist" aria-label="Engineering chapters">
          {chapters.map((item, i) => (
            <button
              role="tab"
              key={item.name}
              id={`chapter-tab-${i}`}
              aria-controls="chapter-panel"
              aria-selected={chapter === i}
              tabIndex={chapter === i ? 0 : -1}
              onClick={() => selectChapter(i as Chapter)}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowRight"
                    ? (i + 1) % 3
                    : e.key === "ArrowLeft"
                      ? (i + 2) % 3
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : null;
                if (next !== null) {
                  e.preventDefault();
                  selectChapter(next as Chapter);
                  (
                    e.currentTarget.parentElement?.children[next] as HTMLElement
                  )?.focus();
                }
              }}
            >
              <span>0{i + 1}</span>
              {item.name}
              <ArrowRight size={18} />
            </button>
          ))}
        </div>
        <button
          className="motion-toggle"
          aria-label="Pause animations"
          aria-pressed={paused || reducedMotion}
          disabled={reducedMotion}
          onClick={() => {
            setPaused(!paused);
            setPlaying(false);
            setTouring(false);
          }}
        >
          {paused || reducedMotion ? <Play size={15} /> : <Pause size={15} />}
          <span>Pause animations</span>
        </button>
      </div>
      <div className="lab-experience">
        <div
          className="lab-viewport"
          data-testid="lab-stage"
          data-ready={ready && !unavailable}
          data-fallback={unavailable}
          data-surface={surface}
          data-obstructed={isObstructed(obstacle)}
          data-progress={progress.toFixed(3)}
        >
          <WorldBoundary onFail={() => setUnavailable(true)}>
            <Suspense fallback={null}>
              <World
                chapter={chapter}
                surface={surface}
                obstacle={obstacle}
                failed={failed}
                progress={progress}
                running={running}
                reducedMotion={reducedMotion || paused}
                onReady={setReady}
                onFail={setUnavailable}
                onObstacle={(value) => {
                  setTouring(false);
                  setObstacle(value);
                }}
              />
            </Suspense>
          </WorldBoundary>
          {unavailable ? (
            <div className="lab-fallback">
              <img
                src={`/asset-previews/${chapter === 2 ? "panda" : "car"}.webp`}
                alt="Credited engineering asset preview"
              />
              <p>
                3D is unavailable. Explore the study using the controls and read
                the engineering work below.
              </p>
            </div>
          ) : (
            !ready && (
              <div className="lab-loading" role="status">
                <span className="loading-ring" /> Preparing the{" "}
                {content.name.toLowerCase()} study
              </div>
            )
          )}
        </div>
        <div
          className="chapter-console"
          id="chapter-panel"
          role="tabpanel"
          aria-labelledby={`chapter-tab-${chapter}`}
        >
          <span className="lab-kicker">{content.tag}</span>
          <h3>{content.title}</h3>
          <p className="chapter-description">{content.body}</p>
          <div
            className="chapter-controls"
            onPointerDownCapture={() => setTouring(false)}
            onKeyDownCapture={() => setTouring(false)}
          >
            {chapter === 0 && (
              <>
                <div
                  className="surface-controls"
                  role="group"
                  aria-label="Perception rendering"
                >
                  <button
                    aria-pressed={surface === "material"}
                    onClick={() => setSurface("material")}
                  >
                    <Box size={15} /> Material
                  </button>
                  <button
                    aria-pressed={surface === "scan"}
                    onClick={() => setSurface("scan")}
                  >
                    <ScanLine size={15} /> Machine view
                  </button>
                </div>
                <label className="lab-slider">
                  Obstacle position{" "}
                  <output aria-live="off">
                    {isObstructed(obstacle) ? "IN PATH" : "CLEAR"}
                  </output>
                  <input
                    aria-label="Obstacle position"
                    aria-valuetext={`${obstacle.toFixed(2)} units, ${isObstructed(obstacle) ? "in path" : "lane clear"}`}
                    aria-describedby="obstacle-help"
                    type="range"
                    min="-2.5"
                    max="2.5"
                    step=".05"
                    value={obstacle}
                    onChange={(e) => setObstacle(Number(e.target.value))}
                  />
                </label>
                <p
                  className={`signal-status ${isObstructed(obstacle) ? "caution" : ""}`}
                  role="status"
                >
                  <i />
                  {isObstructed(obstacle)
                    ? "Object detected. Trajectory blocked."
                    : "Lane clear. Trajectory available."}
                </p>
                <small id="obstacle-help">
                  Drag the amber object or use the slider. Arrow keys make small
                  adjustments; Home and End jump to either side.
                </small>
              </>
            )}
            {chapter === 1 && (
              <>
                <div className="lab-workers">
                  {workerShares(failed).map((share, i) => (
                    <button
                      key={i}
                      aria-label={`${failed === i ? "Recover" : "Disable"} lab worker ${i + 1}`}
                      aria-pressed={failed === i}
                      onClick={() => setFailed(failed === i ? null : i)}
                    >
                      <span>Worker {i + 1}</span>
                      <strong>
                        {share ? `${Math.round(share * 100)}%` : "OFF"}
                      </strong>
                      <i />
                    </button>
                  ))}
                </div>
                <p
                  className={`signal-status ${failed !== null ? "caution" : ""}`}
                  role="status"
                >
                  <i />
                  {failed === null
                    ? "Three workers online. Each receives one third of requests."
                    : `Worker 0${failed + 1} offline. Two paths active, each receiving 50%.`}
                </p>
                <small>
                  Click a worker to fail or recover it. Traffic is simulated.
                </small>
              </>
            )}
            {chapter === 2 && (
              <>
                <button
                  className="run-cycle"
                  disabled={unavailable || !ready}
                  onClick={() => {
                    if (reducedMotion) {
                      setProgress(progress < 1 ? 1 : 0);
                      return;
                    }
                    if (progress >= 1) setProgress(0);
                    setPaused(false);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                  {reducedMotion
                    ? "Show end / start pose"
                    : playing
                      ? "Pause cycle"
                      : progress >= 1
                        ? "Replay cycle"
                        : "Run pick & place"}
                  <ArrowUpRight size={16} />
                </button>
                <label className="lab-slider">
                  Cycle timeline{" "}
                  <output aria-live="off">{Math.round(progress * 100)}%</output>
                  <input
                    aria-label="Robot cycle timeline"
                    aria-valuetext={`${Math.round(progress * 100)} percent, ${actionPhase(progress)}`}
                    type="range"
                    min="0"
                    max="1"
                    step=".005"
                    value={progress}
                    disabled={unavailable || !ready}
                    onChange={(e) => {
                      setPlaying(false);
                      setProgress(Number(e.target.value));
                    }}
                  />
                </label>
                <p className="signal-status" role="status">
                  <i />
                  {actionPhase(progress)}
                </p>
                <small>
                  Source joint hierarchy. Offline kinematics, not live robotics.
                </small>
              </>
            )}
          </div>
          <div className="chapter-proof">
            <span>Related experience</span>
            <strong>{content.connection}</strong>
            <small>{content.proof}</small>
          </div>
        </div>
      </div>
      <div className="lab-footnote">
        <p>
          Simulations for illustration, not employer systems or a trained model.
          <br />
          <span>
            Models:{" "}
            <a
              href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept"
              target="_blank"
              rel="noreferrer"
            >
              Eric Chadwick / DGG (CC BY 4.0)
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/google-deepmind/mujoco_menagerie/tree/main/franka_emika_panda"
              target="_blank"
              rel="noreferrer"
            >
              Franka Emika / Menagerie (Apache 2.0)
            </a>
            .
          </span>
        </p>
        <button onClick={onInspect}>
          Open component explorer <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  );
}
