---
title: "Week 8 Cheat Sheet: Agent Failures & Trajectory Evals"
week: 8
---

# Week 8 Cheat Sheet: Agent Failures & Trajectory Evals

## Key Terminology

| Term | One-Line Meaning |
| :--- | :--- |
| **Agent Trajectory** | The full ordered sequence of `(Thought, Tool, Args, Observation)` turns in a run. |
| **Trajectory Evaluation** | Scoring the intermediate execution path, not just the final output string. |
| **Outcome-Trajectory Gap** | Cases where final answer is correct, but the execution path was broken or lucky ($\Delta_{\text{gap}} = OSR - TSR$). |
| **Tool-Choice Accuracy** | Precision, Recall, and False Dispatch Rate measuring tool selection correctness. |
| **Expected Tool Sequence** | State machine or DAG defining allowable, prerequisite, and forbidden tool orderings. |
| **p99 Cost per Task** | The extreme tail cost (99th percentile) driven by deep loops and bloated payloads. |
| **Direct Prompt Injection** | Attacker directly chatting with the agent overrides system prompt constraints. |
| **Indirect Prompt Injection** | Third-party attacker hides malicious commands in external data (web, PDF, email). |
| **Tool Sandboxing** | Running tools in isolated environments (WASM, micro-VMs) with strict resource and egress limits. |
| **Least Privilege (PoLP)** | Restricting each tool's access strictly to the minimal data and scopes required. |
| **Output Validation** | Enforcing Pydantic schemas on tool arguments and sanitizing observation data. |
| **OWASP LLM Top 10** | The standard security framework classifying the 10 most critical LLM vulnerabilities. |

---

## The 5 Failure Modes & Mitigations

| Failure Mode | Symptom | Immediate Engineering Fix |
| :--- | :--- | :--- |
| **1. Cycling / Loops** | Repeating the same tool call with same arguments. | Hash deduplication of `(tool, args)`; trip circuit breaker after 2 repeats. |
| **2. Tool Misdispatch** | Calling web search for internal DB queries. | Add explicit negative clauses in docstring (*"Do NOT use for..."*); dynamic pruning. |
| **3. Argument Hallucination** | Passing invalid field types or imaginary IDs. | Strict JSON schema mode (Pydantic); return schema error traces to model. |
| **4. Premature Exit** | Quitting before verifying dependencies. | Sequence state machine: block final answer until verification tool succeeds. |
| **5. Cascade Poisoning** | Early error corrupts all subsequent reasoning. | Dual-model verification; require citations linking claims to tool observations. |

---

## Defensive Architecture Quick Reference

### 1. The Direct Injection Defense Stack
- **Prompt Isolation:** Wrap untrusted user input inside XML tags: `<user_input>...</user_input>`.
- **Identity Decoupling:** Never pass user role or admin status from the prompt; extract it securely from the authenticated JWT session.
- **Human Gates:** Require UI user confirmation for all financial, deletion, or permission mutations.

### 2. The Indirect Injection Defense Stack
- **Dual-Model Pattern:** Use an isolated, tool-less "Reader LLM" to extract clean JSON from untrusted web/PDF/email text before passing it to the "Actor LLM".
- **Egress Firewall:** Restrict tool network access to an explicit domain allowlist; block internal IPs (`169.254.169.254`, `10.0.0.0/8`, `127.0.0.1`).
- **Markdown Scrubber:** Strip dynamic image tags (`![tracker](...)`) to prevent side-channel data exfiltration via image loads.

### 3. Tool Sandboxing Checklist
- [ ] Ephemeral execution (containers or WASM wiped clean after each run).
- [ ] Read-only database replicas for search tools.
- [ ] Hard resource caps: max 5 seconds CPU, max 512MB RAM.
- [ ] No network access (`--network=none`) for code execution engines.
- [ ] Tenant-scoped SQL queries: `WHERE tenant_id = session.tenant_id`.

---

## Core Metrics Formulas

| Metric | Formula | Target |
| :--- | :--- | :--- |
| **Outcome Success Rate (OSR)** | $\frac{\text{Correct Final Answers}}{\text{Total Tasks}}$ | $> 90\%$ |
| **Trajectory Success Rate (TSR)** | $\frac{\text{Correct Final Answers } \land \text{ Valid Trajectories}}{\text{Total Tasks}}$ | $> 85\%$ |
| **Outcome-Trajectory Gap ($\Delta_{\text{gap}}$)** | $OSR - TSR$ | $< 5\%$ |
| **Tool Choice Precision** | $\frac{TP}{TP + FP}$ | $> 95\%$ |
| **Tool Choice Recall** | $\frac{TP}{TP + FN}$ | $> 95\%$ |
| **Tail Cost Ratio** | $\frac{\text{p99 Cost}}{\text{Mean Cost}}$ | $\le 4.0\times$ |
