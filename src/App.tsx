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
    title: "Fleet security and configuration recovery.",
    detail:
      "Remediated credential exposure across more than 40 servers and built a Ruby-based Puppet provider that improved compliance and made configuration recovery more reliable.",
    metric: "40+",
    label: "servers secured",
  },
  {
    id: "ecocar",
    company: "EcoCar EV Challenge",
    period: "2022–2023",
    title: "Pedestrian tracking for driver assistance.",
    detail:
      "Integrated driver-assistance features with C++ and ROS 2, and built YOLO-based pedestrian tracking in Python and TensorFlow.",
    metric: "35%",
    label: "better detection accuracy",
  },
];

const highlights = [
  {
    value: "0",
    label:
      "downtime across a four-service identity migration, shipped in five days.",
    tone: "feature",
  },
  {
    value: "10",
    label:
      "build, runtime, security, and CI failures resolved to ship the team's first Java 25 service.",
  },
  { value: "40+", label: "servers secured at Splunk.", tone: "dark" },
  { value: "35%", label: "better pedestrian detection for EcoCar." },
  { value: "4.0", label: "GPA in Computer Engineering, summa cum laude." },
];

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
      <header className="site-nav">
        <div className="site-nav-inner">
          <a className="wordmark" href="#top" aria-label="Chibundu Awandu home">
            Chibundu Awandu
          </a>
          <nav aria-label="Main navigation">
            <a href="#engineer">Work</a>
            <a href="#laboratory">Lab</a>
            <a className="nav-optional" href="#about">
              About
            </a>
            <a href="#connect">Contact</a>
            <a
              className="nav-pill"
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
            >
              Résumé
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </nav>
        </div>
      </header>
      <main id="top" className="portfolio-main" tabIndex={-1}>
        <section className="hero" aria-labelledby="portfolio-title">
          <p className="hero-kicker">Software Engineer at Apple</p>
          <h1 id="portfolio-title">Chibundu Awandu</h1>
          <p className="hero-lede">
            I build the backend systems that bring AI into everyday tools,{" "}
            <span>and the infrastructure that keeps them dependable.</span>
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#engineer">
              See my work
            </a>
            <a
              className="text-link"
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
            >
              Read my résumé <ChevronRight size={18} aria-hidden="true" />
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </div>
        </section>
        <section className="highlights" aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="section-title">
            The highlights.
          </h2>
          <ul className="highlight-grid">
            {highlights.map((item) => (
              <li
                key={item.label}
                className={`highlight-tile${item.tone ? ` is-${item.tone}` : ""}`}
              >
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="footnote-ref">
            Figures are from my résumé and describe my own contributions.
          </p>
        </section>
        <AppleExperience />
        <section
          className="engineer-section"
          id="earlier-work"
          tabIndex={-1}
          aria-labelledby="engineer-title"
        >
          <div className="section-header">
            <h2 id="engineer-title" className="section-title">
              Before Apple.
            </h2>
            <p>
              Infrastructure security at Splunk, and computer vision for driver
              assistance in the EcoCar EV Challenge.
            </p>
          </div>
          <div className="work-list">
            {work.map((item) => (
              <article
                className="work-item"
                id={`work-${item.id}`}
                tabIndex={-1}
                key={item.company}
              >
                <p className="work-header">
                  <span>{item.company}</span>
                  <span>{item.period}</span>
                </p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div className="work-metric">
                  <strong>{item.metric}</strong>
                  <span>{item.label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
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
                <ArrowDown size={14} /> Back to the lab
              </button>
            </div>
            <section className="exhibit" aria-labelledby="hero-title">
              <div className="exhibit-intro">
                <div>
                  <span className="eyebrow">The lab</span>
                  <h2 id="hero-title">Component explorer</h2>
                </div>
                <div className="intro-note">
                  <p>
                    Take a car and three robots apart, one assembly at a time.
                  </p>
                  <a href="#explorer">
                    Open the explorer <ArrowDown size={16} />
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
                        ? "Static preview"
                        : loadedCount
                          ? "Interactive 3D"
                          : "Loading"}
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
                        <label htmlFor="explode">Separation</label>
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
                    <span>Drag to orbit. Pinch to zoom.</span>
                    <span>{exhibit.parts.length} assemblies</span>
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
                    <span className="eyebrow">Why it's here</span>
                    <p>{exhibit.connection}</p>
                  </div>
                  <div className="anatomy-heading">
                    <span>Components</span>
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
          className="about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <h2 id="about-title" className="section-title">
            About.
          </h2>
          <div className="about-body">
            <p className="about-lede">
              I'm a software engineer in Austin. I like problems where the
              system has to stay correct when things go wrong: retries,
              duplicate work, partial failures, migrations under live traffic.
            </p>
            <dl className="about-facts">
              <div>
                <dt>Education</dt>
                <dd>
                  B.S. Computer Engineering, Bethune-Cookman University. 4.0
                  GPA, summa cum laude.
                </dd>
              </div>
              <div>
                <dt>Independent research</dt>
                <dd>
                  Quantitative strategies: Kelly sizing, mean reversion,
                  momentum, and AdaBoost, tested in simulation.
                </dd>
              </div>
              <div>
                <dt>Tools I reach for</dt>
                <dd>
                  Java, Spring Boot, WebFlux, MongoDB, Python, C++, ROS 2,
                  TypeScript, Three.js.
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section
          className="contact-section"
          id="connect"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">Say hello.</h2>
          <p>
            I'm happy to talk about backend systems, AI infrastructure, or
            computer vision.
          </p>
          <a className="email-link" href="mailto:chibunduawandu@gmail.com">
            chibunduawandu@gmail.com
          </a>
          <div className="social-links">
            <a
              href="https://github.com/ChibunduAwandu"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/chibundu-awandu-013a78201/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a href={resumeHref} target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <ol className="footnotes">
          <li>
            Career figures are self-reported in my résumé and describe my own
            contributions. They are not independently verified benchmarks.
          </li>
          <li>
            Interactive diagrams are my own explanatory models, not Apple
            documentation, internal systems, or an endorsed presentation.
          </li>
          <li>
            Lab models are credited public assets used under their licenses.
            They are not my hardware designs. Credits are in the component
            explorer.
          </li>
        </ol>
        <div className="footer-bar">
          <span>© {new Date().getFullYear()} Chibundu Awandu</span>
          <span>Austin, Texas</span>
          <a href="#top">Back to top</a>
        </div>
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
          <h2>Credits and controls</h2>
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
            Inter, SIL Open Font License.
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
