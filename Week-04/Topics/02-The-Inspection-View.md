---
title: "The Inspection View"
week: 4
order: 2
difficulty: Beginner
readingTime: "9 min"
---

# The Inspection View

## 1. Introduction

The inspection view is the single most valuable piece of tooling you will build this week, and
it is deliberately simple: a screen (or even a plain script that prints to a terminal) that
shows, for any question, three things side by side — the question itself, the chunks the
retriever actually fetched (with their similarity scores and source), and the final answer the
model generated. Without it, "the app is wrong sometimes" stays a vague complaint forever.
With it, that complaint becomes a specific, inspectable, fixable data point.

## 2. Why This Topic Exists

Most RAG demos are built as a chat interface: type a question, get an answer. That interface is
great for users and terrible for debugging, because it hides the one piece of information you
need most — what did the retriever actually find? A chat UI shows you the output of a two-stage
pipeline while hiding the intermediate state. This topic exists because you cannot fix what you
cannot see, and the intermediate state (retrieved chunks) is exactly what separates a retrieval
failure from a generation failure (Topic 1). Building the inspection view is what turns Topic
1's classification exercise from a thought experiment into something you can actually do,
repeatedly, on real questions.

## 3. Core Concept

### Beginner

An inspection view is a debugging screen with three columns or sections:

1. **Question** — exactly what the user asked (or what you typed in for testing).
2. **Retrieved chunks** — the actual text chunks the retriever returned, in ranked order, each
   with its similarity/relevance score and which source document it came from.
3. **Answer** — what the language model generated from those chunks.

You read top to bottom, left to right: does the question make sense, do the chunks actually
contain the answer, does the answer actually reflect the chunks?

### Intermediate

A useful inspection view adds a few details beyond the bare minimum:

- **Rank and score per chunk** — so you can see not just *what* was retrieved but *how
  confidently* (a top result with a low similarity score is a different signal than a top
  result with a high one).
- **Chunk boundaries** — showing where a chunk starts and ends helps you catch bad chunking
  (e.g., a table split mid-row, a sentence cut in half).
- **Highlighting** — visually marking, within each chunk, any text that overlaps with the final
  answer, so you can spot at a glance whether the answer is actually grounded in the chunk or
  invented.
- **A pass/fail or note field** — a place to record your own judgment (retrieval failure /
  generation failure / correct) so repeated inspection turns into a dataset, not just a one-off
  glance.

### Advanced

At scale, an inspection view becomes a lightweight evaluation harness: instead of inspecting one
question at a time, you run a batch of test questions through the pipeline, log
question/chunks/answer/scores for every one, and render them all in a single scrollable or
filterable page (or a spreadsheet export). Advanced versions add: side-by-side comparison of two
retrieval configurations (e.g., dense-only vs. hybrid) run on the same question set, so you can
see exactly which questions flipped from wrong to right; a filter for "answer marked wrong"; and
a way to jump straight from a failing row to the raw source document to check whether the
answer-bearing text exists in the index at all (a corpus/indexing problem, distinct from either
retrieval or generation failure).

## 4. Deep Explanation

The inspection view works because it makes an invisible pipeline stage visible without changing
the pipeline itself. It's an observability tool, not an accuracy improvement — building it does
not, by itself, make any answer more correct. Its value is entirely in what it enables you to
decide next: whether to invest in retrieval improvements (hybrid search, reranking, query
rewriting) or generation improvements (prompting, context management, model choice). Because
those two investments are disjoint (Topic 1), skipping the inspection view and guessing is a
real risk of wasted engineering time, not just an aesthetic shortcut.

Technically, an inspection view is usually just three data points you already have living
disconnected in different logs, pulled into one place at the same time: the query sent to your
retriever, the ranked results object your vector store or search engine returned, and the
completion your LLM call produced. Most of the "build effort" is wiring, not new logic — if your
RAG app doesn't already keep these three things together in one log line or one object, that's
the first fix, before anything else this week.

## 5. Step-by-Step Flow

1. Instrument your existing RAG pipeline so that a single call (or a small batch of calls)
   returns/logs: the question, the retriever's full ranked result list (chunk text, score,
   source), and the generated answer.
2. Build the simplest possible rendering of that data — a printed table, a notebook cell, or a
   minimal web page with three columns. Do not over-engineer this; a plain table is enough to
   start.
3. Run a handful of known-good and known-bad questions through it.
4. For each row, manually check: does any retrieved chunk contain the answer-bearing text? Does
   the generated answer match what the chunks say?
5. Record a label (retrieval failure / generation failure / correct) next to each row.
6. Expand to a batch of 20-50 representative questions (ideally pulled from real usage) so your
   labels form a small but meaningful sample, not just a couple of anecdotes.
7. Re-use the same view after every change this week (hybrid search, reranking, query rewriting)
   to see the labels shift.

## 6. Architecture Explanation

```mermaid
flowchart LR
    subgraph Pipeline["Existing RAG pipeline (unchanged)"]
        Q[Question] --> RET[Retriever]
        RET --> CH[Ranked chunks + scores]
        CH --> GEN[Generator / LLM]
        GEN --> ANS[Answer]
    end

    Q --> LOG[Inspection log:\nquestion + chunks + scores + answer]
    CH --> LOG
    ANS --> LOG

    LOG --> VIEW[Inspection View\n(table / notebook / mini web page)]
    VIEW --> HUMAN[Human review:\nretrieval failure? generation failure? correct?]
    HUMAN --> DECIDE{Where's the problem\nconcentrated?}
    DECIDE -- mostly retrieval --> RETRIEVAL_WORK[Invest in hybrid search,\nreranking, query rewriting]
    DECIDE -- mostly generation --> GEN_WORK[Invest in prompting,\ncontext selection, model choice]
```

## 7. Visual Analogy

Think of a factory quality-control window — a pane of glass installed midway down the assembly
line so an inspector can see a half-finished product before it becomes a finished one. The
factory worked fine without the window; the window doesn't change the product. What it changes
is whether defects get caught at the exact station where they occurred, instead of only being
noticed (and misdiagnosed) after the product ships. The inspection view is that window, placed
between retrieval and generation.

## 8. Real Industry Example

Legal-tech and enterprise-search RAG teams almost universally build some version of this before
shipping to real users, often called a "trace viewer" or "retrieval debugger." A common pattern:
every production query is logged with its retrieved chunk IDs and scores, and a small internal
tool lets support/ML engineers paste in a user-reported bad answer and instantly see what was
retrieved for it. Teams that skip this step and rely on reading raw application logs report
spending hours reconstructing what happened for a single bad answer; teams with an inspection
view report doing the same diagnosis in under a minute, because the three pieces of information
they need are already sitting next to each other.

## 9. Common Misconceptions

- **"We need a polished dashboard before this is useful."** A plain printed table or a single
  notebook cell is enough to start gaining value — polish is optional, wiring is not.
- **"The inspection view will tell us the answer is wrong."** It won't — it shows you data; a
  human (you) still has to judge correctness. It's a debugging aid, not an automated grader.
- **"We only need this once, during initial development."** Failure patterns shift as your
  corpus and user base grow; keep the inspection view around as a permanent debugging tool.
- **"Logging the final answer is enough — we don't need the intermediate chunks."** The whole
  point is the intermediate state; without it you're back to guessing between retrieval and
  generation failures.

## 10. Best Practices

- Log retrieved chunks with their rank and score, not just the top-1 result — ordering
  information matters for later reranking work.
- Keep the inspection view simple at first; a working ugly tool beats a beautiful tool you never
  finish.
- Persist inspection labels (retrieval failure / generation failure / correct) so they become a
  reusable regression-style test set for future changes.
- Include the source document identifier per chunk so you can trace a failure back to "is this
  document even in the index."
- Make it fast to go from "user reported a bad answer" to "here's what was retrieved for that
  exact question" — minutes, not hours.

## 11. Summary

The inspection view is a simple, low-effort tool that surfaces the one thing a normal chat
interface hides: what the retriever actually found. By placing question, retrieved chunks, and
answer side by side, it turns "the app is wrong sometimes" into a labeled, inspectable dataset of
retrieval failures and generation failures — the prerequisite for every other technique this
week, since none of them can be evaluated as helping or hurting without it.

## 12. Key Takeaways

- The inspection view shows question, retrieved chunks (with scores), and answer together.
- It doesn't improve accuracy by itself — it's an observability tool that informs where to
  invest fixing effort.
- Start simple: a printed table or notebook cell is enough; polish later.
- Persisting your manual failure labels turns one-off debugging into a reusable test set.
- Reuse the same view after every change this week to confirm a fix actually shifted the failure
  mix, not just your intuition about it.
