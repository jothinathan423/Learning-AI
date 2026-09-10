# Week 5 — Diagrams and Workflows

A collection of Mermaid diagrams summarizing the core mechanisms of Week 5, each with a short
caption. See the individual topic pages for the full explanations behind each diagram.

## 1. The Full Error-Analysis Loop

```mermaid
flowchart TD
    A[Complete Traces] --> B[Random Sampling]
    B --> C[Open Coding: one grounded sentence per trace]
    C --> D[Error Taxonomy: group notes into ~5-10 named categories]
    D --> E[Frequency x Severity Ranking]
    E --> F[Choose ONE Fix Target]
    F --> G[Write a Prediction: expected change + expected non-change]
    G --> H[Ship the Fix]
    H --> I[Fresh Random Sample + Open Coding]
    I --> J{Prediction Confirmed?}
    J -- Yes --> K[Update Taxonomy: category improved, re-rank]
    J -- No / Partial --> L[Re-open coding on still-failing instances]
    K --> E
    L --> E
```

**Caption:** The entire week compressed into one loop. Each pass starts from complete traces,
narrows through sampling and open coding into a named taxonomy, ranks that taxonomy by
frequency × severity, commits to one fix target, predicts its effect in writing, ships it, and
re-measures with the same methodology — feeding the result back into the next iteration of the
taxonomy and ranking, rather than treating any single pass as final.

## 2. Example Error Taxonomy Tree

```mermaid
flowchart TD
    Root[RAG Support Bot: Error Taxonomy] --> A[Stale Document Retrieval]
    Root --> B[Scope Overreach]
    Root --> C[Multi-Document Conflation]
    Root --> D[Correct Facts, Wrong Format]
    Root --> E[Ambiguous Query Misread]

    A --> A1["Answer cites outdated pricing"]
    A --> A2["Answer uses superseded policy wording"]

    B --> B1["Answers a question the retrieved context doesn't support"]
    B --> B2["Fills a gap with plausible-sounding invented detail"]

    C --> C1["Blends facts from two different retrieved chunks into one wrong claim"]

    D --> D1["Right number, wrong unit or decimal precision"]
    D --> D2["Right answer, broken markdown/table rendering"]

    E --> E1["Query has two plausible meanings; system picks the wrong one silently"]
```

**Caption:** A worked example of how open-coding notes (the leaf-level, italicized-style
observations) get grouped bottom-up into five named parent categories. Real taxonomies vary by
application, but this shape — a handful of named parents, each with several concrete grounded
observations underneath — is typical.

## 3. Frequency vs. Severity Prioritization Matrix

```mermaid
quadrantChart
    title Frequency vs Severity Prioritization
    x-axis Low Frequency --> High Frequency
    y-axis Low Severity --> High Severity
    quadrant-1 Fix Next
    quadrant-2 Investigate Carefully
    quadrant-3 Deprioritize For Now
    quadrant-4 Nice-to-Have
    "Stale Document Retrieval": [0.75, 0.85]
    "Scope Overreach": [0.3, 0.8]
    "Multi-Document Conflation": [0.2, 0.45]
    "Correct Facts, Wrong Format": [0.6, 0.2]
    "Ambiguous Query Misread": [0.4, 0.5]
```

**Caption:** Categories in the top-right quadrant (frequent and severe) are the strongest
candidates for the next fix target. Top-left (rare but severe) may still warrant a lightweight
guardrail even if it isn't the primary fix target. Bottom-left (rare and mild) is safe to
deliberately set aside for now.

## 4. Sampling: Random vs. Curated

```mermaid
flowchart LR
    A[(All Production Traces)] --> B{How do we pick what to read?}
    B -->|By chance| C[Random Sample]
    B -->|By hunch / existing belief| D[Curated Sample]
    C --> E[Unbiased view of true failure distribution]
    D --> F[Confirms what we already suspected]
    E --> G[Reliable input to Open Coding + Taxonomy + Ranking]
    F -.-> H[Risk: unknown failure modes stay invisible]
```

**Caption:** Random sampling is the only path that reliably feeds an unbiased frequency estimate
into the taxonomy and ranking steps. Curated sampling has a legitimate secondary use — deepening
understanding of an already-known category — but should never replace the first, unbiased pass.

## 5. Benchmarks vs. Application-Specific Evaluation

```mermaid
flowchart LR
    subgraph Generic["Generic / Public"]
        B[Public Benchmarks]
    end
    subgraph Specific["Application-Specific"]
        C[Your Corpus + Prompts + Real Users]
    end
    B --> F[Candidate Model Selection]
    F --> G[Deployed Application]
    C --> G
    G --> H[Real Traces]
    H --> I[Manual Error Analysis Loop]
    I --> J[Application-Specific Eval Set]
    J -.->|Regression check| G
    I -.->|Refresh periodically, new failure modes emerge| I
```

**Caption:** Benchmarks help pick a candidate model; only manual error analysis on real traces
can surface application-specific failure modes and produce a standing eval set that reflects
what actually breaks in your deployment.
