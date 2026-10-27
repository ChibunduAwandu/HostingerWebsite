import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Database,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import {
  appleStories,
  claimRecord,
  requestPhase,
  type AppleStory,
  type ClaimState,
  type ResponseMode,
} from "./apple.data";

function FlowLink({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`apple-flow-link ${active ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <ArrowRight size={20} />
    </div>
  );
}

function RequestStudy() {
  const [mode, setMode] = useState<ResponseMode>("streaming");
  const [step, setStep] = useState(0);
  return (
    <div
      className="apple-study"
      data-testid="apple-request-study"
      data-step={step}
      data-mode={mode}
    >
      <div className="apple-board-heading">
        <span>Streaming versus synchronous responses</span>
      </div>
      <div
        className="apple-mode-switch"
        role="group"
        aria-label="Example response mode"
      >
        {(["streaming", "synchronous"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={mode === value}
            onClick={() => {
              setMode(value);
              setStep(0);
            }}
          >
            {value === "streaming" ? "Streaming / SSE" : "Synchronous"}
          </button>
        ))}
      </div>
      <figure className="apple-request-figure">
        <div className="apple-request-path">
          <div
            className={`apple-node apple-client ${step === 1 ? "is-active" : ""}`}
          >
            <span className="apple-node-label">Input</span>
            <div className="apple-client-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <strong>Advisor tools</strong>
            <span>Example request</span>
          </div>
          <FlowLink active={step >= 1} />
          <div className="apple-service-stack">
            <div
              className={`apple-node apple-service ${step >= 1 ? "is-active" : ""}`}
            >
              <span className="apple-node-label">Service boundary</span>
              <strong>GenAI backend</strong>
              <span>Java / Spring Boot / WebFlux</span>
              <div className="apple-ports" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <i
                    key={i}
                    className={step >= 1 && i === 0 ? "is-active" : ""}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </i>
                ))}
              </div>
              <span className="apple-port-caption">5 API endpoints</span>
            </div>
            <div className="apple-persistence">
              <Database size={18} />
              <span>
                <strong>MongoDB</strong>Persistence
              </span>
            </div>
          </div>
          <FlowLink active={step >= 2} />
          <div
            className={`apple-node apple-response ${step >= 2 ? "is-active" : ""}`}
          >
            <span className="apple-node-label">Output</span>
            <strong>
              {mode === "streaming" ? "Event stream" : "Single response"}
            </strong>
            <div className="apple-events" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <i
                  key={i}
                  className={
                    step === 3 ||
                    (step === 2 && mode === "streaming" && i === 0)
                      ? "is-received"
                      : ""
                  }
                />
              ))}
            </div>
            <span>
              {step === 3
                ? "Complete result"
                : step === 2 && mode === "streaming"
                  ? "Partial result available"
                  : "Awaiting result"}
            </span>
          </div>
        </div>
      </figure>
      <div className="apple-trace-controls">
        <button
          className="apple-primary-control"
          onClick={() => setStep((value) => Math.min(3, value + 1))}
          disabled={step === 3}
        >
          Advance request <ArrowRight size={17} />
        </button>
        <button onClick={() => setStep(0)} disabled={step === 0}>
          <RotateCcw size={16} /> Reset request
        </button>
        <span className="apple-step-count">Step {step} / 3</span>
      </div>
      <p className="apple-live-status" role="status">
        {requestPhase(step, mode)}
      </p>
    </div>
  );
}

function ProcessingStudy() {
  const [claim, setClaim] = useState<ClaimState>({
    owner: null,
    attempt: null,
  });
  const rejected = claim.attempt !== null && claim.owner !== claim.attempt;
  return (
    <div
      className="apple-study"
      data-testid="apple-processing-study"
      data-owner={claim.owner ?? "none"}
    >
      <div className="apple-board-heading">
        <span>Database work, before and after</span>
      </div>
      <figure className="apple-query-comparison">
        <div>
          <div className="apple-query-count">
            <strong>~100</strong>
            <span>Sequential round-trips</span>
          </div>
          <div className="apple-query-grid" aria-hidden="true">
            {Array.from({ length: 100 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <FlowLink active />
        <div>
          <div className="apple-query-count">
            <strong>Bulk</strong>
            <span>Operations instead of a loop</span>
          </div>
          <div className="apple-bulk-operation" aria-hidden="true">
            <Database size={30} />
            <span>One bulk operation</span>
          </div>
        </div>
      </figure>
      <div className="apple-claim-heading">
        <h4>One record. One owner.</h4>
        <span>
          <LockKeyhole size={15} /> Atomic claim study
        </span>
      </div>
      <div
        className="apple-claim-workers"
        role="group"
        aria-label="Claim the example record"
      >
        {[0, 1, 2].map((worker) => (
          <button
            key={worker}
            onClick={() => setClaim((state) => claimRecord(state, worker))}
            aria-pressed={claim.owner === worker}
          >
            <span>Worker {worker + 1}</span>
            <strong>{claim.owner === worker ? "Owner" : "Try claim"}</strong>
            {claim.owner === worker && <Check size={17} />}
          </button>
        ))}
      </div>
      <p
        className={`apple-live-status ${rejected ? "is-rejected" : ""}`}
        role="status"
      >
        {claim.owner === null
          ? "The example record is unclaimed. Choose a worker."
          : rejected
            ? `Worker ${claim.attempt! + 1} cannot claim this record. Worker ${claim.owner + 1} already owns it; duplicate processing is prevented in this model.`
            : `Worker ${claim.owner + 1} owns the record. Try another worker to see the ownership rule.`}
      </p>
      <button
        className="apple-reset-claim"
        disabled={claim.owner === null}
        onClick={() => setClaim({ owner: null, attempt: null })}
      >
        <RotateCcw size={16} /> Reset record
      </button>
    </div>
  );
}

function DeliveryStudy() {
  const [profile, setProfile] = useState<"legacy" | "new">("legacy");
  return (
    <div
      className="apple-study"
      data-testid="apple-delivery-study"
      data-profile={profile}
    >
      <div className="apple-board-heading">
        <span>One entry point, two pipelines</span>
      </div>
      <div
        className="apple-mode-switch"
        role="group"
        aria-label="Illustrative deployment profile"
      >
        <button
          aria-pressed={profile === "legacy"}
          onClick={() => setProfile("legacy")}
        >
          Legacy profile
        </button>
        <button
          aria-pressed={profile === "new"}
          onClick={() => setProfile("new")}
        >
          New profile
        </button>
      </div>
      <figure className="apple-profile-figure">
        <div className="apple-deploy-origin">
          <span className="apple-node-label">Shared entry point</span>
          <strong>One deployment command</strong>
          <span>Configuration selects the pipeline</span>
        </div>
        <div className="apple-release-paths">
          {(["legacy", "new"] as const).map((value) => (
            <div
              className={`apple-release-path ${profile === value ? "is-active" : ""}`}
              key={value}
            >
              <span className="apple-release-line" aria-hidden="true" />
              <div>
                <strong>
                  {value === "legacy" ? "Legacy pipeline" : "New pipeline"}
                </strong>
                <span>
                  {profile === value
                    ? "Selected profile"
                    : "Available to the other release train"}
                </span>
              </div>
              <span aria-hidden="true">
                {profile === value ? <Check size={20} /> : "-"}
              </span>
            </div>
          ))}
        </div>
      </figure>
      <p className="apple-live-status" role="status">
        {profile === "legacy"
          ? "The same entry point selects the legacy pipeline for this example."
          : "Only the selected configuration changes. The example now uses the new pipeline."}
      </p>
      <div className="apple-migration-proof">
        <p>
          Separate delivery outcome <strong>Identity-endpoint migration</strong>
        </p>
        <dl>
          <div>
            <dt>Services</dt>
            <dd>4</dd>
          </div>
          <div>
            <dt>Days</dt>
            <dd>5</dd>
          </div>
          <div>
            <dt>Downtime</dt>
            <dd>0</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function AppleExperience() {
  const [story, setStory] = useState<AppleStory>("apis");
  const content = appleStories.find((item) => item.id === story)!;
  return (
    <section
      className="apple-experience"
      id="engineer"
      tabIndex={-1}
      aria-labelledby="apple-title"
    >
      <div id="work-apple" tabIndex={-1}>
        <header className="apple-header">
          <div>
            <span className="apple-eyebrow">July 2024 – present</span>
            <h2 id="apple-title">Apple</h2>
          </div>
          <div className="apple-role">
            <p>
              <strong>Software Engineer</strong>Core Engineering · Austin, TX
            </p>
            <a
              href="/Chibundu_Awandu_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Résumé <ArrowUpRight size={17} />
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          </div>
        </header>
        <p className="apple-introduction">
          A greenfield GenAI platform for advisor tools.{" "}
          <span>
            Conversational AI, autofill, and summarization, served by APIs I
            built and keep dependable.
          </span>
        </p>
        <dl
          className="apple-outcomes"
          aria-label="Selected Apple outcomes from my resume"
        >
          <div>
            <dt>Production AI API endpoints</dt>
            <dd>5</dd>
          </div>
          <div>
            <dt>
              Sequential database round-trips reworked into bulk operations
            </dt>
            <dd>~100</dd>
          </div>
          <div>
            <dt>
              Consumer applications served by one configuration-driven codebase
            </dt>
            <dd>3</dd>
          </div>
        </dl>
        <div
          className="apple-story-tabs"
          role="tablist"
          aria-label="Apple engineering stories"
        >
          {appleStories.map((item, i) => (
            <button
              key={item.id}
              id={`apple-tab-${item.id}`}
              role="tab"
              aria-controls="apple-story-panel"
              aria-selected={story === item.id}
              tabIndex={story === item.id ? 0 : -1}
              onClick={() => setStory(item.id)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowRight"
                    ? (i + 1) % appleStories.length
                    : event.key === "ArrowLeft"
                      ? (i + appleStories.length - 1) % appleStories.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? appleStories.length - 1
                          : null;
                if (next === null) return;
                event.preventDefault();
                setStory(appleStories[next].id);
                (
                  event.currentTarget.parentElement?.children[
                    next
                  ] as HTMLButtonElement
                )?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="apple-story-panel"
          id="apple-story-panel"
          role="tabpanel"
          aria-labelledby={`apple-tab-${story}`}
          data-story={story}
        >
          <div className="apple-story-copy">
            <h3>{content.title}</h3>
            <p>{content.description}</p>
            <div className="apple-outcome-note">
              <strong>{content.outcome}</strong>
              <p>{content.detail}</p>
            </div>
            <ul
              className="apple-stack"
              aria-label="Technologies and techniques"
            >
              {content.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
          {story === "apis" ? (
            <RequestStudy />
          ) : story === "processing" ? (
            <ProcessingStudy />
          ) : (
            <DeliveryStudy />
          )}
        </div>
        <div className="apple-contribution-ledger">
          <h3>Also at Apple</h3>
          <article>
            <span>Platform architecture</span>
            <h4>One codebase, three consumers</h4>
            <p>
              Configuration-driven response building reduced duplicated logic.
              OAuth2 and structured logging enabled per-tenant dashboards and
              SLO monitoring.
            </p>
          </article>
          <article>
            <span>Engineering enablement</span>
            <h4>Fix once. Reuse across services.</h4>
            <p>
              Reusable service scaffolding, an AI-assisted three-service
              framework upgrade, and an organization-wide talk on multi-server
              Model Context Protocol integration.
            </p>
          </article>
        </div>
        <p className="apple-source-note">
          Figures are self-reported in my résumé. The interactive diagrams are
          my own explanatory models, not Apple documentation or internal
          systems.
        </p>
      </div>
    </section>
  );
}
