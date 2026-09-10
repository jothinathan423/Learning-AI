# Week 6 Cheat Sheet — Evals

One-page reference for building the machine that catches whether a change actually helped.

## Key Terminology

| Term | One-line meaning |
|---|---|
| Eval set | Curated, versioned test cases: input + expected behavior + scoring method |
| Regression test | Eval case born from a real, fixed bug — permanent, non-negotiable |
| Assertion check | Free, deterministic rule-based check on a mechanical property |
| LLM-as-judge | AI call grading another AI's output for qualities rules can't check |
| G-Eval | Judge method: auto-generated CoT steps + probability-weighted scoring |
| Binary scoring | Pass/fail — high consistency, no granularity |
| 1-to-10 scoring | Graded — more nuance, needs rubric anchoring to stay consistent |
| Judge validation | Confirming judge scores agree with human grading before trusting them |
| RAGAS | Metric framework purpose-built for evaluating RAG pipelines |
| Faithfulness | % of answer claims supported by retrieved context |
| Answer relevancy | Does the answer topically address the question asked |
| Context precision | Are relevant retrieved chunks ranked near the top |
| Context recall | Is all needed information present in retrieved context |
| Before-after delta | Paired, per-category score comparison across a frozen eval set |

## RAGAS Metric Quick Reference

| Metric | Formula / logic | Reference answer needed? | Stage checked |
|---|---|---|---|
| **Faithfulness** | `supported claims / total claims` — decompose answer into atomic claims, check entailment against retrieved context | No | Generation |
| **Answer relevancy** | `mean(cosine_sim(embed(question), embed(reverse_question_i)))` — generate N reverse questions from the answer, compare to original | No | Generation |
| **Context precision** | Ranking-weighted precision@K — LLM judges each retrieved chunk's relevance, rewards relevant chunks ranked higher | No | Retrieval |
| **Context recall** | `attributable reference-answer sentences / total reference-answer sentences` | Yes | Retrieval |

**Reading the pair:** high faithfulness + low relevancy = grounded but off-topic. High
precision + low recall = retrieval too narrow. Low precision + high recall = retrieval too
noisy.

## Rule-Check vs. LLM-Judge Decision Guide

```
Can a regex / schema check / keyword rule decide this reliably?
├── YES → Use an assertion check (free, instant, deterministic)
└── NO  → Does it require judgment (tone, helpfulness, nuance)?
          ├── YES → Use LLM-as-judge
          │         └── Validate against human grading before trusting it
          └── NO  → Reconsider — most things decompose into a rule + a smaller judgment call
```

**Cost/reliability order:** assertion checks → embedding similarity → validated LLM judge.
Always default to the cheapest layer that can reliably answer the question.

## Binary vs. Graded — Quick Pick

| Use binary when... | Use 1-to-10 when... |
|---|---|
| It's a release gate (safety, schema, refusal) | You're tracking incremental quality improvement |
| Consistency matters more than nuance | Partial credit genuinely matters |
| You need a trivial pass/fail threshold | You need to detect small before/after deltas |

## Quick Reminders

- **Rules first, judge second** — never reach for an LLM judge when a rule would do.
- **Every fixed bug becomes a permanent test** — that's what a regression suite is.
- **An unvalidated judge is a confident number nobody should trust.**
- **G-Eval ≠ validation** — it reduces judge noise, it doesn't replace checking agreement with
  human labels.
- **Read RAGAS metrics as pairs**, not in isolation — faithfulness with relevancy, precision
  with recall.
- **Segment before-after deltas by category** — the aggregate score can hide a real
  regression.
- **Freeze the eval set** before comparing before/after — same cases, same scoring, same judge
  config, or the comparison is invalid.
- **Keep a holdout slice** untouched during iteration to catch eval-set overfitting.
