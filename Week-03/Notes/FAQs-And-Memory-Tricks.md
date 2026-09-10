---
title: "FAQs and Memory Tricks"
week: 3
---

# FAQs and Memory Tricks

## Frequently Asked Questions

**Q1. Does RAG completely eliminate hallucination?**
No. It substantially reduces hallucination on questions the indexed documents actually cover,
because the model has real material to ground its answer in. It doesn't eliminate it,
because the model can still misread retrieved context, blend it with training knowledge, or
answer confidently even when retrieval failed — which is exactly why grounded prompting and
citations are treated as required, not optional.

**Q2. Is RAG a replacement for fine-tuning?**
No, they solve different problems. RAG supplies facts that can change often and need
citations; fine-tuning teaches behavior, tone, format, and narrow skills. Many production
systems use both together.

**Q3. Why can't I just make the LLM's context window huge and skip retrieval entirely?**
You can for small, static document sets, but it costs more per call (you pay for every token
every time), doesn't scale to large corpora, and research shows models often pay less
attention to information buried in the middle of a very long context — retrieval keeps only
the relevant material in front of the model.

**Q4. Can I compare embeddings from two different models?**
No. Each embedding model defines its own vector space; comparing vectors from different
models produces meaningless similarity scores. Always use the same model for indexing and
querying.

**Q5. What's the difference between a bi-encoder and a cross-encoder, in one sentence?**
A bi-encoder embeds query and document separately for fast search; a cross-encoder reads
them together for a more accurate but much slower relevance score, used only to rerank a
small shortlist.

**Q6. How do I pick a chunk size?**
Start around 200–500 tokens with 10–20% overlap, then validate against a small evaluation
set of real questions with known correct chunks — don't just trust a rule of thumb blindly.

**Q7. Is HNSW guaranteed to find the true nearest neighbors?**
No — HNSW is an approximate nearest neighbor (ANN) algorithm. It trades a small, usually
negligible accuracy loss for search speed that stays fast even at millions of vectors.

**Q8. Which vector database should I use?**
Depends on stage and stack: Chroma for fast prototyping, Qdrant for production scale and
rich filtering, pgvector if you already run Postgres and want one integrated system.

**Q9. What similarity metric should I use?**
Whatever your embedding model was trained and evaluated with — usually cosine similarity
(sometimes implemented internally as a dot product on normalized vectors). Check the model's
documentation rather than assuming.

**Q10. Why does metadata filtering matter if search is already "smart" (semantic)?**
Semantic similarity has no concept of permissions, dates, or exact categories. Metadata
filtering adds those hard, exact constraints back in — and for access control, it must be
enforced at the database query layer, never left to the LLM to "choose" not to mention
something it was never supposed to see.

**Q11. Is a confident-sounding "I don't know" a system failure?**
No — it's a success. In a well-designed RAG system, saying "I don't know" when the documents
genuinely don't cover a topic is the correct outcome. The real failure is a fabricated,
confident-sounding answer with no real support.

**Q12. How do I debug a wrong RAG answer?**
Check the citation/retrieved chunks first. If the wrong chunk was retrieved, it's a retrieval
problem (embedding model, chunking, similarity threshold). If the right chunk was retrieved
but the answer still misstates it, it's a generation/grounding problem.

## Memory Tricks and Mnemonics

- **RAG = "Read, then Answer, Grounded."** Retrieve first, generate second, always grounded
  in what was retrieved.
- **"Embeddings are GPS coordinates for meaning."** Similar meaning = nearby coordinates,
  regardless of shared words.
- **Bi vs Cross: "Bi is fast and Blind (to interaction), Cross is Careful and Costly."**
  Bi-encoders never let query and document "see" each other; cross-encoders do.
- **MTEB = "The universal exam for translators (embedding models)."** Standardized, multi
  -task, lets you compare models fairly.
- **Chunking rule of thumb: "Not a crumb, not a cake — a clean slice."** Too small loses
  context; too big blurs focus.
- **HNSW = "Highways, then Neighborhood streets."** Sparse long-range connections at the top
  layer (highways), dense precise connections at the bottom (local streets).
- **Vector DB choice: "Chroma to try, Qdrant to fly, Pgvector to tie (into Postgres)."**
- **Similarity metric default: "When in doubt, go with Cosine — it's about direction, not
  distance."**
- **Metadata filtering: "Filter first, search second, for anything security-critical."**
  Access control belongs in the query, not the prompt.
- **Grounding mantra: "Cite it, or say you don't know it."**

## Bullet-Point Revision List

- RAG closes the gap between a frozen model and your private, current documents.
- Embeddings turn text into vectors; dense retrieval ranks by vector closeness.
- Bi-encoders retrieve at scale; cross-encoders rerank a small shortlist precisely.
- MTEB benchmarks embedding models; check the retrieval sub-score, and validate on your own
  data.
- BGE and E5 are leading open embedding families; both use query/passage-aware training.
- Chunking splits documents into coherent, retrievable units — structure-aware or recursive
  splitting is a safer default than naive fixed-size cuts.
- Chunk size (~200–500 tokens) and overlap (~10–20%) should be tuned empirically.
- HNSW makes vector search fast at scale via a multi-layer approximate graph.
- Qdrant, Chroma, and pgvector trade off production scale, prototyping speed, and relational
  integration respectively.
- Cosine similarity is the standard metric; tune `top_k` and a score threshold together.
- Metadata filtering adds exact constraints (access, date, language) on top of semantic
  search; enforce access control at the query layer.
- Grounded generation forces answers from retrieved context, requires citations, and treats
  "I don't know" as a valid, correct answer.
