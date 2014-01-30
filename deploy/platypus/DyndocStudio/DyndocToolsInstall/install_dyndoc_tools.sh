#!/bin/bash

# This script is used for Mac and Linux

if [[ $(uname) == "Darwin" ]]; then
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
else
	DYNDOCTOOLS=~/dyndoc/tools
	# Ruby Gems
	R4RBVERSION=1.0.0
	DYNDOCVERSION=1.6.0
	R4RBGEM=./ruby/R4rb-${R4RBVERSION}.gem 
	DYNDOCRUBYGEM=./ruby/dyndoc-ruby-${DYNDOCVERSION}.gem
	DYNDOCCLIENTGEM=./ruby/dyndoc-client-${DYNDOCVERSION}.gem
	DYNDOCSERVERGEM=./ruby/dyndoc-server-${DYNDOCVERSION}.gem
	# R Packages
	RB4RPACKAGE=./R/rb4R_0.1.0.tar.gz
	DYNDOCPACKAGE=./R/dyndoc_0.1.0.tar.gz
fi

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
	#CONFIGURE_OPTS=--enable-shared RUBY_CFLAGS=-mmacosx-version-min=10.6 ruby-build $RUBYBUILDVERSION $RUBYWHERE
fi

WHERE=$DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION/lib/ruby/gems/$RUBYVERSION

. $DYNDOCTOOLS/chruby/chruby.sh

chruby_use $RUBYWHERE

#### install gem 
echo "Do you want to install ruby gems? [YES|no]";read OK
if [[ $OK != "no" ]]; then
	echo "Installing ruby gems ..."
	gem install $R4RBGEM $DYNDOCRUBYGEM $DYNDOCCLIENTGEM $DYNDOCSERVERGEM -i ${WHERE}
fi

echo "Do you want to install R packages? [YES|no]";read OK
if [[ $OK != "no" ]]; then
	echo "Installing R packages ..."
	mkdir -p $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION

	R CMD INSTALL --preclean ${RB4RPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
	R CMD INSTALL --preclean ${DYNDOCPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
fi

echo "Do you want to other dyndoc stuff? [YES|no]";read OK
if [[ $OK != "no" ]]; then
	echo "Installing dyndoc stuff ..."
	mkdir -p $DYNDOCTOOLS/install/{etc,demo,doc}
	cp -r ~/dyndoc/etc/* $DYNDOCTOOLS/install/etc
	cp -r ~/dyndoc/doc/* $DYNDOCTOOLS/install/doc
	cp -r ~/dyndoc/demo/* $DYNDOCTOOLS/install/demo
fi
