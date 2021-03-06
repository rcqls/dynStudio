#!/bin/bash -l

if [[ ! ( -d "$HOME/.bash_profile" ) ]]; then
. $HOME/.bash_profile
fi

RUBYVERSION=2.0.0 # 2.1.0

export DYNDOCROOT=$HOME/dyndoc
export DYNDOCTOOLS=$DYNDOCROOT/tools

# load chruby
. $DYNDOCTOOLS/chruby/chruby.sh

export LD_LIBRARY_PATH=$DYNDOCTOOLS/lib:$LD_LIBRARY_PATH
chruby_use $DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION

# R library for dyndoc 
export R_LIBS=$DYNDOCTOOLS/R/library/ruby-$RUBYVERSION

# log file
mkdir -p $DYNDOCTOOLS/tmp
echo "PATH=$PATH \\n R_LIBS=$R_LIBS\\n"  > $DYNDOCTOOLS/tmp/DyndocStudio.log
echo "GEM_PATH=$GEM_PATH\\n" >>  $DYNDOCTOOLS/tmp/DyndocStudio.log
echo "GEM_HOME=$GEM_HOME" >>  $DYNDOCTOOLS/tmp/DyndocStudio.log
gem env >> $DYNDOCTOOLS/tmp/DyndocStudio.log
ruby -e "p 'DYNDOCTOOLS inside ruby: '+ENV['DYNDOCTOOLS']" >> $DYNDOCTOOLS/tmp/DyndocStudio.log


$DYNDOCROOT/studio/app/dynStudio/dynStudio