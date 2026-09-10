---
title: "Diagrams and Workflows"
week: 3
---

# Diagrams and Workflows

Five Mermaid diagrams covering the full Week 3 pipeline, from raw documents to a grounded,
cited answer.

## 1. Full End-to-End RAG Pipeline

*Caption: The complete flow from raw documents to a grounded answer, spanning the offline
indexing pipeline and the online query pipeline.*

```mermaid
flowchart TD
    subgraph Offline["Offline Indexing Pipeline"]
        A[Load Documents:\nPDFs, web pages, wikis] --> B[Chunking]
        B --> C[Embedding Model]
        C --> D[(Vector Database\nwith metadata)]
    end

    subgraph Online["Online Query Pipeline"]
        E[User Question] --> F[Embed Question]
        F --> G[Similarity Search\n+ Metadata Filter]
        D --> G
        G --> H{Above confidence\nthreshold?}
        H -->|No| I["'I don't know' response"]
        H -->|Yes| J[Assemble Grounded Prompt\nwith cited chunks]
        J --> K[LLM Generation]
        K --> L[Answer + Citations]
    end
```

## 2. Chunking and Embedding Flow

*Caption: How a raw document becomes a set of embedded, metadata-tagged, searchable vectors.*

```mermaid
flowchart LR
    A[Raw Document] --> B{Choose Chunking\nStrategy}
    B --> C["Chunks\n(with overlap)"]
    C --> D[Attach Metadata:\nsource, section, page, date]
    D --> E[Embedding Model]
    E --> F["Vector + Text + Metadata\n(stored as one record)"]
    F --> G[(Vector Database Index)]
```

## 3. Similarity Search Baseline (No Reranking)

*Caption: The simplest retrieval baseline — embed the query, search, apply a threshold, take
the top-k. Good starting point before adding reranking or hybrid search.*

```mermaid
flowchart TD
    A[User Query] --> B[Embed Query]
    B --> C[Vector DB: ANN Search]
    C --> D["Ranked Candidates\n(cosine similarity scores)"]
    D --> E{Score >= threshold?}
    E -->|No| F[Discard]
    E -->|Yes| G[Keep in Top-K]
    G --> H[Return to Application]
```

## 4. Retrieve-Then-Rerank Pipeline (Bi-Encoder + Cross-Encoder)

*Caption: The production-grade retrieval pattern — a fast bi-encoder narrows millions of
documents to a shortlist, then a slower cross-encoder precisely reranks just that shortlist.*

```mermaid
flowchart TD
    Q[User Query] --> BE[Bi-Encoder]
    Corpus[(Millions of\nPre-embedded Chunks)] --> ANN[ANN Search]
    BE --> ANN
    ANN --> Shortlist["Top ~50-100\nCandidates"]
    Shortlist --> CE[Cross-Encoder Reranking]
    Q --> CE
    CE --> Final["Final Top 3-5\nHigh-Precision Chunks"]
    Final --> Prompt[Inserted into LLM Prompt]
```

## 5. HNSW Graph Traversal Sketch

*Caption: How HNSW's layered graph structure lets a query "hop" toward the nearest vectors
in roughly logarithmic time instead of scanning the entire dataset.*

```mermaid
flowchart TD
    subgraph Top["Top Layer (few nodes, long jumps)"]
        T1((•)) --- T2((•))
    end
    subgraph Mid["Middle Layer"]
        M1((•)) --- M2((•)) --- M3((•))
    end
    subgraph Bottom["Bottom Layer (all vectors, dense)"]
        B1((•)) --- B2((•)) --- B3((•)) --- B4((•)) --- B5((•))
    end
    Query[Query Vector] --> T1
    T1 -->|greedy hop| T2
    T2 -->|drop a layer| M2
    M2 -->|greedy hop| M3
    M3 -->|drop a layer| B4
    B4 -->|final greedy search| B5
    B5 --> Result[Approximate Top-K Neighbors]
```
