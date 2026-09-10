# Week 1 — Key Definitions and Tables

Fast-reference companion to the Week 1 topic files. Terms, one-line meanings, and the numbers/tables worth memorizing. Not a repeat of the topic prose — use this for quick lookups and revision.

## Core Definitions

| Term | One-line meaning |
|---|---|
| **Language model** | A program that predicts the next token repeatedly to generate text |
| **Token** | The basic chunk of text a model reads/writes — often a word-piece, not a whole word |
| **Tokenization** | The process of splitting text into tokens (and back) using a fixed vocabulary |
| **Context window** | The maximum tokens (input + output combined) a model can process in one request |
| **Embedding** | A numeric vector representation of a token/word that captures meaning |
| **Static embedding** | One fixed vector per word regardless of context (Word2Vec, GloVe) |
| **Contextual embedding** | A vector recomputed per occurrence, shaped by surrounding text (Transformers) |
| **Temperature** | A setting that sharpens (low) or flattens (high) the next-token probability distribution |
| **Top-k sampling** | Restrict next-token choice to the k most likely candidates |
| **Top-p (nucleus) sampling** | Restrict next-token choice to the smallest set of candidates whose probabilities sum to p |
| **Greedy decoding** | Always pick the single highest-probability next token; deterministic |
| **Sampled decoding** | Randomly draw the next token weighted by probability; non-deterministic |
| **Beam search** | Track multiple candidate sequences at once to avoid greedy's short-sightedness |
| **Model family** | A line of models from one organization (GPT, Claude, LLaMA) sharing lineage |
| **Open-weight model** | A model whose trained parameters are downloadable/self-hostable (e.g. LLaMA) |
| **Closed API model** | A model only accessible via a provider's hosted API/product (e.g. GPT, Claude) |
| **Encoder-only model** | Bidirectional attention; built for understanding/classification (e.g. BERT) |
| **Decoder-only model** | Causal (backward-only) attention; built for generation (e.g. GPT, Claude, LLaMA) |
| **Encoder-decoder model** | Bidirectional encoder + causal decoder; built for input→output transformation (e.g. T5) |
| **Hallucination** | Fluent, confident model output that is factually wrong or fabricated |
| **RAG (Retrieval-Augmented Generation)** | Fetching real documents into the prompt to ground answers and reduce hallucination |
| **RLHF** | Reinforcement Learning from Human Feedback — an alignment technique tuning models toward human-preferred answers |
| **Distributional hypothesis** | The idea that words appearing in similar contexts have similar meanings — basis of embeddings |

## Key Numbers to Remember

| Fact | Approximate value |
|---|---|
| Token-to-character ratio (English) | ~1 token ≈ 4 characters |
| Token-to-word ratio (English) | ~1 token ≈ ¾ of a word |
| Words per 1,000 tokens | ~750 words |
| Typical output pricing vs. input pricing | Output usually 3-5x more expensive than input |
| Older/small model context window | ~4,000–8,000 tokens |
| Modern flagship model context window | ~128,000–1,000,000+ tokens |
| Temperature = 0 | Effectively greedy decoding (always top token) |
| Temperature = 1 | Model's raw predicted probability distribution, unmodified |
| Temperature > 1 | Flattened distribution — more randomness/creativity, more risk |
| Common vocabulary size (tokenizer) | ~30,000–200,000 tokens |

## Model Family Comparison

| Family | Developer | Access | Notable trait |
|---|---|---|---|
| GPT | OpenAI | Closed API / ChatGPT | Broad ecosystem, multimodal, plugins/tools |
| Claude | Anthropic | Closed API / claude.ai | Safety focus (Constitutional AI), long context |
| LLaMA | Meta | Open-weight | Downloadable, self-hostable, fine-tunable |

## Architecture Type Comparison

| Type | Attention | Example | Best for |
|---|---|---|---|
| Encoder-only | Bidirectional | BERT | Classification, search, NER |
| Decoder-only | Causal (backward-only) | GPT, Claude, LLaMA | Chat, generation, code, reasoning |
| Encoder-decoder | Bidirectional in, causal out | T5 | Translation, summarization |

## Sampling Settings Quick Reference

| Setting | Controls | Low value effect | High value effect |
|---|---|---|---|
| Temperature | Sharpness of probability distribution | Predictable, focused, repeatable | Varied, creative, riskier |
| Top-k | Fixed candidate pool size | Very restrictive (fewer options) | More options allowed |
| Top-p | Adaptive candidate pool by cumulative probability | Narrow, confident-only choices | Wider pool, more variety |

## Embedding Method Comparison

| Method | Type | Learns from |
|---|---|---|
| Word2Vec | Static, predictive | Predicting context words from a center word (or vice versa) |
| GloVe | Static, count-based | Global word co-occurrence matrix factorization |
| Transformer embeddings | Contextual | Self-attention across the full input sequence |

## Word2Vec / GloVe / Word Embedding Formula Reminder

```
vector("king") - vector("man") + vector("woman") ≈ vector("queen")
```

## Decoding Formula Reminder

```
adjusted_logit = raw_logit / temperature
probability = softmax(adjusted_logit)
```
