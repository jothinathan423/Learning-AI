---
title: "Week 4: Debugging Retrieval — Hybrid, Reranking & Failure Separation"
week: 4
difficulty: Intermediate-to-Advanced
readingTime: "95 min (full week)"
---

# Week 4: Debugging Retrieval — Hybrid, Reranking & Failure Separation

## Learning Summary

Your document Q&A app from Week 3 works — most of the time. But "it's wrong sometimes" is not
a fixable bug report; it's a shrug. This week you learn to split every wrong answer into one of
two completely different failure modes: the app **fetched the wrong document** (a retrieval
failure), or it **fetched the right document and still answered badly** (a generation failure).
These two failures have different root causes and different fixes, and treating one as the
other wastes time and money — swapping in a smarter, more expensive LLM does nothing if the
retriever never gave it the right chunk to read. You'll build a simple side-by-side inspection
view to see what actually got retrieved, add keyword search (BM25) alongside your existing
meaning-based (dense/semantic) search so exact codes and rare terms stop disappearing, fuse the
two result lists with Reciprocal Rank Fusion, add a reranking pass with a cross-encoder to push
the single best match to the top, rewrite messy user questions into better search queries
(including the HyDE trick of searching with a fake answer instead of the question), and — most
importantly — learn to **measure** retrieval quality with hit-rate@k, recall@k, and MRR so that
"did this change help?" has a number attached to it instead of a gut feeling.

- **Estimated reading time:** ~95 minutes for all 11 topics, plus cheat sheet and revision notes
- **Difficulty level:** Intermediate-to-Advanced
- **Prerequisites:** Week 3 (Retrieval-Augmented Generation, embeddings, vector search, and a
  working RAG app you can point real questions at)

## What You'll Master After This Week

- How to tell retrieval failures apart from generation failures before touching any code
- How to build a minimal inspection view (question / retrieved chunks / answer, side by side)
  that turns "it's wrong" into "here's exactly where it went wrong"
- How keyword search (BM25) works, and why exact-match retrieval still matters in the era of
  embeddings
- When semantic search wins, when keyword search wins, and why production systems use both
- How to combine two ranked lists into one with Reciprocal Rank Fusion (RRF)
- What a cross-encoder reranker does differently from a bi-encoder retriever, and why it's
  slower but more accurate
- How to choose between hosted rerankers (Cohere Rerank) and open-weight ones (BGE reranker)
- How Maximal Marginal Relevance (MMR) trades off relevance against diversity in a result set
- How to rewrite a vague or messy user query into a query that retrieves better
- What HyDE (Hypothetical Document Embeddings) is and why searching with a fake answer can
  outperform searching with the real question
- How to compute hit-rate@k, recall@k, and MRR by hand, and how to use them to prove a change
  actually improved retrieval

## Topics Covered

1. [Retrieval vs. Generation Failures](./Topics/01-Retrieval-Vs-Generation-Failures.md)
2. [The Inspection View](./Topics/02-The-Inspection-View.md)
3. [Keyword Search: BM25](./Topics/03-Keyword-Search-BM25.md)
4. [Keyword vs. Semantic Search](./Topics/04-Keyword-Vs-Semantic-Search.md)
5. [Hybrid Search: RRF Fusion](./Topics/05-Hybrid-Search-RRF-Fusion.md)
6. [Reranking: Cross-Encoders](./Topics/06-Reranking-Cross-Encoder.md)
7. [Cohere Rerank & BGE Reranker](./Topics/07-Cohere-Rerank-BGE-Reranker.md)
8. [MMR (Maximal Marginal Relevance)](./Topics/08-MMR.md)
9. [Query Rewriting](./Topics/09-Query-Rewriting.md)
10. [HyDE (Hypothetical Document Embeddings)](./Topics/10-HyDE.md)
11. [Retrieval Metrics: Hit-Rate, Recall, MRR](./Topics/11-Retrieval-Metrics-Hit-Rate-Recall-MRR.md)

## Reading Progress Checklist

- [ ] 01. Retrieval vs. Generation Failures
- [ ] 02. The Inspection View
- [ ] 03. Keyword Search: BM25
- [ ] 04. Keyword vs. Semantic Search
- [ ] 05. Hybrid Search: RRF Fusion
- [ ] 06. Reranking: Cross-Encoders
- [ ] 07. Cohere Rerank & BGE Reranker
- [ ] 08. MMR (Maximal Marginal Relevance)
- [ ] 09. Query Rewriting
- [ ] 10. HyDE (Hypothetical Document Embeddings)
- [ ] 11. Retrieval Metrics: Hit-Rate, Recall, MRR
- [ ] Review Cheat Sheet
- [ ] Complete Revision
