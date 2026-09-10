---
title: "Week 3 Cheat Sheet"
week: 3
---

# Week 3 Cheat Sheet — Retrieval & RAG

## Key Terminology

| Term | Meaning |
|---|---|
| RAG | Retrieve relevant docs, then generate an answer grounded in them |
| Embedding | Vector representing text meaning; similar meaning = nearby vectors |
| Dense retrieval | Search by vector similarity (meaning) |
| Sparse retrieval | Search by exact keyword overlap (BM25/TF-IDF) |
| Bi-encoder | Encodes query/doc separately; fast; first-stage retrieval |
| Cross-encoder | Encodes query+doc together; slow, accurate; reranking |
| MTEB | Standard multi-task benchmark for comparing embedding models |
| Chunking | Splitting documents into focused, embeddable/retrievable units |
| Chunk overlap | Shared text between adjacent chunks to preserve boundary-spanning ideas |
| Vector database | Stores vectors + metadata; searches via ANN index (e.g., HNSW) |
| HNSW | Hierarchical Navigable Small World — multi-layer graph ANN algorithm |
| Top-k | Number of highest-ranked results returned by similarity search |
| Metadata filtering | Combining exact structured filters with semantic search |
| Grounded generation | Answer only from retrieved context; say "I don't know" otherwise |
| Citation | Reference tying a claim back to its source chunk |

## Chunk Size Rules of Thumb

| Content type | Chunk size | Overlap |
|---|---|---|
| General prose / KB articles | 200–500 tokens | 10–20% |
| Dense legal/technical | 400–500+ tokens | 15–20% |
| FAQ / short Q&A | ~1 pair per chunk | Little/none |

**Always count tokens with the real tokenizer** for your embedding model/LLM — character
count is not a reliable proxy across languages and content types.

## Vector Database Quick Comparison

| | Qdrant | Chroma | Pgvector |
|---|---|---|---|
| Best for | Production scale, rich filtering | Prototyping, small apps | Existing Postgres stack |
| Index | HNSW + quantization | HNSW | HNSW / IVFFlat |
| Filtering | Filter-aware ANN, first-class | Simpler | Full SQL |
| Transactions | Own model | Own model | Full ACID |

## Similarity Metrics Quick Reference

| Metric | Measures | Notes |
|---|---|---|
| Cosine similarity | Angle between vectors | Default for text embeddings; range -1 to 1 |
| Dot product | Cosine × magnitude | Same as cosine on normalized vectors; cheaper |
| Euclidean (L2) | Straight-line distance | Less common for text; smaller = more similar |

## Retrieval Pipeline in One Line

`Chunk → Embed → Store (vector DB, HNSW) → Embed query → Similarity search + metadata filter
→ Threshold check → (optional rerank) → Grounded prompt with citations → LLM answer`

## Quick Reminders

- Same embedding model for indexing AND querying — always.
- Attach metadata (source, section, page, date, access tags) at chunking time — not later.
- Set a minimum similarity score threshold, not just a fixed `top_k`.
- Retrieve broad (e.g., top 50) → rerank with cross-encoder → keep narrow (top 3–5) for the
  LLM prompt.
- Enforce access-control filters at the database query layer, never at the prompt/LLM layer.
- "I don't know" is a correct answer when the documents don't cover the topic — never treat
  it as a bug to prompt away.
- Re-embed the entire corpus if you ever switch embedding models.
- Debugging a wrong answer: check the retrieved chunk first (retrieval bug) before assuming
  the LLM is at fault (generation bug).
