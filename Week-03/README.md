---
title: "Week 3 — Retrieval & RAG"
week: 3
---

# Week 3 — Retrieval & RAG

Out of the box, an AI chatbot only knows what it read during training on the public
internet. It has never seen your company's handbook, your product docs, or last quarter's
incident reports — and if you ask it about them, it will often answer confidently anyway,
just wrong. This week is about fixing that with **RAG (Retrieval-Augmented Generation)**: a
pattern where you first find the small set of your own documents that are actually relevant
to a question, hand only those to the model as context, and have it answer *from* that
context instead of from memory. You'll learn the full pipeline end to end — loading
documents, splitting them into chunks, turning chunks into searchable number vectors
("embeddings"), storing and searching those vectors at scale, and finally forcing the model
to ground its answer in what it retrieved and cite where the answer came from. By the end of
the week you'll understand not just how to wire a RAG system together, but *why* each piece
exists and where each one commonly breaks in production.

- **Estimated reading time:** 6–7 hours for all 11 topics plus notes and revision material
- **Difficulty level:** Intermediate
- **Prerequisites:**
  - Week 1 — basic understanding of embeddings and how LLMs represent text as vectors
  - Week 2 — structured output and tool calling (RAG answers are often returned as structured,
    citation-bearing responses, and retrieval is frequently exposed to the model as a tool)

## What You'll Master After This Week

- Explain why RAG exists and when it's the right tool versus fine-tuning or a bigger context
  window
- Understand embeddings and dense retrieval well enough to reason about why semantic search
  finds meaning, not just keywords
- Tell bi-encoders and cross-encoders apart and know which stage of a pipeline each belongs in
- Evaluate and choose an embedding model using benchmarks like MTEB, and compare families such
  as BGE and E5
- Design a chunking strategy for a real document set, and tune chunk size and overlap with
  concrete rules of thumb
- Understand how vector databases find nearest neighbors fast using ANN algorithms like HNSW
- Compare Qdrant, Chroma, and pgvector and pick the right one for a given deployment
- Reason about similarity metrics (cosine, dot product, Euclidean) and how to choose `top_k`
- Combine metadata filtering with vector search for permissioned, multi-tenant, or
  time-sensitive retrieval
- Build prompts that ground the model in retrieved evidence, force citations, and make it say
  "I don't know" instead of guessing

## Topics Covered

1. [Why RAG](./Topics/01-Why-RAG.md)
2. [Embeddings and Dense Retrieval](./Topics/02-Embeddings-And-Dense-Retrieval.md)
3. [Bi-Encoder vs Cross-Encoder](./Topics/03-Bi-Encoder-Vs-Cross-Encoder.md)
4. [Embedding Models (MTEB, BGE, E5)](./Topics/04-Embedding-Models.md)
5. [Chunking Strategies](./Topics/05-Chunking-Strategies.md)
6. [Chunk Size and Overlap](./Topics/06-Chunk-Size-And-Overlap.md)
7. [Vector Databases and HNSW](./Topics/07-Vector-Databases-HNSW.md)
8. [Qdrant, Chroma, and Pgvector](./Topics/08-Qdrant-Chroma-Pgvector.md)
9. [Similarity Search and Top-K](./Topics/09-Similarity-Search-And-Top-K.md)
10. [Metadata Filtering](./Topics/10-Metadata-Filtering.md)
11. [Grounded Generation and Citations](./Topics/11-Grounded-Generation-And-Citations.md)

## Reading Progress Checklist

- [ ] 01 — Why RAG
- [ ] 02 — Embeddings and Dense Retrieval
- [ ] 03 — Bi-Encoder vs Cross-Encoder
- [ ] 04 — Embedding Models (MTEB, BGE, E5)
- [ ] 05 — Chunking Strategies
- [ ] 06 — Chunk Size and Overlap
- [ ] 07 — Vector Databases and HNSW
- [ ] 08 — Qdrant, Chroma, and Pgvector
- [ ] 09 — Similarity Search and Top-K
- [ ] 10 — Metadata Filtering
- [ ] 11 — Grounded Generation and Citations
- [ ] Review Cheat Sheet
- [ ] Complete Revision
