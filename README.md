pages : https://moxhamusic.github.io/responsive-signup-page/signup.html

# WanderPass — Tourist Sign Up / Sign In

A responsive, front-end-only Sign Up and Sign In flow for a tourism site, styled as a
passport/boarding-pass "ticket," ending in a Tourist Landing Page after authentication.

**Live demo:** _add your GitHub Pages link here after deploying (see below)_
**Repo:** _add your GitHub repo link here_

## Pages

| File | Purpose |
|---|---|
| `index.html` | Redirects to `signup.html` |
| `signup.html` | Full Name, Email, Phone, City, Password, Confirm Password — all required, with real-time validation |
| `signin.html` | Email + Password sign-in, checked against accounts created via Sign Up |
| `landing.html` | Tourist Landing Page shown only after a successful sign-in; has a Sign out button |

## How authentication works

This is a static, client-only demo — there's no backend. `js/store.js` saves each
registered account to the browser's `localStorage` (key `wanderpass_users`). Signing in
looks up the email, checks the password matches, and — if it does — starts a
`sessionStorage` session and redirects to `landing.html`. `landing.html` checks for that
session on load and bounces back to `signin.html` if it's missing, so the landing page
can't be reached without signing in first.

> Passwords are stored in plain text in `localStorage` for demo purposes only. A real
> product must never do this — passwords should be hashed and checked on a server.

## Validation rules

- **Full Name, Email, Phone, City, Password, Confirm Password** — all mandatory
- **Email** — standard `name@domain.tld` format
- **Phone** — exactly 10 digits
- **City** — alphabets (and spaces) only
- **Password** — 8+ characters, must include both letters and numbers
- **Confirm Password** — must match Password exactly
- Every field gets instant inline feedback (colored border + message) as you type and on blur, and again on submit
- Both password fields have a Show/Hide toggle

## Responsive design

Built with CSS Grid/Flexbox and `clamp()`/`rem`/`em` sizing throughout, with explicit
breakpoints for:
- Mobile: `max-width: 768px`
- Tablet: `769px – 1024px`
- Desktop: `min-width: 1025px`

## Run it locally

No build step — it's plain HTML/CSS/JS. Just serve the folder, e.g.:

```bash
cd tourist-auth
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `signup.html` directly by double-clicking also works, since everything is
static, but `localStorage` is per-origin so serving it over `http://localhost` is a
closer match to how GitHub Pages will behave.)

## Deploy to GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `wanderpass-auth`).
2. From inside this folder, push it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: WanderPass sign up / sign in"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. Wait a minute, then your site will be live at:
   `https://<your-username>.github.io/<your-repo>/`
7. Add that link and your repo link to the top of this README, and to your assignment
   submission.

## Project structure

```
tourist-auth/
├── index.html
├── signup.html
├── signin.html
├── landing.html
├── css/
│   └── style.css
└── js/
    ├── validators.js   # pure validation functions + field-binding helper
    ├── store.js        # localStorage user store + session handling
    ├── signup.js        # signup page wiring
    ├── signin.js        # signin page wiring
    └── landing.js       # session guard + sign out
```
