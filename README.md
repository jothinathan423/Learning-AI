---
title: "Learning AI — Project README"
---

# Learning AI

A [VitePress](https://vitepress.dev)-powered documentation site that turns a 7-week AI
engineering curriculum into a browsable knowledge base: concept explanations, weekly notes,
cheat sheets, a glossary, visual guides, comparisons, and interview theory.

## What This Is

This site documents seven weeks of AI-engineering theory, in order:

1. **Foundations** — how a language model actually works (tokens, cost, context windows,
   embeddings, sampling, hallucination).
2. **Prompting, Structured Output & Tool Calling** — writing reliable prompts, forcing
   structured JSON output, and letting models call real tools.
3. **Retrieval & RAG** — building a Retrieval-Augmented Generation pipeline end to end.
4. **Debugging Retrieval** — telling retrieval failures apart from generation failures; hybrid
   search, reranking, retrieval metrics.
5. **Error Analysis** — reading traces systematically and building an error taxonomy.
6. **Evals** — proving whether a change actually helped, including LLM-as-judge and RAGAS.
7. **Agent Loops** — the think→act→observe loop, ReAct, tool design, and agent memory.

Alongside the seven weeks sit several cross-cutting reference sections — `Concepts/`,
`CheatSheets/`, `Visual-Guides/` (and its `Comparisons/` subsection), `Interview-Notes/`,
`Resources/`, `AI-GLOSSARY.md` — that you'll return to repeatedly rather than read once
top-to-bottom. See [COURSE-ROADMAP.md](/COURSE-ROADMAP) for the full week-by-week breakdown and
[LEARNING-PATH.md](/LEARNING-PATH) for a broader progression (through MCP, fine-tuning, and
multi-agent systems as reference-only extensions beyond the 7 weeks).

## Scope: Documentation Only

**This project is documentation, not a course you complete assignments in.** There are no
coding projects, no exercises, no "your task this week" sections, and no mentor-check
checklists anywhere on this site. Every page here is teaching content — what a week or topic is
about, why it matters, and what you should understand by the end of it — filtered out of the
original curriculum's source materials, which mixed that teaching content with graded build
assignments. Only the teaching content made it in here.

This also means the site is entirely self-contained: reading it top to bottom (or jumping around
via the search index) is the whole workflow. There's nothing to build, submit, or check off with
a mentor.

## Running It Locally

Requires Node.js and npm.

```bash
npm install        # once, to install VitePress and its plugins
npm run docs:dev    # starts a local dev server (default: http://localhost:5173)
```

Other available commands:

```bash
npm run docs:build    # static production build — fails if any internal link is broken
npm run docs:preview  # serves the built output locally, for a final check before deploying
```

## Where to Start

- **New here?** Start at the [home page](/) for a feature-card overview of every week and
  shared section, or jump straight to [Week 1](/Week-01/README) to begin the curriculum from the top.
- **Want the big picture first?** Read [COURSE-ROADMAP.md](/COURSE-ROADMAP) for a table of all
  seven weeks and how they connect, or [LEARNING-PATH.md](/LEARNING-PATH) for a progression that
  extends beyond the 7 weeks into reference-only material.
- **Looking for something specific?** [SEARCH-INDEX.md](/SEARCH-INDEX) lists every page on the
  site in one place, or use the search box in the site's top nav.
- **Prepping for an interview?** Go straight to [Interview-Notes/](/Interview-Notes/) for
  theory-only Q&A material, organized by subject rather than by week.
