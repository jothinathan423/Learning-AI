# Week 6 — Key Definitions and Comparison Tables

Condensed reference definitions for all 11 topics, plus the comparison tables you'll want
quick access to without re-reading full topic pages.

## Core Definitions

| Term | Definition |
|---|---|
| **Eval set** | A curated, versioned collection of test cases (input + expected behavior + scoring method) used to measure an AI system's quality automatically and repeatably. |
| **Regression test (from a failure)** | An eval case derived from a real, documented bug — added to the permanent suite only after the fix is verified to pass it, so the specific failure can never silently reappear. |
| **Assertion check** | A deterministic, rule-based test (regex, schema validation, keyword/presence check) on a mechanical output property. Free, instant, fully consistent. |
| **LLM-as-judge** | Using an LLM call to grade another system's output for qualities a rule can't check (tone, helpfulness, nuanced correctness), via pointwise or pairwise judgment. |
| **G-Eval** | An LLM-as-judge method that auto-generates chain-of-thought evaluation steps from stated criteria, then computes a probability-weighted average score across possible score values instead of a single sampled token. |
| **Binary scoring** | Pass/fail scale — high consistency, no partial credit; best for gates (safety, schema, refusal correctness). |
| **1-to-10 (graded) scoring** | A finer-grained scale that captures partial improvement, but is harder to keep consistent — needs rubric anchoring or G-Eval-style weighting to avoid drift. |
| **Judge validation** | Confirming an LLM judge's scores agree with human grading (via accuracy/kappa/correlation on a stratified sample) before trusting the judge for real decisions. |
| **RAGAS** | Retrieval-Augmented Generation Assessment — an open-source metric framework purpose-built for evaluating RAG pipelines. |
| **Faithfulness** | RAGAS metric: proportion of the generated answer's atomic claims that are supported by the retrieved context. Measures generation-step groundedness, not real-world truth. |
| **Answer relevancy** | RAGAS metric: how well the answer topically addresses the original question, computed via reverse-engineered questions from the answer and their embedding similarity to the real question. |
| **Context precision** | RAGAS metric: whether relevant retrieved chunks are ranked near the top of the retrieved list (ranking-weighted precision@K, LLM-judged relevance). |
| **Context recall** | RAGAS metric: whether all information needed for a correct answer (per a reference answer) is present somewhere in the retrieved context (attributable-sentence ratio). |
| **Before-after delta** | A paired, per-category comparison of eval scores on a frozen eval set, run before and after a change, used to determine whether the change genuinely helped. |

## Evaluation Hierarchy (Cost / Reliability Order)

| Layer | Cost/Speed | Reliability | Use for |
|---|---|---|---|
| Assertion checks | Free, instant | Perfectly consistent | Format, presence, refusal correctness, schema validity |
| Embedding/similarity checks | Cheap, fast | Good for semantic closeness | "Is this close to a reference answer" without exact wording |
| LLM-as-judge (validated) | Slower, real $ cost | Only as reliable as its validation | Tone, helpfulness, nuanced correctness, RAGAS metrics |

## Binary vs. 1-to-10 Scoring

| Aspect | Binary | 1-to-10 (graded) |
|---|---|---|
| Consistency | High | Lower — needs rubric anchoring |
| Granularity | None | High — shows partial progress |
| Best for | Release gates, safety, schema checks | Nuanced qualities, incremental improvement tracking |
| Aggregation | Pass rate (%) | Mean/median, watch for scale drift |
| Failure mode | Loses "how badly did it fail" detail | Central tendency bias (graders cluster on safe middle numbers) |

## Judge Validation Agreement Metrics

| Judge output type | Metric to use | Why |
|---|---|---|
| Binary pass/fail | Accuracy, precision/recall, Cohen's Kappa | Kappa corrects for chance agreement, esp. with imbalanced pass/fail rates |
| Categorical (multi-class) | Cohen's Kappa | Same reasoning as above, across multiple label classes |
| Graded/continuous | Pearson or Spearman correlation | Measures whether ranking/scale tracks human judgment, not just exact matches |

## RAGAS Metrics Quick Comparison

| Metric | Question it answers | Needs reference answer? | Failure it catches |
|---|---|---|---|
| Faithfulness | Is every claim in the answer supported by retrieved context? | No | Hallucination beyond retrieved context |
| Answer relevancy | Does the answer address the actual question asked? | No | Off-topic, incomplete, padded, evasive answers |
| Context precision | Are relevant retrieved chunks ranked near the top? | No | Noisy/irrelevant retrieval, poor ranking |
| Context recall | Is all needed information present in retrieved context? | Yes | Missing/incomplete retrieval |

## Before-After Delta Checklist

| Requirement | Why it matters |
|---|---|
| Frozen eval set (same cases both runs) | Otherwise the comparison isn't valid |
| Identical scoring/judge configuration | Judge prompt or temperature drift invalidates the comparison |
| Segmented by category, not just aggregate | Aggregate improvement can hide a category-level regression |
| Paired, per-case comparison | Controls for case-level difficulty differences |
| Untouched holdout slice | Guards against overfitting the eval set (Goodhart's Law) |
