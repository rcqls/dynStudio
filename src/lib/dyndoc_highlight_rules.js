/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/* THIS FILE WAS AUTOGENERATED FROM /Users/remy/Github/dyndoc/share/syntax/sublime_text2/Dyndoc.tmLanguage (UUID: 4CA84C94-5555-431F-AC2B-250BAD9E27AB) */
/****************************************************************
 * IT MIGHT NOT BE PERFECT, PARTICULARLY:                       *
 * IN DECIDING STATES TO TRANSITION TO,                         *
 * IGNORING WHITESPACE,                                         *
 * IGNORING GROUPS WITH ?:,                                     *
 * EXTENDING EXISTING MODES,                                    *
 * GATHERING KEYWORDS, OR                                       *
 * DECIDING WHEN TO USE PUSH.                                   *
 * ...But it's a good start from an existing *.tmlanguage file. *
 ****************************************************************/
ace.define('ace/mode/dyndoc', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/mode/latex', 'ace/mode/ruby', 'ace/tokenizer', 'ace/mode/html'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var DyndocHighlightRules = require("./dyndoc_highlight_rules").DyndocHighlightRules;

//var HtmlMode = require("ace/mode/html").Mode;
//var LatexMode = require("ace/mode/latex").Mode;
//var RubyMode = require("ace/mode/ruby").Mode;

var Mode = function() {
    var highlighter = new DyndocHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    
    this.$embeds = highlighter.getEmbeds();
    /**this.createModeDelegates({
        "html-": HtmlMode,
        "latex-": JavaScriptMode,
        "rb-": RubyMode
    });**/
    
};
oop.inherits(Mode, TextMode);

(function() {

   /*** 
    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        return 0;
    };

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

    this.checkOutdent = function(state, line, input) {
        return false;
    };
    ***/

}).call(Mode.prototype);

exports.Mode = Mode;
});
 


ace.define('ace/mode/dyndoc_highlight_rules',['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'],function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DyndocHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { start: 
       [ { include: '#tag_blck_r_dyn' },
         { include: '#tag_blck_ruby_dyn' },
         { include: '#tag_blck_var_dyn' },
         { include: '#tag_blck_out_dyn' },
         { include: '#tag_blck_dyn' },
         { include: '#tag_ruby_dyn' },
         { include: '#tag_r_dyn' },
         { include: '#tag_instr_dyn' },
         { include: '#tag_user_short_dyn' },
         { include: '#tag_user_dyn' },
         { include: '#extract_dyn' } ],
      '#extract_dyn': 
       [ { token: 'comment.line',
           regex: '(?:\\#|\\#\\#|\\@|\\#F|\\#R|\\#r|\\:R|\\:r|\\#Rb|\\#rb|\\:|\\:Rb|\\:rb)\\{',
           push: 
            [ { include: '#extract_dyn' },
              { token: 'comment.line', regex: '\\}', next: 'pop' },
              { defaultToken: 'variable.other.dyndoc' } ] } ],
      '#format_blck': 
       [ { todo: 'fix grouping',
           TODO: 'FIXME: regexp doesn\'t have js equivalent',
           originalRegex: '(?<=(?:>|=)\\])\\s*(\\:?\\:?[A-Za-z_][\\w.\\.:_\\-\\#]*)\\s*(\\[)\\s*(?:(?!\\#)|$)',
           token: [ 'text', 'variable.dyndoc', 'constant' ],
           regex: '(?<=(?:>|=)\\])\\s*(\\:?\\:?[A-Za-z_][\\w.\\.:_\\-\\#]*)\\s*(\\[)\\s*(?:(?!\\#)|$)' },
         { todo: 'fix grouping',
           token: [ 'invalid', 'constant', 'constant' ],
           regex: '(?:^\\s*(\\||\\[(?!\\#))|(\\||\\])$)' },
         { todo: 'fix grouping',
           token: [ 'text', 'constant' ],
           regex: '(\\])\\s*(?=\\[\\#)' } ],
      '#include_blck_dyn': 
       [ { include: '#tag_ruby_dyn' },
         { include: '#tag_r_dyn' },
         { include: '#tag_instr_dyn' },
         { include: '#tag_user_short_dyn' },
         { include: '#tag_user_dyn' },
         { include: '#extract_dyn' } ],
      '#tag_blck_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\[\\#)([.A-Za-z_\\,][\\w._\\-]*)(\\])',
           push: 
            [ { include: '#tag_ruby_dyn' },
              { include: '#tag_r_dyn' },
              { include: '#tag_instr_dyn' },
              { include: '#tag_user_short_dyn' },
              { include: '#tag_user_dyn' },
              { include: '#extract_dyn' },
              { todo: 'fix grouping',
                token: [],
                regex: '(?=\\[\\#)',
                next: 'pop' } ] } ],
      '#tag_blck_out_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\[\\#)(<<|<|do|>>|>|out|\\$nl|\\?|&\\?|tag|&tag|\\?\\?|yield|=|\\+|%)(\\])',
           push: 
            [ { include: '#include_blck_dyn' },
              { todo: 'fix grouping',
                token: [],
                regex: '(?=\\[\\#)',
                next: 'pop' },
              { defaultToken: 'markup.deleted' } ] } ],
      '#tag_blck_r_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\[\\#)(r<|R<|r>|R>|r>>|R>>|rverb)(\\])',
           push: 
            [ { include: '#include_blck_dyn' },
              { include: 'source.r' },
              { todo: 'fix grouping',
                token: [],
                regex: '(?=\\[\\#)',
                next: 'pop' } ] } ],
      '#tag_blck_ruby_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\[\\#)(rb<|rb>)(\\])',
           push: 
            [ { include: '#include_blck_dyn' },
              { include: 'source.ruby' },
              { todo: 'fix grouping',
                token: [],
                regex: '(?=\\[\\#)',
                next: 'pop' } ] } ],
      '#tag_blck_var_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\[\\#)(>>|>|=)(\\])',
           push: 
            [ { include: '#format_blck' },
              { include: '#include_blck_dyn' },
              { token: 'text', regex: '(?=\\[\\#)', next: 'pop' },
              { defaultToken: 'markup.inserted' } ] } ],
      '#tag_instr_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\{\\#)(input|require|hide|txt|code|>|<|<<|verb|if|unless|loop|case|var|set|def|func|meth|new|super|do|out|blck|>>|call|renv|rverb|eval|ifndef|tags|opt|document|yield|keys)(])',
           push: 
            [ { include: '$self' },
              { todo: 'fix grouping',
                token: 
                 [ 'text',
                   'punctuation.definition.tag.dyndoc',
                   'keyword.name.tag.dyndoc',
                   'punctuation.definition.tag.dyndoc',
                   'comment.line',
                   'punctuation.definition.tag.dyndoc' ],
                regex: '(\\[\\#)(\\2)?(?:(-)(.*))?(\\})',
                next: 'pop' } ] } ],
      '#tag_r_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\{\\#)(r|R>|R<|R|r>>|R>>|rverb)(])',
           push: 
            [ { include: 'source.r' },
              { include: '$self' },
              { todo: 'fix grouping',
                token: 
                 [ 'text',
                   'punctuation.definition.tag.dyndoc',
                   'keyword.name.tag.dyndoc',
                   'punctuation.definition.tag.dyndoc',
                   'comment.line',
                   'punctuation.definition.tag.dyndoc' ],
                regex: '(\\[\\#)(\\2)?(?:(\\-)(.*))?(\\})',
                next: 'pop' } ] } ],
      '#tag_ruby_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\{\\#)(rb(?:>)?)(])',
           push: 
            [ { include: '$self' },
              { include: 'source.ruby' },
              { todo: 'fix grouping',
                token: 
                 [ 'text',
                   'punctuation.definition.tag.dyndoc',
                   'keyword.name.tag.dyndoc',
                   'punctuation.definition.tag.dyndoc',
                   'comment.line',
                   'punctuation.definition.tag.dyndoc' ],
                regex: '(\\[\\#)(\\2)?(?:(\\-)(.*))?(\\})',
                next: 'pop' } ] } ],
      '#tag_user_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'entity.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\{\\#)([A-Za-z_][\\w.:_\\-\\|]*[=?!>]?)(\\])',
           push: 
            [ { include: '$self' },
              { todo: 'fix grouping',
                token: 
                 [ 'text',
                   'punctuation.definition.tag.dyndoc',
                   'entity.name.tag.dyndoc',
                   'punctuation.definition.tag.dyndoc',
                   'comment.line',
                   'punctuation.definition.tag.dyndoc' ],
                regex: '(\\[\\#)(\\2)?(?:(-)(.*))?(\\})',
                next: 'pop' } ] } ],
      '#tag_user_short_dyn': 
       [ { todo: 'fix grouping',
           token: 
            [ 'text',
              'punctuation.definition.tag.dyndoc',
              'keyword.name.tag.dyndoc',
              'punctuation.definition.tag.dyndoc' ],
           regex: '(\\{\\#)([A-Za-z_][\\w.:_\\-\\|]*[=?!>]?)(\\#\\})' } ] }
    
    this.normalizeRules();
};

oop.inherits(DyndocHighlightRules, TextHighlightRules);

exports.DyndocHighlightRules = DyndocHighlightRules;
});