echo "starting deployment script..."

set -e

APP_NAME="auth_service"
APP_DIR="/home/ubuntu/PiniY_Auth_Service"
BRANCH="main"

echo "Navigating to application directory..."
cd $APP_DIR

echo "Pulling latest changes from $BRANCH branch..."
git checkout $BRANCH
git pull origin $BRANCH

echo "Stopping existing PM2 process"
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true

echo "Installing dependencies..."
npm install

npx prisma generate
npx prisma migrate deploy

echo "Building the application..."
npm run build

echo "Restarting the application using PM2..."
pm2 restart $APP_NAME || pm2 start dist/server.js --name $APP_NAME

echo "Saving PM2 process list"
pm2 save


pm2 status

echo "Deployment completed successfully."
echo "Deployment script finished."
