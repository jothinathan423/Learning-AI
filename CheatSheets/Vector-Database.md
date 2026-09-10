---
title: "Vector Database"
---

# Vector Database — Master Cheat Sheet

Cross-week reference (Week 3) plus general industry landscape.

## Core Terminology

| Term | Meaning |
|---|---|
| Vector database | Stores vectors + metadata; searches via an ANN index |
| ANN | Approximate Nearest Neighbor — trades perfect recall for speed at scale |
| HNSW | Hierarchical Navigable Small World — multi-layer graph ANN index |
| IVF (IVFFlat) | Inverted File index — clusters vectors, searches nearest clusters only |
| Quantization | Compressing vectors (e.g., scalar/product quantization) to save memory |
| Metadata filtering | Combining exact structured filters (date, tag, tenant) with semantic search |
| Filter-aware ANN | Index applies filters *during* graph traversal, not after (avoids over-fetching) |
| Namespace/collection | Logical partition of vectors within a database |
| Upsert | Insert-or-update a vector + its metadata |

## Vector Database Comparison

| | Qdrant | Chroma | Pgvector | Pinecone | Weaviate | Milvus |
|---|---|---|---|---|---|---|
| Best for | Production scale, rich filtering | Prototyping, small apps | Existing Postgres stack | Managed, zero-ops scale | Hybrid search + schema | Very large scale, self-hosted |
| Index | HNSW + quantization | HNSW | HNSW / IVFFlat | Proprietary ANN | HNSW | IVF/HNSW/DiskANN, pluggable |
| Filtering | Filter-aware ANN, first-class | Simpler | Full SQL | Metadata filters | GraphQL filters | Rich filtering |
| Hosting | Self-host or cloud | Self-host / embedded | Self-host (it's Postgres) | Fully managed only | Self-host or cloud | Self-host or cloud |
| Transactions | Own model | Own model | Full ACID | N/A | Own model | Own model |
| Ops overhead | Low-medium | Very low | None (if already on Postgres) | None (managed) | Medium | Higher (distributed) |

## Decision Quick Reference

| Situation | Pick |
|---|---|
| Already run Postgres, moderate scale | Pgvector — no new infra |
| Prototype / notebook / small app | Chroma |
| Production RAG, need strong filtering + self-host | Qdrant |
| Want zero ops, willing to pay for managed | Pinecone |
| Need hybrid search + GraphQL schema | Weaviate |
| Billion-scale vectors, dedicated infra team | Milvus |

## Indexing Algorithms

| Algorithm | Idea | Tradeoff |
|---|---|---|
| Flat / brute-force | Compare query to every vector | Exact, but O(n) — fine only for small n |
| HNSW | Multi-layer navigable graph, greedy search down layers | Fast + high recall; more memory |
| IVF | Cluster vectors (k-means-like), search nearest clusters | Faster than flat; recall depends on cluster count probed |
| Product quantization | Compress vector into small codes | Big memory savings; some recall loss |

## Similarity Metrics

| Metric | Notes |
|---|---|
| Cosine similarity | Default for text embeddings; angle only |
| Dot product | Same as cosine on normalized vectors; cheaper to compute |
| Euclidean (L2) | Straight-line distance; smaller = more similar |

## Query Shape (conceptual)

```
search(
  vector=embed(query),
  top_k=20,
  filter={ "tenant_id": "acme", "status": "published" },
  score_threshold=0.75
) -> [(id, score, metadata), ...]
```

## Quick Reminders

- Metadata filters should be evaluated *by the index*, not by fetching top_k then filtering in
  app code — the latter silently under-returns results.
- Access control (who can see what) belongs in the DB query filter, never bolted on after retrieval.
- HNSW recall/speed is tunable (ef_search, ef_construction, M) — defaults are rarely optimal at scale.
- Re-index (or at least re-upsert) whenever the embedding model changes — old and new vectors
  are not comparable.
- Managed vector DBs remove ops burden but add vendor lock-in and per-query/storage cost — weigh
  against self-hosting for high-volume steady-state workloads.
- A vector DB is not a replacement for a relational DB — keep source-of-truth structured data
  where it belongs, store vectors + minimal metadata for retrieval.
