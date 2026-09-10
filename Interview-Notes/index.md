---
title: "Interview Notes"
---

# Interview Notes

Theory-only interview preparation for AI/LLM engineering roles — every file is a Q&A reference, no coding exercises. Skim the questions, check your answer against the expected one, and revisit anything that feels shaky.

| File | Covers |
| --- | --- |
| [AI Fundamentals](./AI-Fundamentals.md) | AI vs ML vs DL, supervised/unsupervised/reinforcement learning, training vs inference, what makes LLMs different from traditional ML. |
| [LLM Theory](./LLM-Theory.md) | Tokens, context windows, temperature and sampling, decoding strategies, model families, hallucination, RLHF. |
| [Transformer Theory](./Transformer-Theory.md) | Self-attention, Query/Key/Value, multi-head attention, positional encoding, encoder vs decoder architectures, KV cache. |
| [Prompt Engineering Theory](./Prompt-Engineering-Theory.md) | Prompt anatomy, zero/few-shot, chain-of-thought, self-consistency, structured output, tool calling, guardrails, prompt injection. |
| [Embeddings Theory](./Embeddings-Theory.md) | What embeddings are, static vs contextual, embedding models, similarity metrics, dimensionality tradeoffs. |
| [Vector Database Theory](./Vector-DB-Theory.md) | HNSW, ANN vs exact search, indexing tradeoffs, metadata filtering, choosing a vector database. |
| [RAG Theory](./RAG-Theory.md) | Why RAG, chunking, retrieval vs generation failure modes, hybrid search, reranking, grounded generation, RAGAS evaluation. |
| [AI Agents Theory](./AI-Agents-Theory.md) | The agent loop, ReAct, tool design, stop conditions, agent memory, workflow vs. agent decision-making. |
| [MCP Theory](./MCP-Theory.md) | What the Model Context Protocol is, host/client/server architecture, how it relates to tool calling and agents. |

## How to use this section

- Each file has 10-15 questions ranging from fundamental definitions to nuanced trade-off questions an interviewer uses to probe depth.
- Answers are written as concise bullet points — the key points an interviewer wants to hear, not a full essay.
- A handful of files include a small Mermaid diagram where a visual genuinely clarifies the mechanism (attention flow, the RAG pipeline, the agent loop, MCP architecture, HNSW search).
- This section assumes the conceptual grounding built across `Week-01` through `Week-07` — if a question here doesn't fully click, the matching week's topic file has the full explanation.
