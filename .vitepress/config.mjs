import { withMermaid } from 'vitepress-plugin-mermaid'

const weeks = [
  {
    num: '01',
    title: 'Foundations',
    topics: [
      'Language-Models', 'Tokens-And-Tokenization', 'Cost-Per-Token', 'Context-Window',
      'Word-Embeddings', 'Static-Vs-Contextual-Embeddings', 'Temperature-And-Sampling',
      'Greedy-Vs-Sampled-Decoding', 'Model-Families', 'Decoder-Vs-Encoder-Models', 'Hallucination',
    ],
  },
  {
    num: '02',
    title: 'Prompting & Tool Calling',
    topics: [
      'Prompt-Anatomy', 'Zero-Shot-Vs-Few-Shot', 'Chain-Of-Thought', 'Self-Consistency',
      'Task-Decomposition', 'Structured-Output-JSON-Schema', 'Pydantic', 'Instructor-Library',
      'Validation-And-Retry', 'Tool-Function-Calling', 'Parallel-Tool-Calls', 'Guardrails',
      'Prompt-Injection',
    ],
  },
  {
    num: '03',
    title: 'Retrieval & RAG',
    topics: [
      'Why-RAG', 'Embeddings-And-Dense-Retrieval', 'Bi-Encoder-Vs-Cross-Encoder',
      'Embedding-Models', 'Chunking-Strategies', 'Chunk-Size-And-Overlap',
      'Vector-Databases-HNSW', 'Qdrant-Chroma-Pgvector', 'Similarity-Search-And-Top-K',
      'Metadata-Filtering', 'Grounded-Generation-And-Citations',
    ],
  },
  {
    num: '04',
    title: 'Debugging Retrieval',
    topics: [
      'Retrieval-Vs-Generation-Failures', 'The-Inspection-View', 'Keyword-Search-BM25',
      'Keyword-Vs-Semantic-Search', 'Hybrid-Search-RRF-Fusion', 'Reranking-Cross-Encoder',
      'Cohere-Rerank-BGE-Reranker', 'MMR', 'Query-Rewriting', 'HyDE',
      'Retrieval-Metrics-Hit-Rate-Recall-MRR',
    ],
  },
  {
    num: '05',
    title: 'Error Analysis',
    topics: [
      'Complete-Traces', 'Random-Vs-Curated-Sampling', 'Open-Coding', 'Error-Taxonomy',
      'Frequency-Times-Severity', 'Choosing-The-Fix-Target', 'Benchmarks-Vs-Your-App',
      'Writing-A-Prediction-First',
    ],
  },
  {
    num: '06',
    title: 'Evals',
    topics: [
      'Eval-Sets', 'Regression-Tests-From-Failures', 'Assertion-Checks', 'LLM-As-Judge',
      'G-Eval', 'Binary-Vs-1-To-10-Scoring', 'Judge-Validation', 'RAGAS-Faithfulness',
      'RAGAS-Answer-Relevancy', 'RAGAS-Context-Precision-And-Recall', 'Before-After-Deltas',
    ],
  },
  {
    num: '07',
    title: 'Agent Loops',
    topics: [
      'The-Agent-Loop', 'ReAct', 'Tool-Design', 'Stop-Conditions-And-Budgets',
      'Workflows-Vs-Agents', 'Agent-Vs-Workflow-Race', 'Agent-Memory',
      'Summarisation-And-Vector-Memory', 'Mem0', 'LangChain-LangGraph',
    ],
  },
  {
    num: '08',
    title: 'Agent Failures & Trajectory Evals',
    topics: [
      'Agent-Failure-Modes', 'Trajectory-Evaluation', 'Expected-Tool-Sequences',
      'Tool-Choice-Accuracy', 'Outcome-Vs-Trajectory-Gap', 'Cost-Per-Task',
      'Direct-Prompt-Injection', 'Indirect-Prompt-Injection',
      'Tool-Sandboxing-And-Least-Privilege', 'Output-Validation', 'OWASP-LLM-Top-10',
    ],
  },
]

function humanize(slug) {
  return slug.replace(/-/g, ' ')
}

function weekSidebar(week) {
  return [
    {
      text: `Week ${week.num}: ${week.title}`,
      items: [
        { text: 'Overview', link: `/Week-${week.num}/README` },
        {
          text: 'Topics',
          collapsed: false,
          items: week.topics.map((t, i) => ({
            text: humanize(t),
            link: `/Week-${week.num}/Topics/${String(i + 1).padStart(2, '0')}-${t}`,
          })),
        },
        { text: 'Notes', link: `/Week-${week.num}/Notes/` },
        { text: 'Cheat Sheet', link: `/Week-${week.num}/CheatSheet` },
        { text: 'Revision', link: `/Week-${week.num}/Revision` },
      ],
    },
  ]
}

const sidebar = {}
for (const week of weeks) {
  sidebar[`/Week-${week.num}/`] = weekSidebar(week)
}

sidebar['/Concepts/'] = [
  {
    text: 'Concept Library',
    items: [
      { text: 'LLM', link: '/Concepts/LLM' },
      { text: 'Tokens', link: '/Concepts/Tokens' },
      { text: 'Context Window', link: '/Concepts/Context-Window' },
      { text: 'Embeddings', link: '/Concepts/Embeddings' },
      { text: 'Attention', link: '/Concepts/Attention' },
      { text: 'Transformer', link: '/Concepts/Transformer' },
      { text: 'RAG', link: '/Concepts/RAG' },
      { text: 'Vector Database', link: '/Concepts/Vector-Database' },
      { text: 'Hybrid Search', link: '/Concepts/Hybrid-Search' },
      { text: 'Reranking', link: '/Concepts/Reranking' },
      { text: 'Prompt Engineering', link: '/Concepts/Prompt-Engineering' },
      { text: 'Function Calling', link: '/Concepts/Function-Calling' },
      { text: 'Structured Output', link: '/Concepts/Structured-Output' },
      { text: 'Guardrails', link: '/Concepts/Guardrails' },
      { text: 'Hallucination', link: '/Concepts/Hallucination' },
      { text: 'Error Analysis', link: '/Concepts/Error-Analysis' },
      { text: 'LLM-as-Judge', link: '/Concepts/LLM-As-Judge' },
      { text: 'Agent Loop', link: '/Concepts/Agent-Loop' },
      { text: 'Memory', link: '/Concepts/Memory' },
      { text: 'Multi-Agent System', link: '/Concepts/Multi-Agent-System' },
      { text: 'MCP', link: '/Concepts/MCP' },
      { text: 'AI Agent', link: '/Concepts/AI-Agent' },
    ],
  },
]

sidebar['/CheatSheets/'] = [
  {
    text: 'Master Cheat Sheets',
    items: [
      { text: 'Prompt Engineering', link: '/CheatSheets/Prompt-Engineering' },
      { text: 'Embeddings', link: '/CheatSheets/Embeddings' },
      { text: 'RAG', link: '/CheatSheets/RAG' },
      { text: 'LangChain', link: '/CheatSheets/LangChain' },
      { text: 'Vector Database', link: '/CheatSheets/Vector-Database' },
      { text: 'MCP', link: '/CheatSheets/MCP' },
      { text: 'AI Agents', link: '/CheatSheets/AI-Agents' },
      { text: 'OpenAI SDK', link: '/CheatSheets/OpenAI-SDK' },
      { text: 'LLM', link: '/CheatSheets/LLM' },
      { text: 'Fine-Tuning', link: '/CheatSheets/Fine-Tuning' },
    ],
  },
]

sidebar['/Visual-Guides/'] = [
  {
    text: 'Visual Guides',
    items: [
      { text: 'How Transformers Work', link: '/Visual-Guides/How-Transformers-Work' },
      { text: 'How Attention Works', link: '/Visual-Guides/How-Attention-Works' },
      { text: 'How Embeddings Work', link: '/Visual-Guides/How-Embeddings-Work' },
      { text: 'How RAG Works', link: '/Visual-Guides/How-RAG-Works' },
      { text: 'AI Agent Lifecycle', link: '/Visual-Guides/AI-Agent-Lifecycle' },
      { text: 'MCP Architecture', link: '/Visual-Guides/MCP-Architecture' },
      { text: 'Tokenization Flow', link: '/Visual-Guides/Tokenization-Flow' },
      { text: 'Fine-Tuning Lifecycle', link: '/Visual-Guides/Fine-Tuning-Lifecycle' },
    ],
  },
  {
    text: 'Comparisons',
    items: [
      { text: 'LLM vs Traditional ML', link: '/Visual-Guides/Comparisons/LLM-Vs-Traditional-ML' },
      { text: 'Dense vs Sparse Embeddings', link: '/Visual-Guides/Comparisons/Dense-Vs-Sparse-Embeddings' },
      { text: 'RAG vs Fine-Tuning', link: '/Visual-Guides/Comparisons/RAG-Vs-Fine-Tuning' },
      { text: 'Agent vs Workflow', link: '/Visual-Guides/Comparisons/Agent-Vs-Workflow' },
      { text: 'Prompt Template vs System Prompt', link: '/Visual-Guides/Comparisons/Prompt-Template-Vs-System-Prompt' },
      { text: 'LangChain vs Semantic Kernel', link: '/Visual-Guides/Comparisons/LangChain-Vs-Semantic-Kernel' },
      { text: 'Vector DB Comparison', link: '/Visual-Guides/Comparisons/Vector-DB-Comparison' },
      { text: 'OpenAI API vs Anthropic API', link: '/Visual-Guides/Comparisons/OpenAI-Vs-Anthropic-API' },
    ],
  },
]

sidebar['/Interview-Notes/'] = [
  {
    text: 'Interview Notes',
    items: [
      { text: 'AI Fundamentals', link: '/Interview-Notes/AI-Fundamentals' },
      { text: 'LLM Theory', link: '/Interview-Notes/LLM-Theory' },
      { text: 'Transformer Theory', link: '/Interview-Notes/Transformer-Theory' },
      { text: 'Prompt Engineering Theory', link: '/Interview-Notes/Prompt-Engineering-Theory' },
      { text: 'Embeddings Theory', link: '/Interview-Notes/Embeddings-Theory' },
      { text: 'Vector DB Theory', link: '/Interview-Notes/Vector-DB-Theory' },
      { text: 'RAG Theory', link: '/Interview-Notes/RAG-Theory' },
      { text: 'AI Agents Theory', link: '/Interview-Notes/AI-Agents-Theory' },
      { text: 'MCP Theory', link: '/Interview-Notes/MCP-Theory' },
    ],
  },
]

sidebar['/Resources/'] = [
  {
    text: 'Resources',
    items: weeks.map((w) => ({ text: `Week ${w.num}`, link: `/Resources/Week-${w.num}` })),
  },
]

export default withMermaid({
  title: 'AI Engineering Curriculum',
  description: 'A doc-style knowledge base for the 7-week AI engineering curriculum',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Roadmap', link: '/COURSE-ROADMAP' },
      { text: 'Learning Path', link: '/LEARNING-PATH' },
      { text: 'Concepts', link: '/Concepts/' },
      { text: 'Cheat Sheets', link: '/CheatSheets/' },
      { text: 'Glossary', link: '/AI-GLOSSARY' },
      { text: 'Visual Guides', link: '/Visual-Guides/' },
      { text: 'Interview Notes', link: '/Interview-Notes/' },
      { text: 'Resources', link: '/Resources/' },
    ],
    sidebar,
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    socialLinks: [],
  },
  vite: {
    optimizeDeps: {
      include: [
        'mermaid',
        'fastdom',
        'fastdom/extensions/fastdom-promised.js',
      ],
    },
  },
  mermaid: {},
  mermaidPlugin: { class: 'mermaid-diagram' },
})
