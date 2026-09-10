---
title: "MCP Architecture"
---

# MCP Architecture

The Model Context Protocol (MCP) is a standardized way for an AI application to connect to
external tools, data sources, and systems without writing a custom integration for every
single one. It defines three roles — **host**, **client**, and **server** — and a common
protocol between them, so any MCP-compatible host can use any MCP-compatible server with no
bespoke glue code. The diagrams below show how those pieces fit together.

## 1. The Host / Client / Server Architecture

```mermaid
flowchart TD
    subgraph Host["Host Application (e.g. Claude Desktop, an IDE, a custom agent app)"]
        LLM["LLM"]
        C1["MCP Client 1"]
        C2["MCP Client 2"]
        C3["MCP Client 3"]
    end
    C1 <-->|"MCP protocol\n(JSON-RPC)"| S1["MCP Server: Filesystem\n(exposes file read/write tools)"]
    C2 <-->|"MCP protocol\n(JSON-RPC)"| S2["MCP Server: GitHub\n(exposes repo/issue tools)"]
    C3 <-->|"MCP protocol\n(JSON-RPC)"| S3["MCP Server: Database\n(exposes query/schema tools)"]

    LLM --> C1
    LLM --> C2
    LLM --> C3
```

**What this shows:** the **host** is the application the user interacts with; it maintains one
**client** connection per **server** it wants to talk to. Each **server** is a separate process
(local or remote) that exposes a specific set of capabilities — one server per integration
(filesystem, GitHub, a database, Slack, etc.) — over the same standardized protocol, so the
host's LLM can call any of them through a uniform interface regardless of what's on the other
side.

## 2. What a Server Exposes to the Host

```mermaid
flowchart LR
    subgraph Server["MCP Server"]
        T["Tools\n(callable actions,\ne.g. create_issue(),\nrun_query())"]
        R["Resources\n(readable data,\ne.g. a file, a\ndatabase schema)"]
        P["Prompts\n(reusable prompt\ntemplates the server\nprovides)"]
    end
    Server -->|"list & describe\navailable capabilities"| Client["MCP Client\n(inside Host)"]
    Client -->|"invoke a tool /\nread a resource"| Server
```

**What this shows:** an MCP server can expose three kinds of capabilities — **tools** (actions
the LLM can invoke, with defined input/output schemas), **resources** (data the host can read,
like a file's contents or a database schema), and **prompts** (reusable prompt templates the
server author has designed for its own domain). The host discovers what's available by asking
the server to list and describe its capabilities, then the LLM decides when to use them.

## 3. A Full Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Host as Host App
    participant LLM
    participant Client as MCP Client
    participant Server as MCP Server (e.g. GitHub)

    User->>Host: "Open a GitHub issue for this bug"
    Host->>LLM: Forward request + available tools
    LLM->>Host: Decide to call tool "create_issue"
    Host->>Client: Invoke create_issue(...)
    Client->>Server: MCP request (JSON-RPC)
    Server->>Server: Execute against GitHub API
    Server-->>Client: MCP response (issue URL)
    Client-->>Host: Tool result
    Host->>LLM: Feed tool result back as context
    LLM->>Host: Final answer to user
    Host->>User: "Created issue #482: <link>"
```

**What this shows:** the LLM itself never talks to the server directly — it decides *that* a
tool should be called and *with what arguments*; the host's MCP client handles the actual
protocol exchange with the server, then the result flows back through the client to the LLM as
new context, exactly like any other tool-call result.

## Key Insight

MCP's value is standardization: without it, every AI application needs custom, one-off code to
talk to every external system (its own auth, its own schema, its own quirks). With it, any
host can plug into any server through the same protocol — tools, resources, and prompts are
described in a uniform way, so integrations become interchangeable, reusable building blocks
instead of bespoke glue code duplicated across every application.
