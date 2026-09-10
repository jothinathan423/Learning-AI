---
title: "Prompt Template vs System Prompt"
---

# Prompt Template vs System Prompt

These two concepts often get blurred together, but they serve different roles in how an LLM
call is constructed: a system prompt sets persistent, session-level behavior, while a prompt
template is a reusable pattern for building the per-request (usually user-turn) message with
variable content filled in.

## Comparison

| Dimension | Prompt Template | System Prompt |
|---|---|---|
| **Purpose** | Reusable structure for building one specific message, with placeholders filled at call time | Establishes the model's persistent role, tone, rules, and constraints for the whole conversation/session |
| **Scope of effect** | Typically affects a single call/turn | Typically affects every turn in the conversation/session |
| **Contains variable data?** | Yes — designed around placeholders (`{question}`, `{context}`, `{user_name}`) filled in per request | Usually static text, though it can also be parameterized (e.g. injecting a persona or policy set) |
| **Where it lives in the message** | Often becomes part of the user turn (or a templated developer-turn) | Sits in the dedicated system role/slot most chat-based APIs provide |
| **Typical content** | Task instructions + injected data, e.g. "Answer the question using this context: {context}\nQuestion: {question}" | Persona, tone, safety/behavior rules, output-format constraints, e.g. "You are a helpful legal-research assistant. Never give legal advice, only summarize case law." |
| **Changes per use case** | Yes — different templates for summarization, Q&A, extraction, etc. | Less often — usually set once per application/agent and reused across many templates |
| **Analogy** | A form letter with blanks to fill in | A standing set of instructions given to an employee before their shift starts |
| **Who typically authors it** | Prompt engineer / developer building a specific feature | Application owner defining the assistant's overall behavior and guardrails |

## When to Choose Which

Use a **prompt template** whenever a task is repeated with different inputs each time — RAG
question-answering (question + retrieved context varies every call), summarization (document
varies), structured extraction (source text varies). Templates keep prompt engineering
consistent and testable across many runs.

Use a **system prompt** to set behavior that should hold across an entire session or
application regardless of which template gets used underneath — persona, tone, safety
constraints, output-format defaults, refusal policies. It's the right place for "always" and
"never" rules rather than per-request content.

In most real applications, both are used together: a system prompt fixes the assistant's
overall behavior and guardrails, while a prompt template shapes each individual request within
that behavior — they operate at different layers, not as alternatives to each other.
