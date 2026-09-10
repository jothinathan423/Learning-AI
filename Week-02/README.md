---
title: "Week 2: Prompting, Structured Output & Tool Calling"
week: 2
---

# Week 2: Prompting, Structured Output & Tool Calling

Week 2 is where you write your first real lines of AI-application code. Week 1 taught you what a language model *is* — a next-token predictor with a context window and a temperature knob. This week teaches you how to actually *talk to it like an engineer*: how to phrase instructions so the model behaves consistently, how to force its free-text answers into a fixed shape your program can parse (JSON, validated against a schema), and how to let the model ask your code to do something real — look up an order, run a calculation, check a database — through **tool calling** (also called function calling). By the end of the week you'll understand the full loop that almost every production LLM application is built on: prompt in, structured data out, tools bridging the model to the real world, and guardrails keeping the whole thing safe.

- **Estimated reading time:** 3.5–4.5 hours for all 13 topics, plus Notes/CheatSheet/Revision
- **Difficulty level:** Beginner-to-Intermediate
- **Prerequisites:** Week 1 — Language Models, Tokens & Tokenization, Context Window, Temperature & Sampling, Hallucination

## What You'll Master After This Week

- How to structure a prompt (role, instructions, context, examples, output format) so the model behaves the same way every time.
- The difference between zero-shot, few-shot, and chain-of-thought prompting, and when each one earns its extra token cost.
- How self-consistency and task decomposition make multi-step reasoning more reliable.
- How to force a model's output into strict JSON using JSON Schema, Pydantic models, and the Instructor library.
- How to detect malformed output and automatically retry or repair it instead of crashing your application.
- How tool/function calling works end-to-end: the model doesn't run code — it asks *your* code to run something and hands back the result.
- When and how to call multiple tools in parallel instead of one at a time.
- How guardrails and prompt-injection defenses keep an LLM-powered system safe, on-topic, and hard to hijack.

## Topics Covered

1. [Prompt Anatomy](./Topics/01-Prompt-Anatomy.md)
2. [Zero-Shot vs Few-Shot](./Topics/02-Zero-Shot-Vs-Few-Shot.md)
3. [Chain-of-Thought](./Topics/03-Chain-Of-Thought.md)
4. [Self-Consistency](./Topics/04-Self-Consistency.md)
5. [Task Decomposition](./Topics/05-Task-Decomposition.md)
6. [Structured Output & JSON Schema](./Topics/06-Structured-Output-JSON-Schema.md)
7. [Pydantic](./Topics/07-Pydantic.md)
8. [Instructor Library](./Topics/08-Instructor-Library.md)
9. [Validation and Retry](./Topics/09-Validation-And-Retry.md)
10. [Tool / Function Calling](./Topics/10-Tool-Function-Calling.md)
11. [Parallel Tool Calls](./Topics/11-Parallel-Tool-Calls.md)
12. [Guardrails](./Topics/12-Guardrails.md)
13. [Prompt Injection](./Topics/13-Prompt-Injection.md)

## Reading Progress Checklist

- [ ] 01 — Prompt Anatomy
- [ ] 02 — Zero-Shot vs Few-Shot
- [ ] 03 — Chain-of-Thought
- [ ] 04 — Self-Consistency
- [ ] 05 — Task Decomposition
- [ ] 06 — Structured Output & JSON Schema
- [ ] 07 — Pydantic
- [ ] 08 — Instructor Library
- [ ] 09 — Validation and Retry
- [ ] 10 — Tool / Function Calling
- [ ] 11 — Parallel Tool Calls
- [ ] 12 — Guardrails
- [ ] 13 — Prompt Injection
- [ ] Review Cheat Sheet
- [ ] Complete Revision
