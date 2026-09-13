export type AppleStory = "apis" | "processing" | "delivery";
export type ResponseMode = "streaming" | "synchronous";
export type ClaimState = { owner: number | null; attempt: number | null };

export const appleStories = [
  {
    id: "apis",
    label: "AI platform",
    title: "An AI service, from repository to production.",
    description:
      "I built a greenfield GenAI backend with Java, Spring Boot, WebFlux, and MongoDB. Its five synchronous and SSE-streaming APIs support conversational AI, autofill, and summarization in advisor tools.",
    outcome: "Five production API endpoints",
    detail:
      "A shared platform for conversational AI, autofill, and summarization in advisor tools.",
    stack: ["Java", "Spring Boot", "WebFlux", "MongoDB"],
  },
  {
    id: "processing",
    label: "Distributed processing",
    title: "Less database work. No duplicate processing.",
    description:
      "I redesigned background processing around atomic per-record claims, locale-batched downstream calls, and a live-traffic-driven circuit breaker. Measurement guided the changes rather than assuming more concurrency was the answer.",
    outcome:
      "Roughly 100 sequential database round-trips collapsed into bulk operations",
    detail:
      "The redesign also eliminated duplicate processing across horizontally scaled pods. The database-work reduction is not a latency benchmark.",
    stack: ["Atomic claims", "Batch operations", "Circuit breaker"],
  },
  {
    id: "delivery",
    label: "Platform delivery",
    title: "Modernize the platform without stopping the work.",
    description:
      "I led the team's first Java 25 / Spring Boot 4 service, resolved ten build, runtime, security, and CI failures, and captured the fixes in reusable scaffolding. I also designed configuration profiles for concurrent authentication-pipeline release trains.",
    outcome:
      "A separate identity-endpoint migration: four services, five days, zero downtime",
    detail:
      "Configuration-driven delivery reduced branching between legacy and new authentication pipelines. An advisor-blocking production outage was diagnosed and fixed the same day.",
    stack: ["Java 25", "Spring Boot 4", "OAuth2", "CI tooling"],
  },
] as const;

// A browser-only ownership model. The first successful claim wins until reset.
export function claimRecord(state: ClaimState, worker: number): ClaimState {
  return { owner: state.owner ?? worker, attempt: worker };
}

export function requestPhase(step: number, mode: ResponseMode) {
  if (step === 0)
    return "Ready. Advance the illustrative request one step at a time.";
  if (step === 1) return "Request accepted by the API service.";
  if (step === 2)
    return mode === "streaming"
      ? "A partial result is available as a server-sent event. The response is still in progress."
      : "The client is waiting for the complete response.";
  return "The example response is complete. Reset to compare the other response mode.";
}
