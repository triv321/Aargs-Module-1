# Aarks Observer Module

This module is an autonomous QA agent component designed to navigate to a URL, scroll to the bottom, capture a full-page screenshot, and extract a simplified DOM tree.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Start the Test Server
To run the local test server:
```bash
npm run server
```
This will start a server at `http://localhost:8080`.

### Run the Observer
To run the observer agent:
```bash
npm run observe [URL]
```
If no URL is provided, it defaults to `http://localhost:8080`.

Example:
```bash
npm run observe https://example.com
```

## Output
Artifacts are saved in the `artifacts/` directory:
- `baseline_YYYY-MM-DD_HH-MM-SS.png`: Full-page screenshot.
- `dom_YYYY-MM-DD_HH-MM-SS.json`: Simplified DOM tree.

## Project Structure
- `src/observer.js`: Main entry point.
- `src/utils/`: Utility modules for scrolling, DOM extraction, logging, and artifact saving.
- `src/config.js`: Configuration constants.
