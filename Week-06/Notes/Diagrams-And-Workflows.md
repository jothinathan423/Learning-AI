# Week 6 — Diagrams and Workflows

Five Mermaid diagrams covering the full eval lifecycle this week builds, each with a short
caption explaining what it shows and where it fits.

## 1. The Full Eval Pipeline

*Caption: How an eval set gets built and scored, from raw production traces down to a
reported score — the backbone every other diagram this week plugs into.*

```mermaid
flowchart TD
    A[Production traces + Week 5 error taxonomy] --> B[Build eval set: real failures + category coverage + synthetic edge cases]
    B --> C{Choose scoring method per case}
    C -->|Mechanical property| D[Assertion check]
    C -->|Needs judgment| E[Validated LLM-as-judge]
    C -->|RAG quality| F[RAGAS metric]
    D --> G[Case score]
    E --> G
    F --> G
    G --> H[Aggregate eval score, segmented by category]
```

## 2. Regression Test Creation Flow

*Caption: How a single documented bug becomes a permanent, non-negotiable test case that
protects against silent regressions forever after.*

```mermaid
flowchart TD
    A[Real failing trace] --> B[Extract minimal reproducible input]
    B --> C[Write assertion/judge check for the failure]
    C --> D[Apply fix to system]
    D --> E{Fixed system passes the new check?}
    E -->|No| D
    E -->|Yes| F[Add to permanent regression suite, tagged by root cause]
    F --> G[Run on every future change]
```

## 3. LLM-As-Judge Validation Loop

*Caption: The calibration loop that earns an LLM judge the right to be trusted — never a
one-shot pass, always revisited when the judge, rubric, or input distribution changes.*

```mermaid
flowchart TD
    A[Stratified sample of eval cases] --> B[Human grades sample: gold labels]
    A --> C[LLM judge grades same sample]
    B --> D{Compute agreement: kappa / correlation}
    C --> D
    D -->|Poor agreement| E[Inspect disagreements, revise rubric/prompt]
    E --> A
    D -->|Acceptable agreement| F[Trust judge for ongoing evaluation]
    F --> G[Periodically re-validate: model upgrades, rubric edits, input drift]
    G --> D
```

## 4. RAGAS Metric Computation Flow

*Caption: How the four core RAGAS metrics are computed from the same underlying RAG
pipeline output — two focused on generation, two focused on retrieval.*

```mermaid
flowchart TD
    A[Question] --> B[Retriever fetches ranked context]
    B --> C[Generator produces Answer]
    C --> D[Faithfulness: decompose answer into claims, check entailment vs context]
    C --> E[Answer Relevancy: reverse-engineer questions from answer, compare to original]
    B --> F[Context Precision: LLM judges relevance + rank of each chunk]
    B --> G[Context Recall: check reference-answer sentences attributable to context]
    D --> H[Generation-quality signals]
    E --> H
    F --> I[Retrieval-quality signals]
    G --> I
```

## 5. Before/After Regression Testing Flow

*Caption: The controlled-comparison discipline that turns "I think this helped" into a
trustworthy, per-category verdict — the payoff of every other diagram above.*

```mermaid
flowchart TD
    A[Freeze eval set: same cases, same scoring config] --> B[Run BEFORE: baseline system]
    A --> C[Apply change: prompt / model / retrieval]
    C --> D[Run AFTER: changed system]
    B --> E[Compute paired per-case delta]
    D --> E
    E --> F[Aggregate deltas by category]
    F --> G{Any category regressed beyond tolerance?}
    G -->|Yes| H[Investigate trade-off; reject or iterate]
    G -->|No| I[Check untouched holdout slice]
    I --> J{Holdout confirms improvement?}
    J -->|Yes| K[Ship change; log new baseline]
    J -->|No| H
```
