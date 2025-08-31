
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import fitz  # PyMuPDF
import pytesseract
import cv2
import numpy as np
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import textstat
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # local dev
        "https://social-media-content-analyzer.vercel.app"  # deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeReq(BaseModel):
    text: str
    platform: str = "generic"

@app.post("/analyze")
def analyze(req: AnalyzeReq):
    txt = req.text.strip()
    if not txt:
        return JSONResponse(status_code=422, content={"error": "Empty text"})

    # Sentiment
    sid = SentimentIntensityAnalyzer()
    sentiment = sid.polarity_scores(txt)["compound"]

    # Readability
    grade = textstat.flesch_kincaid_grade(txt)

    # Basic counts
    length = len(txt)
    hashtags = txt.count("#")
    mentions = txt.count("@")
    links = len(re.findall(r"https?://\\S+", txt))
    emoji = len(re.findall(r"[\\U0001F300-\\U0001FAFF]", txt))
    cta_present = bool(re.search(r"\\b(comment|like|share|dm|download|join|signup|follow)\\b", txt, re.I))

    scores = {
        "sentiment": sentiment,
        "readability": grade,
        "length_chars": length,
        "hashtags": hashtags,
        "mentions": mentions,
        "emoji": emoji,
        "cta_present": cta_present,
        "links": links,
    }

    # Insights
    insights = []
    if length > 240 and req.platform.lower() in ("twitter", "x"):
        insights.append({"severity": "warn", "message": "Too long for X; keep ≤240 chars."})
    if grade > 10:
        insights.append({"severity": "warn", "message": "Text is complex; target grade 6–9."})
    if not cta_present:
        insights.append({"severity": "info", "message": "Add a clear Call-To-Action (CTA)."})

    # Suggestions
    suggestions = []
    if not cta_present:
        suggestions.append({"type": "cta", "text": "Add: 'Comment GUIDE for details!' "})
    if hashtags < 1:
        suggestions.append({"type": "hashtag", "text": "Add 2–3 relevant hashtags (e.g., #ContentTips)."})

    # ✅ Always return a dict (not None / null)
    return {
        "scores": scores,
        "insights": insights,
        "suggestions": suggestions
    }

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    try:
        text = ""

        if file.filename.endswith(".pdf"):
            # Read PDF with PyMuPDF
            pdf_bytes = await file.read()
            pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page in pdf:
                text += page.get_text("text")

        else:
            # Read image with OpenCV + Tesseract OCR
            img_bytes = np.frombuffer(await file.read(), np.uint8)
            img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            text = pytesseract.image_to_string(img)

        if not text.strip():
            return JSONResponse(status_code=500, content={"error": "No text could be extracted"})

        return {"text": text}

    except Exception as e:
        print("EXTRACT ERROR:", str(e))  # Debug in backend console
        return JSONResponse(status_code=500, content={"error": f"Extraction failed: {str(e)}"})
