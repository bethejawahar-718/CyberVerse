# CyberVerse — Latency & Packet Loss Lab

## Files
- `latency-packet-loss.html` — standalone lab interface
- `css/latency-packet-loss.css` — responsive styling
- `js/labs/latency-packet-loss.js` — adjustable simulated network conditions and packet results

## Run
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Open `latency-packet-loss.html` with Live Server, or open it directly in a modern browser.

## Try it
1. Adjust base latency, jitter, packet loss, and bandwidth.
2. Try Stable, Congested, and Unstable profiles.
3. Click **Run simulation** to generate 20 fictional packet results.
4. Compare average RTT, observed variation, packet loss, delivery rate, and the chart.

Each run is randomized. The results are educational examples, not measurements from a real network. The simulation does not send packets, run ping, or modify network settings.

## Integration
Copy the HTML into your frontend folder, the CSS into your CSS folder, and the JS into `frontend/js/labs/`. Update relative paths if needed.
