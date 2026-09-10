---
title: "Key Definitions & Tables — Week 4"
---

# Key Definitions & Tables — Week 4

Condensed definitions and comparison tables for all 11 Week 4 topics. Use this as a quick
reference while reading, or as revision material afterward.

## 1. Retrieval vs. Generation Failures

| Term | Definition |
|---|---|
| Retrieval failure | The needed information never reached the model — wrong/missing chunks were retrieved |
| Generation failure | The model had the right chunks but still answered badly — ignored, misread, or hallucinated past context |
| Partial retrieval | Answer needs multiple chunks; only some were retrieved |
| Retrieved-but-buried | Correct chunk retrieved but ranked low enough to be effectively ignored |

## 2. The Inspection View

| Term | Definition |
|---|---|
| Inspection view | A debugging screen showing question, retrieved chunks (+ scores), and final answer together |
| Trace log | The underlying record of question/chunks/answer used to populate the inspection view |

## 3-4. Keyword Search vs. Semantic Search

| Dimension | BM25 (Keyword) | Dense Embeddings (Semantic) |
|---|---|---|
| Matches | Exact tokens | Meaning / concepts |
| Index | Inverted index | Vector index (e.g., HNSW) |
| Strength | Codes, IDs, rare terms | Paraphrase, synonyms |
| Weakness | Synonyms, paraphrase | Rare/out-of-vocabulary tokens |
| Failure shape | Sharp (exact zero score) | Soft (low but nonzero score) |
| Needs training? | No | Yes (embedding model) |

**BM25 formula:**
```
score(D,Q) = Σ IDF(qᵢ) · [f(qᵢ,D)·(k1+1)] / [f(qᵢ,D) + k1·(1-b+b·|D|/avgdl)]
```

## 5. Hybrid Search: RRF Fusion

| Term | Definition |
|---|---|
| Hybrid search | Running keyword + semantic search and fusing the two ranked lists |
| RRF (Reciprocal Rank Fusion) | Fusion method using rank position, not raw score |

**RRF formula:**
```
RRF_score(d) = Σ 1 / (k + rank(d))   [summed over each list d appears in; k ≈ 60]
```

## 6-7. Reranking

| Term | Definition |
|---|---|
| Bi-encoder | Embeds query and document separately/independently — fast, precomputable |
| Cross-encoder | Scores query + document jointly — slow, more accurate, not precomputable |
| Reranking | Second pass re-sorting a shortlist using a cross-encoder |

| Reranker option | Type | Cost model | Data privacy |
|---|---|---|---|
| Cohere Rerank | Hosted API | Pay per request | Data leaves your infra |
| BGE Reranker | Open-weight, self-hosted | Pay for compute | Data stays in-house |

## 8. MMR

| Term | Definition |
|---|---|
| MMR (Maximal Marginal Relevance) | Selection method balancing relevance to query vs. redundancy with already-selected results |
| λ (lambda) | Trade-off knob: λ=1 → pure relevance, λ=0 → pure diversity |

**MMR formula:**
```
MMR = argmax_d [ λ·Sim(d,query) − (1−λ)·max_d' Sim(d,d') ]
```

## 9-10. Query Rewriting & HyDE

| Term | Definition |
|---|---|
| Query rewriting | Transforming the raw user query into a clearer, self-contained, better-matched query before retrieval |
| Multi-query expansion | Generating several rephrasings and merging their retrieved results |
| HyDE (Hypothetical Document Embeddings) | Generating a fake plausible answer with an LLM, embedding *that*, and using it to search instead of the question |

## 11. Retrieval Metrics

| Metric | Formula | Captures |
|---|---|---|
| Hit-Rate@k | (# queries with a relevant doc in top k) / (total queries) | Binary success within top k |
| Recall@k | avg per-query (# relevant docs found in top k) / (total relevant docs for that query) | Coverage of all relevant docs |
| MRR | avg of 1/(rank of first relevant doc); 0 if not found | Position quality, rewards top-of-list |

## Cross-Topic Comparison: Where Each Technique Fits

| Technique | Fixes | Stage |
|---|---|---|
| Hybrid search (BM25 + dense) | Wrong/missing document in candidate set | Retrieval |
| Reranking (cross-encoder) | Right document present but ranked low | Post-retrieval, pre-generation |
| MMR | Redundant candidate set, missing coverage of distinct facts | Post-retrieval selection |
| Query rewriting | Vague/messy/context-dependent query | Pre-retrieval |
| HyDE | Question-vs-answer phrasing mismatch in dense search | Pre-retrieval (query transformation) |
| Metrics (hit-rate/recall/MRR) | Unmeasured, unproven changes | Evaluation, applies to all of the above |
