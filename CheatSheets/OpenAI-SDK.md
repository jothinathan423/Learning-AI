---
title: "OpenAI SDK"
---

# OpenAI SDK / API — Master Cheat Sheet

General conceptual reference — API shapes and parameters, not a coding tutorial.

## Core Terminology

| Term | Meaning |
|---|---|
| Chat Completions API | Original, message-array-based endpoint (`/chat/completions`) |
| Responses API | Newer, unified endpoint combining chat + tools + state (`/responses`) |
| Message | One turn in the conversation: `role` + `content` |
| Role | `system` (or `developer`) / `user` / `assistant` / `tool` |
| Tool/function calling | Model requests a function call; your code executes it and returns the result |
| Structured outputs | Response constrained to match a provided JSON Schema |
| Streaming | Server-sent events (SSE) delivering the response incrementally as it's generated |
| Token | Unit of text the model reads/writes (see LLM.md) |
| Embeddings endpoint | Separate API that returns a vector for input text |

## Message Array Shape (conceptual)

```json
[
  { "role": "system", "content": "You are a helpful assistant. Be concise." },
  { "role": "user", "content": "Summarize this ticket in one sentence." },
  { "role": "assistant", "content": "Prior turn's reply, if any." },
  { "role": "user", "content": "Follow-up question." }
]
```

## Chat Completions vs Responses API (conceptual)

| | Chat Completions | Responses API |
|---|---|---|
| Shape | Flat `messages` array in, one message out | Structured "items" (input/output) — turns, tool calls, reasoning are first-class |
| State | Stateless — you resend full history each call | Can be stateless or reference prior response IDs for continuity |
| Tool calling | Supported via `tools` + `tool_choice` | Supported, same concepts, unified with other item types |
| Built-in tools | None natively (bring your own) | Some hosted tools available server-side (e.g., web/file search, depending on offering) |
| Best fit | Simple chat, broad compatibility, most existing tutorials | Newer agentic workflows, multi-step tool use, built-in state |

## Function/Tool Calling Shape

```json
{
  "type": "function",
  "function": {
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
}
```

```
Cycle: Model requests tool call -> app validates args -> app executes real function
       -> app returns result as a "tool" role message -> model writes final answer
```

`tool_choice`: `"auto"` (model decides), `"required"`/`"any"` (must call something), or a named
tool (force a specific call). Parallel tool calls let the model request several independent
calls in one turn — execute concurrently only when they're truly independent.

## Structured Outputs Shape

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "order",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "order_id": { "type": "string" },
        "total": { "type": "number" },
        "tier": { "type": "string", "enum": ["free", "pro", "enterprise"] }
      },
      "required": ["order_id", "total", "tier"],
      "additionalProperties": false
    }
  }
}
```

`strict: true` constrains decoding so output structurally must match — still validate business
logic separately (schema-valid ≠ factually correct).

## Streaming (conceptual)

```
Request with stream=true
-> server sends a sequence of chunks/events (deltas)
-> each chunk carries a partial piece of content (or a partial tool-call argument)
-> a final event signals completion (finish_reason)
-> client concatenates deltas to reconstruct the full response as it arrives
```

Use streaming for responsive UX on long generations; buffer and re-parse carefully when
streaming structured/tool-call output, since it arrives in fragments.

## Key Parameters

| Parameter | Effect |
|---|---|
| `temperature` | Randomness of sampling (0 = near-deterministic, higher = more varied) — see LLM.md |
| `top_p` | Nucleus sampling cutoff; usually tune one of temperature/top_p, not both aggressively |
| `max_tokens` / `max_output_tokens` | Hard cap on generated length |
| `n` | Number of independent completions to generate for one prompt |
| `stop` | Sequence(s) that end generation early when produced |
| `frequency_penalty` | Discourages repeating the same tokens verbatim |
| `presence_penalty` | Discourages reusing any token that already appeared, regardless of frequency |
| `seed` | Requests best-effort reproducibility across identical calls |
| `tools` / `tool_choice` | Declares available functions and how eagerly to use them |
| `response_format` | Plain text vs `json_object` vs `json_schema` (structured outputs) |

## Quick Reminders

- The model never executes code — it only requests a tool call; your application always
  executes it and controls permissions.
- Validate every tool call's arguments in code before execution — never trust them blindly.
- Resent conversation history costs tokens every turn in the stateless Chat Completions shape —
  trim/summarize long histories.
- `strict` structured outputs guarantee shape, not truth — keep a business-logic validation step.
- Prefer official SDKs over raw HTTP calls for retry/backoff, streaming parsing, and type safety.
- Check current provider docs for exact endpoint/parameter names — APIs evolve; the concepts
  above are stable even as specific field names shift across versions.
