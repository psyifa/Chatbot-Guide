# Installation Guide

Panduan lengkap instalasi DENAI untuk berbagai environment.

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Linux, macOS, Windows 10+ |
| **Python** | 3.11 or higher |
| **RAM** | 4 GB minimum, 8 GB recommended |
| **Storage** | 10 GB free space |
| **Internet** | Required for API calls |

### Recommended Setup

- **CPU**: 4 cores or more
- **RAM**: 16 GB
- **Storage**: SSD with 20 GB+ free
- **Network**: Stable broadband connection

## Prerequisites Installation

### Python 3.11+

=== "macOS"
    ```bash
    # Using Homebrew
    brew install python@3.11
    
    # Verify installation
    python3.11 --version
    ```

=== "Ubuntu/Debian"
    ```bash
    # Add deadsnakes PPA
    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt update
    
    # Install Python 3.11
    sudo apt install python3.11 python3.11-venv python3.11-dev
    
    # Verify
    python3.11 --version
    ```

=== "Windows"
    1. Download dari [python.org](https://www.python.org/downloads/)
    2. Run installer
    3. ✅ Check "Add Python to PATH"
    4. Verify:
    ```powershell
    python --version
    ```

### Git

=== "macOS"
    ```bash
    # Using Homebrew
    brew install git
    ```

=== "Ubuntu/Debian"
    ```bash
    sudo apt install git
    ```

=== "Windows"
    Download dari [git-scm.com](https://git-scm.com/)

### pip (Python Package Manager)

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Verify
pip --version
```

## Installation Methods

### Method 1: From GitHub (Recommended)

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/denai.git
cd denai
```

#### 2. Create Virtual Environment

```bash
# Create venv
python -m venv venv

# Activate venv
source venv/bin/activate  # Mac/Linux
# atau
venv\Scripts\activate  # Windows
```

**Benefits:**
- ✅ Isolated dependencies
- ✅ Clean system Python
- ✅ Easy to delete

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Time:** ~2-3 minutes

#### 4. Verify Installation

```bash
# Check installed packages
pip list | grep -E "fastapi|openai|pinecone|supabase"
```

Should see:
```
fastapi         0.104.1
openai          1.6.1
pinecone-client 3.0.0
supabase        2.3.0
...
```

### Method 2: Docker (Production)

#### 1. Install Docker

=== "macOS"
    Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

=== "Ubuntu"
    ```bash
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    ```

=== "Windows"
    Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### 2. Build Docker Image

```bash
# Build image
docker build -t denai:latest .

# Verify
docker images | grep denai
```

#### 3. Run Container

```bash
docker run -d \
  --name denai \
  -p 8000:8000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e PINECONE_API_KEY=$PINECONE_API_KEY \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  denai:latest
```

#### 4. Check Logs

```bash
docker logs -f denai
```

### Method 3: Development Install

For active development:

```bash
# Clone repo
git clone https://github.com/your-org/denai.git
cd denai

# Install in editable mode
pip install -e .

# Install dev dependencies
pip install -r requirements-dev.txt
```

## Environment Setup

### 1. Create .env File

```bash
cp .env.example .env
```

### 2. Configure API Keys

Edit `.env` file:

```ini
# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-proj-...
LLM_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small

# Pinecone (REQUIRED for SOP)
PINECONE_API_KEY=...
PINECONE_INDEX=denai-sop

# Supabase (REQUIRED for sessions)
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...

# ElevenLabs (OPTIONAL - for premium voice)
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID_INDONESIAN=iWydkXKoiVtvdn4vLKp9

# Configuration
ENVIRONMENT=development
USER_ROLE=Employee
```

### 3. Test Configuration

```bash
python -c "
from app.config import OPENAI_API_KEY, PINECONE_API_KEY
print('✅ OpenAI:', bool(OPENAI_API_KEY))
print('✅ Pinecone:', bool(PINECONE_API_KEY))
"
```

## Database Setup

### Supabase Tables

1. Login to [Supabase Dashboard](https://app.supabase.com)
2. Create new project (jika belum ada)
3. Go to SQL Editor
4. Run setup script:

```sql
-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat memory table
CREATE TABLE IF NOT EXISTS chat_memory (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_memory_session 
    ON chat_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_memory_created 
    ON chat_memory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_pinned 
    ON chat_sessions(pinned DESC, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_memory ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for service role)
CREATE POLICY "Allow all for service role" ON chat_sessions
    FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON chat_memory
    FOR ALL USING (true);
```

### Pinecone Index

1. Login to [Pinecone Console](https://app.pinecone.io)
2. Create new index:
   - **Name**: `denai-sop`
   - **Dimensions**: `1536` (for text-embedding-3-small)
   - **Metric**: `cosine`
   - **Cloud**: `aws` (or your preferred)
   - **Region**: Choose closest to you

3. Wait for index to be ready (~2 minutes)

### Local SQLite (HR Data)

```bash
# Create db folder
mkdir -p db

# Database akan auto-created saat CSV ingestion
python batch_csv_processor_final.py employees.csv
```

## Directory Structure Setup

```bash
# Create required directories
mkdir -p documents cache db

# Set permissions (Linux/Mac)
chmod 755 documents cache db
```

## Verification Steps

### 1. Check Python Packages

```bash
python -c "
import fastapi
import openai
import pinecone
import supabase
print('✅ All core packages installed')
"
```

### 2. Test OpenAI Connection

```bash
python -c "
from openai import OpenAI
import os
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
response = client.chat.completions.create(
    model='gpt-4o-mini',
    messages=[{'role': 'user', 'content': 'test'}],
    max_tokens=5
)
print('✅ OpenAI connection OK')
"
```

### 3. Test Pinecone Connection

```bash
python -c "
from pinecone import Pinecone
import os
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
indexes = pc.list_indexes()
print('✅ Pinecone connection OK')
print(f'Available indexes: {[i.name for i in indexes]}')
"
```

### 4. Test Supabase Connection

```bash
python -c "
from supabase import create_client
import os
client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_ANON_KEY')
)
print('✅ Supabase connection OK')
"
```

## Running the Server

### Development Server

```bash
# With auto-reload
uvicorn app.api:app --reload --host 0.0.0.0 --port 8000
```

**Output:**
```
INFO:     Will watch for changes in these directories: ['/path/to/denai']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Production Server

```bash
# With Gunicorn
gunicorn app.api:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Docker

```bash
docker-compose up -d
```

## Post-Installation

### 1. Verify API

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "6.2.0",
  "config_status": {
    "openai_configured": true,
    "elevenlabs_configured": true
  }
}
```

### 2. Access Interactive Docs

Open browser: `http://localhost:8000/docs`

### 3. Test Basic Query

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "test connection",
    "session_id": "install_test"
  }'
```

## Troubleshooting

### Issue: Module Not Found

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
# Ensure venv is activated
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Port Already in Use

```
ERROR: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process or use different port
uvicorn app.api:app --port 8001
```

### Issue: OpenAI API Error

```
openai.error.AuthenticationError: Incorrect API key
```

**Solution:**
```bash
# Verify API key in .env
cat .env | grep OPENAI_API_KEY

# Test key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Issue: Pinecone Connection Failed

```
PineconeException: Invalid API key
```

**Solution:**
1. Verify API key di Pinecone console
2. Check index name matches `.env`
3. Ensure index is active (not initializing)

## Next Steps

- ✅ [Configuration Guide](configuration.md) - Configure advanced features
- ✅ [Quick Start](quick-start.md) - Start using DENAI
- ✅ [Data Ingestion](../developer/csv-ingestion.md) - Load your data

## Update & Maintenance

### Update DENAI

```bash
# Pull latest changes
git pull origin main

# Update dependencies
pip install -r requirements.txt --upgrade

# Restart server
```

### Backup Data

```bash
# Backup databases
cp -r db/ db_backup_$(date +%Y%m%d)/

# Backup documents
cp -r documents/ documents_backup_$(date +%Y%m%d)/
```

---

**Installation Complete! 🎉**

Next: [Configure DENAI →](configuration.md)