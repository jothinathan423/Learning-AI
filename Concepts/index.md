---
title: "Concept Library"
---

# Concept Library

A standalone reference for the major concepts underpinning the 7-week AI-engineering curriculum. Each entry is a self-contained deep-dive — definition, detailed explanation, a diagram, examples, advantages, limitations, related concepts, and theory-only interview questions — independent of any specific week, so you can jump straight to the idea you need without following the week-by-week path.

For a one-sentence-per-term lookup instead, see the [AI Engineering Glossary](../AI-GLOSSARY.md).

## Language Model Foundations

- [LLM](./LLM.md) — what a large language model is and how next-token prediction produces everything it generates.
- [Tokens](./Tokens.md) — how text is split into the sub-word units models actually read, and why it drives cost and limits.
- [Context-Window](./Context-Window.md) — the hard cap on how much text a model can attend to in a single call.
- [Embeddings](./Embeddings.md) — turning text into numeric vectors that place similar meanings near each other.
- [Attention](./Attention.md) — the mechanism letting each token weigh and pull information from every other token.
- [Transformer](./Transformer.md) — the architecture, built on attention, powering nearly every modern LLM.

## Retrieval & RAG

- [RAG](./RAG.md) — retrieval-augmented generation: grounding a model's answer in real, retrieved documents instead of memory alone.
- [Vector-Database](./Vector-Database.md) — storing and searching millions of embeddings efficiently at scale.
- [Hybrid-Search](./Hybrid-Search.md) — combining exact keyword matching with semantic similarity for more robust retrieval.
- [Reranking](./Reranking.md) — re-scoring a first-pass retrieval's candidates with a slower, more precise model before generation.

## Prompting & Structured Output

- [Prompt-Engineering](./Prompt-Engineering.md) — designing prompts deliberately to get reliable, high-quality outputs.
- [Function-Calling](./Function-Calling.md) — letting a model request a real action from your code via a structured schema.
- [Structured-Output](./Structured-Output.md) — constraining a model's response to a validated, machine-readable schema.

## Evaluation & Safety

- [Guardrails](./Guardrails.md) — deterministic and model-based checks that keep inputs and outputs within safe, intended bounds.
- [Hallucination](./Hallucination.md) — confident, fluent output that is nonetheless factually wrong or ungrounded.
- [Error-Analysis](./Error-Analysis.md) — systematically finding, categorizing, and prioritizing a system's real failure patterns.
- [LLM-As-Judge](./LLM-As-Judge.md) — using one model to grade another model's output at scale.

## Agents & Memory

- [Agent-Loop](./Agent-Loop.md) — the think → act → observe → repeat cycle underneath every AI agent.
- [AI-Agent](./AI-Agent.md) — a system where the model decides its own next steps at run time instead of following a fixed sequence.
- [Memory](./Memory.md) — how an agent retains information within a long task and across separate sessions.
- [Multi-Agent-System](./Multi-Agent-System.md) — multiple specialized agents collaborating under an orchestrator on one larger task.
- [MCP](./MCP.md) — the open standard for connecting AI applications to external tools and data through one uniform protocol.
