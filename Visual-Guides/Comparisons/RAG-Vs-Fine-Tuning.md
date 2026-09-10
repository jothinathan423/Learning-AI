---
title: "RAG vs Fine-Tuning"
---

# RAG vs Fine-Tuning

RAG and fine-tuning are the two most common ways to make a general-purpose LLM better at a
specific task or knowledge domain — but they solve different problems and are frequently
confused as interchangeable. RAG changes *what the model is given at answer time*; fine-tuning
changes *the model's own weights*. They're not mutually exclusive, and many production systems
use both.

## Comparison

| Dimension | RAG | Fine-Tuning |
|---|---|---|
| **What changes** | Nothing about the model — retrieval supplies fresh context at query time | The model's weights themselves are updated through further training |
| **Best for** | Injecting up-to-date or proprietary *knowledge/facts* | Teaching a *style, format, behavior, or skill* |
| **Update speed** | Near-instant — re-ingest new/changed documents | Slow — requires a new training + evaluation cycle |
| **Cost to update** | Low — mostly embedding + indexing cost | Higher — training compute, plus curated data prep |
| **Traceability / citations** | Strong — answers can cite the exact retrieved source | Weak — knowledge is baked into weights with no natural citation trail |
| **Handles knowledge outside training cutoff** | Yes — that's its core purpose | No, unless retrained on newer data |
| **Risk of hallucination** | Reduced (answer is grounded in retrieved text), but not eliminated | Can still hallucinate; fine-tuning doesn't inherently fix factual grounding |
| **Infrastructure needed** | Vector database, chunking/embedding pipeline, retrieval logic | Training pipeline, curated dataset, evaluation harness, model hosting for the fine-tuned model |
| **Changes model's "voice"/behavior** | Limited — mostly changes what content it has access to | Yes — well-suited to changing tone, output format, domain-specific reasoning patterns |
| **Failure mode when the source is wrong** | Directly traceable — bad retrieval or bad source document | Harder to trace — a bad training example is baked in and diffused across many predictions |

## When to Choose Which

Reach for **RAG** when the problem is "the model doesn't know this specific fact/document" —
proprietary knowledge bases, frequently changing information, anything requiring source
citations, or anything where you need to add/remove knowledge without retraining.

Reach for **fine-tuning** when the problem is "the model knows enough but behaves/responds the
wrong way" — needing a very specific output format, domain-specific tone or terminology,
following a specialized reasoning pattern, or reducing reliance on long, repeated
few-shot-example prompts.

Many mature systems use **both**: fine-tune the model to reliably use retrieved context in the
right format and tone, while RAG continues to supply the actual facts. Treat them as
complementary levers, not competing choices.
