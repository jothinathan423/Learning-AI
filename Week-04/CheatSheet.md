---
title: "Week 4 Cheat Sheet"
---

# Week 4 Cheat Sheet: Debugging Retrieval

One-page reference for hybrid search, reranking, and failure separation.

## Key Terminology

| Term | One-line meaning |
|---|---|
| Retrieval failure | Wrong/missing document reached the model |
| Generation failure | Right document reached the model; it still answered badly |
| Inspection view | Question + retrieved chunks + answer, shown side by side |
| BM25 | Statistical keyword ranking: term frequency × inverse document frequency, length-normalized |
| Dense/semantic search | Embedding-based, meaning-similarity retrieval |
| Hybrid search | BM25 + semantic search, combined |
| RRF (Reciprocal Rank Fusion) | Combines ranked lists using rank position, not raw scores |
| Bi-encoder | Embeds query and document independently (fast, precomputable) |
| Cross-encoder | Scores query + document jointly (slow, more accurate) |
| Reranking | Second-pass re-sort of a shortlist using a cross-encoder |
| MMR | Selection balancing relevance vs. redundancy with already-picked results |
| Query rewriting | Transforming a raw query into a clearer, better-matched one before retrieval |
| HyDE | Search using the embedding of a fabricated hypothetical answer, not the real question |
| Hit-Rate@k | Fraction of queries with a relevant doc anywhere in top k |
| Recall@k | Fraction of *all* relevant docs found in top k, averaged |
| MRR | Average of 1/(rank of first relevant doc) — rewards top-of-list position |

## Retrieval Metric Formulas + Worked Example

```
Hit-Rate@k = (# queries with a relevant doc in top k) / (total queries)
Recall@k   = average over queries of: (# relevant docs found in top k) / (total relevant docs for that query)
MRR        = average over queries of: 1 / (rank of first relevant doc), or 0 if not found
```

**Example (5 queries, correct-doc rank shown):**

| Query | Rank found |
|---|---|
| Q1 | 1 |
| Q2 | 3 |
| Q3 | not found |
| Q4 | 1 |
| Q5 | 2 |

- Hit-Rate@3 = 4/5 = **0.80**
- MRR = (1/1 + 1/3 + 0 + 1/1 + 1/2) / 5 = (1 + 0.333 + 0 + 1 + 0.5) / 5 = **0.567**

If reranking then moves Q2's doc to rank 1: Hit-Rate@3 stays **0.80** (no visible change), but
MRR rises to **0.75** — MRR is the metric that reveals reranking's real benefit.

## Hybrid Search / RRF Formula

```
RRF_score(d) = Σ (over each ranked list d appears in)  1 / (k + rank(d))       [k ≈ 60]
```

Rank-based, not score-based — avoids the incompatible-scales problem of summing raw BM25 scores
with raw cosine similarity scores directly.

## MMR Formula

```
MMR = argmax_d [ λ · Sim(d, query) − (1 − λ) · max_d' Sim(d, d') ]
```

λ = 1 → pure relevance ranking. λ = 0 → pure diversity, ignoring relevance. Typical: λ ≈ 0.5–0.7.

## BM25 Formula

```
score(D,Q) = Σ IDF(qᵢ) · [f(qᵢ,D)·(k1+1)] / [f(qᵢ,D) + k1·(1 − b + b·|D|/avgdl)]
```

k1 (≈1.2–2.0): term-frequency saturation. b (≈0.75): length-normalization strength.

## Reranker Options Comparison

| | Cohere Rerank | BGE Reranker |
|---|---|---|
| Deployment | Hosted API | Self-hosted, open weights |
| Setup effort | Minimal | Requires inference infra |
| Cost model | Per request | Compute infra cost |
| Data privacy | Leaves your infra | Stays in-house |
| Best fit | Prototyping, low ML-ops capacity | High volume, strict privacy, customization |

## Quick Reminders

- Diagnose (retrieval vs. generation failure) **before** choosing a fix — the fixes don't overlap.
- Build the inspection view first — you can't classify what you can't see.
- BM25 catches exact codes/IDs; semantic search catches paraphrase — use both (hybrid).
- RRF fuses by rank, never by summing raw incompatible scores.
- Reranking narrows a wide shortlist (top 20-50) to a precise final set (top 3-5) — never
  replaces first-stage retrieval.
- MMR trades relevance for diversity — good for redundant corpora/multi-fact answers, risky for
  narrow single-fact lookups.
- Query rewriting fixes bad *inputs* to retrieval; HyDE fixes the *question-vs-answer phrasing
  gap* in dense search specifically.
- Always measure hit-rate@k, recall@k, and MRR before and after any change — track more than one,
  since they can move independently.
