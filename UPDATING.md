# How to Update the Game Collection App

## Workflow

### 1. Update the database
Talk to the bot in Discord:
- "Add [game name] to the collection"
- "Add a note to [game name]: ..."
- "Mark [game name] as played"

This updates `~/.openclaw/apps/boardgame-picker/games.jsonl` on the phone.

### 2. Rebuild the app
In Termux (or ask the bot to do it):
```
cd ~/.openclaw/workspace/boardgame-browser
npm run fetch-images  # only needed if new games were added (fetches box art)
npm run build         # bakes data into static files → out/
```

### 3. Re-zip and deploy
```
zip -r ~/.openclaw/workspace/boardgame-browser.zip out/
```
Then in Discord, ask the bot to send you the zip file.

Upload to Cloudflare Pages:
- Go to your Pages project → **Deployments** → **Upload**
- Drag and drop the zip
- Live in seconds at `games.carnagua.com`

---

## Coming soon: GitHub auto-deploy (Saturday)
Once the repo is on GitHub and connected to Cloudflare Pages, the workflow becomes:
1. Talk to the bot (updates local database)
2. Ask the bot: "deploy game collection" — it rebuilds and pushes to GitHub
3. Cloudflare detects the push and deploys automatically — no zip, no manual upload

At that point, yes — this could be a single skill command that does all three steps in one go.
