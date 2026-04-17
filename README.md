# Flipkart Clone

This repository contains a React frontend (`frontend`) and a Node.js/Express backend (`backend`).

## Deploying the Backend to Render

1. Create a Render Web Service.
2. Use this repository and select the `main` branch.
3. Set the root directory to `backend`.
4. Use:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add the required environment variables in Render:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `JWT_SECRET`
6. Render will provide a service URL such as `https://<your-backend>.onrender.com`.

## Deploying the Frontend to Vercel

1. Create a new Vercel project from this repository.
2. Set the root directory to `frontend`.
3. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add this environment variable in Vercel:
   - `VITE_API_BASE_URL = https://<your-backend>.onrender.com/api`

## Notes

- `frontend/src/services/api.js` is already configured to use `VITE_API_BASE_URL`.
- `frontend/vercel.json` is configured for proper Vite deployment.
- `render.yaml` is added for Render service configuration.
- Do not commit your local `backend/.env` file with secrets.
