---
title: "Week 7 Notes: Key Definitions and Tables"
week: 7
---

# Key Definitions and Tables

Condensed reference definitions and comparison tables for all 10 Week 7 topics.

## 1. Core Definitions

| Term | Definition |
|---|---|
| **Agent** | A system where an LLM decides, at run time, the number and order of steps needed to reach a goal — as opposed to a fixed pipeline where you decide the steps in advance. |
| **Agent loop** | The repeating think → act → observe cycle that drives an agent: reason about the next step, take it (usually a tool call), read the real result, repeat until done. |
| **ReAct** | A prompting pattern that makes the loop concrete: Thought (reasoning) → Action (tool call) → Observation (real result), repeated, ending in a Final Answer. |
| **Tool** | A named, described, schema-defined function the model can choose to call; the model only ever sees the tool's name, description, and argument schema — never your code. |
| **Tool design** | Writing tool names, descriptions, schemas, and error messages clearly enough that a model with no codebase access reliably picks the right tool and arguments. |
| **Stop condition / budget** | A code-enforced limit (step count, cost, time, repetition) that guarantees an agent loop terminates gracefully, regardless of what the model itself proposes. |
| **Workflow (fixed pipeline)** | A predetermined sequence of steps, decided by the engineer at design time; may include LLM calls at individual steps, but the *order* of steps is fixed. |
| **Agent vs. workflow race** | Running a fixed workflow and a properly budgeted agent loop against the same input set, graded by the same criteria, to measure which actually performs better — segmented by input difficulty. |
| **Short-term (working) memory** | The current task's transcript, managed within a single agent run via truncation or summarization to stay within context limits. |
| **Long-term (persistent) memory** | Durable facts or summaries stored outside any single run, retrieved selectively (usually by embedding similarity) into future tasks. |
| **Rolling summarisation** | Compressing older transcript turns into a running summary while keeping recent turns verbatim, to keep working memory lean without discarding everything. |
| **Vector memory** | Storing memories as embeddings in a vector store, retrieved by semantic similarity — the RAG pipeline applied to an agent's own experience. |
| **Mem0** | A managed memory layer that automates fact extraction, conflict resolution, storage, and relevance-based retrieval behind a simple `add`/`search` API. |
| **LangChain** | A general-purpose library offering LLM/tool integrations, prompt utilities, and a higher-level, more implicit `AgentExecutor`. |
| **LangGraph** | A graph-based agent framework where control flow (nodes, edges, conditional branches, loop-backs) is defined explicitly, rather than hidden inside a generic executor. |

## 2. Agent Loop vs. Fixed Pipeline

| Property | Fixed Pipeline (Workflow) | Agent Loop |
|---|---|---|
| Who decides step order | You, at design time | The model, at run time |
| Speed | Fast — known number of calls | Variable — can be slow if many steps needed |
| Cost | Predictable, bounded | Variable, can spike; needs budgets |
| Reliability/testability | High — steps are individually testable | Lower — behavior emerges from model + transcript + tools |
| Handles novel/unanticipated input | Only via pre-built branches | Can adapt, within budget limits |
| Best for | Known, enumerable steps (even with conditionals) | Steps that genuinely can't be known until a prior result is seen |

## 3. ReAct Cycle Reference

| Element | Role |
|---|---|
| **Thought** | Model's stated reasoning about what to do next, given the goal and everything observed so far. |
| **Action** | A structured or structured-looking tool call: tool name + arguments. |
| **Observation** | The tool's real return value (or error), appended to the transcript before the next Thought. |
| **Final Answer** | Emitted instead of another Action once the model judges the task complete. |

## 4. Stop Condition / Budget Types

| Budget type | Protects against | Typical mechanism |
|---|---|---|
| Step count | Infinite/very long loops | Hard cap on iterations (e.g., 8–15) |
| Token/cost | Runaway spend | Running cost sum vs. a ceiling |
| Wall-clock time | Slow overall tasks | Timer from task start |
| Per-step timeout | One hanging tool call | Timeout on individual tool execution |
| Repetition detection | Stuck/cyclical loops | Compare current action to recent history |
| Confidence/success check | False "done" signals | Explicit validation before returning final answer |

## 5. Memory Tier Comparison

| | Short-Term (Working) Memory | Long-Term (Persistent) Memory |
|---|---|---|
| Scope | Single agent run | Across runs/sessions |
| Storage location | Model's context window | External store (vector DB, key-value store) |
| Main technique | Truncation, rolling summarization | Extraction + embedding + similarity retrieval |
| Failure if missing | Context overflow, rising cost, "lost in the middle" | Repeats already-answered questions, forgets stated preferences |
| Analogy | A notepad for the task at hand | A curated wiki of durable lessons and facts |

## 6. Framework Comparison

| | LangChain `AgentExecutor` | LangGraph |
|---|---|---|
| Control flow | Implicit, packaged loop | Explicit graph: nodes + edges, including conditionals and loop-backs |
| Best fit | Simple, single-loop agents; fast prototyping | Custom control flow, multi-step/branching, human-in-the-loop pauses |
| Debuggability | Loop internals partly hidden | Structure visible in the graph definition |
| Fit with hybrid architecture (Topic 5) | Naturally "mostly agent" | Naturally "mostly workflow + agent embedded at one node" |
