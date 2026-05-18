# Backend — API de Triagem (FastAPI + ML)

API REST que treina e serve o modelo de classificação.

## Estrutura

```
backend/
├── app/
│   ├── api/routes.py
│   ├── models/schemas.py
│   ├── services/prediction_service.py
│   ├── ml/
│   ├── config.py
│   └── main.py
├── data/autism_screening-1.csv
├── artifacts/autism_classifier.joblib
├── requirements.txt
└── .env.example
```

## Instalação

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Treinar modelo

```bash
python -m app.ml.train
```

## Executar API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## CORS

No `.env`, inclua as origens do **frontend** (Vite) e do **mobile** (Expo):

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:8081
```
