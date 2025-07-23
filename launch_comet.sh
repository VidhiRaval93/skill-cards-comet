#!/bin/bash

echo "🚀 Launching Comet with remote debugging enabled..."
echo "📝 This will open Comet and keep it running for automation"
echo "💡 Keep this terminal open until automation is complete"
echo ""

# Launch Comet with remote debugging
/Applications/Comet.app/Contents/MacOS/Comet --remote-debugging-port=9222

echo ""
echo "✅ Comet launched successfully!"
echo "🔗 Remote debugging available at: http://localhost:9222"
echo "⏳ Keep this terminal open for automation to work" 