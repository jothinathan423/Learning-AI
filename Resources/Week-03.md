---
title: "Week 3 Resources — Retrieval & RAG"
---

# Week 3 Resources — Retrieval & RAG

Curated further reading for RAG fundamentals, embeddings and dense retrieval, chunking, vector
databases, and grounded generation.

## Beginner

- **Pinecone's learning center articles on vector search and RAG** (Blog) — vendor-written but
  vendor-neutral in substance; some of the clearest plain-language explanations of embeddings
  and nearest-neighbor search available.
- **"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)**
  (Research Paper) — the original RAG paper; short enough to read end to end even as a first
  paper.
- **LangChain documentation — "Retrieval" section** (Official Docs) — a practical, code-adjacent
  tour of the same pipeline this week covers (load → split → embed → store → retrieve).
- **Qdrant's and Chroma's own "getting started" documentation** (Official Docs) — the fastest
  way to see chunking and embedding storage as actual API calls rather than diagrams.

## Intermediate

- **MTEB (Massive Text Embedding Benchmark) leaderboard and paper (Muennighoff et al., 2022)**
  (Research Paper / Benchmark) — the standard reference for comparing embedding models named in
  Topic 04.
- **"Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks" (Reimers & Gurevych, 2019)**
  (Research Paper) — the paper that popularized the bi-encoder architecture used by nearly every
  production embedding model today.
- **Pinecone's and Weaviate's blog posts on chunking strategies** (Blog) — practitioner-level
  writeups with concrete chunk-size/overlap recommendations, a good complement to Topic 06.
- **pgvector's official GitHub README** (GitHub / Official Docs) — the primary source for what
  Postgres-as-a-vector-store actually supports, since this changes across releases.

## Advanced

- **"Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable
  Small World Graphs" (Malkov & Yashunin, 2018)** (Research Paper) — the original HNSW paper
  behind Topic 07; dense but the diagrams alone are worth it.
- **"Dense Passage Retrieval for Open-Domain Question Answering" (Karpukhin et al., 2020)**
  (Research Paper) — the paper that established dense retrieval as competitive with classical
  IR, a direct precursor to modern RAG pipelines.
- **BGE ("BAAI General Embedding") and E5 model cards and technical reports** (Research Paper /
  Official Docs) — the primary documentation for the two embedding-model families named in
  Topic 04, including their training recipes.
- **"Lost in the Middle: How Language Models Use Long Contexts" (Liu et al., 2023)** (Research
  Paper) — explains why simply retrieving more chunks and stuffing them into context doesn't
  reliably improve grounded generation, a useful caution alongside Topic 11.

[Back to Resources index](/Resources/) · [Week 3](/Week-03/README)
