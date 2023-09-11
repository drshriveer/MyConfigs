# ===================================================== Environment
export PATH=$PATH:/opt/homebrew/bin

# ls
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad
alias ls='ls -GFh'
alias ezshrc='vim ~/.zshrc && source ~/.zshrc'

# ===================================================== Constants
BAR="--------------------------------------------------"
BAR_B="=================================================="

RED_B="\033[1;31m"
GRN_B="\033[1;32m"
ORJ_B="\033[1;33m"
BLU_B="\033[1;34m"
PRP_B="\033[1;35m"
CYN_B="\033[1;36m"
RED="\033[0;31m"
GRN="\033[0;32m"
ORJ="\033[0;33m"
BLU="\033[0;34m"
PRP="\033[0;35m"
CYN="\033[0;36m"
NC="\033[0m"

function print_red_b() {
  echo -e "${RED_B}$1${NC}"
}
function print_grn_b() {
  echo -e "${GRN_B}$1${NC}"
}
function print_orj_b() {
  echo -e "${ORJ_B}$1${NC}"
}
function print_blu_b() {
  echo -e "${BLU_B}$1${NC}"
}
function print_prp_b() {
  echo -e "${PRP_B}$1${NC}"
}
function print_cyn_b() {
  echo -e "${CYN_B}$1${NC}"
}
function print_red() {
  echo -e "${RED}$1${NC}"
}
function print_grn() {
  echo -e "${GRN}$1${NC}"
}
function print_orj() {
  echo -e "${ORJ}$1${NC}"
}
function print_blu() {
  echo -e "${BLU}$1${NC}"
}
function print_prp() {
  echo -e "${PRP}$1${NC}"
}
function print_cyn() {
  echo -e "${CYN}$1${NC}"
}

# print statements for custom functions
function print_err() {
  echo -e "${RED_B}ERROR:${RED} $1${NC}"
}
function print_wrn() {
  echo -e "${ORJ_B}WARN:${ORJ} $1${NC}"
}
function print_info() {
  echo -e "${CYN_B}INFO:${CYN} $1${NC}"
}

# ===================================================== Prompt
# for zshrc :
PROMPT=$'%{\e[0m\e[1;32m%}%n: %{\e[1;34m%}%~ %{\e[1;31m%}→ %{\e[0;31m%}' 
preexec () { echo -ne "\e[0m" } # reset to default terminal after input

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

# completion source: https://github.com/git/git/blob/master/contrib/completion/git-completion.zsh
#source ~/.git-completion.zsh

alias gc="git commit -u"
alias gca="git commit --amend"
alias gs="git log -n 1 && echo $BAR && git branch && echo $BAR && git status"
alias gd="git diff"
alias gdh="git diff HEAD"
alias gco="git checkout"

function cr {
  BRANCH=`git rev-parse --abbrev-ref HEAD`
  REMOTE_ADDR=`git remote get-url origin`
  git push origin $BRANCH
  open $REMOTE_ADDR
}

function ga {
    if [ $# -eq 0 ]; then
        git add --all .
    else
        git add "$@"
    fi
}

function gdm {
    if [ "`git branch --list main`" ]; then
        git diff main
    else
        git diff master
    fi
}

function gcom {
    if [ "`git branch --list main`" ]; then
        git checkout main
    else
        git checkout master
    fi
}
