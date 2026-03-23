# EmergencyDental
After Hours Emergency Dental Website — Emergency and after-hours dental care in Little Rock, AR.

## Tech Stack

- **Node.js / Express** — server and API
- **Twilio** — SMS notifications for new appointment requests
- **Vanilla HTML/CSS/JS** — front-end (no build step required)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and fill in your Twilio credentials
cp .env.example .env

# 3. Start the development server (http://localhost:3000)
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (from [twilio.com](https://www.twilio.com)) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | Your Twilio phone number (e.g. `+15550001234`) |
| `PORT` | Port the server listens on (default: `3000`) |

If Twilio variables are not set the server still runs — appointment requests are logged to the console instead of sent via SMS.

## Deployment

### Deploy to Render (recommended — free tier available)

1. Sign up or log in at [render.com](https://render.com).
2. Click **New → Web Service** and connect your GitHub repository.
3. Render auto-detects the `render.yaml` blueprint and configures the service.
4. Add the Twilio environment variables in the Render dashboard under **Environment**.
5. Click **Deploy** — your site will be live at `https://emergency-dental.onrender.com` (or a custom domain).

#### Auto-deploy on push

Every push to the `main` branch automatically triggers a new deployment on Render via the GitHub Actions workflow (`.github/workflows/deploy.yml`).  
To enable the deploy hook:
1. In the Render dashboard open your service → **Settings → Deploy Hook** and copy the URL.
2. Add it as a GitHub Actions secret named `RENDER_DEPLOY_HOOK_URL` in your repo settings.

### Deploy to Heroku

```bash
heroku create
heroku config:set TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... TWILIO_FROM_NUMBER=...
git push heroku main
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and connect your GitHub repo.
2. Railway detects Node.js automatically and uses the `Procfile` start command.
3. Set the Twilio environment variables in the Railway dashboard.
