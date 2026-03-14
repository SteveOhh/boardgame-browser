# GitHub Setup — PR-Only Access for the Phone

Steve administers the repo from his computer. The phone can create PRs but cannot merge code.

---

## Step 1: Create a Private Repo

On GitHub:
1. **New repository** → name it `boardgame-browser`
2. **Private** ✓
3. Add README, ignore .gitignore (can add later)
4. Create

---

## Step 2: Generate a GitHub Personal Access Token (phone-only)

This token will allow the phone to create commits and PRs, but **not** merge.

On your computer (GitHub.com):
1. Profile icon → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Generate new token**
3. **Token name:** `phone-boardgame-ci`
4. **Expiration:** 90 days (or whatever you prefer)
5. **Repository access:** `Only select repositories` → choose `boardgame-browser`
6. **Permissions:**
   - ✓ Contents: **Read and write** (for commits, branches, PRs)
   - ✓ Pull requests: **Read and write**
   - **Do NOT grant:** Admin, Merge, Delete
7. **Generate** → copy the token

**Keep this token secret.** If it leaks, regenerate immediately.

---

## Step 3: Configure Git on the Phone

In Termux:
```bash
cd ~/.openclaw/workspace/boardgame-browser

# Set git config (local to this repo only, not global)
git config user.name "Steve's OpenClaw"
git config user.email "your@email.com"

# Initialize if not already a repo
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/boardgame-browser.git

# Store credentials (Termux-safe approach)
git config credential.helper store

# Now git will prompt for username/password on first push
# Username: YOUR_GITHUB_USERNAME
# Password: paste the token (not your GitHub password!)
```

---

## Step 4: Initial Push (one-time from phone)

```bash
cd ~/.openclaw/workspace/boardgame-browser

# Stage all files
git add .

# Commit
git commit -m "Initial commit: boardgame browser app"

# Push to main (creates the branch if it doesn't exist)
git push -u origin main
```

---

## Step 5: Create a Branch & PR from the Phone (Workflow)

When the bot updates code and wants to deploy:

```bash
cd ~/.openclaw/workspace/boardgame-browser

# Create a new branch (auto-date it)
git checkout -b deploy-$(date +%Y-%m-%d)

# Make your changes (npm run build, etc.)
npm run build

# Stage and commit
git add .
git commit -m "Update: [description]"

# Push the branch
git push -u origin deploy-$(date +%Y-%m-%d)
```

Then on GitHub, you'll see a "Create pull request" banner. Click it, add a note, and submit. The phone can't merge — only you can, from your computer.

---

## Step 6: Merge from Your Computer

1. Go to GitHub → **Pull requests** tab
2. Review the changes
3. **Merge pull request** → confirm
4. Delete the branch when done (GitHub offers this)
5. Pull the latest on your computer: `git pull origin main`

---

## Security Notes

- The token is **repo-only** — it can't touch your other repos
- It can't merge, delete branches, or admin the repo
- It expires in 90 days (regenerate before then)
- If lost, revoke immediately at GitHub → Settings → Personal access tokens
- The token is stored in `~/.git-credentials` on the phone — keep the phone secure

---

## For a Future Skill

Once this is set up, the bot could have a skill like:

```
/deploy-game-collection

Rebuilds the app, commits to git, creates a PR.
```

Inside it would:
1. `npm run build`
2. `git checkout -b deploy-TIMESTAMP`
3. `git add .`
4. `git commit -m "Auto-deploy: [timestamp]"`
5. `git push -u origin deploy-TIMESTAMP`
6. Post the PR URL to Discord for Steve to merge

No zip files, no manual uploads to Cloudflare — fully automated.
