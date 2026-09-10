---
title: "Week 8: Agent Failure Modes & Trajectory Evals"
week: 8
difficulty: Advanced
readingTime: "140 min (full week)"
---

# Week 8: Agent Failure Modes & Trajectory Evals

## Learning Summary

Autonomous agents fail in ways that single-turn LLMs never do. While a standard prompt either answers correctly or hallucinates on the spot, an agent can get stuck in infinite execution loops, choose tools that look plausible but are semantically wrong, pass hallucinated parameters into real APIs, or reach a seemingly "correct" final answer entirely by luck through a broken, expensive, or dangerous sequence of intermediate steps. Even worse, autonomous agents that ingest external documents, databases, or web pages are vulnerable to **prompt injection** — where malicious instructions embedded in untrusted data hijack the agent's control flow, using its legitimate tool privileges against your own systems.

This week is dedicated to the rigor of **agent observability, trajectory evaluation, and defensive engineering**:
- How to evaluate the entire execution path (**trajectory**) — thoughts, tool calls, and observations — rather than just scoring the final output.
- How to detect and close the critical **outcome vs. trajectory gap** where lucky guesses mask brittle, production-breaking workflows.
- How to measure **tool-choice accuracy**, establish **expected tool sequence constraints**, and benchmark recursive agent costs across both mean and **p99 tail latency/expense**.
- How direct and **indirect prompt injections** operate, and how to defend against them using **tool sandboxing**, **least privilege scoping**, strict **output validation**, and alignment with the **OWASP Top 10 for LLMs**.

- **Estimated reading time:** ~140 minutes for all 11 topics, plus notes, cheat sheet, and revision.
- **Difficulty level:** Advanced.
- **Prerequisites:** Week 2 (Prompting & Tool Calling), Week 6 (Evals & LLM-as-Judge), and Week 7 (Agent Loops & ReAct Architecture).

---

## What You'll Master After This Week

- **Agent Failure Taxonomy:** Diagnose the 5 classic agent failure modes: infinite cycling, tool-choice thrashing, argument hallucination, premature termination, and cascade poisoning.
- **Trajectory Evaluation:** Build trace-level evaluators that inspect the full tuple of `(Thought, Tool, Args, Observation)` instead of grading only the final response string.
- **The Outcome-Trajectory Gap:** Identify, quantify, and eliminate "lucky passes" where an agent produces an accurate end result via an invalid, high-cost, or unsafe execution path.
- **Expected Tool Sequences & Grammar:** Define deterministic transition graphs, prerequisite states, and forbidden tool sequences to guard multi-step reasoning.
- **Tool-Choice Metrics:** Calculate tool selection Precision, Recall, and False Dispatch Rate across multi-turn agent runs.
- **Cost & Latency Profiling:** Measure mean and extreme tail (p99) cost and latency distributions caused by loop depth and recovery thrashing.
- **Direct Prompt Injection:** Understand how attackers attempt jailbreaks, delimiter hijacking, and system prompt exfiltration through direct conversation.
- **Indirect Prompt Injection:** Defend agents against poisoned external content (web pages, customer tickets, emails, PDF attachments) containing covert instructions.
- **Least Privilege & Tool Sandboxing:** Architect bounded execution environments, read-only vs. write isolation, fine-grained credential scoping, and human-in-the-loop gates.
- **Defensive Output Validation:** Implement defensive schema verification, invariant checks, and response sanity guards on both agent arguments and tool outputs.
- **OWASP LLM Top 10 for Agents:** Map real-world agent vulnerabilities against LLM01 (Prompt Injection), LLM02 (Sensitive Information Disclosure), LLM06 (Excessive Agency), and LLM08 (Vector & Embedding Weaknesses).

---

## Topics Covered

1. [Agent Failure Modes](./Topics/01-Agent-Failure-Modes.md)
2. [Trajectory Evaluation](./Topics/02-Trajectory-Evaluation.md)
3. [Expected Tool Sequences](./Topics/03-Expected-Tool-Sequences.md)
4. [Tool-Choice Accuracy](./Topics/04-Tool-Choice-Accuracy.md)
5. [Outcome vs. Trajectory Gap](./Topics/05-Outcome-Vs-Trajectory-Gap.md)
6. [Cost per Task (Mean & p99)](./Topics/06-Cost-Per-Task.md)
7. [Direct Prompt Injection](./Topics/07-Direct-Prompt-Injection.md)
8. [Indirect Prompt Injection](./Topics/08-Indirect-Prompt-Injection.md)
9. [Tool Sandboxing & Least Privilege](./Topics/09-Tool-Sandboxing-And-Least-Privilege.md)
10. [Output Validation](./Topics/10-Output-Validation.md)
11. [OWASP LLM Top 10](./Topics/11-OWASP-LLM-Top-10.md)

---

## Reading Progress Checklist

- [ ] 01 — Agent Failure Modes
- [ ] 02 — Trajectory Evaluation
- [ ] 03 — Expected Tool Sequences
- [ ] 04 — Tool-Choice Accuracy
- [ ] 05 — Outcome vs. Trajectory Gap
- [ ] 06 — Cost per Task (Mean & p99)
- [ ] 07 — Direct Prompt Injection
- [ ] 08 — Indirect Prompt Injection
- [ ] 09 — Tool Sandboxing & Least Privilege
- [ ] 10 — Output Validation
- [ ] 11 — OWASP LLM Top 10
- [ ] Review Week 8 Notes
- [ ] Study Master Cheat Sheet
- [ ] Complete Revision & Interview Prep
