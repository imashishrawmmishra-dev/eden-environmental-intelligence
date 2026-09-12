#!/usr/bin/env python3
"""
desktop_entry.py — PyInstaller and Linux Desktop Launcher script
"""
import os
import sys

def run():
    from app.EDEN_APP import main
    main()

if __name__ == "__main__":
    run()
