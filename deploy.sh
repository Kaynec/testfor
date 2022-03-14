#!/bin/sh

# Build project
npm run build

# Copy files and set env
ssh root@185.18.214.200 "rm -Rf /var/www/production && mkdir -p /var/www/production"
scp -r ./dist/* root@185.18.214.200:/var/www/production/
