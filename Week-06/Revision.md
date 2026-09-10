# Week 6 Revision — Evals

## 5-Minute Revision

- An **eval set** is real questions + a way to score the answer, built first from real
  production failures, then filled out for error-category coverage.
- Every fixed bug becomes a **regression test** — permanent, so it can never silently return.
- Try a free **assertion check** (rule-based) before ever reaching for an LLM judge.
- **LLM-as-judge** = one AI grading another's output for things rules can't check (tone,
  helpfulness). Never trust its score until you've **validated** it against your own grading.
- **G-Eval** makes judges more consistent using auto-generated reasoning steps and a
  probability-weighted score, instead of one raw "rate 1-10" guess.
- **Binary** scoring for gates (safety, schema); **1-to-10** for tracking gradual improvement.
- **RAGAS** has four core metrics: faithfulness (claims vs. context), answer relevancy (answer
  vs. question), context precision (ranking), context recall (completeness, needs a reference
  answer).
- **Before-after deltas**: freeze the eval set, run before and after, compare paired scores
  **per category** — never trust just the aggregate.

## 15-Minute Revision

**Eval sets** are the foundation: input + context + expected behavior + scoring method, mined
from real traces first (Week 5's error taxonomy gives you the categories to make sure you have
coverage for), then filled out with synthetic edge cases. Keep a holdout slice untouched so
repeated tuning doesn't overfit to the set itself (Goodhart's Law).

**Regression tests** are a focused, non-negotiable subset of the eval set: take a real failing
trace, trim it to a minimal reproducible input, write a check that would have caught it, apply
the fix, confirm the fix actually passes the new check, *then* add it permanently. Assert on
properties (contains/doesn't contain, valid schema) rather than exact strings to avoid
flakiness from normal LLM output variation.

**Assertion checks** are the cheapest, most reliable layer — deterministic code for mechanical
properties (format, presence, refusal correctness, schema validity). Always the first thing to
try; free, instant, perfectly consistent, zero judge-reliability risk.

**LLM-as-judge** fills the gap assertions can't: qualities that require actual judgment. Judge
prompts include the input, the output, optionally a reference/context, and explicit rubric
criteria. Watch for self-preference bias (same model judging its own output), position bias
(order effects in pairwise comparison), and verbosity bias (rewarding length over quality).

**G-Eval** specifically improves judge reliability with two mechanisms: (1) the judge
auto-generates its own chain-of-thought evaluation steps from your stated criteria
(form-filling), and (2) the final score is a probability-weighted average across possible
score values (`Σ p(s)·s`) rather than a single sampled token — smoother, more sensitive to
small quality differences.

**Binary vs. 1-to-10**: binary maximizes consistency (best for hard gates); graded scales
capture partial progress but drift without rubric anchoring or G-Eval-style weighting. Choose
based on the decision the check needs to support, and never switch mid-project.

**Judge validation** is mandatory, not optional: draw a stratified human-labeled sample, run
the judge on the same sample, compute the right agreement metric (Cohen's Kappa for
binary/categorical, Pearson/Spearman correlation for graded scores), inspect actual
disagreements for a pattern, revise the rubric, and re-validate — periodically, since judge
agreement can silently drift after model or prompt changes.

**RAGAS metrics**, precisely:
- *Faithfulness* = supported claims ÷ total claims (decompose answer into atomic claims, check
  entailment against retrieved context). Measures generation groundedness, not real-world
  truth.
- *Answer relevancy* = mean cosine similarity between the original question and several
  reverse-engineered questions generated from the answer. Measures topical alignment, not
  correctness.
- *Context precision* = ranking-weighted precision@K — are relevant chunks ranked near the top?
  Reference-free.
- *Context recall* = attributable reference-answer sentences ÷ total sentences — did retrieval
  fetch everything needed? Requires a reference answer.

Read faithfulness with relevancy (generation-side pair) and precision with recall
(retrieval-side pair) — none of the four tells the whole story alone.

**Before-after deltas** tie everything together: freeze the eval set (same cases, same
scoring/judge config), run baseline and changed system under identical conditions, compute
paired per-case deltas, aggregate by category (not just overall average — an improved average
can hide a regression in a high-severity category), and check an untouched holdout slice
before shipping.

## Last-Minute Interview Revision

- **"How do you know a prompt change actually helped?"** — Frozen eval set, run before and
  after under identical scoring, paired per-case comparison, segmented by category so an
  aggregate win can't hide a category-level regression. Check a holdout slice too, to rule out
  overfitting the eval set itself.
- **"What's LLM-as-judge and why is it risky?"** — Using an LLM to grade another system's
  output for qualities rules can't check; risky because the judge is itself a fallible model
  (self-preference, position, verbosity bias) and its score means nothing until validated
  against human grading.
- **"How do you validate an LLM judge?"** — Human-label a stratified sample, run the judge on
  the same sample, compute Cohen's Kappa (categorical) or Pearson/Spearman correlation
  (graded), inspect specific disagreements, revise the rubric, re-validate — and repeat
  periodically since agreement drifts.
- **"What does G-Eval add over a plain 'rate 1-10' prompt?"** — Auto-generated chain-of-thought
  evaluation steps plus a probability-weighted final score (`Σ p(s)·s`) instead of one raw
  token — more consistent, more finely graded, still needs validation.
- **"Explain RAGAS faithfulness precisely."** — Decompose the answer into atomic claims, check
  each claim's entailment against retrieved context via an LLM, score = supported claims ÷
  total claims. High faithfulness ≠ real-world correctness — only groundedness in what was
  retrieved.
- **"Explain RAGAS answer relevancy precisely."** — Generate N plausible questions the answer
  could be responding to, embed them and the original question, average their cosine
  similarity. Noncommittal/evasive answers are handled as a special low-score case.
- **"Difference between context precision and context recall?"** — Precision: are the relevant
  retrieved chunks ranked near the top (no reference answer needed). Recall: is everything
  needed present at all, checked against a reference answer's sentences (reference answer
  required).
- **"When do you use binary vs. graded scoring?"** — Binary for anything gating a release
  (safety, schema, refusal correctness) where consistency matters most; graded (1–10, rubric-
  anchored or G-Eval-weighted) for tracking incremental quality you're actively trying to
  improve.
- **"Why turn a bug into a regression test instead of just fixing it?"** — A fix alone can be
  silently undone by any later, unrelated change; a permanent test converts a one-time fix
  into a standing guarantee that's checked on every future change.
- **"Why segment eval results by category instead of trusting the aggregate?"** — Because
  averaging can hide a serious regression in one high-severity category behind a bigger
  improvement in an easy one — exactly the failure per-category segmentation exists to catch.
