# Deployment Guide for Colorado Plumbers Guild

This document provides instructions for deploying the Colorado Plumbers Guild application to Fly.io.

## Prerequisites

1. Install the Fly.io CLI tools
2. Have an active Fly.io account
3. Be logged in to Fly.io via the CLI

## Deployment Steps

### 1. Ensure all environment variables are set

Before deploying, make sure all required secrets are set in Fly.io:

```bash
# Set database URL (provided by Fly.io if you created a Postgres database through them)
fly secrets set DATABASE_URL=postgres://username:password@host:port/database

# Set Firebase credentials
fly secrets set FIREBASE_PROJECT_ID=colorado-plumbers-guild
fly secrets set FIREBASE_API_KEY=your-api-key
fly secrets set FIREBASE_APP_ID=your-app-id
fly secrets set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account", ...}'

# Set OpenAI API key
fly secrets set OPENAI_API_KEY=your-openai-api-key

# Set session secret
fly secrets set SESSION_SECRET=your-secret-key
```

### 2. Deploy using the command line

```bash
# Deploy using the current configuration with maximum timeout (30 minutes)
fly deploy --wait-timeout 1800 --strategy immediate
```

### 3. Monitor the deployment

```bash
# Check deployment status
fly status

# View logs
fly logs

# Monitor the app
fly monitor
```

### 4. Troubleshooting

If you encounter deployment issues:

1. **Timeout Issues**: If the app takes too long to start up, try these solutions:
   - Use maximum timeout: `fly deploy --wait-timeout 1800` (30 minutes is the maximum)
   - Deploy to a different region: `fly deploy --region sjc` (Silicon Valley region often has better performance)
   - Use larger VM sizes: `fly deploy --vm-size performance-2x`
   - Deploy with the immediate strategy: `fly deploy --strategy immediate`
   - Combine all options: `fly deploy --wait-timeout 1800 --strategy immediate --region sjc --vm-size performance-2x`

2. **Slow Startup**: If app initialization is slow:
   - Increase the health check grace period in fly.toml
   - Make initialization processes asynchronous
   - Ensure database migrations don't block app startup
   - Consider reducing the number of dependencies

3. **General Issues**:
   - Check the logs using `fly logs`
   - Verify all secrets are set correctly with `fly secrets list`
   - Test the health check endpoint after deployment
   - Ensure the Dockerfile is being used correctly

## Deployment Configuration Files

The deployment uses the following configuration files:

- `fly.toml` - Main Fly.io configuration
- `Dockerfile` - Container definition
- `Procfile` - Process definition
- `.dockerignore` - Files to exclude from container
- `.flyignore` - Files to exclude from Fly.io deployment

## Verifying Deployment

After deployment, verify the application is working by:

1. Checking the health endpoint: `https://colorado-plumbers-guild.fly.dev/health`
2. Accessing the main page: `https://colorado-plumbers-guild.fly.dev`

## Scaling the Application

If needed, you can scale the application using:

```bash
fly scale count 2  # Increase to 2 instances
```
