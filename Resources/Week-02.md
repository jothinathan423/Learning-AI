---
title: "Week 2 Resources — Prompting, Structured Output & Tool Calling"
---

# Week 2 Resources — Prompting, Structured Output & Tool Calling

Curated further reading for prompt design, few-shot/chain-of-thought prompting, structured
output (JSON Schema, Pydantic, Instructor), tool/function calling, and guardrails.

## Beginner

- **Anthropic's prompt engineering guide (Official Docs)** — the canonical starting point for
  role/instruction/context/example structure, written by the model vendor itself.
- **OpenAI's prompt engineering guide (Official Docs)** — a second vendor's take on the same
  fundamentals; comparing the two is instructive since the advice mostly agrees.
- **Pydantic's official documentation — "Models" section** (Official Docs) — the primary
  reference for how validation, types, and error messages work before adding an LLM into the mix.
- **"Prompt Engineering 101" style intro blog posts from either vendor's cookbook/docs site**
  (Blog) — short, task-focused examples of zero-shot vs few-shot prompts side by side.

## Intermediate

- **"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al., 2022)**
  (Research Paper) — the paper that introduced CoT prompting; short and very readable.
  no fabricated URL — searchable on arXiv by title.
- **"Self-Consistency Improves Chain of Thought Reasoning in Language Models" (Wang et al.,
  2022)** (Research Paper) — the paper behind Topic 04; explains the sample-and-vote method in
  full.
- **Instructor library documentation (GitHub / Official Docs)** — the reference for how
  Instructor wraps Pydantic validation around LLM tool calls with automatic retries.
- **OpenAI's and Anthropic's function-calling / tool-use documentation (Official Docs)** — the
  primary source for exact request/response shapes; secondary blog posts go stale as APIs change.
- **JSON Schema official specification site (Official Docs)** — useful once you're writing
  schemas by hand instead of letting Pydantic generate them.

## Advanced

- **"A Survey of Prompt Engineering Methods in Large Language Models" (survey papers on arXiv,
  2023–2024 vintage)** (Research Paper) — broad academic coverage connecting CoT,
  self-consistency, and decomposition into one taxonomy.
- **"Least-to-Most Prompting Enables Complex Reasoning in Large Language Models" (Zhou et al.,
  2022)** (Research Paper) — a deeper look at task decomposition than Topic 05 covers, with
  formal problem-decomposition framing.
- **OWASP "Top 10 for LLM Applications" (GitHub / Official Docs)** — the closest thing to an
  industry-standard reference for prompt injection and LLM application security; maps directly
  onto Topics 12–13.
- **Simon Willison's blog posts on prompt injection** (Blog) — one of the most-cited independent
  voices tracking real-world prompt injection incidents and defenses as they happen.

[Back to Resources index](/Resources/) · [Week 2](/Week-02/README)
