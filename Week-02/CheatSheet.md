---
title: "Week 2 Cheat Sheet"
week: 2
---

# Week 2 Cheat Sheet: Prompting, Structured Output & Tool Calling

One-page reference. For full explanations, see the [Topics](./Topics/01-Prompt-Anatomy.md) and [Notes](./Notes/index.md).

## Key Terminology

| Term | One-line meaning |
|---|---|
| System prompt | Stable instructions/role/rules sent on every call |
| User prompt | Per-request instructions + data |
| Zero-shot | Instruction only, no examples |
| Few-shot | Instruction + worked examples (in-context learning) |
| Chain-of-thought (CoT) | Model shows step-by-step reasoning before the final answer |
| Self-consistency | Majority vote across N independent sampled CoT runs |
| Task decomposition | Big task split into small, focused, sequential or parallel subtasks |
| JSON Schema | Formal spec of required JSON shape/types/constraints |
| Constrained decoding | API restricts generation so output structurally matches a schema |
| Pydantic model | Typed Python class = schema generator + runtime validator |
| Instructor | Library: request LLM output as a Pydantic model, auto-retry on validation failure |
| Validation-and-retry | Check output against rules; retry with specific feedback; bounded attempts + fallback |
| Tool/function calling | Model requests a function call; your code executes it and returns the result |
| Parallel tool calls | Multiple independent tool calls requested in one turn, executed concurrently |
| Guardrails | Deterministic, code-level input/output/action checks around the model |
| Prompt injection | Crafted text (direct or indirect) that hijacks the model's intended instructions |

## Prompt Template Pattern

```
SYSTEM:
You are <role>. Always <tone/style rule>. Never <hard constraint>.

USER:
TASK: <one clear imperative sentence>
OUTPUT FORMAT: <exact shape expected>

CONTEXT:
<only what's needed>

INPUT DATA:
"""
<delimited untrusted/variable content>
"""
```

## Few-Shot Pattern

```
<instruction>

Input: <example 1 input> -> Output: <example 1 output>
Input: <example 2 input> -> Output: <example 2 output>
Input: <real query>       -> Output:
```

## Chain-of-Thought Pattern

```
<question>
Let's think step by step. Show your reasoning, then end with:
Final Answer: <value>
```

## JSON Schema Snippet Pattern

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "price": { "type": "number", "minimum": 0 },
    "category": { "type": "string", "enum": ["a", "b", "c"] }
  },
  "required": ["name", "price"]
}
```

## Pydantic Snippet Pattern

```python
from pydantic import BaseModel, Field
from typing import Optional, Literal

class Order(BaseModel):
    order_id: str
    total: float = Field(ge=0)
    tier: Literal["free", "pro", "enterprise"]
    note: Optional[str] = None
```

## Instructor Snippet Pattern

```python
import instructor
client = instructor.from_provider("openai/gpt-4o")
order = client.chat.completions.create(
    response_model=Order,
    messages=[{"role": "user", "content": "..."}],
    max_retries=2,
)
```

## Tool/Function Definition Pattern

```json
{
  "name": "get_order_status",
  "description": "Look up the current shipping status of a customer order by ID.",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "The order ID, e.g. A123." }
    },
    "required": ["order_id"]
  }
}
```

## Tool-Calling Cycle (one line)

`Model requests tool call -> App validates args -> App executes real function -> App returns result -> Model writes final answer`

## Validation-and-Retry Loop (one line)

`Response -> Parse -> Validate (syntax/schema/business logic) -> if invalid: retry with specific error (bounded) -> else fallback`

## Guardrail Checklist

- [ ] Input screened for out-of-scope or disallowed requests before reaching the model
- [ ] System prompt states role, tone, and hard constraints clearly
- [ ] Output screened for policy violations, PII, or data leakage before reaching the user
- [ ] Every tool call's arguments validated in code before execution
- [ ] High-stakes / irreversible tool calls require explicit human confirmation
- [ ] Least-privilege tool access — no agent holds more tool/data access than its task needs
- [ ] Untrusted content (documents, webpages, tool results) clearly delimited from real instructions
- [ ] Every guardrail trigger and validation failure logged for tuning and auditing

## Quick Reminders

- Zero-shot first; escalate to few-shot / CoT / self-consistency only when there's evidence you need it.
- Schema-valid ≠ factually correct — always validate business logic separately.
- The model never executes code — it only requests; your application always executes and controls permissions.
- Parallelize tool calls only when subtasks are genuinely independent.
- No single guardrail or injection defense is complete — always layer multiple, independent checks.
