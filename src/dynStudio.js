//'use strict';
    var gui = require('nw.gui');
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    var exec = require('child_process').exec;
    var execFile = require('child_process').execFile;
    var touch = require("touch");
    var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    var studioRoot = path.join(homepath,"dyndoc","studio");
    var studioCurrentFile = path.join(studioRoot,".currentFile")
    var studioDyndocJson = path.join(studioRoot,os.platform(),"dyndoc");
    var cmds = {};

    function resolvePath (string) {
      if (string.substr(0,1) === '~')
        string = homepath + string.substr(1);
        if (os.platform() == "win32") string=string.split("/").join(path.sep);
      return path.resolve(string)
    }

    console.log("dyndoc.json path: "+studioDyndocJson);
    if (fs.existsSync(studioDyndocJson+".json")) {
        cmds = require(studioDyndocJson);
        //console.log("commands:"+cmds);
        cmds.dyndoc.ruby = resolvePath(cmds.dyndoc.ruby.join(path.sep));
        cmds.dyndoc.client = resolvePath(cmds.dyndoc.client.join(path.sep));
        cmds.dyndoc.server = resolvePath(cmds.dyndoc.server.join(path.sep));
        //console.log("commands:"+cmds);
    } else {
        cmds.dyndoc = {ruby: "dyndoc-ruby", client: "dyndoc-client", server: "dyndoc-server"};
    }

    ace.require("ace/ext/language_tools");

    function readPdf(filename) {
        var pdfview = window.frames[0].PDFView; //PDFView from iframe
        var pdfBuf;
        pdfBuf=new Uint8Array(fs.readFileSync(filename));
        pdfview.open(pdfBuf, 0);
        pdfview.setTitleUsingUrl(path.basename(filename));
    }

    function initFile(filename,old) {
        win.currentFile=filename;
        fs.writeFileSync(studioCurrentFile,filename);
        win.basename=path.basename(win.currentFile);
        win.dirname=path.dirname(win.currentFile);
        
        //pdf
        if(typeof(old) === 'undefined') {
            win.oldPdf=win.currentPdf;
        }
        win.currentPdf=path.join(win.dirname,path.basename(win.currentFile, path.extname(win.currentFile)))+'.pdf';
        //unwatch
        if(typeof(old) === 'undefined') {
            fs.unwatchFile(win.oldPdf);
        }
        //watch
        fs.watchFile(win.currentPdf, function(curr,prev) {
            console.log(win.currentPdf + " updated!");
            if (typeof win.currentPdf !== 'undefined') {
                readPdf(win.currentPdf);
            }
        })
    }

    // var menu = new gui.Menu({type: 'menubar'});

    // // Add some items
    // menu.append(new gui.MenuItem({ label: 'Font Size' }));
    // menu.append(new gui.MenuItem({ label: 'Keys Bindings' }));

    // gui.Window.get().menu = menu;

    var win={pdf: {}};
    var editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/dyndoc");

    // gui.Window.get().on("loaded",function() {
        if(gui.App.argv.length>0) {
            initFile(gui.App.argv[0],false);
            editor.getSession().setValue(fs.readFileSync(win.currentFile, "utf8"));
            if(fs.existsSync(win.currentPdf)) touch(win.currentPdf);
        } else if(fs.existsSync(studioCurrentFile)) {
            var filename=fs.readFileSync(studioCurrentFile, "utf8");
            console.log("filename:"+filename);
            initFile(filename,false); 
        }

        if(win.currentPdf !== undefined) {
            editor.getSession().setValue(fs.readFileSync(win.currentFile, "utf8"));
            if(win.currentPdf !== undefined && fs.existsSync(win.currentPdf)) touch(win.currentPdf);
        }
    // })

    function chooseFile(name) {
        var chooser = document.querySelector(name);
        chooser.addEventListener("change", function(evt) {
            // open
            if (name=="#openDialog") {
                initFile(this.value);
                console.log("open "+win.currentFile);
                editor.getSession().setValue(fs.readFileSync(win.currentFile, "utf8"));
            }
            // other here
        }, false);
        chooser.click();        
    }

    function togglePdf() {
        if (document.getElementById("pdfviewer").style.width=="50%") {
            //document.getElementById("editor").hide();
            document.getElementById("pdfviewer").style.width="99%";
            document.getElementById("pdfviewer").style.height="100%";
            document.getElementById("pdfviewer").style.left="1%";
            //document.getElementById("pdfviewer").style.top="20%";
            document.getElementById("editor").style.display="none";
            document.getElementById("htmlviewer").style.display="none";
            document.getElementById("togglehtml").style.display="none";
            document.getElementById("togglepdf").style.left="0%";
            document.getElementById("togglepdf").style.height="100%";
        } else {
            //document.getElementById("editor").show();
            document.getElementById("pdfviewer").style.width="50%";
            document.getElementById("pdfviewer").style.height="50%";
            document.getElementById("pdfviewer").style.left="50%";
            //document.getElementById("pdfviewer").style.top="0%";
            document.getElementById("editor").style.display="";
            document.getElementById("htmlviewer").style.display="";
            document.getElementById("togglehtml").style.display="";
            document.getElementById("togglepdf").style.left="49%";
            document.getElementById("togglepdf").style.height="50%";
        }
    }

    function toggleHtml() {
        if (document.getElementById("htmlviewer").style.width=="50%") {
            //document.getElementById("editor").hide();
            document.getElementById("htmlviewer").style.width="99%";
            document.getElementById("htmlviewer").style.top="0%";
            document.getElementById("htmlviewer").style.height="100%";
            document.getElementById("htmlviewer").style.left="1%";
            //document.getElementById("pdfviewer").style.top="20%";
            document.getElementById("editor").style.display="none";
            document.getElementById("togglepdf").style.display="none";
            document.getElementById("togglehtml").style.left="0%";
            document.getElementById("togglehtml").style.top="0%";
            document.getElementById("togglehtml").style.height="100%";
        } else {
            //document.getElementById("editor").show();
            document.getElementById("htmlviewer").style.width="50%";
            document.getElementById("htmlviewer").style.top="50%";
            document.getElementById("htmlviewer").style.height="50%";
            document.getElementById("htmlviewer").style.left="50%";
            //document.getElementById("pdfviewer").style.top="0%";
            document.getElementById("editor").style.display="";
            document.getElementById("togglepdf").style.display="";
            document.getElementById("togglehtml").style.left="49%";
            document.getElementById("togglehtml").style.top="50%";
            document.getElementById("togglehtml").style.height="50%";
        }
    }

    // keys control

    function keydown(evt) {

        var cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);

        if (cmd === 3 && evt.keyCode==84) gui.Window.get().showDevTools();
        if (cmd === 3 && evt.keyCode==80) togglePdf();
        if (cmd === 3 && evt.keyCode==72) toggleHtml();
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
        bindKey: {mac: "Ctrl-Alt-T", win: "Ctrl-Alt-T"},
        exec: function(editor) {
            gui.Window.get().showDevTools();
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
            var data = editor.getSession().getValue(); //.replace(/\n/g,"\r\n");
            fs.writeFileSync(win.currentFile, data, "utf8");
            console.log("save "+win.currentFile);
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
        name: 'dyndoc',
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
