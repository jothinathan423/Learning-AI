# Week 1 Revision — Foundations: How a Language Model Actually Works

## 5-Minute Revision

A language model is a next-token predictor: it reads text, predicts the single most likely next chunk (token), appends it, and repeats — that iterative loop, run through a Transformer neural network, is the entire mechanism behind ChatGPT, Claude, and every similar tool. It has no fact database and no built-in search — it generates fluent, plausible-sounding text based on statistical patterns learned from training data, which is exactly why it can produce **hallucinations**: confident, fluent answers that are factually wrong, because sounding right and being right are different things to a system that only ever predicts likely-sounding continuations.

- Tokens are word-pieces (≈¾ of a word each) — you pay per token, for both input and output, with output priced higher.
- The context window is the fixed token budget for a single request — no memory persists beyond it unless explicitly re-injected.
- Words become numeric vectors (embeddings) so the model can compute with meaning; static embeddings (Word2Vec, GloVe) give one fixed vector per word, while modern Transformers use contextual embeddings that change per sentence, resolving ambiguity static methods can't.
- Temperature, top-k, and top-p control how a token gets picked from the model's predicted probabilities — low temperature/tight filters give consistent output, high settings give varied, creative output; none of this affects factual accuracy.
- Greedy decoding always takes the top choice (deterministic); sampled decoding draws randomly by probability (varied); beam search tracks multiple paths to avoid greedy's short-sightedness.
- GPT, Claude, and LLaMA are all Transformer-based decoder-only models, differing mainly in access model (closed API vs. open-weight) and alignment approach — while encoder-only models like BERT are built for understanding, not generation.
- Mitigating hallucination means grounding answers in real retrieved documents (RAG) and independently verifying anything high-stakes — it's a structural limitation to manage, not a bug to patch away.

## 15-Minute Revision

**Language Models** — A language model estimates `P(next_token | previous_tokens)` using a Transformer neural network trained in stages: pre-training (raw next-token prediction over huge text), instruction-tuning (learn to act like a helpful assistant), and alignment (e.g. RLHF, tuning toward human-preferred answers). Generation loops one token at a time: tokenize → embed → attend (self-attention across all prior tokens) → predict next-token probabilities → decode → repeat until a stop token or length limit.

**Tokens and Tokenization** — Tokens are produced by subword algorithms like Byte-Pair Encoding (BPE) or SentencePiece, built by merging frequent character/subword pairs from a huge corpus into a fixed vocabulary (often 30K-200K entries). Common words = 1 token; rare words = several fragments. Rough estimate: 1 token ≈ 4 characters ≈ ¾ of an English word. Each model family (GPT, Claude, LLaMA) uses its own tokenizer, so identical text produces different token counts across providers.

**Cost Per Token** — APIs bill per token, split into input and output rates, with output typically priced 3-5x higher because it's generated sequentially, one token at a time. Multi-turn conversations resend the entire prior history each turn, so cost compounds as conversations grow. Prompt/context caching discounts repeated large context (like a fixed system prompt). The biggest cost lever: matching the cheapest capable model to each task rather than defaulting to the flagship model everywhere.

**Context Window** — The maximum tokens (system prompt + history + new input + reserved output space) a model can process in one request. Exceeding it forces truncation, summarization, or rejection of the oldest content. Modern flagship models have grown context windows from ~4K-8K tokens to 128K-1M+ tokens, but very long contexts can suffer "lost in the middle" — uneven attention where content buried deep in a long input gets under-used even though it's technically visible.

**Word Embeddings (Word2Vec, GloVe)** — Both convert words into fixed vectors based on the distributional hypothesis (words in similar contexts have similar meanings). Word2Vec is predictive — trains a shallow network to predict context from a word (or vice versa) and keeps the learned weights as embeddings. GloVe is count-based — factorizes a global word co-occurrence matrix directly. Both are **static**: one word = one vector, forever, regardless of sentence.

**Static vs Contextual Embeddings** — Static embeddings (Word2Vec, GloVe) can't distinguish word senses (e.g. "bank" river vs. money) since there's only one vector per word. Contextual embeddings, produced by Transformer self-attention layers, compute a fresh vector for every occurrence based on surrounding text, resolving ambiguity — this is one of the key architectural upgrades behind modern LLMs' language understanding.

**Temperature and Sampling (Top-p, Top-k)** — Temperature divides raw logits before softmax, sharpening (low) or flattening (high) the resulting probability distribution. Top-k keeps a fixed number of top candidates; top-p (nucleus sampling) adaptively keeps the smallest set of candidates whose cumulative probability reaches a threshold. Low temperature/tight filters suit factual/code tasks; higher settings suit creative tasks. None of this changes the model's underlying knowledge.

**Greedy vs Sampled Decoding** — Greedy decoding always takes `argmax(probabilities)` — deterministic but only locally optimal, sometimes producing repetitive or blander text. Sampled decoding draws randomly weighted by probability — naturally varied but less predictable. Beam search tracks the top-N candidate sequences simultaneously, trading extra compute for potentially better overall sequences; common in translation, less common in open-ended chat.

**Model Families (GPT, Claude, LLaMA)** — All are Transformer-based, next-token-prediction models at the core; they differ in training data, alignment technique (e.g. Anthropic's Constitutional AI vs. standard RLHF), and access model. GPT (OpenAI) and Claude (Anthropic) are closed API/product-accessed; LLaMA (Meta) is open-weight, downloadable, and self-hostable, trading centralized control/convenience for flexibility and infrastructure ownership.

**Decoder vs Encoder Models** — Encoder-only models (BERT) use full bidirectional attention, trained via masked-language-modeling, excellent for understanding/classification but not built for generation. Decoder-only models (GPT, Claude, LLaMA) use causal (backward-only) attention enforced by a causal mask, matching autoregressive generation exactly — this is why nearly all modern chat assistants are decoder-only. Encoder-decoder models (T5) combine a bidirectional encoder with a causal decoder plus cross-attention, suited to translation/summarization-style transformation tasks.

**Hallucination** — A structural consequence of generative prediction: the model produces the most statistically plausible continuation, which usually matches truth but can diverge for rare, recent, ambiguous, or highly specific information (exact numbers, citations). Confident tone is a learned writing style, unrelated to actual accuracy — this is why hallucinated content is so easy to mistakenly trust. Mitigations: RAG (ground answers in real retrieved documents), better alignment/calibration training, careful unambiguous prompting, and mandatory independent verification for high-stakes facts.

## Last-Minute Interview Revision

- **"How does a language model actually generate text?"** — It predicts a probability distribution over the next token given everything before it, picks one (via a decoding strategy), appends it, and repeats the entire process for every subsequent token, until a stop condition is hit. There's no separate "thinking" step outside this loop.

- **"Why do LLMs hallucinate?"** — Because they're trained to produce statistically plausible continuations, not verified facts. When training signal on a topic is sparse, ambiguous, or contradictory, the model still must output *something*, and it does so in the same confident tone it uses for topics it "knows" well — so confidence and correctness are decoupled. Mention RAG as the standard production mitigation.

- **"What's the difference between temperature and top-p?"** — Temperature reshapes how sharply weighted the existing candidate probabilities are; top-p decides which candidates are even eligible before that reshaping/sampling happens. They're complementary controls, not the same lever.

- **"Explain the difference between encoder-only, decoder-only, and encoder-decoder models."** — It comes down to the attention mask: encoder-only is fully bidirectional (understanding tasks, e.g. BERT), decoder-only is causal/backward-only (generation tasks, e.g. GPT/Claude/LLaMA), encoder-decoder combines both with cross-attention (transformation tasks, e.g. T5, translation).

- **"Why does token count matter for cost and context limits?"** — Because virtually all commercial LLM APIs bill per token (input and output separately, output priced higher) and every model has a hard maximum token budget per request (the context window) — both cost and functional limits are governed by tokens, not words or requests.

- **"What's the practical difference between GPT, Claude, and LLaMA?"** — Same core Transformer/next-token-prediction architecture; differ in training/alignment approach and, critically, access model — GPT and Claude are closed APIs, LLaMA is open-weight and self-hostable. Be ready to connect this to a real trade-off: convenience/managed safety vs. control/customization/data-privacy.

- **"How would you reduce hallucination in a production system?"** — Ground answers with Retrieval-Augmented Generation (fetch verified documents into context), lower temperature for factual tasks, prompt for citations/reasoning, and add a human or automated verification step for high-stakes outputs — while acknowledging no current technique eliminates hallucination entirely.

- **"What's a token, precisely, and why isn't it just a word?"** — A token is a vocabulary entry produced by a subword tokenizer (e.g. BPE); common words are one token, rarer or longer words split into multiple tokens/fragments. This subword approach lets the model handle any word, typo, or language without an "unknown word" failure, at the cost of some odd splitting behavior (e.g. with numbers).
