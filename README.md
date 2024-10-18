# REPO

This is a vanilla Next14 App Router + React18 app serving a simple Frog.fm frame, ready to deploy to Vercel in a handful of clicks.

The UX works fine for me, and data is stored in Vercel's experimental `Edge Config Store`, which is so low-impact that it might as well be free forever. If you need more scale, portability, or ease of use, consider:

- another of Vercel's (more powerful) data stores
- SQLite on Turso
- Redis on Upstash
- Mongo/Postgres at different hosting services that compete for developer value

The repo also specifies a development Neynar API key. Replace this with your own key before deploying to `PROD`. The Neynar docs are very clear about how to do this.

## Development

```
pnpm i
pnpm run dev
```

Head to <http://localhost:3000/api>

## Deploy to Vercal

Update `app/constants.ts` with your own title and Github URL.

Commit to Github, create a new project in Vercel and link it to the repo, click and deploy.

After first  deployment, you must connect a Vercel `Edge Config Store` database to this project and re-deploy. Easiest way is via the Dashboard, and it can also be done via the CLI.

Sample format:

```code
{
  "1606": "🕯️🕯️🕯️",
  "6596": "hock tew, king",
  "6945": "God's Son. I would like to chat with y'all on BNFarcaster whenever you are ready for me. 7/4/2024",
  "10174": "wen moon? I would like to chat with y'all on BNFarcaster whenever you are ready for me. 7/4/2024",
  "10215": "fid 10215 is my favorite zoo",
  "15850": "imma have fun before I go, christin 7/3/2024",
  "326040": "thank you for giving voice to the undervalued and unseen",
  "greeting": "@artlu's Private Message Frame",
  "fids": "1606,6596,6945,10174,10215,15850,326040",
  "slideshow": "",
  "nSlideshowPages": "2",
  "artlu20240704": {
    "slides": [
      {
        "title": "build cool shit",
        "message": "I tried it very early, and have specific feedback"
      },
      {
        "title": "Looking forward to our chat on Tuesday",
        "message": "7/4/2024 9:30 AM video call",
        "url": "https://meet.google.com/xxx-xxxx-xxx",
        "buttonText": "Google Meet"
      }
    ]
  },
  "hashes": "0xac90f4f9cc9e4149314c3119544c756a1430b649",
  "0xac90f4f9cc9e4149314c3119544c756a1430b649": "baaaa you heathens"
}
```
