from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
import io
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate(json.loads(os.environ["FIREBASE_KEY"]))
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return "Kadabra Pricing API running."

@app.route("/upload", methods=["POST"])
def upload_image():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(io.BytesIO(file.read()))
    text = pytesseract.image_to_string(image)

    # Dummy parse & upload
    doc = {"raw_text": text, "source": "Kadabra API"}
    db.collection("PPB").add(doc)

    return jsonify({"message": "Uploaded to Firebase", "text": text})
