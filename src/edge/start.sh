#!/bin/bash
set -eo pipefail

cd /app
npm install --production && npm start