---
title: "Diagrams & Workflows"
week: 2
---

# Diagrams & Workflows

Visual reference diagrams tying together the Week 2 topics into end-to-end workflows.

## 1. Prompt → Structured Output → Validation → Retry Loop

The core reliability loop underlying almost every LLM-powered feature: never trust the first response blindly, always validate, and retry with specific feedback before falling back.

```mermaid
flowchart TD
    A[Assemble Prompt: role, instructions, context, data, format] --> B[Send to LLM API with JSON Schema / Pydantic model]
    B --> C[Receive Response]
    C --> D[Parse JSON]
    D --> E[Validate: schema + business rules]
    E --> F{Valid?}
    F -- Yes --> G[Use Structured Data in Application]
    F -- No --> H{Retries left?}
    H -- Yes --> I[Re-prompt with specific validation error]
    I --> B
    H -- No --> J[Fallback: error / default / human escalation]
```

*Caption: The backbone workflow of Topics 1, 6, 7, 8, and 9 — a well-anatomized prompt requests structured data, which is parsed and validated at multiple layers, with targeted retries before any fallback.*

## 2. Tool-Calling Request/Response Cycle

The model never executes code — it requests; the application executes and reports back.

```mermaid
sequenceDiagram
    participant User
    participant App as Application
    participant LLM
    participant Tool as Real Function/API

    User->>App: Natural language request
    App->>LLM: Conversation + tool definitions
    LLM-->>App: Structured tool-call request (name + arguments)
    App->>App: Validate arguments (guardrails)
    App->>Tool: Execute real function
    Tool-->>App: Real result
    App->>LLM: Conversation + tool result
    LLM-->>App: Final natural-language answer
    App-->>User: Response
```

*Caption: The single-cycle version of tool calling (Topic 10) — repeating this cycle multiple times in sequence is what forms an agent loop (Week 7).*

## 3. Prompting Technique Escalation Path

How to escalate prompting techniques as task difficulty increases, from cheapest to most expensive.

```mermaid
flowchart LR
    A[Zero-Shot] -->|Inconsistent format/style| B[Few-Shot]
    B -->|Needs multi-step reasoning| C[Chain-of-Thought]
    C -->|High-stakes, discrete answer needed| D[Self-Consistency: N sampled CoT runs, majority vote]
    A -->|Task too large for one call / needs multiple skills| E[Task Decomposition: sequential or parallel subtasks]
```

*Caption: Start with the cheapest technique (zero-shot) and escalate only when evidence shows it's needed — each step right adds cost/latency in exchange for reliability (Topics 2–5).*

## 4. Parallel vs Sequential Tool Calls

Dependency structure determines whether tool calls can be parallelized.

```mermaid
flowchart TD
    A[Identify Needed Tool Calls] --> B{Are the calls independent?}
    B -- Yes --> C[Emit multiple tool calls in one turn]
    C --> D[Execute concurrently]
    D --> E[Collect all results together]
    B -- No: B needs A's output --> F[Emit Tool Call A]
    F --> G[Execute A, get result]
    G --> H[Emit Tool Call B using A's result]
    H --> I[Execute B, get result]
    E --> J[Return combined results to model]
    I --> J
```

*Caption: Parallel tool calls (Topic 11) only apply when subtasks are genuinely independent — dependent calls must stay sequential to avoid silently wrong results.*

## 5. Layered Defense: Guardrails and Prompt Injection

How guardrail layers and injection defenses stack together around the model.

```mermaid
flowchart TD
    A[Untrusted Input: user text, documents, webpages, tool results] --> B[Input Guardrail: scope/content screening]
    T[Trusted System Prompt] --> C[LLM Processing]
    B -- Passed --> C
    C --> D{Tool Call Requested?}
    D -- Yes --> E[Least-Privilege Check + Action Guardrail]
    E -- High-stakes --> F[Human Confirmation Required]
    E -- Low-stakes/approved --> G[Tool Executes]
    D -- No --> H[Output Guardrail: content/PII/injection detection]
    G --> H
    F --> G
    H --> I[Delivered to User]
```

*Caption: No single layer (Topics 12–13) is assumed sufficient on its own — defense in depth means an injected or hijacked model still cannot bypass code-level authorization on real actions.*
