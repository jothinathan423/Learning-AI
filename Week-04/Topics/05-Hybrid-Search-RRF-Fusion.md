---
title: "Hybrid Search: RRF Fusion"
week: 4
order: 5
difficulty: Intermediate
readingTime: "12 min"
---

# Hybrid Search: RRF Fusion

## 1. Introduction

Hybrid search means running both keyword search (BM25) and semantic search (dense embeddings)
against the same query, and then combining their two ranked result lists into a single ranked
list. The combining step is where most of the engineering subtlety lives, and the most common,
robust technique for it is called Reciprocal Rank Fusion (RRF). This topic covers why you can't
just average the two scores directly, and how RRF sidesteps that problem.

## 2. Why This Topic Exists

Once you accept (Topic 4) that keyword and semantic search are complementary, the natural next
question is: how do you combine two ranked lists into one? The naive answer — "just add the
scores together" — turns out to be broken, because BM25 scores and cosine-similarity scores live
on completely different, incomparable scales (BM25 scores are unbounded and corpus-dependent;
cosine similarity is bounded between -1 and 1). This topic exists to explain that pitfall clearly
and introduce RRF, the standard fix used throughout the search industry.

## 3. Core Concept

### Beginner

Hybrid search runs two searches instead of one and merges the results, so a query benefits from
both "catches exact codes" (keyword) and "catches paraphrases" (semantic) at the same time. The
merging step uses each result's *rank position* (1st, 2nd, 3rd...) rather than its raw score,
because ranks are always comparable across methods even when scores aren't.

### Intermediate

Reciprocal Rank Fusion assigns each document a fusion score based on where it ranked in each
result list, using the formula:

```
RRF_score(d) = Σ (over each ranking list the document appears in)  1 / (k + rank(d))
```

Where `rank(d)` is the document's position in that list (1st, 2nd, 3rd, ...) and `k` is a small
constant (commonly 60) that softens the impact of very top ranks so the fusion isn't dominated
by a single list's #1 result. A document that appears near the top of *both* the keyword list and
the semantic list gets a high combined score. A document that appears only in one list still
contributes, just less. A document appearing in neither list contributes nothing and is dropped.

### Advanced

RRF's key design property is that it's **rank-based, not score-based** — it deliberately throws
away the raw BM25 and cosine-similarity numbers and only looks at ordinal position. This is a
strength (no need to normalize incomparable scales, no need to tune scale-dependent weighting)
and a limitation (it can't distinguish "barely made rank 3" from "dominantly, obviously the best
match at rank 3" — both get exactly `1/(k+3)`). Alternatives exist — e.g., normalizing each
list's scores to [0,1] via min-max scaling and taking a weighted sum ("CombSUM"/weighted linear
fusion) — but they require careful, corpus-specific calibration and re-tuning as data changes,
whereas RRF works reasonably well out of the box with no tuning, which is why it's the default
starting point in most production hybrid systems (used, among others, inside Elasticsearch's and
OpenSearch's built-in hybrid/RRF retrievers, and Weaviate's, Qdrant's, and Azure AI Search's
hybrid query modes).

## 4. Deep Explanation

Consider why naive score-summing fails concretely: suppose BM25 returns scores like [14.2, 9.8,
3.1] for its top 3 results, and dense search returns cosine similarities like [0.81, 0.79, 0.77]
for its top 3. Adding these directly means the BM25 scores numerically dominate the sum purely
because they're on a larger numeric scale — not because keyword search is actually more reliable
for this query. Even normalizing each list to [0,1] doesn't fully fix this, because it assumes
the *shape* of relevance within each list is comparable, which it often isn't: a semantic list
where the top 5 results are all clustered around 0.80 similarity conveys much less discriminative
signal than a keyword list where the top result scores 14.2 and the rest crater to near zero.

RRF avoids this entirely by discarding scores and using rank position, which is a shared,
comparable unit across any two ranked lists regardless of how their underlying scores were
computed. The `1/(k+rank)` shape means rank 1 contributes far more than rank 10 (diminishing
returns as you go down the list), and the constant `k` prevents the formula from being overly
sensitive to whether something is rank 1 vs. rank 2 — both are "near the top" and get similar
credit, avoiding overfitting to a single list's exact ordering noise.

Hybrid search with RRF also naturally solves an edge case from Topic 4: a document with a BM25
score of exactly zero (no lexical overlap) simply doesn't appear in the keyword ranking at all,
so it contributes nothing from that list — but if it ranked highly in the semantic list, it still
gets a respectable fusion score from that half alone. The reverse also holds. This is precisely
the "catch both" property the syllabus describes: a policy-language question and an exact
error-code question can both be served well by the same fused pipeline.

## 5. Step-by-Step Flow

1. Send the (possibly rewritten, see Topic 9) query to the BM25 keyword retriever; get a ranked
   list of chunk IDs.
2. Send the same query to the dense/semantic retriever; get a separate ranked list of chunk IDs.
3. For each unique chunk ID appearing in either list, compute `1/(k + rank)` for each list it
   appears in (using a large constant, e.g. `k + N`, or simply omitting the term, for lists where
   it doesn't appear).
4. Sum these per-list contributions into a single RRF score per chunk.
5. Sort all chunks by their combined RRF score, descending.
6. Take the top-k fused results and pass them forward — either directly to the generator, or
   (better, see Topic 6) through a reranking pass first.

## 6. Architecture Explanation

```mermaid
flowchart TD
    Q[User query] --> KW[BM25 keyword search]
    Q --> SEM[Dense semantic search]

    KW --> KWLIST["Keyword ranked list\n1: doc_a  2: doc_c  3: doc_f"]
    SEM --> SEMLIST["Semantic ranked list\n1: doc_b  2: doc_a  3: doc_d"]

    KWLIST --> RRF[Reciprocal Rank Fusion\nscore = sum of 1 / (k + rank)\nacross lists a document appears in]
    SEMLIST --> RRF

    RRF --> FUSED["Fused ranked list\n(e.g. doc_a, doc_b, doc_c, doc_d, doc_f)"]
    FUSED --> RERANK[Optional: rerank top results\nwith a cross-encoder — Topic 6]
    RERANK --> GEN[Pass top chunks to the generator]
```

## 7. Visual Analogy

Imagine two judges scoring a talent show on completely different scales — one gives scores out
of 100, the other gives scores out of 10 — and you need one final ranking. Averaging their raw
scores directly would let whichever judge uses bigger numbers dominate, regardless of how good
their judgment actually is. Instead, you ask each judge only for their *ranking* (who's 1st,
2nd, 3rd), and combine those rankings, giving credit for being near the top in either judge's
list. That's RRF: it trusts ordinal position, not incomparable raw scores.

## 8. Real Industry Example

Elasticsearch's native hybrid retriever, OpenSearch's hybrid query, and Weaviate's hybrid search
mode all use Reciprocal Rank Fusion (or an RRF variant) as their default fusion algorithm for
combining BM25 and vector search results, precisely because it requires no per-corpus score
calibration and performs reliably across wildly different document collections — a strong
practical signal that RRF is the industry-default starting point rather than an academic
curiosity.

## 9. Common Misconceptions

- **"You can just average the two scores."** Different scales (unbounded BM25 vs. bounded cosine
  similarity) make direct averaging unreliable — this is exactly what RRF is designed to avoid.
- **"RRF requires machine learning or training."** It's a simple deterministic formula over rank
  positions — no training, no model.
- **"Hybrid search always beats either method alone."** It usually helps on average, but always
  measure (Topic 11) on your own data — for a corpus that's almost entirely exact-code lookups
  or almost entirely conversational paraphrase, one method alone might already be sufficient.
- **"The constant k in RRF needs heavy tuning."** `k=60` is a widely used, robust default; unlike
  score-based fusion weights, RRF is comparatively insensitive to this constant.

## 10. Best Practices

- Start with RRF using standard defaults (`k=60`) before considering more complex weighted
  fusion — it's simpler and has fewer failure modes.
- Retrieve a reasonably generous top-N from each individual method (e.g., top-20 from each)
  before fusing, so the fused list has enough candidates to rank well — fusing two top-3 lists
  loses recall that a wider net would have caught.
- Measure hybrid search against each individual method using hit-rate/recall/MRR (Topic 11) on a
  labeled query set — don't assume hybrid is better without proof.
- Consider following fusion with a reranking pass (Topic 6) — RRF is good at recall (getting the
  right document *somewhere* in the top results) but not as precise as a cross-encoder at putting
  the single best result in position 1.

## 11. Summary

Hybrid search combines keyword (BM25) and semantic (dense) retrieval by running both and fusing
their ranked lists, most commonly using Reciprocal Rank Fusion — a rank-position-based formula
that sidesteps the incomparable-scales problem of raw score averaging. It gives you the best of
both retrieval failure modes: exact-token reliability from keyword search and paraphrase
tolerance from semantic search, combined into a single ranked candidate list.

## 12. Key Takeaways

- Hybrid search = run BM25 and dense search separately, then fuse their ranked lists.
- Raw score averaging fails because BM25 and cosine similarity scores are on incomparable
  scales.
- RRF score = sum of `1/(k + rank)` across the lists a document appears in; `k=60` is a common
  default.
- RRF requires no training and is comparatively insensitive to its one constant.
- Hybrid search is typically followed by reranking (Topic 6) for precision at the very top
  position.
- Always validate hybrid search's benefit with metrics (Topic 11) rather than assuming it helps.
