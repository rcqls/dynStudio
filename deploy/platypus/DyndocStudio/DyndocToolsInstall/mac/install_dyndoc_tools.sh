#!/bin/bash

# This script is used for Mac

## build inside
DYNDOCTOOLS=/Applications/DyndocStudio.app/Contents/DyndocTools
# Ruby Gems
R4RBVERSION=1.0.0
DYNDOCVERSION=1.6.0
R4RBGEM=~/install/ruby/R4rb-${R4RBVERSION}.gem 
DYNDOCRUBYGEM=~/install/ruby/dyndoc-ruby-${DYNDOCVERSION}.gem
DYNDOCCLIENTGEM=~/install/ruby/dyndoc-client-${DYNDOCVERSION}.gem
DYNDOCSERVERGEM=~/install/ruby/dyndoc-server-${DYNDOCVERSION}.gem
# R Packages
RB4RPACKAGE=~/Github/rb4R/
DYNDOCPACKAGE=~/Github/dyndoc/share/R/dyndoc

echo DYNDOCTOOLS=$DYNDOCTOOLS

RUBYBUILDVERSION=2.1.0 #2.0.0-p353
RUBYVERSION=2.1.0  #2.0.0
RUBYWHERE=$DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION

mkdir -p $DYNDOCTOOLS/chruby

cp /usr/local/share/chruby/* $DYNDOCTOOLS/chruby

mkdir -p $DYNDOCTOOLS/Ruby

echo "Do you want to install ruby source? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then 
	echo "Installing ruby $RUBYVERSION" 
	CONFIGURE_OPTS=--enable-shared RUBY_CFLAGS=-mmacosx-version-min=10.6 ruby-build $RUBYBUILDVERSION $RUBYWHERE
fi

WHERE=$DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION/lib/ruby/gems/$RUBYVERSION

. $DYNDOCTOOLS/chruby/chruby.sh

chruby_use $RUBYWHERE

echo "Switch to $RUBYWHERE..."

#### install gem 
echo "Do you want to install ruby gems? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing ruby gems ..."
	gem install $R4RBGEM $DYNDOCRUBYGEM $DYNDOCCLIENTGEM $DYNDOCSERVERGEM -i ${WHERE}
fi

echo "Do you want to install R packages? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing R packages ..."
	mkdir -p $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION

	R CMD INSTALL --preclean ${RB4RPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
	R CMD INSTALL --preclean ${DYNDOCPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
fi

echo "Do you want to other dyndoc stuff? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing dyndoc stuff ..."
	mkdir -p $DYNDOCTOOLS/install/{etc,demo,doc,studio}
	cp -r ~/dyndoc/etc/* $DYNDOCTOOLS/install/etc/
	cp -r ~/dyndoc/doc/* $DYNDOCTOOLS/install/doc/
	cp -r ~/dyndoc/demo/* $DYNDOCTOOLS/install/demo/
	cp -r ~/dyndoc/studio/config.json $DYNDOCTOOLS/install/studio/
	mkdir -p $DYNDOCTOOLS/bin
	cp -r ~/deploy/platypus/DyndocStudio/DyndocToolsBin/mac/* $DYNDOCTOOLS/bin/
fi
