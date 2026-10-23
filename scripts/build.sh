#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist/server dist/.openai
node -e "const fs=require('fs');const html=fs.readFileSync('worker/index.html','utf8').replace('<!--SCRIPT-->','<script>'+fs.readFileSync('worker/client.js','utf8')+'</script>');fs.writeFileSync('dist/server/index.js','const page='+JSON.stringify(html)+';\n'+fs.readFileSync('worker/index.js','utf8').replace(\"import page from './page.js';\",''))"
cp .openai/hosting.json dist/.openai/hosting.json
cp -r drizzle dist/.openai/drizzle
