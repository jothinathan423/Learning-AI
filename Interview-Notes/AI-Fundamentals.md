---
title: "AI Fundamentals Interview Notes"
---

# AI Fundamentals Interview Notes

Core AI/ML vocabulary and concepts that every other interview topic in this section assumes you already know cold.

## Questions & Answers

### Q1. What is the difference between AI, Machine Learning, and Deep Learning?
**Expected answer:**
- **AI (Artificial Intelligence)** is the broad goal: building systems that perform tasks normally requiring human intelligence (perception, decision-making, language).
- **Machine Learning (ML)** is a subset of AI: instead of hand-coding rules, the system learns patterns from data.
- **Deep Learning (DL)** is a subset of ML that uses multi-layered neural networks, especially effective on unstructured data (images, audio, text) where hand-engineered features don't work well.
- Relationship: AI ⊃ ML ⊃ DL. Every deep learning system is ML, and every ML system is an attempt at AI, but not all AI is ML (e.g., a rule-based expert system is AI but not ML), and not all ML is deep learning (e.g., linear regression, decision trees).

### Q2. What's the difference between supervised, unsupervised, and reinforcement learning?
**Expected answer:**
- **Supervised learning** — trained on labeled input-output pairs (e.g., email → spam/not spam). The model learns a mapping and is evaluated against known correct answers.
- **Unsupervised learning** — trained on unlabeled data, looking for structure (clustering, dimensionality reduction, anomaly detection). There's no "correct answer" to check against, only patterns.
- **Reinforcement learning (RL)** — an agent takes actions in an environment and learns from reward/penalty signals over time, optimizing for cumulative reward rather than matching a fixed label. RLHF (used to align LLMs) borrows this framework, treating human preference as the reward signal.
- Self-supervised learning (how LLMs are pretrained) is a hybrid: labels are automatically generated from the data itself (e.g., "predict the next token"), so no human labeling is required even though it behaves like supervised training mechanically.

### Q3. What does it mean for a model to "learn"? What are parameters?
**Expected answer:**
- A model is a mathematical function with adjustable numbers called **parameters** (or weights) — for a neural network, these are the connection strengths between artificial neurons.
- "Learning" means iteratively adjusting these parameters so the model's outputs get closer to desired outputs, measured by a **loss function**.
- The adjustment happens via **gradient descent**: compute how much each parameter contributed to the error (via backpropagation), then nudge each parameter slightly in the direction that reduces error, repeated over many examples and passes (epochs).
- Once training stops, the parameters are frozen — the learned patterns are baked into those numbers.

### Q4. What is the difference between training and inference?
**Expected answer:**
- **Training** is the (expensive, one-time or periodic) process of adjusting a model's parameters using data — requires forward passes, loss computation, backpropagation, and gradient updates. Needs large compute (GPUs/TPUs) and can take days to months for large models.
- **Inference** is using an already-trained, frozen model to produce outputs on new inputs — only a forward pass, no weight updates. This is what happens every time you send a prompt to a deployed model.
- Inference is far cheaper per call than training, but at scale (millions of requests/day) inference cost dominates total cost of ownership, not training.

### Q5. What makes large language models fundamentally different from traditional ML models?
**Expected answer:**
- **Traditional ML** (e.g., logistic regression, gradient-boosted trees) is usually trained for one narrow task on a specific labeled dataset, with hand-engineered or tabular features, and produces a fixed-purpose model (e.g., "predict churn").
- **LLMs** are trained once, generically, via self-supervised next-token prediction on massive unlabeled text corpora, and then can perform an enormous range of downstream tasks (writing, summarizing, coding, reasoning) without task-specific retraining — this generality is often called "foundation model" behavior.
- LLMs exhibit **emergent capabilities** at scale (e.g., few-shot learning, chain-of-thought reasoning) that were not explicitly trained for and don't appear in smaller models trained the same way.
- Traditional ML models are typically far smaller, faster, cheaper, and more interpretable — for a genuinely narrow, well-defined task with structured data, they're often still the better engineering choice.

### Q6. What is overfitting vs underfitting, and what is the bias-variance tradeoff?
**Expected answer:**
- **Underfitting** — the model is too simple to capture the underlying pattern; it performs poorly on both training and new data (high bias).
- **Overfitting** — the model memorizes noise/specifics of the training data rather than the general pattern; it performs great on training data but poorly on new, unseen data (high variance).
- The **bias-variance tradeoff**: simpler models have more bias (systematic error from oversimplifying) but less variance (they don't swing wildly with different training sets); complex models have less bias but more variance. Good generalization requires balancing the two, usually via regularization, more data, or cross-validation.

### Q7. Why do we need neural networks instead of simpler ML models?
**Expected answer:**
- Simpler models (linear/logistic regression, decision trees) require the input to already be in a form where the relationship to the output is relatively simple (linear, or a small number of splits) — they rely on humans to hand-engineer good features.
- Neural networks can automatically learn hierarchical, non-linear feature representations directly from raw data (pixels, raw text tokens) by stacking layers, each learning progressively more abstract patterns.
- This matters most for unstructured data (images, audio, natural language) where manually defining useful features is impractical — it's precisely why deep learning dominates NLP and computer vision, while classical ML remains competitive on structured/tabular data.

### Q8. What is a loss function, and what does gradient descent do?
**Expected answer:**
- A **loss function** quantifies how wrong the model's current predictions are compared to the true/desired outputs (e.g., cross-entropy loss for classification, mean squared error for regression).
- **Gradient descent** is the optimization algorithm that adjusts parameters to minimize the loss: it computes the gradient (direction of steepest increase) of the loss with respect to each parameter, then moves the parameter a small step in the opposite direction. This repeats over many batches of data.
- **Backpropagation** is the algorithm that efficiently computes these gradients across all layers of a neural network by applying the chain rule backward from the output layer to the input layer.
- The step size is the **learning rate** — too high and training diverges/oscillates, too low and training is painfully slow or gets stuck.

### Q9. What does "generalization" mean, and how is it measured?
**Expected answer:**
- Generalization is a model's ability to perform well on new, unseen data — not just the data it was trained on. It's the entire point of training a model rather than just memorizing a lookup table.
- Measured by holding out a **validation/test set** the model never sees during training, and evaluating performance there. A large gap between training performance and test performance signals overfitting (poor generalization).
- Techniques that improve generalization: more/diverse training data, regularization (dropout, weight decay), early stopping, cross-validation, and simpler model architectures when data is scarce.

### Q10. What's the difference between classification, regression, and generative tasks?
**Expected answer:**
- **Classification** — predicting a discrete category (spam/not spam, cat/dog/bird).
- **Regression** — predicting a continuous numeric value (house price, temperature).
- **Generative tasks** — producing new, structured output (text, images, audio) rather than a single label or number; LLMs are fundamentally generative models producing sequences of tokens.
- Many real systems chain these: an LLM (generative) might be used to produce structured output that's then validated by a classifier, or a RAG system might combine retrieval (a form of ranking/classification) with generation.

### Q11. What are pretraining, transfer learning, and fine-tuning?
**Expected answer:**
- **Pretraining** — training a model from scratch on a large, general dataset to learn broad patterns (e.g., an LLM learning language structure from internet-scale text).
- **Transfer learning** — reusing a model trained on one task/domain as the starting point for a different but related task, instead of training from scratch — saves enormous time and data.
- **Fine-tuning** — a specific form of transfer learning where you continue training a pretrained model on a smaller, task-specific or domain-specific dataset to specialize its behavior (e.g., instruction-tuning a base LLM to follow instructions, or fine-tuning on a company's support tickets).
- The value of transfer learning/fine-tuning is that the expensive general knowledge (grammar, world facts, reasoning patterns) doesn't need to be relearned — only the task-specific adjustment layer on top.

### Q12. What are scaling laws, and does "bigger is always better"?
**Expected answer:**
- **Scaling laws** describe empirically observed, fairly predictable relationships between model performance and three resources: model size (parameters), dataset size, and compute — performance tends to improve smoothly and predictably as all three scale up together.
- This is why the industry trend has been toward ever-larger models trained on ever-larger datasets.
- But "bigger is always better" is a misconception: gains plateau, data quality and curation often matter as much as raw scale, fine-tuning/alignment can matter more than raw parameter count for a given use case, and a bigger model costs more to serve (latency, compute) — so the right-sized model for a task is an engineering tradeoff, not just "pick the largest one."

### Q13. What's the difference between narrow AI and AGI (Artificial General Intelligence)?
**Expected answer:**
- **Narrow AI** (also "weak AI") is designed and trained to perform one task or a bounded set of tasks well (image recognition, translation, playing chess) — it does not generalize outside its trained domain in a human-like way.
- **AGI** refers to a hypothetical system with human-level (or beyond) general reasoning and learning ability across essentially any intellectual task, able to transfer understanding across domains the way humans do.
- Every AI system in production today — including large language models — is generally considered narrow AI in the strict sense, even though LLMs' broad task coverage makes them feel qualitatively different from earlier narrow models; AGI remains a research goal/open debate, not a deployed reality.

### Q14. Why does parameter count get discussed so much when comparing models?
**Expected answer:**
- Parameter count is a rough proxy for a model's capacity to store learned patterns — more parameters generally (not always) means more capacity to represent complex relationships, which correlates with (but doesn't guarantee) better performance.
- It's a poor standalone metric: training data quality/quantity, architecture choices, and fine-tuning/alignment can matter as much or more than raw size. Two models with wildly different parameter counts can perform similarly on a given task if one is better trained/aligned.
- Parameter count also directly drives inference cost — memory footprint and compute per forward pass scale with it — so it's as much a cost/latency signal as a capability signal.

### Q15. What are common ways to evaluate a model's performance?
**Expected answer:**
- **Accuracy** — fraction of predictions that are correct; misleading on imbalanced data (e.g., 99% "not fraud" accuracy is trivial if fraud is 1% of cases).
- **Precision** — of everything predicted positive, how much was actually positive (matters when false positives are costly).
- **Recall** — of everything actually positive, how much was correctly identified (matters when false negatives are costly).
- **F1 score** — harmonic mean of precision and recall, useful when you need a single balanced number.
- For generative/LLM systems, these classic metrics don't directly apply — evaluation instead relies on task-specific assertion checks, human review, and LLM-as-judge scoring (see the RAG and Agents interview notes for how this plays out in practice).
