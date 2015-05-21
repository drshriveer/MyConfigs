###########set up colors#############
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

function color_my_prompt {
    local __user_and_host="\[\033[01;32m\]\u@\h"
    local __cur_location="\[\033[01;34m\]\w"
    local __git_branch_color="\[\033[31m\]"
    #local __git_branch="\`ruby -e \"print (%x{git branch 2> /dev/null}.grep(/^\*/).first || '').gsub(/^\* (.+)$/, '(\1) ')\"\`"
    local __git_branch='`git branch 2> /dev/null | grep -e ^* | sed -E  s/^\\\\\*\ \(.+\)$/\(\\\\\1\)\ /`'
    local __prompt_tail="\[\033[35m\]$"
    local __last_color="\[\033[00m\]"
    export PS1="$__user_and_host $__cur_location $__git_branch_color$__git_branch$__prompt_tail$__last_color "
}

color_my_prompt


#git alias
alias ga="git add --all ."
alias gc="git commit -u"
alias gs="git branch && git status"
alias gd="git diff"
alias gdm="git diff master"
alias gco="git checkout"
alias gcom="git checkout master"

#the u's dude
alias uu="cd ../.. && ls"
alias uuu="cd ../../.. && ls"
alias uuuu="cd ../../../.. && ls"
alias uuuuu="cd ../../../../.. && ls"
function u {
    count=$1
    if [ $# = 0 ]; then
        count=1
    fi
    for ((i = 0; i < count; i++)); do
        cd ../
    done
    ls
}
