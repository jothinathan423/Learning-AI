---
title: "Week 4 Revision"
---

# Week 4 Revision: Debugging Retrieval

## 5-Minute Revision

- A wrong RAG answer is either a **retrieval failure** (wrong/missing chunks reached the model) or
  a **generation failure** (right chunks reached the model, it still answered badly) — diagnose
  before fixing, since the fixes don't overlap.
- The **inspection view** (question + retrieved chunks + answer, side by side) is what makes that
  diagnosis possible.
- **BM25** (keyword search) matches exact tokens; **dense/semantic search** matches meaning.
  Neither wins universally — they fail on different query types.
- **Hybrid search** runs both and fuses the ranked lists using **Reciprocal Rank Fusion (RRF)**
  — rank-based, because raw BM25 and cosine-similarity scores are on incompatible scales.
- **Reranking** applies a slower, more accurate **cross-encoder** to a retrieval shortlist,
  pushing the best result to the top — a second pass, never a replacement for retrieval.
- **Cohere Rerank** (hosted) and **BGE reranker** (self-hosted) are both cross-encoders; the
  choice is about cost/privacy/control, not accuracy in principle.
- **MMR** trades some relevance for diversity, avoiding redundant near-duplicate results.
- **Query rewriting** cleans up a messy question before retrieval; **HyDE** searches with a
  fabricated hypothetical answer instead of the real question, to close the question-vs-answer
  phrasing gap.
- **Hit-rate@k**, **recall@k**, and **MRR** measure retrieval quality with numbers — always
  compare before/after any change.

## 15-Minute Revision

**Failure separation (Topics 1-2):** Every RAG failure traces to one of two disjoint pipeline
stages. Retrieval failure: the answer-bearing text never reached the model. Generation failure:
it did, and the model still erred (ignored context, hallucinated, misread instructions, or was
overwhelmed by irrelevant chunks). Misdiagnosing wastes effort — the classic mistake is upgrading
the LLM to fix what was actually a retrieval problem, which changes nothing. The inspection view
(question + retrieved chunks with scores + answer, together) is the tool that makes this
diagnosis fast and repeatable instead of guesswork.

**Keyword vs. semantic search (Topics 3-4):** BM25 scores documents via term frequency × inverse
document frequency, normalized for document length — a deterministic formula with no training,
excelling at exact tokens (codes, IDs, rare terms) but blind to synonymy. Dense/semantic search
uses embeddings to match meaning, generalizing past exact wording but sometimes drifting on
out-of-vocabulary or rare tokens. Their failure shapes differ too: BM25 fails sharply (score
exactly zero, visible), semantic search fails softly (low-but-nonzero score, easy to miss).

**Hybrid search (Topic 5):** Run both retrievers, then fuse their ranked lists with Reciprocal
Rank Fusion: `score(d) = Σ 1/(k+rank(d))` across the lists a document appears in (k≈60). RRF uses
rank position specifically because raw BM25 and cosine-similarity scores live on incompatible
scales, making direct score-summing unreliable.

**Reranking (Topics 6-7):** Retrieval uses bi-encoders (query and document embedded
independently, precomputable, fast, less accurate). Reranking uses cross-encoders (query and
document scored jointly, not precomputable, slower, more accurate) — applied only to a shortlist
(e.g., top 20-50), never the full corpus, because cross-encoders don't scale to millions of
documents. Cohere Rerank (hosted API, low setup effort, data leaves your infra) and BGE reranker
(self-hosted, open weights, full data control, more ops burden) are both cross-encoders — the
choice is a cost/privacy/scale trade-off, and it's reversible if kept behind a swappable
interface.

**MMR (Topic 8):** `MMR = argmax_d [λ·Sim(d,query) − (1−λ)·max Sim(d, selected)]`. Balances
relevance against redundancy when selecting a final result set — valuable for redundant corpora
or multi-fact answers, risky for narrow single-answer lookups where it can displace the single
best chunk.

**Query rewriting & HyDE (Topics 9-10):** Query rewriting transforms a vague/context-dependent/
mismatched-vocabulary question into a clearer, self-contained one before retrieval — critical in
multi-turn conversations. HyDE goes further: an LLM generates a plausible (not necessarily
correct) hypothetical answer, which gets embedded and used for search instead of the question
itself — because answer-shaped text matches answer-shaped documents better than question-shaped
text does in embedding space. Both add an LLM call's worth of latency/cost and should be
validated, not assumed to help.

**Metrics (Topic 11):** Hit-rate@k = binary, did a relevant doc appear in top k. Recall@k =
fraction of *all* relevant docs found (for multi-doc answers). MRR = average of 1/rank of first
relevant doc — sensitive to *position*, not just presence, which is why it's the preferred metric
for evaluating reranking specifically (a rank-3-to-rank-1 improvement can leave hit-rate@3
unchanged while raising MRR substantially).

## Last-Minute Interview Revision

- **"How do you debug a RAG system that's sometimes wrong?"** → First classify: retrieval failure
  (wrong/missing chunks reached the model) vs. generation failure (right chunks, bad answer
  anyway). Build an inspection view (question + retrieved chunks + answer together) to make this
  diagnosis fast. Never "fix" a retrieval problem by upgrading the LLM — it won't help.
- **"Why combine keyword and semantic search instead of picking one?"** → They fail on
  structurally different query types — semantic search misses exact codes/rare tokens; keyword
  search misses paraphrase/synonyms. Hybrid search catches both, fused typically via Reciprocal
  Rank Fusion because raw scores from the two methods aren't on comparable scales.
- **"What's the difference between a bi-encoder and a cross-encoder, and why does it matter for
  reranking?"** → Bi-encoders embed query and document independently so document embeddings can
  be precomputed — fast enough to search millions of documents but less accurate. Cross-encoders
  process query and document together for a richer, joint relevance judgment — more accurate but
  too slow to run over a full corpus, so they're used only to rerank an already-narrowed
  shortlist.
- **"How would you decide between a hosted reranker API and self-hosting one?"** → Weigh setup
  effort, cost at your expected query volume, data privacy/residency requirements, and
  customization needs. Hosted APIs (e.g., Cohere Rerank) are faster to validate value with; self-
  hosted open-weight models (e.g., BGE reranker) become more attractive at high volume or under
  strict privacy constraints. Keep the reranker behind a swappable interface so the decision stays
  reversible.
- **"What is MMR and when would you use it?"** → A selection technique balancing query relevance
  against redundancy with already-chosen results, via a tunable λ. Use it when your corpus has
  real content overlap or your answers need multiple distinct facts; avoid it (or set λ near 1)
  for narrow single-answer factual lookups.
- **"Explain HyDE in one sentence, and why it works."** → HyDE generates a fabricated but
  plausible answer with an LLM and embeds that instead of the question, because answer-shaped
  text tends to match real answer-shaped document content better than question-shaped text does
  in embedding space — the hypothetical answer's factual accuracy doesn't matter since it's never
  shown to the user.
- **"How do you prove a retrieval change actually helped?"** → Build a labeled test set (questions
  with known correct documents), compute hit-rate@k, recall@k, and MRR before the change, make one
  change, recompute on the same test set, and compare. MRR specifically reveals ranking-position
  improvements (e.g., from reranking) that a fixed hit-rate@k can miss entirely.
- **"What's the formula for MRR, and can you show a quick example?"** → `MRR = average of
  1/(rank of first relevant doc)` per query, 0 if not found. Example: correct doc found at ranks
  1, 3, not-found, 1, 2 across 5 queries → MRR = (1 + 0.333 + 0 + 1 + 0.5)/5 = 0.567.
