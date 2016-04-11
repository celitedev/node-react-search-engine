#!/bin/bash

function run() {
  tmux select-pane -t $1
  tmux send-keys "$2" C-m
}

if [[ $TMUX ]]; then
  tmux set-option -g mouse on
  tmux new-window
  tmux splitw -h -p 50
  tmux select-pane -t 0
  tmux splitw -v -p 30
  tmux select-pane -t 2
  tmux splitw -v -p 30
  tmux select-pane -t 2
  tmux splitw -v -p 50
  tmux select-pane -t 0
  tmux splitw -v -p 50
  tmux bind q kill-session
  run 0 "./manage.py runserver"
  run 1 "npm run hot"
  run 2 "npm run mobile"
  run 3 "./venv/bin/celery worker -A tutor -l info -B"
  run 4 "./manage.py realtime --tracking --presence --port=6005"
  run 5 "SERVER_RENDERING=1 ./node_modules/.bin/webpack --bail && DEBUG=* node rendering"
else
  tmux new-session $0
fi
