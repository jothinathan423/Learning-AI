---
title: "FAQs & Memory Tricks"
week: 2
---

# FAQs & Memory Tricks

## Frequently Asked Questions

**Q1. Why can't I just tell the model "always respond in JSON" and trust it?**
Because a plain instruction is only a request the model tries to honor — nothing prevents it from adding a stray sentence, using the wrong field name, or producing invalid JSON syntax. Use schema-constrained structured outputs where available (Topic 6), and always validate the parsed result (Topic 9) regardless.

**Q2. What's the actual difference between chain-of-thought and task decomposition?**
CoT decomposes *reasoning within a single response* — the model shows its steps in one generated answer. Task decomposition decomposes the *overall workflow into multiple separate calls/prompts*, each with its own real, inspectable input and output. CoT is reasoning-level; task decomposition is pipeline-level.

**Q3. Does the model actually run the code when it makes a tool call?**
No — never. The model only ever emits a structured request naming a tool and its arguments. Your application code is solely responsible for actually executing anything. This is the single most important fact to remember about tool calling (Topic 10).

**Q4. If a JSON response is schema-valid, is the data guaranteed correct?**
No. Schema validation only guarantees shape and type — a syntactically perfect JSON object can still contain a hallucinated value. Business-logic and grounding validation (Topic 9) are separate checks layered on top.

**Q5. When should I use few-shot instead of zero-shot?**
Always try zero-shot first. Move to few-shot only when zero-shot output is inconsistent in format, style, or misses a domain-specific convention the model wouldn't otherwise know.

**Q6. Is self-consistency worth the extra cost?**
Only for high-stakes, discrete-answer questions (a hard calculation, a critical yes/no decision) where the accuracy gain clearly justifies paying for N sampled runs instead of one. It's rarely applied by default across a whole high-throughput pipeline.

**Q7. Can prompt injection ever be fully prevented?**
No — there is currently no complete technical fix, because models process trusted instructions and untrusted content in the same shared context. Defenses are layered and probabilistic (delimiting, least privilege, action-level guardrails, confirmation, monitoring), not a single guaranteed fix.

**Q8. What's the difference between a guardrail and validation-and-retry?**
Validation-and-retry mainly targets shape and business-logic correctness of structured output. Guardrails are broader — they cover safety, policy compliance, scope boundaries, and authorization of real actions (tool calls), enforced deterministically in code around the whole system, not just one response.

**Q9. Why does Instructor matter if I already have Pydantic and JSON Schema?**
Instructor packages the repetitive plumbing — building a schema from your Pydantic model, sending the request via the provider's structured-output/tool-calling mechanism, parsing the response, validating it, and automatically retrying with the specific error on failure — into one reusable interface, instead of every project reimplementing that loop by hand.

**Q10. Are parallel tool calls always faster and safe?**
Faster, only when the calls are genuinely independent. Not safe by default — if a hidden dependency exists between two calls that get parallelized anyway, the result can be silently wrong rather than obviously broken, which is a harder failure to catch.

**Q11. What's the single biggest reason system prompts aren't a complete security boundary?**
System-level priority is a *learned, soft* behavior from training (instruction-tuning/RLHF), not a hard architectural partition — there's no wall in the model's architecture that untrusted text is physically incapable of crossing.

**Q12. Do I need CoT for every task?**
No — reserve it for genuinely multi-step reasoning tasks (math, logic, planning). For simple lookups or classifications, CoT adds cost and latency with no accuracy benefit.

## Memory Tricks / Mnemonics

- **"The model asks, your code does."** — the one-line summary of tool calling: the model never executes anything itself.
- **PIVR — Prompt, Instructions, Validate, Retry** — the structured-output safety loop: assemble a good Prompt with clear Instructions, then always Validate the response and Retry with specific feedback before falling back.
- **"Shape ≠ Truth."** — schema validation guarantees shape and type, never factual correctness. Repeat this whenever tempted to skip business-logic validation.
- **Zero → Few → Chain → Consistency** — the natural escalation ladder of prompting techniques, in increasing cost order: start zero-shot, add few-shot examples if format/style is inconsistent, add chain-of-thought if multi-step reasoning is needed, add self-consistency only for high-stakes discrete answers.
- **"Independent = Parallel."** — only parallelize tool calls when subtasks have no dependency on each other's results; if B needs A's output, keep it sequential.
- **Direct vs Indirect injection = "Who typed it?"** — direct means the user typed the attack; indirect means the attack was planted in something the model reads later (a document, a webpage, a tool result).
- **"Defense in depth, not a single lock."** — for both guardrails and prompt-injection defense, assume any one layer can fail; layer several independent checks so no single bypass causes real harm.
- **"Describe the tool like you'd brief a new hire."** — a tool's name and description directly determine whether the model calls it correctly; vague names produce vague behavior, exactly like vague prompts.

## Quick Revision Bullet List

- A prompt has functional parts (role, instructions, context, data, format, constraints); system prompts are stable, user prompts vary per call.
- Zero-shot first, few-shot for format/style consistency, CoT for multi-step reasoning, self-consistency for high-stakes discrete answers.
- Task decomposition splits big jobs into small, inspectable, individually testable subtasks — sequential or parallel.
- JSON Schema + Pydantic define the data contract; schema-constrained decoding guarantees shape, never content truth.
- Instructor automates the parse-validate-retry loop around Pydantic models, across multiple LLM providers.
- Validation happens in layers: syntax, schema, business logic, grounding — retry with specific, targeted feedback, bounded attempts, explicit fallback.
- Tool calling: model requests, application executes — always validate arguments and enforce permissions before running anything.
- Parallel tool calls cut latency for genuinely independent subtasks; dependency misjudgment risks silently wrong results.
- Guardrails enforce hard, code-level limits (input, output, action) around a model whose behavior is otherwise probabilistic.
- Prompt injection has no complete fix — mitigate via delimiting, least privilege, action-level confirmation, and ongoing monitoring.
