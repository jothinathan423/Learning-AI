---
title: "Embeddings"
---

# Embeddings — Master Cheat Sheet

Cross-week reference: Week 1 (word embeddings) + Week 3 (dense retrieval, embedding models).

## Core Terminology

| Term | Meaning |
|---|---|
| Embedding | Numeric vector representing the meaning of text (word, sentence, chunk) |
| Static embedding | One fixed vector per word regardless of context (Word2Vec, GloVe) |
| Contextual embedding | Fresh vector per occurrence, shaped by surrounding context (Transformer-based) |
| Dimensionality | Length of the vector (e.g., 384, 768, 1536, 3072) |
| Bi-encoder | Encodes two texts independently into vectors, compared after the fact (fast) |
| Cross-encoder | Encodes two texts together, outputs one relevance score (slow, accurate) |
| Cosine similarity | Angle between vectors; standard text-embedding similarity metric |
| Dot product | Cosine × magnitude; equal to cosine on normalized vectors, cheaper to compute |
| Normalization | Scaling a vector to unit length so dot product ≈ cosine |
| MTEB | Massive Text Embedding Benchmark — standard multi-task leaderboard |
| Matryoshka embeddings | Trained so a prefix of the vector is itself a valid, smaller embedding |
| Fine-tuned embeddings | Base embedding model further trained on domain-specific pairs |

## Vector Arithmetic (Word2Vec-era intuition, still useful mental model)

```
vector("king") - vector("man") + vector("woman") ≈ vector("queen")
similarity(A, B) = cosine(A, B) = (A · B) / (|A| |B|)
```

Contextual embeddings (BERT/GPT-style) don't support this arithmetic as cleanly — each
occurrence's vector already reflects its sentence, so "meaning" is context-baked-in, not
composable the same way.

## Static vs Contextual Embeddings

| | Static (Word2Vec, GloVe) | Contextual (Transformer) |
|---|---|---|
| Vectors per word | One, fixed | One per occurrence |
| Handles polysemy ("bank") | No | Yes |
| Training signal | Co-occurrence in a window | Full sentence via attention |
| Typical use today | Legacy, lightweight NLP | Search, RAG, classification, clustering |

## Embedding Model Comparison (general knowledge + Week 3)

| Model family | Provider | Dim | Notes |
|---|---|---|---|
| text-embedding-3-small/large | OpenAI | 1536 / 3072 | Hosted API, strong general baseline, supports dim truncation |
| Cohere embed-v3/v4 | Cohere | 1024+ | Hosted, strong multilingual + retrieval-tuned variants |
| BGE (BAAI) | Open-weight | 384-1024 | Self-hostable, strong MTEB scores, many sizes |
| E5 | Open-weight | 384-1024 | Self-hostable, needs "query:"/"passage:" prefixing |
| sentence-transformers (all-MiniLM etc.) | Open-weight | 384 | Lightweight, fast, good for prototyping |

## Choosing an Embedding Model

| Priority | Lean toward |
|---|---|
| Zero ops, best-effort quality | Hosted API (OpenAI, Cohere) |
| Data must stay in-house | Self-hosted open-weight (BGE, E5) |
| Low latency / edge / high volume | Small open-weight models (MiniLM-class) |
| Domain-specific jargon (legal, medical, code) | Fine-tune or pick a domain-tuned model |
| Multilingual corpus | Cohere multilingual or BGE-M3 |

## Similarity Metrics Quick Reference

| Metric | Measures | Notes |
|---|---|---|
| Cosine similarity | Angle only | Default for text; range -1 to 1 |
| Dot product | Angle + magnitude | Same as cosine if vectors normalized; cheaper |
| Euclidean (L2) | Straight-line distance | Less common for text; smaller = more similar |

## Quick Reminders

- Always use the **same embedding model** for indexing and querying — vectors from different
  models are not comparable.
- Normalize vectors if your vector DB assumes it (many default to cosine/dot on normalized data).
- Higher dimensions ≠ automatically better — check MTEB retrieval scores for your task, not just size.
- Re-embed the entire corpus whenever you switch embedding models or model versions.
- Embeddings capture *semantic similarity*, not *factual correctness* — a near vector can still
  be a wrong or outdated document.
- Sentence/passage embeddings ≠ word embeddings — most retrieval work today embeds chunks, not
  individual words.
- Embedding cost is usually per-token and cheap relative to generation — but re-embedding a large
  corpus repeatedly (e.g., on every deploy) adds up.
