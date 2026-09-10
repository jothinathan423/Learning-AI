---
title: "Week 7 Notes: FAQs and Memory Tricks"
week: 7
---

# FAQs and Memory Tricks

## Frequently Asked Questions

**Q1: What actually makes something an "agent" rather than just "an app that uses an LLM and some tools"?**
A: Whether the *sequence* of steps is decided by the model at run time, based on what previous steps revealed, rather than fixed by the engineer in advance. Using an LLM, or even calling a tool once, doesn't make something an agent — the defining feature is the loop that re-decides the next action after every observation.

**Q2: Is a fixed pipeline with an if/else branch still a "workflow," or does branching make it an agent?**
A: Still a workflow. A conditional branch is known in advance — you wrote both branches — even if which one executes depends on the input. It only becomes agent-like when the model itself is choosing the next step at run time, not just selecting between branches you already defined.

**Q3: Why does this course insist on building the agent loop by hand instead of starting with a framework?**
A: Because once you've built the loop yourself, every framework's version of it is instantly recognizable as the same mechanism (a `while` loop, a branch on the model's output, tool execution, logging) with extra convenience layered on top — instead of being a black box you can't debug when it misbehaves.

**Q4: Why do agents cost more than a single LLM call, even for a task that only takes 3 steps?**
A: Every iteration re-sends the entire growing transcript to the model, since the model has no memory between API calls. A 3-step agent task reprocesses the goal plus all prior steps at every iteration, so total tokens spent are much higher than a single well-crafted pipeline call.

**Q5: What's the single most important safety mechanism for any production agent?**
A: A hard step limit, enforced in code, from day one — before cost tracking, before repetition detection, before anything else. The model has no innate awareness of its own non-convergence and will happily propose "one more step" indefinitely if nothing stops it.

**Q6: How is tool design different from just writing good function names?**
A: The model never sees your code — only the tool's name, description, and argument schema. That text is the *entire* interface the model reasons over at every decision point, so ambiguity or overlap between tools causes real, recurring selection errors, not just occasional confusion.

**Q7: What's the difference between short-term and long-term agent memory?**
A: Short-term (working) memory manages the current task's transcript within a single run, using truncation or summarization to stay within context limits. Long-term (persistent) memory stores durable facts outside any single run, retrieved selectively (usually by embedding similarity) into future, separate tasks.

**Q8: Isn't vector memory just RAG with a different name?**
A: Functionally, yes — embed a fact, store it, retrieve the most similar ones later. The difference is the corpus: RAG indexes external documents; vector memory indexes an agent's own accumulated experience (facts, preferences, past outcomes) instead.

**Q9: What does a tool like Mem0 actually save you from building?**
A: The extraction pipeline (deciding what's worth remembering from a raw conversation), conflict resolution (deciding whether a new fact updates, duplicates, or is genuinely new relative to existing memories), and the storage/retrieval plumbing — packaged behind a simple `add`/`search` API instead of hand-built each time.

**Q10: When should I reach for LangGraph instead of a simpler agent executor?**
A: When you need explicit control over branching, cycles, or human-in-the-loop pauses — especially when building the "mostly workflow, agent loop embedded at one node" hybrid architecture, since LangGraph's graph model makes that boundary visible and enforceable in code.

**Q11: How do I actually decide "agent or workflow" for a real task in front of me?**
A: Ask whether every needed step, for every input you expect, can be enumerated in advance. If yes, build a workflow. If only one specific sub-step is genuinely unpredictable, keep the rest a workflow and scope a small agent loop to just that sub-step. Only build a full agent loop when the entire task's steps are genuinely unknowable up front.

**Q12: Why segment results when comparing an agent against a workflow, instead of just reporting one aggregate score?**
A: Because the useful output is almost always "workflow wins on the common, typical cases; agent wins on this specific harder slice" — an aggregate average hides exactly the information (which segment needs which approach) that should drive the actual architecture decision.

## Memory Tricks and Mnemonics

- **T.A.O.** — **T**hink, **A**ct, **O**bserve: the three-beat rhythm of every agent loop iteration (ReAct just adds a spoken "Thought" and a "Final Answer" exit).
- **"Name, Description, Schema"** — the three things a tool needs, and the *only* three things the model ever sees about it. If a stranger couldn't use the tool correctly from just those three, neither can the model.
- **S.C.R.T. budgets** — **S**teps, **C**ost, **R**epetition, **T**ime: the four budget types worth enforcing on any production agent loop.
- **"Workflow = you decide when; Agent = it decides when"** — the one-line test for telling the two apart, regardless of whether an LLM is involved in either.
- **"Recent verbatim, older compressed"** — the rule of thumb for short-term memory: keep the last few turns in full detail, summarize everything older.
- **"Extract, don't transcribe"** — the rule of thumb for long-term memory: store distilled, atomic facts, not raw conversation logs.
- **"Framework = mechanism, not policy"** — whatever agent framework you use, it still won't decide your stop conditions, your tool scope, or your workflow-vs-agent boundary for you — those judgment calls stay yours.

## Bullet-Point Revision List

- An agent = a loop where the model decides the next step at run time; not just "uses an LLM" or "uses a tool."
- ReAct makes the loop concrete: Thought → Action → Observation, repeated, ending in a Final Answer.
- Tool descriptions are the model's entire interface — vague or overlapping tools cause real selection errors regardless of model strength.
- Every agent loop needs hard, code-enforced stop conditions: step count, cost, time, and repetition detection at minimum.
- Default to a fixed workflow; only use an agent when a task's steps genuinely can't be known in advance.
- Most production systems are hybrids: mostly workflow, with a narrowly scoped agent loop where it's truly needed.
- Racing a workflow against a properly budgeted agent on shared inputs turns "I think we need an agent" into a measured decision.
- Short-term memory compresses a long task's transcript (truncation/summarization); long-term memory persists durable facts externally, retrieved by relevance.
- Vector memory is RAG's embed-store-retrieve mechanism, applied to an agent's own experience instead of external documents.
- Managed memory tools (e.g., Mem0) automate extraction/storage/retrieval mechanics, not the policy decisions of when and how to use them.
- LangChain and LangGraph package this week's concepts into reusable components — LangGraph's explicit graph model is better suited to hybrid, controlled architectures.
- Build the loop by hand first — framework APIs churn quickly, but the underlying concepts transfer to whatever comes next.
