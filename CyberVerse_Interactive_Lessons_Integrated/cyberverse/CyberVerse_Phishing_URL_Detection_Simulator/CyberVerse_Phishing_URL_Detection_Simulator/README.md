# CyberVerse — Phishing URL Detection Simulator

A standalone educational lab for the CyberVerse cybersecurity learning website.

## Features
- CyberVerse dark/neon responsive interface.
- URL parsing and local heuristic checks.
- Explains warning signals in beginner-friendly language.
- Sample training URLs and a one-question knowledge check.
- No network request is made to the URL being inspected.
- No URL is sent to a server or stored by this simulator.
- Keyboard-friendly controls and reduced-motion support.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Enter a URL or select one of the training examples.
4. Read the signals and the safety disclaimer.

No npm install, build step, database, API key, or backend is required for this frontend-only demo.

## Add to the CyberVerse website
Copy `index.html`, `css/style.css`, and `js/simulator.js` into your project, keeping the `css` and `js` paths intact. If your project already has a shared header/footer or global stylesheet, merge the relevant markup/styles rather than duplicating them. Add a navigation link to the lab page from your Practical Labs page.

## Important limitations
This is a training simulator, not a production phishing verdict engine. It uses simple URL-structure heuristics and does not query DNS, threat-intelligence services, certificate records, or live website content. A low score does not mean a URL is safe. A high score is not proof of phishing. Do not open suspicious links to test them.

For a production deployment, add a secure backend integration with a reputable URL reputation service, keep API keys on the server, apply rate limits, and avoid logging submitted URLs unnecessarily.
