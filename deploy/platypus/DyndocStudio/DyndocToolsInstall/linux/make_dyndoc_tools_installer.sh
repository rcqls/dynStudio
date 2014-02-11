#!/bin/bash

DYNDOCTOOLS=~/dyndoc/tools
DYNDOCTOOLSINSTALL=$DYNDOCTOOLS/.install
# Create temporary folter
rm -fr $DYNDOCTOOLSINSTALL
mkdir -p $DYNDOCTOOLSINSTALL/{R,ruby,chruby,install,studio}
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

echo "Copying gems ..."
cp -r ~/install/$R4RBGEM $DYNDOCTOOLSINSTALL/$R4RBGEM
cp -r ~/install/$DYNDOCRUBYGEM $DYNDOCTOOLSINSTALL/$DYNDOCRUBYGEM
cp -r ~/install/$DYNDOCCLIENTGEM $DYNDOCTOOLSINSTALL/$DYNDOCCLIENTGEM
cp -r ~/install/$DYNDOCSERVERGEM $DYNDOCTOOLSINSTALL/$DYNDOCSERVERGEM
echo "Copying R Packages ..."
cp -r ~/install/$RB4RPACKAGE $DYNDOCTOOLSINSTALL/$RB4RPACKAGE
cp -r ~/install/$DYNDOCPACKAGE $DYNDOCTOOLSINSTALL/$DYNDOCPACKAGE

echo "Copying chruby ..."
cp /usr/local/share/chruby/* $DYNDOCTOOLSINSTALL/chruby/

echo "Copying dyndoc stuff ..."
mkdir -p $DYNDOCTOOLSINSTALL/{etc,demo,doc,bin,studio}
cp -r ~/dyndoc/etc/* $DYNDOCTOOLSINSTALL/etc/
cp -r ~/dyndoc/doc/* $DYNDOCTOOLSINSTALL/doc/
cp -r ~/dyndoc/demo/* $DYNDOCTOOLSINSTALL/demo/
cp -r ~/dyndoc/studio/config.json $DYNDOCTOOLSINSTALL/studio/
cp -r ~/deploy/platypus/DyndocStudio/DyndocToolsBin/linux/* $DYNDOCTOOLSINSTALL/bin/

echo "Copying dyndoc studio binaries ..."
mkdir -p $DYNDOCTOOLSINSTALL/studio
cp -r ~/deploy/grunt/build/releases/dynStudio/linux* $DYNDOCTOOLSINSTALL/studio/

echo "Copying dyndoc studio launch script ..."
cp ~/deploy/platypus/DyndocStudio/DyndocToolsInstall/linux/run_dyndoc_studio.sh $DYNDOCTOOLSINSTALL/bin/DyndocStudio

echo "Copying install script ..."
cp ~/deploy/platypus/DyndocStudio/DyndocToolsInstall/linux/install_dyndoc_tools.sh $DYNDOCTOOLSINSTALL/install.sh

cd $DYNDOCTOOLSINSTALL
tar czvf ~/deploy/installers/linux/install_dyndoc_tools.tar.gz ./*

rm -fr $DYNDOCTOOLSINSTALL