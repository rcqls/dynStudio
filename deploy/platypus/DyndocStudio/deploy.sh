#!/bin/bash
here=$(dirname $0)
echo "=> building $here/DyndocStudio.app"
platypus -P $here/DyndocStudio.platypus -y $here/DyndocStudio.app
echo "=> copy Info.plist from $here/BundleType"
cp $here/BundleType/Info.plist $here/DyndocStudio.app/Contents/Info.plist
echo "=> move $here/DyndocStudio.app into /Applications"
cp -R $here/DyndocStudio.app /Applications
echo "=> remove $here/DyndocStudio.app"
rm -fr $here/DyndocStudio.app