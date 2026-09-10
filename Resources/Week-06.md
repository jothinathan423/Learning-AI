---
title: "Week 6 Resources — Evals, LLM-as-Judge & RAGAS"
---

# Week 6 Resources — Evals, LLM-as-Judge & RAGAS

Curated further reading for eval sets, regression testing, assertion checks, LLM-as-judge,
G-Eval, judge validation, and the RAGAS metric family.

## Beginner

- **RAGAS official documentation (Official Docs / GitHub)** — the primary source for
  faithfulness, answer relevancy, and context precision/recall; read this before any secondary
  blog post since the metrics' exact definitions matter.
- **OpenAI's and Anthropic's evals documentation/cookbooks** (Official Docs) — vendor-provided
  guidance and tooling for building eval sets and running them against your own prompts.
- **Hamel Husain's and Eugene Yan's blog posts on "LLM evals"** (Blog) — widely cited
  practitioner writeups that walk through building an eval set from real failures, directly
  extending Week 5's error analysis into Week 6's measurement.

## Intermediate

- **"Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (Zheng et al., 2023)** (Research
  Paper) — the paper that established LLM-as-judge as a validated evaluation technique, including
  its known biases (position bias, verbosity bias) — essential context for Topic 07's judge
  validation.
- **"G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment" (Liu et al., 2023)**
  (Research Paper) — the original G-Eval paper behind Topic 05, covering chain-of-thought
  prompting and probability-weighted scoring for judges.
- **"RAGAS: Automated Evaluation of Retrieval Augmented Generation" (Es et al., 2023)** (Research
  Paper) — the original RAGAS paper defining faithfulness and answer relevancy formally, useful
  once the docs-level explanation isn't enough.
- **DeepEval documentation (Official Docs / GitHub)** — an alternative open-source eval framework
  to compare against RAGAS/G-Eval approaches; useful for seeing how different tools implement
  similar ideas.

## Advanced

- **"Holistic Evaluation of Language Models (HELM)" (Liang et al., 2022)** (Research Paper) — a
  large-scale academic framework for LLM evaluation across many axes; useful context for how
  broad benchmarks relate to (and differ from) the app-specific evals this week focuses on.
- **Cohen's Kappa and inter-rater reliability literature (statistics references)** (Research
  Paper / Textbook) — the formal statistical grounding for "does my LLM judge agree with human
  graders," which Topic 07 treats practically but which has a full academic literature behind it.
- **"Truthful AI" and hallucination-detection benchmark papers (e.g. TruthfulQA, Lin et al.,
  2021)** (Research Paper) — relevant background for faithfulness-style metrics and why
  hallucination detection is measured the way it is.
- **Engineering blog posts from AI companies describing production eval pipelines at scale**
  (Blog) — first-hand accounts of before/after regression testing (Topic 11) applied to real
  deploy pipelines, not just toy examples.

[Back to Resources index](/Resources/) · [Week 6](/Week-06/README)
