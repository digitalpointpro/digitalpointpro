#!/bin/bash
# Only restart if server is truly down (not just slow)
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/ 2>/dev/null)
if [ "$RESPONSE" != "200" ] && [ "$RESPONSE" != "000" ]; then
  echo "[$(date)] Server error: $RESPONSE, restarting..." >> /home/z/my-project/dev.log
  pkill -f "next dev" 2>/dev/null
  pkill -f "next-server" 2>/dev/null
  sleep 3
  cd /home/z/my-project && nohup npx next dev -p 3000 -H 0.0.0.0 >> /home/z/my-project/dev.log 2>&1 &
  disown
elif [ "$RESPONSE" = "000" ]; then
  # Connection refused - server truly not running
  # Check if next-server process exists
  if ! pgrep -f "next-server" > /dev/null; then
    echo "[$(date)] Server process dead, restarting..." >> /home/z/my-project/dev.log
    cd /home/z/my-project && nohup npx next dev -p 3000 -H 0.0.0.0 >> /home/z/my-project/dev.log 2>&1 &
    disown
  fi
fi
