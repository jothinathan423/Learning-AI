---
title: "Prompt Engineering Interview Notes"
---

# Prompt Engineering Interview Notes

The techniques and failure modes interviewers expect you to know for getting reliable, structured, safe behavior out of an LLM through prompting alone.

## Questions & Answers

### Q1. What are the core components of a well-structured prompt?
**Expected answer:**
- **Role/persona** — who the model should act as (e.g., "You are an experienced technical writer").
- **Context** — relevant background information the model needs to answer well (documents, prior conversation, constraints).
- **Task/instruction** — the specific, explicit action requested, ideally unambiguous.
- **Format constraints** — how the output should be structured (bullet points, JSON, a specific length).
- **Examples** (optional but powerful) — demonstrations of the desired input-output pattern (few-shot).
- A good rule of thumb: the model can only work with what's explicitly stated or strongly implied in the prompt — vague or underspecified prompts produce vague or inconsistent outputs, because there's no "read my mind" capability underneath the fluent language.

### Q2. What's the difference between zero-shot and few-shot prompting?
**Expected answer:**
- **Zero-shot** — asking the model to perform a task with instructions only, no worked examples. Relies entirely on the model's pretrained/instruction-tuned knowledge of how to do the task.
- **Few-shot** — including a small number (typically 1–5) of example input-output pairs directly in the prompt before the real request, so the model can infer the desired pattern, format, or style by example rather than (or in addition to) explicit instruction.
- Few-shot is especially useful for: unusual output formats, domain-specific conventions, or tasks where "show, don't tell" communicates the desired behavior more reliably than a written description could. The tradeoff is that examples consume context window tokens and add cost/latency.

### Q3. What is chain-of-thought prompting, and why does it improve performance on reasoning tasks?
**Expected answer:**
- Chain-of-thought (CoT) prompting asks the model to produce intermediate reasoning steps ("think step by step") before giving a final answer, rather than jumping straight to the answer.
- It helps because the model generates its answer token-by-token, conditioned on everything generated so far — by first producing explicit reasoning tokens, the final answer is conditioned on that visible reasoning chain, effectively giving the model more "compute steps" and relevant intermediate context to work with before committing to an answer.
- It's most valuable for multi-step reasoning tasks (math, logic, multi-hop questions) and much less useful (sometimes even counterproductive on latency/cost) for simple factual lookups or tasks with no real reasoning chain.
- Caveat: the visible reasoning is not a guaranteed faithful representation of the model's actual internal computation — it can look plausible while not truly reflecting how the answer was derived.

### Q4. What is self-consistency, and how does it build on chain-of-thought?
**Expected answer:**
- Self-consistency runs the same chain-of-thought prompt multiple times at a non-zero temperature (so each run reasons somewhat differently), then takes the majority/most common final answer across all the runs, discarding the individual reasoning paths.
- The intuition: if there are multiple different ways to reach the correct answer, sampling several independent reasoning attempts and taking a vote is more robust than trusting a single reasoning path, which might go down a flawed line of reasoning.
- The tradeoff is cost — it multiplies the number of model calls needed (e.g., 5–10x) for a given question, so it's used selectively for high-stakes or difficult reasoning tasks rather than every request.

### Q5. Why does structured output (JSON mode / schema-constrained generation) matter, and how is it achieved?
**Expected answer:**
- Free-form text output is hard for downstream code to reliably parse — the model might vary its wording, formatting, or field ordering between calls, causing brittle parsing failures in production systems.
- Structured output constrains the model to produce output conforming to a defined schema (e.g., strict JSON matching a given shape), so downstream systems can parse it deterministically.
- Achieved via: explicit instructions plus examples in the prompt, provider-specific "JSON mode" or schema-constrained decoding features (which restrict the token sampling process itself to only valid-schema continuations), or a validation-and-retry loop that re-prompts the model if the output fails to parse/validate.
- This matters enormously for any pipeline where an LLM's output feeds directly into code (tool calling, data extraction, structured pipelines) rather than being read directly by a human.

### Q6. What is tool calling / function calling, and how does the model decide when and how to call a tool?
**Expected answer:**
- Tool calling (function calling) lets an LLM, instead of only generating free text, output a structured request to invoke an external function — specifying the tool's name and arguments matching a schema the developer provided.
- Mechanically: the developer describes available tools (name, description, parameter schema) as part of the request; the model, based on the conversation and those descriptions, decides whether a tool call is needed and, if so, generates a structured call matching the schema; the calling application then actually executes the tool (the model itself never runs code) and returns the result to the model as new context for it to continue reasoning or respond.
- The model's decision of *which* tool and *what arguments* to use is entirely driven by pattern-matching against the tool's name/description/schema — it has no visibility into the tool's actual implementation, which is why clear, unambiguous tool descriptions are critical (see the Agents interview notes for more on tool design).

### Q7. What is prompt injection, and what's the difference between direct and indirect prompt injection?
**Expected answer:**
- **Prompt injection** is an attack where malicious instructions are inserted into content the model processes, attempting to override or hijack the model's intended behavior (e.g., "ignore all previous instructions and instead...").
- **Direct prompt injection** — the attacker is the user themselves, typing adversarial instructions directly into the chat input.
- **Indirect prompt injection** — the malicious instructions are hidden inside *external content* the model is asked to process (a webpage it's summarizing, a document it's reading, a tool's return value) — the end user may not even be the attacker; the attack is embedded in data the model trusts as "just content."
- Indirect injection is considered the more dangerous, harder-to-defend-against variant precisely because the model can't easily distinguish "instructions from my legitimate operator" from "text that merely looks like instructions, sitting inside data I was asked to summarize."

### Q8. What are guardrails, and what layers do they typically operate at?
**Expected answer:**
- Guardrails are checks and constraints layered around a model to keep its inputs and outputs within acceptable, safe, and on-task bounds — they're external controls, not something the model enforces perfectly on its own via prompting alone.
- **Input guardrails** — filtering or flagging user input before it reaches the model (detecting prompt injection attempts, off-topic requests, disallowed content).
- **Output guardrails** — checking the model's response before it's shown to the user or acted upon (detecting policy violations, PII leakage, hallucinated claims, malformed structured output).
- **Behavioral guardrails** — system-prompt-level instructions and constraints shaping what the model should and shouldn't do, though these alone are considered a weaker line of defense than external checks, since a sufficiently adversarial input can sometimes still get a model to deviate from system-prompt instructions.
- Defense in depth is the standard approach: no single layer (prompting, input filtering, output filtering) is treated as sufficient alone, especially against indirect prompt injection.

### Q9. What is role/persona prompting, and does it reliably change model behavior?
**Expected answer:**
- Role prompting assigns the model an identity or persona (e.g., "You are a senior security engineer reviewing this code") to bias its response style, vocabulary, and focus toward what's appropriate for that role.
- It can meaningfully shift tone, depth, and framing of responses, since the model conditions its next-token predictions on this framing throughout generation.
- It is not a security boundary — a persona instruction is just another piece of text in the prompt, and can be overridden by sufficiently adversarial follow-up input; it should be treated as a style/quality lever, not a safety guarantee.

### Q10. What is prompt chaining, and when is it preferable to one large mega-prompt?
**Expected answer:**
- Prompt chaining breaks a complex task into a sequence of smaller, separate LLM calls, where each step's output feeds into the next step's input — rather than asking one giant prompt to do everything in a single pass.
- It's preferable when: the task has genuinely distinct sub-stages (e.g., extract → summarize → classify), each stage benefits from its own focused instructions/examples, intermediate outputs need validation before proceeding, or a single mega-prompt would be so long and complex that the model's attention/instruction-following degrades.
- The tradeoff is more calls (cost, latency) and more orchestration complexity versus one call handling everything — chaining is a workflow design decision, not purely a prompting technique (see the Agents interview notes for how this scales into full pipelines).

### Q11. What is in-context learning, and how is it different from fine-tuning?
**Expected answer:**
- **In-context learning** is the ability of a pretrained model to adapt its behavior for the current request based purely on what's provided in the prompt (instructions, examples) — no weight updates happen; it's entirely a property of inference-time context.
- **Fine-tuning** actually updates the model's parameters through additional training on task-specific data, permanently changing the model's behavior for all future uses of that fine-tuned checkpoint.
- In-context learning is cheaper, faster to iterate on, and reversible (just change the prompt), but is bounded by the context window and doesn't persist across sessions; fine-tuning is more expensive/slower to set up but bakes the adaptation permanently into the model and doesn't consume context window tokens at inference time.

### Q12. How should temperature/sampling settings factor into prompt engineering strategy?
**Expected answer:**
- Temperature and sampling parameters (top-p/top-k) are part of the overall "prompt design" decision even though they're technically separate API parameters — the same instructions can behave quite differently at different sampling settings.
- Low temperature (near 0) is preferred for tasks needing consistency and precision: extraction, classification, structured output, factual Q&A, code generation.
- Higher temperature is preferred for tasks wanting variety: brainstorming, creative writing, generating multiple diverse candidate outputs.
- A common practical pattern: use low temperature plus self-consistency-style multiple sampling for high-stakes reasoning tasks, and match the sampling strategy to the task's actual need for determinism versus diversity rather than defaulting to one setting everywhere.

### Q13. How should a prompt handle ambiguous or underspecified user requests?
**Expected answer:**
- Left unaddressed, an LLM will typically just guess a reasonable-sounding interpretation and answer confidently — which can silently produce a wrong or unwanted result rather than surfacing the ambiguity.
- Good prompt design options: instruct the model explicitly to ask a clarifying question when key information is missing rather than guessing; provide sensible default assumptions in the prompt and have the model state which assumptions it made; or constrain the output format to make any assumptions explicit and easy to spot/correct.
- Which approach is right depends on the product: a conversational assistant can afford to ask clarifying questions; a fully automated pipeline usually can't pause for human input, so it needs explicit fallback/default behavior baked into the prompt instead.

### Q14. How do you evaluate whether a prompt is actually good, rather than just eyeballing a few outputs?
**Expected answer:**
- Anecdotal spot-checking ("I tried it three times and it looked fine") is not a reliable evaluation method — LLM outputs vary, and small prompt wording changes can shift results meaningfully.
- A proper evaluation set: a representative sample of realistic inputs (including edge cases), an explicit rubric or set of assertion checks for what a "good" output must satisfy, and either automated checks (regex/schema validation), LLM-as-judge scoring, or human review run consistently across prompt variants.
- Compare prompt variants against the *same* evaluation set, ideally with pairwise or scored comparison rather than isolated absolute judgments, and treat prompt engineering as an iterative, measured process rather than a one-shot creative writing exercise.

### Q15. What's the difference between a prompt template and a fully dynamic prompt, and why does this distinction matter in production systems?
**Expected answer:**
- A **prompt template** is a fixed structure with variable slots (e.g., `{user_question}`, `{retrieved_context}`) filled in at request time — the instructions and format stay stable while the content varies.
- A fully dynamic/ad hoc prompt is constructed differently each time with no consistent underlying structure.
- Production systems strongly favor templates: they make prompts version-controllable, testable against a fixed evaluation set, and debuggable (you can diff template versions and correlate behavior changes with specific edits) — an unversioned, ad hoc prompt makes regressions nearly impossible to trace.
