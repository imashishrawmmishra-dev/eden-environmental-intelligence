#!/usr/bin/env python3
"""
EDEN Desktop Application Entry Point (app/EDEN_APP.py)
Cross-platform Desktop Launcher using PyWebView / Native Web Engine
"""

import sys
import os
import threading
import time

def start_backend():
    """Starts local embedded FastAPI / Express server if not already running"""
    try:
        import uvicorn
        from backend.app import app
        uvicorn.run(app, host="127.0.0.1", port=3000, log_level="warning")
    except ImportError:
        print("[EDEN Desktop] Using remote or pre-launched backend on http://localhost:3000")

def main():
    print("====================================================================")
    print("  EDEN — Explore, Discover, Educate, Nurture (Desktop Edition)     ")
    print("  Environmental Intelligence & Knowledge Graph Engine               ")
    print("====================================================================")

    # Start background daemon if standalone
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    time.sleep(0.5)

    target_url = os.getenv("EDEN_DESKTOP_URL", "http://localhost:3000")

    try:
        import webview
        print(f"[EDEN Desktop] Launching native window displaying: {target_url}")
        window = webview.create_window(
            title="EDEN — Environmental Intelligence & Learning",
            url=target_url,
            width=1280,
            height=860,
            min_size=(900, 600),
            confirm_close=True
        )
        webview.start()
    except ImportError:
        import webbrowser
        print(f"[EDEN Desktop] pywebview not installed. Opening system default browser at {target_url}...")
        webbrowser.open(target_url)

if __name__ == "__main__":
    main()
