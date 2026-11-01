CYBERVERSE — AUTH PAGES + DASHBOARD STARTER

Included:
- index.html: homepage with module cards
- login.html: login form UI and validation messaging
- register.html: registration form UI and password confirmation
- dashboard.html: module dashboard, search, progress placeholders
- roadmap.html: learning roadmap
- css/style.css: responsive dark/neon design
- js/app.js: shared module list and navigation links
- js/auth.js: frontend-only form validation
- modules/: connected starter pages with Home/Dashboard/Roadmap links

HOW TO RUN:
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Run index.html using Live Server, or serve the folder through a local web server.
4. From Home, choose Create account or Dashboard. Open any module and use Home/Dashboard to return.

IMPORTANT:
Authentication is not secure or functional until connected to a backend. This starter intentionally does not store passwords in localStorage or pretend to authenticate users. Implement POST /api/auth/register and POST /api/auth/login in Node.js/Express or PHP, hash passwords with a suitable password-hashing function, use secure sessions/cookies, validate inputs server-side, and store users in MySQL. Dashboard progress needs authenticated API endpoints and real database records. The module pages are linked starter pages, not completed lesson/lab implementations.

The module filenames follow the CyberVerse project plan. If your existing module files use different names, update their href values in js/app.js and the navigation links in each module page.
