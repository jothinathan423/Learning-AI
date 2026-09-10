---
title: "Key Definitions and Tables"
week: 3
---

# Key Definitions and Tables

Condensed reference definitions and comparison tables for all 11 Week 3 topics.

## Core Definitions

| Term | Definition |
|---|---|
| **RAG (Retrieval-Augmented Generation)** | Pattern where relevant documents are retrieved and given to an LLM as context before it answers, instead of relying solely on training-time knowledge. |
| **Embedding** | A fixed-length numeric vector representing the meaning of a piece of text, such that semantically similar text produces nearby vectors. |
| **Dense retrieval** | Finding relevant documents by comparing embedding vectors (semantic similarity), as opposed to matching exact keywords. |
| **Sparse retrieval** | Keyword-based retrieval (e.g., BM25/TF-IDF) that scores documents by exact term overlap, weighted by term frequency and rarity. |
| **Bi-encoder** | Encodes query and document independently into vectors, compared via cosine similarity/dot product; fast, scalable, used for first-stage retrieval. |
| **Cross-encoder** | Encodes query and document together in one transformer pass, outputs a single relevance score; slow but accurate, used for reranking a shortlist. |
| **MTEB** | Massive Text Embedding Benchmark — a standardized multi-task benchmark suite for comparing embedding models. |
| **Chunking** | Splitting documents into smaller, focused pieces before embedding, so each vector represents one coherent idea. |
| **Chunk overlap** | Deliberately repeating some text between adjacent chunks so ideas spanning a boundary still appear whole in at least one chunk. |
| **Vector database** | A system for storing large numbers of embedding vectors and searching them for nearest neighbors efficiently, typically via an ANN index. |
| **ANN (Approximate Nearest Neighbor)** | Search algorithms that trade a small accuracy loss for a large speed gain versus brute-force exact search. |
| **HNSW** | Hierarchical Navigable Small World — a multi-layer graph-based ANN algorithm; the dominant default index in most modern vector databases. |
| **Top-k** | The number of highest-ranked results returned by a similarity search. |
| **Cosine similarity** | Similarity metric measuring the angle between two vectors, ignoring magnitude; the most common metric for text embeddings. |
| **Metadata filtering** | Combining exact structured constraints (access, date, language, type) with semantic vector search. |
| **Grounded generation** | Prompting/constraining an LLM to answer only from retrieved context, and to say "I don't know" when that context is insufficient. |
| **Citation (in RAG)** | A reference tying a generated claim back to the specific source chunk it came from. |

## Topic-by-Topic Condensed Summary

| # | Topic | One-line summary |
|---|---|---|
| 1 | Why RAG | LLMs are frozen and lack private/current data; RAG retrieves relevant docs at answer time instead of retraining. |
| 2 | Embeddings & Dense Retrieval | Text becomes vectors placing similar meanings nearby; retrieval ranks by vector closeness. |
| 3 | Bi-Encoder vs Cross-Encoder | Bi-encoders retrieve fast at scale; cross-encoders rerank a small shortlist with higher accuracy. |
| 4 | Embedding Models | MTEB standardizes model comparison; BGE and E5 are leading open model families alongside proprietary APIs. |
| 5 | Chunking Strategies | Fixed-size, recursive, structure-aware, and semantic chunking split documents into retrievable units. |
| 6 | Chunk Size & Overlap | ~200–500 tokens with 10–20% overlap is a common starting point; tune empirically. |
| 7 | Vector Databases & HNSW | ANN algorithms like HNSW make similarity search fast at scale via a multi-layer graph. |
| 8 | Qdrant, Chroma, Pgvector | Dedicated production engine vs. lightweight prototyping store vs. Postgres extension. |
| 9 | Similarity Search & Top-K | Cosine similarity is the standard metric; `k` and score thresholds control recall vs. noise. |
| 10 | Metadata Filtering | Combines exact structured filters (access, date, language) with semantic search; access control must be enforced at the query layer. |
| 11 | Grounded Generation & Citations | Force answers to come only from retrieved context, cite sources, and say "I don't know" otherwise. |

## Comparison Table: Embedding Model Families

| Family | Type | Notable trait | Typical use |
|---|---|---|---|
| OpenAI `text-embedding-3-*` | Proprietary API | Supports dimension truncation (Matryoshka-style) | Fast setup, no self-hosting |
| Cohere `embed-v3` | Proprietary API | Strong multilingual support | Enterprise multilingual search |
| BGE (BAAI) | Open-weight | Consistently top-ranked on MTEB retrieval; `bge-m3` adds multilingual + multi-vector | Self-hosted, cost-sensitive at scale |
| E5 (Microsoft) | Open-weight | Popularized `query:`/`passage:` prefix convention | Self-hosted, asymmetric retrieval |

## Comparison Table: Vector Databases

| | Qdrant | Chroma | Pgvector |
|---|---|---|---|
| Type | Dedicated vector DB | Lightweight/embedded store | Postgres extension |
| Best for | Production scale, rich filtering | Prototyping, small apps | Teams already on Postgres |
| Index | HNSW + quantization | HNSW (via library) | HNSW or IVFFlat |
| Transactions | Own consistency model | Own consistency model | Full Postgres ACID |

## Similarity Metrics Quick Reference

| Metric | Measures | Typical use |
|---|---|---|
| Cosine similarity | Angle between vectors | Default for text embeddings |
| Dot product | Cosine × magnitude | Equivalent to cosine on normalized vectors; cheaper to compute |
| Euclidean (L2) distance | Straight-line distance | Less common for text; smaller = more similar |

## Chunk Size Rules of Thumb

| Content type | Suggested chunk size | Overlap |
|---|---|---|
| General prose / knowledge base | 200–500 tokens | 10–20% |
| Dense legal/technical text | Higher end (400–500+ tokens) | 15–20% |
| FAQ / short Q&A pairs | One pair per chunk | Little to none |
