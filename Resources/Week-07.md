---
title: "Week 7 Resources — Agents, ReAct & LangGraph"
---

# Week 7 Resources — Agents, ReAct & LangGraph

Curated further reading for the agent loop, ReAct, tool design, stop conditions, agent memory,
and LangChain/LangGraph.

## Beginner

- **LangChain's official documentation — "Agents" section** (Official Docs) — the primary
  reference for how a widely-used framework implements the think-act-observe loop this week
  builds by hand.
- **LangGraph official documentation (Official Docs)** — the direct reference for Topic 10;
  read this rather than secondary tutorials since the API surface changes across releases.
- **Anthropic's and OpenAI's own guidance on building agents / tool use** (Official Docs / Blog)
  — vendor-written practical guidance, including when *not* to reach for an agent, echoing
  Topic 05's workflows-vs-agents framing.
- **Mem0 official documentation (Official Docs / GitHub)** — the primary source for what a
  managed memory layer actually automates, directly relevant to Topic 09.

## Intermediate

- **"ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2022)** (Research
  Paper) — the original ReAct paper behind Topic 02; short and directly implementable, matching
  what this week builds by hand.
- **"Toolformer: Language Models Can Teach Themselves to Use Tools" (Schick et al., 2023)**
  (Research Paper) — an influential paper on how models learn to invoke tools, useful background
  for Topic 03's tool-design discussion.
- **LangChain's blog posts comparing "workflows" and "agents"** (Blog) — practitioner framing
  that mirrors Topic 05–06's distinction and the agent-vs-workflow "race" methodology.
- **Engineering blog posts on production agent memory (rolling summarization, vector-store-backed
  memory)** (Blog) — real implementations of Topic 08's summarisation-and-vector-memory pattern,
  often written by the same teams building memory libraries like Mem0.

## Advanced

- **"AutoGPT" and early autonomous-agent project writeups (GitHub / Blog)** — historically
  important (if now superseded) examples of unconstrained agent loops, useful for understanding
  *why* Topic 04's stop conditions and budgets matter so much in practice.
- **"A Survey on Large Language Model based Autonomous Agents" (Wang et al., 2023 or similar
  survey-class papers on arXiv)** (Research Paper) — broad academic coverage connecting agent
  loops, memory, and tool use into one taxonomy.
- **"Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)**
  (Research Paper) — extends the ReAct loop with self-critique and memory of past attempts,
  a natural "what's next" after Topics 01–02.
- **LangGraph's own case studies / example repos on GitHub** (GitHub) — real multi-step agent
  graphs built with the framework, good material for seeing Topic 10's abstractions in a working
  codebase rather than a diagram.

[Back to Resources index](/Resources/) · [Week 7](/Week-07/README)
