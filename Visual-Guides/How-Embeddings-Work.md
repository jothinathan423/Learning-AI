---
title: "How Embeddings Work"
---

# How Embeddings Work

An embedding is a way of turning text into a list of numbers (a vector) such that texts with
similar *meaning* end up with similar vectors — mathematically close together in a
high-dimensional space. This single idea underlies semantic search, RAG retrieval,
recommendation systems, and clustering. The diagrams below show the pipeline that produces an
embedding and how "closeness" in that vector space maps back to semantic similarity.

## 1. The Text-to-Vector Pipeline

```mermaid
flowchart LR
    A["Raw Text\n'The stock market fell sharply'"] --> B["Tokenization\n(split into subword tokens)"]
    B --> C["Embedding Model\n(transformer encoder)"]
    C --> D["Pooling\n(combine per-token vectors\ninto one vector, e.g. mean\nor [CLS]-token pooling)"]
    D --> E["Final Embedding Vector\n[0.12, -0.87, 0.44, ..., 0.03]\n(e.g. 384–3072 dimensions)"]
```

**What this shows:** an embedding model (usually a transformer encoder trained specifically for
this purpose) converts tokenized text into one fixed-length vector, regardless of whether the
input was five words or five hundred. That fixed-length vector is what gets stored, compared,
and searched over — the original text is reduced to a single point in vector space.

## 2. Semantic Similarity as Geometric Proximity

```mermaid
flowchart TD
    subgraph Space["Vector Space (conceptually 2D — real embeddings have hundreds+ of dimensions)"]
        direction LR
        A(("'stock market fell'"))
        B(("'shares dropped\nsharply'"))
        C(("'equities declined'"))
        D(("'I baked a\nchocolate cake'"))
    end
    A ---|"small distance —\nhigh similarity"| B
    B ---|"small distance —\nhigh similarity"| C
    A -..-|"large distance —\nlow similarity"| D
```

**What this shows:** sentences that mean roughly the same thing ("stock market fell", "shares
dropped sharply", "equities declined") land close together in vector space even though they
share almost no exact words, while an unrelated sentence ("I baked a chocolate cake") lands far
away. This is the entire point of embeddings: they capture *meaning*, not just surface word
overlap, which is what makes semantic search possible (searching by meaning rather than
keyword matching).

## 3. Comparing Vectors: Cosine Similarity

```mermaid
flowchart LR
    Q["Query Vector"] --> COS["Cosine Similarity\n(angle between vectors)"]
    D1["Document Vector A"] --> COS
    COS --> S1["Score: 0.91\n(nearly same direction\n→ highly similar)"]

    Q2["Query Vector"] --> COS2["Cosine Similarity"]
    D2["Document Vector B"] --> COS2
    COS2 --> S2["Score: 0.12\n(nearly perpendicular\n→ mostly unrelated)"]
```

**What this shows:** similarity between two embeddings is typically measured as the cosine of
the angle between them (or equivalently, dot product on normalized vectors) — a score near `1`
means the vectors point in almost the same direction (very similar meaning), while a score near
`0` means they're close to perpendicular (unrelated). This scalar score is what powers "top-k
nearest neighbor" search in a vector database.

## Key Insight

Embeddings turn the fuzzy, human notion of "these two pieces of text mean similar things" into
a concrete, computable geometric property — distance (or angle) between points in a
vector space. Every downstream capability — semantic search, RAG retrieval, deduplication,
clustering, recommendation — is really just "find the nearest points in this space," which is
why the quality of the embedding model itself is often the single biggest lever on retrieval
quality in a RAG system.
