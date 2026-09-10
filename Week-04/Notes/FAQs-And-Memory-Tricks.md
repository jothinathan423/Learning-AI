---
title: "FAQs & Memory Tricks — Week 4"
---

# FAQs & Memory Tricks — Week 4

## FAQs

**Q1: If my answer is wrong, where should I even start debugging?**
A: Always start by classifying the failure (Topic 1). Open the inspection view, look at what was
actually retrieved, and check whether the answer-bearing information exists in those chunks. Only
after you know it's a retrieval failure or a generation failure should you pick a fix — otherwise
you risk spending effort on the wrong half of the pipeline entirely.

**Q2: Do I need hybrid search if my semantic search already seems to work fine?**
A: Test it, don't assume. Profile your real query traffic for exact-code/ID-style questions versus
conversational questions (Topic 4). If your corpus has meaningful exact-match content (error
codes, SKUs, names), hybrid search usually helps; if your queries are almost entirely
conversational and your corpus has little exact-match content, the benefit may be small. Measure
with hit-rate/recall/MRR (Topic 11) rather than guessing.

**Q3: Why can't I just add the BM25 score and the cosine similarity score together?**
A: They're on incompatible scales — BM25 is unbounded and corpus-dependent, cosine similarity is
bounded between -1 and 1. Adding them directly lets whichever score happens to use bigger numbers
dominate, regardless of which method is actually more reliable for that query. Reciprocal Rank
Fusion (Topic 5) sidesteps this by using rank position instead of raw scores.

**Q4: What's the actual difference between a bi-encoder and a cross-encoder?**
A: A bi-encoder embeds the query and each document *separately*, so document embeddings can be
precomputed once and reused for every future query — that's what makes it fast enough to search
millions of documents. A cross-encoder processes the query and one document *together*, in the
same forward pass, producing a more accurate but much more expensive relevance score — which is
why it's only run on a small shortlist, never the whole corpus (Topic 6).

**Q5: Should I always rerank?**
A: Reranking usually helps when your first-stage retrieval sometimes has the right document but
buried below the top few results. Measure it with MRR (Topic 11) specifically — MRR is
position-sensitive in a way that hit-rate@k, at a fixed k, may not show reranking's benefit at
all.

**Q6: Cohere Rerank or BGE reranker — which should I pick?**
A: Start with whichever gets you measuring fastest. If you have no ML infrastructure or want to
validate reranking's value quickly, a hosted API (Cohere Rerank) is the lower-friction choice. If
you have high query volume, strict data-privacy requirements, or want to fine-tune on your own
data, a self-hosted open-weight model (BGE reranker) becomes more attractive (Topic 7). It's a
reversible decision if you keep the reranker behind a swappable interface.

**Q7: When is MMR actually worth using?**
A: When your corpus has real redundancy (multiple sources saying nearly the same thing) or your
answers typically need to synthesize several distinct facts. For narrow, single-fact lookups, MMR
can actively hurt by displacing the single best chunk in favor of a more "different" one (Topic
8).

**Q8: Is query rewriting only useful for chatbots with conversation history?**
A: No — it also helps single-turn queries with vocabulary mismatches ("my thing broke" vs.
"hardware defect warranty claim") or compound questions that should be split into separate
retrieval queries (Topic 9). Conversational context resolution is the most common use case, not
the only one.

**Q9: Why would I search with a fake answer (HyDE) instead of the real question?**
A: Because questions and answers are often phrased very differently, and a fabricated
answer-shaped text tends to match real answer-shaped document content better than a
question-shaped query does, in embedding space. The hypothetical answer doesn't need to be
factually correct — it's discarded after retrieval and never shown to the user (Topic 10).

**Q10: What's the single most important metric if I can only track one?**
A: There isn't a universal single answer, but MRR is often the most informative default because
it's sensitive to *where* the right answer landed, not just whether it appeared at all — which
matters for evaluating almost every technique this week, especially reranking. Still, track
hit-rate@k too, since it directly reflects what your generator will actually see if you pass a
fixed top-k.

**Q11: How big should my labeled test set be?**
A: Large enough to be representative and stable, small enough to be maintainable — 30-100+
questions drawn from (or closely mirroring) real usage is a common practical range. What matters
most is that the same fixed set is reused across every before/after comparison.

**Q12: Can I use several of this week's techniques together?**
A: Yes, and in production they're usually combined: hybrid search (Topic 5) feeds a wide
candidate list into reranking (Topic 6), query rewriting or HyDE (Topics 9-10) can improve what
gets sent into that pipeline in the first place, and MMR (Topic 8) can be applied at the selection
step when diversity matters. Metrics (Topic 11) are what tell you which combination actually pays
off for your specific corpus.

## Memory Tricks / Mnemonics

- **"Wrong document vs. wrong reading"** — retrieval failure means the wrong document (or no
  document) reached the model; generation failure means the right document was read wrong.
- **"BM25 counts, embeddings understand"** — keyword search is a counting formula over exact
  tokens; semantic search is a learned notion of meaning.
- **"RRF trusts position, not points"** — Reciprocal Rank Fusion combines rank positions, never
  raw incompatible scores.
- **"Bi alone, cross together"** — bi-encoders embed query and document alone/separately;
  cross-encoders process them together, jointly.
- **"Wide net, narrow catch"** — retrieval casts a wide shortlist; reranking narrows it to the
  few that matter.
- **"MMR: relevant but not repetitive"** — Maximal Marginal Relevance picks results that are both
  relevant to the query and different from what's already picked.
- **"Rewrite the question, HyDE fakes the answer"** — query rewriting stays in question form;
  HyDE jumps straight to a fabricated answer for searching.
- **"Hit-rate: did it show up? MRR: how high did it show up?"** — the quickest way to remember the
  difference between the two metrics.

## Bullet-Point Revision List

- Diagnose first: retrieval failure vs. generation failure, using the inspection view.
- Inspection view = question + retrieved chunks (with scores) + answer, side by side.
- BM25 = exact-token statistical ranking; no ML model, no training.
- Semantic search = meaning-based; can miss rare/exact tokens.
- Hybrid search = BM25 + semantic, fused via Reciprocal Rank Fusion (rank-based, not score-based).
- Reranking = cross-encoder second pass over a shortlist; more accurate, more expensive, not
  precomputable.
- Cohere Rerank (hosted) vs. BGE reranker (self-hosted) = cost/privacy/control trade-off, not an
  accuracy difference in principle.
- MMR = trades some relevance for diversity via a tunable λ; helps with redundancy and multi-fact
  answers.
- Query rewriting = clean up the question before retrieval; especially important in multi-turn
  conversations.
- HyDE = search with a fabricated plausible answer instead of the real question, to close the
  question-vs-answer phrasing gap.
- Metrics = hit-rate@k (binary success), recall@k (coverage for multi-doc answers), MRR
  (position-sensitive) — always measure before/after any change.
