FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker cache
COPY deployment_requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r deployment_requirements.txt

# Copy application code
COPY . .

# Create required directories
RUN mkdir -p uploads/price_images

# Expose the port the app runs on
EXPOSE $PORT

# Command to run the application
CMD gunicorn --worker-tmp-dir /dev/shm --workers=2 --threads=4 --worker-class=gthread --bind 0.0.0.0:$PORT --reuse-port main:app
