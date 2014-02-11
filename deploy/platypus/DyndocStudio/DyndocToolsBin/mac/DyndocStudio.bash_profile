 

# if [[ ! ( -d "$HOME/.bash_profile" ) ]]; then
# . $HOME/.bash_profile
# fi

RUBYVERSION=2.1.0 #2.0.0 

RESOURCESDIR=/Applications/DyndocStudio.app/Contents/MacOS
DYNDOCTOOLS=$RESOURCESDIR/../DyndocTools
export DYNDOCTOOLS
export DYNDOCROOT=$HOME/dyndoc

# load chruby
. $DYNDOCTOOLS/chruby/chruby.sh

export DYLD_FALLBACK_LIBRARY_PATH=$DYNDOCTOOLS/lib:$DYLD_FALLBACK_LIBRARY_PATH
chruby_use $DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION

# R library for dyndoc 
export R_LIBS=$DYNDOCTOOLS/R/library/ruby-$RUBYVERSION

# for latex (if necessary for pdflatex)
if [[ ! ( -d "/usr:texbin" ) ]]; then
	export PATH=$PATH:/usr/texbin
fi

# log file
mkdir -p $DYNDOCTOOLS/tmp
echo "PATH=$PATH \\n R_LIBS=$R_LIBS\\n"  > $DYNDOCTOOLS/tmp/DyndocStudio.log
echo "GEM_PATH=$GEM_PATH\\n" >>  $DYNDOCTOOLS/tmp/DyndocStudio.log
echo "GEM_HOME=$GEM_HOME" >>  $DYNDOCTOOLS/tmp/DyndocStudio.log
gem env >> $DYNDOCTOOLS/tmp/DyndocStudio.log
ruby -e "p 'DYNDOCTOOLS inside ruby: '+ENV['DYNDOCTOOLS']" >> $DYNDOCTOOLS/tmp/DyndocStudio.log

# check if userdyndoc directory exists
if [[ ! ( -d "$DYNDOCROOT" ) ]]; then
	mkdir -p $DYNDOCROOT/{etc,doc,demo}
	mkdir -p $DYNDOCROOT/server/{rooms,run}
	cp -R $DYNDOCTOOLS/install/etc/* $DYNDOCROOT/etc
	cp -R $DYNDOCTOOLS/install/doc/* $DYNDOCROOT/doc
	cp -R $DYNDOCTOOLS/install/demo/* $DYNDOCROOT/demo
fi