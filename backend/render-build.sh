#!/usr/bin/env bash
set -o errexit  # exit on error

apt-get update && apt-get install -y tesseract-ocr libtesseract-dev
pip install -r requirements.txt
