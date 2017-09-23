EDITOR="vim"
alias vi="vim"
alias ezbash='vim ~/.bash_profile && source ~/.bash_profile'
alias subl='/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl -W'

# ===================================================== Constants
BAR="--------------------------------------------------"
BAR_B="=================================================="
GRN_B="\033[1;32m"
BLU_B="\033[1;34m"
RED_B="\033[1;31m"
YLO_B="\033[1;33m"
GRN="\033[0;32m"
BLU="\033[0;34m"
RED="\033[0;31m"
YLO="\033[0;33m"
NC="\033[0m"

function print_err() {
  echo -e "${RED_B}ERROR:${RED} $1${NC}"
}

# ===================================================== Prompt
# for zshrc :
# PROMPT=$'%{\e[0m\e[1;32m%}%n: %{\e[1;34m%}%~ %{\e[1;31m%}→ %{\e[0;31m%}' 
# preexec () { echo -ne "\e[0m" } # reset to default terminal after input

PS1="\[${GRN_B}\]\u: \[${BLU_B}\]\w \[${RED_B}\]→ \[${RED}\]"
PS2="\[${YLO_B}\] → \[${NC}\]"
trap 'tput sgr0' DEBUG # reset to default terminal after input

# reset to default terminal settings after input
trap 'tput sgr0' DEBUG 

# ls colors
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad
alias ls='ls -GFh'

# =====================================================  u's
function u {
    count=$1
    if [ $# = 0 ]; then
       count=1
    fi
    for ((i =0; i < count; i++)); do
       cd ../
    done
    ls
}
alias uu="cd ../.. && ls"
alias uuu="cd ../../.. && ls"
alias uuuu="cd ../../../.. && ls"
alias uuuuu="cd ../../../../.. && ls"

# ===================================================== git alias

alias gc="git commit -u"
alias gca="git commit --amend"
alias gs="git log -n 1 && echo "$BAR" && git branch && echo "$BAR" && git status"
alias gd="git diff"
alias gdh="git diff HEAD"
alias gco="git checkout"

function ga {
    if [ $# -eq 0 ]; then
        git add --all .
    else
        git add "$@"
    fi
}

function gdm {
    if [ "`git branch --list mainline`" ]; then
        git diff mainline
    else
        git diff master
    fi
}

function gcom {
    if [ "`git branch --list mainline`" ]; then
        git checkout mainline
    else
        git checkout master
    fi
}

