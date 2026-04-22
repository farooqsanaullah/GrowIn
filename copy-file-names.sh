#!/bin/bash
find . -type f \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./.git/*" \
  | xclip -selection clipboard
  # > project-files.txt
echo "All file names copied to clipboard!"
