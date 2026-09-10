# Week 5 — Error Analysis: Reading Traces Like a Professional

Up to now, you improved your app by fixing whatever problem happened to catch your eye. That
approach has a hidden flaw: it only ever fixes the problems you notice, and there is no reason
to believe the problems you notice are the problems that matter most. Week 5 introduces
**error analysis** — the systematic, partly-manual discipline of reading a fair sample of your
app's real outputs, honestly recording what went wrong in each one, grouping those observations
into named categories of failure, ranking those categories by how often and how badly they hurt,
and then deliberately choosing the single problem worth fixing next. You'll learn what a
**complete trace** is (the full replayable record of one request), why **random sampling** beats
cherry-picking nice or terrible examples, how **open coding** — a technique borrowed from
qualitative research — forces honest, ungrouped observation before you jump to conclusions, how
to build an **error taxonomy** out of those raw notes, how to rank taxonomy entries by
**frequency × severity**, why your app's specific failure modes are not the same as what generic
benchmarks measure, and how to close the loop by **writing a prediction first** — stating in
advance what you expect a fix to change, so you can honestly check whether it worked.

- **Estimated reading time:** ~75–90 minutes for all 8 topics, plus the notes and cheat sheet.
- **Difficulty level:** Intermediate.
- **Prerequisites:** Weeks 3–4 — you should already be comfortable with how a RAG pipeline is
  assembled (retrieval + generation) and with basic retrieval debugging (inspecting what a
  retriever fetched and why), since error analysis is performed on traces produced by exactly
  that kind of pipeline.

## What You'll Master After This Week

- How to define and recognize a **complete trace** — a record detailed enough to replay a
  request later and understand exactly what the system saw and did.
- Why a **random sample**, not a curated one, is the only way to see your app's true failure
  distribution instead of the failures you already expected.
- How to perform **open coding**: writing one honest, judgment-free sentence about what went
  wrong in each failing trace before assigning any category.
- How to turn a pile of open-coded notes into a small, named **error taxonomy** that the whole
  team can use as shared vocabulary.
- How to rank taxonomy entries by **frequency × severity** so you invest effort where it pays
  off most, instead of chasing whichever bug is loudest.
- How to **choose a single fix target** deliberately, instead of trying to fix everything at
  once and diluting your effort.
- Why public **benchmarks** measure something different from your app's real, in-production
  failure modes, and why you cannot substitute one for the other.
- How to **write a prediction before you ship a fix**, so you can tell — honestly, not
  retroactively — whether the fix actually worked.

## Topics Covered

1. [Complete Traces](./Topics/01-Complete-Traces.md)
2. [Random vs. Curated Sampling](./Topics/02-Random-Vs-Curated-Sampling.md)
3. [Open Coding](./Topics/03-Open-Coding.md)
4. [Error Taxonomy](./Topics/04-Error-Taxonomy.md)
5. [Frequency × Severity](./Topics/05-Frequency-Times-Severity.md)
6. [Choosing the Fix Target](./Topics/06-Choosing-The-Fix-Target.md)
7. [Benchmarks vs. Your App](./Topics/07-Benchmarks-Vs-Your-App.md)
8. [Writing a Prediction First](./Topics/08-Writing-A-Prediction-First.md)

## Reading Progress Checklist

- [ ] 01 — Complete Traces
- [ ] 02 — Random vs. Curated Sampling
- [ ] 03 — Open Coding
- [ ] 04 — Error Taxonomy
- [ ] 05 — Frequency × Severity
- [ ] 06 — Choosing the Fix Target
- [ ] 07 — Benchmarks vs. Your App
- [ ] 08 — Writing a Prediction First
- [ ] Review Cheat Sheet
- [ ] Complete Revision
