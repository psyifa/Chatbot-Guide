# Arsitektur Sistem DENAI

## Gambaran Umum

DENAI dirancang dengan arsitektur modular dan scalable yang memisahkan concern utama sistem menjadi komponen-komponen independen yang dapat dikembangkan dan di-maintain secara terpisah.

## Diagram Arsitektur High-Level

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI["Web Interface<br/>(Chat UI)"]
        Voice["Voice Interface<br/>(Hands-free)"]
    end
    
    subgraph "API Layer"
        API["FastAPI Server<br/>(REST API)"]
        Auth["Authentication<br/>(Security)"]
        Router["Request Router<br/>(Endpoint Handler)"]
    end
    
    subgraph "Business Logic Layer"
        SOP["SOP Engine<br/>(Document Search)"]
        HR["HR System<br/>(Employee Data)"]
        Tools["Tool Functions<br/>(Utilities)"]
        Rules["Hard Rules<br/>(Validation)"]
    end
    
    subgraph "AI/ML Layer"
        RAG["RAG Engine<br/>(Retrieval System)"]
        LLM["OpenAI GPT-4o<br/>(Language Model)"]
        Vector["Vector Search<br/>(Similarity)"]
        TTS["Text-to-Speech<br/>(ElevenLabs)"]
        STT["Speech-to-Text<br/>(Whisper)"]
    end
    
    subgraph "Data Layer"
        Pinecone["Pinecone<br/>Vector Database"]
        SQLite["SQLite<br/>HR Database"]
        Supabase["Supabase<br/>Session Storage"]
    end
    
    UI --> API
    Voice --> API
    API --> Auth
    Auth --> Router
    Router --> SOP
    Router --> HR
    Router --> Tools
    
    SOP --> RAG
    HR --> LLM
    Tools --> Rules
    
    RAG --> LLM
    RAG --> Vector
    Vector --> Pinecone
    
    LLM --> TTS
    Voice --> STT
    
    HR --> SQLite
    API --> Supabase
    
    style UI fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style Voice fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style API fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style Auth fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style Router fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style SOP fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style HR fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style Tools fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style Rules fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style RAG fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style LLM fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style Vector fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style TTS fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style STT fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style Pinecone fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    style SQLite fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    style Supabase fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
```

## Layer Architecture

### 1. Frontend Layer
Interface pengguna untuk berinteraksi dengan sistem.

**Komponen:**
- **Web Interface**: Chat UI berbasis web
- **Voice Interface**: Interface suara untuk hands-free operation

**Teknologi:**
- HTML5, CSS3, JavaScript
- WebRTC untuk audio streaming
- Responsive design

### 2. API Layer
Layer yang menangani semua HTTP requests dan routing.

```mermaid
graph LR
    A["Client Request<br/>(HTTP/HTTPS)"] --> B{"Router<br/>(FastAPI)"}
    B -->|"/ask"| C["Text Chat<br/>(Q&A)"]
    B -->|"/call/process"| D["Voice Call<br/>(Audio)"]
    B -->|"/speech/*"| E["Speech API<br/>(TTS/STT)"]
    B -->|"/sessions"| F["Session Mgmt<br/>(History)"]
    
    C --> G["Response<br/>(JSON)"]
    D --> G
    E --> G
    F --> G
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style D fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style E fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style F fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style G fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
```

**Endpoints:**
- `/ask` - Text-based question answering
- `/call/process` - Voice call processing
- `/speech/text-to-speech` - TTS conversion
- `/speech/speech-to-text` - STT conversion
- `/sessions` - Session management

### 3. Business Logic Layer
Core business logic dan tool orchestration.

**Komponen Utama:**

#### SOP Engine
```python
# Flow SOP Search
User Query → Hard Rules Check → RAG Engine → Vector Search 
→ Context Retrieval → LLM Processing → Formatted Response
```

**Fitur:**
- Anti-hallucination prompting
- Document type routing
- Context-aware retrieval
- HTML cleaning untuk TTS

#### HR System
```python
# Flow HR Query
User Query → Authorization Check → Schema Discovery 
→ Natural Language to SQL → Execute Query → Format Results
```

**Fitur:**
- Universal database support
- Automatic schema detection
- Business intelligence
- Role-based access control

### 4. AI/ML Layer
Layer yang menangani semua operasi AI dan machine learning.

```mermaid
graph TB
    subgraph "RAG Pipeline"
        Q["Query Input<br/>(User Question)"] --> E["Embedding<br/>(Vector Conversion)"]
        E --> V["Vector Search<br/>(Similarity Match)"]
        V --> R["Retrieve Top-K<br/>(Best Matches)"]
        R --> C["Build Context<br/>(Prepare Data)"]
    end
    
    subgraph "LLM Processing"
        C --> P["Prepare Prompt<br/>(Format Input)"]
        P --> L["LLM Call<br/>(GPT-4o-mini)"]
        L --> F["Format Output<br/>(Clean Response)"]
    end
    
    subgraph "Speech Processing"
        T1["Text Input"] --> TTS["TTS Engine<br/>(ElevenLabs/OpenAI)"]
        Audio["Audio Input"] --> STT["STT Engine<br/>(Whisper)"]
        TTS --> T2["Speech Output<br/>(Audio File)"]
        STT --> T3["Text Output<br/>(Transcription)"]
    end
    
    style Q fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style E fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style V fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style R fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style C fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style P fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style L fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style F fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style TTS fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style STT fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style T2 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,color:#000
    style T3 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,color:#000
```

**Komponen:**
- **RAG Engine**: Retrieval-Augmented Generation
- **LLM**: OpenAI GPT-4o-mini
- **Vector Search**: Pinecone similarity search
- **TTS**: ElevenLabs + OpenAI fallback
- **STT**: OpenAI Whisper

### 5. Data Layer
Persistent storage untuk berbagai jenis data.

**Databases:**

| Database | Purpose | Data Type |
|----------|---------|-----------|
| **Pinecone** | Vector storage | SOP embeddings |
| **SQLite** | HR data | Employee records |
| **Supabase** | Session data | Chat history |

## Data Flow

### SOP Query Flow

```mermaid
sequenceDiagram
    participant U as User<br/>(Client)
    participant A as API<br/>(FastAPI)
    participant R as RAG Engine<br/>(Retrieval)
    participant V as Vector DB<br/>(Pinecone)
    participant L as LLM<br/>(GPT-4o)
    
    U->>A: Submit question
    Note over U,A: HTTP POST /ask
    
    A->>R: Process query
    Note over A,R: Parse & validate input
    
    R->>V: Search vectors
    Note over R,V: Embedding similarity search
    
    V-->>R: Return top matches
    Note over V,R: K=5 most similar docs
    
    R->>R: Build context
    Note over R: Combine retrieved documents
    
    R->>L: Generate answer
    Note over R,L: Anti-hallucination prompt
    
    L-->>R: LLM response
    Note over L,R: Generated answer
    
    R->>R: Clean & format
    Note over R: Remove HTML, format text
    
    R-->>A: Formatted answer
    A-->>U: Display response
    Note over A,U: JSON response
```

### HR Query Flow

```mermaid
sequenceDiagram
    participant U as User<br/>(Client)
    participant A as API<br/>(FastAPI)
    participant H as HR System<br/>(Query Engine)
    participant L as LLM<br/>(GPT-4o)
    participant D as Database<br/>(SQLite)
    
    U->>A: Ask HR question
    Note over U,A: POST /ask (HR mode)
    
    A->>A: Check authorization
    Note over A: Verify user role
    
    alt Not HR Role
        A-->>U: Access denied
        Note over A,U: 403 Forbidden
    else HR Role
        A->>H: Process query
        Note over A,H: Forward to HR system
        
        H->>L: Convert to SQL
        Note over H,L: Natural language to SQL
        
        L-->>H: SQL query
        Note over L,H: Generated SQL statement
        
        H->>D: Execute query
        Note over H,D: Run SQL safely
        
        D-->>H: Results
        Note over D,H: Query result set
        
        H->>H: Format results
        Note over H: Convert to readable format
        
        H-->>A: Formatted data
        A-->>U: Display results
        Note over A,U: JSON response
    end
```

### Voice Call Flow

```mermaid
sequenceDiagram
    participant U as User<br/>(Caller)
    participant A as API<br/>(Server)
    participant S as STT<br/>(Whisper)
    participant R as RAG/HR<br/>(Logic)
    participant T as TTS<br/>(ElevenLabs)
    
    U->>A: Audio input
    Note over U,A: Upload audio file
    
    A->>S: Transcribe
    Note over A,S: Speech to text conversion
    
    S-->>A: Text
    Note over S,A: Transcribed question
    
    A->>R: Process query
    Note over A,R: Route to appropriate engine
    
    R-->>A: Text response
    Note over R,A: Generated answer
    
    A->>A: Clean HTML
    Note over A: Remove formatting tags
    
    A->>T: Convert to speech
    Note over A,T: Text to audio
    
    T-->>A: Audio output
    Note over T,A: Generated speech file
    
    A-->>U: Play audio
    Note over A,U: Return audio response
```

## Scalability Considerations

### Horizontal Scaling
```mermaid
graph TB
    LB["Load Balancer<br/>(NGINX/HAProxy)"]
    
    LB --> API1["API Instance 1<br/>(FastAPI Server)"]
    LB --> API2["API Instance 2<br/>(FastAPI Server)"]
    LB --> API3["API Instance 3<br/>(FastAPI Server)"]
    
    API1 --> Cache["Redis Cache<br/>(Session & Response)"]
    API2 --> Cache
    API3 --> Cache
    
    Cache --> Vector["Vector DB<br/>(Pinecone)"]
    Cache --> SQL["SQL DB<br/>(SQLite/Postgres)"]
    
    style LB fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    style API1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style API2 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style API3 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style Cache fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    style Vector fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    style SQL fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
```

**Strategi:**
- Stateless API design
- Connection pooling
- Response caching
- Async processing

### Performance Optimization

**Current Optimizations:**
- Batch processing untuk ingestion
- Lazy loading untuk router
- Cached schema discovery
- Efficient HTML cleaning
- Timeout configuration per mode

**Metrics:**
- Average response time: < 2s
- Vector search: < 500ms
- LLM generation: < 1.5s
- TTS conversion: < 1s

## Security Architecture

```mermaid
graph TB
    U["User<br/>(Client)"] -->|HTTPS| API["API Gateway<br/>(FastAPI)"]
    API -->|"Auth Check"| Auth["Authentication<br/>(Token Validation)"]
    Auth -->|Validated| Router["Router<br/>(Request Handler)"]
    
    Router -->|"Role: HR"| HR["HR Functions<br/>(Restricted)"]
    Router -->|"Role: Any"| SOP["SOP Functions<br/>(Public)"]
    
    HR -->|"Authorized Query"| DB["Database<br/>(Employee Data)"]
    SOP -->|"Public Data"| Vector["Vector DB<br/>(SOP Documents)"]
    
    style U fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style API fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style Auth fill:#ffebee,stroke:#c62828,stroke-width:3px,color:#000
    style Router fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style HR fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    style SOP fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    style DB fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    style Vector fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
```

**Security Layers:**
1. HTTPS/TLS encryption
2. API key authentication
3. Role-based access control (RBAC)
4. Rate limiting
5. Input validation
6. SQL injection prevention

## Configuration Management

### Environment-based Config

```python
# Config hierarchy
ENVIRONMENT = "production" | "development"

# Mode-specific constants
CALL_MODE_TEMPERATURE = 0.0  # Deterministic
CHAT_MODE_TEMPERATURE = 0.1  # Slightly creative
```

**Configuration Files:**
- `app/config.py` - Main configuration
- `.env` - Environment variables
- `cache/sop_doc_types.json` - Router cache

## Monitoring & Logging

### Logging Levels
```python
FEATURE_VERBOSE_LOGGING = True/False

LOG_LEVEL = "DEBUG" | "INFO" | "WARNING" | "ERROR"
```

### Metrics Tracked
- Request/response times
- Error rates
- Cache hit rates
- LLM token usage
- Database query performance

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        P1["API Server 1<br/>(Live Traffic)"]
        P2["API Server 2<br/>(Live Traffic)"]
        PLB["Load Balancer<br/>(NGINX)"]
    end
    
    subgraph "Staging Environment"
        S1["Staging Server<br/>(Pre-release Testing)"]
    end
    
    subgraph "Development Environment"
        D1["Dev Server<br/>(Local Development)"]
    end
    
    CI["CI/CD Pipeline<br/>(GitHub Actions)"] -->|Deploy| P1
    CI -->|Deploy| P2
    CI -->|Test| S1
    Dev["Developers<br/>(Code Changes)"] -->|Push| CI
    
    style P1 fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style P2 fill:#c8e6c9,stroke:#388e3c,stroke-width:3px,color:#000
    style PLB fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    style S1 fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    style D1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style CI fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    style Dev fill:#e1f5ff,stroke:#0277bd,stroke-width:2px,color:#000
```

## Next Steps

- [Komponen Detail](components.md)
- [Tech Stack](tech-stack.md)
- [Data Flow Detail](data-flow.md)