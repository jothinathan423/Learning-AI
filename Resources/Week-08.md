---
title: "Week 8 Resources — Agent Failures & Trajectory Evals"
---

# Week 8 Resources — Agent Failures & Trajectory Evals

Curated further reading for agent failure modes, trajectory evaluation, prompt injection defenses, tool sandboxing, and OWASP security standards.

## Beginner

- **OWASP Top 10 for Large Language Model Applications** (Official Standards Docs) — the primary industry reference for LLM01 through LLM10, essential reading for Topic 11.
- **OpenAI & Anthropic Prompt Injection Safety Guides** (Official Docs / Guides) — vendor guidelines on system prompt isolation, delimiter boundaries, and safety mitigations.
- **Pydantic Official Documentation** (Official Docs) — the definitive guide for data validation, field constraints (`ge`, `le`, regex), and custom validators relevant to Topic 10.
- **LangSmith & Arize Phoenix Documentation on Agent Tracing** (Official Docs) — practical tutorials on instrumenting multi-turn agent spans and inspecting full execution trajectories.

## Intermediate

- **"Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (Greshake et al., 2023)** (Research Paper) — the seminal paper that proved indirect prompt injection on real-world agents (Topic 08).
- **"AgentBench: Evaluating LLMs as Agents" (Liu et al., 2023)** (Research Paper) — an influential benchmark evaluating LLMs across multi-turn, multi-tool trajectories rather than static answers.
- **"Jailbroken: How Does LLM Safety Training Fail?" (Wei et al., 2023)** (Research Paper) — in-depth analysis of direct prompt injection mechanics and safety training vulnerabilities (Topic 07).
- **Engineering Blog Posts on Sandboxing LLM Code Execution (Firecracker, WebAssembly, gVisor)** (Blog) — practical architecture write-ups by companies like Modal, E2B, and Cloudflare on isolating untrusted AI-generated code.

## Advanced

- **"Language Models as Tool Observers: Trajectory Evaluation and Alignment" (Research Papers on arXiv)** (Research Paper) — academic formalizations of trajectory edit distance, policy alignment, and intermediate step evaluation.
- **"Universal and Transferable Adversarial Attacks on Aligned Language Models" (Zou et al., 2023)** (Research Paper) — technical exploration of adversarial suffix optimization that bypasses aligned model guardrails.
- **NIST AI Risk Management Framework (AI RMF 1.0)** (Government Standard) — institutional guidelines for auditing autonomous systems for safety, privacy, and security compliance.
- **WebAssembly System Interface (WASI) Security Specifications** (Technical Specification) — capabilities-based security models for embedding deterministic, zero-trust sandboxes directly into agent tool engines.

[Back to Resources index](/Resources/) · [Week 8](/Week-08/README)
