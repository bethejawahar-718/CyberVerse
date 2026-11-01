# CyberVerse TCP & UDP Simulation Lab (NET-08)

A standalone, responsive learning lab comparing simulated TCP and UDP packet delivery.

## Run
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Select TCP or UDP.
4. Set packet count and simulated loss rate.
5. Optionally enable out-of-order arrival.
6. Click **Run transmission** and inspect the packet journey, summary, and event log.

## Features
- TCP/UDP behavior comparison.
- Configurable packet count and packet-loss percentage.
- Optional out-of-order arrival demonstration.
- Packet visualization with delivery, loss, retransmission, and ordering states.
- Summary counters and explanatory event log.
- Reset controls and responsive CyberVerse styling.

## Important scope note
This is a deterministic educational model, not a complete implementation of TCP or UDP. It does not transmit packets on a real network. Real TCP behavior includes more mechanisms than the simplified retransmission model shown here.

## Integration
Copy `index.html`, `css/style.css`, and `js/tcp-udp-simulator.js` into the matching folders of the CyberVerse project and update paths if necessary.
