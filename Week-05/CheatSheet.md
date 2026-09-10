# Week 5 Cheat Sheet — Error Analysis: Reading Traces Like a Professional

One-page reference for the full error-analysis process: complete traces → random sampling →
open coding → error taxonomy → frequency × severity ranking → fix target → prediction-first
check.

## Key Terminology

| Term | Meaning |
|---|---|
| Trace | Full replayable record of one request (input, retrieved context, exact prompt, raw output, final response, metadata). |
| Complete trace | Detailed enough to localize a failure to a specific pipeline stage without guessing. |
| Random sampling | Drawing traces to read by chance, not by hunch. |
| Curated sampling | Hand-picking traces by judgment — only valid *after* an initial random pass, to go deeper on a known category. |
| Open coding | One grounded, specific sentence per trace describing what went wrong — before any category exists. |
| Error taxonomy | ~5–10 named categories built bottom-up from open-coding notes. |
| Frequency × Severity | Priority score combining how often a category occurs with how much damage it causes. |
| Fix target | The single, specific, measurable category a team commits to fixing next. |
| Benchmark | Generic, standardized test measuring general model capability — not your deployment. |
| Prediction-first | A written, falsifiable expectation of a fix's effect, made before shipping it. |

## The Process as a Reference Checklist

Use this as a repeatable reference sequence, not a one-time task list:

- [ ] **Traces are complete** — every request's input, retrieved context, exact prompt, raw
      output, and final response are captured and queryable.
- [ ] **Sample randomly** — draw a sample by chance from the full population of traces (with
      stratification for known rare-but-important segments, if applicable).
- [ ] **Open-code every trace in the sample** — one honest, specific, grounded sentence per
      trace, written before any category is assigned.
- [ ] **Cluster notes bottom-up into a taxonomy** — group similar open codes into a handful
      (~5–10) of named, defined categories.
- [ ] **Count frequency per category** — from the same random sample.
- [ ] **Assign severity per category** — Low / Medium / High, grounded in concrete impact.
- [ ] **Rank by frequency × severity** — sort categories; report frequency and severity
      separately too.
- [ ] **Choose one fix target** — weigh the ranking against tractability, effort, and
      measurability; state it as one specific, measurable sentence.
- [ ] **Write a prediction before shipping** — expected change on the target category, and
      expected non-change elsewhere.
- [ ] **Ship the fix.**
- [ ] **Draw a fresh random sample and re-code it** — same methodology as the original pass.
- [ ] **Compare the fresh result to the written prediction** — confirmed, partial, or falsified —
      and feed the answer back into the taxonomy and ranking for the next cycle.

## Worked Mini Example: Error Taxonomy

Sample: 30 random traces from a RAG support bot, 14 showed some problem.

| Category | Definition | Frequency (of 30) | Severity | Priority (freq × sev score 1-3) |
|---|---|---|---|---|
| Stale Document Retrieval | Retriever returns an outdated version of a document since superseded. | 6 (20%) | High (3) | 0.60 |
| Scope Overreach | Answer goes beyond what retrieved context actually supports. | 3 (10%) | High (3) | 0.30 |
| Correct Facts, Wrong Format | Right answer, broken markdown/table or wrong unit. | 3 (10%) | Low (1) | 0.10 |
| Multi-Document Conflation | Blends facts from two retrieved chunks into one wrong claim. | 2 (7%) | Medium (2) | 0.14 |

Ranked fix-target candidate: **Stale Document Retrieval** (highest priority score, and open
coding showed a consistent, tractable root cause: the index wasn't refreshing on document
update).

Prediction written before shipping the fix: *"After re-indexing on document update, Stale
Document Retrieval should drop from ~20% to under 5% of a fresh 30-trace random sample; Scope
Overreach and the other categories should stay roughly the same."*

## Quick Reminders

- Sentence before bucket — open-code before you categorize.
- Chance, not choice — random sampling first, always.
- Your app, not the leaderboard — benchmarks pick a model; your own traces measure your app.
- Loud ≠ common ≠ costly — rank by frequency × severity, not by whichever bug is loudest.
- One target, one story — fix one category at a time so results stay attributable.
- Predict, then peek — write the expected effect before you look at the outcome.
- A falsified prediction is data, not a failure to hide.
