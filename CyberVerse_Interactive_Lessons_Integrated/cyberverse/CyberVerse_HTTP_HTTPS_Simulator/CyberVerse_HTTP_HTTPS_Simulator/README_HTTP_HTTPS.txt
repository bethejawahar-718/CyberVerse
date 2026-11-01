CYBERVERSE — HTTP vs HTTPS SECURITY SIMULATOR

Files in this ZIP:
- modules/http-https-simulator.html
- css/http-https-simulator.css
- js/http-https-simulator.js

INSTALL INTO YOUR EXISTING CYBERVERSE PROJECT:
1. Extract this ZIP.
2. Copy the modules, css, and js folders into the existing CyberVerse frontend folder.
3. If asked to merge folders, choose merge. Do not delete your existing files.
4. Open dashboard.html and make sure the Networking module card points to modules/networking.html.
5. Add a link/button inside your existing networking module to:
   http-https-simulator.html
   Example from modules/networking.html:
   <a class="btn primary" href="http-https-simulator.html">Open HTTP vs HTTPS Simulator →</a>
6. Run the site with VS Code Live Server and open the simulator page.

If you use the starter module files from the previous ZIP, the relative paths above work as written.

WHAT WORKS:
- Request builder with GET/POST/PUT/DELETE examples
- Selectable fictional host, path and sample data
- HTTP readable request representation
- HTTPS conceptual TLS-protected payload placeholder
- Reset control and input validation
- Four interactive learning-check questions
- Home, Dashboard and Roadmap navigation

SAFETY / ACCURACY:
This is a local educational simulation. It does not send requests, connect to real websites, or perform actual TLS encryption. The HTTPS panel intentionally uses a placeholder and says so. Never enter real passwords, tokens, or private data.
