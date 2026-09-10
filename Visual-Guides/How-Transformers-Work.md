---
title: "How Transformers Work"
---

# How Transformers Work

The transformer is the architecture behind essentially every modern LLM (GPT, Claude, Llama,
Gemini). Instead of processing text one word at a time in sequence (like older RNNs), a
transformer looks at an entire sequence of tokens at once and lets every token "attend to"
every other token in parallel. That single design choice — parallel, attention-driven
processing instead of sequential, memory-driven processing — is what made today's large-scale
language models trainable and scalable. The diagrams below walk through the architecture from
raw input to final output.

## 1. The End-to-End Architecture

```mermaid
flowchart TD
    A["Input Text\n'The cat sat down'"] --> B["Tokenization\n(text → token IDs)"]
    B --> C["Input Embedding\n(token ID → vector)"]
    C --> D["+ Positional Encoding\n(inject order/position info)"]
    D --> E["Transformer Block ×N"]

    subgraph E["Transformer Block (repeated N times)"]
        direction TB
        E1["Multi-Head Self-Attention"] --> E2["Add & Normalize\n(residual connection)"]
        E2 --> E3["Feed-Forward Network"]
        E3 --> E4["Add & Normalize\n(residual connection)"]
    end

    E --> F["Final Linear Layer"]
    F --> G["Softmax over Vocabulary"]
    G --> H["Output: Next-Token\nProbability Distribution"]
```

**What this shows:** the full pass of a token sequence through a transformer — embed, add
position information, pass through a stack of identical blocks (attention + feed-forward, each
wrapped in a residual "add & normalize" step), then project to a probability over the entire
vocabulary for the next token. Everything inside the `Transformer Block` is repeated N times
(e.g. 32, 96+ layers in large models), each layer refining the representation further.

## 2. Why Positional Encoding Is Needed

```mermaid
flowchart LR
    subgraph NoPos["Without Position Info"]
        direction LR
        W1["'dog'"] --- W2["'bites'"] --- W3["'man'"]
        note1["Attention sees these as an\nunordered SET of vectors —\n'dog bites man' looks identical\nto 'man bites dog'"]
    end
    subgraph WithPos["With Position Info"]
        direction LR
        X1["'dog' + pos(1)"] --- X2["'bites' + pos(2)"] --- X3["'man' + pos(3)"]
        note2["Each token's vector now encodes\nWHERE it sits in the sequence —\nword order is preserved"]
    end
```

**What this shows:** self-attention on its own has no built-in sense of order — it treats
input as a set, not a sequence. Positional encoding (fixed sinusoidal patterns in the original
paper, or learned/rotary variants in modern models) is added to each token embedding so the
model can tell "dog bites man" apart from "man bites dog".

## 3. One Transformer Block, Zoomed In

```mermaid
flowchart TD
    IN["Input: sequence of vectors\n(one per token)"] --> ATT["Multi-Head Self-Attention\n(each token gathers context\nfrom every other token)"]
    IN -->|residual skip| ADD1["Add"]
    ATT --> ADD1
    ADD1 --> NORM1["Layer Norm"]
    NORM1 --> FFN["Feed-Forward Network\n(same 2-layer MLP applied\nindependently to each token)"]
    NORM1 -->|residual skip| ADD2["Add"]
    FFN --> ADD2
    ADD2 --> NORM2["Layer Norm"]
    NORM2 --> OUT["Output: sequence of vectors\n(refined, context-aware)"]
```

**What this shows:** inside a single block, attention mixes information *across* tokens (each
token gathers relevant context from the rest of the sequence), while the feed-forward network
processes *each token independently*, adding non-linear transformation capacity. The residual
("skip") connections and layer normalization around both sub-layers are what make it possible
to stack dozens of these blocks without training becoming unstable.

## 4. Stacking Blocks Deepens Understanding

```mermaid
flowchart BT
    L0["Embeddings + Position\n(raw token identity)"] --> L1["Block 1\n(local word relationships)"]
    L1 --> L2["Block 2\n(phrase-level patterns)"]
    L2 --> L3["Block 3\n(clause/sentence structure)"]
    L3 --> Ldots["... more blocks ..."]
    Ldots --> LN["Block N\n(abstract, task-relevant meaning)"]
    LN --> OUT["Final representation used\nfor next-token prediction"]
```

**What this shows:** no single layer "understands" language — meaning emerges from stacking
many identical blocks, where each layer builds a progressively more abstract representation on
top of the last. Early layers tend to capture surface patterns (syntax, local word
relationships); deeper layers capture more abstract, task-relevant structure.

## Key Insight

A transformer has no memory and no recurrence — every token sees every other token
simultaneously through attention, and depth (stacked blocks) rather than sequence-by-sequence
recurrence is what builds up understanding. This parallelism is exactly what makes transformers
efficient to train on modern hardware (GPUs/TPUs), which is the practical reason they replaced
RNNs and LSTMs as the default architecture for language modeling.
