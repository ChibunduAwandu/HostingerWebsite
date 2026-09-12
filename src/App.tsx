import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  ChevronRight,
  Eye,
  Focus,
  Layers3,
  RotateCcw,
  Search,
  Sun,
  X,
} from "lucide-react";
import { exhibits, type ExhibitId } from "./exhibits/catalog";
import type { ViewAngle } from "./exhibits/ExhibitStudio";

const ExhibitStudio = lazy(() => import("./exhibits/ExhibitStudio"));
const resumeHref = "/Chibundu_Awandu_Resume.pdf";
const work = [
  {
    company: "Apple",
    period: "2024 / PRESENT",
    title: "Intelligence, built for production.",
    detail:
      "Built a greenfield GenAI backend with Java, Spring Boot, WebFlux, and MongoDB. Five synchronous and streaming APIs support conversational AI, autofill, and summarization.",
    metric: "5",
    label: "production API endpoints",
    tags: "BACKEND / GENERATIVE AI",
  },
  {
    company: "Splunk",
    period: "2023",
    title: "Reliability across the fleet.",
    detail:
      "Remediated credential exposure across 40+ servers. Built a Ruby-based Puppet provider to improve compliance and make configuration recovery more reliable.",
    metric: "40+",
    label: "servers secured",
    tags: "SECURITY / INFRASTRUCTURE",
  },
  {
    company: "EcoCar EV Challenge",
    period: "2022 / 2023",
    title: "From pixels to perception.",
    detail:
      "Integrated ADAS with C++ and ROS 2. Developed YOLO-based pedestrian tracking with Python and TensorFlow, reporting a 35% detection-accuracy improvement.",
    metric: "35%",
    label: "detection accuracy improvement",
    tags: "COMPUTER VISION / AUTONOMY",
  },
];

function SystemsStudy() {
  const [failed, setFailed] = useState<number | null>(null);
  return (
    <section
      className="systems-section"
      id="systems"
      aria-labelledby="systems-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / BENEATH THE INTERFACE</span>
          <h2 id="systems-title">
            Invisible work.
            <br />
            <em>Visible consequences.</em>
          </h2>
        </div>
        <p>
          Good systems keep working when a component doesn't. A small,
          illustrative study in resilience.
        </p>
      </div>
      <div className="systems-grid">
        <div className="routing-study">
          <div className="panel-heading">
            <span>FAILOVER SANDBOX</span>
            <span className="demo-tag">ILLUSTRATIVE / NOT LIVE</span>
          </div>
          <div className="routing-diagram">
            <div className="request-node">
              Incoming work <ArrowDown size={16} />
            </div>
            <div className="routing-line" />
            <div className="workers">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={failed === i ? "worker offline" : "worker"}
                  aria-pressed={failed === i}
                  aria-label={`${failed === i ? "Recover" : "Fail"} worker ${i + 1}`}
                  onClick={() => setFailed(failed === i ? null : i)}
                >
                  <span className="worker-light" />
                  <strong>WORKER 0{i + 1}</strong>
                  <span>
                    {failed === i
                      ? "Offline"
                      : failed === null
                        ? "33.3% share"
                        : "50% share"}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="routing-status" role="status">
            {failed === null
              ? "All workers available. Click one to simulate a failure."
              : `Worker 0${failed + 1} is offline. Work is redistributed to the two healthy workers. Click it again to recover.`}
          </p>
          <p className="small-note">
            A conceptual visualization, not Apple infrastructure or a production
            scheduler. My related work includes atomic record claims, batching,
            circuit breakers, and eliminating duplicate pod work.
          </p>
        </div>
        <div className="compute-assets">
          <article>
            <img
              loading="lazy"
              src="/asset-previews/server.webp"
              alt="Public 3D server rack asset preview by Shalmon"
            />
            <div>
              <span className="eyebrow">INFRASTRUCTURE</span>
              <h3>Think beyond one machine.</h3>
              <p>Distributed processing, fleet security, resilient APIs.</p>
              <a
                href="https://sketchfab.com/3d-models/server-rack-c144d837358d446998c7b63cd1bdf825"
                target="_blank"
                rel="noreferrer"
              >
                Shalmon / CC BY 4.0 <ArrowUpRight size={12} />
              </a>
            </div>
          </article>
          <article>
            <img
              loading="lazy"
              src="/asset-previews/board.webp"
              alt="Public motherboard asset preview by ARComputerFundamentals"
            />
            <div>
              <span className="eyebrow">COMPUTER ENGINEERING</span>
              <h3>Understand the whole stack.</h3>
              <p>Hardware foundations. Software at scale.</p>
              <a
                href="https://sketchfab.com/3d-models/motherboard-3d-model-99a5f94e130a41c48590d59877f08663"
                target="_blank"
                rel="noreferrer"
              >
                ARComputerFundamentals / CC BY 4.0 <ArrowUpRight size={12} />
              </a>
            </div>
          </article>
          <p className="preview-note">
            Credited asset previews, not interactive models.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [assetId, setAssetId] = useState<ExhibitId>("car");
  const exhibit = exhibits.find((e) => e.id === assetId)!;
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [isolated, setIsolated] = useState(false);
  const [angle, setAngle] = useState<ViewAngle>("Perspective");
  const [dark, setDark] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [query, setQuery] = useState("");
  const [loadedCount, setLoadedCount] = useState(0);
  const [renderError, setRenderError] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleError = useCallback(() => setRenderError(true), []);
  const currentPart = exhibit.parts.find((p) => p.id === selected);
  const results = exhibit.parts.filter((p) =>
    `${p.name} ${p.family}`.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleCount =
    isolated && currentPart ? 1 : exhibit.parts.length - hidden.length;
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (dialog) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [dialog]);
  const reset = () => {
    setAmount(0);
    setSelected(null);
    setIsolated(false);
    setHidden([]);
    setQuery("");
    setAngle("Perspective");
    setRotating(false);
    setResetToken((t) => t + 1);
    setStatus("Exhibit reset. All assemblies visible.");
  };
  const switchExhibit = (id: ExhibitId) => {
    if (id === assetId) return;
    reset();
    setAssetId(id);
    setLoadedCount(0);
    setRenderError(false);
  };
  const selectPart = (id: string) => {
    setSelected(id);
    setHidden((h) => h.filter((p) => p !== id));
    setStatus(`${exhibit.parts.find((p) => p.id === id)?.name} selected.`);
  };
  return (
    <>
      <a className="skip-link" href="#explorer">
        Skip to exhibit controls
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Chibundu Awandu home">
          <span className="brand-mark">ca.</span>
          <span>
            CHIBUNDU AWANDU<small>SOFTWARE ENGINEER / AUSTIN, TX</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#explorer">
            Explore <span>01</span>
          </a>
          <a href="#engineer">
            My work <span>03</span>
          </a>
          <a href="#connect">
            Let's talk <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <main id="top">
        <section className="exhibit" aria-labelledby="hero-title">
          <div className="exhibit-intro">
            <div>
              <span className="eyebrow">
                <span className="live-dot" /> THE SYSTEMS COLLECTION / VOL. 01
              </span>
              <h1 id="hero-title">
                Built to think.
                <br />
                <em>Made to move.</em>
              </h1>
            </div>
            <div className="intro-note">
              <span className="eyebrow">
                CHIBUNDU AWANDU / ENGINEER AT APPLE
              </span>
              <p>
                I build intelligent software.
                <br />
                This is a closer look at the world it can move.
              </p>
              <a href="#explorer">
                Step inside the collection <ArrowDown size={16} />
              </a>
            </div>
          </div>
          <div
            className="collection-tabs"
            role="group"
            aria-label="Choose an exhibit"
          >
            {exhibits.map((e) => (
              <button
                key={e.id}
                aria-pressed={assetId === e.id}
                onClick={() => switchExhibit(e.id)}
              >
                <span className="tab-number">{e.number}</span>
                <span>
                  {e.subtitle}
                  <small>{e.category}</small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <div className="explorer" id="explorer">
            <div className={`stage-column ${dark ? "dark-stage" : ""}`}>
              <div className="stage-meta">
                <span>
                  <span className="live-dot" />{" "}
                  {renderError
                    ? "STATIC PREVIEW"
                    : loadedCount
                      ? "INTERACTIVE 3D"
                      : "LOADING ASSET"}
                </span>
                <span>
                  {exhibit.number} / {exhibit.subtitle}
                </span>
              </div>
              <div
                className="stage-view"
                data-testid="exhibit-stage"
                data-ready={loadedCount > 0 || renderError}
                data-parts={loadedCount}
                data-asset={assetId}
              >
                <Suspense fallback={null}>
                  <ExhibitStudio
                    exhibit={exhibit}
                    amount={amount}
                    selected={selected}
                    isolated={isolated}
                    hidden={hidden}
                    reducedMotion={reducedMotion}
                    onSelect={selectPart}
                    onReady={setLoadedCount}
                    onError={handleError}
                    angle={angle}
                    resetToken={resetToken}
                    rotating={rotating}
                    dark={dark}
                  />
                </Suspense>
                {!loadedCount && !renderError && (
                  <div className="stage-loading" role="status">
                    <span className="loading-ring" />
                    <span>
                      Preparing {exhibit.subtitle}
                      <small>Optimized asset / {exhibit.size}</small>
                    </span>
                  </div>
                )}
                {visibleCount === 0 && (
                  <div className="empty-stage">
                    All assemblies hidden.
                    <button onClick={() => setHidden([])}>
                      Show all parts
                    </button>
                  </div>
                )}
              </div>
              <div className="assembly-bar">
                <button
                  className="explode-button"
                  disabled={renderError}
                  aria-pressed={amount > 0}
                  onClick={() => {
                    setIsolated(false);
                    setAmount(amount > 0 ? 0 : 1);
                  }}
                >
                  <Layers3 size={18} />
                  {amount > 0 ? "Reassemble" : "Explode model"}
                  <ArrowUpRight size={16} />
                </button>
                <div className="explode-range">
                  <div>
                    <label htmlFor="explode">THE SUM OF ITS PARTS</label>
                    <output htmlFor="explode">
                      {Math.round(amount * 100)}%
                    </output>
                  </div>
                  <input
                    id="explode"
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(amount * 100)}
                    disabled={renderError}
                    aria-label="Assembly separation"
                    onChange={(e) => {
                      setIsolated(false);
                      setAmount(Number(e.target.value) / 100);
                    }}
                  />
                </div>
              </div>
              <div className="view-tools">
                <div
                  className="view-presets"
                  role="group"
                  aria-label="Viewing angle"
                >
                  {(["Perspective", "Front", "Side", "Top"] as ViewAngle[]).map(
                    (view) => (
                      <button
                        key={view}
                        disabled={renderError}
                        aria-pressed={view === angle}
                        onClick={() => {
                          setAngle(view);
                          setResetToken((t) => t + 1);
                        }}
                      >
                        {view}
                      </button>
                    ),
                  )}
                </div>
                <div className="icon-tools">
                  <button
                    onClick={() => setRotating((r) => !r)}
                    aria-label="Auto rotate model"
                    aria-pressed={rotating}
                    disabled={reducedMotion || renderError}
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setDark((d) => !d)}
                    aria-label="Toggle studio lighting"
                    aria-pressed={dark}
                    disabled={renderError}
                  >
                    <Sun size={17} />
                  </button>
                  <button onClick={reset} aria-label="Reset exhibit">
                    <Focus size={17} />
                  </button>
                </div>
              </div>
              <div className="stage-caption">
                <span>DRAG TO ORBIT / PINCH TO ZOOM</span>
                <span>{exhibit.parts.length} INSPECTABLE ASSEMBLIES</span>
              </div>
            </div>
            <aside
              className="inspector"
              aria-label="Exhibit information and components"
            >
              <div className="panel-heading">
                <span>{exhibit.category}</span>
                <Box size={16} />
              </div>
              <h2>{exhibit.name}</h2>
              <p className="exhibit-description">{exhibit.story}</p>
              <div className="resume-connection">
                <span className="eyebrow">THE CONNECTION</span>
                <p>{exhibit.connection}</p>
              </div>
              <div className="anatomy-heading">
                <span>ANATOMY INDEX</span>
                <span>{exhibit.parts.length}</span>
              </div>
              <label className="search-field">
                <Search size={16} />
                <input
                  aria-label="Search components"
                  placeholder="Find a component"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <div className="parts-list" aria-label="Selectable components">
                {results.map((p) => (
                  <button
                    key={p.id}
                    className="part-row"
                    aria-pressed={selected === p.id}
                    onClick={() => selectPart(p.id)}
                  >
                    <span>
                      {String(exhibit.parts.indexOf(p) + 1).padStart(2, "0")}
                    </span>
                    <span>{p.name}</span>
                    <ChevronRight size={13} />
                  </button>
                ))}
                {!results.length && (
                  <p className="no-results">No matching components.</p>
                )}
              </div>
              {currentPart && (
                <div className="selected-part">
                  <div>
                    <strong>{currentPart.name}</strong>
                    <button
                      aria-label="Clear selection"
                      onClick={() => {
                        setSelected(null);
                        setIsolated(false);
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <span>{currentPart.family} / source mesh assembly</span>
                  <div className="part-actions">
                    <button
                      aria-pressed={isolated}
                      disabled={renderError}
                      onClick={() => setIsolated((i) => !i)}
                    >
                      <Focus size={14} />
                      {isolated ? "Show all" : "Isolate"}
                    </button>
                    <button
                      disabled={renderError}
                      onClick={() => {
                        setHidden((h) => [...h, currentPart.id]);
                        setSelected(null);
                        setIsolated(false);
                      }}
                    >
                      <Eye size={14} />
                      Hide
                    </button>
                  </div>
                </div>
              )}
              <div className="index-footer">
                <span>
                  {visibleCount} / {exhibit.parts.length} visible
                </span>
                <button
                  onClick={() => {
                    setHidden([]);
                    setIsolated(false);
                  }}
                >
                  Show all
                </button>
              </div>
            </aside>
          </div>
          <div className="study-links">
            <p>
              {exhibit.subtitle} by {exhibit.credit}.{" "}
              <a href={exhibit.licenseUrl} target="_blank" rel="noreferrer">
                {exhibit.license}
              </a>
              . Adapted for this exhibit.
            </p>
            <button onClick={() => setDialog(true)}>
              Credits & how to explore <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
        <SystemsStudy />
        <section
          className="engineer-section"
          id="engineer"
          aria-labelledby="engineer-title"
        >
          <div className="engineer-intro">
            <span className="eyebrow">03 / THE WORK BEHIND THE WONDER</span>
            <h2 id="engineer-title">
              Not just a<br />
              <em>pretty interface.</em>
            </h2>
            <p>
              I'm Chibundu, a software engineer at Apple. I work where
              intelligent software meets the discipline of dependable systems.
            </p>
            <p>
              The exhibits are public assets. The engineering experience below
              is mine, drawn from my resume.
            </p>
            <a
              className="outline-button"
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
            >
              Explore my resume <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="work-list">
            {work.map((item, i) => (
              <article className="work-item" key={item.company}>
                <div className="work-header">
                  <span>
                    0{i + 1} / {item.company}
                  </span>
                  <span>{item.period}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div className="work-bottom">
                  <div className="work-metric">
                    <strong>{item.metric}</strong>
                    <span>{item.label}</span>
                  </div>
                  <span className="work-tags">{item.tags}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="practice-strip">
          <div>
            <span className="eyebrow">THE FOUNDATION</span>
            <strong>Computer Engineering, B.S.</strong>
            <p>Bethune-Cookman University / 4.0 GPA / Summa Cum Laude</p>
          </div>
          <div>
            <span className="eyebrow">ANOTHER EXPERIMENT</span>
            <strong>Markets as a system.</strong>
            <p>
              Kelly sizing, mean reversion, momentum, and AdaBoost. Research and
              simulated strategy results, not live trading performance.
            </p>
          </div>
        </section>
        <section className="contact-section" id="connect">
          <span className="eyebrow">
            04 / THE NEXT INTERFACE IS A CONVERSATION
          </span>
          <h2>
            Something worth
            <br />
            <em>building together?</em>
          </h2>
          <a className="email-link" href="mailto:chibunduawandu@gmail.com">
            chibunduawandu@gmail.com <ArrowUpRight />
          </a>
          <div className="social-links">
            <a
              href="https://github.com/ChibunduAwandu"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/chibundu-awandu-013a78201/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href={resumeHref} target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} CHIBUNDU AWANDU</span>
        <span>CURIOUS BY DESIGN. PRECISE BY PRACTICE.</span>
        <a href="#top">Back to the collection</a>
      </footer>
      <div className="sr-only" role="status" aria-live="polite">
        {status}
      </div>
      <dialog
        ref={dialogRef}
        className="notes-dialog"
        aria-label="Credits and explorer instructions"
        onCancel={() => setDialog(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialog(false);
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label="Close notes"
            onClick={() => setDialog(false)}
          >
            <X size={22} />
          </button>
          <span className="eyebrow">OPEN ASSETS / ORIGINAL INTERACTIONS</span>
          <h2>Built on shared knowledge.</h2>
          <p>
            Drag to orbit, pinch or scroll to zoom. The separation slider moves
            source mesh assemblies, not every internal component. Select a part
            from the searchable index or the model, then isolate or hide it. All
            controls work with a keyboard; arrow keys adjust the slider. Motion
            follows your system preference.
          </p>
          <p>
            Robot geometry is converted from MuJoCo Menagerie visual meshes into
            a fixed reference pose. No physics engine, live inference, hidden
            motor internals, or manufacturer CAD completeness is implied.
            Exploded spacing is illustrative, not a disassembly guide.
          </p>
          <ul>
            {exhibits.map((e) => (
              <li key={e.id}>
                <a href={e.source} target="_blank" rel="noreferrer">
                  {e.subtitle} / {e.credit} <ArrowUpRight size={13} />
                </a>
                <small>
                  <a href={e.licenseUrl} target="_blank" rel="noreferrer">
                    {e.license}
                  </a>{" "}
                  / converted, grouped, compressed, and staged.
                </small>
              </li>
            ))}
          </ul>
          <p>
            Server Rack: Shalmon. MotherBoard 3d Model: ARComputerFundamentals.
            Both credited previews are CC BY 4.0; source links appear beside
            each image. Preview images are resized and compressed.
          </p>
          <p>
            Interaction reference:{" "}
            <a
              href="https://github.com/ashemag/human-atlas"
              target="_blank"
              rel="noreferrer"
            >
              Human Atlas by ashemag
            </a>
            . No application code or anatomy assets were copied. Local fonts:
            Manrope and IBM Plex Mono, SIL Open Font License.
          </p>
          <p className="small-note">
            Independent portfolio. No endorsement by the asset creators,
            manufacturers, Khronos, or employers is implied. Khronos and 3D
            Commerce marks on the concept car remain their owners' trademarks.
            Career metrics are self-reported in the supplied resume.
          </p>
        </div>
      </dialog>
    </>
  );
}
