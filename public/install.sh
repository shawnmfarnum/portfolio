#!/bin/bash

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
PINK='\033[0;35m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}  ┌─────────────────────────────────────────┐${NC}"
echo -e "${CYAN}${BOLD}  │         shawn.sh — installing...         │${NC}"
echo -e "${CYAN}${BOLD}  └─────────────────────────────────────────┘${NC}"
echo ""

sleep 0.3
echo -e "  ${DIM}[01]${NC} ${GREEN}▸${NC} Loading profile data...        ${GREEN}✓${NC}"
sleep 0.3
echo -e "  ${DIM}[02]${NC} ${GREEN}▸${NC} Fetching case studies...        ${GREEN}✓${NC}"
sleep 0.3
echo -e "  ${DIM}[03]${NC} ${GREEN}▸${NC} Compiling design system...      ${GREEN}✓${NC}"
sleep 0.3
echo -e "  ${DIM}[04]${NC} ${GREEN}▸${NC} Rendering portfolio...          ${GREEN}✓${NC}"
sleep 0.2

echo ""
echo -e "  ${PINK}${BOLD}Shawn Farnum${NC} — UI/UX Designer · Software Developer"
echo -e "  ${DIM}Bozeman, MT · 45.6770°N, 111.0429°W${NC}"
echo ""

# Open portfolio in default browser
URL="https://shawnfarnum.com"

if command -v xdg-open &> /dev/null; then
  xdg-open "$URL" &> /dev/null &
elif command -v open &> /dev/null; then
  open "$URL"
elif command -v start &> /dev/null; then
  start "$URL"
else
  echo -e "  ${CYAN}▸${NC} Visit: ${BOLD}${URL}${NC}"
fi

echo -e "  ${GREEN}${BOLD}✓ Portfolio loaded.${NC} Opening in browser..."
echo ""
