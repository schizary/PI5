# PI5 — Triagem de Autismo (TEA)

| Pasta | Tecnologia | Função | Porta padrão |
|-------|------------|--------|--------------|
| **backend/** | FastAPI + scikit-learn | API REST + ML | 8000 |

## Início rápido

### 1. Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.ml.train
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

