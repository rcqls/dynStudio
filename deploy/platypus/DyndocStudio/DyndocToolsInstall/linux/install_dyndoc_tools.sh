#!/bin/bash

# NB: requirement ruby-build, openssl ssl-dev gmp10 gmp10-dev

# This script is used for  Linux

DYNDOCTOOLS=~/dyndoc/tools
DYNDOCTOOLSINSTALL=.

# Ruby Gems
R4RBVERSION=1.0.0
DYNDOCVERSION=1.6.0
R4RBGEM=ruby/R4rb-${R4RBVERSION}.gem 
DYNDOCRUBYGEM=ruby/dyndoc-ruby-${DYNDOCVERSION}.gem
DYNDOCCLIENTGEM=ruby/dyndoc-client-${DYNDOCVERSION}.gem
DYNDOCSERVERGEM=ruby/dyndoc-server-${DYNDOCVERSION}.gem
# R Packages
rb4RVERSION=0.1.0
dyndocVERSION=0.1.0
RB4RPACKAGE=R/rb4R_$rb4RVERSION.tar.gz
DYNDOCPACKAGE=R/dyndoc_$dyndocVERSION.tar.gz


echo DYNDOCTOOLS=$DYNDOCTOOLS

RUBYBUILDVERSION=2.0.0-p353;RUBYVERSION=2.0.0
#RUBYBUILDVERSION=2.1.0;RUBYVERSION=2.1.0

RUBYWHERE=$DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION

mkdir -p $DYNDOCTOOLS/chruby

cp $DYNDOCTOOLSINSTALL/chruby/* $DYNDOCTOOLS/chruby/

mkdir -p $DYNDOCTOOLS/Ruby

echo "Do you want to install ruby source? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "check ruby-build install"
	checkRubyBuild=$(ruby-build --version)
	if [[ "$checkRubyBuild" != "" ]]; then 
		echo "Installing ruby $RUBYVERSION" 
		CONFIGURE_OPTS=--enable-shared ruby-build $RUBYBUILDVERSION $RUBYWHERE
	else
		echo "Install ruby-build first. Try this:"
		echo "git clone https://github.com/sstephenson/ruby-build.git"
		echo "cd ruby-build"
		echo "./install.sh" 
		exit
	fi
fi

WHERE=$DYNDOCTOOLS/Ruby/ruby-$RUBYVERSION/lib/ruby/gems/$RUBYVERSION

. $DYNDOCTOOLS/chruby/chruby.sh

chruby_use $RUBYWHERE

#### install gem 
echo "Do you want to install ruby gems? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing ruby gems ..."
	gem install $R4RBGEM $DYNDOCRUBYGEM $DYNDOCCLIENTGEM $DYNDOCSERVERGEM -i ${WHERE} --no-ri --no-rdoc
fi

echo "Do you want to install R packages? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing R packages ..."
	mkdir -p $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION

	R CMD INSTALL --preclean ${RB4RPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
	R CMD INSTALL --preclean ${DYNDOCPACKAGE} -l $DYNDOCTOOLS/R/library/ruby/$RUBYVERSION
fi

echo "Do you want to install other dyndoc stuff? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing dyndoc stuff ..."
	mkdir -p $DYNDOCTOOLS/../{etc,demo,doc,bin}
	mkdir -p $DYNDOCTOOLS/../server/{rooms,run}
	cp -r $DYNDOCTOOLSINSTALL/etc/* $DYNDOCTOOLS/../etc/
	cp -r $DYNDOCTOOLSINSTALL/doc/* $DYNDOCTOOLS/../doc/
	cp -r $DYNDOCTOOLSINSTALL/demo/* $DYNDOCTOOLS/../demo/
	cp -r $DYNDOCTOOLSINSTALL/bin/* $DYNDOCTOOLS/../bin/
fi

echo "Do you want to install dyndoc studio stuff? [yes|NO]";read OK
if [[ $OK == "yes" ]]; then
	echo "Installing dyndoc studio ..."
	linux=linux32
	archlinux=$(ruby -rrbconfig -e "puts RbConfig::CONFIG['build_cpu']")
	echo "archlinux=$archlinux"
	if [[ "$archlinux" == "x86_64" ]]; then 
		linux=linux64
	fi
	mkdir -p $DYNDOCTOOLS/../studio/app
	cp -r $DYNDOCTOOLSINSTALL/studio/* $DYNDOCTOOLS/../studio/
	cp -r $DYNDOCTOOLSINSTALL/studio/$linux/* $DYNDOCTOOLS/../studio/app
fi
