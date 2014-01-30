#!/bin/bash
APPL=DyndocStudio
here=$(dirname $0)
cd $here
if [[ -d "$APPL.app" ]]; then 
	rm -fr $APPL.app 
fi
if [[ -f "$APPL.dmg" ]]; then 
	rm -fr $APPL.dmg 
fi
cp ~/deploy/appdmg/common/Test*.* .
cp -r /Applications/$APPL.app .
appdmg appdmg.json $APPL.dmg
rm -fr $APPL.app
rm Test*.*
mv $APPL.dmg ~/deploy/installers/mac/