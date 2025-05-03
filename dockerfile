FROM python:3.11-slim

WORKDIR /app

# Environmental variables to prevent Python from trying to use version managers
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PATH="/usr/local/bin:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker cache
COPY deployment_requirements.txt .

# Install Python dependencies with optimizations for production
RUN pip install --no-cache-dir --compile -r deployment_requirements.txt

# Copy application code
COPY . .

# Create required directories
RUN mkdir -p uploads/price_images

# Expose the port the app runs on
EXPOSE $PORT

# Add health check preparation command
RUN echo "Optimizing for deployment..."

# Command to run the application with optimized settings for Fly.io
CMD gunicorn --worker-tmp-dir /dev/shm --workers=2 --threads=4 --worker-class=gthread --bind 0.0.0.0:$PORT --reuse-port --timeout 300 --graceful-timeout 120 --keep-alive 5 --max-requests 1000 --max-requests-jitter 50 main:app
