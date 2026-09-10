---
title: "Week 1 Resources — Foundations"
---

# Week 1 Resources — Foundations

Curated further reading for language models, tokenization, cost, context windows, embeddings,
sampling, model families, and hallucination. Pair these with `Week-01/Topics/*` — nothing here
is required reading, just good next stops.

## Beginner

- **"What is a Large Language Model?" — Anthropic's own explainer** (Blog / Official Docs) — a
  plain-language framing of next-token prediction from the company whose models you're likely
  using day to day.
- **OpenAI's tokenizer playground ("Tokenizer" tool on platform.openai.com)** (Official Docs /
  Interactive Tool) — paste text and watch it get split into tokens; the fastest way to build
  intuition for why token count isn't word count.
- **"The Illustrated Transformer" by Jay Alammar** (Blog) — the most widely recommended visual
  walkthrough of how transformer models process text; a gentle on-ramp before the denser papers.
  Also see this author's earlier "The Illustrated Word2vec" for embeddings intuition.
  no fabricated URL — searchable as `jalammar.github.io`.
- **Anthropic and OpenAI model pricing pages** (Official Docs) — read the actual per-token
  pricing tables for current model tiers; this is the fastest way to internalize why "cost per
  token" is a real engineering constraint, not a trivia fact.

## Intermediate

- **"Word2Vec" (Mikolov et al., 2013)** (Research Paper) — the original skip-gram / CBOW paper;
  useful for understanding static embeddings before contextual ones replaced them.
- **"GloVe: Global Vectors for Word Representation" (Pennington, Socher, Manning, 2014)**
  (Research Paper) — the co-occurrence-matrix alternative to Word2Vec; worth skimming to see two
  different paths to the same idea.
- **Hugging Face's "NLP Course" — chapter on tokenizers** (Official Docs / Course) — covers BPE,
  WordPiece, and SentencePiece with runnable code, directly extending what Topic 02 covers.
  no fabricated URL — searchable as `huggingface.co/course`.
- **Anthropic's and OpenAI's model/context-window documentation pages** (Official Docs) — the
  primary source for exact context limits per model, which change over time and shouldn't be
  memorized from secondary sources.

## Advanced

- **"Attention Is All You Need" (Vaswani et al., 2017)** (Research Paper) — the transformer
  paper itself; even a partial read makes every later "how transformers work" explainer click
  into place.
- **"Language Models are Few-Shot Learners" (GPT-3 paper, Brown et al., 2020)** (Research Paper)
  — the paper that established in-context learning and scaling behavior as a serious research
  direction, foundational to why "model families" differ the way they do.
- **"Survey of Hallucination in Natural Language Generation" (Ji et al., 2022)** (Research
  Paper) — a broad academic survey of why generation models hallucinate, useful once Topic 11's
  practitioner framing feels too shallow.
- **Andrej Karpathy's "Let's build the GPT Tokenizer" (video)** (Video) — a from-scratch,
  code-along walkthrough of BPE tokenization for readers who want to implement one, not just use
  one.

[Back to Resources index](/Resources/) · [Week 1](/Week-01/README)
