#!/usr/bin/env bash
# Exit if any command fails
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt

# (Optional) If textstat fails, force install wheel
pip install --no-cache-dir textstat

# Install Tesseract if not installed (Render auto-detects apt.txt)
