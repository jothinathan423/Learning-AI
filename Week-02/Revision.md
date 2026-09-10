---
title: "Week 2 Revision"
week: 2
---

# Week 2 Revision: Prompting, Structured Output & Tool Calling

## 5-Minute Revision

- A **prompt** has functional parts — role, instructions, context, input data, output format, constraints. Split a stable **system prompt** from a per-request **user prompt**.
- **Zero-shot** = instruction only. **Few-shot** = instruction + worked examples (in-context learning, no weights updated). Always try zero-shot first.
- **Chain-of-thought (CoT)** makes the model show step-by-step reasoning before its final answer — helps multi-step tasks, costs extra tokens.
- **Self-consistency** samples several independent CoT runs and takes the majority-vote answer — for high-stakes, discrete-answer questions only.
- **Task decomposition** splits a big job into smaller sequential or parallel subtasks, each independently validated.
- **Structured output** forces the model's answer into JSON matching a **JSON Schema** — schema-constrained decoding guarantees shape, never factual correctness.
- **Pydantic** models are typed Python classes that generate schemas and validate/parse data at runtime.
- **Instructor** requests LLM output directly as a Pydantic model, with automatic retry on validation failure.
- **Validation-and-retry**: check syntax, schema, and business logic; retry with specific feedback; bounded attempts; explicit fallback.
- **Tool/function calling**: the model only ever requests a function call — your application always executes it and controls what's allowed.
- **Parallel tool calls** cut latency for genuinely independent subtasks; dependency mistakes cause silently wrong results.
- **Guardrails** are deterministic, code-level checks (input, output, action) — a system prompt alone is not a hard boundary.
- **Prompt injection** (direct: user-typed; indirect: hidden in content the model reads) has no complete fix — defense is layered.

## 15-Minute Revision

**Prompting fundamentals (Topics 1–5).** A prompt is not one blob of text — it's role, instructions, context, input data, output format, and constraints, each best kept as a distinct, named section, with clear delimiters around variable/untrusted data. System prompts (stable, reusable, more heavily weighted by the model due to instruction-tuning) are split from user prompts (per-call, variable). Zero-shot leans on the model's general training; few-shot demonstrates a specific format/style/edge-case convention through worked examples via in-context learning, with diminishing returns after a handful of well-chosen, diverse, correct examples. Chain-of-thought exploits the autoregressive nature of generation — each new token conditions on all previous tokens, including the model's own prior reasoning steps — so making reasoning explicit turns one hard leap into several easier, anchored sub-predictions; it costs proportionally more tokens and should be reserved for genuinely multi-step tasks. Self-consistency extends CoT by sampling N independent reasoning paths and majority-voting the final answer, which corrects random per-sample errors but not a systematic misunderstanding the model repeats across all samples; cost scales linearly with N. Task decomposition generalizes this idea to the whole pipeline level: split a large, multi-skill request into smaller subtasks with real, inspectable intermediate outputs, sequential where dependent and parallel (fan-out/fan-in) where independent — this improves reliability, debuggability, and can be a hard requirement when a task wouldn't otherwise fit the context window.

**Structured output and reliability (Topics 6–9).** JSON Schema formally specifies the fields, types, required/optional status, and constraints a response must satisfy; schema-constrained ("guided") decoding restricts the token-generation process itself to guarantee shape, which is strictly better than merely asking for JSON in the prompt and hoping. Either way, shape validity never guarantees factual correctness — a syntactically perfect object can still contain a hallucinated value. Pydantic turns this into a single Python class: one definition both generates the schema sent to the model and validates/parses the model's response into a typed object, raising detailed, field-level errors on failure. Instructor packages the repetitive request-parse-validate-retry plumbing around Pydantic models into one reusable interface across LLM providers, automatically feeding a validation error back to the model for a targeted correction attempt, bounded by a small `max_retries`. Validation-and-retry as a general pattern operates at multiple layers — syntax, schema/type, business logic, and grounding/factual checks — and always needs an explicit, bounded retry policy with specific corrective feedback plus a defined fallback (error, default, human escalation) for when retries are exhausted; persistent failure across retries usually signals a design problem, not something more attempts will fix.

**Tool calling and safety (Topics 10–13).** Tool/function calling is a strict separation of responsibilities: the model only ever emits a structured request naming a tool and arguments (itself just another structured-output contract); your application is solely responsible for validating and actually executing anything, closing the gap between the model's frozen training data and the need for live information or real actions. Parallel tool calls let the model request several such calls in one turn when they're genuinely independent, cutting latency from the sum of sequential round trips down to roughly the slowest single call — but this is only valid when there's no hidden ordering dependency, and applications must handle partial failures and respect rate limits explicitly. Guardrails add deterministic, code-level enforcement around the whole system — input screening, output filtering, and non-overridable action-level limits (spending caps, mandatory human confirmation for high-stakes actions) — because prompt instructions alone only shape probability, not guarantee compliance. Prompt injection is the adversarial edge case this all defends against: crafted text, delivered directly by a user or indirectly hidden in content the model later reads (a document, webpage, or tool result), can hijack the model's behavior because there is no hard architectural wall between trusted instructions and untrusted content in a shared context window — there is no complete fix, only layered mitigation (delimiting, least-privilege tool access, mandatory confirmation, and ongoing detection/monitoring), and the risk escalates sharply once tool calling gives a hijacked model the ability to trigger real actions rather than just say something wrong.

## Last-Minute Interview Revision

**"What's the difference between zero-shot, few-shot, and chain-of-thought?"**
Zero-shot gives an instruction only; few-shot adds worked examples so the model pattern-matches a specific format/style via in-context learning (no weight updates, nothing persists between calls); chain-of-thought asks the model to generate explicit intermediate reasoning steps before answering, which helps because each token conditions on everything generated before it, including the model's own prior reasoning. They can be combined (few-shot CoT) and escalate in cost roughly in that order.

**"Does the model execute the tool it calls?"**
No — this is the single most commonly misunderstood point. The model only emits a structured request (tool name + arguments). The calling application is always responsible for validating and executing anything real. This separation is exactly what makes tool calling safe to reason about and secure.

**"If an LLM's JSON output passes schema validation, is it correct?"**
No. Schema validation guarantees shape and type, never factual accuracy or business-rule correctness — a hallucinated value can be perfectly well-typed. This is why validation-and-retry includes separate business-logic and grounding checks beyond schema checks.

**"How would you make an LLM feature reliable enough for production?"**
Layer defenses: a well-anatomized prompt with clear output-format instructions; schema-constrained structured output where available; a Pydantic (or equivalent) model validating shape, types, and business rules; a bounded retry loop with specific corrective feedback and an explicit fallback; and, if tool calls are involved, action-level guardrails (argument validation, least privilege, human confirmation for high-stakes actions) enforced in code the model cannot override.

**"What is prompt injection and why is there no complete fix?"**
It's an attack where crafted text — typed directly by a user, or hidden in content the model reads later, like a document or webpage — manipulates the model into ignoring its real instructions. There's no complete fix because models process trusted instructions and untrusted content in the same shared token sequence, with only a soft, learned prioritization rather than a hard architectural partition; mitigation is layered (delimiting, least privilege, mandatory confirmation for high-stakes actions, detection/monitoring), not a single guaranteed solution.

**"When would you use self-consistency instead of a single chain-of-thought call?"**
Only for high-stakes questions with a discrete, comparable final answer (a critical calculation, a compliance yes/no) where the accuracy gain from majority-voting N independent sampled reasoning paths clearly justifies the linear increase in cost and latency — not as a default applied to every request.

**"Why split a system prompt from a user prompt?"**
Reusability (the system prompt is written once and reused across many calls), precedence (models weight system-level instructions more heavily due to instruction-tuning), and caching (a static system prompt can often be cached by the API to reduce repeated cost).

**"What's the practical risk that tool calling introduces which plain text generation doesn't have?"**
A plain text-generation system that misbehaves says something wrong — contained. A tool-using system that misbehaves (especially under prompt injection) can trigger a real action with real side effects (sending data, issuing a refund, deleting a record) — which is why action-level guardrails and least-privilege tool scoping are essential wherever tool calling is used, not optional hardening.
