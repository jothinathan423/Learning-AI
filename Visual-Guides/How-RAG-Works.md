---
title: "How RAG Works"
---

# How RAG Works

Retrieval-Augmented Generation (RAG) grounds an LLM's answers in a specific set of documents
instead of relying only on what the model memorized during training. It splits into two
distinct phases that happen at very different times: an **ingestion** phase (done once, or
whenever documents change) that prepares a searchable knowledge base, and a **query** phase
(done every time a user asks a question) that retrieves relevant material and feeds it to the
LLM as context. The diagrams below cover both phases and how they connect.

## 1. Ingestion Phase: Building the Knowledge Base

```mermaid
flowchart LR
    A["Source Documents\n(PDFs, docs, web pages,\nwikis, tickets...)"] --> B["Load & Parse"]
    B --> C["Chunk\n(split into smaller,\noverlapping passages)"]
    C --> D["Embed\n(each chunk → vector)"]
    D --> E["Store\n(vector DB: chunk text +\nvector + metadata)"]
```

**What this shows:** documents are loaded, split into manageable chunks (small enough to be
semantically focused, usually with some overlap so context isn't lost at chunk boundaries),
converted to embedding vectors, and stored in a vector database alongside their original text
and metadata (source, page, timestamp, etc.). This phase runs offline / in the background —
never in the critical path of a user's question.

## 2. Query Phase: Answering a Question

```mermaid
flowchart LR
    Q["User Question"] --> QE["Embed the Query\n(same embedding model)"]
    QE --> R["Retrieve\n(vector search: top-k\nnearest chunks)"]
    R --> RR["Rerank (optional)\n(cross-encoder re-scores\ntop-k for relevance)"]
    RR --> CTX["Assemble Context\n(top chunks + citations)"]
    Q --> CTX
    CTX --> GEN["Generate\n(LLM answers using\nquestion + retrieved context)"]
    GEN --> OUT["Answer + Citations"]
```

**What this shows:** the user's question is embedded with the *same* model used during
ingestion, used to retrieve the top-k most similar chunks from the vector database, optionally
reranked by a more precise (but slower) cross-encoder model to push the truly best chunks to
the top, then assembled into a prompt alongside the original question. The LLM generates its
answer grounded in that retrieved context rather than from memory alone.

## 3. The Full Pipeline, End to End

```mermaid
flowchart TD
    subgraph Ingest["Ingestion (offline, once per doc/update)"]
        A1["Source Docs"] --> A2["Chunk"] --> A3["Embed"] --> A4["Store in Vector DB"]
    end
    subgraph Query["Query (online, per user question)"]
        B1["User Question"] --> B2["Embed Query"]
        B2 --> B3["Retrieve top-k\nfrom Vector DB"]
        A4 -.-> B3
        B3 --> B4["Rerank (optional)"]
        B4 --> B5["Build Prompt:\nquestion + context chunks"]
        B5 --> B6["LLM Generates Answer"]
        B6 --> B7["Answer with Citations\nback to source chunks"]
    end
```

**What this shows:** the two phases meet at exactly one point — the vector database populated
during ingestion is what gets searched during every query. This separation is why RAG scales
well: adding new documents only requires re-running ingestion on the new material, not
retraining or fine-tuning the model itself.

## 4. Why Citations Matter

```mermaid
flowchart LR
    C1["Retrieved Chunk\n(source: policy.pdf, p.4)"] --> GEN["LLM Generation"]
    C2["Retrieved Chunk\n(source: faq.md, §3)"] --> GEN
    GEN --> ANS["Answer text"]
    ANS --> CITE1["[1] policy.pdf, p.4"]
    ANS --> CITE2["[2] faq.md, §3"]
```

**What this shows:** because each chunk retains its source metadata all the way through
retrieval, the final answer can point back to exactly which document (and often which
page/section) supports each claim — letting a user verify the answer instead of trusting it
blindly, and giving the system a defense against hallucination by making unsupported claims
visibly missing a citation.

## Key Insight

RAG's core trick is separating "what the model knows" from "what the model can look up" —
retrieval supplies fresh, specific, verifiable knowledge at answer time, while the LLM supplies
fluent reasoning and language generation over whatever it's handed. This is fundamentally
different from fine-tuning (which bakes knowledge into model weights): RAG's knowledge base can
be updated instantly by re-ingesting documents, with no retraining required.
