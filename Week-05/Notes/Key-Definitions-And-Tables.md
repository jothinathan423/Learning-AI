# Week 5 — Key Definitions and Tables

Condensed reference definitions and comparison tables for all 8 topics. Use this alongside the
full topic pages for quick lookup while reading traces.

## Core Definitions

| Term | Definition |
|---|---|
| **Trace** | A full, replayable record of one request: input, retrieved context, exact assembled prompt, raw model output, final response, and metadata (model version, prompt version, retrieval config, timestamps). |
| **Complete trace** | A trace detailed enough that a reader with no other context can localize a failure to a specific pipeline stage without guessing. |
| **Span** | One step within a multi-step/agentic trace (a single retrieval call, tool call, or model call), each with its own captured input/output. |
| **Random sampling** | Selecting traces to read by chance, giving every trace in the population an equal (or known) probability of selection. |
| **Curated sampling** | Hand-picking traces to read based on judgment, intuition, or a pre-existing hypothesis. |
| **Stratified sampling** | Random sampling performed separately within meaningful sub-segments (e.g. zero-result queries) so rare-but-important segments aren't drowned out. |
| **Saturation** | The point in a reading session where new traces mostly reconfirm categories already seen, rather than introducing new ones — a signal the sample size is sufficient. |
| **Open coding** | Writing one honest, specific, grounded sentence describing what went wrong in a trace, before assigning any category. Borrowed from grounded theory (qualitative research). |
| **Axial coding** | The qualitative-research step of grouping open codes into broader categories — the direct analogue of building an error taxonomy. |
| **Error taxonomy** | A small (~5–10), named set of problem categories, built bottom-up from open-coding notes, each with a short definition. |
| **Frequency** | The observed rate at which a taxonomy category occurs in a (random) sample of traces. |
| **Severity** | How much damage a taxonomy category causes when it occurs (e.g. Low/Medium/High), grounded in concrete user or business impact. |
| **Priority score** | A rough combination (typically frequency × severity) used to rank taxonomy categories for attention. |
| **Fix target** | The single, specific, measurable error-taxonomy category or sub-slice a team deliberately commits to working on next. |
| **Tractability** | How well-understood and consistent a category's root cause is, based on open-coding notes — a key input to choosing a fix target alongside raw priority score. |
| **Benchmark** | A standardized, generic test set (e.g. MMLU, TruthfulQA, RAGAS defaults) measuring general model capability, built independent of any specific application. |
| **Deployment fitness** | How well a specific deployed system (model + retrieval corpus + prompts + real users) performs in practice — what error analysis on your own traces measures, distinct from benchmark capability. |
| **Application-specific eval set** | A standing, versioned eval set built from your own error taxonomy, used to catch regressions automatically between manual error-analysis cycles. |
| **Prediction-first** | Writing a specific, falsifiable expectation of a fix's effect before shipping it, to be honestly checked afterward against a fresh sample. |
| **Post-hoc rationalization** | Retroactively reinterpreting any outcome as evidence of success once the outcome is already known — what writing a prediction first is designed to prevent. |
| **Hindsight bias** | The cognitive tendency for outcome knowledge to distort what one believes they "would have predicted" beforehand. |

## Topic-by-Topic Quick Table

| # | Topic | One-Line Definition | Key Risk If Skipped |
|---|---|---|---|
| 1 | Complete Traces | Full replayable record of one request across every pipeline stage. | Can't localize failures — guessing which stage broke. |
| 2 | Random vs. Curated Sampling | Draw traces by chance, not by hunch, for the first pass. | Confirms existing beliefs, hides unknown failure modes. |
| 3 | Open Coding | Write one grounded sentence per trace before naming any category. | Premature categorization hides problems that don't fit existing buckets. |
| 4 | Error Taxonomy | Group open-coding notes bottom-up into ~5–10 named categories. | Imported/generic categories don't match your app's real failures. |
| 5 | Frequency × Severity | Rank categories by how often × how badly they hurt. | Chasing the loudest or easiest bug instead of the costliest one. |
| 6 | Choosing the Fix Target | Commit to exactly one specific, measurable category to fix next. | Diffuse effort across several fixes makes results unattributable. |
| 7 | Benchmarks vs. Your App | Benchmarks measure generic capability, not your deployment fitness. | False confidence from leaderboard scores that don't reflect your app. |
| 8 | Writing a Prediction First | State the expected effect before shipping, check it afterward. | Post-hoc rationalization masks whether the fix actually worked. |

## Sampling Method Comparison

| Dimension | Random Sampling | Curated Sampling | Stratified Random Sampling |
|---|---|---|---|
| Selection basis | Chance | Human judgment / hunch | Chance, within predefined segments |
| Best used for | First-pass discovery of unknown failures | Deepening understanding of an already-known category | Ensuring rare-but-important segments are represented |
| Main risk | Traffic-mix bias (common types dominate) if not stratified | Confirms existing beliefs, hides unknowns | Requires already knowing which segments matter |
| When to use | Always, for the initial read-through | Only after an initial random pass | Alongside an initial random pass, when a segment is known to be rare but important |

## Severity Scale (Example)

| Level | Score | Description |
|---|---|---|
| Low | 1 | Minor annoyance; user likely doesn't notice or care. |
| Medium | 2 | Noticeably wrong or unhelpful; user likely frustrated, some trust lost. |
| High | 3 | Factually harmful, unsafe, or badly damaging to trust (e.g. wrong medical/legal/financial info, fully broken response). |

## Fix-Target Decision Inputs

| Input | Question It Answers |
|---|---|
| Frequency × Severity | How much does this category currently hurt? |
| Tractability | Is the root cause well understood and consistent across instances? |
| Effort | Roughly how much work would a fix take? |
| Shared root cause | Would this fix also improve a nearby-ranked category? |
| Measurability | Can we tell, using the same methodology, whether the fix actually worked? |
