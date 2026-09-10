---
title: "Key Definitions & Tables"
week: 2
---

# Key Definitions & Comparison Tables

Condensed reference for every Week 2 topic. Use this for fast lookups and revision, not as a substitute for the full topic pages.

## 1. Core Definitions

| Term | Definition |
|---|---|
| **Prompt anatomy** | Breaking a prompt into named functional parts — role, instructions, context, input data, output format, constraints — instead of one unstructured block of text. |
| **System prompt** | The stable, persistent instruction set (role, tone, rules, format) sent with every call in a conversation or application. |
| **User prompt** | The per-request instruction/data that changes on every call. |
| **Zero-shot prompting** | Asking the model to perform a task from an instruction alone, with no worked examples. |
| **Few-shot prompting** | Providing worked input→output example pairs in the prompt so the model pattern-matches the desired behavior (in-context learning). |
| **Chain-of-thought (CoT)** | Prompting the model to generate visible, step-by-step reasoning before its final answer. |
| **Self-consistency** | Sampling multiple independent CoT reasoning paths and taking the most frequent final answer (majority vote). |
| **Task decomposition** | Splitting a large task into smaller, focused subtasks (sequential or parallel) connected by real, inspectable intermediate data. |
| **JSON Schema** | A formal specification describing the required shape (fields, types, required/optional, constraints) of a JSON object. |
| **Structured output** | Getting a model to respond in a fixed, machine-parseable format (usually JSON) instead of free text. |
| **Constrained/guided decoding** | An API mechanism that restricts token generation so the output structurally must match a given schema. |
| **Pydantic model** | A typed Python class that both generates a JSON Schema and validates/parses data against it at runtime. |
| **Instructor** | A Python library that requests LLM output directly as a validated Pydantic model, with automatic error-driven retries. |
| **Validation-and-retry** | Checking model output against rules (syntax, schema, business logic) and automatically retrying with targeted feedback on failure. |
| **Tool / function calling** | The model requests that the application execute a specific function with specific arguments; the model never executes code itself. |
| **Tool definition** | A schema describing a callable tool's name, description, and typed parameters. |
| **Parallel tool calls** | A model requesting multiple independent tool calls in a single turn, allowing concurrent execution. |
| **Guardrails** | Deterministic, code-level checks and limits (input, output, action-level) that keep an LLM system's behavior within acceptable bounds. |
| **Prompt injection** | An attack where crafted text (direct or indirect) overrides or manipulates a model's intended instructions. |
| **Direct prompt injection** | Malicious override attempt typed straight into the model by a user. |
| **Indirect prompt injection** | Malicious override attempt hidden inside content the model reads later (a document, webpage, tool result). |

## 2. Zero-Shot vs Few-Shot vs Chain-of-Thought

| Aspect | Zero-Shot | Few-Shot | Chain-of-Thought |
|---|---|---|---|
| What's added to the prompt | Instruction only | Instruction + worked examples | Instruction to reason step by step (optionally + worked reasoning examples) |
| Best for | Common, well-understood tasks | Tasks needing a specific format/style/edge-case convention | Multi-step arithmetic, logic, planning tasks |
| Token cost | Lowest | Medium (grows with example count) | Higher (reasoning tokens are generated and billed) |
| Failure mode if misused | Inconsistent format/style on unusual tasks | Wasted tokens if examples don't add real value | Added latency/cost with no benefit on simple tasks |
| Combines with | — | Chain-of-thought (few-shot CoT) | Self-consistency |

## 3. Structured Output Mechanisms

| Mechanism | Guarantee | Validation still needed? |
|---|---|---|
| Prompt-only JSON request | None — model tries to comply, may add extra text or invalid JSON | Yes — full parse + validate |
| Schema-constrained / guided decoding | Structural shape/type guaranteed | Yes — business logic and factual correctness still unchecked |
| Pydantic model validation | Enforces types, required fields, constraints at runtime | Yes — for cross-field/business rules beyond type checks |
| Instructor (`response_model=`) | Combines schema-constrained request + Pydantic validation + automatic retry | Retries are bounded; exhausted-retry case still needs handling |

## 4. Validation Layers

| Layer | Catches | Example |
|---|---|---|
| Syntax | Is it parseable at all? | Malformed JSON |
| Schema/type | Do types and required fields match? | `price` is a string instead of a number |
| Business logic | Do values make sense together? | `end_date` before `start_date` |
| Grounding/factual | Does the value actually appear in/follow from the source? | A cited fact not present in the source document |

## 5. Tool Calling vs Parallel Tool Calling

| Aspect | Single Tool Call | Parallel Tool Calls |
|---|---|---|
| Requests per turn | One | Multiple, in one turn |
| Applies when | Any tool need, including dependent steps | Subtasks are genuinely independent |
| Latency | Sum of sequential round trips | ~Max of the slowest concurrent call |
| Risk | Lower complexity | Hidden dependency misjudgment → silently wrong results; needs partial-failure handling |

## 6. Guardrail Types

| Type | Where it acts | Example |
|---|---|---|
| Input guardrail | Before the model sees the request | Blocking clearly out-of-scope or disallowed requests |
| Prompt-level instruction | Inside the system prompt | "Never discuss competitor pricing" (probabilistic, not guaranteed) |
| Output guardrail | After the model responds, before it reaches the user | PII leakage filter, content moderation check |
| Action-level guardrail | Before a tool call executes | Hard refund-amount cap, mandatory human confirmation |

## 7. Prompt Injection: Direct vs Indirect

| Aspect | Direct Injection | Indirect Injection |
|---|---|---|
| Delivered by | The user, typed directly | Hidden in content the model later reads (webpage, document, tool result) |
| Attacker needs direct access? | Yes | No |
| Typical target | Reveal system prompt, bypass rules | Trigger unauthorized tool calls, exfiltrate data |
| Primary defense | Delimiting + prompt hardening | Least privilege + action-level guardrails + confirmation |
