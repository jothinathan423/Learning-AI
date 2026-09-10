# Week 5 Revision — Error Analysis: Reading Traces Like a Professional

## 5-Minute Revision

- A **trace** is the complete, replayable record of one request — input, retrieved context, exact
  assembled prompt, raw model output, final response, plus metadata. It must be complete enough
  to localize a failure to a specific pipeline stage.
- The first read-through must use **random sampling**, not curated/hand-picked examples — curated
  sampling only confirms what you already suspected and hides unknown failure modes.
- **Open coding** means writing one honest, specific, grounded sentence about what went wrong in
  each trace — *before* deciding on any category. This is borrowed from grounded theory in
  qualitative research.
- An **error taxonomy** groups those raw open-coding notes bottom-up into a small (~5–10) set of
  named, defined categories — built from your own traces, not imported from a generic list.
- Rank taxonomy categories by **frequency × severity** — how often each occurs times how much
  damage it causes — to avoid chasing whatever is loudest or easiest.
- Choose exactly **one fix target** at a time, weighing the ranking against tractability, effort,
  and measurability, so results stay attributable to one specific change.
- **Benchmarks** measure general model capability; your own error taxonomy measures your specific
  deployment's real-world fitness — they are not substitutes for each other.
- **Write a prediction before shipping** a fix — a specific, falsifiable expectation — then check
  it honestly against a fresh random sample afterward, to avoid post-hoc rationalization.

## 15-Minute Revision

**Complete Traces.** A trace is complete if it answers: what was asked, what was retrieved (and
in what order), what was actually sent to the model, what the model raw-output, what was shown to
the user, and which model/prompt/retrieval version produced it. Standard ops logs usually miss
the retrieved-context and exact-prompt fields. In agentic systems, a trace is a tree of spans, one
per tool/model call. Completeness and privacy (redaction, access control) must be designed
together.

**Random vs. Curated Sampling.** Random sampling gives every trace an equal/known chance of being
read, producing an unbiased estimate of true failure rates. Curated sampling (hand-picking
"interesting" traces) is a form of selection bias — it confirms existing intuitions. Stratified
random sampling (random within known important segments, like zero-result queries) is a
legitimate refinement of randomness, not a replacement for it. Curated, targeted sampling is valid
only *after* an initial random pass, to deepen understanding of an already-known category.

**Open Coding.** One grounded, specific sentence per trace, written before any category label
exists — this is the step that can't be automated, because it requires human judgment in context.
Premature categorization acts like a mold that forces every observation into pre-existing buckets,
hiding problems you didn't already expect. Good notes are falsifiable/checkable against the trace,
not speculation about model internals. A second reader coding a subset independently helps catch
individual blind spots.

**Error Taxonomy.** Building the taxonomy is a bottom-up clustering process: lay out all
open-coding notes, group similar ones, name each cluster with a short label and definition. Aim
for roughly 5–10 categories — fewer is unactionable, more just renames the raw notes. The
taxonomy should be grounded in your own traces (not an imported checklist like
faithfulness/relevance) and revisited/versioned as the app evolves.

**Frequency × Severity.** Frequency = observed rate in your (random) sample. Severity = how much
damage an occurrence causes (Low/Medium/High, grounded in concrete impact). Multiply (or at least
weigh both) to rank categories — this avoids both "fix whatever's loudest" and "fix whatever's
most common regardless of impact." Report both numbers separately too, since a single combined
score can hide very different risk profiles.

**Choosing the Fix Target.** Pick exactly one specific, measurable category to work on next.
Weigh the frequency × severity ranking against tractability (is the root cause well understood?),
rough effort, shared root causes with nearby categories, and measurability. Working one target at
a time preserves attribution of any measured change. Rare-but-severe categories can get a
lightweight guardrail in parallel even while a different category is the primary fix target.

**Benchmarks vs. Your App.** Benchmarks (MMLU, TruthfulQA, RAGAS defaults) measure general model
capability on a fixed, generic distribution — useful for filtering candidate models, not for
certifying your finished application. Your error taxonomy measures deployment fitness: how your
specific corpus, prompts, and users actually interact with the model in production. Build a
standing, application-specific eval set from your taxonomy to catch regressions automatically, but
keep refreshing it via manual reading, since new failure modes keep emerging.

**Writing a Prediction First.** Before shipping the chosen fix, write down what should change
(the target category's frequency) and what should not change (other categories), specified
against the same sampling/coding methodology used to find the problem. This defends against
post-hoc rationalization and hindsight bias — the tendency to reinterpret any outcome as success
once it's known. Check the prediction against a fresh random sample, coded independently of the
prediction. A falsified prediction is valuable information, triggering more open coding on the
still-failing instances — not a failure to hide.

## Last-Minute Interview Revision

- **"What is a trace, and what makes it complete?"** — The full record of one request across
  every pipeline stage (input, retrieved context, exact prompt, raw output, final response,
  metadata); it's complete if a reader can localize a failure to a specific stage without
  guessing.
- **"Why does the first sampling pass have to be random?"** — Curated sampling is selection bias:
  it only ever confirms what you already suspected. Random sampling is the only way to estimate
  the true distribution of failures, including ones you never thought to look for.
- **"What is open coding, and where does it come from?"** — Writing one grounded, specific
  sentence about a failure before assigning any category; it comes from grounded theory in
  qualitative research, and it exists specifically to prevent premature categorization from
  hiding unexpected failure modes.
- **"How do you build an error taxonomy?"** — Bottom-up: cluster the open-coding notes into a
  handful of named, defined categories that emerged from the data, rather than sorting notes into
  a pre-existing or generic list of categories.
- **"How do you decide what to fix first?"** — Rank error-taxonomy categories by frequency ×
  severity, then weigh that ranking against tractability, rough effort, and whether the fix would
  also help a nearby category, before committing to exactly one fix target.
- **"Why fix only one thing at a time?"** — To preserve attribution: if multiple things change
  simultaneously, you cannot tell which change caused which effect, which breaks the ability to
  learn from each iteration.
- **"Why isn't a good benchmark score enough to trust an application?"** — Benchmarks measure
  general model capability on a generic task distribution; they say nothing about your specific
  retrieval corpus, prompts, or real users — deployment fitness can only be measured by analyzing
  your own application's real traces.
- **"What does 'writing a prediction first' protect against, and why does it matter?"** — It
  protects against post-hoc rationalization and hindsight bias: without a prior written
  prediction, any outcome can be retroactively reframed as success. A falsified prediction is a
  genuine, useful signal that the root-cause understanding was incomplete.
- **"What's the single biggest mistake teams make in error analysis?"** — Skipping straight to
  categorization (or importing a generic taxonomy) without first reading a random sample and open
  coding it — this silently reproduces the team's existing blind spots instead of surfacing what's
  actually happening.
