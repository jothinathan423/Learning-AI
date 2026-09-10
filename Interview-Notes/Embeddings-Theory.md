---
title: "Embeddings Interview Notes"
---

# Embeddings Interview Notes

What embeddings are, how similarity is measured, and the practical tradeoffs behind choosing an embedding model — the foundation underneath semantic search, RAG, and vector databases.

## Questions & Answers

### Q1. What is an embedding, in plain terms?
**Expected answer:**
- An embedding is a way of representing a piece of data (a word, sentence, document, image, etc.) as a fixed-length list of numbers (a vector) in a high-dimensional space, such that items with similar meaning end up positioned close together in that space.
- The key property that makes embeddings useful: geometric closeness in the vector space corresponds to semantic closeness in meaning — "dog" and "puppy" end up near each other; "dog" and "spreadsheet" end up far apart.
- This turns a fuzzy, human notion ("these two things mean similar things") into something a computer can measure precisely with simple math (distance/similarity between vectors).

### Q2. What's the difference between static and contextual embeddings?
**Expected answer:**
- **Static embeddings** (e.g., Word2Vec, GloVe) assign exactly one fixed vector to each word, regardless of context — the word "bank" gets the same embedding whether it means a riverbank or a financial institution.
- **Contextual embeddings** (produced by Transformer-based models like BERT or modern LLM embedding models) generate a different vector for the same word depending on its surrounding context — "bank" in "river bank" and "bank" in "bank account" get different embeddings, because the model's self-attention lets each token's representation absorb information from its actual surrounding sentence.
- Contextual embeddings are strictly more expressive and are what nearly all modern semantic search and RAG systems use; static embeddings are cheaper to compute (a simple lookup) but can't handle polysemy (multiple meanings) or genuinely context-dependent meaning.

### Q3. How are embedding models actually trained?
**Expected answer:**
- Static embeddings (Word2Vec-style) are trained on a proxy task like predicting a word from its surrounding words (or vice versa) across a huge text corpus — words that appear in similar contexts end up with similar vectors purely as a side effect of that training objective.
- Modern sentence/document embedding models are typically built on top of a pretrained Transformer, then further trained (often via contrastive learning) on pairs of texts labeled as similar or dissimilar — the model is optimized to pull known-similar pairs' embeddings closer together and push known-dissimilar pairs' embeddings farther apart.
- The result is a model specifically optimized for producing embeddings where distance corresponds to semantic similarity for the task it was tuned on (e.g., search relevance, paraphrase detection) — not every embedding model is equally good at every downstream similarity task.

### Q4. What does embedding dimensionality mean, and what's the tradeoff in choosing it?
**Expected answer:**
- Dimensionality is the length of the vector (e.g., 384, 768, 1536, 3072 numbers) — more dimensions generally allow the embedding to capture more nuanced distinctions in meaning.
- Higher dimensionality tends to improve representational quality/accuracy up to a point, but costs more: more storage per vector, more compute for similarity calculations, and more memory in a vector index — this matters enormously at scale (millions/billions of vectors).
- Many modern embedding APIs support dimensionality reduction (e.g., Matryoshka-style embeddings that can be truncated to fewer dimensions with graceful, not catastrophic, quality loss), letting teams trade off some accuracy for significantly lower storage/compute cost when appropriate.

### Q5. What are the common ways to measure similarity between two embeddings?
**Expected answer:**
- **Cosine similarity** — measures the angle between two vectors, ignoring their magnitude; ranges from -1 to 1 (or 0 to 1 for non-negative embeddings), and is the most common choice for text embeddings because it captures directional similarity regardless of vector length.
- **Dot product** — similar to cosine similarity but also affected by vector magnitude; often used when embeddings are pre-normalized to unit length (in which case dot product and cosine similarity give identical rankings, and dot product is cheaper to compute).
- **Euclidean (L2) distance** — measures straight-line distance between two points in the vector space; smaller distance means more similar. Common in some clustering/indexing contexts but less standard for text similarity than cosine.
- Which metric to use is often dictated by the embedding model itself — most modern text embedding models are trained/optimized against a specific metric (usually cosine or dot product), and using a mismatched metric can silently degrade retrieval quality.

### Q6. Name some popular embedding models/providers and what distinguishes them.
**Expected answer:**
- **OpenAI's text-embedding models** (e.g., text-embedding-3) — general-purpose, API-based, strong baseline performance across many domains, support variable output dimensionality.
- **Cohere embed models** — API-based, strong multilingual support, offer separate modes optimized for search queries vs. search documents.
- **Sentence-Transformers (open-source, e.g., all-MiniLM, BGE, E5 family)** — self-hostable, no per-call API cost, wide range of sizes/quality tradeoffs, popular for teams needing local/private deployment.
- The practical decision drivers: quality on your specific domain/language, cost model (API-per-call vs. self-hosted compute), latency requirements, and whether data privacy rules require keeping embeddings generation entirely in-house.

### Q7. How do you get a single embedding for a whole sentence or document, not just a word?
**Expected answer:**
- Modern sentence/document embedding models are trained end-to-end to directly output one embedding per input text, but the underlying Transformer still technically produces one vector per token first — getting from "per-token vectors" to "one vector for the whole input" requires a **pooling strategy**.
- Common pooling approaches: using a special aggregate token's representation (e.g., BERT's `[CLS]` token), or **mean pooling** (averaging all token vectors, often weighted by an attention mask to ignore padding).
- For documents longer than the embedding model's max input length, a common practice is chunking the document first (see the RAG interview notes) and embedding each chunk separately, rather than trying to compress an entire long document into one single vector, since a single vector for a very long document tends to lose too much specific detail.

### Q8. How does semantic search actually use embeddings end to end?
**Expected answer:**
- Every document (or document chunk) in a corpus is embedded in advance and stored, typically in a vector database/index.
- At query time, the user's query is embedded using the same embedding model.
- The query embedding is compared against all stored document embeddings using a similarity metric, and the top-k most similar documents/chunks are returned as the most semantically relevant results.
- This differs fundamentally from keyword search (like BM25), which matches based on exact/overlapping terms — semantic search can retrieve a relevant document even if it shares no exact words with the query, as long as the meaning is close (e.g., "car" query matching a document about "automobile"), which is also why hybrid search combining both approaches often outperforms either alone (see the RAG and Vector-DB interview notes).

### Q9. What is embedding drift, and why does it matter operationally?
**Expected answer:**
- Embedding drift refers to the fact that embeddings from different model versions (or entirely different models) are generally not comparable — a vector produced by model version A doesn't live in the same meaningful space as a vector produced by model version B, even for the same text.
- Practically, this means: if you upgrade your embedding model, you cannot simply mix old and new embeddings in the same index — you must re-embed your entire existing corpus with the new model and rebuild the index, or comparisons will be meaningless (or silently degraded, which is worse because it's not obviously broken).
- Teams need to track which embedding model version was used to generate any stored vector, and plan for periodic full re-embedding as part of model upgrades, similar to a schema migration.

### Q10. Why do many embedding models normalize vectors to unit length, and does it matter?
**Expected answer:**
- Normalizing an embedding to unit length (L2 norm = 1) means the vector's magnitude no longer carries information — only its direction does.
- This makes cosine similarity and dot product mathematically equivalent (dot product of two unit vectors equals their cosine similarity), which simplifies both the math and index implementation (many vector databases have faster paths for dot product on normalized vectors than for computing cosine similarity directly).
- It matters practically because mixing normalized and non-normalized vectors, or using a mismatched similarity metric, can produce inconsistent or degraded search rankings — this is a common, hard-to-notice source of bugs in real systems.

### Q11. Why are embeddings preferred over one-hot encoding for representing words/categories?
**Expected answer:**
- **One-hot encoding** represents each distinct word/category as a sparse vector with a single 1 and all other entries 0 — every word is equally "far" from every other word (no notion of similarity), and the vector length grows with vocabulary size (potentially hundreds of thousands of dimensions for natural language).
- **Embeddings** are dense, low(er)-dimensional vectors that capture actual semantic relationships — similar meanings end up close together, and the fixed, much smaller dimensionality makes them far more practical for large vocabularies.
- One-hot encoding also can't handle a new/unseen word at all (it wasn't in the fixed vocabulary), whereas modern embedding approaches, especially subword-based ones, can produce a reasonable representation for previously unseen text.

### Q12. What are multi-modal embeddings, and what do they enable?
**Expected answer:**
- Multi-modal embeddings (e.g., CLIP-style models) map different types of data — text and images, for instance — into the *same* shared vector space, such that a text description and a matching image end up close together in that space even though they're fundamentally different kinds of input.
- This enables cross-modal search: finding images using a text query, or finding similar images to a given image, or even zero-shot image classification by comparing an image's embedding against embeddings of candidate text labels.
- The training approach is typically contrastive: pairs of matching text-image examples are pulled together in the shared space, while non-matching pairs are pushed apart, at large scale.

### Q13. Give an intuitive explanation for why embeddings can capture relationships like analogies (e.g., king - man + woman ≈ queen).
**Expected answer:**
- This behavior emerges from how these models are trained on massive amounts of real text where words with similar roles/relationships tend to appear in similar surrounding contexts — the training objective ends up encoding not just "similarity" but also consistent directional relationships (e.g., the vector direction from "man" to "woman" ends up roughly similar to the direction from "king" to "queen," because both pairs share a consistent "gender" relationship pattern across many contexts in the data).
- It's a striking illustration that embedding spaces don't just cluster similar things — they can encode structured relationships as geometric directions, though this property is most cleanly demonstrated in older static word embeddings, and is a less commonly cited/tested property of large contextual embedding models, which are optimized more directly for retrieval/similarity tasks than for showcasing this kind of vector arithmetic.

### Q14. What are the practical limitations of embeddings that engineers should watch for?
**Expected answer:**
- **Out-of-domain performance** — an embedding model trained mostly on general web text may perform poorly on highly specialized domains (legal, medical, proprietary internal jargon) unless fine-tuned or chosen specifically for that domain.
- **Inherited bias** — since embeddings are learned from real-world text/data, they can encode and reproduce societal biases present in the training data (e.g., stereotypical associations), which can surface in downstream applications like search ranking or recommendation.
- **Loss of exact/lexical matching** — semantic similarity can sometimes miss cases where exact keyword/term matching actually mattered (e.g., a specific product code or legal clause number), which is a core reason hybrid search (combining embeddings with keyword search) is often preferred over embeddings alone in production retrieval systems.
- **No inherent explainability** — it's hard to say precisely *why* two embeddings are considered similar by the model, which can complicate debugging poor retrieval results.
