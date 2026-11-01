# CyberVerse — Subnetting Calculator Lab

A standalone educational IPv4 subnetting calculator built with HTML, CSS, and vanilla JavaScript.

## Features
- Validate IPv4 input and CIDR prefixes from `/0` through `/32`
- Calculate network address, broadcast address, subnet mask, and wildcard mask
- Show first/last address and usable-host count, including special handling for `/31` and `/32`
- Visualize network bits and host bits in binary
- Load sample networks and answer a short knowledge-check question
- Runs locally in your browser; it does not send network traffic

## Run
1. Extract the ZIP file.
2. Open `CyberVerse_Subnetting_Calculator_Lab/subnetting-calculator.html` in Chrome or another modern browser.
3. Enter an IPv4 address, choose a CIDR prefix, and click **Calculate network**.

No installation or backend is required. The stylesheet uses a Google Fonts import when internet access is available; system fonts are used as fallbacks.

## Files
- `subnetting-calculator.html` — page structure
- `css/subnetting-calculator.css` — CyberVerse styling
- `js/labs/subnetting-calculator.js` — calculator logic and quiz
