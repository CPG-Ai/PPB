Colorado Plumbers Guild Application
A comprehensive plumbing business management application with web scraping, AI analysis, and business operations tools.

Features
Price Catalog Management: Upload and extract pricing data from catalog images using OCR
Ferguson Price Integration: Access Ferguson pricing data through APIs
Business Operations: Manage quotes, appointments, invoices, and email communications
CPGAi Integration: Utilize custom GPT model for plumbing expertise
SEER Feature: Extract product information from images and videos
Firebase Integration: Store and access product and business data
Deployment to Fly.io
This application is configured for deployment to Fly.io.

Prerequisites
Install Fly CLI:

curl -L https://fly.io/install.sh | sh
Authenticate with Fly.io:

fly auth login
Deployment Steps
Rename deployment_requirements.txt to requirements.txt for deployment:

cp deployment_requirements.txt requirements.txt
Install system dependencies (required for Dockerfile):

sudo apt-get update && sudo apt-get install -y tesseract-ocr
Create the Fly app:

fly apps create colorado-plumbers-guild
Set required secrets:

fly secrets set FIREBASE_PROJECT_ID=your_project_id
fly secrets set FIREBASE_API_KEY=your_api_key
fly secrets set FIREBASE_APP_ID=your_app_id
fly secrets set FIREBASE_SERVICE_ACCOUNT='your_service_account_json'
fly secrets set SESSION_SECRET=your_session_secret
fly secrets set DATABASE_URL=your_database_url
fly secrets set OPENAI_API_KEY=your_openai_api_key
Deploy the application:

fly deploy
Open the deployed application:

fly open
Post-Deployment
After deployment, you need to add the following URLs to your Firebase application's authorized domains:

colorado-plumbers-guild.fly.dev
Your custom domain (if applicable)
For custom domain setup:

fly certs add your-custom-domain.com
Local Development
Install Python dependencies:

pip install -r requirements.txt
Set environment variables (or use .env file)

Run the application:

python main.py
Application Structure
app.py: Core application configuration
main.py: Application entry point
models.py: Database models
firebase_helper.py: Firebase integration utilities
price_upload_routes.py: Price catalog management endpoints
api_routes.py: API endpoints for data access
seer_helper.py: SEER feature utilities
templates/: HTML templates
static/: Static assets (CSS, JS, images)
uploads/: Storage for uploaded files
License
Proprietary - Colorado Plumbers Guild
