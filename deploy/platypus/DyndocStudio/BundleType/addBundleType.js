var fs=require("fs");

var plist=require("plist");

var bundleType=[{
	"CFBundleTypeExtensions": ["dyn","dyn_tex","dyn_html"],
	"CFBundleTypeIconFile": "appIcon.icns",
	"CFBundleTypeName": "Dyndoc template document",
	"CFBundleTypeRole": "Editor",
	"LSItemContentTypes": ["com.application.dyndoc"],
	"LSHandlerRank": "Owner"
}]

var infoPlist=plist.parseFileSync("/Applications/DyndocStudio.app/Contents/info.plist");

infoPlist.CFBundleDocumentTypes=bundleType;

fs.writeFileSync("Info.plist",plist.build(infoPlist),"utf-8");