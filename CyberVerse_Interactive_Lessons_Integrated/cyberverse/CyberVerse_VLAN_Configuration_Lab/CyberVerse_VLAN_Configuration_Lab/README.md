# CyberVerse — VLAN Configuration Lab

An interactive, offline-friendly learning simulation for VLAN membership and basic Layer 2 connectivity.

## Features
- Assign simulated switch access ports to VLAN 1, 10, 20, or 30
- View an updating topology and port assignment table
- Preview the corresponding Cisco-style access VLAN command
- Test whether two endpoints share a VLAN
- Reset the lab and answer a short knowledge-check question

## Run
1. Extract the ZIP.
2. Open `CyberVerse_VLAN_Configuration_Lab/vlan-configuration.html` in Chrome or another modern browser.
3. Choose a port and VLAN, then select **Assign port**.
4. Use the connectivity test to compare endpoints.

This is a front-end educational simulation. It does not configure real switches or send network traffic. The stylesheet uses Google Fonts when internet access is available and falls back to system fonts otherwise.

## Files
- `vlan-configuration.html` — page structure
- `css/vlan-configuration.css` — styling and responsive layout
- `js/labs/vlan-configuration.js` — simulated VLAN logic, table, connectivity test, and quiz
