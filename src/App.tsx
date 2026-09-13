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
import Laboratory from "./lab/Laboratory";
import AppleExperience from "./experience/AppleExperience";

const ExhibitStudio = lazy(() => import("./exhibits/ExhibitStudio"));
const resumeHref = "/Chibundu_Awandu_Resume.pdf";
const work = [
  {
    id: "splunk",
    company: "Splunk",
    period: "2023",
    title: "Fleet security and configuration recovery",
    detail:
      "Remediated credential exposure across 40+ servers. Built a Ruby-based Puppet provider to improve compliance and make configuration recovery more reliable.",
    metric: "40+",
    label: "servers secured",
    tags: "SECURITY / INFRASTRUCTURE",
  },
  {
    id: "ecocar",
    company: "EcoCar EV Challenge",
    period: "2022 / 2023",
    title: "Pedestrian tracking for driver assistance",
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
          <span className="eyebrow">Engineering notes</span>
          <h2 id="systems-title">Designing for failure</h2>
        </div>
        <p>
          Remove a worker and inspect how its share is redistributed. A
          simplified model of redundancy, not a production scheduler.
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
                  <strong>Worker {i + 1}</strong>
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
              <h3>Distributed infrastructure</h3>
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
              <h3>Hardware foundations</h3>
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
  const [inspecting, setInspecting] = useState(
    () => window.location.hash === "#explorer",
  );
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
  useEffect(() => {
    const navigate = () => {
      if (window.location.hash === "#explorer" && !inspecting) {
        setLoadedCount(0);
        setRenderError(false);
        setInspecting(true);
      }
      if (
        window.location.hash === "#laboratory" ||
        window.location.hash === "#top"
      )
        setInspecting(false);
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, [inspecting]);
  useEffect(() => {
    if (
      window.location.hash === "#explorer" ||
      window.location.hash === "#laboratory"
    ) {
      const id = window.location.hash.slice(1);
      const frame = requestAnimationFrame(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "instant" });
        element?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [inspecting]);
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
      <a className="skip-link" href="#engineer">
        Skip to work experience
      </a>
      <header className="site-header portfolio-header">
        <a className="wordmark" href="#top" aria-label="Chibundu Awandu home">
          <span className="brand-mark">ca.</span>
          <span>
            Chibundu Awandu<small>Software Engineer · Austin, TX</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#engineer">My work</a>
          <a href="#laboratory">Interactive lab</a>
          <a href="#connect">
            Contact <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <main id="top" className="portfolio-main" tabIndex={-1}>
        <section className="portfolio-intro" aria-labelledby="portfolio-title">
          <div>
            <p className="portfolio-role">Software Engineer at Apple</p>
            <h1 id="portfolio-title">
              Chibundu
              <br />
              Awandu<span aria-hidden="true">.</span>
            </h1>
          </div>
          <div className="portfolio-summary">
            <p>
              I build backend systems for AI products, with a background in
              infrastructure security and computer vision.
            </p>
            <div className="portfolio-actions">
              <a className="primary-link" href="#engineer">
                Explore my Apple work <ArrowDown size={17} />
              </a>
              <a href={resumeHref} target="_blank" rel="noreferrer">
                Resume <span className="link-detail">PDF</span>
                <ArrowUpRight size={17} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
          <nav className="experience-index" aria-label="Experience at a glance">
            <a href="#work-apple">
              <strong>Apple</strong>
              <span>GenAI backend / 2024–present</span>
            </a>
            <a href="#work-splunk">
              <strong>Splunk</strong>
              <span>Infrastructure security / 2023</span>
            </a>
            <a href="#work-ecocar">
              <strong>EcoCar</strong>
              <span>Computer vision / 2022–2023</span>
            </a>
          </nav>
        </section>
        <AppleExperience />
        {!inspecting ? (
          <Laboratory
            reducedMotion={reducedMotion}
            onInspect={() => {
              setLoadedCount(0);
              setRenderError(false);
              setInspecting(true);
              window.location.hash = "explorer";
            }}
          />
        ) : (
          <>
            <div className="experience-switch">
              <button
                onClick={() => {
                  setInspecting(false);
                  window.location.hash = "laboratory";
                }}
              >
                <ArrowDown size={14} /> Return to Intelligence in Motion
              </button>
              <span>DEEP DIVE / SOURCE ASSET EXPLORER</span>
            </div>
            <section className="exhibit" aria-labelledby="hero-title">
              <div className="exhibit-intro">
                <div>
                  <span className="eyebrow">
                    <span className="live-dot" /> THE SYSTEMS COLLECTION / VOL.
                    01
                  </span>
                  <h2 id="hero-title">Component explorer</h2>
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
              <div className="explorer" id="explorer" tabIndex={-1}>
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
                      {(
                        ["Perspective", "Front", "Side", "Top"] as ViewAngle[]
                      ).map((view) => (
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
                      ))}
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
                  <div
                    className="parts-list"
                    role="group"
                    aria-label="Selectable components"
                  >
                    {results.map((p) => (
                      <button
                        key={p.id}
                        className="part-row"
                        aria-pressed={selected === p.id}
                        onClick={() => selectPart(p.id)}
                      >
                        <span>
                          {String(exhibit.parts.indexOf(p) + 1).padStart(
                            2,
                            "0",
                          )}
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
          </>
        )}
        <section
          className="engineer-section"
          id="earlier-work"
          tabIndex={-1}
          aria-labelledby="engineer-title"
        >
          <div className="engineer-intro">
            <span className="eyebrow">Earlier experience</span>
            <h2 id="engineer-title">Security and perception</h2>
            <p>
              Before Apple, I worked on infrastructure security at Splunk and
              vision-based driver assistance in the EcoCar EV Challenge.
            </p>
            <p>
              These summaries describe my contributions. The interactive lab is
              a separate personal study built with credited public models.
            </p>
            <a
              className="outline-button"
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
            >
              Read my resume <ArrowUpRight size={16} />
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </div>
          <div className="work-list">
            {work.map((item) => (
              <article
                className="work-item"
                id={`work-${item.id}`}
                tabIndex={-1}
                key={item.company}
              >
                <div className="work-header">
                  <span>{item.company}</span>
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
        <SystemsStudy />
        <section className="practice-strip">
          <div>
            <span className="eyebrow">Education</span>
            <strong>Computer Engineering, B.S.</strong>
            <p>Bethune-Cookman University / 4.0 GPA / Summa Cum Laude</p>
          </div>
          <div>
            <span className="eyebrow">Independent research</span>
            <strong>Quantitative strategies</strong>
            <p>
              Kelly sizing, mean reversion, momentum, and AdaBoost. Research and
              simulated strategy results, not live trading performance.
            </p>
          </div>
        </section>
        <section
          className="contact-section"
          id="connect"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <span className="eyebrow">Contact</span>
          <h2 id="contact-title">Let's talk engineering.</h2>
          <p>
            For conversations about backend systems, AI infrastructure, or
            computer vision.
          </p>
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
        <span>AUSTIN, TEXAS</span>
        <a href="#top">Back to top</a>
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
