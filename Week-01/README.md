# Week 1 — Foundations: How a Language Model Actually Works

Before building anything with AI, you need an accurate mental model of what a language model actually is and how it behaves. This week is entirely **theory — no coding**. By the end of it, you'll understand how AI tools like ChatGPT and Claude produce their answers one token at a time, why they can sound completely confident while being completely wrong, and what it actually costs to use them in a real product. Everything else in this course — prompting, building agents, fine-tuning, evaluation — rests on the ideas covered here.

- **Estimated reading time:** ~106 minutes (~1.75 hours) across all topics, notes, and revision material
- **Difficulty level:** Beginner
- **Prerequisites:** None — this is Week 1, the starting point of the course

## What You'll Master After This Week

- Explaining, in plain language, what a language model is actually doing when it "answers" you (next-token prediction, not lookup).
- Understanding tokens well enough to reason about API cost and context limits before you build anything.
- Reading a pricing page and estimating what a feature will actually cost per request and at scale.
- Explaining why context windows exist, why long conversations degrade, and why "memory" isn't what it sounds like.
- Understanding how words become numbers (embeddings) and why modern models handle ambiguous words so much better than older NLP systems.
- Knowing what temperature, top-k, and top-p actually control, and picking sensible settings for a given task.
- Telling greedy decoding apart from sampled decoding, and knowing which one suits which situation.
- Recognizing the major model families (GPT, Claude, LLaMA) and the real differences between them.
- Distinguishing encoder-only, decoder-only, and encoder-decoder architectures and what each is built for.
- Explaining hallucination — why it happens, why it's not a "bug," and how to guard against it in practice.

## Topics Covered

1. [Language Models](./Topics/01-Language-Models.md)
2. [Tokens and Tokenization](./Topics/02-Tokens-And-Tokenization.md)
3. [Cost Per Token](./Topics/03-Cost-Per-Token.md)
4. [Context Window](./Topics/04-Context-Window.md)
5. [Word Embeddings (Word2Vec, GloVe)](./Topics/05-Word-Embeddings.md)
6. [Static vs Contextual Embeddings](./Topics/06-Static-Vs-Contextual-Embeddings.md)
7. [Temperature and Sampling (Top-p, Top-k)](./Topics/07-Temperature-And-Sampling.md)
8. [Greedy vs Sampled Decoding](./Topics/08-Greedy-Vs-Sampled-Decoding.md)
9. [Model Families (GPT, Claude, LLaMA)](./Topics/09-Model-Families.md)
10. [Decoder vs Encoder Models](./Topics/10-Decoder-Vs-Encoder-Models.md)
11. [Hallucination](./Topics/11-Hallucination.md)

## Companion Notes

- [Key Definitions and Tables](./Notes/Key-Definitions-And-Tables.md)
- [Diagrams and Workflows](./Notes/Diagrams-And-Workflows.md)
- [FAQs and Memory Tricks](./Notes/FAQs-And-Memory-Tricks.md)
- [Cheat Sheet](./CheatSheet.md)
- [Revision](./Revision.md)

## Reading Progress Checklist

- [ ] 01 — Language Models
- [ ] 02 — Tokens and Tokenization
- [ ] 03 — Cost Per Token
- [ ] 04 — Context Window
- [ ] 05 — Word Embeddings (Word2Vec, GloVe)
- [ ] 06 — Static vs Contextual Embeddings
- [ ] 07 — Temperature and Sampling (Top-p, Top-k)
- [ ] 08 — Greedy vs Sampled Decoding
- [ ] 09 — Model Families (GPT, Claude, LLaMA)
- [ ] 10 — Decoder vs Encoder Models
- [ ] 11 — Hallucination
- [ ] Review Cheat Sheet
- [ ] Complete Revision
