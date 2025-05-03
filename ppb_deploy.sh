#!/bin/bash

# Deploy script for Plumbers Price Book (PPB) application
# This script combines all optimizations to overcome timeout issues

# Step 1: Set maximum deployment timeout (30 minutes)
TIMEOUT=1800

# Step 2: Choose a powerful machine size
VM_SIZE="performance-2x"

# Step 3: Choose a reliable region (Silicon Valley)
REGION="sjc"

# Step 4: Set app name
APP_NAME="ppb"

# Display deployment info
echo "Deploying $APP_NAME with maximum timeout ($TIMEOUT seconds)"
echo "Using VM size: $VM_SIZE in region: $REGION"
echo "Starting deployment with immediate strategy..."

# Execute the deployment command with maximum timeout and immediate strategy
fly deploy -a $APP_NAME \
  --wait-timeout $TIMEOUT \
  --strategy immediate \
  --vm-size $VM_SIZE \
  --region $REGION \
  --dockerfile Dockerfile

# Check deployment status
RESULT=$?
if [ $RESULT -eq 0 ]; then
  echo "Deployment successful! App is now live at: https://$APP_NAME.fly.dev"
else
  echo "Deployment failed with error code: $RESULT"
  echo "Checking logs for more information..."
  fly logs -a $APP_NAME
fi
