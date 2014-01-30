#!/bin/bash

IN=`cat ~/.dynConnect`
Array=(${IN//:/ })
#echo "${Array[@]}" 
echo "<${Array[0]}>" 
echo "<${Array[1]}>"

account="${Array[0]}"
server="${Array[1]}"
secret="${server}.SecretFile"
url="http://${server}/auth?account=${account}:${secret}"

echo $url

for dir in ~/Dropbox/Dyndoc ~/Dropbox2/Dropbox/Dyndoc
do
echo "${dir}/Secret/${secret}"
if [ -f "${dir}/Secret/${secret}" ]; then

  echo "${dir}/Secret/${secret}"
  cp ${dir}/Secret/${secret} ${dir}/${account}/${secret}

  echo $url

  osascript -e 'on run argv' \
  -e ' tell application "Safari" to activate' \
  -e '  tell application "System Events"' \
  -e '     tell process "Safari"' \
  -e '         click menu item 1 of menu 3 of menu bar 1' \
  -e '      end tell' \
  -e 'end tell' \
  -e ' tell application "Safari"' \
  -e '     set URL of document 1 to item 1 of argv' \
  -e '  end tell' \
  -e '  tell application "System Events"' \
  -e '      tell process "Safari"' \
  -e '          click menu item 1 of menu 5 of menu bar 1' \
  -e '      end tell' \
  -e '  end tell' \
  -e 'end run' \
  ${url}

fi
done