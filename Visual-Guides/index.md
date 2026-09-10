---
title: "Visual Guides"
---

# Visual Guides

Quick, heavily-diagrammed references for the core mechanisms behind modern AI systems. Each
guide is short on prose and long on Mermaid diagrams — meant for a fast refresher on *how
something works*, not a full topic deep-dive (see the weekly `Topics/` chapters for that).

## The Guides

- **[How Transformers Work](./How-Transformers-Work.md)** — the full transformer architecture:
  embedding → positional encoding → stacked attention/feed-forward blocks → output.
- **[How Attention Works](./How-Attention-Works.md)** — the query/key/value mechanism behind
  self-attention, and how multi-head attention runs it in parallel.
- **[How Embeddings Work](./How-Embeddings-Work.md)** — turning text into vectors, and how
  distance in vector space maps to semantic similarity.
- **[How RAG Works](./How-RAG-Works.md)** — the full retrieval-augmented generation pipeline,
  from document ingestion through retrieval to grounded, cited generation.
- **[AI Agent Lifecycle](./AI-Agent-Lifecycle.md)** — the plan → act → observe → repeat → stop
  loop, including tool calls and memory reads/writes.
- **[MCP Architecture](./MCP-Architecture.md)** — the Model Context Protocol's host/client/server
  design for exposing tools, resources, and prompts to an AI application.
- **[Tokenization Flow](./Tokenization-Flow.md)** — raw text → subword tokens → token IDs →
  embedding lookup, with a worked mini example.
- **[Fine-Tuning Lifecycle](./Fine-Tuning-Lifecycle.md)** — base model → curated dataset →
  training loop → evaluation → deployment, including where LoRA fits in.

## Comparisons

Side-by-side comparisons of commonly confused tools, techniques, and concepts — see the
**[Comparisons index](./Comparisons/index.md)** for the full list, including:

- **[LLM vs Traditional ML](./Comparisons/LLM-Vs-Traditional-ML.md)** — narrow, task-specific
  models versus general-purpose language models.
- **[Dense vs Sparse Embeddings](./Comparisons/Dense-Vs-Sparse-Embeddings.md)** — neural
  semantic vectors versus classical lexical representations.
- **[RAG vs Fine-Tuning](./Comparisons/RAG-Vs-Fine-Tuning.md)** — retrieving fresh context
  versus baking knowledge into model weights.
- **[Agent vs Workflow](./Comparisons/Agent-Vs-Workflow.md)** — dynamic, LLM-driven control
  flow versus fixed, developer-defined orchestration.
- **[Prompt Template vs System Prompt](./Comparisons/Prompt-Template-Vs-System-Prompt.md)** —
  per-request message structure versus persistent session-level behavior.
- **[LangChain vs Semantic Kernel](./Comparisons/LangChain-Vs-Semantic-Kernel.md)** — two
  major frameworks for building LLM-powered applications.
- **[Vector DB Comparison](./Comparisons/Vector-DB-Comparison.md)** — Qdrant, Chroma, pgvector,
  Pinecone, and Weaviate on hosting, indexing, filtering, and ideal use case.
- **[OpenAI vs Anthropic API](./Comparisons/OpenAI-Vs-Anthropic-API.md)** — conceptual
  differences in message shape, tool calling, structured output, and context windows.
