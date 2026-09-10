# Week 1 — FAQs and Memory Tricks

## Frequently Asked Questions

**Q1: If a language model is "just" predicting the next word, how can it write such coherent, long answers?**
Coherence emerges from scale and context. At every step, the model considers the *entire* conversation so far (within its context window) and has learned, from enormous amounts of training text, extremely rich patterns of what tends to follow what. Predicting one token at a time, informed by that much context and pattern knowledge, is enough to produce fluent, structured, multi-paragraph answers — even though there's no separate "planning" step happening explicitly.

**Q2: Why can't the model just say "I don't know" when it's unsure?**
It can, and well-aligned models are trained to do this more often — but the model has no built-in, reliable "confidence meter" wired directly into token generation by default. Its training rewards producing fluent, helpful-sounding answers, and separating "I have strong evidence" from "I'm guessing" is a hard, still-imperfect problem (see calibration in the Hallucination topic).

**Q3: Does a bigger context window mean the model has better memory?**
It means the model can *see* more text in a single request, not that it remembers past conversations after they end. Also, very long contexts can suffer from the "lost in the middle" effect, where information buried deep in a long input gets less attention than content near the start or end.

**Q4: Why does the same prompt sometimes give different answers?**
Unless temperature is set to 0 (or the API defaults to greedy/deterministic behavior), the model is using sampled decoding — randomly drawing from a weighted probability distribution at each step. This is a deliberate design choice for natural variety, not a bug.

**Q5: Is a token the same as a word?**
No. A token is often a word-piece — common words are usually one token, but longer, rarer, or non-English words are frequently split into multiple tokens. As a rough estimate, 1 token ≈ ¾ of an English word.

**Q6: Why is output more expensive than input in API pricing?**
Output tokens are generated one at a time through the full model computation, sequentially, which is more computationally expensive per token than processing input tokens (which can be handled more in parallel). Providers pass this cost difference on directly.

**Q7: What's the actual difference between GPT, Claude, and LLaMA?**
They're all Transformer-based, next-token-prediction language models at their core, but differ in training data, alignment approach, and — importantly — access model: GPT (OpenAI) and Claude (Anthropic) are closed, API/product-accessed; LLaMA (Meta) is released as open, downloadable weights you can self-host.

**Q8: Why can't BERT chat like ChatGPT?**
BERT is an encoder-only model, trained with bidirectional attention on a masked-word-prediction objective — it's built to deeply *understand* fixed text, not to generate new text one token at a time. ChatGPT and Claude are decoder-only models, trained with causal (backward-only) attention specifically to predict what comes next — the skill generation actually requires.

**Q9: Does using RAG (Retrieval-Augmented Generation) completely eliminate hallucination?**
No. RAG significantly reduces hallucination by grounding answers in real, retrieved documents, but the model can still misread, misquote, or fabricate details even from real provided sources. It's a strong mitigation, not a guarantee.

**Q10: What's the actual difference between temperature and top-p?**
Temperature reshapes *how sharply weighted* the existing candidates are (sharpening toward the top choice or flattening toward more variety). Top-p instead decides *which candidates are even eligible* by cutting off the list once cumulative probability reaches a threshold. They're often used together: top-p narrows the field, temperature decides how evenly to weigh what's left.

**Q11: Why do non-English languages sometimes cost more or behave worse?**
Tokenizer vocabularies are built from training data that's often English-dominant, so non-English text — especially non-Latin scripts — frequently splits into more tokens per word than English does, increasing both cost and context-window usage for the same amount of meaning.

**Q12: If greedy decoding always picks the "best" token, why isn't it always used?**
Greedy decoding is only locally optimal — the best token at each individual step doesn't guarantee the best overall sentence, and it can also produce repetitive or bland text. Sampled decoding (and beam search, for structured tasks) exist precisely to avoid this short-sightedness.

## Memory Tricks and Mnemonics

- **"Predict, don't retrieve"** — the one-line reminder for what a language model fundamentally does. If you remember nothing else this week, remember this.
- **T-O-K-E-N = "The Original Kernel — Every Number"** — tokens are the atomic numeric unit everything (cost, limits, generation) is built from.
- **"Hot models are creative, cold models are consistent"** — temperature: low = cold = safe/predictable; high = hot = varied/creative.
- **Top-K = Karat count (fixed number), Top-P = Percentage of the pie (adaptive)** — top-k always keeps a fixed count of candidates; top-p keeps however many candidates it takes to reach a percentage of total probability.
- **"Greedy grabs the first shiny thing"** — greedy decoding always grabs the single top-ranked token immediately, without looking further ahead.
- **"BERT reads, GPT writes"** — encoder-only (BERT) is for understanding/reading tasks; decoder-only (GPT/Claude/LLaMA) is for generating/writing tasks.
- **"Closed doors, open code"** — GPT and Claude are closed-API "doors" you access but can't look behind; LLaMA is "open code" you can download and inspect yourself.
- **"Confident ≠ Correct"** — the single most important sentence to remember about hallucination.
- **"Static = one card forever, Contextual = a new card every sentence"** — for remembering the embeddings distinction.

## Bullet-Point Revision List

- A language model predicts the next token repeatedly — that's the entire generation mechanism.
- Tokens are word-pieces, not words; ~1 token ≈ ¾ of a word in English.
- You pay per token for both input and output; output is priced higher.
- The context window is the fixed token budget for one request — no memory exists beyond it unless re-injected.
- Embeddings turn words into vectors; static embeddings (Word2Vec, GloVe) give one vector per word, contextual embeddings (Transformers) give a fresh vector per occurrence.
- Temperature, top-k, and top-p control how the next token is chosen from predicted probabilities — they shape style and variety, not factual accuracy.
- Greedy decoding is deterministic and locally optimal; sampled decoding is varied and non-deterministic; beam search tracks multiple candidate paths.
- GPT, Claude, and LLaMA are all Transformer-based but differ in access model (closed API vs. open-weight) and alignment approach.
- Encoder-only models understand, decoder-only models generate, encoder-decoder models transform input into output.
- Hallucination is confident, fabricated output — a structural consequence of statistical prediction, mitigated (not solved) by RAG and verification.
