# Week 6 — FAQs and Memory Tricks

## Frequently Asked Questions

**Q1: What's the difference between an eval set and a regression test suite?**
An eval set is the broader collection, built for *coverage* of known error categories plus
real and synthetic cases. A regression suite is a specific, non-negotiable subset of it: cases
that exist because a real, documented bug happened once and must never silently return.

**Q2: Should I always use an LLM judge instead of writing rules?**
No — the opposite. Always try a rule-based assertion first. Rules are free, instant, and
perfectly consistent. Reach for an LLM judge only when the property genuinely requires
judgment (tone, helpfulness, nuanced correctness) that no rule can capture.

**Q3: Can I trust an LLM judge's score right after writing the prompt?**
No. An unvalidated judge is, in this week's own framing, "just a confident number nobody
trusts." Always compare the judge's grades against your own human grading on a representative
sample before using its scores for real decisions.

**Q4: What does G-Eval actually add over a normal "rate this 1-10" judge prompt?**
Two things: (1) the judge model auto-generates its own chain-of-thought evaluation steps from
your criteria before scoring, and (2) instead of reading a single sampled score token, it
computes a probability-weighted average across possible scores — producing a more stable,
finer-grained number.

**Q5: When should I use binary scoring instead of a 1-to-10 scale?**
Use binary for anything gating a release or checking a hard rule — safety refusals, schema
validity, format correctness — where consistency matters more than nuance. Use graded scoring
for qualities you're trying to improve incrementally, where partial progress matters.

**Q6: What's the actual formula behind RAGAS faithfulness?**
`faithfulness = (number of answer claims supported by retrieved context) / (total claims in
the answer)`, computed by first decomposing the answer into atomic claims, then checking each
one's entailment against the retrieved context.

**Q7: Does a high faithfulness score mean the answer is true?**
No. Faithfulness only measures whether the answer's claims are supported by *what was
retrieved* — if the retrieved context itself is wrong or outdated, a perfectly faithful answer
can still be wrong in the real world. That's why faithfulness is paired with context
precision/recall.

**Q8: What's the difference between context precision and context recall?**
Precision asks whether the relevant retrieved chunks were ranked near the top (clutter/ranking
question). Recall asks whether all the information actually needed was retrieved at all
(completeness question). High precision + low recall = too narrow; low precision + high
recall = too noisy.

**Q9: Why does answer relevancy use "reverse-engineered questions" instead of just comparing to a reference answer?**
It avoids needing a hand-written ideal answer for every single question. Instead, it checks
whether a model could recover something close to the original question just by reading the
generated answer — if the answer stayed on-topic and complete, the reverse-engineered
questions land close to the real one.

**Q10: Why segment before-after deltas by category instead of just looking at the overall average?**
Because an aggregate score can improve overall while a specific, high-severity category quietly
regresses — the average hides exactly the information you need to catch that. Always check
the per-category breakdown, not just the headline number.

**Q11: What agreement metric should I use to validate a judge?**
Match it to the scoring type: Cohen's Kappa for binary/categorical outputs (it corrects for
chance agreement), Pearson or Spearman correlation for graded/continuous scores.

**Q12: How often do I need to re-validate a judge?**
More than once. Re-validate after judge-model upgrades, rubric/prompt edits, or noticeable
shifts in the kinds of inputs your system receives — judge agreement can drift silently.

## Memory Tricks / Mnemonics

- **"Rules first, judge second."** Always ask "can a regex catch this?" before reaching for an
  LLM judge — cheapest reliable method wins.
- **F.A.R.C. for RAGAS** — **F**aithfulness (claims vs. context), **A**nswer relevancy
  (answer vs. question), **R**ecall (context vs. reference), **C**ontext precision (ranking vs.
  relevance). Two check generation (F, A), two check retrieval (C, R).
- **"Validate before you venerate."** Never trust a judge's number until you've checked it
  against your own grading.
- **"Binary for gates, graded for growth."** Binary scoring for hard release gates; graded
  scoring for tracking incremental quality improvement.
- **"Category before aggregate."** Always read the before-after delta broken down by category
  first — the aggregate is a summary, not the real result.
- **"A test born from a bug never dies."** Every fixed failure becomes a permanent regression
  test — that's the whole point of Week 6.

## Bullet-Point Revision List

- Eval sets = input + expected behavior + scoring method, built from real failures first.
- Regression tests = permanent tests derived from specific, already-fixed bugs.
- Assertion checks = free, deterministic, mechanical-property checks — always try these first.
- LLM-as-judge = AI grading AI for qualities rules can't capture; needs validation to be
  trustworthy.
- G-Eval = auto-generated CoT steps + probability-weighted scoring for more consistent judging.
- Binary vs. 1-to-10 = consistency vs. granularity trade-off; choose based on the decision the
  check supports.
- Judge validation = compare judge scores to human grading using the right agreement metric,
  and re-check periodically.
- RAGAS faithfulness = claims supported by retrieved context (generation groundedness).
- RAGAS answer relevancy = does the answer address the question (topical alignment).
- RAGAS context precision/recall = retrieval quality — ranking and completeness respectively.
- Before-after deltas = frozen eval set, paired comparison, segmented by category, holdout
  checked before shipping.
