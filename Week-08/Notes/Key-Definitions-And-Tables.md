---
title: "Week 8 Notes: Key Definitions & Tables"
week: 8
---

# Key Definitions & Tables

This document aggregates the essential technical definitions, evaluation formulas, and comparison matrices across the 11 topics of Week 8.

---

## 1. Master Glossary of Core Terms

| Term | Technical Definition | Key Metric / Attribute |
| :--- | :--- | :--- |
| **Agent Trajectory ($\tau$)** | The ordered sequence of intermediate reasoning steps, tool calls, arguments, and environmental observations leading to a final answer: $\tau = (s_0, a_0, o_0, \dots, y)$. | Steps count, cost, latency, sequence validity. |
| **Trajectory Evaluation** | The practice of inspecting and scoring the intermediate execution path of an agent rather than only assessing its final generated string. | Step precision, adherence to constraints, observation grounding. |
| **Outcome vs. Trajectory Gap** | The divergence between outcome success and trajectory validity: $\Delta_{\text{gap}} = OSR - TSR$. | High gap indicates reliance on lucky guesses or parametric leakage. |
| **Tool-Choice Precision** | The ratio of relevant, necessary tool invocations to total tool invocations: $\frac{TP}{TP + FP}$. | Targets $> 95\%$; prevents wasteful exploratory API calls. |
| **Tool-Choice Recall** | The proportion of required tool dispatches that were actually triggered by the model: $\frac{TP}{TP + FN}$. | Measures tool omission or models trying to compute facts mentally. |
| **Direct Prompt Injection** | An adversarial exploit where user-supplied chat text overrides system instructions to hijack the agent's decision loop. | Mitigated via hard XML boundaries, IAM scoping, and human approval gates. |
| **Indirect Prompt Injection** | An exploit where adversarial instructions are embedded inside passive external data (web pages, PDFs, emails) ingested by the agent. | Mitigated via Dual-Model (Reader/Actor) isolation and egress domain filtering. |
| **Tool Sandboxing** | Executing agent tools inside isolated, ephemeral environments (micro-VMs, Wasm, containers) with strict CPU, memory, and network boundaries. | Prevents container escapes, SSRF, and remote code execution. |
| **Principle of Least Privilege (PoLP)** | Restricting each tool's access rights and API tokens strictly to the minimum entities and scopes needed to perform its assigned duty. | Read/write separation, tenant-scoped database connections, ephemeral tokens. |
| **Output Validation** | Programmatic verification of model tool arguments against strict schemas (Pydantic) and sanitization of incoming environment observations. | Structural schemas, range invariants, PII masking, automated error feedback. |
| **Excessive Agency (OWASP LLM06)** | Granting an autonomous agent excessive permissions, broad API access, or autonomous write authority without human oversight. | Top security hazard in autonomous agent production deployments. |

---

## 2. Core Mathematical Formulas

### Trajectory Sequence Compliance
$$\text{Compliance}(S_{\text{obs}}, S_{\text{gold}}) = 1 - \frac{\text{Levenshtein}(S_{\text{obs}}, S_{\text{gold}})}{\max(|S_{\text{obs}}|, |S_{\text{gold}}|)}$$

### The Outcome-Trajectory Gap
$$\Delta_{\text{gap}} = OSR - TSR$$
Where:
- $OSR = \frac{1}{N} \sum \mathbf{1}(\text{Final Answer Correct})$
- $TSR = \frac{1}{N} \sum \mathbf{1}(\text{Final Answer Correct} \land \text{Trajectory Valid})$

### Quadratic Compounding Task Cost
$$\text{Cost}_{\text{task}} = \sum_{t=1}^T \left[ P_{\text{in}} \cdot \left( N_{\text{sys}} + \sum_{k=1}^{t-1} (N_{\text{act}}^{(k)} + N_{\text{obs}}^{(k)}) \right) + P_{\text{out}} \cdot N_{\text{out}}^{(t)} + C_{\text{tool}}^{(t)} \right]$$

### False Dispatch Rate (FDR)
$$\text{FDR} = \frac{\sum \text{Unnecessary Tool Calls}}{\text{Total Tool Calls Made}}$$

---

## 3. Comparison Matrices

### Direct vs. Indirect Prompt Injection

| Characteristic | Direct Prompt Injection | Indirect Prompt Injection |
| :--- | :--- | :--- |
| **Attacker Identity** | The active chat user interacting with the agent. | Third party who planted instructions in an external document. |
| **Victim** | The system owner / enterprise hosting the agent. | Both the innocent user and the enterprise hosting the agent. |
| **Payload Delivery** | Direct conversational input prompt. | Web search result, uploaded PDF, customer email, database record. |
| **User Awareness** | Attacker knows they are sending an exploit. | User has no idea the document they asked to summarize is hostile. |
| **Typical Goal** | Jailbreak persona, exfiltrate system prompt, run free compute. | Steal user's private data, perform unauthorized actions on user's behalf. |
| **Primary Defense** | Input guardrails (Llama-Guard), XML boundaries, role IAM. | Dual-model architecture, read-only reader, network egress allowlisting. |

### Evaluation Paradigm Comparison

| Feature | Single-Turn Output Eval | Trajectory Evaluation |
| :--- | :--- | :--- |
| **Scope** | Final output string only. | Tuple sequence of $(s_t, a_t, o_t)$ across all turns. |
| **Catches Hallucinations?** | Only if the final answer is blatantly wrong. | Catches intermediate reasoning and parameter hallucinations. |
| **Catches Inefficiency?** | No; a 20-step loop looks identical to a 1-step call. | Yes; measures trajectory length ratio and redundant dispatches. |
| **Catches Security Violations?** | No; cannot see unapproved tool calls made along the way. | Yes; detects forbidden tools, parameter smuggling, and data leakage. |
| **Cost to Run** | Low (single comparison). | Moderate (rule engine + optional step-level LLM judge). |

---

## 4. OWASP LLM Top 10 Summary Table

| ID | Name | Core Agent Risk | Top Mitigation |
| :--- | :--- | :--- | :--- |
| **LLM01** | Prompt Injection | Direct jailbreak or indirect external document hijack. | Isolated reader model, strict delimiters, egress blocking. |
| **LLM02** | Sensitive Info Disclosure | PII, secret keys, or internal data exposed in output. | Egress regex scrubbers, Presidio PII token masking. |
| **LLM03** | Supply Chain Vulnerabilities | Compromised third-party agent plugins or models. | Dependency pinning, vulnerability scanning, code audits. |
| **LLM04** | Data & Model Poisoning | Poisoned enterprise RAG wiki docs or fine-tuning data. | Ingestion integrity checks, RAG access controls, anomaly detection. |
| **LLM05** | Improper Output Handling | Raw tool output passed directly to `eval()`, SQL, or shell. | Strict parameterized APIs, Pydantic validation, AST parsing. |
| **LLM06** | Excessive Agency | Giving tools broad write/delete rights without review. | Least privilege, read/write segregation, human-in-the-loop gates. |
| **LLM07** | System Prompt Leakage | Model coaxed into revealing proprietary prompt logic. | Remove secrets from prompts; add leak-detection egress filters. |
| **LLM08** | Vector & Embedding Weaknesses | Crafted adversarial text dominating top-$k$ RAG retrieval. | Hybrid search (dense + sparse BM25), cross-encoder rerankers. |
| **LLM09** | Misinformation | Ungrounded hallucinations triggering flawed tool actions. | Strict citation attribution, grounding assertion checks. |
| **LLM10** | Unbounded Consumption | Infinite reasoning loops causing denial-of-wallet. | Max step limits, dollar budget circuit breakers, payload pruning. |
