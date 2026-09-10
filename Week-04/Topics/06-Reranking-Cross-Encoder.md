---
title: "Reranking: Cross-Encoders"
week: 4
order: 6
difficulty: Advanced
readingTime: "13 min"
---

# Reranking: Cross-Encoders

## 1. Introduction

Retrieval (whether keyword, semantic, or hybrid-fused) is built for speed: it has to search
across potentially millions of documents in milliseconds, which forces it to use representations
computed independently of each other (a document's embedding doesn't know what the query will be
ahead of time). Reranking is a deliberately slower, more accurate second pass applied only to the
small shortlist retrieval already produced — typically the top 20-100 candidates — using a model
that looks at the query and each candidate *together*. This topic explains cross-encoders, the
model architecture that makes reranking so much more accurate than the first-pass retriever.

## 2. Why This Topic Exists

Fusion (Topic 5) solves recall: getting the right document *somewhere* into a shortlist. But
"somewhere in the top 20" is not good enough when you're only going to pass the top 3-5 chunks to
the language model — if the truly best chunk is sitting at position 8, it may never make the cut,
or it may make the cut but get diluted among worse chunks and effectively ignored by the model
(the "retrieved-but-buried" pattern from Topic 1). Reranking exists to fix exactly this: take a
wider shortlist and re-sort it with a much more accurate (but much slower) relevance judgment, so
the very best chunk reliably lands at position 1.

## 3. Core Concept

### Beginner

A reranker is a second, more careful pass that looks at your query and each candidate document
together and decides how relevant that document really is — rather than comparing pre-computed,
independent representations the way your first-pass retriever does. It's slower, so you only run
it on a short list (say, the top 20-50 candidates from retrieval), not your entire document
collection.

### Intermediate

The key architectural distinction is **bi-encoder vs. cross-encoder**:

- **Bi-encoder** (what your Week 3 dense retriever uses): the query and each document are
  embedded *separately*, into fixed vectors, independent of each other. Similarity is then a
  cheap vector-math operation (cosine similarity / dot product) between two pre-computed vectors.
  This is what makes it fast enough to search millions of documents — document embeddings can be
  precomputed once, offline, and reused for every future query.
- **Cross-encoder** (what a reranker uses): the query and a single candidate document are fed
  into the model *together*, as one combined input, and the model outputs a single relevance
  score for that specific pair. Because the model can attend across the query and document
  jointly (e.g., noticing that a specific word in the query directly matches a specific phrase in
  the document, in context), it produces much more accurate relevance judgments — but it must be
  run fresh for every single query-document pair, with no precomputation possible.

### Advanced

The accuracy gain comes at real computational cost, and understanding the trade-off precisely
matters for production design:

| Aspect | Bi-encoder (retrieval) | Cross-encoder (reranking) |
|---|---|---|
| Input to the model | Query alone, or document alone | Query + document, concatenated, together |
| Precomputable? | Yes — document embeddings computed once, reused forever | No — must run per query-document pair, at query time |
| Speed at scale | Fast enough for millions of documents (vector index lookup) | Too slow for millions; feasible only on a short list (tens to low hundreds) |
| Relevance signal | Similarity between independently-derived vectors | Joint attention over both texts at once — richer, more accurate |
| Typical role | First-pass candidate generation (high recall) | Second-pass re-ordering of a shortlist (high precision at the top) |

This is why reranking is always a *second* pass over a *pre-filtered* shortlist, never a
replacement for retrieval — running a cross-encoder over your entire corpus for every query would
be computationally infeasible at any meaningful scale.

## 4. Deep Explanation

Bi-encoders trade accuracy for speed by forcing all the "understanding" of a document into a
single fixed-size vector, computed without any knowledge of what future queries will ask. This is
an inherent compression: a 768-dimensional vector cannot perfectly encode everything a document
contains, so some nuance relevant to a *specific* query is inevitably lost when the document was
embedded in isolation.

Cross-encoders don't suffer this loss because they never try to compress the document into a
reusable, query-agnostic representation. Instead, they process the specific pairing of "this
exact query" with "this exact document" through the model's attention layers together, letting
the model directly compare relevant spans of text against each other in context. The output is
typically a single scalar relevance score (often produced by a classification head on top of a
transformer like BERT, fine-tuned specifically on query-document relevance pairs — e.g., trained
on datasets like MS MARCO).

The practical consequence: cross-encoders reliably outperform bi-encoders on ranking quality
(this is a consistently reproduced finding across information retrieval research and industry
benchmarks), but cost roughly one full model forward pass *per candidate document*, per query.
Reranking 50 candidates means 50 forward passes at query time — noticeably higher latency and
compute cost than a single vector lookup, which is exactly why rerankers are applied only to a
retrieval shortlist, not the full corpus, and why choosing how many candidates to rerank (Topic
7's discussion of hosted vs. self-hosted rerankers) is itself a latency/cost/accuracy trade-off
decision.

## 5. Step-by-Step Flow

1. Run retrieval (hybrid or otherwise) and get a shortlist — typically the top 20-100 candidates,
   wider than what you'll ultimately show the generator.
2. For each candidate in the shortlist, form a (query, candidate) pair.
3. Feed each pair into the cross-encoder reranker model, which outputs a single relevance score
   for that pair.
4. Sort the shortlist by these new cross-encoder scores, descending — discarding the original
   retrieval ranking and scores entirely for this step.
5. Take the top-k (now much smaller, e.g., top 3-5) reranked results.
6. Pass only those top-k chunks to the generator — reranking's whole purpose is ensuring this
   final, small set is the best possible one.
7. Measure the impact (Topic 11): compare hit-rate@3 or MRR before and after adding the reranking
   step on the same labeled query set.

## 6. Architecture Explanation

```mermaid
flowchart TD
    Q[Query] --> RETRIEVE[Retrieval / hybrid fusion\n(Topics 3-5)]
    RETRIEVE --> WIDE["Wide shortlist\n(e.g. top 20-50 candidates)"]

    WIDE --> PAIR["Form (query, candidate) pairs"]
    PAIR --> CE["Cross-encoder reranker\nprocesses query + document jointly"]
    CE --> SCORES[New relevance scores\nper candidate]

    SCORES --> RESORT[Re-sort shortlist\nby cross-encoder score]
    RESORT --> NARROW["Narrow final list\n(e.g. top 3-5)"]
    NARROW --> GEN[Generator / LLM]
```

## 7. Visual Analogy

A bi-encoder is like a hiring process that scores résumés against a generic job-description
checklist, computed once, and reused for every candidate and every role. A cross-encoder is like
a hiring manager who reads this *specific* résumé side by side with this *specific* role's actual
needs and gives a considered judgment tailored to that exact pairing. The checklist approach
scales to thousands of résumés instantly; the hiring manager's careful read is far more accurate
but can only be done for a short list of finalists, not everyone who applied.

## 8. Real Industry Example

Bing, Google, and most large-scale commercial search engines use a multi-stage "retrieve then
rerank" architecture in production: a fast first-stage retriever (often a mix of inverted-index
and learned sparse/dense methods) narrows billions of documents down to hundreds, and one or more
progressively more expensive reranking stages (including cross-encoder-style neural rerankers)
narrow that down to the final results shown to the user. RAG systems in production — including
enterprise search products built on Elasticsearch, Vespa, and vector databases like Pinecone and
Weaviate — have converged on the same two-stage pattern for exactly the same reason: it's the
only way to get cross-encoder-level accuracy without cross-encoder-level cost across an entire
corpus.

## 9. Common Misconceptions

- **"We should just use a cross-encoder for all retrieval and skip the bi-encoder stage."**
  Computationally infeasible at any real corpus size — cross-encoders can't be precomputed and
  don't scale to searching millions of documents directly.
- **"Reranking always improves results."** It reorders based on the reranker's judgment, which is
  usually more accurate but is still a model with its own biases and blind spots — measure the
  impact, don't assume it.
- **"A higher reranker score always means a better final answer."** Reranking improves the
  ordering of retrieved chunks; it says nothing about whether the generator will use those chunks
  correctly (a generation failure can still occur even with a perfectly reranked top result).
- **"Reranking replaces the need for good first-stage retrieval."** A reranker can only reorder
  what's already in the shortlist — if the truly relevant document never made it into the
  shortlist at all (a first-stage recall failure), no reranker can rescue it.

## 10. Best Practices

- Retrieve a wide-enough shortlist before reranking (e.g., top 20-50) — reranking can't fix a
  document that never made the shortlist in the first place.
- Keep the final reranked list small (top 3-5) before passing to the generator, to avoid diluting
  the model's context with lower-quality chunks.
- Measure hit-rate@k and MRR (Topic 11) before and after adding reranking, on the same query set,
  to confirm it's actually helping for your specific corpus and query patterns.
- Budget for the latency cost — reranking adds a model call per shortlist candidate; test
  end-to-end response time, not just accuracy, before shipping.
- Consider a hosted reranker (Topic 7) if you don't want to manage cross-encoder infrastructure
  yourself.

## 11. Summary

Reranking applies a cross-encoder — a model that scores a query and a candidate document jointly,
rather than via pre-computed independent vectors — to a shortlist already produced by faster
first-stage retrieval. This joint attention produces substantially more accurate relevance
judgments than a bi-encoder's cosine similarity, at the cost of being too slow to run over an
entire corpus, which is why it's always a second pass over a narrowed candidate set, not a
replacement for retrieval.

## 12. Key Takeaways

- Bi-encoders embed query and document independently (fast, precomputable, less accurate);
  cross-encoders score them jointly (slow, not precomputable, more accurate).
- Reranking is a second pass over a shortlist (e.g., top 20-50), never a replacement for
  first-stage retrieval over the full corpus.
- Cross-encoders excel at pushing the single best result to the top — directly addressing the
  "retrieved-but-buried" failure pattern from Topic 1.
- Reranking adds latency and compute cost per query — budget for it explicitly.
- A reranker can't rescue a document that first-stage retrieval never shortlisted at all.
