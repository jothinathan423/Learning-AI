---
title: "LLM Theory Interview Notes"
---

# LLM Theory Interview Notes

Tokens, context windows, sampling, and the mechanics of how large language models actually generate text — the questions interviewers use to check you understand what an LLM is beyond "a chatbot."

## Questions & Answers

### Q1. What is a token, and why do LLMs use tokens instead of whole words or raw characters?
**Expected answer:**
- A **token** is the basic unit of text an LLM processes — commonly a whole short word, part of a longer word, a punctuation mark, or a space-prefixed word fragment, depending on the tokenizer's vocabulary.
- Character-level tokenization would make sequences extremely long (slow, expensive) and would force the model to learn spelling and word structure from scratch. Whole-word tokenization would need an enormous vocabulary and can't handle unseen/rare words, typos, or new terms.
- Subword tokenization (e.g., **Byte-Pair Encoding**) is the middle ground: common words become single tokens, rare/complex words get split into meaningful pieces, and the vocabulary stays a manageable size (typically 50,000–200,000 tokens) while still being able to represent any input, even unseen words, by falling back to smaller pieces.

### Q2. How does Byte-Pair Encoding (BPE) style tokenization actually work?
**Expected answer:**
- It starts with a base vocabulary (often individual bytes/characters) and iteratively merges the most frequently co-occurring pair of tokens into a new single token, repeating this thousands of times to build up a fixed-size vocabulary of common subwords.
- The result: frequent words end up as single tokens; rare or unfamiliar words get split into 2+ subword tokens.
- This means token count doesn't map 1:1 to word count — a rough rule of thumb in English is about 4 characters or ¾ of a word per token, but this varies a lot by language (many non-English languages tokenize less efficiently, using more tokens per word).

### Q3. What is the context window, and what happens when you exceed it?
**Expected answer:**
- The **context window** is the maximum number of tokens (input + output combined, in most APIs) a model can process in a single call — it's the model's entire "working memory" for that request; nothing outside it exists to the model.
- If input exceeds the context window, it either gets rejected outright or silently truncated depending on the API/client, which can drop critical information (often from the middle or the start, depending on truncation strategy).
- A larger context window doesn't mean the model uses all of it equally well — many models show a "lost in the middle" effect, attending more reliably to content near the start and end of a long context than to content buried in the middle.
- Context window size directly drives cost and latency: doubling the input tokens roughly doubles the compute for that pass.

### Q4. What is temperature, and how does it affect generation?
**Expected answer:**
- Temperature is a parameter that scales the probability distribution over next tokens before sampling. It doesn't change which tokens are possible — it changes how "peaked" or "flat" their relative probabilities are.
- **Low temperature (near 0)** sharpens the distribution toward the single most likely token — output becomes more deterministic, focused, and repetitive-safe. Good for factual Q&A, code generation, extraction tasks.
- **High temperature (e.g., 0.8–1+)** flattens the distribution, giving lower-probability tokens a real chance of being picked — output becomes more varied and creative, but also more prone to going off-track or hallucinating.
- Temperature 0 is not truly "no randomness" on every system (implementation details vary), but conceptually it means "always pick the most likely token" (greedy decoding).

### Q5. What's the difference between top-k and top-p (nucleus) sampling?
**Expected answer:**
- **Top-k sampling** restricts the model to sampling only from the k highest-probability next tokens, discarding the rest, then samples according to their (renormalized) probabilities.
- **Top-p (nucleus) sampling** instead selects the smallest set of tokens whose cumulative probability exceeds a threshold p (e.g., 0.9), so the set size varies dynamically — when the model is very confident, the set is small; when it's uncertain, the set is larger.
- Top-p is generally preferred because it adapts to the model's confidence at each step, rather than always allowing a fixed number of candidates regardless of how uncertain the distribution actually is.
- Both are typically combined with temperature, and often used together (e.g., top-p plus a moderate temperature) rather than in isolation.

### Q6. What's the difference between greedy decoding, beam search, and sampling?
**Expected answer:**
- **Greedy decoding** always picks the single highest-probability next token at each step — fast and deterministic but can lead to repetitive or globally suboptimal text (a locally best choice isn't always the best overall sequence).
- **Beam search** keeps track of several (a "beam" of) candidate sequences at once, expanding each and keeping only the top-scoring overall sequences at each step — used more in traditional NLP tasks (translation) than in modern conversational LLMs, since it can produce bland, generic-sounding text and is expensive.
- **Sampling** (with temperature/top-k/top-p) introduces controlled randomness, picking a token probabilistically rather than deterministically — this is what most production chat LLMs use by default, because it produces more natural, varied text.

### Q7. What is hallucination, and why does it happen?
**Expected answer:**
- Hallucination is when a model generates text that is fluent and confident-sounding but factually incorrect or unsupported by any real source.
- Root cause: an LLM is trained to predict statistically likely next tokens, not to verify truth against a fact database — "sounds right" and "is right" are different skills that usually, but not always, coincide.
- It's more likely on: obscure/low-frequency facts, very specific numbers/citations/dates, questions past the training cutoff, and prompts that pressure the model into answering even when it lacks the information (models are trained to be helpful, which can bias them toward guessing rather than saying "I don't know").
- Mitigations: grounding the model with retrieved, verifiable context (RAG), asking for citations/sources, lowering temperature for factual tasks, explicit instructions permitting "I don't know," and independent verification of high-stakes claims.

### Q8. How do the major model families (GPT, Claude, Gemini, Llama, etc.) differ at a conceptual level?
**Expected answer:**
- All are Transformer-based, decoder-only, next-token-prediction language models at their core — the fundamental generation mechanism is the same across them.
- Differences are mostly in: training data composition and scale, architecture tweaks (attention variants, efficiency optimizations, mixture-of-experts in some models), context window size, fine-tuning/alignment approach (how helpfulness/safety behavior is shaped), and whether weights are open (Llama, Mistral) or closed/API-only (GPT, Claude, Gemini).
- Open-weight models can be downloaded, inspected, and fine-tuned/self-hosted by anyone; closed models are only accessible via API and their weights, training data, and exact architecture are typically not published.
- Differentiation increasingly comes from what's layered around the base model — tool use, retrieval integration, safety tuning, agentic capabilities — rather than the raw next-token mechanism itself.

### Q9. Does an LLM have memory of previous conversations?
**Expected answer:**
- Not inherently. The model itself is stateless between separate API calls — it only "knows" what's inside the current context window for that specific request.
- The illusion of memory across a conversation comes from the client application re-sending the entire prior conversation history as part of the context on each new turn.
- Persistent memory across separate sessions (remembering facts about you from last week) requires an explicit external system — storing facts, and retrieving/injecting relevant ones back into future prompts — the model itself has no built-in long-term storage.

### Q10. What is RLHF, and why is it needed on top of pretraining?
**Expected answer:**
- **RLHF (Reinforcement Learning from Human Feedback)** is a training stage where human raters compare/rank multiple model outputs for the same prompt, that preference data trains a reward model, and the base model is then further optimized (via reinforcement learning) to produce outputs the reward model scores highly.
- It's needed because pure next-token pretraining only teaches the model to imitate its training text's statistical patterns — it doesn't inherently teach the model to be a helpful, honest, safe assistant that follows instructions well or refuses harmful requests appropriately.
- RLHF (and related alignment techniques) is what turns a raw "predict the next token from internet text" model into something that reliably behaves like a cooperative assistant.

### Q11. Walk through the stages: pretraining → instruction-tuning → alignment. What does each do?
**Expected answer:**
- **Pretraining** — self-supervised next-token prediction over a massive, general text corpus; the model learns grammar, facts, reasoning patterns, and world knowledge purely by pattern-matching at scale. This stage is the most compute- and data-intensive.
- **Instruction-tuning (supervised fine-tuning)** — the pretrained model is further trained on curated examples of instructions paired with good responses, teaching it to act like a helpful assistant answering questions rather than just continuing arbitrary internet text.
- **Alignment (e.g., RLHF or similar preference-based methods)** — human (or AI) preference feedback further nudges the model's behavior toward being helpful, honest, and harmless, and away from behaviors humans rate poorly (refusing appropriately, avoiding harmful content, being appropriately calibrated).
- Each stage builds on the last; skipping later stages leaves a model that "completes text" well but doesn't reliably behave like an assistant.

### Q12. What are "emergent capabilities" in LLMs?
**Expected answer:**
- Emergent capabilities are abilities that appear (often somewhat abruptly) only once a model crosses a certain scale (parameters/data/compute), and are largely absent in smaller models trained the same way — examples often cited include few-shot in-context learning, multi-step arithmetic, and certain chain-of-thought reasoning benefits.
- They're notable because they weren't explicitly targeted during training — they arise as a side effect of scale plus the next-token objective.
- Caveat worth mentioning in an interview: some "emergence" claims are sensitive to which metric is used (sharp emergence can be an artifact of a discontinuous scoring metric rather than a true discontinuity in underlying capability) — it's an active area of debate, not settled fact.

### Q13. Why does response length affect cost and latency?
**Expected answer:**
- Generation is autoregressive: the model produces one token at a time, and producing each new token requires another full forward pass through the network conditioned on everything generated so far.
- More output tokens means more sequential forward passes, so latency scales roughly linearly with output length, and cost (billed per token in most APIs) scales with both input and output token counts.
- This is also why streaming responses (showing tokens as they're generated) improves perceived latency without changing total generation time — the user sees partial output immediately instead of waiting for the whole response.

### Q14. What is the difference between a system prompt and a user prompt?
**Expected answer:**
- The **system prompt** sets persistent, overarching instructions for the whole conversation — persona, tone, constraints, rules the model should follow regardless of what the user says (e.g., "You are a helpful support agent for Acme Corp; never discuss pricing for competitors").
- The **user prompt** is the actual per-turn input from the end user — the specific question or request being asked right now.
- Most model providers give the system prompt higher priority/authority in cases of conflict, which is part of how basic prompt injection defenses work — but this priority is a trained tendency, not an absolute guarantee, so system prompts alone aren't a complete security boundary.

### Q15. What's the difference between a model's "knowledge cutoff" and it being able to answer questions about recent events?
**Expected answer:**
- The **knowledge cutoff** is the date up to which the model's training data was collected — anything the model "knows" from training reflects the world as of that date, frozen into its parameters.
- Without external help, the model cannot know about anything after that date — it may guess, extrapolate, or (worse) hallucinate a plausible-sounding but wrong answer if asked about recent events.
- To answer questions about recent events accurately, the model needs live information injected into its context window at request time — via a web search tool, a retrieval system (RAG), or a user directly pasting the relevant text — the underlying model's frozen knowledge doesn't change; only what's temporarily added to its input does.
