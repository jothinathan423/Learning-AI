# CLAUDE.md — Learning-AI project memory

This file is for whichever Claude session works on this project next (including future
sessions after the user adds a new week of source material). Read this before touching
anything else here.

## What this project is

`Learning-AI/` is a VitePress documentation web app that turns the AI-engineering curriculum
in `../Learning-Materials/` into a browsable knowledge base: concept explanations, notes,
cheat sheets, glossary, visual guides, comparisons, interview theory.

**Hard rules — do not violate these:**
- This is documentation only. **No coding projects, no assignments, no exercises to complete,
  no "your task this week" content, no mentor-check checklists.** The source `.docx`/`.pdf`
  files in `Learning-Materials` mix real teaching content with graded build assignments —
  only the teaching content (what the week is about, why it matters, what you'll learn,
  topics covered) ever gets carried into this project.
- **Never modify `Learning-Materials/`.** It is read-only source material.
- **Never write into `Learning-Projects/`.** That's an unrelated folder of existing coding
  projects.
- Every topic file follows the same 12-section template (below) — consistency matters more
  than novelty across ~75+ topic files.

## Folder structure

```
Learning-AI/
├── CLAUDE.md                  # this file
├── package.json / .vitepress/config.mjs
├── index.md                   # home page (layout: home, one feature card per week + per shared section)
├── README.md, COURSE-ROADMAP.md, AI-GLOSSARY.md, LEARNING-PATH.md, SEARCH-INDEX.md
├── Week-01/ … Week-07/
│   ├── README.md               # week landing page: summary, reading time, difficulty,
│   │                            # prerequisites, what you'll master, topics, progress checklist
│   ├── Topics/NN-Kebab-Case-Name.md
│   ├── Notes/*.md
│   ├── CheatSheet.md
│   └── Revision.md             # 5-Minute / 15-Minute / Last-Minute-Interview sections
├── CheatSheets/                # master, cross-week cheat sheets (10 files)
├── Concepts/                   # encyclopedia, one file per major term
├── Visual-Guides/               # one Mermaid-diagrammed guide per mechanism
│   └── Comparisons/            # comparison docs (tables), same family as Visual-Guides
├── Interview-Notes/             # theory-only, no coding questions
└── Resources/                   # per-week links, Beginner/Intermediate/Advanced
```

## Per-topic template (every `Topics/*.md` file)

```
---
title: "<Topic Name>"
week: <N>
order: <NN>
difficulty: Beginner|Intermediate|Advanced
readingTime: "<N> min"
---

# <Topic Name>
## 1. Introduction
## 2. Why This Topic Exists
## 3. Core Concept
   ### Beginner
   ### Intermediate
   ### Advanced
## 4. Deep Explanation
## 5. Step-by-Step Flow
## 6. Architecture Explanation   (```mermaid fenced diagram)
## 7. Visual Analogy
## 8. Real Industry Example
## 9. Common Misconceptions
## 10. Best Practices
## 11. Summary
## 12. Key Takeaways
```

Beginner/Intermediate/Advanced levels live **only** as subsections of §3 (Core Concept) —
§4 (Deep Explanation) is already the internals-level treatment, so don't duplicate leveling
there.

## Naming conventions

- Weeks: `Week-01` … `Week-NN` (zero-padded two digits).
- Topics: `Topics/01-Kebab-Case-Name.md` (two-digit order prefix + kebab-case; sidebar order
  in `.vitepress/config.mjs` must match the prefix order).
- Root docs: SCREAMING-KEBAB (`AI-GLOSSARY.md`, `COURSE-ROADMAP.md`, `LEARNING-PATH.md`,
  `SEARCH-INDEX.md`).
- Other folders/files: kebab-case, matching the folder names already used above.
- Diagrams: plain ` ```mermaid ` fences — `vitepress-plugin-mermaid` renders them, no import
  needed in content files.

## Adding a new week (runbook)

When a new `Learning-Materials/.../Week-0N-*.docx` or `.pdf` appears:

1. **Extract text.** `.docx` is a zip — `unzip` it and strip tags from `word/document.xml`
   (regex `<[^>]+>` after turning `</w:p>` into newlines works well; unescape `&amp;` etc.).
   `.pdf` files can be read directly with the Read tool.
2. **Filter the content.** Keep only: title, "what this week is about", "why it matters" Q&A,
   "what you'll learn", "topics covered" list. Discard "your task this week", assigned tracks
   (A/B/C/D/E/F), and "how your mentor checks" sections entirely — never reproduce them here.
3. **Generate the week's files** using the per-topic template above: `Week-0N/README.md`,
   one `Topics/NN-Name.md` per topic in the "topics covered" list, a few `Notes/*.md`,
   `CheatSheet.md`, `Revision.md`.
4. **Wire it into the site:**
   - Add a `sidebar['/Week-0N/']` block to `.vitepress/config.mjs` (copy the `weekSidebar()`
     pattern already used for weeks 1–7 — add the new week's topic slug array to the `weeks`
     array at the top of the file, the helper generates the sidebar automatically).
   - Add a feature card to `index.md`.
   - Add the new week's link to `sidebar['/Resources/']` and create `Resources/Week-0N.md`.
5. **Update shared artifacts:** fold any new terms into `AI-GLOSSARY.md` and, if significant,
   `Concepts/`; add the week's topics to `SEARCH-INDEX.md`; revisit `LEARNING-PATH.md` and
   `COURSE-ROADMAP.md` if the new week changes the overall progression.
6. Run `npm run docs:build` to confirm no broken internal links before considering it done.

## Dev commands

```
npm install        # once
npm run docs:dev   # local dev server, default http://localhost:5173
npm run docs:build # static build, fails on broken internal links
npm run docs:preview
```
