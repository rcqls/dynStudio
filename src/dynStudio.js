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
    var studioDyndocJson = path.join(studioRoot,os.platform(),"dyndoc");
    var dyndoc = {};


    console.log("dyndoc.json path: "+studioDyndocJson);
    if (fs.existsSync(studioDyndocJson+".json")) {
        console.log("ok");
        dyndoc.cmds = require(studioDyndocJson);
        dyndoc.cmds.ruby = path.join(homepath,dyndoc.cmds.ruby.join(path.sep));
        dyndoc.cmds.client = path.join(homepath,dyndoc.cmds.client.join(path.sep));
        dyndoc.cmds.server = path.join(homepath,dyndoc.cmds.server.join(path.sep));
    } else {
        dyndoc.cmds = {ruby: "dyndoc-ruby", client: "dyndoc-client", server: "dyndoc-server"};
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

    var win={pdf: {}};
    var editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/dyndoc");
    if(gui.App.argv.length>0) {
        initFile(gui.App.argv[0],false);
        editor.getSession().setValue(fs.readFileSync(win.currentFile, "utf8"));
        touch(win.currentPdf);
    }

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
            document.getElementById("pdfviewer").style.left="1%";
            //document.getElementById("pdfviewer").style.top="20%";
            document.getElementById("editor").style.display="none";
            document.getElementById("togglepdf").style.left="0%";
        } else {
            //document.getElementById("editor").show();
            document.getElementById("pdfviewer").style.width="50%";
            document.getElementById("pdfviewer").style.left="50%";
            //document.getElementById("pdfviewer").style.top="0%";
            document.getElementById("editor").style.display="";
            document.getElementById("togglepdf").style.left="49%";
        }
    }

    window.addEventListener('keydown', function keydown(evt) {

        var handled = false;
        var cmd = (evt.ctrlKey ? 1 : 0) |
                (evt.altKey ? 2 : 0) |
                (evt.shiftKey ? 4 : 0) |
                (evt.metaKey ? 8 : 0);

        // First, handle the key bindings that are independent whether an input
        // control is selected or not.
        if (cmd === 5 && evt.keyCode==84) togglePdf();
    });


    editor.commands.addCommand({
        name: 'tooglepdf',
        bindKey: {mac: "Ctrl-Shift-T", win: "Ctrl-Shift-T"},
        exec: function(editor) {
             togglePdf();
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
        bindKey: {mac: "Command-O", win: "Ctrl-Shift-O"},
        exec: function(editor) {
            console.log("to open");
            chooseFile("#openDialog");
        }
    })


     editor.commands.addCommand({
        name: 'dyndoc',
        bindKey: {mac: "Command-X", win: "Ctrl-Shift-X"},
        exec: function(editor) {
            console.log("dir: "+win.dirname);
            process.chdir(win.dirname);
            var args=["all","-cspdf",win.basename];
            console.log("exec: "+dyndoc.cmds.ruby+":"+args);
            var child=execFile(dyndoc.cmds.ruby,args,function(error,stdout,stderr) { 
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
