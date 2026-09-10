---
title: "Week 7 Notes: Diagrams and Workflows"
week: 7
---

# Diagrams and Workflows

A small collection of the week's core mechanisms, visualized. Each topic file has a more detailed, topic-specific diagram — these are the condensed, cross-topic reference versions.

## 1. The Agent Loop (Think → Act → Observe → Repeat)

```mermaid
flowchart TD
    A[Goal] --> B[Think: LLM decides next step]
    B --> C{Final answer or tool call?}
    C -- Final answer --> D[Return answer]
    C -- Tool call --> E[Act: execute tool]
    E --> F[Observe: capture real result]
    F --> G{Stop condition hit?}
    G -- Yes --> H[Force-stop: return partial result]
    G -- No --> B
```

*Caption: The core loop behind every agent. Nothing here requires a framework — it's a `while` loop with a branch on the model's output type, guarded by hard stop conditions.*

## 2. ReAct Cycle

```mermaid
sequenceDiagram
    participant M as Model
    participant T as Tool
    M->>M: Thought - reason about next step
    M->>T: Action - tool_name(args)
    T->>M: Observation - real result
    Note over M: Reasons again with new info
    M->>M: Thought - decide: continue or finish?
```

*Caption: ReAct interleaves reasoning with real observations at every step, rather than planning once up front or acting without stated reasoning — this is what lets an agent adapt mid-task.*

## 3. Workflow vs. Agent Decision Flowchart

```mermaid
flowchart TD
    A[New task] --> B{Can every needed step be<br/>enumerated in advance,<br/>for all expected inputs?}
    B -- Yes --> C[Build a fixed workflow]
    B -- No --> D{Is the whole task unpredictable,<br/>or just one sub-step?}
    D -- Just one sub-step --> E[Fixed workflow, with a narrowly<br/>scoped agent loop at that step]
    D -- Whole task --> F[Full agent loop,<br/>with stop conditions and budgets]
```

*Caption: Default to a workflow. Reach for an agent only when a task, or a specific sub-step of it, genuinely can't have its steps known in advance.*

## 4. Agent Memory Tiers

```mermaid
flowchart LR
    subgraph Short["Short-Term (this task)"]
        A[Growing transcript] --> B{Over size threshold?}
        B -- Yes --> C[Truncate or summarize<br/>older turns]
        B -- No --> A
        C --> A
    end
    subgraph Long["Long-Term (across tasks)"]
        D[(Vector store:<br/>facts + metadata)]
    end
    A -- "checkpoint: extract<br/>durable facts" --> D
    D -- "new task: retrieve<br/>relevant subset" --> E[New task's context]
```

*Caption: Short-term memory keeps one task's transcript manageable via compression; long-term memory persists durable facts externally, retrieved selectively — the same embed-store-retrieve mechanism as RAG, applied to an agent's own experience.*

## 5. Agent vs. Workflow Race Methodology

```mermaid
flowchart TD
    A[Shared input set:<br/>typical + edge cases] --> B[Fixed Workflow]
    A --> C[Budgeted Agent Loop]
    B --> D[Same success criteria<br/>applied to both]
    C --> D
    D --> E[Segment results<br/>by input difficulty]
    E --> F[Hybrid decision:<br/>workflow for common cases,<br/>agent/escalation for the hard tail]
```

*Caption: A fair comparison uses the same inputs, same grading criteria, and a properly budgeted agent — its most useful output is a segmented, hybrid architecture decision, not a single "winner."*
