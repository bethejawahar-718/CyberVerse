# CyberVerse: "dangerous site" fix checklist

Your code has no malware. The warning is an automatic false positive caused by:
a brand-new `*.vercel.app` address + a password form + hacking-themed wording +
unverifiable claims (10k+ learners, 50+ labs, 24/7 AI mentors).
These files fix the causes you control. Steps 3 and 4 below get the warning removed.

## 1. Fill in your details (required)

Open `about.html` and `privacy.html`. Replace `[Your Name]` and
`[your-email@example.com]` (search for TODO). A named owner with a contact
address is one of the strongest "this is a real site" signals.

## 2. Deploy

Unzip over your project folder (`C:\Users\admin\OneDrive\cyberverse-frontend`).
This pack does NOT include a `.git` folder, so your repo is untouched.

- If you deploy with the Vercel CLI: open PowerShell in the folder and run `vercel --prod`
- If you drag-and-drop in the Vercel dashboard: upload the whole folder again
- If you later connect a GitHub repo: commit everything and push

Then open these on the live site and check they load:
`/index.html`, `/about.html`, `/privacy.html`, `/labs.html`, `/robots.txt`

Keep `googlecf9a98594a2e761b.html` in the root. Do not rename or delete it.

## 3. Ask Google to remove the warning

1. Google Search Console -> your site -> **Security & Manual Actions -> Security issues**.
   If an issue is listed: click **Request review** and say
   "Educational demo site. No malicious content. Added About, Privacy and demo
   notices, removed unverifiable claims."
2. If nothing is listed there: search for Google's **"Report incorrect phishing
   warning"** page, submit `https://cyber-verse-01.vercel.app/`.
3. In Search Console also open **Sitemaps** and submit `sitemap.xml`.
4. Reviews usually take from a few hours to a couple of days.

## 4. If the red page shows in Edge / Windows

Search for Microsoft's **"Report an unsafe site"** page and submit the URL as a
false positive.

## 5. Most reliable long-term fix

Buy a custom domain (.in or .com) and add it in Vercel -> Settings -> Domains.
Then update the two URLs in `robots.txt` and `sitemap.xml`.

## What changed

| File | Change |
|---|---|
| `js/auth.js` | Replaced. Hashed passwords, real login check, safe name display, tolerant of corrupted storage, min password 8 |
| `index.html` | Honest stats and hero text, footer links, meta description, favicon |
| `login.html`, `register.html` | Demo notice, autocomplete attributes, About/Privacy links |
| `dashboard.html` | Footer, `noindex`, "coming soon" tooltips on module buttons |
| `css/pages.css` | NEW. Styles for the notice, footer links, info pages, navbar alignment fix |
| `about.html`, `privacy.html` | NEW |
| `roadmaps.html`, `courses.html`, `labs.html`, `ai-mentors.html` | NEW (your dashboard menu linked to these, they were 404s) |
| `robots.txt`, `sitemap.xml`, `vercel.json` | NEW. Crawler files and basic security headers |
| `css/style.css`, `css/auth.css`, `js/script.js` | Unchanged |

## Good to know

- Existing accounts made with the old version keep working. They are upgraded to
  hashed passwords the first time their owner logs in.
- The old "any email + 6 characters gets in" login is gone. Only accounts
  registered in that browser can log in.
- This is still a front-end demo: accounts live in each visitor's own browser.
  For real logins you need a backend (Firebase Auth or Supabase).
- The module "Start" buttons on the dashboard do nothing yet. They now say
  "coming soon" on hover.
