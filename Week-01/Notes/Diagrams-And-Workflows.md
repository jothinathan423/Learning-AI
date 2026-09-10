# Week 1 — Diagrams and Workflows

A small set of Mermaid diagrams covering the key workflows and mechanisms from this week, each with a short caption. Use these for a quick visual refresher rather than re-reading full topic pages.

## 1. The Tokenization Pipeline

```mermaid
flowchart LR
    A[Raw input text] --> B[Tokenizer applies BPE / SentencePiece vocabulary]
    B --> C[Sequence of tokens]
    C --> D[Tokens mapped to integer IDs]
    D --> E[Model processes IDs as numbers]
    E --> F[Model outputs new token IDs]
    F --> G[Detokenizer maps IDs back to text]
    G --> H[Readable output text]
```

**Caption:** Every request to a language model passes through this pipeline twice — once to encode your prompt into tokens, and once to decode the model's output tokens back into readable text. Cost, context limits, and even some model quirks (weak arithmetic, uneven multilingual performance) all trace back to this pipeline.

## 2. The Next-Token Generation Loop

```mermaid
flowchart TD
    A[Current sequence of tokens] --> B[Model computes probability for every possible next token]
    B --> C[Decoding strategy selects one token: greedy, sampled, or beam search]
    C --> D[Selected token appended to sequence]
    D --> E{Stop token reached or max length hit?}
    E -- No --> A
    E -- Yes --> F[Final generated response]
```

**Caption:** This loop is the entire mechanism behind text generation — repeated one token at a time. Everything else this week (temperature, top-p, greedy vs. sampled, hallucination) is really just a detail of what happens inside the "decoding strategy" box.

## 3. Temperature's Effect on Output Diversity

```mermaid
flowchart LR
    A["Low Temperature (near 0)"] --> A1["Sharp distribution: top token dominates"]
    A1 --> A2["Predictable, repeatable, focused output"]

    B["Temperature = 1"] --> B1["Model's natural probability distribution"]
    B1 --> B2["Balanced, natural-sounding output"]

    C["High Temperature (greater than 1)"] --> C1["Flattened distribution: weak candidates get real weight"]
    C1 --> C2["Varied, creative, but riskier / less coherent output"]
```

**Caption:** The same underlying probabilities can produce very different-feeling output purely by adjusting temperature — no change to the model's actual knowledge is involved, only how boldly it's willing to pick from its own ranked guesses.

## 4. Static vs. Contextual Embedding Lifecycle

```mermaid
flowchart TD
    subgraph Static ["Static Embedding (Word2Vec / GloVe)"]
        S1["Word: 'bank'"] --> S2["One fixed vector, trained once, reused forever"]
    end

    subgraph Contextual ["Contextual Embedding (Transformer)"]
        C1["Word: 'bank' in Sentence A (river)"] --> C2[Self-attention over full sentence A]
        C2 --> C3["Vector A: river sense"]
        C4["Word: 'bank' in Sentence B (money)"] --> C5[Self-attention over full sentence B]
        C5 --> C6["Vector B: financial sense"]
    end
```

**Caption:** Static embeddings hand out the same "dictionary card" every time a word appears; contextual embeddings recompute a fresh, sentence-specific vector every time, which is how modern models resolve ambiguous words like "bank."

## 5. How Hallucination Happens vs. How It's Mitigated

```mermaid
flowchart TD
    A[User question] --> B{Strong, consistent training signal on this topic?}
    B -- Yes --> C[Prediction aligns with real facts]
    C --> D[Accurate answer]
    B -- No / sparse / ambiguous --> E[Model still predicts plausible-sounding tokens]
    E --> F[Confident but wrong or fabricated answer]
    F --> G{Mitigation in place?}
    G -- "RAG: real documents added to context" --> H[Answer grounded in provided source text]
    G -- "No mitigation" --> I[Hallucination trusted and propagated]
```

**Caption:** Hallucination isn't a random glitch — it's the predictable result of asking a pattern-matching system for facts it has weak or no signal on. Retrieval-Augmented Generation (RAG) and independent verification are the two most effective everyday mitigations.
