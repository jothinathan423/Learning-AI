# Week 5 — FAQs and Memory Tricks

## Frequently Asked Questions

**Q1. Isn't reading traces by hand just... slow and unscientific compared to an automated eval?**

It's slower per-trace than running an automated metric, but it measures something automation
can't: it's the only method that discovers failure modes nobody thought to write an eval for yet.
Automated evals (including application-specific ones) are built *from* what manual reading finds
— they're a product of error analysis, not a substitute for it.

**Q2. How many traces do I actually need to read for a meaningful first pass?**

There's no fixed universal number — the right signal is **saturation**: the point where new
traces mostly reconfirm categories you've already seen rather than introducing new ones. Many
teams find this happens somewhere in the range of a few dozen carefully-read traces, but it
depends on how varied your traffic and failure modes are.

**Q3. What's the actual difference between a trace and a log?**

A standard operational log is usually built for uptime/latency monitoring and often only
captures the final response and maybe an error code. A trace is built for understanding *why* an
answer was good or bad — it captures every pipeline stage's input and output (retrieved context,
the exact assembled prompt, raw model output) so a failure can be localized to a specific stage.

**Q4. Why can't I just start with a hypothesis about what's probably wrong and go check it?**

You can — later. But the *first* pass has to be unbiased (random sampling, open coding without
pre-set categories) precisely because a hypothesis-driven search only ever confirms or denies
what you already suspected. It structurally cannot discover the failure mode you never thought to
hypothesize about.

**Q5. What if two readers disagree on the category for the same trace?**

That's useful signal, not a problem to suppress. Disagreement usually means either the category
definitions are too vague (worth tightening) or the trace genuinely straddles two categories
(worth allowing overlap rather than forcing a false single fit).

**Q6. How is severity supposed to be scored — isn't it subjective?**

Yes, there's judgment involved, which is exactly why it should be written down and grounded in
concrete impact (safety, factual harm, trust, business cost) rather than left as an unexamined
gut feeling. The goal isn't false precision — it's making the judgment explicit and comparable
across categories so the team can debate the inputs, not vague impressions.

**Q7. Can I just use RAGAS or a similar RAG benchmark suite instead of building my own taxonomy?**

Suites like RAGAS give useful generic metrics (faithfulness, context relevance) computed
automatically, but they won't tell you that, say, your specific refund-policy documents keep
getting served in a stale version. Your own taxonomy, grounded in your own traces, is almost
always more specific and more actionable for your app.

**Q8. Why fix only one problem at a time? Isn't that inefficient?**

It feels inefficient in the short term but pays off in attribution: if you fix three things at
once and a metric moves, you can't tell which change caused it. Working one fix target at a time
keeps each cycle of the loop genuinely learnable.

**Q9. What happens if my prediction turns out to be wrong?**

That's valuable information, not a failure — it means your understanding of the root cause was
incomplete. It should trigger more open coding on the still-failing instances of that category,
not a quiet decision to claim success anyway.

**Q10. Do I need a special tool to do error analysis, or can I just use a spreadsheet?**

A spreadsheet (or even a shared document) is genuinely fine, especially for a first pass —
what matters is complete traces to read from and discipline in the process (random sampling,
open coding before categorizing, honest severity judgment). Dedicated LLM-observability tools
help mainly with capturing complete traces at scale and make repeated sampling easier over time.

**Q11. How often should I redo this whole process?**

There's no universal cadence, but common triggers are: after shipping a fix (to check the
prediction), on a regular cadence (e.g. monthly or per-release) to catch drift, and whenever the
app, corpus, or model changes meaningfully (since the failure distribution shifts with it).

**Q12. Is open coding the same thing as writing a bug report?**

Not quite. A bug report typically already implies a cause or a fix. An open-coding note is meant
to stay at the level of "what happened in this trace, specifically" — grounded observation,
without jumping to diagnosis or solution yet.

## Memory Tricks and Mnemonics

- **"SORT-FCP"** for the full loop: **S**ample (random) → **O**pen-code → **R**oup into taxonomy
  (group) → **T**ally frequency × severity → **F**ix target chosen → **C**laim a prediction →
  **P**roof-check against a fresh sample. (Loose mnemonic — the point is the order, not the exact
  letters.)
- **"Sentence before Bucket"** — for open coding: always write the grounded sentence before you
  ever reach for a category label.
- **"Chance, not Choice"** — for sampling: the first pass must be drawn by chance, not chosen by
  hand.
- **"Loud ≠ Common ≠ Costly"** — three different things that are easy to confuse when
  prioritizing: the loudest complaint, the most frequent issue, and the most expensive one by
  frequency × severity are not automatically the same category.
- **"One Target, One Story"** — for choosing a fix target: work one category at a time so any
  measured change tells one clear story.
- **"Predict, then Peek"** — never look at the outcome before writing down what you expected.
- **"Your App, Not The Leaderboard"** — benchmarks measure the model in general; your taxonomy
  measures your deployment specifically.

## Quick Revision Bullet List

- A trace must be complete enough to localize a failure to a specific pipeline stage.
- Random sampling first, always — curated sampling only to deepen an already-known category.
- Open code before you categorize — one grounded sentence, no labels yet.
- Build the taxonomy bottom-up from your own notes, not from an imported generic list.
- Rank by frequency × severity, not by loudest or easiest.
- Pick exactly one fix target, weighing tractability and effort alongside the ranking.
- Benchmarks filter candidate models; only your own traces measure your deployment's real
  fitness.
- Write your prediction before shipping the fix, and check it honestly against a fresh sample.
