# Week 6: Evals — Measuring Whether a Change Actually Helped

Week 5 taught you to *name* what's wrong with your AI app — reading traces, tagging failure
modes, and ranking them by frequency and severity. That's diagnosis. This week is treatment
infrastructure: you build the machine that turns "I think this prompt change helped" into
"this prompt change moved faithfulness from 0.71 to 0.89 and didn't touch the other four
error categories." Every future change — a new prompt, a different model, a reranker swap —
gets run through this machine and comes out with a number instead of a vibe. You'll build
eval sets from real failures, write cheap rule-based checks before reaching for anything
expensive, use an LLM to judge the things rules can't (tone, helpfulness, faithfulness), and —
critically — validate that your LLM judge actually agrees with your own human judgment before
you let it make decisions for you. You'll also learn the RAGAS metric family for scoring RAG
pipelines specifically, and how to read a before-and-after score change per problem type so a
win in one area doesn't hide a regression somewhere else.

This is, by the syllabus's own framing, **the single most important skill in the whole
program** — everything after this week (agents, memory, tool design) is only trustworthy if
you can measure whether it's actually working.

- **Estimated reading time:** ~100 minutes across all topics
- **Difficulty:** Intermediate → Advanced
- **Prerequisites:** Week 5 — Error Analysis (complete traces, open coding, error taxonomy,
  frequency × severity prioritization, and the discipline of writing a prediction before you
  look at results). This week assumes you already have a labeled set of real failures to work
  from.

## What You'll Master After This Week

- Building an eval set: real questions paired with a concrete way to score the answer.
- Converting yesterday's bug into tomorrow's permanent regression test.
- Writing free, deterministic assertion checks before reaching for an LLM judge.
- Designing an LLM-as-judge prompt, and knowing when a judge is the right tool at all.
- The G-Eval method for making LLM judges more consistent using chain-of-thought and
  probability-weighted scoring.
- Choosing between binary (pass/fail) and 1–10 graded scoring for a given check.
- Validating that your judge agrees with human grading *before* trusting its numbers.
- The three core RAGAS metrics for RAG pipelines: faithfulness, answer relevancy, and
  context precision/recall — what each one actually measures and how it's computed.
- Reading a before-and-after score delta correctly, broken down per problem type, so you can
  tell whether a change was a genuine improvement or a trade of one failure mode for another.

## Topics Covered

1. [Eval Sets](/Week-06/Topics/01-Eval-Sets)
2. [Regression Tests From Failures](/Week-06/Topics/02-Regression-Tests-From-Failures)
3. [Assertion Checks](/Week-06/Topics/03-Assertion-Checks)
4. [LLM-As-Judge](/Week-06/Topics/04-LLM-As-Judge)
5. [G-Eval](/Week-06/Topics/05-G-Eval)
6. [Binary vs 1-to-10 Scoring](/Week-06/Topics/06-Binary-Vs-1-To-10-Scoring)
7. [Judge Validation](/Week-06/Topics/07-Judge-Validation)
8. [RAGAS Faithfulness](/Week-06/Topics/08-RAGAS-Faithfulness)
9. [RAGAS Answer Relevancy](/Week-06/Topics/09-RAGAS-Answer-Relevancy)
10. [RAGAS Context Precision And Recall](/Week-06/Topics/10-RAGAS-Context-Precision-And-Recall)
11. [Before-After Deltas](/Week-06/Topics/11-Before-After-Deltas)

## Reading Progress Checklist

- [ ] 01. Eval Sets
- [ ] 02. Regression Tests From Failures
- [ ] 03. Assertion Checks
- [ ] 04. LLM-As-Judge
- [ ] 05. G-Eval
- [ ] 06. Binary vs 1-to-10 Scoring
- [ ] 07. Judge Validation
- [ ] 08. RAGAS Faithfulness
- [ ] 09. RAGAS Answer Relevancy
- [ ] 10. RAGAS Context Precision And Recall
- [ ] 11. Before-After Deltas
- [ ] Review Cheat Sheet
- [ ] Complete Revision
