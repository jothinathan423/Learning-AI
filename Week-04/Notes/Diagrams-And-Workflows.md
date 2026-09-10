---
title: "Diagrams & Workflows — Week 4"
---

# Diagrams & Workflows — Week 4

Five Mermaid diagrams covering the core mechanisms of Week 4, each with a short caption.

## 1. Failure Separation Decision Tree

*Caption: The first diagnostic step for any wrong RAG answer — classify before you fix.*

```mermaid
flowchart TD
    A[Wrong answer reported] --> B[Open Inspection View:\nquestion + retrieved chunks + answer]
    B --> C{Do retrieved chunks contain\nthe answer-bearing information?}
    C -- No --> D[Retrieval failure]
    C -- Yes --> E[Generation failure]
    D --> F[Fix: hybrid search, reranking,\nquery rewriting, HyDE, chunking]
    E --> G[Fix: prompting, context selection,\nmodel choice]
```

## 2. Hybrid Search Fusion Flow

*Caption: Two independent retrieval signals, fused by rank position via Reciprocal Rank Fusion.*

```mermaid
flowchart LR
    Q[Query] --> BM25[BM25 keyword search]
    Q --> DENSE[Dense semantic search]
    BM25 --> L1[Ranked list A]
    DENSE --> L2[Ranked list B]
    L1 --> RRF["RRF fusion:\nscore = Σ 1/(k+rank)"]
    L2 --> RRF
    RRF --> FUSED[Single fused ranked list]
```

## 3. Rerank-Then-Generate Pipeline

*Caption: A wide recall-oriented shortlist gets narrowed to a precise final set before it ever
reaches the LLM.*

```mermaid
flowchart TD
    Q[Query] --> RET[Retrieval / hybrid fusion]
    RET --> WIDE[Wide shortlist: top 20-50]
    WIDE --> CE[Cross-encoder reranker\nscores query+doc jointly]
    CE --> NARROW[Narrow final set: top 3-5]
    NARROW --> GEN[LLM generates answer]
```

## 4. Query Transformation Before Retrieval (Rewriting + HyDE)

*Caption: Two different ways to transform the query before it reaches the retriever — rewrite
into a better question, or generate a fake answer to search with instead.*

```mermaid
flowchart TD
    RAW[Raw user query] --> CHOICE{Transformation strategy}
    CHOICE -- Rewrite --> REWRITE[LLM rewrites into a clear,\nself-contained question]
    CHOICE -- HyDE --> HYDE[LLM writes a hypothetical\nanswer, not shown to user]
    REWRITE --> RETRIEVE1[Retriever searches with\nthe rewritten question]
    HYDE --> EMBED[Embed the hypothetical answer]
    EMBED --> RETRIEVE2[Retriever searches with\nthat embedding]
    RETRIEVE1 --> RESULTS[Retrieved chunks]
    RETRIEVE2 --> RESULTS
```

## 5. Measurement Loop (Prove Every Change)

*Caption: The loop that turns "I think this helped" into "I proved this helped," applied to
every technique this week.*

```mermaid
flowchart TD
    SET[Labeled test set:\nquestions + ground-truth docs] --> BASE[Run through current pipeline]
    BASE --> M1[Compute hit-rate@k,\nrecall@k, MRR]
    M1 --> CHANGE[Make ONE change:\nhybrid / rerank / rewrite / HyDE / MMR]
    CHANGE --> RERUN[Re-run SAME test set]
    RERUN --> M2[Compute metrics again]
    M2 --> COMPARE{Improved?}
    COMPARE -- Yes --> KEEP[Keep the change]
    COMPARE -- No --> REVERT[Revert or investigate further]
```
