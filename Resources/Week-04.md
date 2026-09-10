---
title: "Week 4 Resources — Hybrid Search, Reranking & Retrieval Debugging"
---

# Week 4 Resources — Hybrid Search, Reranking & Retrieval Debugging

Curated further reading for BM25, hybrid search, reranking, query rewriting/HyDE, and retrieval
evaluation metrics.

## Beginner

- **Elastic's (Elasticsearch) documentation on BM25** (Official Docs) — BM25 is the default
  scoring algorithm in Elasticsearch/OpenSearch, so their own docs double as a practical BM25
  reference beyond the math.
- **Pinecone's learning center article on hybrid search** (Blog) — a vendor-neutral-in-substance
  explanation of why combining keyword and semantic search outperforms either alone.
- **Cohere's Rerank product documentation (Official Docs)** — the primary reference for how a
  hosted reranker API actually works, directly relevant to Topic 07.
- **"What is Reciprocal Rank Fusion?" style explainer posts from vector-DB vendor blogs** (Blog)
  — short, worked-example explanations of RRF scoring that complement Topic 05's formula.

## Intermediate

- **"The Probabilistic Relevance Framework: BM25 and Beyond" (Robertson & Zaragoza, 2009)**
  (Research Paper) — the definitive reference on where BM25 comes from and why its formula has
  the shape it does.
- **"Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods" (Cormack,
  Clarke, Buettcher, 2009)** (Research Paper) — the original RRF paper behind Topic 05.
- **BGE reranker and Cohere Rerank model documentation/technical blog posts** (Official Docs /
  Blog) — direct comparison material for choosing between a hosted and open-weight reranker, as
  Topic 07 discusses.
- **"Maximal Marginal Relevance" (Carbonell & Goldstein, 1998)** (Research Paper) — the original
  MMR paper; short and still the standard citation for relevance/diversity trade-offs.

## Advanced

- **"Precise Zero-Shot Dense Retrieval without Relevance Labels" (Gao et al., 2022 — the HyDE
  paper)** (Research Paper) — the original Hypothetical Document Embeddings paper behind
  Topic 10.
- **"Query Rewriting for Retrieval-Augmented Large Language Models" (Ma et al., 2023)** (Research
  Paper) — an academic treatment of query rewriting specifically in RAG pipelines, extending
  Topic 09.
- **MTEB retrieval-task leaderboard and its underlying evaluation methodology** (Benchmark /
  Research Paper) — the standard reference for how hit-rate@k, recall@k, and MRR are actually
  computed at scale, useful for validating your own Topic 11 metric implementations.
- **"Rerankers and Two-Stage Retrieval" chapter-style writeups from information-retrieval
  textbooks or course notes (e.g. Pinecone's or Weaviate's engineering blogs)** (Blog) — deeper
  practitioner detail on why two-stage (retrieve-then-rerank) pipelines dominate production
  search systems.

[Back to Resources index](/Resources/) · [Week 4](/Week-04/README)
