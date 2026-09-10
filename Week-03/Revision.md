---
title: "Week 3 Revision"
week: 3
---

# Week 3 Revision — Retrieval & RAG

## 5-Minute Revision

- **RAG** = retrieve relevant documents first, then have the LLM generate an answer grounded
  in them — fixes the fact that LLMs are frozen at training time and know nothing about your
  private/current documents.
- **Embeddings** turn text into vectors; similar meaning lands as nearby vectors. **Dense
  retrieval** ranks documents by vector similarity instead of exact keyword match.
- **Bi-encoders** (fast, separate encoding) do first-stage retrieval; **cross-encoders**
  (slow, joint encoding) rerank a small shortlist for precision.
- **Chunking** splits documents into focused units before embedding; **chunk size + overlap**
  (~200–500 tokens, ~10–20% overlap) is tuned to balance context vs. precision.
- **Vector databases** (Qdrant, Chroma, pgvector) use ANN indexes like **HNSW** to search
  millions of vectors fast, approximately.
- **Top-k + similarity threshold** control how many results come back and whether "nothing
  relevant" is honestly reported.
- **Metadata filtering** adds exact constraints (access, date, language) on top of semantic
  search — access control must be enforced at the query layer.
- **Grounded generation** forces the model to answer only from retrieved context, cite
  sources, and say "I don't know" when the context doesn't answer the question.

## 15-Minute Revision

**Why RAG exists:** LLMs have a knowledge cutoff, no access to private data, and hallucinate
confidently when they don't know something. Retraining/fine-tuning to add facts is slow and
unreliable at storing exact facts. RAG keeps knowledge external and retrieves the relevant
slice at answer time — two pipelines: offline indexing (chunk → embed → store) and online
query (embed question → search → prompt → generate).

**Embeddings and retrieval:** Embedding models are trained with contrastive learning so
similar meanings land close together in vector space (cosine similarity/dot product).
Sparse/keyword retrieval (BM25) still matters for exact identifiers and rare terms that dense
retrieval can miss — hybrid search combines both. Bi-encoders embed query and document
independently (fast, scalable, precomputable); cross-encoders process query+document jointly
through cross-attention (accurate, expensive) — production systems retrieve broadly with a
bi-encoder then rerank narrowly with a cross-encoder.

**Choosing an embedding model:** MTEB standardizes comparison across retrieval, STS,
classification, and clustering tasks — check the retrieval sub-score specifically, and
validate against your own domain data since general benchmarks can be overturned by
domain-specific fit. BGE and E5 are prominent open-weight families; both use
instruction/prefix-aware training (`query:`/`passage:`). Switching embedding models requires
re-embedding the entire corpus — vectors from different models are not comparable.

**Chunking:** Fixed-size splitting is simplest but risks cutting mid-idea; recursive
splitting (paragraph → sentence → word fallback) is the safer general default;
structure-aware splitting (markdown headers, sections) reuses the author's own organization;
semantic chunking groups sentences by embedding similarity but costs more compute. Always
attach source metadata at chunking time — it can't be reconstructed later. Chunk size and
overlap should be validated against a real evaluation set, not just assumed from a rule of
thumb, and tuned using the actual tokenizer, not character counts.

**Vector databases and HNSW:** Brute-force nearest-neighbor search doesn't scale past a few
thousand vectors under real-time constraints. HNSW is a multi-layer graph — sparse, long-range
connections at the top for fast coarse navigation, dense connections at the bottom for
precision — searched via greedy hops that descend layer by layer. It's approximate by
design, controlled by `M`, `efConstruction` (build time) and `efSearch` (query-time
recall/speed trade-off). Qdrant (dedicated, production-scale, rich filtering), Chroma
(lightweight, fast to prototype), and pgvector (Postgres extension, full SQL + ACID
integration) are the three most common vector store choices, each suited to a different
stage/stack.

**Similarity search and filtering:** Cosine similarity is the standard metric for text
embeddings (dot product is an equivalent, cheaper computation on normalized vectors;
Euclidean distance is less common). `Top_k` and a minimum similarity threshold work together
— search always returns *something*, so a threshold is what catches "nothing genuinely
relevant found." Metadata filtering (pre-filtering, post-filtering, or ideal filter-aware ANN
search) adds exact constraints like access control, freshness, and language on top of
semantic ranking — access control specifically must be enforced at the database query layer,
never trusted to prompt instructions alone.

**Grounded generation and citations:** Prompt the model to answer only from retrieved
context and say "I don't know" otherwise; strengthen this with structured citation output
(explicit source IDs), retrieval-confidence gating (skip generation if the best match is
weak), and optionally a post-hoc groundedness/faithfulness check for high-stakes domains. A
clear "I don't know" is a success, not a failure. Citations double as a debugging tool: wrong
chunk cited = retrieval bug; right chunk cited but misstated = generation bug.

## Last-Minute Interview Revision

- **"What is RAG and why is it needed?"** — LLMs are frozen at training time with no access
  to private/current data and no reliable "I don't know" reflex; RAG retrieves relevant
  documents at answer time so the model generates from real evidence instead of memory.
  Cheaper and faster to update than fine-tuning, and it makes answers traceable via citations.
- **"When would you choose fine-tuning over RAG, or both?"** — Fine-tuning for behavior/style
  /format that must be consistent regardless of retrieved content; RAG for facts that change
  often and need source traceability; combine both when you need a domain-specific voice AND
  fresh, citable facts.
- **"Bi-encoder vs cross-encoder — when do you use each?"** — Bi-encoder for first-stage
  retrieval across a large corpus (precomputable, fast); cross-encoder for reranking a small
  shortlist where cross-attention between query and document tokens buys real accuracy at a
  cost too high to run against the full corpus.
- **"How do you choose an embedding model?"** — Check MTEB's retrieval sub-score as a
  starting filter, then validate on a small labeled evaluation set from your own domain,
  weighing dimensionality, max input length, language coverage, cost, and license alongside
  raw quality.
- **"What breaks if chunks are too big or too small?"** — Too big: the embedding blurs
  multiple topics together and the LLM's context budget is wasted on irrelevant surrounding
  text. Too small: the chunk lacks context to be useful once retrieved, even if the vector is
  precise.
- **"What is HNSW and why is it approximate?"** — A multi-layer graph ANN index that lets
  search hop from coarse, long-range connections to fine, precise ones instead of scanning
  every vector; it's approximate by design, trading a small, tunable accuracy loss (via
  `ef`/`M`) for search that stays fast at millions of vectors.
- **"How do you pick between Qdrant, Chroma, and pgvector?"** — Chroma for prototypes and
  small apps, Qdrant for production scale with rich filtering/quantization needs, pgvector
  when you already run Postgres and want unified transactions/relational joins with vector
  search.
- **"How do you prevent a RAG system from returning a confident wrong answer?"** — Set a
  minimum similarity threshold so weak matches are treated as "no match"; instruct the model
  explicitly to answer only from context and say "I don't know" otherwise; use structured
  citations and, for high-stakes domains, a post-hoc groundedness check.
- **"Where does access control belong in a RAG system?"** — At the retrieval/database query
  layer, as a mandatory metadata filter — never as a prompt-level instruction to the LLM,
  since once sensitive content is in the model's context there's no reliable guarantee it
  won't influence or leak into the answer.
- **"How do you debug a wrong RAG answer?"** — Look at the cited/retrieved chunk first: wrong
  or irrelevant chunk retrieved points to a retrieval problem (embedding model, chunking,
  threshold); correct chunk retrieved but misstated points to a generation/grounding problem.
