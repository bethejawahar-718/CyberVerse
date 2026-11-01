# CyberVerse DNS Simulation Lab (NET-06)

A responsive educational DNS simulator built with HTML5, CSS3, and vanilla JavaScript.

## Run it
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Choose a domain and record type, then click **Run simulation**.
4. Click **Reset** to return to the initial state.

No server, database, API key, or package installation is needed for this standalone lab.

## Included features
- Predefined sample dataset for A, AAAA, CNAME, and MX records.
- Step-by-step simulated lookup path.
- DNS response display and record reference table.
- Domain input validation and missing-record feedback.
- CNAME-to-A demonstration for `alias.test`.
- Responsive layout and keyboard-friendly controls.

## Important
This is a simulation. It does not perform live DNS queries and does not implement a recursive resolver or authoritative DNS server. The `.test` domains and documentation IP ranges are used for educational examples.

## Project integration
Copy `index.html`, `css/style.css`, and `js/dns-simulator.js` into the corresponding parts of your existing CyberVerse frontend. If your project uses a different routing structure, update the stylesheet and script paths accordingly.
