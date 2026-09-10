---
title: "LangChain"
---

# LangChain — Master Cheat Sheet

General conceptual reference (LangChain/LangGraph is touched in Week 7; this file gives the
framework broader treatment). No coding exercises — API-shape reference only.

## Core Terminology

| Term | Meaning |
|---|---|
| LangChain | Library of composable building blocks for LLM apps: models, prompts, parsers, retrievers, memory, chains, agents |
| LangGraph | Companion library: explicit graph of nodes/edges for controllable, stateful agent flows |
| LangSmith | Observability/tracing/eval platform for LangChain (and general LLM) apps |
| Runnable | The common interface every LangChain component implements (`invoke`, `stream`, `batch`) |
| LCEL | LangChain Expression Language — pipe (`\|`) syntax for composing Runnables into a chain |
| Chain | A composed sequence of Runnables that together perform a task |
| PromptTemplate | Reusable prompt with variable placeholders |
| Output parser | Converts raw model text into a structured type (string, list, JSON, Pydantic model) |
| Retriever | Runnable that returns relevant documents for a query (wraps a vector store, etc.) |
| Memory | Component that persists conversation state across calls |
| AgentExecutor | LangChain's built-in agent loop (implicit think→act→observe cycle) |

## Core Components

| Component | Role |
|---|---|
| Chat model / LLM wrapper | Standardized interface over a provider's API (OpenAI, Anthropic, etc.) |
| Prompt template | Fills variables into a reusable prompt structure |
| Output parser | Structures the raw text response |
| Retriever | Fetches relevant context from a vector store or other source |
| Tool | A described function an agent can call |
| Memory | Stores/retrieves conversation or session state |
| Chain | Wires several of the above into one callable pipeline |
| Agent | A chain where the model itself decides the next step/tool at run time |

## LCEL Pattern (conceptual pipe composition)

```
chain = prompt_template | chat_model | output_parser

result = chain.invoke({"topic": "RAG"})
```

Each stage is a `Runnable`: same `.invoke()` / `.stream()` / `.batch()` interface, so stages
compose regardless of type (prompt, model, parser, retriever all implement it). This is the
core idea to remember — not the exact syntax, which shifts across versions.

## Typical RAG Chain Shape (conceptual)

```
retrieval_chain =
    { "context": retriever, "question": passthrough }
    | prompt_template
    | chat_model
    | output_parser
```

`retriever` fetches documents for the incoming question; the dict stage assembles the prompt's
input variables; the rest mirrors the plain LCEL pattern above.

## LangChain vs LangGraph

| | LangChain (`AgentExecutor`) | LangGraph |
|---|---|---|
| Control flow | Implicit loop, less visibility into steps | Explicit graph: nodes, edges, conditional/loop-back |
| Debuggability | Harder to inspect intermediate state | State is explicit at every node |
| Best fit | Quick prototyping, simple agents | Production agents needing custom control flow |
| Relationship | Older, simpler agent abstraction | Built for the cases AgentExecutor struggles with |

## When to Use LangChain vs Hand-Rolled Code

| Situation | Lean toward |
|---|---|
| Need many pre-built integrations (vector stores, loaders, providers) fast | LangChain |
| Learning how agent loops/tool calling actually work | Hand-rolled first, framework second |
| Simple single-call prompt + parse, no branching | Hand-rolled — a framework adds overhead for no benefit |
| Complex multi-step pipeline reusing many standard components | LangChain (or LangGraph for control-heavy flows) |
| Need full control over retries, logging, custom control flow | Hand-rolled, or LangGraph for structured control |
| Team already standardized on LangChain tooling/observability (LangSmith) | LangChain |

## Quick Reminders

- LangChain is a convenience/integration layer over concepts (prompting, tool calling, retrieval)
  you should understand independently of any framework — see Prompt-Engineering.md, RAG.md,
  AI-Agents.md, OpenAI-SDK.md.
- `Runnable` + LCEL's pipe syntax is the one idea worth internalizing: every component shares an
  interface, so chains compose like Unix pipes.
- LangGraph exists because implicit `AgentExecutor` loops become hard to debug/control at
  production complexity — reach for it when you need explicit state and branching.
- A framework doesn't remove the need for stop conditions, tool validation, or grounding — those
  responsibilities are still yours (see AI-Agents.md, RAG.md).
- Version churn is real in this ecosystem — treat exact class/import names as likely to change;
  the conceptual shapes above are the durable part.
