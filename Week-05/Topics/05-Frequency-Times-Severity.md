---
title: "Frequency x Severity"
week: 5
order: 5
difficulty: Intermediate
readingTime: "10 min"
---

# Frequency x Severity

## 1. Introduction

Once you have a named error taxonomy (Topic 4), the natural next question is: which of these
problems should you fix first? You cannot fix everything at once, and not every named problem
deserves equal attention. **Frequency × severity** is the simple but powerful heuristic for
answering this: rank each taxonomy category by roughly how often it happens (frequency) combined
with how much damage it does when it does happen (severity), and prioritize categories that score
high on both, not just one.

This topic is where error analysis stops being purely descriptive ("here's what's wrong") and
becomes a prioritization tool ("here's what to work on next").

## 2. Why This Topic Exists

Without a deliberate ranking method, teams tend to default to one of two flawed heuristics:
fixing whatever is *loudest* (a single dramatic failure that got escalated, even if it's rare), or
fixing whatever is *easiest* (a trivial formatting bug, even if it barely matters). Both feel
productive in the moment and both can easily lead effort away from what actually matters most to
users and the business.

Frequency alone is misleading: a very common but low-stakes issue (a slightly awkward phrasing
that shows up 40% of the time but never confuses anyone) may matter less than a rare but
catastrophic one (a wrong dosage number that shows up in 2% of medical-advice traces). Severity
alone is equally misleading: focusing entirely on worst-case severity while ignoring frequency
means investing heavily in a bug that essentially never happens, at the expense of a moderate
problem hurting a large fraction of real users every day. Multiplying the two together — even as
a rough, non-precise estimate — forces both dimensions to be weighed at once, which is much closer
to how the real-world cost of a problem actually behaves.

## 3. Core Concept

### Beginner

For each category in your error taxonomy, estimate two things:

- **Frequency**: out of your sampled traces, roughly what fraction fall into this category?
  (e.g. "9 out of 30 sampled traces, so about 30%.")
- **Severity**: when this problem happens, how bad is it for the user or the business? A simple
  scale works well — for example, Low (minor annoyance, user probably doesn't notice or care),
  Medium (noticeably wrong or unhelpful, user likely to be frustrated or lose some trust), High
  (factually harmful, unsafe, or badly damaging to trust — e.g. wrong medical, legal, or financial
  information, or a completely broken response).

Then combine them, even informally: a category that is both frequent *and* severe should sit at
the top of your list. A category that is rare and low-severity should sit at the bottom, even if
it's an easy fix.

### Intermediate

A simple way to combine the two dimensions is a small numeric scale, for example:

| Severity | Score |
|---|---|
| Low | 1 |
| Medium | 2 |
| High | 3 |

Multiply the severity score by the observed frequency (as a fraction or a count) to get a rough
priority score. For example:

| Category | Frequency (of sample) | Severity | Priority Score |
|---|---|---|---|
| Stale Document Retrieval | 30% | High (3) | 0.90 |
| Correct Facts, Wrong Format | 25% | Low (1) | 0.25 |
| Scope Overreach (answers beyond context) | 12% | High (3) | 0.36 |
| Multi-Document Conflation | 8% | Medium (2) | 0.16 |

This is deliberately a rough estimate, not a precise formula — the value of the exercise is
forcing an explicit, comparable, written-down judgment for every category, rather than an
implicit, unexamined gut feeling about "what feels most important." The numbers matter less than
the fact that everyone on the team is looking at the same comparison and can debate the inputs
(is that really "High" severity? is 30% really representative?) rather than debating vague
impressions.

It's also worth tracking frequency and severity **separately**, not just as a combined score, and
displaying both. A high-frequency/low-severity issue and a low-frequency/high-severity issue can
land at a similar combined score while representing very different kinds of risk (one is an
everyday annoyance at scale; the other is a rare but serious tail risk) — the raw two numbers
carry information the single combined score throws away, and different stakeholders (a support
lead vs. a legal/compliance reviewer) may reasonably weigh those risks differently.

### Advanced

More rigorous treatments of this idea come from established risk-analysis fields and can be
borrowed selectively:

- **Expected-cost framing.** Frequency × severity is structurally the same idea as *expected
  loss* in risk management: `expected_cost = probability_of_occurrence × cost_per_occurrence`.
  This framing makes clear why a rare-but-catastrophic error (a wrong drug interaction warning) can
  outrank a common-but-mild one, and it invites putting a real cost estimate (support ticket volume,
  churn risk, legal exposure) on severity rather than a subjective 1–3 scale, when the stakes
  justify the extra rigor.
- **Confidence intervals on frequency.** A frequency estimated from a small sample (say, 30
  traces) carries real statistical uncertainty — "9 out of 30" could plausibly reflect a true rate
  anywhere from roughly 15% to 45% at typical confidence levels. When a decision is close, it's
  worth either widening the sample for that specific category or being explicit that the ranking
  is provisional rather than precise.
- **Severity is not always uniform within a category.** As mentioned in Topic 4, a single
  taxonomy entry can span a severity range (a "Stale Document Retrieval" instance might be a minor
  outdated phrasing or a seriously wrong price). When this spread is wide, consider reporting a
  severity distribution (e.g. "70% Low, 20% Medium, 10% High" within the category) rather than one
  single severity score, and weight the priority calculation accordingly.
- **Interaction with fixability and cost-to-fix.** Frequency × severity ranks problems by how much
  they hurt, not by how cheap they are to fix. A mature prioritization process treats "how much
  does this hurt" (frequency × severity) as an input to, but not the entirety of, choosing what to
  work on next — the actual choice (Topic 6) also weighs how tractable and well-understood a fix
  is.

## 4. Deep Explanation

The deeper justification for multiplying rather than only ranking by one dimension is that the
real-world impact of a software defect scales with both how many times it's encountered and how
bad each encounter is — this is the same logic behind risk matrices used broadly in safety
engineering, security vulnerability scoring (frameworks like CVSS combine exploitability and
impact), and reliability engineering. A defect that occurs constantly but causes no real harm
(frequent, low severity) consumes attention out of proportion to its actual cost if prioritized
by frequency alone; a defect that is dramatic but vanishingly rare (rare, high severity) can
likewise consume disproportionate attention if prioritized by severity alone, especially after a
single visible incident makes it feel more urgent than its actual rate justifies.

The frequency estimate itself is a direct output of the sampling and taxonomy work from Topics 2
and 4 — this is exactly why unbiased random sampling (Topic 2) matters so much here specifically:
a frequency number computed from a biased, curated sample will misrank every category built on top
of it, silently sending engineering effort toward the wrong problem even though every later step
(taxonomy, ranking, fix selection) was executed carefully.

## 5. Step-by-Step Flow

1. **Take the finished error taxonomy** (Topic 4) with its named categories.
2. **Count frequency per category** — how many traces in your (unbiased, random) sample fell into
   each category, expressed as a count and a percentage.
3. **Assign a severity level per category** — using a simple scale (Low/Medium/High or a numeric
   equivalent), grounded in concrete impact (user trust, safety, business cost), not gut feeling
   alone.
4. **Note severity spread within a category**, if wide, rather than collapsing it into a single
   number that hides the range.
5. **Compute a rough priority score** (frequency × severity) per category, and sort categories by
   that score.
6. **Present frequency and severity side by side**, not only the combined score, so stakeholders
   can weigh the two dimensions according to their own risk tolerance.
7. **Treat the resulting order as a strong input**, not an automatic verdict, feeding into the
   fix-target decision in Topic 6.

## 6. Architecture Explanation

```mermaid
quadrantChart
    title Frequency vs Severity Prioritization
    x-axis Low Frequency --> High Frequency
    y-axis Low Severity --> High Severity
    quadrant-1 Fix Next: high frequency, high severity
    quadrant-2 Investigate: low frequency, high severity
    quadrant-3 Deprioritize: low frequency, low severity
    quadrant-4 Nice-to-have: high frequency, low severity
    "Stale Document Retrieval": [0.75, 0.85]
    "Correct Facts, Wrong Format": [0.6, 0.2]
    "Scope Overreach": [0.3, 0.8]
    "Multi-Document Conflation": [0.2, 0.45]
```

The categories that land in the top-right quadrant (frequent and severe) are the strongest
candidates for the fix target chosen in Topic 6; the bottom-left quadrant is safe to deliberately
deprioritize for now.

## 7. Visual Analogy

Think of a hospital emergency room's **triage** system. A nurse doesn't treat patients strictly in
arrival order (that would ignore severity), and doesn't only treat whoever seems most
dramatically injured (that would ignore how many other patients are waiting with real, if
lesser, needs). Triage explicitly weighs both how urgent a condition is and, implicitly, how many
patients need attention overall, to decide who gets seen first. Frequency × severity ranking is
triage for your app's error taxonomy: it isn't first-come-first-served (loudest bug) and isn't
worst-case-only (rarest dramatic bug) — it's a deliberate weighing of both dimensions together.

## 8. Real Industry Example

Security teams use an almost identical structure in **vulnerability management**: the industry
standard CVSS (Common Vulnerability Scoring System) combines an *exploitability* dimension
(roughly analogous to frequency — how easily and often could this be triggered) with an *impact*
dimension (analogous to severity — how bad is the consequence) into a single score used to
prioritize which vulnerabilities get patched first out of a large backlog. Product-quality and
data-science teams evaluating LLM applications have converged on the same structural idea for
exactly the same reason: a large backlog of known issues, limited engineering time, and a need for
a defensible, repeatable way to decide what gets fixed next.

## 9. Common Misconceptions

- **"The most severe problem should always be fixed first, regardless of frequency."** A
  catastrophic problem that occurs once in ten thousand requests may genuinely warrant guardrails
  (see Topic 6), but treating it as automatically top priority over a moderate problem hitting a
  third of all traffic often misallocates effort — frequency has to be weighed, not ignored.
- **"Frequency × severity gives an exact, final ranking."** It's a rough estimate meant to make
  trade-offs explicit and comparable, built on a sample with real statistical uncertainty — treat
  close rankings as roughly tied, not as a precise ordering to follow blindly.
- **"A category with low combined score doesn't matter at all."** Low-priority-for-now doesn't
  mean irrelevant forever; it means other categories currently offer better return on effort. Low
  scoring categories should be revisited as higher-priority ones get addressed and the taxonomy is
  refreshed.
- **"Severity should be judged only by how dramatic an example looks."** A single dramatic
  example can bias severity judgments upward even for a category whose broader impact is milder;
  severity should reflect a considered view of typical impact across the category, informed by the
  full set of coded examples, not just the most vivid one.

## 10. Best Practices

- Ground both frequency and severity in your actual sampled traces and open-coding notes, not
  general impressions.
- Report frequency and severity as separate numbers alongside any combined score, so different
  stakeholders can apply their own risk weighting.
- Be explicit about sample-size uncertainty, especially for rare categories estimated from a
  small number of observed instances.
- Revisit the ranking whenever the taxonomy or the underlying sample is refreshed — it is a
  living output, not a one-time verdict.
- Use the ranking as a strong input to choosing a fix target (Topic 6), but weigh it alongside
  fixability and cost-to-fix rather than following it mechanically.
- Watch for wide severity spread within a single category and consider splitting or reporting a
  distribution rather than one collapsed severity score.

## 11. Summary

Frequency × severity is a deliberate prioritization heuristic that ranks error-taxonomy
categories by combining how often each occurs with how much damage each occurrence causes,
avoiding the twin traps of chasing whatever is loudest or whatever is easiest. It borrows the same
underlying logic as expected-cost analysis in risk management and vulnerability scoring in
security. The resulting ranking, built on the frequency counts and severity judgments grounded in
your own sampled traces, is the direct input to deliberately choosing a single fix target — the
subject of the next topic.

## 12. Key Takeaways

- Frequency × severity combines how often a problem occurs with how bad each occurrence is,
  avoiding both "fix whatever's loudest" and "fix whatever's most common regardless of impact."
- A simple Low/Medium/High severity scale multiplied by observed sample frequency is enough to
  make trade-offs explicit and comparable across categories.
- Report frequency and severity separately as well as combined — a single score can hide very
  different risk profiles (frequent-mild vs. rare-severe).
- Frequency estimates inherit any bias from the sampling step (Topic 2) — an unbiased random
  sample is what makes this ranking trustworthy in the first place.
- The ranking is a strong input to, not a final verdict on, choosing what to fix next — fixability
  and cost-to-fix also matter (Topic 6).
- Treat the ranking as a living output to be refreshed as the taxonomy and underlying sample are
  updated over time.
