#!/bin/bash
here=$(dirname $0)
echo "=> building $here/DynConnect.app"
platypus -P $here/DynConnect.platypus -y $here/DynConnect.app
echo "=> move $here/DynConnect.app into /Applications"
cp -R $here/DynConnect.app /Applications
echo "=> remove $here/DynConnect.app"
rm -fr $here/DynConnect.app