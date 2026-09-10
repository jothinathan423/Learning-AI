---
title: "Prompt Engineering"
---

# Prompt Engineering — Master Cheat Sheet

Cross-week reference (primarily Week 2) plus general industry prompting practice.

## Core Terminology

| Term | Meaning |
|---|---|
| System prompt | Stable role/tone/rules sent on every call, highest-priority instructions |
| User prompt | Per-request task + data |
| Zero-shot | Instruction only, no worked examples |
| Few-shot | Instruction + 2-5 worked input→output examples (in-context learning) |
| Chain-of-thought (CoT) | Ask the model to reason step by step before the final answer |
| Self-consistency | Sample N independent CoT runs, take the majority answer |
| Task decomposition | Split a big task into small, ordered or parallel subtasks |
| Delimiters | Markers (`"""`, XML tags, `---`) separating instructions from untrusted/variable data |
| Prompt injection | Crafted input text that tries to override the real instructions |
| Structured output | Forcing the response into a validated schema (JSON Schema / Pydantic) |
| Constrained decoding | API-level guarantee that output tokens match a schema |
| Temperature/top-p | Decoding controls — see LLM.md; prompting doesn't fix a bad decoding setting |
| Grounding | Tying the answer to supplied context instead of parametric memory |

## Anatomy of a Good Prompt

```
SYSTEM:
You are <role>. Always <tone/style rule>. Never <hard constraint>.

USER:
TASK: <one clear imperative sentence>
OUTPUT FORMAT: <exact shape expected>

CONTEXT:
<only what's needed — no extra noise>

INPUT DATA:
"""
<delimited untrusted/variable content>
"""
```

Ordering matters: role/rules → task → format → context → data. Put the most stable
instructions first, the most variable content last (closest to generation).

## Prompting Techniques Ladder (escalate only with evidence)

| Level | Technique | Use when |
|---|---|---|
| 1 | Zero-shot, clear instructions | Simple, well-known task |
| 2 | Few-shot examples | Format/style is ambiguous from instructions alone |
| 3 | Chain-of-thought | Multi-step reasoning, math, logic |
| 4 | Self-consistency | CoT is inconsistent across runs; cost tolerates N samples |
| 5 | Task decomposition / multi-call pipeline | Task has genuinely distinct sub-skills |

```
Few-shot:
<instruction>
Input: <ex1 input> -> Output: <ex1 output>
Input: <ex2 input> -> Output: <ex2 output>
Input: <real query> -> Output:

Chain-of-thought:
<question>
Let's think step by step. Show your reasoning, then end with:
Final Answer: <value>
```

## Structured Output Pattern

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "price": { "type": "number", "minimum": 0 },
    "category": { "type": "string", "enum": ["a", "b", "c"] }
  },
  "required": ["name", "price"],
  "additionalProperties": false
}
```

```
Response -> Parse -> Validate (schema + business logic)
  -> if invalid: retry with specific error (bounded attempts)
  -> else: fallback / escalate
```

Schema-valid ≠ factually correct — always validate business logic separately from shape.

## General Best Practices (industry, not week-specific)

- Be explicit: state format, length, tone, and audience — don't make the model guess.
- Positive constraints ("respond in 3 bullets") work better than long lists of "don't"s.
- Put the most important instruction first *and* last for long prompts (primacy + recency).
- Give the model an explicit "out" — "say 'I don't know' if the context doesn't cover this."
- Iterate empirically: change one variable at a time, keep a small eval set of real inputs.
- Version and diff prompts like code — a "small wording tweak" can flip behavior.
- Separate instructions from data with delimiters — never let untrusted content read as commands.
- Shorter, focused prompts beat long ones stuffed with every possible edge case.

## Quick Reminders

- Zero-shot first; escalate to few-shot / CoT / self-consistency only when there's evidence you need it.
- The model never executes code — it only produces text/requests; your app enforces everything else.
- Untrusted content (docs, web pages, tool output) must be clearly delimited from real instructions.
- No single defense stops prompt injection — layer input screening, delimiters, and output checks.
- A prompt that works on 5 hand-picked examples is not validated — test against a real, varied sample.
