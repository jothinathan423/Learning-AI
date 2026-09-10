---
title: "Week 7: Agent Loops — and When Not to Use Them"
week: 7
difficulty: Advanced
readingTime: "130 min (full week)"
---

# Week 7: Agent Loops — and When Not to Use Them

## Learning Summary

Every app you've built so far runs one step at a time — even the tool-calling apps from Week 2 make one call and return. Some real tasks need several steps where each step depends on what the last one found, and that's where an **agent** comes in: an app that loops — think, act, look at the result, repeat — until it decides it's done, with an LLM choosing the next action at every turn instead of you fixing that order in advance. This week you build that loop yourself, by hand, so it's never a black box: the think→act→observe cycle and its concrete ReAct implementation, how to design tools and their descriptions so the model reliably picks the right one, how to stop the loop safely with hard limits on steps, cost, and time, and how to give an agent both short-term working memory and long-term memory that survives across tasks. Just as importantly, you'll learn the central theme of the week: an agent is not always the right tool. When you already know the exact steps a task needs, a fixed, hand-written sequence is faster, cheaper, and far more predictable — agents earn their cost only when the correct next step genuinely can't be known until a previous step's real result comes back.

- **Estimated reading time:** ~130 minutes for all 10 topics, plus notes, cheat sheet, and revision.
- **Difficulty level:** Advanced.
- **Prerequisites:** Week 2 (structured output and tool/function calling — an agent loop is built directly on top of tool calling); Week 6 (evals — judging whether an agent's final answer, and each step along the way, actually succeeded).

## What You'll Master After This Week

- The agent loop itself: think → act → observe → repeat, and why this shape — not "uses an LLM," not "uses tools" — is what actually defines an agent.
- **ReAct**, the concrete Thought/Action/Observation pattern that makes the loop implementable, loggable, and debuggable.
- How to design tools — names, descriptions, argument schemas, error messages — so a model with no access to your code reliably picks the right one.
- How to enforce hard stop conditions and budgets (step count, cost, time, repetition detection) so an agent loop is guaranteed to terminate, gracefully, within acceptable bounds.
- How to tell a fixed workflow apart from a genuine agent task, and why you should default to a workflow unless a task has a concrete, articulable reason not to.
- How to run an evidence-based "race" between a fixed workflow and an agent loop on the same task, to replace intuition with measurement.
- How to give an agent short-term (working) memory for a single long task and long-term (persistent) memory that survives across sessions.
- How rolling summarisation and vector-based memory retrieval work, and how they borrow directly from RAG's embed-store-retrieve mechanism.
- What a managed memory layer like Mem0 automates versus what remains your responsibility to design.
- How LangChain and LangGraph package these same concepts into reusable components, and how to read their abstractions in terms of ideas you already understand.

## Topics Covered

1. [The Agent Loop](./Topics/01-The-Agent-Loop.md)
2. [ReAct (Reason + Act)](./Topics/02-ReAct.md)
3. [Tool Design](./Topics/03-Tool-Design.md)
4. [Stop Conditions and Budgets](./Topics/04-Stop-Conditions-And-Budgets.md)
5. [Workflows vs. Agents](./Topics/05-Workflows-Vs-Agents.md)
6. [Agent vs. Workflow Race](./Topics/06-Agent-Vs-Workflow-Race.md)
7. [Agent Memory (Short-Term and Long-Term)](./Topics/07-Agent-Memory.md)
8. [Summarisation and Vector Memory](./Topics/08-Summarisation-And-Vector-Memory.md)
9. [Mem0](./Topics/09-Mem0.md)
10. [LangChain and LangGraph](./Topics/10-LangChain-LangGraph.md)

## Reading Progress Checklist

- [ ] 01 — The Agent Loop
- [ ] 02 — ReAct (Reason + Act)
- [ ] 03 — Tool Design
- [ ] 04 — Stop Conditions and Budgets
- [ ] 05 — Workflows vs. Agents
- [ ] 06 — Agent vs. Workflow Race
- [ ] 07 — Agent Memory (Short-Term and Long-Term)
- [ ] 08 — Summarisation and Vector Memory
- [ ] 09 — Mem0
- [ ] 10 — LangChain and LangGraph
- [ ] Review Cheat Sheet
- [ ] Complete Revision
