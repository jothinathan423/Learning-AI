---
title: "How Attention Works"
---

# How Attention Works

Self-attention is the mechanism that lets a transformer decide, for every token, *which other
tokens matter most* when building its contextual meaning. It does this using three learned
projections of each token's vector — a **Query**, a **Key**, and a **Value** — and a similarity
score between queries and keys that determines how much of each value gets blended in. The
diagrams below break down that mechanism step by step, then show how it's run many times in
parallel ("multi-head" attention).

## 1. The Q/K/V Flow for a Single Token

```mermaid
flowchart LR
    X["Token Embedding\n(+ position)"] --> WQ["× W_Q"] --> Q["Query vector"]
    X --> WK["× W_K"] --> K["Key vector"]
    X --> WV["× W_V"] --> V["Value vector"]

    Q --> DOT["Dot product with\nevery other token's Key"]
    K --> DOT
    DOT --> SCALE["Scale by √d_k"]
    SCALE --> SOFT["Softmax\n(turns scores into weights\nthat sum to 1)"]
    SOFT --> WSUM["Weighted sum of\nall tokens' Value vectors"]
    V --> WSUM
    WSUM --> OUT["Context-aware output\nfor this token"]
```

**What this shows:** every token produces three vectors from the same input using three
different learned weight matrices (`W_Q`, `W_K`, `W_V`). Its Query is compared against every
token's Key to produce a similarity score; those scores are scaled, passed through softmax to
become weights, and used to blend every token's Value into this token's new output. Intuitively:
"Query = what am I looking for, Key = what do I contain, Value = what do I actually contribute
if picked."

## 2. Attention Scores Across a Whole Sentence

```mermaid
flowchart TD
    subgraph Sentence["'The animal didn't cross the street because it was tired'"]
        T1["The"]
        T2["animal"]
        T3["didn't"]
        T4["cross"]
        T5["the"]
        T6["street"]
        T7["because"]
        T8["it"]
        T9["was"]
        T10["tired"]
    end
    T8 -.->|"high attention\nweight ~0.7"| T2
    T8 -.->|"low attention\nweight ~0.05"| T6
    T8 -.->|"low attention\nweight ~0.05"| T10
```

**What this shows:** when computing the contextual meaning of the word "it", attention assigns
a much higher weight to "animal" than to "street" — resolving the pronoun's referent. This is
the core payoff of attention: it lets the model dynamically route information from the
*relevant* tokens regardless of how far apart they sit in the sequence, something fixed-window
or purely sequential models struggle with.

## 3. Multi-Head Attention: Running It in Parallel

```mermaid
flowchart TD
    X["Input token vectors"] --> H1["Head 1\n(own Q/K/V projections)\ne.g. tracks syntax"]
    X --> H2["Head 2\n(own Q/K/V projections)\ne.g. tracks coreference"]
    X --> H3["Head 3\n(own Q/K/V projections)\ne.g. tracks topic/theme"]
    X --> Hn["... Head N ..."]

    H1 --> CAT["Concatenate all\nhead outputs"]
    H2 --> CAT
    H3 --> CAT
    Hn --> CAT
    CAT --> WO["× W_O\n(learned output projection)"]
    WO --> OUT["Final multi-head\nattention output"]
```

**What this shows:** rather than computing attention once, the model splits the embedding into
several smaller "heads" and runs the whole Q/K/V process independently in each — each head is
free to specialize in a different kind of relationship (syntax, coreference, long-range topic
association, etc.). The heads' outputs are concatenated and projected back to the original
dimension, giving the model several simultaneous "views" of the same sequence instead of one.

## Key Insight

Attention replaces fixed rules for "what to look at" with a learned, per-token, per-context
weighting scheme — every token dynamically decides how much of every other token to absorb.
Multi-head attention multiplies this further by giving the model several independent
relationship-tracking subspaces at once, which is a large part of why transformers capture
long-range dependencies and subtle relationships that earlier architectures missed.
