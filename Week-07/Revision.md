---
title: "Week 7 Revision: Agent Loops"
week: 7
---

# Week 7 Revision

## 5-Minute Revision

- An **agent** is a system where the model decides the sequence of steps at run time; a **workflow** is a fixed sequence you decide in advance. Using an LLM or a tool doesn't make something an agent — the loop does.
- The **agent loop**: think → act → observe → repeat, until a final answer or a stop condition. **ReAct** is the concrete version: Thought → Action → Observation.
- **Tool design** matters enormously because the model only ever sees a tool's name, description, and schema — never your code.
- Every agent needs **stop conditions and budgets** (step count, cost, time, repetition) enforced in code — the model has no innate sense of its own non-convergence.
- **Default to a workflow.** Only reach for an agent when a task's steps genuinely can't be known until a previous step's result is seen — and even then, scope the agent loop as narrowly as possible.
- **Short-term memory** compresses one long task's transcript (truncation/summarization); **long-term memory** persists durable facts externally, retrieved by relevance across separate tasks — the same embed-store-retrieve mechanism as RAG.
- Tools like **Mem0** automate extraction, conflict resolution, and retrieval; frameworks like **LangChain/LangGraph** package the loop, tools, and memory into reusable components — but neither replaces understanding the underlying mechanism.

## 15-Minute Revision

**1. Why agents exist at all.** Some tasks can't be solved with a fixed sequence because the right next step depends on information you don't have until a previous step returns it (e.g., you don't know if an invoice is overdue until you look it up). A fixed pipeline would need an exploding number of branches to cover every outcome combination; an agent loop instead re-decides the next action after every real result.

**2. The loop's mechanics.** Structurally it's a `while` loop: call the model with the goal + tool list + history; if it returns a final answer, stop; if it returns a tool call, execute the tool, append the result to history, and loop again. There is no hidden state between iterations — the transcript *is* the agent's working memory. This is also why cost and latency scale with steps and history size: every iteration re-sends the whole growing transcript, since the model has no memory between API calls.

**3. ReAct's role.** ReAct gives the loop's "think" step a concrete shape: state a Thought (reasoning) before every Action (tool call), then read the Observation (real result) before reasoning again. This interleaving — reason a little, act, observe, reason again with new information — is what lets the model adapt mid-task, and it creates a free audit trail for debugging.

**4. Tool design as the real reliability lever.** A tool's description is the model's entire interface — there's no source code to fall back on. Overlapping, vague, or poorly-scoped tools cause real, recurring selection errors regardless of the underlying model's strength. Rules: one tool one job, describe *when* to use it, strict typed schemas, compact structured results, informative error messages (which become the next Observation the model reasons over).

**5. Stop conditions as non-negotiable infrastructure.** Layer step count, cost, wall-clock time, and repetition detection — any one of which force-stops the loop. Inject soft warnings before hard stops so the model can wrap up gracefully. Always log the stop reason; a high rate of non-"final answer" stops signals a design problem, not bad luck.

**6. Workflow vs. agent, and the race.** The test: can every step be enumerated in advance for every expected input? If yes, build a workflow (conditionals included — a fixed pipeline can branch and still be a workflow). If only one sub-step is genuinely unpredictable, keep the rest fixed and scope a narrow agent loop to just that step. When genuinely unsure, *measure*: run a properly budgeted agent and a fixed workflow against the same shared input set, grade both identically, and segment results by difficulty — the useful output is almost always a hybrid, not a single winner.

**7. Memory, two tiers.** Short-term memory keeps a single long task's transcript affordable via truncation or rolling summarization (recent turns verbatim, older turns compressed). Long-term memory persists durable, atomic facts outside any single run, embedded and stored, then retrieved by similarity into future tasks — directly borrowing RAG's mechanism, applied to an agent's own experience rather than external documents. Both need curation: summarization is lossy, and stored memories go stale and need pruning/updating.

**8. Managed tools and frameworks.** Mem0 automates fact extraction, conflict resolution (new vs. update vs. duplicate), storage, and relevance-based retrieval behind a simple API — but you still decide when to call it, how to scope users, and how much retrieved memory to use. LangChain offers broad integrations and an implicit `AgentExecutor`; LangGraph offers an explicit graph (nodes, edges, conditional and loop-back control) that maps naturally onto the "mostly workflow, agent embedded where needed" hybrid architecture. Framework APIs churn quickly; the underlying concepts are what transfer.

## Last-Minute Interview Revision

**"What is an AI agent, precisely?"**
A system in which the model decides, at run time, the number and order of steps needed to complete a task — based on the results of previous steps — rather than following a sequence fixed in advance by the engineer. Using an LLM, or even calling a tool, does not by itself make something an agent.

**"When would you NOT use an agent?"**
Whenever the task's steps can be enumerated in advance for every expected input, even with conditional branches — a fixed workflow is faster, cheaper, more predictable, and easier to test and debug. Default to a workflow; use an agent only when the correct next step genuinely can't be known until a prior step's real-world result is observed, and scope the agent as narrowly as possible even then.

**"What is ReAct, and why does it help?"**
A pattern where the model states its reasoning (Thought) before every tool call (Action), then reads the real result (Observation) before reasoning again. It improves action quality (reasoning before acting, similar to chain-of-thought) and produces a natural, auditable log of why each action was taken — critical for debugging agent failures.

**"How do you keep an agent from running forever or costing too much?"**
Enforce hard, code-level stop conditions: a maximum step count, a cost/token ceiling, a wall-clock timeout, and repetition detection (the same action repeated with no new information). Inject soft warnings before hard limits so the agent can wrap up gracefully, always return a structured partial result, and log the stop reason for monitoring.

**"What's the biggest lever for agent reliability that isn't the model itself?"**
Tool design. The model only ever sees a tool's name, description, and argument schema — never the underlying code — so ambiguous or overlapping tools cause real, recurring selection errors independent of model capability. Single-purpose tools, clear "when to use this" descriptions, strict schemas, and informative error messages are usually higher-leverage than switching to a stronger model.

**"How would you decide, for a real task, whether to build a workflow or an agent?"**
Try to write down the exact steps needed for a typical case and its known edge cases. If that's possible, build a fixed workflow. If only one specific sub-step resists enumeration, keep the rest fixed and add a small, budgeted agent loop just there. If genuinely unsure, run both a fixed workflow and a properly budgeted agent against the same input set, grade them identically, and segment results by difficulty rather than trusting an aggregate score or intuition alone.

**"What's the difference between short-term and long-term agent memory, and how is long-term memory retrieved?"**
Short-term memory manages the current task's growing transcript, typically via truncation or rolling summarization, so it stays within context limits during one run. Long-term memory persists durable, atomic facts outside any single run, in an external store; retrieval usually uses the same embed-and-similarity-search mechanism as RAG, pulling back only the small subset of stored memories relevant to the current task rather than everything ever stored.

**"What does a tool like Mem0 actually do, and what does it not do for you?"**
It automates the mechanism of long-term memory: extracting durable facts from a raw conversation, resolving conflicts against existing stored memories (new/update/duplicate), storing them, and retrieving the most relevant ones by similarity. It does not decide policy for you — you still choose when to store, how to scope memories per user/session, and how much retrieved memory to actually inject into a given prompt.

**"Why does this course teach you to build the agent loop by hand before touching a framework?"**
Because the loop itself is simple — a `while` loop and a branch on the model's output — and understanding it directly means every framework's abstractions (LangChain's `Tool`/`AgentExecutor`, LangGraph's nodes/edges) become recognizable as convenience layers over concepts you already understand, rather than opaque magic you can't debug when something goes wrong. Framework APIs also change quickly; the underlying concepts are what actually transfer.
