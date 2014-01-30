//'use strict';
    var gui = require('nw.gui');
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    var exec = require('child_process').exec;
    var execFile = require('child_process').execFile;
    var touch = require("touch");
    var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    //default DYNDOCROOT if undefined
    if (process.env.DYNDOCROOT === undefined) process.env.DYNDOCROOT=path.join(homepath,"dyndoc");
    var studioRoot = path.join(process.env.DYNDOCROOT,"studio");
    var studioCurrentFile = path.join(studioRoot,".currentFile");
    var studioConfigJson = path.join(studioRoot,"config");
    var studioCfg={},themeIndex=-1;
    var studioDyndocJson = path.join(studioRoot,os.platform(),"dyndoc");
    var cmds = {};

    function resolvePath (string) {
        if (string.substr(0,1) === '~') string = homepath + string.substr(1);
        //replace $VAR/ or $VAR\ with process.env["VAR"]+path.sep
        console.log("DYNDOCROOT:"+process.env.DYNDOCROOT);
        //if (string.substr(0,12) === '$DYNDOCROOT'+path.sep) string = process.env.DYNDOCROOT + path.sep + string.substr(12);
        string = string.replace(/\$([^\$\\\/]*)[\/\\]+/g,function(match,c) {return process.env[c]+path.sep;})
        if (os.platform() == "win32") string=string.split("/").join(path.sep);
      return path.resolve(string)
    }

    function config(write) {
        if(write) {
            fs.writeFileSync(studioConfigJson+".json",JSON.stringify(studioCfg,null,'\t'));
        } else {
            if (fs.existsSync(studioConfigJson+".json")) studioCfg=JSON.parse(fs.readFileSync(studioConfigJson+".json"));
            if (studioCfg.acethemes === undefined) studioCfg.acethemes=fs.readdirSync("ace").filter(function(e) {return e.substring(0,6)=="theme-";}).map(function(e) {return e.substring(6,e.length-3);});
            console.log(studioCfg.acethemes);
            if (studioCfg.acetheme === undefined) studioCfg.acetheme=studioCfg.acethemes.indexOf('solarized_light');
            console.log(studioCfg.acetheme+":"+studioCfg.acethemes[studioCfg.acetheme]);
            if (studioCfg.acefontsize === undefined) studioCfg.acefontsize=14;

        } 
    }

    function setTheme(change) {
        if(change) {
            if ( ++studioCfg.acetheme == studioCfg.acethemes.length) studioCfg.acetheme=0;
        }
        editor.setTheme("ace/theme/"+studioCfg.acethemes[studioCfg.acetheme]); 
    }

    console.log("dyndoc.json path: "+studioDyndocJson);
    if (fs.existsSync(studioDyndocJson+".json")) {
        cmds = JSON.parse(fs.readFileSync(studioDyndocJson+".json"));
        console.log("commands before:"+JSON.stringify(cmds,null,"\t"));
        cmds.dyndoc.ruby = resolvePath(cmds.dyndoc.ruby.join(path.sep));
        cmds.dyndoc.client = resolvePath(cmds.dyndoc.client.join(path.sep));
        cmds.dyndoc.server = resolvePath(cmds.dyndoc.server.join(path.sep));
        console.log("commands after:"+JSON.stringify(cmds,null,"\t"));
    } else {
        cmds.dyndoc = {ruby: "dyndoc-ruby", client: "dyndoc-client", server: "dyndoc-daemon"};
    }

    function readDynFile(filename,newfile) {
        if(newfile === undefined) newfile=false;
        if(fs.existsSync(filename)) editor.getSession().setValue(fs.readFileSync(filename, "utf8"));
        else if(newfile) {
            editor.getSession().setValue("");
        } else console.log("Warning: "+filename+" does not exist!");
    }

    function saveDynFile(filename) {
        fs.writeFileSync(filename,editor.getSession().getValue().replace(/\r\n/g,"\n"), "utf8");
    }

    function readPdf(filename) {
        var pdfview = window.frames[0].PDFView; //PDFView from iframe
        var pdfBuf;
        pdfBuf=new Uint8Array(fs.readFileSync(filename));
        pdfview.open(pdfBuf, 0);
        pdfview.setTitleUsingUrl(path.basename(filename));
    }

    function initFile(filename,mode) {
        if(mode===undefined) mode='old';
        //pdf
        if(mode === 'old') {
            win.oldPdf=win.currentPdf;
            win.oldDyn=win.currentDyn;
        }

        win.currentDyn=filename;
        fs.writeFileSync(studioCurrentFile,filename);
        win.basename=path.basename(win.currentDyn);
        win.dirname=path.dirname(win.currentDyn);
        
        win.currentPdf=path.join(win.dirname,path.basename(win.currentDyn, path.extname(win.currentDyn)))+'.pdf';
        //unwatch
        if(mode === 'old') {
            if(win.oldDyn !== undefined) fs.unwatchFile(win.oldDyn);
            if(win.oldPdf !== undefined) fs.unwatchFile(win.oldPdf);
        }
        //watch
        fs.watchFile(win.currentDyn, function(curr,prev) {
            console.log(win.currentDyn + " to watch!");
            if (win.currentDyn !== undefined) {
                readDynFile(win.currentDyn);
            }
        })
        fs.watchFile(win.currentPdf, function(curr,prev) {
            console.log(win.currentPdf + " to watch!");
            if (win.currentPdf !== undefined) {
                readPdf(win.currentPdf);
            }
        })
    }

    ace.require("ace/ext/language_tools");
    config();

    // var menu = new gui.Menu({type: 'menubar'});

    // // Add some items
    // menu.append(new gui.MenuItem({ label: 'Font Size' }));
    // menu.append(new gui.MenuItem({ label: 'Keys Bindings' }));

    // gui.Window.get().menu = menu;

    var win={pdf: {},viewers: {}};
    var editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
    });
    setTheme();
    editor.setFontSize(studioCfg.acefontsize);
    editor.getSession().setMode("ace/mode/dyndoc");

    // gui.Window.get().on("loaded",function() {
        if(gui.App.argv.length>0) {
            initFile(gui.App.argv[0],'first');
            readDynFile(win.currentDyn);
            if(fs.existsSync(win.currentPdf)) touch(win.currentPdf);
        } else if(fs.existsSync(studioCurrentFile)) {
            var filename=fs.readFileSync(studioCurrentFile, "utf8");
            console.log("filename:"+filename);
            if(fs.existsSync(filename)) {
                initFile(filename,'first');
            } 
            // else {
            //     initFile(path.join(process.env.DYNDOCROOT,"test","first.dyn"),'first');
            // } 
        }

        if(win.currentPdf !== undefined) {
            readDynFile(win.currentDyn);
            if(win.currentPdf !== undefined && fs.existsSync(win.currentPdf)) touch(win.currentPdf);
        }
    // })

    gui.App.on('open', function(cmdline) {
        console.log('command line: ' + cmdline);
    });

    function chooseFile(name) {
        var chooser = document.querySelector(name);
        chooser.addEventListener("change", function(evt) {
            // open
            if (name=="#openDialog") {
                initFile(this.value);
                console.log("open "+win.currentDyn);
                readDynFile(win.currentDyn);
            }
            // other here
            if(name=="#saveAsDialog") {
                initFile(this.value);
                saveDynFile(win.currentDyn);
                console.log("save as "+win.currentDyn);
            }
        }, false);
        chooser.click();        
    }
    

    function setViewerMode(mode,who) {
        if(win.viewers[who] === undefined) win.viewers[who]="half";
        win.viewers['old'+who]=win.viewers[who];
        win.viewers[who]=mode;
    }

    function showToggleLeft(who,mode) {
        if(mode=="left") {
            document.getElementById(who).style.left="0%";
        } else if (mode=="center") {
            document.getElementById(who).style.left="49.5%";
        } else if(mode=="right") {
            document.getElementById(who).style.left="99%";
        }

    }

    function showToggleRight(who,mode) {
        if(mode=="left") {
            document.getElementById(who).style.left="0.5%";
        } else if (mode=="center") {
            document.getElementById(who).style.left="50%";
        } else if(mode=="right") {
            document.getElementById(who).style.left="99.5%";
        }

    }

    function showEditorViewer(mode) {
        setViewerMode(mode,"editor");
        if(mode=="full") {
            document.getElementById("editor").style.display="";
            document.getElementById("editor").style.width="99%";
            showToggleLeft("toggleeditor","right");
            showToggleRight("togglepdf","right");
            showToggleRight("togglehtml","right");
            showToggleLeft("toggleall","right");
        } else if(mode=="half") {
            document.getElementById("editor").style.display="";
            document.getElementById("editor").style.width="49.5%";
            showToggleLeft("toggleeditor","center");
            showToggleRight("togglepdf","center");
            showToggleRight("togglehtml","center");
            showToggleLeft("toggleall","center");
        } else if(mode=="zero") {
            document.getElementById("editor").style.display="none";
            showToggleLeft("toggleeditor","left");
            showToggleRight("togglepdf","left");
            showToggleRight("togglehtml","left");
            showToggleLeft("toggleall","left");
        } 
    }

    function showPdfViewer(mode) {
        setViewerMode(mode,"pdf")
        if(mode=="full") {
            document.getElementById("pdfviewer").style.display="";
            document.getElementById("pdfviewer").style.width="99%";
            document.getElementById("pdfviewer").style.height="100%";
            document.getElementById("pdfviewer").style.left="1%";
        } else if(mode=="half") {
            document.getElementById("pdfviewer").style.display="";
            document.getElementById("pdfviewer").style.width="49.5%";
            document.getElementById("pdfviewer").style.height="50%";
            document.getElementById("pdfviewer").style.left="50.5%";
        } else if(mode=="zero") {
            document.getElementById("pdfviewer").style.display="none";
        } 
    } 

    function showHtmlViewer(mode) {
        setViewerMode(mode,"html")
        if(mode=="full") {
            document.getElementById("htmlviewer").style.display="";
            document.getElementById("htmlviewer").style.width="99%";
            document.getElementById("htmlviewer").style.top="0%";
            document.getElementById("htmlviewer").style.height="100%";
            document.getElementById("htmlviewer").style.left="1%";
        } else if(mode=="half") {
            document.getElementById("htmlviewer").style.display="";
            document.getElementById("htmlviewer").style.width="49.5%";
            document.getElementById("htmlviewer").style.top="50%";
            document.getElementById("htmlviewer").style.height="50%";
            document.getElementById("htmlviewer").style.left="50%";
        } else if(mode=="zero") {
            document.getElementById("htmlviewer").style.display="none";
        } 
    } 

    function toggleEditor() {
        if (win.viewers.editor !=="full") {
            showEditorViewer("full");
            showPdfViewer("zero");
            showHtmlViewer("zero");
        } else {
            showEditorViewer(win.viewers.oldeditor);
            showPdfViewer(win.viewers.oldpdf);
            showHtmlViewer(win.viewers.oldhtml);
        }
    }

    function togglePdf() {
        if (win.viewers.pdf !=="full") {
            showPdfViewer("full");
            showEditorViewer("zero");
            showHtmlViewer("zero");
        } else {
            showEditorViewer(win.viewers.oldeditor);
            showPdfViewer(win.viewers.oldpdf);
            showHtmlViewer(win.viewers.oldhtml);
        }
    }

    function toggleHtml() {
        if (win.viewers.html !== "full") {
            showHtmlViewer("full");
            showEditorViewer("zero");
            showPdfViewer("zero");
        } else {
            showEditorViewer(win.viewers.oldeditor);
            showPdfViewer(win.viewers.oldpdf);
            showHtmlViewer(win.viewers.oldhtml);
        }
    }

    function showAllViewers() {
        showHtmlViewer("half");
        showEditorViewer("half");
        showPdfViewer("half");
    }

    // keys control

    function keydown(evt) {

        var cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);

        if (cmd === 3 && evt.keyCode==84) gui.Window.get().showDevTools();
        if (cmd === 3 && evt.keyCode==80) togglePdf();
        if (cmd === 3 && evt.keyCode==72) toggleHtml();
        if (cmd === 3 && evt.keyCode==69) toggleEditor();
        if (cmd === 5 && evt.keyCode==72) gui.Window.open('http://dyndoc.upmf-grenoble.fr/Dyndoc.html', {toolbar: true,position: 'center'});

        //DEBUG: console.log("keydown:"+cmd+","+evt.keyCode);
        if (this == window.frames[1]) {
            function resizeText(multiplier) {
                if (window.frames[1].document.body.style.fontSize == "") {
                window.frames[1].document.body.style.fontSize = "1.0em";
                }
                window.frames[1].document.body.style.fontSize = parseFloat(window.frames[1].document.body.style.fontSize) + (multiplier * 0.2) + "em";
            }
            if (cmd === 3 && evt.keyCode==187) resizeText(1);
            if (cmd === 3 && evt.keyCode==189) resizeText(-1);
        }

    }

    window.addEventListener('keydown', keydown);

    window.frames[0].addEventListener('keydown',keydown);

    window.frames[1].addEventListener('keydown',keydown);


    //Note: already in use Ctrl-Shift-(EUDKLPRZ) Ctrl-Alt-(E)

    editor.commands.addCommand({
        name: "increaseFontSize",
        bindKey: {mac: "Ctrl-Alt-Z", win: "Ctrl-Alt-Z"},//{mac: "Ctrl-+", win: "Ctrl-+"},
        exec: function(editor) {
            var size = parseInt(editor.getFontSize(), 10) || 12;
            editor.setFontSize(size + 1);
        }
    }) 

    editor.commands.addCommand({
        name: "decreaseFontSize",
        bindKey: {mac: "Ctrl-Alt-A", win: "Ctrl-Alt-A"},//{mac: "Ctrl+-", win: "Ctrl+-"},
        exec: function(editor) {
            var size = parseInt(editor.getFontSize(), 10) || 12;
            editor.setFontSize(Math.max(size - 1 || 1));
        }
    })

    editor.commands.addCommand({
        name: "resetFontSize",
        bindKey: {mac: "Ctrl-Alt-Q", win: "Ctrl-Alt-Q"},
        exec: function(editor) {
            editor.setFontSize(12);
        }
    })

    editor.commands.addCommand({
        name: 'devtools',
        bindKey: {mac: "Ctrl-Alt-D", win: "Ctrl-Alt-D"},
        exec: function(editor) {
            gui.Window.get().showDevTools();
        }
    })

    editor.commands.addCommand({
        name: 'theme',
        bindKey: {mac: "Ctrl-Alt-T", win: "Ctrl-Alt-T"},
        exec: function(editor) {
            setTheme(true);
        }
    })

    editor.commands.addCommand({
        name: 'toogleeditor',
        bindKey: {mac: "Ctrl-Alt-E", win: "Ctrl-Alt-E"},
        exec: function(editor) {
             toggleEditor();
        }
    })

    editor.commands.addCommand({
        name: 'tooglepdf',
        bindKey: {mac: "Ctrl-Alt-P", win: "Ctrl-Alt-P"},
        exec: function(editor) {
             togglePdf();
        }
    })

    editor.commands.addCommand({
        name: 'tooglehtml',
        bindKey: {mac: "Ctrl-Alt-H", win: "Ctrl-Alt-H"},
        exec: function(editor) {
             toggleHtml();
        }
    })

    editor.commands.addCommand({
        name: 'helpdyndoc',
        bindKey: {mac: "Ctrl-Shift-H", win: "Ctrl-Shift-H"},
        exec: function(editor) {
            gui.Window.open('http://dyndoc.upmf-grenoble.fr/Dyndoc.html', {toolbar: true,position: 'center'});
        }
    })

    editor.commands.addCommand({
        name: 'save',
        bindKey: {mac: "Command-S", win: "Ctrl-S"},
        exec: function(editor) {
            var data = editor.getSession().getValue().replace(/\r\n/g,"\n");
            if(win.currentDyn==="NEW_FILE_TO_SAVE.DYN") {
                chooseFile("#saveAsDialog");
            } else {
                fs.writeFileSync(win.currentDyn, data, "utf8");
                console.log("save "+win.currentDyn);
            }
        }
    })

    editor.commands.addCommand({
        name: 'new window',
        bindKey: {mac: "Ctrl-Alt-W", win: "Ctrl-Alt-W"},
        exec: function(editor) {
            console.log("new windows");
            var new_win = gui.Window.get(
              window.open('dynStudio.html',"_blank")
            );
        }
    })

    editor.commands.addCommand({
        name: 'new',
        bindKey: {mac: "Command-N", win: "Ctrl-N"},
        exec: function(editor) {
            console.log("new file");
            editor.getSession().setValue("");
            win.currentDyn="NEW_FILE_TO_SAVE.DYN";
        }
    })

    editor.commands.addCommand({
        name: 'open',
        bindKey: {mac: "Command-O", win: "Ctrl-O"},
        exec: function(editor) {
            console.log("to open");
            chooseFile("#openDialog");
        }
    })


     editor.commands.addCommand({
        name: 'dyndoc-ruby',
        bindKey: {mac: "Command-X", win: "Ctrl-X"},
        exec: function(editor) {
            console.log("dir: "+win.dirname);
            process.chdir(win.dirname);
            var args=["all","-cspdf",win.basename];
            console.log("exec: "+cmds.dyndoc.ruby+":"+args);
            var child=execFile(cmds.dyndoc.ruby,args,function(error,stdout,stderr) { 
                if (error) {
                  console.log(error.stack); 
                  console.log('Error code: '+ error.code); 
                  console.log('Signal received: '+ 
                         error.signal);
                  } 
                console.log('Child Process stdout: '+ stdout);
                console.log('Child Process stderr: '+ stderr);
            }); 
            child.on('exit', function (code) { 
                console.log('Child process exited '+
                    'with exit code '+ code);
            });
        }
    })

    editor.commands.addCommand({
        name: 'dyndoc-client',
        bindKey: {mac: "Ctrl-Alt-X", win: "Ctrl-Alt-X"},
        exec: function(editor) {
            console.log("dir: "+win.dirname);
            process.chdir(win.dirname);
            var args=["all","-cspdf",win.basename];
            console.log("exec: "+cmds.dyndoc.ruby+":"+args);
            var child=execFile(cmds.dyndoc.ruby,args,function(error,stdout,stderr) { 
                if (error) {
                  console.log(error.stack); 
                  console.log('Error code: '+ error.code); 
                  console.log('Signal received: '+ 
                         error.signal);
                  } 
                console.log('Child Process stdout: '+ stdout);
                console.log('Child Process stderr: '+ stderr);
            }); 
            child.on('exit', function (code) { 
                console.log('Child process exited '+
                    'with exit code '+ code);
            });
        }
    })

    // editor.commands.addCommand({
    //     name: 'dyndoc',
    //     bindKey: {mac: "Command-Alt-X", win: "Ctrl-Shift-X"},
    //     exec: function(editor) {
    //         console.log("dir: "+win.dirname);
    //         process.chdir(win.dirname);
    //         var cmd="dyndoc-ruby all -cspdf "+win.basename;
    //         console.log("exec: "+cmd);
    //         exec(cmd,function (error, stdout, stderr) {
    //            var result = '{"stdout":' + stdout + ',"stderr":"' + stderr + '","cmd":"' + cmd + '"}';
    //            console.log(result + '\n');
    //         })
    //     }
    // })

    // editor.commands.addCommand({
    //     name: 'dyndoc',
    //     bindKey: {mac: "Command-X", win: "Ctrl-Shift-X"},
    //     exec: function(editor) {
    //         console.log("dir: "+win.dirname);
    //         process.chdir(win.dirname);
    //         var cmd="dyndoc-client all -cspdf dyn://localhost:6666/"+win.basename;
    //         console.log("exec: "+cmd);
    //         exec(cmd,function (error, stdout, stderr) {
    //            var result = '{"stdout":' + stdout + ',"stderr":"' + stderr + '","cmd":"' + cmd + '"}';
    //            console.log(result + '\n');
    //         })
    //     }
    // })
