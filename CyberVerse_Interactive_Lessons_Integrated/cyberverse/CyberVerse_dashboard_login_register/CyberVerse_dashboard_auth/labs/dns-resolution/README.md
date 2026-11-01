# CyberVerse — DNS Resolution Lab

A standalone, educational frontend simulation of a DNS lookup.

## Files
- `dns-resolution.html` — lab page and UI
- `css/dns-resolution.css` — responsive dark CyberVerse theme
- `js/labs/dns-resolution.js` — simulated lookup and quiz interactions

## Run it
1. Extract the ZIP.
2. Open `dns-resolution.html` in a modern browser.
3. Enter a domain name and select a DNS record type.
4. Click **Resolve domain** and follow the stages.
5. Answer the quick-check question.

## Learning goals
- Understand the purpose of DNS.
- Recognize the roles of recursive resolvers, root servers, TLD servers, and authoritative servers.
- Identify A, AAAA, MX, and CNAME record types.
- Understand that caching can shorten a DNS lookup.

## Notes
- All query results are illustrative and simulated; no real DNS lookup is performed.
- `198.51.100.42` and `2001:db8::42` are documentation/example addresses.
- Google Fonts are optional; system fonts are used as fallbacks.
