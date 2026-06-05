# Frontend — Landing + questionário web

Site institucional do projeto (React + Vite). Apresenta o PI5, status da API e inclui o questionário AQ-10 (mesmo fluxo do app mobile).

## Instalação

```bash
cd frontend
npm install
copy .env.example .env
```

## Executar

```bash
npm run dev
```

Acesse http://localhost:5173 e use **Realizar questionário na web** ou o link **Questionário** no menu.

Requer o backend em execução (`POST /predict`).

## Build

```bash
npm run build
npm run preview
```
