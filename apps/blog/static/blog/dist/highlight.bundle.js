(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// <link rel="stylesheet" href="{% static 'node_modules/highlightjs-copy/dist/highlightjs-copy.min.css' %}">

exports.CopyButtonPlugin = class CopyButtonPlugin {
    /**
     * Create a new CopyButtonPlugin class instance
     * @param {Object} [options] - Functions that will be called when a copy event fires
     * @param {CopyCallback} [options.callback]
     * @param {Hook} [options.hook]
     */
    constructor(options = {}) {
        self.hook = options.hook;
        self.callback = options.callback;
    }
    "after:highlightElement"({ el, text }) {
        // Create the copy button and append it to the codeblock.
        let button = Object.assign(document.createElement("button"), {
            // innerHTML: "Copy",
            innerHTML: '<i class="fa-solid fa-copy"></i>',
            className: "hljs-copy-button",
        });
        button.dataset.copied = false;
        el.parentElement.classList.add("hljs-copy-wrapper");
        el.parentElement.appendChild(button);

        // Add a custom property to the code block so that the copy button can reference and match its background-color value.
        el.parentElement.style.setProperty(
            "--hljs-theme-background",
            window.getComputedStyle(el).backgroundColor
        );

        button.onclick = function () {
            if (!navigator.clipboard) return;

            let newText = text;
            if (hook && typeof hook === "function") {
                newText = hook(text, el) || text;
            }

            navigator.clipboard
                .writeText(newText)
                .then(function () {
                    // button.innerHTML = "Copied!";
                    button.innerHTML = '<i class="fa-solid fa-clipboard text-rose-500"></i>';
                    button.dataset.copied = true;

                    // let alert = Object.assign(document.createElement("div"), {
                    //     role: "status",
                    //     className: "hljs-copy-alert",
                    //     innerHTML: "Copied to clipboard",
                    // });
                    // el.parentElement.appendChild(alert);

                    setTimeout(() => {
                        // button.innerHTML = "Copy";
                        button.innerHTML = '<i class="fa-solid fa-copy"></i>';
                        button.dataset.copied = false;
                        // el.parentElement.removeChild(alert);
                        // alert = null;
                    }, 2000);
                })
                .then(function () {
                    if (typeof callback === "function") return callback(newText, el);
                });
        };
    }
}


},{}],2:[function(require,module,exports){
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('django', require('highlight.js/lib/languages/django'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('ini', require('highlight.js/lib/languages/ini'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('latex', require('highlight.js/lib/languages/latex'));
hljs.registerLanguage('makefile', require('highlight.js/lib/languages/makefile'));
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
hljs.registerLanguage('matlab', require('highlight.js/lib/languages/matlab'));
hljs.registerLanguage('mathematica', require('highlight.js/lib/languages/mathematica'));
hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('plaintext', require('highlight.js/lib/languages/plaintext'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));

window.hljs = hljs;

// NOTE: 原始的包没有导出
// const highlightjsCopy = require('highlightjs-copy')
const plugins = require('./_plugins.js')

require('highlightjs-line-numbers.js')

hljs.highlightAll();
hljs.initLineNumbersOnLoad();
hljs.addPlugin(new plugins.CopyButtonPlugin());
},{"./_plugins.js":1,"highlight.js/lib/core":3,"highlight.js/lib/languages/bash":4,"highlight.js/lib/languages/css":5,"highlight.js/lib/languages/django":6,"highlight.js/lib/languages/dockerfile":7,"highlight.js/lib/languages/ini":8,"highlight.js/lib/languages/javascript":9,"highlight.js/lib/languages/json":10,"highlight.js/lib/languages/latex":11,"highlight.js/lib/languages/makefile":12,"highlight.js/lib/languages/markdown":13,"highlight.js/lib/languages/mathematica":14,"highlight.js/lib/languages/matlab":15,"highlight.js/lib/languages/nginx":16,"highlight.js/lib/languages/plaintext":17,"highlight.js/lib/languages/python":18,"highlight.js/lib/languages/scss":19,"highlight.js/lib/languages/sql":20,"highlight.js/lib/languages/typescript":21,"highlight.js/lib/languages/xml":22,"highlight.js/lib/languages/yaml":23,"highlightjs-line-numbers.js":24}],3:[function(require,module,exports){
var deepFreezeEs6 = {exports: {}};

function deepFreeze(obj) {
    if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function () {
            throw new Error('map is read-only');
        };
    } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function () {
            throw new Error('set is read-only');
        };
    }

    // Freeze self
    Object.freeze(obj);

    Object.getOwnPropertyNames(obj).forEach(function (name) {
        var prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop == 'object' && !Object.isFrozen(prop)) {
            deepFreeze(prop);
        }
    });

    return obj;
}

deepFreezeEs6.exports = deepFreeze;
deepFreezeEs6.exports.default = deepFreeze;

/** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
/** @typedef {import('highlight.js').CompiledMode} CompiledMode */
/** @implements CallbackResponse */

class Response {
  /**
   * @param {CompiledMode} mode
   */
  constructor(mode) {
    // eslint-disable-next-line no-undefined
    if (mode.data === undefined) mode.data = {};

    this.data = mode.data;
    this.isMatchIgnored = false;
  }

  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * performs a shallow merge of multiple objects into one
 *
 * @template T
 * @param {T} original
 * @param {Record<string,any>[]} objects
 * @returns {T} a single new object
 */
function inherit$1(original, ...objects) {
  /** @type Record<string,any> */
  const result = Object.create(null);

  for (const key in original) {
    result[key] = original[key];
  }
  objects.forEach(function(obj) {
    for (const key in obj) {
      result[key] = obj[key];
    }
  });
  return /** @type {T} */ (result);
}

/**
 * @typedef {object} Renderer
 * @property {(text: string) => void} addText
 * @property {(node: Node) => void} openNode
 * @property {(node: Node) => void} closeNode
 * @property {() => string} value
 */

/** @typedef {{scope?: string, language?: string, sublanguage?: boolean}} Node */
/** @typedef {{walk: (r: Renderer) => void}} Tree */
/** */

const SPAN_CLOSE = '</span>';

/**
 * Determines if a node needs to be wrapped in <span>
 *
 * @param {Node} node */
const emitsWrappingTags = (node) => {
  // rarely we can have a sublanguage where language is undefined
  // TODO: track down why
  return !!node.scope || (node.sublanguage && node.language);
};

/**
 *
 * @param {string} name
 * @param {{prefix:string}} options
 */
const scopeToCSSClass = (name, { prefix }) => {
  if (name.includes(".")) {
    const pieces = name.split(".");
    return [
      `${prefix}${pieces.shift()}`,
      ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
    ].join(" ");
  }
  return `${prefix}${name}`;
};

/** @type {Renderer} */
class HTMLRenderer {
  /**
   * Creates a new HTMLRenderer
   *
   * @param {Tree} parseTree - the parse tree (must support `walk` API)
   * @param {{classPrefix: string}} options
   */
  constructor(parseTree, options) {
    this.buffer = "";
    this.classPrefix = options.classPrefix;
    parseTree.walk(this);
  }

  /**
   * Adds texts to the output stream
   *
   * @param {string} text */
  addText(text) {
    this.buffer += escapeHTML(text);
  }

  /**
   * Adds a node open to the output stream (if needed)
   *
   * @param {Node} node */
  openNode(node) {
    if (!emitsWrappingTags(node)) return;

    let className = "";
    if (node.sublanguage) {
      className = `language-${node.language}`;
    } else {
      className = scopeToCSSClass(node.scope, { prefix: this.classPrefix });
    }
    this.span(className);
  }

  /**
   * Adds a node close to the output stream (if needed)
   *
   * @param {Node} node */
  closeNode(node) {
    if (!emitsWrappingTags(node)) return;

    this.buffer += SPAN_CLOSE;
  }

  /**
   * returns the accumulated buffer
  */
  value() {
    return this.buffer;
  }

  // helpers

  /**
   * Builds a span element
   *
   * @param {string} className */
  span(className) {
    this.buffer += `<span class="${className}">`;
  }
}

/** @typedef {{scope?: string, language?: string, sublanguage?: boolean, children: Node[]} | string} Node */
/** @typedef {{scope?: string, language?: string, sublanguage?: boolean, children: Node[]} } DataNode */
/** @typedef {import('highlight.js').Emitter} Emitter */
/**  */

/** @returns {DataNode} */
const newNode = (opts = {}) => {
  /** @type DataNode */
  const result = { children: [] };
  Object.assign(result, opts);
  return result;
};

class TokenTree {
  constructor() {
    /** @type DataNode */
    this.rootNode = newNode();
    this.stack = [this.rootNode];
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  get root() { return this.rootNode; }

  /** @param {Node} node */
  add(node) {
    this.top.children.push(node);
  }

  /** @param {string} scope */
  openNode(scope) {
    /** @type Node */
    const node = newNode({ scope });
    this.add(node);
    this.stack.push(node);
  }

  closeNode() {
    if (this.stack.length > 1) {
      return this.stack.pop();
    }
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  closeAllNodes() {
    while (this.closeNode());
  }

  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }

  /**
   * @typedef { import("./html_renderer").Renderer } Renderer
   * @param {Renderer} builder
   */
  walk(builder) {
    // this does not
    return this.constructor._walk(builder, this.rootNode);
    // this works
    // return TokenTree._walk(builder, this.rootNode);
  }

  /**
   * @param {Renderer} builder
   * @param {Node} node
   */
  static _walk(builder, node) {
    if (typeof node === "string") {
      builder.addText(node);
    } else if (node.children) {
      builder.openNode(node);
      node.children.forEach((child) => this._walk(builder, child));
      builder.closeNode(node);
    }
    return builder;
  }

  /**
   * @param {Node} node
   */
  static _collapse(node) {
    if (typeof node === "string") return;
    if (!node.children) return;

    if (node.children.every(el => typeof el === "string")) {
      // node.text = node.children.join("");
      // delete node.children;
      node.children = [node.children.join("")];
    } else {
      node.children.forEach((child) => {
        TokenTree._collapse(child);
      });
    }
  }
}

/**
  Currently this is all private API, but this is the minimal API necessary
  that an Emitter must implement to fully support the parser.

  Minimal interface:

  - addKeyword(text, scope)
  - addText(text)
  - addSublanguage(emitter, subLanguageName)
  - finalize()
  - openNode(scope)
  - closeNode()
  - closeAllNodes()
  - toHTML()

*/

/**
 * @implements {Emitter}
 */
class TokenTreeEmitter extends TokenTree {
  /**
   * @param {*} options
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * @param {string} text
   * @param {string} scope
   */
  addKeyword(text, scope) {
    if (text === "") { return; }

    this.openNode(scope);
    this.addText(text);
    this.closeNode();
  }

  /**
   * @param {string} text
   */
  addText(text) {
    if (text === "") { return; }

    this.add(text);
  }

  /**
   * @param {Emitter & {root: DataNode}} emitter
   * @param {string} name
   */
  addSublanguage(emitter, name) {
    /** @type DataNode */
    const node = emitter.root;
    node.sublanguage = true;
    node.language = name;
    this.add(node);
  }

  toHTML() {
    const renderer = new HTMLRenderer(this, this.options);
    return renderer.value();
  }

  finalize() {
    return true;
  }
}

/**
 * @param {string} value
 * @returns {RegExp}
 * */

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function source(re) {
  if (!re) return null;
  if (typeof re === "string") return re;

  return re.source;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
  return concat('(?=', re, ')');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function anyNumberOfTimes(re) {
  return concat('(?:', re, ')*');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function optional(re) {
  return concat('(?:', re, ')?');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
  const joined = args.map((x) => source(x)).join("");
  return joined;
}

/**
 * @param { Array<string | RegExp | Object> } args
 * @returns {object}
 */
function stripOptionsFromArgs(args) {
  const opts = args[args.length - 1];

  if (typeof opts === 'object' && opts.constructor === Object) {
    args.splice(args.length - 1, 1);
    return opts;
  } else {
    return {};
  }
}

/** @typedef { {capture?: boolean} } RegexEitherOptions */

/**
 * Any of the passed expresssions may match
 *
 * Creates a huge this | this | that | that match
 * @param {(RegExp | string)[] | [...(RegExp | string)[], RegexEitherOptions]} args
 * @returns {string}
 */
function either(...args) {
  /** @type { object & {capture?: boolean} }  */
  const opts = stripOptionsFromArgs(args);
  const joined = '('
    + (opts.capture ? "" : "?:")
    + args.map((x) => source(x)).join("|") + ")";
  return joined;
}

/**
 * @param {RegExp | string} re
 * @returns {number}
 */
function countMatchGroups(re) {
  return (new RegExp(re.toString() + '|')).exec('').length - 1;
}

/**
 * Does lexeme start with a regular expression match at the beginning
 * @param {RegExp} re
 * @param {string} lexeme
 */
function startsWith(re, lexeme) {
  const match = re && re.exec(lexeme);
  return match && match.index === 0;
}

// BACKREF_RE matches an open parenthesis or backreference. To avoid
// an incorrect parse, it additionally matches the following:
// - [...] elements, where the meaning of parentheses and escapes change
// - other escape sequences, so we do not misparse escape sequences as
//   interesting elements
// - non-matching or lookahead parentheses, which do not capture. These
//   follow the '(' with a '?'.
const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

// **INTERNAL** Not intended for outside usage
// join logically computes regexps.join(separator), but fixes the
// backreferences so they continue to match.
// it also places each individual regular expression into it's own
// match group, keeping track of the sequencing of those match groups
// is currently an exercise for the caller. :-)
/**
 * @param {(string | RegExp)[]} regexps
 * @param {{joinWith: string}} opts
 * @returns {string}
 */
function _rewriteBackreferences(regexps, { joinWith }) {
  let numCaptures = 0;

  return regexps.map((regex) => {
    numCaptures += 1;
    const offset = numCaptures;
    let re = source(regex);
    let out = '';

    while (re.length > 0) {
      const match = BACKREF_RE.exec(re);
      if (!match) {
        out += re;
        break;
      }
      out += re.substring(0, match.index);
      re = re.substring(match.index + match[0].length);
      if (match[0][0] === '\\' && match[1]) {
        // Adjust the backreference.
        out += '\\' + String(Number(match[1]) + offset);
      } else {
        out += match[0];
        if (match[0] === '(') {
          numCaptures++;
        }
      }
    }
    return out;
  }).map(re => `(${re})`).join(joinWith);
}

/** @typedef {import('highlight.js').Mode} Mode */
/** @typedef {import('highlight.js').ModeCallback} ModeCallback */

// Common regexps
const MATCH_NOTHING_RE = /\b\B/;
const IDENT_RE = '[a-zA-Z]\\w*';
const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

/**
* @param { Partial<Mode> & {binary?: string | RegExp} } opts
*/
const SHEBANG = (opts = {}) => {
  const beginShebang = /^#![ ]*\//;
  if (opts.binary) {
    opts.begin = concat(
      beginShebang,
      /.*\b/,
      opts.binary,
      /\b.*/);
  }
  return inherit$1({
    scope: 'meta',
    begin: beginShebang,
    end: /$/,
    relevance: 0,
    /** @type {ModeCallback} */
    "on:begin": (m, resp) => {
      if (m.index !== 0) resp.ignoreMatch();
    }
  }, opts);
};

// Common modes
const BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
};
const APOS_STRING_MODE = {
  scope: 'string',
  begin: '\'',
  end: '\'',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const QUOTE_STRING_MODE = {
  scope: 'string',
  begin: '"',
  end: '"',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
/**
 * Creates a comment mode
 *
 * @param {string | RegExp} begin
 * @param {string | RegExp} end
 * @param {Mode | {}} [modeOptions]
 * @returns {Partial<Mode>}
 */
const COMMENT = function(begin, end, modeOptions = {}) {
  const mode = inherit$1(
    {
      scope: 'comment',
      begin,
      end,
      contains: []
    },
    modeOptions
  );
  mode.contains.push({
    scope: 'doctag',
    // hack to avoid the space from being included. the space is necessary to
    // match here to prevent the plain text rule below from gobbling up doctags
    begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const ENGLISH_WORD = either(
    // list of common 1 and 2 letter words in English
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    // note: this is not an exhaustive list of contractions, just popular ones
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
    /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
    /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
  );
  // looking like plain text, more likely to be a comment
  mode.contains.push(
    {
      // TODO: how to include ", (, ) without breaking grammars that use these for
      // comment delimiters?
      // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
      // ---

      // this tries to find sequences of 3 english words in a row (without any
      // "programming" type syntax) this gives us a strong signal that we've
      // TRULY found a comment - vs perhaps scanning with the wrong language.
      // It's possible to find something that LOOKS like the start of the
      // comment - but then if there is no readable text - good chance it is a
      // false match and not a comment.
      //
      // for a visual example please see:
      // https://github.com/highlightjs/highlight.js/issues/2827

      begin: concat(
        /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
        '(',
        ENGLISH_WORD,
        /[.]?[:]?([.][ ]|[ ])/,
        '){3}') // look for 3 words in a row
    }
  );
  return mode;
};
const C_LINE_COMMENT_MODE = COMMENT('//', '$');
const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
const HASH_COMMENT_MODE = COMMENT('#', '$');
const NUMBER_MODE = {
  scope: 'number',
  begin: NUMBER_RE,
  relevance: 0
};
const C_NUMBER_MODE = {
  scope: 'number',
  begin: C_NUMBER_RE,
  relevance: 0
};
const BINARY_NUMBER_MODE = {
  scope: 'number',
  begin: BINARY_NUMBER_RE,
  relevance: 0
};
const REGEXP_MODE = {
  // this outer rule makes sure we actually have a WHOLE regex and not simply
  // an expression such as:
  //
  //     3 / something
  //
  // (which will then blow up when regex's `illegal` sees the newline)
  begin: /(?=\/[^/\n]*\/)/,
  contains: [{
    scope: 'regexp',
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      BACKSLASH_ESCAPE,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [BACKSLASH_ESCAPE]
      }
    ]
  }]
};
const TITLE_MODE = {
  scope: 'title',
  begin: IDENT_RE,
  relevance: 0
};
const UNDERSCORE_TITLE_MODE = {
  scope: 'title',
  begin: UNDERSCORE_IDENT_RE,
  relevance: 0
};
const METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
  relevance: 0
};

/**
 * Adds end same as begin mechanics to a mode
 *
 * Your mode must include at least a single () match group as that first match
 * group is what is used for comparison
 * @param {Partial<Mode>} mode
 */
const END_SAME_AS_BEGIN = function(mode) {
  return Object.assign(mode,
    {
      /** @type {ModeCallback} */
      'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
      /** @type {ModeCallback} */
      'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
    });
};

var MODES = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MATCH_NOTHING_RE: MATCH_NOTHING_RE,
    IDENT_RE: IDENT_RE,
    UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
    NUMBER_RE: NUMBER_RE,
    C_NUMBER_RE: C_NUMBER_RE,
    BINARY_NUMBER_RE: BINARY_NUMBER_RE,
    RE_STARTERS_RE: RE_STARTERS_RE,
    SHEBANG: SHEBANG,
    BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
    APOS_STRING_MODE: APOS_STRING_MODE,
    QUOTE_STRING_MODE: QUOTE_STRING_MODE,
    PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
    COMMENT: COMMENT,
    C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
    C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
    HASH_COMMENT_MODE: HASH_COMMENT_MODE,
    NUMBER_MODE: NUMBER_MODE,
    C_NUMBER_MODE: C_NUMBER_MODE,
    BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
    REGEXP_MODE: REGEXP_MODE,
    TITLE_MODE: TITLE_MODE,
    UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
    METHOD_GUARD: METHOD_GUARD,
    END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
});

/**
@typedef {import('highlight.js').CallbackResponse} CallbackResponse
@typedef {import('highlight.js').CompilerExt} CompilerExt
*/

// Grammar extensions / plugins
// See: https://github.com/highlightjs/highlight.js/issues/2833

// Grammar extensions allow "syntactic sugar" to be added to the grammar modes
// without requiring any underlying changes to the compiler internals.

// `compileMatch` being the perfect small example of now allowing a grammar
// author to write `match` when they desire to match a single expression rather
// than being forced to use `begin`.  The extension then just moves `match` into
// `begin` when it runs.  Ie, no features have been added, but we've just made
// the experience of writing (and reading grammars) a little bit nicer.

// ------

// TODO: We need negative look-behind support to do this properly
/**
 * Skip a match if it has a preceding dot
 *
 * This is used for `beginKeywords` to prevent matching expressions such as
 * `bob.keyword.do()`. The mode compiler automatically wires this up as a
 * special _internal_ 'on:begin' callback for modes with `beginKeywords`
 * @param {RegExpMatchArray} match
 * @param {CallbackResponse} response
 */
function skipIfHasPrecedingDot(match, response) {
  const before = match.input[match.index - 1];
  if (before === ".") {
    response.ignoreMatch();
  }
}

/**
 *
 * @type {CompilerExt}
 */
function scopeClassName(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.className !== undefined) {
    mode.scope = mode.className;
    delete mode.className;
  }
}

/**
 * `beginKeywords` syntactic sugar
 * @type {CompilerExt}
 */
function beginKeywords(mode, parent) {
  if (!parent) return;
  if (!mode.beginKeywords) return;

  // for languages with keywords that include non-word characters checking for
  // a word boundary is not sufficient, so instead we check for a word boundary
  // or whitespace - this does no harm in any case since our keyword engine
  // doesn't allow spaces in keywords anyways and we still check for the boundary
  // first
  mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
  mode.__beforeBegin = skipIfHasPrecedingDot;
  mode.keywords = mode.keywords || mode.beginKeywords;
  delete mode.beginKeywords;

  // prevents double relevance, the keywords themselves provide
  // relevance, the mode doesn't need to double it
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 0;
}

/**
 * Allow `illegal` to contain an array of illegal values
 * @type {CompilerExt}
 */
function compileIllegal(mode, _parent) {
  if (!Array.isArray(mode.illegal)) return;

  mode.illegal = either(...mode.illegal);
}

/**
 * `match` to match a single expression for readability
 * @type {CompilerExt}
 */
function compileMatch(mode, _parent) {
  if (!mode.match) return;
  if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

  mode.begin = mode.match;
  delete mode.match;
}

/**
 * provides the default 1 relevance to all modes
 * @type {CompilerExt}
 */
function compileRelevance(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 1;
}

// allow beforeMatch to act as a "qualifier" for the match
// the full match begin must be [beforeMatch][begin]
const beforeMatchExt = (mode, parent) => {
  if (!mode.beforeMatch) return;
  // starts conflicts with endsParent which we need to make sure the child
  // rule is not matched multiple times
  if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

  const originalMode = Object.assign({}, mode);
  Object.keys(mode).forEach((key) => { delete mode[key]; });

  mode.keywords = originalMode.keywords;
  mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
  mode.starts = {
    relevance: 0,
    contains: [
      Object.assign(originalMode, { endsParent: true })
    ]
  };
  mode.relevance = 0;

  delete originalMode.beforeMatch;
};

// keywords that should have no default relevance value
const COMMON_KEYWORDS = [
  'of',
  'and',
  'for',
  'in',
  'not',
  'or',
  'if',
  'then',
  'parent', // common variable name
  'list', // common variable name
  'value' // common variable name
];

const DEFAULT_KEYWORD_SCOPE = "keyword";

/**
 * Given raw keywords from a language definition, compile them.
 *
 * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
 * @param {boolean} caseInsensitive
 */
function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
  /** @type KeywordDict */
  const compiledKeywords = Object.create(null);

  // input can be a string of keywords, an array of keywords, or a object with
  // named keys representing scopeName (which can then point to a string or array)
  if (typeof rawKeywords === 'string') {
    compileList(scopeName, rawKeywords.split(" "));
  } else if (Array.isArray(rawKeywords)) {
    compileList(scopeName, rawKeywords);
  } else {
    Object.keys(rawKeywords).forEach(function(scopeName) {
      // collapse all our objects back into the parent object
      Object.assign(
        compiledKeywords,
        compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
      );
    });
  }
  return compiledKeywords;

  // ---

  /**
   * Compiles an individual list of keywords
   *
   * Ex: "for if when while|5"
   *
   * @param {string} scopeName
   * @param {Array<string>} keywordList
   */
  function compileList(scopeName, keywordList) {
    if (caseInsensitive) {
      keywordList = keywordList.map(x => x.toLowerCase());
    }
    keywordList.forEach(function(keyword) {
      const pair = keyword.split('|');
      compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
    });
  }
}

/**
 * Returns the proper score for a given keyword
 *
 * Also takes into account comment keywords, which will be scored 0 UNLESS
 * another score has been manually assigned.
 * @param {string} keyword
 * @param {string} [providedScore]
 */
function scoreForKeyword(keyword, providedScore) {
  // manual scores always win over common keywords
  // so you can force a score of 1 if you really insist
  if (providedScore) {
    return Number(providedScore);
  }

  return commonKeyword(keyword) ? 0 : 1;
}

/**
 * Determines if a given keyword is common or not
 *
 * @param {string} keyword */
function commonKeyword(keyword) {
  return COMMON_KEYWORDS.includes(keyword.toLowerCase());
}

/*

For the reasoning behind this please see:
https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

*/

/**
 * @type {Record<string, boolean>}
 */
const seenDeprecations = {};

/**
 * @param {string} message
 */
const error = (message) => {
  console.error(message);
};

/**
 * @param {string} message
 * @param {any} args
 */
const warn = (message, ...args) => {
  console.log(`WARN: ${message}`, ...args);
};

/**
 * @param {string} version
 * @param {string} message
 */
const deprecated = (version, message) => {
  if (seenDeprecations[`${version}/${message}`]) return;

  console.log(`Deprecated as of ${version}. ${message}`);
  seenDeprecations[`${version}/${message}`] = true;
};

/* eslint-disable no-throw-literal */

/**
@typedef {import('highlight.js').CompiledMode} CompiledMode
*/

const MultiClassError = new Error();

/**
 * Renumbers labeled scope names to account for additional inner match
 * groups that otherwise would break everything.
 *
 * Lets say we 3 match scopes:
 *
 *   { 1 => ..., 2 => ..., 3 => ... }
 *
 * So what we need is a clean match like this:
 *
 *   (a)(b)(c) => [ "a", "b", "c" ]
 *
 * But this falls apart with inner match groups:
 *
 * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
 *
 * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
 * What needs to happen is the numbers are remapped:
 *
 *   { 1 => ..., 2 => ..., 5 => ... }
 *
 * We also need to know that the ONLY groups that should be output
 * are 1, 2, and 5.  This function handles this behavior.
 *
 * @param {CompiledMode} mode
 * @param {Array<RegExp | string>} regexes
 * @param {{key: "beginScope"|"endScope"}} opts
 */
function remapScopeNames(mode, regexes, { key }) {
  let offset = 0;
  const scopeNames = mode[key];
  /** @type Record<number,boolean> */
  const emit = {};
  /** @type Record<number,string> */
  const positions = {};

  for (let i = 1; i <= regexes.length; i++) {
    positions[i + offset] = scopeNames[i];
    emit[i + offset] = true;
    offset += countMatchGroups(regexes[i - 1]);
  }
  // we use _emit to keep track of which match groups are "top-level" to avoid double
  // output from inside match groups
  mode[key] = positions;
  mode[key]._emit = emit;
  mode[key]._multi = true;
}

/**
 * @param {CompiledMode} mode
 */
function beginMultiClass(mode) {
  if (!Array.isArray(mode.begin)) return;

  if (mode.skip || mode.excludeBegin || mode.returnBegin) {
    error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
    error("beginScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.begin, { key: "beginScope" });
  mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
}

/**
 * @param {CompiledMode} mode
 */
function endMultiClass(mode) {
  if (!Array.isArray(mode.end)) return;

  if (mode.skip || mode.excludeEnd || mode.returnEnd) {
    error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.endScope !== "object" || mode.endScope === null) {
    error("endScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.end, { key: "endScope" });
  mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
}

/**
 * this exists only to allow `scope: {}` to be used beside `match:`
 * Otherwise `beginScope` would necessary and that would look weird

  {
    match: [ /def/, /\w+/ ]
    scope: { 1: "keyword" , 2: "title" }
  }

 * @param {CompiledMode} mode
 */
function scopeSugar(mode) {
  if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
    mode.beginScope = mode.scope;
    delete mode.scope;
  }
}

/**
 * @param {CompiledMode} mode
 */
function MultiClass(mode) {
  scopeSugar(mode);

  if (typeof mode.beginScope === "string") {
    mode.beginScope = { _wrap: mode.beginScope };
  }
  if (typeof mode.endScope === "string") {
    mode.endScope = { _wrap: mode.endScope };
  }

  beginMultiClass(mode);
  endMultiClass(mode);
}

/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
*/

// compilation

/**
 * Compiles a language definition result
 *
 * Given the raw result of a language definition (Language), compiles this so
 * that it is ready for highlighting code.
 * @param {Language} language
 * @returns {CompiledLanguage}
 */
function compileLanguage(language) {
  /**
   * Builds a regex with the case sensitivity of the current language
   *
   * @param {RegExp | string} value
   * @param {boolean} [global]
   */
  function langRe(value, global) {
    return new RegExp(
      source(value),
      'm'
      + (language.case_insensitive ? 'i' : '')
      + (language.unicodeRegex ? 'u' : '')
      + (global ? 'g' : '')
    );
  }

  /**
    Stores multiple regular expressions and allows you to quickly search for
    them all in a string simultaneously - returning the first match.  It does
    this by creating a huge (a|b|c) regex - each individual item wrapped with ()
    and joined by `|` - using match groups to track position.  When a match is
    found checking which position in the array has content allows us to figure
    out which of the original regexes / match groups triggered the match.

    The match object itself (the result of `Regex.exec`) is returned but also
    enhanced by merging in any meta-data that was registered with the regex.
    This is how we keep track of which mode matched, and what type of rule
    (`illegal`, `begin`, end, etc).
  */
  class MultiRegex {
    constructor() {
      this.matchIndexes = {};
      // @ts-ignore
      this.regexes = [];
      this.matchAt = 1;
      this.position = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      opts.position = this.position++;
      // @ts-ignore
      this.matchIndexes[this.matchAt] = opts;
      this.regexes.push([opts, re]);
      this.matchAt += countMatchGroups(re) + 1;
    }

    compile() {
      if (this.regexes.length === 0) {
        // avoids the need to check length every time exec is called
        // @ts-ignore
        this.exec = () => null;
      }
      const terminators = this.regexes.map(el => el[1]);
      this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
      this.lastIndex = 0;
    }

    /** @param {string} s */
    exec(s) {
      this.matcherRe.lastIndex = this.lastIndex;
      const match = this.matcherRe.exec(s);
      if (!match) { return null; }

      // eslint-disable-next-line no-undefined
      const i = match.findIndex((el, i) => i > 0 && el !== undefined);
      // @ts-ignore
      const matchData = this.matchIndexes[i];
      // trim off any earlier non-relevant match groups (ie, the other regex
      // match groups that make up the multi-matcher)
      match.splice(0, i);

      return Object.assign(match, matchData);
    }
  }

  /*
    Created to solve the key deficiently with MultiRegex - there is no way to
    test for multiple matches at a single location.  Why would we need to do
    that?  In the future a more dynamic engine will allow certain matches to be
    ignored.  An example: if we matched say the 3rd regex in a large group but
    decided to ignore it - we'd need to started testing again at the 4th
    regex... but MultiRegex itself gives us no real way to do that.

    So what this class creates MultiRegexs on the fly for whatever search
    position they are needed.

    NOTE: These additional MultiRegex objects are created dynamically.  For most
    grammars most of the time we will never actually need anything more than the
    first MultiRegex - so this shouldn't have too much overhead.

    Say this is our search group, and we match regex3, but wish to ignore it.

      regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

    What we need is a new MultiRegex that only includes the remaining
    possibilities:

      regex4 | regex5                               ' ie, startAt = 3

    This class wraps all that complexity up in a simple API... `startAt` decides
    where in the array of expressions to start doing the matching. It
    auto-increments, so if a match is found at position 2, then startAt will be
    set to 3.  If the end is reached startAt will return to 0.

    MOST of the time the parser will be setting startAt manually to 0.
  */
  class ResumableMultiRegex {
    constructor() {
      // @ts-ignore
      this.rules = [];
      // @ts-ignore
      this.multiRegexes = [];
      this.count = 0;

      this.lastIndex = 0;
      this.regexIndex = 0;
    }

    // @ts-ignore
    getMatcher(index) {
      if (this.multiRegexes[index]) return this.multiRegexes[index];

      const matcher = new MultiRegex();
      this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
      matcher.compile();
      this.multiRegexes[index] = matcher;
      return matcher;
    }

    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }

    considerAll() {
      this.regexIndex = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      this.rules.push([re, opts]);
      if (opts.type === "begin") this.count++;
    }

    /** @param {string} s */
    exec(s) {
      const m = this.getMatcher(this.regexIndex);
      m.lastIndex = this.lastIndex;
      let result = m.exec(s);

      // The following is because we have no easy way to say "resume scanning at the
      // existing position but also skip the current rule ONLY". What happens is
      // all prior rules are also skipped which can result in matching the wrong
      // thing. Example of matching "booger":

      // our matcher is [string, "booger", number]
      //
      // ....booger....

      // if "booger" is ignored then we'd really need a regex to scan from the
      // SAME position for only: [string, number] but ignoring "booger" (if it
      // was the first match), a simple resume would scan ahead who knows how
      // far looking only for "number", ignoring potential string matches (or
      // future "booger" matches that might be valid.)

      // So what we do: We execute two matchers, one resuming at the same
      // position, but the second full matcher starting at the position after:

      //     /--- resume first regex match here (for [number])
      //     |/---- full match here for [string, "booger", number]
      //     vv
      // ....booger....

      // Which ever results in a match first is then used. So this 3-4 step
      // process essentially allows us to say "match at this position, excluding
      // a prior rule that was ignored".
      //
      // 1. Match "booger" first, ignore. Also proves that [string] does non match.
      // 2. Resume matching for [number]
      // 3. Match at index + 1 for [string, "booger", number]
      // 4. If #2 and #3 result in matches, which came first?
      if (this.resumingScanAtSamePosition()) {
        if (result && result.index === this.lastIndex) ; else { // use the second matcher result
          const m2 = this.getMatcher(0);
          m2.lastIndex = this.lastIndex + 1;
          result = m2.exec(s);
        }
      }

      if (result) {
        this.regexIndex += result.position + 1;
        if (this.regexIndex === this.count) {
          // wrap-around to considering all matches again
          this.considerAll();
        }
      }

      return result;
    }
  }

  /**
   * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
   * the content and find matches.
   *
   * @param {CompiledMode} mode
   * @returns {ResumableMultiRegex}
   */
  function buildModeRegex(mode) {
    const mm = new ResumableMultiRegex();

    mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

    if (mode.terminatorEnd) {
      mm.addRule(mode.terminatorEnd, { type: "end" });
    }
    if (mode.illegal) {
      mm.addRule(mode.illegal, { type: "illegal" });
    }

    return mm;
  }

  /** skip vs abort vs ignore
   *
   * @skip   - The mode is still entered and exited normally (and contains rules apply),
   *           but all content is held and added to the parent buffer rather than being
   *           output when the mode ends.  Mostly used with `sublanguage` to build up
   *           a single large buffer than can be parsed by sublanguage.
   *
   *             - The mode begin ands ends normally.
   *             - Content matched is added to the parent mode buffer.
   *             - The parser cursor is moved forward normally.
   *
   * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
   *           never matched) but DOES NOT continue to match subsequent `contains`
   *           modes.  Abort is bad/suboptimal because it can result in modes
   *           farther down not getting applied because an earlier rule eats the
   *           content but then aborts.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is added to the mode buffer.
   *             - The parser cursor is moved forward accordingly.
   *
   * @ignore - Ignores the mode (as if it never matched) and continues to match any
   *           subsequent `contains` modes.  Ignore isn't technically possible with
   *           the current parser implementation.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is ignored.
   *             - The parser cursor is not moved forward.
   */

  /**
   * Compiles an individual mode
   *
   * This can raise an error if the mode contains certain detectable known logic
   * issues.
   * @param {Mode} mode
   * @param {CompiledMode | null} [parent]
   * @returns {CompiledMode | never}
   */
  function compileMode(mode, parent) {
    const cmode = /** @type CompiledMode */ (mode);
    if (mode.isCompiled) return cmode;

    [
      scopeClassName,
      // do this early so compiler extensions generally don't have to worry about
      // the distinction between match/begin
      compileMatch,
      MultiClass,
      beforeMatchExt
    ].forEach(ext => ext(mode, parent));

    language.compilerExtensions.forEach(ext => ext(mode, parent));

    // __beforeBegin is considered private API, internal use only
    mode.__beforeBegin = null;

    [
      beginKeywords,
      // do this later so compiler extensions that come earlier have access to the
      // raw array if they wanted to perhaps manipulate it, etc.
      compileIllegal,
      // default to 1 relevance if not specified
      compileRelevance
    ].forEach(ext => ext(mode, parent));

    mode.isCompiled = true;

    let keywordPattern = null;
    if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
      // we need a copy because keywords might be compiled multiple times
      // so we can't go deleting $pattern from the original on the first
      // pass
      mode.keywords = Object.assign({}, mode.keywords);
      keywordPattern = mode.keywords.$pattern;
      delete mode.keywords.$pattern;
    }
    keywordPattern = keywordPattern || /\w+/;

    if (mode.keywords) {
      mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
    }

    cmode.keywordPatternRe = langRe(keywordPattern, true);

    if (parent) {
      if (!mode.begin) mode.begin = /\B|\b/;
      cmode.beginRe = langRe(cmode.begin);
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) cmode.endRe = langRe(cmode.end);
      cmode.terminatorEnd = source(cmode.end) || '';
      if (mode.endsWithParent && parent.terminatorEnd) {
        cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
      }
    }
    if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
    if (!mode.contains) mode.contains = [];

    mode.contains = [].concat(...mode.contains.map(function(c) {
      return expandOrCloneMode(c === 'self' ? mode : c);
    }));
    mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    cmode.matcher = buildModeRegex(cmode);
    return cmode;
  }

  if (!language.compilerExtensions) language.compilerExtensions = [];

  // self is not valid at the top-level
  if (language.contains && language.contains.includes('self')) {
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  }

  // we need a null object, which inherit will guarantee
  language.classNameAliases = inherit$1(language.classNameAliases || {});

  return compileMode(/** @type Mode */ (language));
}

/**
 * Determines if a mode has a dependency on it's parent or not
 *
 * If a mode does have a parent dependency then often we need to clone it if
 * it's used in multiple places so that each copy points to the correct parent,
 * where-as modes without a parent can often safely be re-used at the bottom of
 * a mode chain.
 *
 * @param {Mode | null} mode
 * @returns {boolean} - is there a dependency on the parent?
 * */
function dependencyOnParent(mode) {
  if (!mode) return false;

  return mode.endsWithParent || dependencyOnParent(mode.starts);
}

/**
 * Expands a mode or clones it if necessary
 *
 * This is necessary for modes with parental dependenceis (see notes on
 * `dependencyOnParent`) and for nodes that have `variants` - which must then be
 * exploded into their own individual modes at compile time.
 *
 * @param {Mode} mode
 * @returns {Mode | Mode[]}
 * */
function expandOrCloneMode(mode) {
  if (mode.variants && !mode.cachedVariants) {
    mode.cachedVariants = mode.variants.map(function(variant) {
      return inherit$1(mode, { variants: null }, variant);
    });
  }

  // EXPAND
  // if we have variants then essentially "replace" the mode with the variants
  // this happens in compileMode, where this function is called from
  if (mode.cachedVariants) {
    return mode.cachedVariants;
  }

  // CLONE
  // if we have dependencies on parents then we need a unique
  // instance of ourselves, so we can be reused with many
  // different parents without issue
  if (dependencyOnParent(mode)) {
    return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
  }

  if (Object.isFrozen(mode)) {
    return inherit$1(mode);
  }

  // no special dependency issues, just return ourselves
  return mode;
}

var version = "11.6.0";

class HTMLInjectionError extends Error {
  constructor(reason, html) {
    super(reason);
    this.name = "HTMLInjectionError";
    this.html = html;
  }
}

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').CompiledScope} CompiledScope
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSApi} HLJSApi
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').PluginEvent} PluginEvent
@typedef {import('highlight.js').HLJSOptions} HLJSOptions
@typedef {import('highlight.js').LanguageFn} LanguageFn
@typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
@typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
@typedef {import('highlight.js/private').MatchType} MatchType
@typedef {import('highlight.js/private').KeywordData} KeywordData
@typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
@typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
@typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
@typedef {import('highlight.js').HighlightOptions} HighlightOptions
@typedef {import('highlight.js').HighlightResult} HighlightResult
*/


const escape = escapeHTML;
const inherit = inherit$1;
const NO_MATCH = Symbol("nomatch");
const MAX_KEYWORD_HITS = 7;

/**
 * @param {any} hljs - object that is extended (legacy)
 * @returns {HLJSApi}
 */
const HLJS = function(hljs) {
  // Global internal variables used within the highlight.js library.
  /** @type {Record<string, Language>} */
  const languages = Object.create(null);
  /** @type {Record<string, string>} */
  const aliases = Object.create(null);
  /** @type {HLJSPlugin[]} */
  const plugins = [];

  // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error
  let SAFE_MODE = true;
  const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  /** @type {Language} */
  const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  /** @type HLJSOptions */
  let options = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: 'hljs-',
    cssSelector: 'pre code',
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: TokenTreeEmitter
  };

  /* Utility functions */

  /**
   * Tests a language name to see if highlighting should be skipped
   * @param {string} languageName
   */
  function shouldNotHighlight(languageName) {
    return options.noHighlightRe.test(languageName);
  }

  /**
   * @param {HighlightedHTMLElement} block - the HTML element to determine language for
   */
  function blockLanguage(block) {
    let classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    const match = options.languageDetectRe.exec(classes);
    if (match) {
      const language = getLanguage(match[1]);
      if (!language) {
        warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : 'no-highlight';
    }

    return classes
      .split(/\s+/)
      .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
  }

  /**
   * Core highlighting function.
   *
   * OLD API
   * highlight(lang, code, ignoreIllegals, continuation)
   *
   * NEW API
   * highlight(code, {lang, ignoreIllegals})
   *
   * @param {string} codeOrLanguageName - the language to use for highlighting
   * @param {string | HighlightOptions} optionsOrCode - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   *
   * @returns {HighlightResult} Result - an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {string} code - the original raw code
   * @property {CompiledMode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */
  function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
    let code = "";
    let languageName = "";
    if (typeof optionsOrCode === "object") {
      code = codeOrLanguageName;
      ignoreIllegals = optionsOrCode.ignoreIllegals;
      languageName = optionsOrCode.language;
    } else {
      // old API
      deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
      deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
      languageName = codeOrLanguageName;
      code = optionsOrCode;
    }

    // https://github.com/highlightjs/highlight.js/issues/3149
    // eslint-disable-next-line no-undefined
    if (ignoreIllegals === undefined) { ignoreIllegals = true; }

    /** @type {BeforeHighlightContext} */
    const context = {
      code,
      language: languageName
    };
    // the plugin can change the desired language or the code to be highlighted
    // just be changing the object it was passed
    fire("before:highlight", context);

    // a before plugin can usurp the result completely by providing it's own
    // in which case we don't even need to call highlight
    const result = context.result
      ? context.result
      : _highlight(context.language, context.code, ignoreIllegals);

    result.code = context.code;
    // the plugin can change anything in result to suite it
    fire("after:highlight", result);

    return result;
  }

  /**
   * private highlight that's used internally and does not fire callbacks
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} codeToHighlight - the code to highlight
   * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode?} [continuation] - current continuation mode, if any
   * @returns {HighlightResult} - result of the highlight operation
  */
  function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
    const keywordHits = Object.create(null);

    /**
     * Return keyword data if a match is a keyword
     * @param {CompiledMode} mode - current mode
     * @param {string} matchText - the textual match
     * @returns {KeywordData | false}
     */
    function keywordData(mode, matchText) {
      return mode.keywords[matchText];
    }

    function processKeywords() {
      if (!top.keywords) {
        emitter.addText(modeBuffer);
        return;
      }

      let lastIndex = 0;
      top.keywordPatternRe.lastIndex = 0;
      let match = top.keywordPatternRe.exec(modeBuffer);
      let buf = "";

      while (match) {
        buf += modeBuffer.substring(lastIndex, match.index);
        const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
        const data = keywordData(top, word);
        if (data) {
          const [kind, keywordRelevance] = data;
          emitter.addText(buf);
          buf = "";

          keywordHits[word] = (keywordHits[word] || 0) + 1;
          if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
          if (kind.startsWith("_")) {
            // _ implied for relevance only, do not highlight
            // by applying a class name
            buf += match[0];
          } else {
            const cssClass = language.classNameAliases[kind] || kind;
            emitter.addKeyword(match[0], cssClass);
          }
        } else {
          buf += match[0];
        }
        lastIndex = top.keywordPatternRe.lastIndex;
        match = top.keywordPatternRe.exec(modeBuffer);
      }
      buf += modeBuffer.substring(lastIndex);
      emitter.addText(buf);
    }

    function processSubLanguage() {
      if (modeBuffer === "") return;
      /** @type HighlightResult */
      let result = null;

      if (typeof top.subLanguage === 'string') {
        if (!languages[top.subLanguage]) {
          emitter.addText(modeBuffer);
          return;
        }
        result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
        continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
      } else {
        result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
      }

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      emitter.addSublanguage(result._emitter, result.language);
    }

    function processBuffer() {
      if (top.subLanguage != null) {
        processSubLanguage();
      } else {
        processKeywords();
      }
      modeBuffer = '';
    }

    /**
     * @param {CompiledScope} scope
     * @param {RegExpMatchArray} match
     */
    function emitMultiClass(scope, match) {
      let i = 1;
      const max = match.length - 1;
      while (i <= max) {
        if (!scope._emit[i]) { i++; continue; }
        const klass = language.classNameAliases[scope[i]] || scope[i];
        const text = match[i];
        if (klass) {
          emitter.addKeyword(text, klass);
        } else {
          modeBuffer = text;
          processKeywords();
          modeBuffer = "";
        }
        i++;
      }
    }

    /**
     * @param {CompiledMode} mode - new mode to start
     * @param {RegExpMatchArray} match
     */
    function startNewMode(mode, match) {
      if (mode.scope && typeof mode.scope === "string") {
        emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
      }
      if (mode.beginScope) {
        // beginScope just wraps the begin match itself in a scope
        if (mode.beginScope._wrap) {
          emitter.addKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
          modeBuffer = "";
        } else if (mode.beginScope._multi) {
          // at this point modeBuffer should just be the match
          emitMultiClass(mode.beginScope, match);
          modeBuffer = "";
        }
      }

      top = Object.create(mode, { parent: { value: top } });
      return top;
    }

    /**
     * @param {CompiledMode } mode - the mode to potentially end
     * @param {RegExpMatchArray} match - the latest match
     * @param {string} matchPlusRemainder - match plus remainder of content
     * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
     */
    function endOfMode(mode, match, matchPlusRemainder) {
      let matched = startsWith(mode.endRe, matchPlusRemainder);

      if (matched) {
        if (mode["on:end"]) {
          const resp = new Response(mode);
          mode["on:end"](match, resp);
          if (resp.isMatchIgnored) matched = false;
        }

        if (matched) {
          while (mode.endsParent && mode.parent) {
            mode = mode.parent;
          }
          return mode;
        }
      }
      // even if on:end fires an `ignore` it's still possible
      // that we might trigger the end node because of a parent mode
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, match, matchPlusRemainder);
      }
    }

    /**
     * Handle matching but then ignoring a sequence of text
     *
     * @param {string} lexeme - string containing full match text
     */
    function doIgnore(lexeme) {
      if (top.matcher.regexIndex === 0) {
        // no more regexes to potentially match here, so we move the cursor forward one
        // space
        modeBuffer += lexeme[0];
        return 1;
      } else {
        // no need to move the cursor, we still have additional regexes to try and
        // match at this very spot
        resumeScanAtSamePosition = true;
        return 0;
      }
    }

    /**
     * Handle the start of a new potential mode match
     *
     * @param {EnhancedMatch} match - the current match
     * @returns {number} how far to advance the parse cursor
     */
    function doBeginMatch(match) {
      const lexeme = match[0];
      const newMode = match.rule;

      const resp = new Response(newMode);
      // first internal before callbacks, then the public ones
      const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
      for (const cb of beforeCallbacks) {
        if (!cb) continue;
        cb(match, resp);
        if (resp.isMatchIgnored) return doIgnore(lexeme);
      }

      if (newMode.skip) {
        modeBuffer += lexeme;
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme;
        }
      }
      startNewMode(newMode, match);
      return newMode.returnBegin ? 0 : lexeme.length;
    }

    /**
     * Handle the potential end of mode
     *
     * @param {RegExpMatchArray} match - the current match
     */
    function doEndMatch(match) {
      const lexeme = match[0];
      const matchPlusRemainder = codeToHighlight.substring(match.index);

      const endMode = endOfMode(top, match, matchPlusRemainder);
      if (!endMode) { return NO_MATCH; }

      const origin = top;
      if (top.endScope && top.endScope._wrap) {
        processBuffer();
        emitter.addKeyword(lexeme, top.endScope._wrap);
      } else if (top.endScope && top.endScope._multi) {
        processBuffer();
        emitMultiClass(top.endScope, match);
      } else if (origin.skip) {
        modeBuffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          modeBuffer = lexeme;
        }
      }
      do {
        if (top.scope) {
          emitter.closeNode();
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== endMode.parent);
      if (endMode.starts) {
        startNewMode(endMode.starts, match);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    function processContinuations() {
      const list = [];
      for (let current = top; current !== language; current = current.parent) {
        if (current.scope) {
          list.unshift(current.scope);
        }
      }
      list.forEach(item => emitter.openNode(item));
    }

    /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
    let lastMatch = {};

    /**
     *  Process an individual match
     *
     * @param {string} textBeforeMatch - text preceding the match (since the last match)
     * @param {EnhancedMatch} [match] - the match itself
     */
    function processLexeme(textBeforeMatch, match) {
      const lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      modeBuffer += textBeforeMatch;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
        if (!SAFE_MODE) {
          /** @type {AnnotatedError} */
          const err = new Error(`0 width match regex (${languageName})`);
          err.languageName = languageName;
          err.badRule = lastMatch.rule;
          throw err;
        }
        return 1;
      }
      lastMatch = match;

      if (match.type === "begin") {
        return doBeginMatch(match);
      } else if (match.type === "illegal" && !ignoreIllegals) {
        // illegal match, we do not continue processing
        /** @type {AnnotatedError} */
        const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
        err.mode = top;
        throw err;
      } else if (match.type === "end") {
        const processed = doEndMatch(match);
        if (processed !== NO_MATCH) {
          return processed;
        }
      }

      // edge case for when illegal matches $ (end of line) which is technically
      // a 0 width match but not a begin/end match so it's not caught by the
      // first handler (when ignoreIllegals is true)
      if (match.type === "illegal" && lexeme === "") {
        // advance so we aren't stuck in an infinite loop
        return 1;
      }

      // infinite loops are BAD, this is a last ditch catch all. if we have a
      // decent number of iterations yet our index (cursor position in our
      // parsing) still 3x behind our index then something is very wrong
      // so we bail
      if (iterations > 100000 && iterations > match.index * 3) {
        const err = new Error('potential infinite loop, way more iterations than matches');
        throw err;
      }

      /*
      Why might be find ourselves here?  An potential end match that was
      triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
      (this could be because a callback requests the match be ignored, etc)

      This causes no real harm other than stopping a few times too many.
      */

      modeBuffer += lexeme;
      return lexeme.length;
    }

    const language = getLanguage(languageName);
    if (!language) {
      error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    const md = compileLanguage(language);
    let result = '';
    /** @type {CompiledMode} */
    let top = continuation || md;
    /** @type Record<string,CompiledMode> */
    const continuations = {}; // keep continuations for sub-languages
    const emitter = new options.__emitter(options);
    processContinuations();
    let modeBuffer = '';
    let relevance = 0;
    let index = 0;
    let iterations = 0;
    let resumeScanAtSamePosition = false;

    try {
      top.matcher.considerAll();

      for (;;) {
        iterations++;
        if (resumeScanAtSamePosition) {
          // only regexes not matched previously will now be
          // considered for a potential match
          resumeScanAtSamePosition = false;
        } else {
          top.matcher.considerAll();
        }
        top.matcher.lastIndex = index;

        const match = top.matcher.exec(codeToHighlight);
        // console.log("match", match[0], match.rule && match.rule.begin)

        if (!match) break;

        const beforeMatch = codeToHighlight.substring(index, match.index);
        const processedCount = processLexeme(beforeMatch, match);
        index = match.index + processedCount;
      }
      processLexeme(codeToHighlight.substring(index));
      emitter.closeAllNodes();
      emitter.finalize();
      result = emitter.toHTML();

      return {
        language: languageName,
        value: result,
        relevance: relevance,
        illegal: false,
        _emitter: emitter,
        _top: top
      };
    } catch (err) {
      if (err.message && err.message.includes('Illegal')) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: true,
          relevance: 0,
          _illegalBy: {
            message: err.message,
            index: index,
            context: codeToHighlight.slice(index - 100, index + 100),
            mode: err.mode,
            resultSoFar: result
          },
          _emitter: emitter
        };
      } else if (SAFE_MODE) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: false,
          relevance: 0,
          errorRaised: err,
          _emitter: emitter,
          _top: top
        };
      } else {
        throw err;
      }
    }
  }

  /**
   * returns a valid highlight result, without actually doing any actual work,
   * auto highlight starts with this and it's possible for small snippets that
   * auto-detection may not find a better match
   * @param {string} code
   * @returns {HighlightResult}
   */
  function justTextHighlightResult(code) {
    const result = {
      value: escape(code),
      illegal: false,
      relevance: 0,
      _top: PLAINTEXT_LANGUAGE,
      _emitter: new options.__emitter(options)
    };
    result._emitter.addText(code);
    return result;
  }

  /**
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - secondBest (object with the same structure for second-best heuristically
    detected language, may be absent)

    @param {string} code
    @param {Array<string>} [languageSubset]
    @returns {AutoHighlightResult}
  */
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    const plaintext = justTextHighlightResult(code);

    const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
      _highlight(name, code, false)
    );
    results.unshift(plaintext); // plaintext is always an option

    const sorted = results.sort((a, b) => {
      // sort base on relevance
      if (a.relevance !== b.relevance) return b.relevance - a.relevance;

      // always award the tie to the base language
      // ie if C++ and Arduino are tied, it's more likely to be C++
      if (a.language && b.language) {
        if (getLanguage(a.language).supersetOf === b.language) {
          return 1;
        } else if (getLanguage(b.language).supersetOf === a.language) {
          return -1;
        }
      }

      // otherwise say they are equal, which has the effect of sorting on
      // relevance while preserving the original ordering - which is how ties
      // have historically been settled, ie the language that comes first always
      // wins in the case of a tie
      return 0;
    });

    const [best, secondBest] = sorted;

    /** @type {AutoHighlightResult} */
    const result = best;
    result.secondBest = secondBest;

    return result;
  }

  /**
   * Builds new class name for block given the language name
   *
   * @param {HTMLElement} element
   * @param {string} [currentLang]
   * @param {string} [resultLang]
   */
  function updateClassName(element, currentLang, resultLang) {
    const language = (currentLang && aliases[currentLang]) || resultLang;

    element.classList.add("hljs");
    element.classList.add(`language-${language}`);
  }

  /**
   * Applies highlighting to a DOM node containing code.
   *
   * @param {HighlightedHTMLElement} element - the HTML element to highlight
  */
  function highlightElement(element) {
    /** @type HTMLElement */
    let node = null;
    const language = blockLanguage(element);

    if (shouldNotHighlight(language)) return;

    fire("before:highlightElement",
      { el: element, language: language });

    // we should be all text, no child nodes (unescaped HTML) - this is possibly
    // an HTML injection attack - it's likely too late if this is already in
    // production (the code has likely already done its damage by the time
    // we're seeing it)... but we yell loudly about this so that hopefully it's
    // more likely to be caught in development before making it to production
    if (element.children.length > 0) {
      if (!options.ignoreUnescapedHTML) {
        console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
        console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
        console.warn("The element with unescaped HTML:");
        console.warn(element);
      }
      if (options.throwUnescapedHTML) {
        const err = new HTMLInjectionError(
          "One of your code blocks includes unescaped HTML.",
          element.innerHTML
        );
        throw err;
      }
    }

    node = element;
    const text = node.textContent;
    const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

    element.innerHTML = result.value;
    updateClassName(element, language, result.language);
    element.result = {
      language: result.language,
      // TODO: remove with version 11.0
      re: result.relevance,
      relevance: result.relevance
    };
    if (result.secondBest) {
      element.secondBest = {
        language: result.secondBest.language,
        relevance: result.secondBest.relevance
      };
    }

    fire("after:highlightElement", { el: element, result, text });
  }

  /**
   * Updates highlight.js global options with the passed options
   *
   * @param {Partial<HLJSOptions>} userOptions
   */
  function configure(userOptions) {
    options = inherit(options, userOptions);
  }

  // TODO: remove v12, deprecated
  const initHighlighting = () => {
    highlightAll();
    deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };

  // TODO: remove v12, deprecated
  function initHighlightingOnLoad() {
    highlightAll();
    deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }

  let wantsHighlight = false;

  /**
   * auto-highlights all pre>code elements on the page
   */
  function highlightAll() {
    // if we are called too early in the loading process
    if (document.readyState === "loading") {
      wantsHighlight = true;
      return;
    }

    const blocks = document.querySelectorAll(options.cssSelector);
    blocks.forEach(highlightElement);
  }

  function boot() {
    // if a highlight was requested before DOM was loaded, do now
    if (wantsHighlight) highlightAll();
  }

  // make sure we are in the browser environment
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', boot, false);
  }

  /**
   * Register a language grammar module
   *
   * @param {string} languageName
   * @param {LanguageFn} languageDefinition
   */
  function registerLanguage(languageName, languageDefinition) {
    let lang = null;
    try {
      lang = languageDefinition(hljs);
    } catch (error$1) {
      error("Language definition for '{}' could not be registered.".replace("{}", languageName));
      // hard or soft error
      if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
      // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter
      lang = PLAINTEXT_LANGUAGE;
    }
    // give it a temporary name if it doesn't have one in the meta-data
    if (!lang.name) lang.name = languageName;
    languages[languageName] = lang;
    lang.rawDefinition = languageDefinition.bind(null, hljs);

    if (lang.aliases) {
      registerAliases(lang.aliases, { languageName });
    }
  }

  /**
   * Remove a language grammar module
   *
   * @param {string} languageName
   */
  function unregisterLanguage(languageName) {
    delete languages[languageName];
    for (const alias of Object.keys(aliases)) {
      if (aliases[alias] === languageName) {
        delete aliases[alias];
      }
    }
  }

  /**
   * @returns {string[]} List of language internal names
   */
  function listLanguages() {
    return Object.keys(languages);
  }

  /**
   * @param {string} name - name of the language to retrieve
   * @returns {Language | undefined}
   */
  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /**
   *
   * @param {string|string[]} aliasList - single alias or list of aliases
   * @param {{languageName: string}} opts
   */
  function registerAliases(aliasList, { languageName }) {
    if (typeof aliasList === 'string') {
      aliasList = [aliasList];
    }
    aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
  }

  /**
   * Determines if a given language has auto-detection enabled
   * @param {string} name - name of the language
   */
  function autoDetection(name) {
    const lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /**
   * Upgrades the old highlightBlock plugins to the new
   * highlightElement API
   * @param {HLJSPlugin} plugin
   */
  function upgradePluginAPI(plugin) {
    // TODO: remove with v12
    if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
      plugin["before:highlightElement"] = (data) => {
        plugin["before:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
    if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
      plugin["after:highlightElement"] = (data) => {
        plugin["after:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function addPlugin(plugin) {
    upgradePluginAPI(plugin);
    plugins.push(plugin);
  }

  /**
   *
   * @param {PluginEvent} event
   * @param {any} args
   */
  function fire(event, args) {
    const cb = event;
    plugins.forEach(function(plugin) {
      if (plugin[cb]) {
        plugin[cb](args);
      }
    });
  }

  /**
   * DEPRECATED
   * @param {HighlightedHTMLElement} el
   */
  function deprecateHighlightBlock(el) {
    deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
    deprecated("10.7.0", "Please use highlightElement now.");

    return highlightElement(el);
  }

  /* Interface definition */
  Object.assign(hljs, {
    highlight,
    highlightAuto,
    highlightAll,
    highlightElement,
    // TODO: Remove with v12 API
    highlightBlock: deprecateHighlightBlock,
    configure,
    initHighlighting,
    initHighlightingOnLoad,
    registerLanguage,
    unregisterLanguage,
    listLanguages,
    getLanguage,
    registerAliases,
    autoDetection,
    inherit,
    addPlugin
  });

  hljs.debugMode = function() { SAFE_MODE = false; };
  hljs.safeMode = function() { SAFE_MODE = true; };
  hljs.versionString = version;

  hljs.regex = {
    concat: concat,
    lookahead: lookahead,
    either: either,
    optional: optional,
    anyNumberOfTimes: anyNumberOfTimes
  };

  for (const key in MODES) {
    // @ts-ignore
    if (typeof MODES[key] === "object") {
      // @ts-ignore
      deepFreezeEs6.exports(MODES[key]);
    }
  }

  // merge all the modes/regexes into our main object
  Object.assign(hljs, MODES);

  return hljs;
};

// export an "instance" of the highlighter
var highlight = HLJS({});

module.exports = highlight;
highlight.HighlightJS = highlight;
highlight.default = highlight;

},{}],4:[function(require,module,exports){
/*
Language: Bash
Author: vah <vahtenberg@gmail.com>
Contributrors: Benjamin Pannell <contact@sierrasoftworks.com>
Website: https://www.gnu.org/software/bash/
Category: common
*/

/** @type LanguageFn */
function bash(hljs) {
  const regex = hljs.regex;
  const VAR = {};
  const BRACED_VAR = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [ VAR ]
      } // default values
    ]
  };
  Object.assign(VAR, {
    className: 'variable',
    variants: [
      { begin: regex.concat(/\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        `(?![\\w\\d])(?![$])`) },
      BRACED_VAR
    ]
  });

  const SUBST = {
    className: 'subst',
    begin: /\$\(/,
    end: /\)/,
    contains: [ hljs.BACKSLASH_ESCAPE ]
  };
  const HERE_DOC = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      hljs.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: 'string'
      })
    ] }
  };
  const QUOTE_STRING = {
    className: 'string',
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      SUBST
    ]
  };
  SUBST.contains.push(QUOTE_STRING);
  const ESCAPED_QUOTE = {
    className: '',
    begin: /\\"/

  };
  const APOS_STRING = {
    className: 'string',
    begin: /'/,
    end: /'/
  };
  const ARITHMETIC = {
    begin: /\$\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      hljs.NUMBER_MODE,
      VAR
    ]
  };
  const SH_LIKE_SHELLS = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh",
  ];
  const KNOWN_SHEBANG = hljs.SHEBANG({
    binary: `(${SH_LIKE_SHELLS.join("|")})`,
    relevance: 10
  });
  const FUNCTION = {
    className: 'function',
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: true,
    contains: [ hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ }) ],
    relevance: 0
  };

  const KEYWORDS = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "for",
    "while",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "function"
  ];

  const LITERALS = [
    "true",
    "false"
  ];

  // to consume paths to prevent keyword matches inside them
  const PATH_MODE = { match: /(\/[a-z._-]+)+/ };

  // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
  const SHELL_BUILT_INS = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ];

  const BASH_BUILT_INS = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ];

  const ZSH_BUILT_INS = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ];

  const GNU_CORE_UTILS = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];

  return {
    name: 'Bash',
    aliases: [ 'sh' ],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: [
        ...SHELL_BUILT_INS,
        ...BASH_BUILT_INS,
        // Shell modifiers
        "set",
        "shopt",
        ...ZSH_BUILT_INS,
        ...GNU_CORE_UTILS
      ]
    },
    contains: [
      KNOWN_SHEBANG, // to catch known shells and boost relevancy
      hljs.SHEBANG(), // to catch unknown shells but still highlight the shebang
      FUNCTION,
      ARITHMETIC,
      hljs.HASH_COMMENT_MODE,
      HERE_DOC,
      PATH_MODE,
      QUOTE_STRING,
      ESCAPED_QUOTE,
      APOS_STRING,
      VAR
    ]
  };
}

module.exports = bash;

},{}],5:[function(require,module,exports){
const MODES = (hljs) => {
  return {
    IMPORTANT: {
      scope: 'meta',
      begin: '!important'
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: 'number',
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: 'selector-attr',
      begin: /\[/,
      end: /\]/,
      illegal: '$',
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: 'number',
      begin: hljs.NUMBER_RE + '(' +
        '%|em|ex|ch|rem' +
        '|vw|vh|vmin|vmax' +
        '|cm|mm|in|pt|pc|px' +
        '|deg|grad|rad|turn' +
        '|s|ms' +
        '|Hz|kHz' +
        '|dpi|dpcm|dppx' +
        ')?',
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z][A-Za-z0-9_-]*/
    }
  };
};

const TAGS = [
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'audio',
  'b',
  'blockquote',
  'body',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'dd',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'mark',
  'menu',
  'nav',
  'object',
  'ol',
  'p',
  'q',
  'quote',
  'samp',
  'section',
  'span',
  'strong',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'ul',
  'var',
  'video'
];

const MEDIA_FEATURES = [
  'any-hover',
  'any-pointer',
  'aspect-ratio',
  'color',
  'color-gamut',
  'color-index',
  'device-aspect-ratio',
  'device-height',
  'device-width',
  'display-mode',
  'forced-colors',
  'grid',
  'height',
  'hover',
  'inverted-colors',
  'monochrome',
  'orientation',
  'overflow-block',
  'overflow-inline',
  'pointer',
  'prefers-color-scheme',
  'prefers-contrast',
  'prefers-reduced-motion',
  'prefers-reduced-transparency',
  'resolution',
  'scan',
  'scripting',
  'update',
  'width',
  // TODO: find a better solution?
  'min-width',
  'max-width',
  'min-height',
  'max-height'
];

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
const PSEUDO_CLASSES = [
  'active',
  'any-link',
  'blank',
  'checked',
  'current',
  'default',
  'defined',
  'dir', // dir()
  'disabled',
  'drop',
  'empty',
  'enabled',
  'first',
  'first-child',
  'first-of-type',
  'fullscreen',
  'future',
  'focus',
  'focus-visible',
  'focus-within',
  'has', // has()
  'host', // host or host()
  'host-context', // host-context()
  'hover',
  'indeterminate',
  'in-range',
  'invalid',
  'is', // is()
  'lang', // lang()
  'last-child',
  'last-of-type',
  'left',
  'link',
  'local-link',
  'not', // not()
  'nth-child', // nth-child()
  'nth-col', // nth-col()
  'nth-last-child', // nth-last-child()
  'nth-last-col', // nth-last-col()
  'nth-last-of-type', //nth-last-of-type()
  'nth-of-type', //nth-of-type()
  'only-child',
  'only-of-type',
  'optional',
  'out-of-range',
  'past',
  'placeholder-shown',
  'read-only',
  'read-write',
  'required',
  'right',
  'root',
  'scope',
  'target',
  'target-within',
  'user-invalid',
  'valid',
  'visited',
  'where' // where()
];

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
const PSEUDO_ELEMENTS = [
  'after',
  'backdrop',
  'before',
  'cue',
  'cue-region',
  'first-letter',
  'first-line',
  'grammar-error',
  'marker',
  'part',
  'placeholder',
  'selection',
  'slotted',
  'spelling-error'
];

const ATTRIBUTES = [
  'align-content',
  'align-items',
  'align-self',
  'all',
  'animation',
  'animation-delay',
  'animation-direction',
  'animation-duration',
  'animation-fill-mode',
  'animation-iteration-count',
  'animation-name',
  'animation-play-state',
  'animation-timing-function',
  'backface-visibility',
  'background',
  'background-attachment',
  'background-blend-mode',
  'background-clip',
  'background-color',
  'background-image',
  'background-origin',
  'background-position',
  'background-repeat',
  'background-size',
  'block-size',
  'border',
  'border-block',
  'border-block-color',
  'border-block-end',
  'border-block-end-color',
  'border-block-end-style',
  'border-block-end-width',
  'border-block-start',
  'border-block-start-color',
  'border-block-start-style',
  'border-block-start-width',
  'border-block-style',
  'border-block-width',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-style',
  'border-bottom-width',
  'border-collapse',
  'border-color',
  'border-image',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',
  'border-image-source',
  'border-image-width',
  'border-inline',
  'border-inline-color',
  'border-inline-end',
  'border-inline-end-color',
  'border-inline-end-style',
  'border-inline-end-width',
  'border-inline-start',
  'border-inline-start-color',
  'border-inline-start-style',
  'border-inline-start-width',
  'border-inline-style',
  'border-inline-width',
  'border-left',
  'border-left-color',
  'border-left-style',
  'border-left-width',
  'border-radius',
  'border-right',
  'border-right-color',
  'border-right-style',
  'border-right-width',
  'border-spacing',
  'border-style',
  'border-top',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-style',
  'border-top-width',
  'border-width',
  'bottom',
  'box-decoration-break',
  'box-shadow',
  'box-sizing',
  'break-after',
  'break-before',
  'break-inside',
  'caption-side',
  'caret-color',
  'clear',
  'clip',
  'clip-path',
  'clip-rule',
  'color',
  'column-count',
  'column-fill',
  'column-gap',
  'column-rule',
  'column-rule-color',
  'column-rule-style',
  'column-rule-width',
  'column-span',
  'column-width',
  'columns',
  'contain',
  'content',
  'content-visibility',
  'counter-increment',
  'counter-reset',
  'cue',
  'cue-after',
  'cue-before',
  'cursor',
  'direction',
  'display',
  'empty-cells',
  'filter',
  'flex',
  'flex-basis',
  'flex-direction',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'float',
  'flow',
  'font',
  'font-display',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-size',
  'font-size-adjust',
  'font-smoothing',
  'font-stretch',
  'font-style',
  'font-synthesis',
  'font-variant',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-variation-settings',
  'font-weight',
  'gap',
  'glyph-orientation-vertical',
  'grid',
  'grid-area',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-auto-rows',
  'grid-column',
  'grid-column-end',
  'grid-column-start',
  'grid-gap',
  'grid-row',
  'grid-row-end',
  'grid-row-start',
  'grid-template',
  'grid-template-areas',
  'grid-template-columns',
  'grid-template-rows',
  'hanging-punctuation',
  'height',
  'hyphens',
  'icon',
  'image-orientation',
  'image-rendering',
  'image-resolution',
  'ime-mode',
  'inline-size',
  'isolation',
  'justify-content',
  'left',
  'letter-spacing',
  'line-break',
  'line-height',
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'margin',
  'margin-block',
  'margin-block-end',
  'margin-block-start',
  'margin-bottom',
  'margin-inline',
  'margin-inline-end',
  'margin-inline-start',
  'margin-left',
  'margin-right',
  'margin-top',
  'marks',
  'mask',
  'mask-border',
  'mask-border-mode',
  'mask-border-outset',
  'mask-border-repeat',
  'mask-border-slice',
  'mask-border-source',
  'mask-border-width',
  'mask-clip',
  'mask-composite',
  'mask-image',
  'mask-mode',
  'mask-origin',
  'mask-position',
  'mask-repeat',
  'mask-size',
  'mask-type',
  'max-block-size',
  'max-height',
  'max-inline-size',
  'max-width',
  'min-block-size',
  'min-height',
  'min-inline-size',
  'min-width',
  'mix-blend-mode',
  'nav-down',
  'nav-index',
  'nav-left',
  'nav-right',
  'nav-up',
  'none',
  'normal',
  'object-fit',
  'object-position',
  'opacity',
  'order',
  'orphans',
  'outline',
  'outline-color',
  'outline-offset',
  'outline-style',
  'outline-width',
  'overflow',
  'overflow-wrap',
  'overflow-x',
  'overflow-y',
  'padding',
  'padding-block',
  'padding-block-end',
  'padding-block-start',
  'padding-bottom',
  'padding-inline',
  'padding-inline-end',
  'padding-inline-start',
  'padding-left',
  'padding-right',
  'padding-top',
  'page-break-after',
  'page-break-before',
  'page-break-inside',
  'pause',
  'pause-after',
  'pause-before',
  'perspective',
  'perspective-origin',
  'pointer-events',
  'position',
  'quotes',
  'resize',
  'rest',
  'rest-after',
  'rest-before',
  'right',
  'row-gap',
  'scroll-margin',
  'scroll-margin-block',
  'scroll-margin-block-end',
  'scroll-margin-block-start',
  'scroll-margin-bottom',
  'scroll-margin-inline',
  'scroll-margin-inline-end',
  'scroll-margin-inline-start',
  'scroll-margin-left',
  'scroll-margin-right',
  'scroll-margin-top',
  'scroll-padding',
  'scroll-padding-block',
  'scroll-padding-block-end',
  'scroll-padding-block-start',
  'scroll-padding-bottom',
  'scroll-padding-inline',
  'scroll-padding-inline-end',
  'scroll-padding-inline-start',
  'scroll-padding-left',
  'scroll-padding-right',
  'scroll-padding-top',
  'scroll-snap-align',
  'scroll-snap-stop',
  'scroll-snap-type',
  'scrollbar-color',
  'scrollbar-gutter',
  'scrollbar-width',
  'shape-image-threshold',
  'shape-margin',
  'shape-outside',
  'speak',
  'speak-as',
  'src', // @font-face
  'tab-size',
  'table-layout',
  'text-align',
  'text-align-all',
  'text-align-last',
  'text-combine-upright',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-style',
  'text-emphasis',
  'text-emphasis-color',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-indent',
  'text-justify',
  'text-orientation',
  'text-overflow',
  'text-rendering',
  'text-shadow',
  'text-transform',
  'text-underline-position',
  'top',
  'transform',
  'transform-box',
  'transform-origin',
  'transform-style',
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'unicode-bidi',
  'vertical-align',
  'visibility',
  'voice-balance',
  'voice-duration',
  'voice-family',
  'voice-pitch',
  'voice-range',
  'voice-rate',
  'voice-stress',
  'voice-volume',
  'white-space',
  'widows',
  'width',
  'will-change',
  'word-break',
  'word-spacing',
  'word-wrap',
  'writing-mode',
  'z-index'
  // reverse makes sure longer attributes `font-weight` are matched fully
  // instead of getting false positives on say `font`
].reverse();

/*
Language: CSS
Category: common, css, web
Website: https://developer.mozilla.org/en-US/docs/Web/CSS
*/

/** @type LanguageFn */
function css(hljs) {
  const regex = hljs.regex;
  const modes = MODES(hljs);
  const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
  const AT_MODIFIERS = "and or not only";
  const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/; // @-webkit-keyframes
  const IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  const STRINGS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ];

  return {
    name: 'CSS',
    case_insensitive: true,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      // for visual continuity with `tag {}` and because we
      // don't have a great class for this?
      keyframePosition: "selector-tag" },
    contains: [
      modes.BLOCK_COMMENT,
      VENDOR_PREFIX,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: 'selector-id',
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: 'selector-class',
        begin: '\\.' + IDENT_RE,
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: 'selector-pseudo',
        variants: [
          { begin: ':(' + PSEUDO_CLASSES.join('|') + ')' },
          { begin: ':(:)?(' + PSEUDO_ELEMENTS.join('|') + ')' }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      modes.CSS_VARIABLE,
      {
        className: 'attribute',
        begin: '\\b(' + ATTRIBUTES.join('|') + ')\\b'
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          modes.BLOCK_COMMENT,
          modes.HEXCOLOR,
          modes.IMPORTANT,
          modes.CSS_NUMBER_MODE,
          ...STRINGS,
          // needed to highlight these as strings and to avoid issues with
          // illegal characters that might be inside urls that would tigger the
          // languages illegal stack
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0, // from keywords
            keywords: { built_in: "url data-uri" },
            contains: [
              ...STRINGS,
              {
                className: "string",
                // any character other than `)` as in `url()` will be the start
                // of a string, which ends with `)` (from the parent mode)
                begin: /[^)]/,
                endsWithParent: true,
                excludeEnd: true
              }
            ]
          },
          modes.FUNCTION_DISPATCH
        ]
      },
      {
        begin: regex.lookahead(/@/),
        end: '[{;]',
        relevance: 0,
        illegal: /:/, // break on Less variables @var: ...
        contains: [
          {
            className: 'keyword',
            begin: AT_PROPERTY_RE
          },
          {
            begin: /\s/,
            endsWithParent: true,
            excludeEnd: true,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: AT_MODIFIERS,
              attribute: MEDIA_FEATURES.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...STRINGS,
              modes.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: 'selector-tag',
        begin: '\\b(' + TAGS.join('|') + ')\\b'
      }
    ]
  };
}

module.exports = css;

},{}],6:[function(require,module,exports){
/*
Language: Django
Description: Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design.
Requires: xml.js
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Contributors: Ilya Baryshev <baryshev@gmail.com>
Website: https://www.djangoproject.com
Category: template
*/

/** @type LanguageFn */
function django(hljs) {
  const FILTER = {
    begin: /\|[A-Za-z]+:?/,
    keywords: { name:
        'truncatewords removetags linebreaksbr yesno get_digit timesince random striptags '
        + 'filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands '
        + 'title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode '
        + 'timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort '
        + 'dictsortreversed default_if_none pluralize lower join center default '
        + 'truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first '
        + 'escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize '
        + 'localtime utc timezone' },
    contains: [
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE
    ]
  };

  return {
    name: 'Django',
    aliases: [ 'jinja' ],
    case_insensitive: true,
    subLanguage: 'xml',
    contains: [
      hljs.COMMENT(/\{%\s*comment\s*%\}/, /\{%\s*endcomment\s*%\}/),
      hljs.COMMENT(/\{#/, /#\}/),
      {
        className: 'template-tag',
        begin: /\{%/,
        end: /%\}/,
        contains: [
          {
            className: 'name',
            begin: /\w+/,
            keywords: { name:
                'comment endcomment load templatetag ifchanged endifchanged if endif firstof for '
                + 'endfor ifnotequal endifnotequal widthratio extends include spaceless '
                + 'endspaceless regroup ifequal endifequal ssi now with cycle url filter '
                + 'endfilter debug block endblock else autoescape endautoescape csrf_token empty elif '
                + 'endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix '
                + 'plural get_current_language language get_available_languages '
                + 'get_current_language_bidi get_language_info get_language_info_list localize '
                + 'endlocalize localtime endlocaltime timezone endtimezone get_current_timezone '
                + 'verbatim' },
            starts: {
              endsWithParent: true,
              keywords: 'in by as',
              contains: [ FILTER ],
              relevance: 0
            }
          }
        ]
      },
      {
        className: 'template-variable',
        begin: /\{\{/,
        end: /\}\}/,
        contains: [ FILTER ]
      }
    ]
  };
}

module.exports = django;

},{}],7:[function(require,module,exports){
/*
Language: Dockerfile
Requires: bash.js
Author: Alexis Hénaut <alexis@henaut.net>
Description: language definition for Dockerfile files
Website: https://docs.docker.com/engine/reference/builder/
Category: config
*/

/** @type LanguageFn */
function dockerfile(hljs) {
  const KEYWORDS = [
    "from",
    "maintainer",
    "expose",
    "env",
    "arg",
    "user",
    "onbuild",
    "stopsignal"
  ];
  return {
    name: 'Dockerfile',
    aliases: [ 'docker' ],
    case_insensitive: true,
    keywords: KEYWORDS,
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        beginKeywords: 'run cmd entrypoint volume add copy workdir label healthcheck shell',
        starts: {
          end: /[^\\]$/,
          subLanguage: 'bash'
        }
      }
    ],
    illegal: '</'
  };
}

module.exports = dockerfile;

},{}],8:[function(require,module,exports){
/*
Language: TOML, also INI
Description: TOML aims to be a minimal configuration file format that's easy to read due to obvious semantics.
Contributors: Guillaume Gomez <guillaume1.gomez@gmail.com>
Category: common, config
Website: https://github.com/toml-lang/toml
*/

function ini(hljs) {
  const regex = hljs.regex;
  const NUMBERS = {
    className: 'number',
    relevance: 0,
    variants: [
      { begin: /([+-]+)?[\d]+_[\d_]+/ },
      { begin: hljs.NUMBER_RE }
    ]
  };
  const COMMENTS = hljs.COMMENT();
  COMMENTS.variants = [
    {
      begin: /;/,
      end: /$/
    },
    {
      begin: /#/,
      end: /$/
    }
  ];
  const VARIABLES = {
    className: 'variable',
    variants: [
      { begin: /\$[\w\d"][\w\d_]*/ },
      { begin: /\$\{(.*?)\}/ }
    ]
  };
  const LITERALS = {
    className: 'literal',
    begin: /\bon|off|true|false|yes|no\b/
  };
  const STRINGS = {
    className: "string",
    contains: [ hljs.BACKSLASH_ESCAPE ],
    variants: [
      {
        begin: "'''",
        end: "'''",
        relevance: 10
      },
      {
        begin: '"""',
        end: '"""',
        relevance: 10
      },
      {
        begin: '"',
        end: '"'
      },
      {
        begin: "'",
        end: "'"
      }
    ]
  };
  const ARRAY = {
    begin: /\[/,
    end: /\]/,
    contains: [
      COMMENTS,
      LITERALS,
      VARIABLES,
      STRINGS,
      NUMBERS,
      'self'
    ],
    relevance: 0
  };

  const BARE_KEY = /[A-Za-z0-9_-]+/;
  const QUOTED_KEY_DOUBLE_QUOTE = /"(\\"|[^"])*"/;
  const QUOTED_KEY_SINGLE_QUOTE = /'[^']*'/;
  const ANY_KEY = regex.either(
    BARE_KEY, QUOTED_KEY_DOUBLE_QUOTE, QUOTED_KEY_SINGLE_QUOTE
  );
  const DOTTED_KEY = regex.concat(
    ANY_KEY, '(\\s*\\.\\s*', ANY_KEY, ')*',
    regex.lookahead(/\s*=\s*[^#\s]/)
  );

  return {
    name: 'TOML, also INI',
    aliases: [ 'toml' ],
    case_insensitive: true,
    illegal: /\S/,
    contains: [
      COMMENTS,
      {
        className: 'section',
        begin: /\[+/,
        end: /\]+/
      },
      {
        begin: DOTTED_KEY,
        className: 'attr',
        starts: {
          end: /$/,
          contains: [
            COMMENTS,
            ARRAY,
            LITERALS,
            VARIABLES,
            STRINGS,
            NUMBERS
          ]
        }
      }
    ]
  };
}

module.exports = ini;

},{}],9:[function(require,module,exports){
const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
const KEYWORDS = [
  "as", // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
const LITERALS = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
const TYPES = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];

const ERROR_TYPES = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];

const BUILT_IN_GLOBALS = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",

  "require",
  "exports",

  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];

const BUILT_IN_VARIABLES = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "module",
  "global" // Node.js
];

const BUILT_INS = [].concat(
  BUILT_IN_GLOBALS,
  TYPES,
  ERROR_TYPES
);

/*
Language: JavaScript
Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
Category: common, scripting, web
Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
*/

/** @type LanguageFn */
function javascript(hljs) {
  const regex = hljs.regex;
  /**
   * Takes a string like "<Booger" and checks to see
   * if we can find a matching "</Booger" later in the
   * content.
   * @param {RegExpMatchArray} match
   * @param {{after:number}} param1
   */
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };

  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: '<>',
    end: '</>'
  };
  // to avoid some special cases inside isTrulyOpeningTag
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" ||
        // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ",") {
        response.ignoreMatch();
        return;
      }

      // `<something>`
      // Quite possibly a tag, lets look for a matching closing tag...
      if (nextChar === ">") {
        // if we cannot find a matching closing tag, then we
        // will ignore it
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }

      // `<blah />` (self-closing)
      // handled by simpleSelfClosing rule

      // `<From extends string>`
      // technically this could be HTML, but it smells like a type
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      // NOTE: This is ugh, but added specifically for https://github.com/highlightjs/highlight.js/issues/3276
      if ((m = afterMatch.match(/^\s+extends\s+/))) {
        if (m.index === 0) {
          response.ignoreMatch();
          // eslint-disable-next-line no-useless-return
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };

  // https://tc39.es/ecma262/#sec-literals-numeric-literals
  const decimalDigits = '[0-9](_?[0-9])*';
  const frac = `\\.(${decimalDigits})`;
  // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
  // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: 'number',
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
        `[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" },
    ],
    relevance: 0
  };

  const SUBST = {
    className: 'subst',
    begin: '\\$\\{',
    end: '\\}',
    keywords: KEYWORDS$1,
    contains: [] // defined later
  };
  const HTML_TEMPLATE = {
    begin: 'html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'xml'
    }
  };
  const CSS_TEMPLATE = {
    begin: 'css`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'css'
    }
  };
  const TEMPLATE_STRING = {
    className: 'string',
    begin: '`',
    end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    '\\*/',
    {
      relevance: 0,
      contains: [
        {
          begin: '(?=@[A-Za-z]+)',
          relevance: 0,
          contains: [
            {
              className: 'doctag',
              begin: '@[A-Za-z]+'
            },
            {
              className: 'type',
              begin: '\\{',
              end: '\\}',
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: 'variable',
              begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER,
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS
    .concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: 'params',
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };

  // ES6 classes
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      },

    ]
  };

  const CLASS_REFERENCE = {
    relevance: 0,
    match:
    regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/,
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };

  const USE_STRICT = {
    label: "use_strict",
    className: 'meta',
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };

  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [ PARAMS ],
    illegal: /%/
  };

  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };

  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }

  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS,
        "super"
      ]),
      IDENT_RE$1, regex.lookahead(/\(/)),
    className: "title.function",
    relevance: 0
  };

  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };

  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      { // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };

  const FUNC_LEAD_IN_RE = '(\\(' +
    '[^()]*(\\(' +
    '[^()]*(\\(' +
    '[^()]*' +
    '\\)[^()]*)*' +
    '\\)[^()]*)*' +
    '\\)|' + hljs.UNDERSCORE_IDENT_RE + ')\\s*=>';

  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/, /\s+/,
      IDENT_RE$1, /\s*/,
      /=\s*/,
      /(async\s*)?/, // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };

  return {
    name: 'Javascript',
    aliases: ['js', 'jsx', 'mjs', 'cjs'],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      NUMBER,
      CLASS_REFERENCE,
      {
        className: 'attr',
        begin: IDENT_RE$1 + regex.lookahead(':'),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          { // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          { // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                'on:begin': XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: 'xml',
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ['self']
              }
            ]
          }
        ],
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: '\\b(?!function)' + hljs.UNDERSCORE_IDENT_RE +
          '\\(' + // first parens
          '[^()]*(\\(' +
            '[^()]*(\\(' +
              '[^()]*' +
            '\\)[^()]*)*' +
          '\\)[^()]*)*' +
          '\\)\\s*\\{', // end parens
        returnBegin:true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: '\\$' + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [ /\bconstructor(?=\s*\()/ ],
        className: { 1: "title.function" },
        contains: [ PARAMS ]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}

module.exports = javascript;

},{}],10:[function(require,module,exports){
/*
Language: JSON
Description: JSON (JavaScript Object Notation) is a lightweight data-interchange format.
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Website: http://www.json.org
Category: common, protocols, web
*/

function json(hljs) {
  const ATTRIBUTE = {
    className: 'attr',
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS = [
    "true",
    "false",
    "null"
  ];
  // NOTE: normally we would rely on `keywords` for this but using a mode here allows us
  // - to use the very tight `illegal: \S` rule later to flag any other character
  // - as illegal indicating that despite looking like JSON we do not truly have
  // - JSON and thus improve false-positively greatly since JSON will try and claim
  // - all sorts of JSON looking stuff
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS.join(" "),
  };

  return {
    name: 'JSON',
    keywords:{
      literal: LITERALS,
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: '\\S'
  };
}

module.exports = json;

},{}],11:[function(require,module,exports){
/*
Language: LaTeX
Author: Benedikt Wilde <bwilde@posteo.de>
Website: https://www.latex-project.org
Category: markup
*/

/** @type LanguageFn */
function latex(hljs) {
  const regex = hljs.regex;
  const KNOWN_CONTROL_WORDS = regex.either(...[
    '(?:NeedsTeXFormat|RequirePackage|GetIdInfo)',
    'Provides(?:Expl)?(?:Package|Class|File)',
    '(?:DeclareOption|ProcessOptions)',
    '(?:documentclass|usepackage|input|include)',
    'makeat(?:letter|other)',
    'ExplSyntax(?:On|Off)',
    '(?:new|renew|provide)?command',
    '(?:re)newenvironment',
    '(?:New|Renew|Provide|Declare)(?:Expandable)?DocumentCommand',
    '(?:New|Renew|Provide|Declare)DocumentEnvironment',
    '(?:(?:e|g|x)?def|let)',
    '(?:begin|end)',
    '(?:part|chapter|(?:sub){0,2}section|(?:sub)?paragraph)',
    'caption',
    '(?:label|(?:eq|page|name)?ref|(?:paren|foot|super)?cite)',
    '(?:alpha|beta|[Gg]amma|[Dd]elta|(?:var)?epsilon|zeta|eta|[Tt]heta|vartheta)',
    '(?:iota|(?:var)?kappa|[Ll]ambda|mu|nu|[Xx]i|[Pp]i|varpi|(?:var)rho)',
    '(?:[Ss]igma|varsigma|tau|[Uu]psilon|[Pp]hi|varphi|chi|[Pp]si|[Oo]mega)',
    '(?:frac|sum|prod|lim|infty|times|sqrt|leq|geq|left|right|middle|[bB]igg?)',
    '(?:[lr]angle|q?quad|[lcvdi]?dots|d?dot|hat|tilde|bar)'
  ].map(word => word + '(?![a-zA-Z@:_])'));
  const L3_REGEX = new RegExp([
    // A function \module_function_name:signature or \__module_function_name:signature,
    // where both module and function_name need at least two characters and
    // function_name may contain single underscores.
    '(?:__)?[a-zA-Z]{2,}_[a-zA-Z](?:_?[a-zA-Z])+:[a-zA-Z]*',
    // A variable \scope_module_and_name_type or \scope__module_ane_name_type,
    // where scope is one of l, g or c, type needs at least two characters
    // and module_and_name may contain single underscores.
    '[lgc]__?[a-zA-Z](?:_?[a-zA-Z])*_[a-zA-Z]{2,}',
    // A quark \q_the_name or \q__the_name or
    // scan mark \s_the_name or \s__vthe_name,
    // where variable_name needs at least two characters and
    // may contain single underscores.
    '[qs]__?[a-zA-Z](?:_?[a-zA-Z])+',
    // Other LaTeX3 macro names that are not covered by the three rules above.
    'use(?:_i)?:[a-zA-Z]*',
    '(?:else|fi|or):',
    '(?:if|cs|exp):w',
    '(?:hbox|vbox):n',
    '::[a-zA-Z]_unbraced',
    '::[a-zA-Z:]'
  ].map(pattern => pattern + '(?![a-zA-Z:_])').join('|'));
  const L2_VARIANTS = [
    { begin: /[a-zA-Z@]+/ }, // control word
    { begin: /[^a-zA-Z@]?/ } // control symbol
  ];
  const DOUBLE_CARET_VARIANTS = [
    { begin: /\^{6}[0-9a-f]{6}/ },
    { begin: /\^{5}[0-9a-f]{5}/ },
    { begin: /\^{4}[0-9a-f]{4}/ },
    { begin: /\^{3}[0-9a-f]{3}/ },
    { begin: /\^{2}[0-9a-f]{2}/ },
    { begin: /\^{2}[\u0000-\u007f]/ }
  ];
  const CONTROL_SEQUENCE = {
    className: 'keyword',
    begin: /\\/,
    relevance: 0,
    contains: [
      {
        endsParent: true,
        begin: KNOWN_CONTROL_WORDS
      },
      {
        endsParent: true,
        begin: L3_REGEX
      },
      {
        endsParent: true,
        variants: DOUBLE_CARET_VARIANTS
      },
      {
        endsParent: true,
        relevance: 0,
        variants: L2_VARIANTS
      }
    ]
  };
  const MACRO_PARAM = {
    className: 'params',
    relevance: 0,
    begin: /#+\d?/
  };
  const DOUBLE_CARET_CHAR = {
    // relevance: 1
    variants: DOUBLE_CARET_VARIANTS };
  const SPECIAL_CATCODE = {
    className: 'built_in',
    relevance: 0,
    begin: /[$&^_]/
  };
  const MAGIC_COMMENT = {
    className: 'meta',
    begin: /% ?!(T[eE]X|tex|BIB|bib)/,
    end: '$',
    relevance: 10
  };
  const COMMENT = hljs.COMMENT(
    '%',
    '$',
    { relevance: 0 }
  );
  const EVERYTHING_BUT_VERBATIM = [
    CONTROL_SEQUENCE,
    MACRO_PARAM,
    DOUBLE_CARET_CHAR,
    SPECIAL_CATCODE,
    MAGIC_COMMENT,
    COMMENT
  ];
  const BRACE_GROUP_NO_VERBATIM = {
    begin: /\{/,
    end: /\}/,
    relevance: 0,
    contains: [
      'self',
      ...EVERYTHING_BUT_VERBATIM
    ]
  };
  const ARGUMENT_BRACES = hljs.inherit(
    BRACE_GROUP_NO_VERBATIM,
    {
      relevance: 0,
      endsParent: true,
      contains: [
        BRACE_GROUP_NO_VERBATIM,
        ...EVERYTHING_BUT_VERBATIM
      ]
    }
  );
  const ARGUMENT_BRACKETS = {
    begin: /\[/,
    end: /\]/,
    endsParent: true,
    relevance: 0,
    contains: [
      BRACE_GROUP_NO_VERBATIM,
      ...EVERYTHING_BUT_VERBATIM
    ]
  };
  const SPACE_GOBBLER = {
    begin: /\s+/,
    relevance: 0
  };
  const ARGUMENT_M = [ ARGUMENT_BRACES ];
  const ARGUMENT_O = [ ARGUMENT_BRACKETS ];
  const ARGUMENT_AND_THEN = function(arg, starts_mode) {
    return {
      contains: [ SPACE_GOBBLER ],
      starts: {
        relevance: 0,
        contains: arg,
        starts: starts_mode
      }
    };
  };
  const CSNAME = function(csname, starts_mode) {
    return {
      begin: '\\\\' + csname + '(?![a-zA-Z@:_])',
      keywords: {
        $pattern: /\\[a-zA-Z]+/,
        keyword: '\\' + csname
      },
      relevance: 0,
      contains: [ SPACE_GOBBLER ],
      starts: starts_mode
    };
  };
  const BEGIN_ENV = function(envname, starts_mode) {
    return hljs.inherit(
      {
        begin: '\\\\begin(?=[ \t]*(\\r?\\n[ \t]*)?\\{' + envname + '\\})',
        keywords: {
          $pattern: /\\[a-zA-Z]+/,
          keyword: '\\begin'
        },
        relevance: 0,
      },
      ARGUMENT_AND_THEN(ARGUMENT_M, starts_mode)
    );
  };
  const VERBATIM_DELIMITED_EQUAL = (innerName = "string") => {
    return hljs.END_SAME_AS_BEGIN({
      className: innerName,
      begin: /(.|\r?\n)/,
      end: /(.|\r?\n)/,
      excludeBegin: true,
      excludeEnd: true,
      endsParent: true
    });
  };
  const VERBATIM_DELIMITED_ENV = function(envname) {
    return {
      className: 'string',
      end: '(?=\\\\end\\{' + envname + '\\})'
    };
  };

  const VERBATIM_DELIMITED_BRACES = (innerName = "string") => {
    return {
      relevance: 0,
      begin: /\{/,
      starts: {
        endsParent: true,
        contains: [
          {
            className: innerName,
            end: /(?=\})/,
            endsParent: true,
            contains: [
              {
                begin: /\{/,
                end: /\}/,
                relevance: 0,
                contains: [ "self" ]
              }
            ],
          }
        ]
      }
    };
  };
  const VERBATIM = [
    ...[
      'verb',
      'lstinline'
    ].map(csname => CSNAME(csname, { contains: [ VERBATIM_DELIMITED_EQUAL() ] })),
    CSNAME('mint', ARGUMENT_AND_THEN(ARGUMENT_M, { contains: [ VERBATIM_DELIMITED_EQUAL() ] })),
    CSNAME('mintinline', ARGUMENT_AND_THEN(ARGUMENT_M, { contains: [
      VERBATIM_DELIMITED_BRACES(),
      VERBATIM_DELIMITED_EQUAL()
    ] })),
    CSNAME('url', { contains: [
      VERBATIM_DELIMITED_BRACES("link"),
      VERBATIM_DELIMITED_BRACES("link")
    ] }),
    CSNAME('hyperref', { contains: [ VERBATIM_DELIMITED_BRACES("link") ] }),
    CSNAME('href', ARGUMENT_AND_THEN(ARGUMENT_O, { contains: [ VERBATIM_DELIMITED_BRACES("link") ] })),
    ...[].concat(...[
      '',
      '\\*'
    ].map(suffix => [
      BEGIN_ENV('verbatim' + suffix, VERBATIM_DELIMITED_ENV('verbatim' + suffix)),
      BEGIN_ENV('filecontents' + suffix, ARGUMENT_AND_THEN(ARGUMENT_M, VERBATIM_DELIMITED_ENV('filecontents' + suffix))),
      ...[
        '',
        'B',
        'L'
      ].map(prefix =>
        BEGIN_ENV(prefix + 'Verbatim' + suffix, ARGUMENT_AND_THEN(ARGUMENT_O, VERBATIM_DELIMITED_ENV(prefix + 'Verbatim' + suffix)))
      )
    ])),
    BEGIN_ENV('minted', ARGUMENT_AND_THEN(ARGUMENT_O, ARGUMENT_AND_THEN(ARGUMENT_M, VERBATIM_DELIMITED_ENV('minted')))),
  ];

  return {
    name: 'LaTeX',
    aliases: [ 'tex' ],
    contains: [
      ...VERBATIM,
      ...EVERYTHING_BUT_VERBATIM
    ]
  };
}

module.exports = latex;

},{}],12:[function(require,module,exports){
/*
Language: Makefile
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Contributors: Joël Porquet <joel@porquet.org>
Website: https://www.gnu.org/software/make/manual/html_node/Introduction.html
Category: common
*/

function makefile(hljs) {
  /* Variables: simple (eg $(var)) and special (eg $@) */
  const VARIABLE = {
    className: 'variable',
    variants: [
      {
        begin: '\\$\\(' + hljs.UNDERSCORE_IDENT_RE + '\\)',
        contains: [ hljs.BACKSLASH_ESCAPE ]
      },
      { begin: /\$[@%<?\^\+\*]/ }
    ]
  };
  /* Quoted string with variables inside */
  const QUOTE_STRING = {
    className: 'string',
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VARIABLE
    ]
  };
  /* Function: $(func arg,...) */
  const FUNC = {
    className: 'variable',
    begin: /\$\([\w-]+\s/,
    end: /\)/,
    keywords: { built_in:
        'subst patsubst strip findstring filter filter-out sort '
        + 'word wordlist firstword lastword dir notdir suffix basename '
        + 'addsuffix addprefix join wildcard realpath abspath error warning '
        + 'shell origin flavor foreach if or and call eval file value' },
    contains: [ VARIABLE ]
  };
  /* Variable assignment */
  const ASSIGNMENT = { begin: '^' + hljs.UNDERSCORE_IDENT_RE + '\\s*(?=[:+?]?=)' };
  /* Meta targets (.PHONY) */
  const META = {
    className: 'meta',
    begin: /^\.PHONY:/,
    end: /$/,
    keywords: {
      $pattern: /[\.\w]+/,
      keyword: '.PHONY'
    }
  };
  /* Targets */
  const TARGET = {
    className: 'section',
    begin: /^[^\s]+:/,
    end: /$/,
    contains: [ VARIABLE ]
  };
  return {
    name: 'Makefile',
    aliases: [
      'mk',
      'mak',
      'make',
    ],
    keywords: {
      $pattern: /[\w-]+/,
      keyword: 'define endef undefine ifdef ifndef ifeq ifneq else endif '
      + 'include -include sinclude override export unexport private vpath'
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      VARIABLE,
      QUOTE_STRING,
      FUNC,
      ASSIGNMENT,
      META,
      TARGET
    ]
  };
}

module.exports = makefile;

},{}],13:[function(require,module,exports){
/*
Language: Markdown
Requires: xml.js
Author: John Crepezzi <john.crepezzi@gmail.com>
Website: https://daringfireball.net/projects/markdown/
Category: common, markup
*/

function markdown(hljs) {
  const regex = hljs.regex;
  const INLINE_HTML = {
    begin: /<\/?[A-Za-z_]/,
    end: '>',
    subLanguage: 'xml',
    relevance: 0
  };
  const HORIZONTAL_RULE = {
    begin: '^[-\\*]{3,}',
    end: '$'
  };
  const CODE = {
    className: 'code',
    variants: [
      // TODO: fix to allow these to work with sublanguage also
      { begin: '(`{3,})[^`](.|\\n)*?\\1`*[ ]*' },
      { begin: '(~{3,})[^~](.|\\n)*?\\1~*[ ]*' },
      // needed to allow markdown as a sublanguage to work
      {
        begin: '```',
        end: '```+[ ]*$'
      },
      {
        begin: '~~~',
        end: '~~~+[ ]*$'
      },
      { begin: '`.+?`' },
      {
        begin: '(?=^( {4}|\\t))',
        // use contains to gobble up multiple lines to allow the block to be whatever size
        // but only have a single open/close tag vs one per line
        contains: [
          {
            begin: '^( {4}|\\t)',
            end: '(\\n)$'
          }
        ],
        relevance: 0
      }
    ]
  };
  const LIST = {
    className: 'bullet',
    begin: '^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)',
    end: '\\s+',
    excludeEnd: true
  };
  const LINK_REFERENCE = {
    begin: /^\[[^\n]+\]:/,
    returnBegin: true,
    contains: [
      {
        className: 'symbol',
        begin: /\[/,
        end: /\]/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: 'link',
        begin: /:\s*/,
        end: /$/,
        excludeBegin: true
      }
    ]
  };
  const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
  const LINK = {
    variants: [
      // too much like nested array access in so many languages
      // to have any real relevance
      {
        begin: /\[.+?\]\[.*?\]/,
        relevance: 0
      },
      // popular internet URLs
      {
        begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
        relevance: 2
      },
      {
        begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
        relevance: 2
      },
      // relative urls
      {
        begin: /\[.+?\]\([./?&#].*?\)/,
        relevance: 1
      },
      // whatever else, lower relevance (might not be a link at all)
      {
        begin: /\[.*?\]\(.*?\)/,
        relevance: 0
      }
    ],
    returnBegin: true,
    contains: [
      {
        // empty strings for alt or link text
        match: /\[(?=\])/ },
      {
        className: 'string',
        relevance: 0,
        begin: '\\[',
        end: '\\]',
        excludeBegin: true,
        returnEnd: true
      },
      {
        className: 'link',
        relevance: 0,
        begin: '\\]\\(',
        end: '\\)',
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: 'symbol',
        relevance: 0,
        begin: '\\]\\[',
        end: '\\]',
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
  const BOLD = {
    className: 'strong',
    contains: [], // defined later
    variants: [
      {
        begin: /_{2}/,
        end: /_{2}/
      },
      {
        begin: /\*{2}/,
        end: /\*{2}/
      }
    ]
  };
  const ITALIC = {
    className: 'emphasis',
    contains: [], // defined later
    variants: [
      {
        begin: /\*(?!\*)/,
        end: /\*/
      },
      {
        begin: /_(?!_)/,
        end: /_/,
        relevance: 0
      }
    ]
  };

  // 3 level deep nesting is not allowed because it would create confusion
  // in cases like `***testing***` because where we don't know if the last
  // `***` is starting a new bold/italic or finishing the last one
  const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
  const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
  BOLD.contains.push(ITALIC_WITHOUT_BOLD);
  ITALIC.contains.push(BOLD_WITHOUT_ITALIC);

  let CONTAINABLE = [
    INLINE_HTML,
    LINK
  ];

  [
    BOLD,
    ITALIC,
    BOLD_WITHOUT_ITALIC,
    ITALIC_WITHOUT_BOLD
  ].forEach(m => {
    m.contains = m.contains.concat(CONTAINABLE);
  });

  CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);

  const HEADER = {
    className: 'section',
    variants: [
      {
        begin: '^#{1,6}',
        end: '$',
        contains: CONTAINABLE
      },
      {
        begin: '(?=^.+?\\n[=-]{2,}$)',
        contains: [
          { begin: '^[=-]*$' },
          {
            begin: '^',
            end: "\\n",
            contains: CONTAINABLE
          }
        ]
      }
    ]
  };

  const BLOCKQUOTE = {
    className: 'quote',
    begin: '^>\\s+',
    contains: CONTAINABLE,
    end: '$'
  };

  return {
    name: 'Markdown',
    aliases: [
      'md',
      'mkdown',
      'mkd'
    ],
    contains: [
      HEADER,
      INLINE_HTML,
      LIST,
      BOLD,
      ITALIC,
      BLOCKQUOTE,
      CODE,
      HORIZONTAL_RULE,
      LINK,
      LINK_REFERENCE
    ]
  };
}

module.exports = markdown;

},{}],14:[function(require,module,exports){
const SYSTEM_SYMBOLS = [
  "AASTriangle",
  "AbelianGroup",
  "Abort",
  "AbortKernels",
  "AbortProtect",
  "AbortScheduledTask",
  "Above",
  "Abs",
  "AbsArg",
  "AbsArgPlot",
  "Absolute",
  "AbsoluteCorrelation",
  "AbsoluteCorrelationFunction",
  "AbsoluteCurrentValue",
  "AbsoluteDashing",
  "AbsoluteFileName",
  "AbsoluteOptions",
  "AbsolutePointSize",
  "AbsoluteThickness",
  "AbsoluteTime",
  "AbsoluteTiming",
  "AcceptanceThreshold",
  "AccountingForm",
  "Accumulate",
  "Accuracy",
  "AccuracyGoal",
  "ActionDelay",
  "ActionMenu",
  "ActionMenuBox",
  "ActionMenuBoxOptions",
  "Activate",
  "Active",
  "ActiveClassification",
  "ActiveClassificationObject",
  "ActiveItem",
  "ActivePrediction",
  "ActivePredictionObject",
  "ActiveStyle",
  "AcyclicGraphQ",
  "AddOnHelpPath",
  "AddSides",
  "AddTo",
  "AddToSearchIndex",
  "AddUsers",
  "AdjacencyGraph",
  "AdjacencyList",
  "AdjacencyMatrix",
  "AdjacentMeshCells",
  "AdjustmentBox",
  "AdjustmentBoxOptions",
  "AdjustTimeSeriesForecast",
  "AdministrativeDivisionData",
  "AffineHalfSpace",
  "AffineSpace",
  "AffineStateSpaceModel",
  "AffineTransform",
  "After",
  "AggregatedEntityClass",
  "AggregationLayer",
  "AircraftData",
  "AirportData",
  "AirPressureData",
  "AirTemperatureData",
  "AiryAi",
  "AiryAiPrime",
  "AiryAiZero",
  "AiryBi",
  "AiryBiPrime",
  "AiryBiZero",
  "AlgebraicIntegerQ",
  "AlgebraicNumber",
  "AlgebraicNumberDenominator",
  "AlgebraicNumberNorm",
  "AlgebraicNumberPolynomial",
  "AlgebraicNumberTrace",
  "AlgebraicRules",
  "AlgebraicRulesData",
  "Algebraics",
  "AlgebraicUnitQ",
  "Alignment",
  "AlignmentMarker",
  "AlignmentPoint",
  "All",
  "AllowAdultContent",
  "AllowedCloudExtraParameters",
  "AllowedCloudParameterExtensions",
  "AllowedDimensions",
  "AllowedFrequencyRange",
  "AllowedHeads",
  "AllowGroupClose",
  "AllowIncomplete",
  "AllowInlineCells",
  "AllowKernelInitialization",
  "AllowLooseGrammar",
  "AllowReverseGroupClose",
  "AllowScriptLevelChange",
  "AllowVersionUpdate",
  "AllTrue",
  "Alphabet",
  "AlphabeticOrder",
  "AlphabeticSort",
  "AlphaChannel",
  "AlternateImage",
  "AlternatingFactorial",
  "AlternatingGroup",
  "AlternativeHypothesis",
  "Alternatives",
  "AltitudeMethod",
  "AmbientLight",
  "AmbiguityFunction",
  "AmbiguityList",
  "Analytic",
  "AnatomyData",
  "AnatomyForm",
  "AnatomyPlot3D",
  "AnatomySkinStyle",
  "AnatomyStyling",
  "AnchoredSearch",
  "And",
  "AndersonDarlingTest",
  "AngerJ",
  "AngleBisector",
  "AngleBracket",
  "AnglePath",
  "AnglePath3D",
  "AngleVector",
  "AngularGauge",
  "Animate",
  "AnimationCycleOffset",
  "AnimationCycleRepetitions",
  "AnimationDirection",
  "AnimationDisplayTime",
  "AnimationRate",
  "AnimationRepetitions",
  "AnimationRunning",
  "AnimationRunTime",
  "AnimationTimeIndex",
  "Animator",
  "AnimatorBox",
  "AnimatorBoxOptions",
  "AnimatorElements",
  "Annotate",
  "Annotation",
  "AnnotationDelete",
  "AnnotationKeys",
  "AnnotationRules",
  "AnnotationValue",
  "Annuity",
  "AnnuityDue",
  "Annulus",
  "AnomalyDetection",
  "AnomalyDetector",
  "AnomalyDetectorFunction",
  "Anonymous",
  "Antialiasing",
  "AntihermitianMatrixQ",
  "Antisymmetric",
  "AntisymmetricMatrixQ",
  "Antonyms",
  "AnyOrder",
  "AnySubset",
  "AnyTrue",
  "Apart",
  "ApartSquareFree",
  "APIFunction",
  "Appearance",
  "AppearanceElements",
  "AppearanceRules",
  "AppellF1",
  "Append",
  "AppendCheck",
  "AppendLayer",
  "AppendTo",
  "Apply",
  "ApplySides",
  "ArcCos",
  "ArcCosh",
  "ArcCot",
  "ArcCoth",
  "ArcCsc",
  "ArcCsch",
  "ArcCurvature",
  "ARCHProcess",
  "ArcLength",
  "ArcSec",
  "ArcSech",
  "ArcSin",
  "ArcSinDistribution",
  "ArcSinh",
  "ArcTan",
  "ArcTanh",
  "Area",
  "Arg",
  "ArgMax",
  "ArgMin",
  "ArgumentCountQ",
  "ARIMAProcess",
  "ArithmeticGeometricMean",
  "ARMAProcess",
  "Around",
  "AroundReplace",
  "ARProcess",
  "Array",
  "ArrayComponents",
  "ArrayDepth",
  "ArrayFilter",
  "ArrayFlatten",
  "ArrayMesh",
  "ArrayPad",
  "ArrayPlot",
  "ArrayQ",
  "ArrayResample",
  "ArrayReshape",
  "ArrayRules",
  "Arrays",
  "Arrow",
  "Arrow3DBox",
  "ArrowBox",
  "Arrowheads",
  "ASATriangle",
  "Ask",
  "AskAppend",
  "AskConfirm",
  "AskDisplay",
  "AskedQ",
  "AskedValue",
  "AskFunction",
  "AskState",
  "AskTemplateDisplay",
  "AspectRatio",
  "AspectRatioFixed",
  "Assert",
  "AssociateTo",
  "Association",
  "AssociationFormat",
  "AssociationMap",
  "AssociationQ",
  "AssociationThread",
  "AssumeDeterministic",
  "Assuming",
  "Assumptions",
  "AstronomicalData",
  "Asymptotic",
  "AsymptoticDSolveValue",
  "AsymptoticEqual",
  "AsymptoticEquivalent",
  "AsymptoticGreater",
  "AsymptoticGreaterEqual",
  "AsymptoticIntegrate",
  "AsymptoticLess",
  "AsymptoticLessEqual",
  "AsymptoticOutputTracker",
  "AsymptoticProduct",
  "AsymptoticRSolveValue",
  "AsymptoticSolve",
  "AsymptoticSum",
  "Asynchronous",
  "AsynchronousTaskObject",
  "AsynchronousTasks",
  "Atom",
  "AtomCoordinates",
  "AtomCount",
  "AtomDiagramCoordinates",
  "AtomList",
  "AtomQ",
  "AttentionLayer",
  "Attributes",
  "Audio",
  "AudioAmplify",
  "AudioAnnotate",
  "AudioAnnotationLookup",
  "AudioBlockMap",
  "AudioCapture",
  "AudioChannelAssignment",
  "AudioChannelCombine",
  "AudioChannelMix",
  "AudioChannels",
  "AudioChannelSeparate",
  "AudioData",
  "AudioDelay",
  "AudioDelete",
  "AudioDevice",
  "AudioDistance",
  "AudioEncoding",
  "AudioFade",
  "AudioFrequencyShift",
  "AudioGenerator",
  "AudioIdentify",
  "AudioInputDevice",
  "AudioInsert",
  "AudioInstanceQ",
  "AudioIntervals",
  "AudioJoin",
  "AudioLabel",
  "AudioLength",
  "AudioLocalMeasurements",
  "AudioLooping",
  "AudioLoudness",
  "AudioMeasurements",
  "AudioNormalize",
  "AudioOutputDevice",
  "AudioOverlay",
  "AudioPad",
  "AudioPan",
  "AudioPartition",
  "AudioPause",
  "AudioPitchShift",
  "AudioPlay",
  "AudioPlot",
  "AudioQ",
  "AudioRecord",
  "AudioReplace",
  "AudioResample",
  "AudioReverb",
  "AudioReverse",
  "AudioSampleRate",
  "AudioSpectralMap",
  "AudioSpectralTransformation",
  "AudioSplit",
  "AudioStop",
  "AudioStream",
  "AudioStreams",
  "AudioTimeStretch",
  "AudioTracks",
  "AudioTrim",
  "AudioType",
  "AugmentedPolyhedron",
  "AugmentedSymmetricPolynomial",
  "Authenticate",
  "Authentication",
  "AuthenticationDialog",
  "AutoAction",
  "Autocomplete",
  "AutocompletionFunction",
  "AutoCopy",
  "AutocorrelationTest",
  "AutoDelete",
  "AutoEvaluateEvents",
  "AutoGeneratedPackage",
  "AutoIndent",
  "AutoIndentSpacings",
  "AutoItalicWords",
  "AutoloadPath",
  "AutoMatch",
  "Automatic",
  "AutomaticImageSize",
  "AutoMultiplicationSymbol",
  "AutoNumberFormatting",
  "AutoOpenNotebooks",
  "AutoOpenPalettes",
  "AutoQuoteCharacters",
  "AutoRefreshed",
  "AutoRemove",
  "AutorunSequencing",
  "AutoScaling",
  "AutoScroll",
  "AutoSpacing",
  "AutoStyleOptions",
  "AutoStyleWords",
  "AutoSubmitting",
  "Axes",
  "AxesEdge",
  "AxesLabel",
  "AxesOrigin",
  "AxesStyle",
  "AxiomaticTheory",
  "Axis",
  "BabyMonsterGroupB",
  "Back",
  "Background",
  "BackgroundAppearance",
  "BackgroundTasksSettings",
  "Backslash",
  "Backsubstitution",
  "Backward",
  "Ball",
  "Band",
  "BandpassFilter",
  "BandstopFilter",
  "BarabasiAlbertGraphDistribution",
  "BarChart",
  "BarChart3D",
  "BarcodeImage",
  "BarcodeRecognize",
  "BaringhausHenzeTest",
  "BarLegend",
  "BarlowProschanImportance",
  "BarnesG",
  "BarOrigin",
  "BarSpacing",
  "BartlettHannWindow",
  "BartlettWindow",
  "BaseDecode",
  "BaseEncode",
  "BaseForm",
  "Baseline",
  "BaselinePosition",
  "BaseStyle",
  "BasicRecurrentLayer",
  "BatchNormalizationLayer",
  "BatchSize",
  "BatesDistribution",
  "BattleLemarieWavelet",
  "BayesianMaximization",
  "BayesianMaximizationObject",
  "BayesianMinimization",
  "BayesianMinimizationObject",
  "Because",
  "BeckmannDistribution",
  "Beep",
  "Before",
  "Begin",
  "BeginDialogPacket",
  "BeginFrontEndInteractionPacket",
  "BeginPackage",
  "BellB",
  "BellY",
  "Below",
  "BenfordDistribution",
  "BeniniDistribution",
  "BenktanderGibratDistribution",
  "BenktanderWeibullDistribution",
  "BernoulliB",
  "BernoulliDistribution",
  "BernoulliGraphDistribution",
  "BernoulliProcess",
  "BernsteinBasis",
  "BesselFilterModel",
  "BesselI",
  "BesselJ",
  "BesselJZero",
  "BesselK",
  "BesselY",
  "BesselYZero",
  "Beta",
  "BetaBinomialDistribution",
  "BetaDistribution",
  "BetaNegativeBinomialDistribution",
  "BetaPrimeDistribution",
  "BetaRegularized",
  "Between",
  "BetweennessCentrality",
  "BeveledPolyhedron",
  "BezierCurve",
  "BezierCurve3DBox",
  "BezierCurve3DBoxOptions",
  "BezierCurveBox",
  "BezierCurveBoxOptions",
  "BezierFunction",
  "BilateralFilter",
  "Binarize",
  "BinaryDeserialize",
  "BinaryDistance",
  "BinaryFormat",
  "BinaryImageQ",
  "BinaryRead",
  "BinaryReadList",
  "BinarySerialize",
  "BinaryWrite",
  "BinCounts",
  "BinLists",
  "Binomial",
  "BinomialDistribution",
  "BinomialProcess",
  "BinormalDistribution",
  "BiorthogonalSplineWavelet",
  "BipartiteGraphQ",
  "BiquadraticFilterModel",
  "BirnbaumImportance",
  "BirnbaumSaundersDistribution",
  "BitAnd",
  "BitClear",
  "BitGet",
  "BitLength",
  "BitNot",
  "BitOr",
  "BitSet",
  "BitShiftLeft",
  "BitShiftRight",
  "BitXor",
  "BiweightLocation",
  "BiweightMidvariance",
  "Black",
  "BlackmanHarrisWindow",
  "BlackmanNuttallWindow",
  "BlackmanWindow",
  "Blank",
  "BlankForm",
  "BlankNullSequence",
  "BlankSequence",
  "Blend",
  "Block",
  "BlockchainAddressData",
  "BlockchainBase",
  "BlockchainBlockData",
  "BlockchainContractValue",
  "BlockchainData",
  "BlockchainGet",
  "BlockchainKeyEncode",
  "BlockchainPut",
  "BlockchainTokenData",
  "BlockchainTransaction",
  "BlockchainTransactionData",
  "BlockchainTransactionSign",
  "BlockchainTransactionSubmit",
  "BlockMap",
  "BlockRandom",
  "BlomqvistBeta",
  "BlomqvistBetaTest",
  "Blue",
  "Blur",
  "BodePlot",
  "BohmanWindow",
  "Bold",
  "Bond",
  "BondCount",
  "BondList",
  "BondQ",
  "Bookmarks",
  "Boole",
  "BooleanConsecutiveFunction",
  "BooleanConvert",
  "BooleanCountingFunction",
  "BooleanFunction",
  "BooleanGraph",
  "BooleanMaxterms",
  "BooleanMinimize",
  "BooleanMinterms",
  "BooleanQ",
  "BooleanRegion",
  "Booleans",
  "BooleanStrings",
  "BooleanTable",
  "BooleanVariables",
  "BorderDimensions",
  "BorelTannerDistribution",
  "Bottom",
  "BottomHatTransform",
  "BoundaryDiscretizeGraphics",
  "BoundaryDiscretizeRegion",
  "BoundaryMesh",
  "BoundaryMeshRegion",
  "BoundaryMeshRegionQ",
  "BoundaryStyle",
  "BoundedRegionQ",
  "BoundingRegion",
  "Bounds",
  "Box",
  "BoxBaselineShift",
  "BoxData",
  "BoxDimensions",
  "Boxed",
  "Boxes",
  "BoxForm",
  "BoxFormFormatTypes",
  "BoxFrame",
  "BoxID",
  "BoxMargins",
  "BoxMatrix",
  "BoxObject",
  "BoxRatios",
  "BoxRotation",
  "BoxRotationPoint",
  "BoxStyle",
  "BoxWhiskerChart",
  "Bra",
  "BracketingBar",
  "BraKet",
  "BrayCurtisDistance",
  "BreadthFirstScan",
  "Break",
  "BridgeData",
  "BrightnessEqualize",
  "BroadcastStationData",
  "Brown",
  "BrownForsytheTest",
  "BrownianBridgeProcess",
  "BrowserCategory",
  "BSplineBasis",
  "BSplineCurve",
  "BSplineCurve3DBox",
  "BSplineCurve3DBoxOptions",
  "BSplineCurveBox",
  "BSplineCurveBoxOptions",
  "BSplineFunction",
  "BSplineSurface",
  "BSplineSurface3DBox",
  "BSplineSurface3DBoxOptions",
  "BubbleChart",
  "BubbleChart3D",
  "BubbleScale",
  "BubbleSizes",
  "BuildingData",
  "BulletGauge",
  "BusinessDayQ",
  "ButterflyGraph",
  "ButterworthFilterModel",
  "Button",
  "ButtonBar",
  "ButtonBox",
  "ButtonBoxOptions",
  "ButtonCell",
  "ButtonContents",
  "ButtonData",
  "ButtonEvaluator",
  "ButtonExpandable",
  "ButtonFrame",
  "ButtonFunction",
  "ButtonMargins",
  "ButtonMinHeight",
  "ButtonNote",
  "ButtonNotebook",
  "ButtonSource",
  "ButtonStyle",
  "ButtonStyleMenuListing",
  "Byte",
  "ByteArray",
  "ByteArrayFormat",
  "ByteArrayQ",
  "ByteArrayToString",
  "ByteCount",
  "ByteOrdering",
  "C",
  "CachedValue",
  "CacheGraphics",
  "CachePersistence",
  "CalendarConvert",
  "CalendarData",
  "CalendarType",
  "Callout",
  "CalloutMarker",
  "CalloutStyle",
  "CallPacket",
  "CanberraDistance",
  "Cancel",
  "CancelButton",
  "CandlestickChart",
  "CanonicalGraph",
  "CanonicalizePolygon",
  "CanonicalizePolyhedron",
  "CanonicalName",
  "CanonicalWarpingCorrespondence",
  "CanonicalWarpingDistance",
  "CantorMesh",
  "CantorStaircase",
  "Cap",
  "CapForm",
  "CapitalDifferentialD",
  "Capitalize",
  "CapsuleShape",
  "CaptureRunning",
  "CardinalBSplineBasis",
  "CarlemanLinearize",
  "CarmichaelLambda",
  "CaseOrdering",
  "Cases",
  "CaseSensitive",
  "Cashflow",
  "Casoratian",
  "Catalan",
  "CatalanNumber",
  "Catch",
  "CategoricalDistribution",
  "Catenate",
  "CatenateLayer",
  "CauchyDistribution",
  "CauchyWindow",
  "CayleyGraph",
  "CDF",
  "CDFDeploy",
  "CDFInformation",
  "CDFWavelet",
  "Ceiling",
  "CelestialSystem",
  "Cell",
  "CellAutoOverwrite",
  "CellBaseline",
  "CellBoundingBox",
  "CellBracketOptions",
  "CellChangeTimes",
  "CellContents",
  "CellContext",
  "CellDingbat",
  "CellDynamicExpression",
  "CellEditDuplicate",
  "CellElementsBoundingBox",
  "CellElementSpacings",
  "CellEpilog",
  "CellEvaluationDuplicate",
  "CellEvaluationFunction",
  "CellEvaluationLanguage",
  "CellEventActions",
  "CellFrame",
  "CellFrameColor",
  "CellFrameLabelMargins",
  "CellFrameLabels",
  "CellFrameMargins",
  "CellGroup",
  "CellGroupData",
  "CellGrouping",
  "CellGroupingRules",
  "CellHorizontalScrolling",
  "CellID",
  "CellLabel",
  "CellLabelAutoDelete",
  "CellLabelMargins",
  "CellLabelPositioning",
  "CellLabelStyle",
  "CellLabelTemplate",
  "CellMargins",
  "CellObject",
  "CellOpen",
  "CellPrint",
  "CellProlog",
  "Cells",
  "CellSize",
  "CellStyle",
  "CellTags",
  "CellularAutomaton",
  "CensoredDistribution",
  "Censoring",
  "Center",
  "CenterArray",
  "CenterDot",
  "CentralFeature",
  "CentralMoment",
  "CentralMomentGeneratingFunction",
  "Cepstrogram",
  "CepstrogramArray",
  "CepstrumArray",
  "CForm",
  "ChampernowneNumber",
  "ChangeOptions",
  "ChannelBase",
  "ChannelBrokerAction",
  "ChannelDatabin",
  "ChannelHistoryLength",
  "ChannelListen",
  "ChannelListener",
  "ChannelListeners",
  "ChannelListenerWait",
  "ChannelObject",
  "ChannelPreSendFunction",
  "ChannelReceiverFunction",
  "ChannelSend",
  "ChannelSubscribers",
  "ChanVeseBinarize",
  "Character",
  "CharacterCounts",
  "CharacterEncoding",
  "CharacterEncodingsPath",
  "CharacteristicFunction",
  "CharacteristicPolynomial",
  "CharacterName",
  "CharacterNormalize",
  "CharacterRange",
  "Characters",
  "ChartBaseStyle",
  "ChartElementData",
  "ChartElementDataFunction",
  "ChartElementFunction",
  "ChartElements",
  "ChartLabels",
  "ChartLayout",
  "ChartLegends",
  "ChartStyle",
  "Chebyshev1FilterModel",
  "Chebyshev2FilterModel",
  "ChebyshevDistance",
  "ChebyshevT",
  "ChebyshevU",
  "Check",
  "CheckAbort",
  "CheckAll",
  "Checkbox",
  "CheckboxBar",
  "CheckboxBox",
  "CheckboxBoxOptions",
  "ChemicalData",
  "ChessboardDistance",
  "ChiDistribution",
  "ChineseRemainder",
  "ChiSquareDistribution",
  "ChoiceButtons",
  "ChoiceDialog",
  "CholeskyDecomposition",
  "Chop",
  "ChromaticityPlot",
  "ChromaticityPlot3D",
  "ChromaticPolynomial",
  "Circle",
  "CircleBox",
  "CircleDot",
  "CircleMinus",
  "CirclePlus",
  "CirclePoints",
  "CircleThrough",
  "CircleTimes",
  "CirculantGraph",
  "CircularOrthogonalMatrixDistribution",
  "CircularQuaternionMatrixDistribution",
  "CircularRealMatrixDistribution",
  "CircularSymplecticMatrixDistribution",
  "CircularUnitaryMatrixDistribution",
  "Circumsphere",
  "CityData",
  "ClassifierFunction",
  "ClassifierInformation",
  "ClassifierMeasurements",
  "ClassifierMeasurementsObject",
  "Classify",
  "ClassPriors",
  "Clear",
  "ClearAll",
  "ClearAttributes",
  "ClearCookies",
  "ClearPermissions",
  "ClearSystemCache",
  "ClebschGordan",
  "ClickPane",
  "Clip",
  "ClipboardNotebook",
  "ClipFill",
  "ClippingStyle",
  "ClipPlanes",
  "ClipPlanesStyle",
  "ClipRange",
  "Clock",
  "ClockGauge",
  "ClockwiseContourIntegral",
  "Close",
  "Closed",
  "CloseKernels",
  "ClosenessCentrality",
  "Closing",
  "ClosingAutoSave",
  "ClosingEvent",
  "ClosingSaveDialog",
  "CloudAccountData",
  "CloudBase",
  "CloudConnect",
  "CloudConnections",
  "CloudDeploy",
  "CloudDirectory",
  "CloudDisconnect",
  "CloudEvaluate",
  "CloudExport",
  "CloudExpression",
  "CloudExpressions",
  "CloudFunction",
  "CloudGet",
  "CloudImport",
  "CloudLoggingData",
  "CloudObject",
  "CloudObjectInformation",
  "CloudObjectInformationData",
  "CloudObjectNameFormat",
  "CloudObjects",
  "CloudObjectURLType",
  "CloudPublish",
  "CloudPut",
  "CloudRenderingMethod",
  "CloudSave",
  "CloudShare",
  "CloudSubmit",
  "CloudSymbol",
  "CloudUnshare",
  "CloudUserID",
  "ClusterClassify",
  "ClusterDissimilarityFunction",
  "ClusteringComponents",
  "ClusteringTree",
  "CMYKColor",
  "Coarse",
  "CodeAssistOptions",
  "Coefficient",
  "CoefficientArrays",
  "CoefficientDomain",
  "CoefficientList",
  "CoefficientRules",
  "CoifletWavelet",
  "Collect",
  "Colon",
  "ColonForm",
  "ColorBalance",
  "ColorCombine",
  "ColorConvert",
  "ColorCoverage",
  "ColorData",
  "ColorDataFunction",
  "ColorDetect",
  "ColorDistance",
  "ColorFunction",
  "ColorFunctionScaling",
  "Colorize",
  "ColorNegate",
  "ColorOutput",
  "ColorProfileData",
  "ColorQ",
  "ColorQuantize",
  "ColorReplace",
  "ColorRules",
  "ColorSelectorSettings",
  "ColorSeparate",
  "ColorSetter",
  "ColorSetterBox",
  "ColorSetterBoxOptions",
  "ColorSlider",
  "ColorsNear",
  "ColorSpace",
  "ColorToneMapping",
  "Column",
  "ColumnAlignments",
  "ColumnBackgrounds",
  "ColumnForm",
  "ColumnLines",
  "ColumnsEqual",
  "ColumnSpacings",
  "ColumnWidths",
  "CombinedEntityClass",
  "CombinerFunction",
  "CometData",
  "CommonDefaultFormatTypes",
  "Commonest",
  "CommonestFilter",
  "CommonName",
  "CommonUnits",
  "CommunityBoundaryStyle",
  "CommunityGraphPlot",
  "CommunityLabels",
  "CommunityRegionStyle",
  "CompanyData",
  "CompatibleUnitQ",
  "CompilationOptions",
  "CompilationTarget",
  "Compile",
  "Compiled",
  "CompiledCodeFunction",
  "CompiledFunction",
  "CompilerOptions",
  "Complement",
  "ComplementedEntityClass",
  "CompleteGraph",
  "CompleteGraphQ",
  "CompleteKaryTree",
  "CompletionsListPacket",
  "Complex",
  "ComplexContourPlot",
  "Complexes",
  "ComplexExpand",
  "ComplexInfinity",
  "ComplexityFunction",
  "ComplexListPlot",
  "ComplexPlot",
  "ComplexPlot3D",
  "ComplexRegionPlot",
  "ComplexStreamPlot",
  "ComplexVectorPlot",
  "ComponentMeasurements",
  "ComponentwiseContextMenu",
  "Compose",
  "ComposeList",
  "ComposeSeries",
  "CompositeQ",
  "Composition",
  "CompoundElement",
  "CompoundExpression",
  "CompoundPoissonDistribution",
  "CompoundPoissonProcess",
  "CompoundRenewalProcess",
  "Compress",
  "CompressedData",
  "CompressionLevel",
  "ComputeUncertainty",
  "Condition",
  "ConditionalExpression",
  "Conditioned",
  "Cone",
  "ConeBox",
  "ConfidenceLevel",
  "ConfidenceRange",
  "ConfidenceTransform",
  "ConfigurationPath",
  "ConformAudio",
  "ConformImages",
  "Congruent",
  "ConicHullRegion",
  "ConicHullRegion3DBox",
  "ConicHullRegionBox",
  "ConicOptimization",
  "Conjugate",
  "ConjugateTranspose",
  "Conjunction",
  "Connect",
  "ConnectedComponents",
  "ConnectedGraphComponents",
  "ConnectedGraphQ",
  "ConnectedMeshComponents",
  "ConnectedMoleculeComponents",
  "ConnectedMoleculeQ",
  "ConnectionSettings",
  "ConnectLibraryCallbackFunction",
  "ConnectSystemModelComponents",
  "ConnesWindow",
  "ConoverTest",
  "ConsoleMessage",
  "ConsoleMessagePacket",
  "Constant",
  "ConstantArray",
  "ConstantArrayLayer",
  "ConstantImage",
  "ConstantPlusLayer",
  "ConstantRegionQ",
  "Constants",
  "ConstantTimesLayer",
  "ConstellationData",
  "ConstrainedMax",
  "ConstrainedMin",
  "Construct",
  "Containing",
  "ContainsAll",
  "ContainsAny",
  "ContainsExactly",
  "ContainsNone",
  "ContainsOnly",
  "ContentFieldOptions",
  "ContentLocationFunction",
  "ContentObject",
  "ContentPadding",
  "ContentsBoundingBox",
  "ContentSelectable",
  "ContentSize",
  "Context",
  "ContextMenu",
  "Contexts",
  "ContextToFileName",
  "Continuation",
  "Continue",
  "ContinuedFraction",
  "ContinuedFractionK",
  "ContinuousAction",
  "ContinuousMarkovProcess",
  "ContinuousTask",
  "ContinuousTimeModelQ",
  "ContinuousWaveletData",
  "ContinuousWaveletTransform",
  "ContourDetect",
  "ContourGraphics",
  "ContourIntegral",
  "ContourLabels",
  "ContourLines",
  "ContourPlot",
  "ContourPlot3D",
  "Contours",
  "ContourShading",
  "ContourSmoothing",
  "ContourStyle",
  "ContraharmonicMean",
  "ContrastiveLossLayer",
  "Control",
  "ControlActive",
  "ControlAlignment",
  "ControlGroupContentsBox",
  "ControllabilityGramian",
  "ControllabilityMatrix",
  "ControllableDecomposition",
  "ControllableModelQ",
  "ControllerDuration",
  "ControllerInformation",
  "ControllerInformationData",
  "ControllerLinking",
  "ControllerManipulate",
  "ControllerMethod",
  "ControllerPath",
  "ControllerState",
  "ControlPlacement",
  "ControlsRendering",
  "ControlType",
  "Convergents",
  "ConversionOptions",
  "ConversionRules",
  "ConvertToBitmapPacket",
  "ConvertToPostScript",
  "ConvertToPostScriptPacket",
  "ConvexHullMesh",
  "ConvexPolygonQ",
  "ConvexPolyhedronQ",
  "ConvolutionLayer",
  "Convolve",
  "ConwayGroupCo1",
  "ConwayGroupCo2",
  "ConwayGroupCo3",
  "CookieFunction",
  "Cookies",
  "CoordinateBoundingBox",
  "CoordinateBoundingBoxArray",
  "CoordinateBounds",
  "CoordinateBoundsArray",
  "CoordinateChartData",
  "CoordinatesToolOptions",
  "CoordinateTransform",
  "CoordinateTransformData",
  "CoprimeQ",
  "Coproduct",
  "CopulaDistribution",
  "Copyable",
  "CopyDatabin",
  "CopyDirectory",
  "CopyFile",
  "CopyTag",
  "CopyToClipboard",
  "CornerFilter",
  "CornerNeighbors",
  "Correlation",
  "CorrelationDistance",
  "CorrelationFunction",
  "CorrelationTest",
  "Cos",
  "Cosh",
  "CoshIntegral",
  "CosineDistance",
  "CosineWindow",
  "CosIntegral",
  "Cot",
  "Coth",
  "Count",
  "CountDistinct",
  "CountDistinctBy",
  "CounterAssignments",
  "CounterBox",
  "CounterBoxOptions",
  "CounterClockwiseContourIntegral",
  "CounterEvaluator",
  "CounterFunction",
  "CounterIncrements",
  "CounterStyle",
  "CounterStyleMenuListing",
  "CountRoots",
  "CountryData",
  "Counts",
  "CountsBy",
  "Covariance",
  "CovarianceEstimatorFunction",
  "CovarianceFunction",
  "CoxianDistribution",
  "CoxIngersollRossProcess",
  "CoxModel",
  "CoxModelFit",
  "CramerVonMisesTest",
  "CreateArchive",
  "CreateCellID",
  "CreateChannel",
  "CreateCloudExpression",
  "CreateDatabin",
  "CreateDataStructure",
  "CreateDataSystemModel",
  "CreateDialog",
  "CreateDirectory",
  "CreateDocument",
  "CreateFile",
  "CreateIntermediateDirectories",
  "CreateManagedLibraryExpression",
  "CreateNotebook",
  "CreatePacletArchive",
  "CreatePalette",
  "CreatePalettePacket",
  "CreatePermissionsGroup",
  "CreateScheduledTask",
  "CreateSearchIndex",
  "CreateSystemModel",
  "CreateTemporary",
  "CreateUUID",
  "CreateWindow",
  "CriterionFunction",
  "CriticalityFailureImportance",
  "CriticalitySuccessImportance",
  "CriticalSection",
  "Cross",
  "CrossEntropyLossLayer",
  "CrossingCount",
  "CrossingDetect",
  "CrossingPolygon",
  "CrossMatrix",
  "Csc",
  "Csch",
  "CTCLossLayer",
  "Cube",
  "CubeRoot",
  "Cubics",
  "Cuboid",
  "CuboidBox",
  "Cumulant",
  "CumulantGeneratingFunction",
  "Cup",
  "CupCap",
  "Curl",
  "CurlyDoubleQuote",
  "CurlyQuote",
  "CurrencyConvert",
  "CurrentDate",
  "CurrentImage",
  "CurrentlySpeakingPacket",
  "CurrentNotebookImage",
  "CurrentScreenImage",
  "CurrentValue",
  "Curry",
  "CurryApplied",
  "CurvatureFlowFilter",
  "CurveClosed",
  "Cyan",
  "CycleGraph",
  "CycleIndexPolynomial",
  "Cycles",
  "CyclicGroup",
  "Cyclotomic",
  "Cylinder",
  "CylinderBox",
  "CylindricalDecomposition",
  "D",
  "DagumDistribution",
  "DamData",
  "DamerauLevenshteinDistance",
  "DampingFactor",
  "Darker",
  "Dashed",
  "Dashing",
  "DatabaseConnect",
  "DatabaseDisconnect",
  "DatabaseReference",
  "Databin",
  "DatabinAdd",
  "DatabinRemove",
  "Databins",
  "DatabinUpload",
  "DataCompression",
  "DataDistribution",
  "DataRange",
  "DataReversed",
  "Dataset",
  "DatasetDisplayPanel",
  "DataStructure",
  "DataStructureQ",
  "Date",
  "DateBounds",
  "Dated",
  "DateDelimiters",
  "DateDifference",
  "DatedUnit",
  "DateFormat",
  "DateFunction",
  "DateHistogram",
  "DateInterval",
  "DateList",
  "DateListLogPlot",
  "DateListPlot",
  "DateListStepPlot",
  "DateObject",
  "DateObjectQ",
  "DateOverlapsQ",
  "DatePattern",
  "DatePlus",
  "DateRange",
  "DateReduction",
  "DateString",
  "DateTicksFormat",
  "DateValue",
  "DateWithinQ",
  "DaubechiesWavelet",
  "DavisDistribution",
  "DawsonF",
  "DayCount",
  "DayCountConvention",
  "DayHemisphere",
  "DaylightQ",
  "DayMatchQ",
  "DayName",
  "DayNightTerminator",
  "DayPlus",
  "DayRange",
  "DayRound",
  "DeBruijnGraph",
  "DeBruijnSequence",
  "Debug",
  "DebugTag",
  "Decapitalize",
  "Decimal",
  "DecimalForm",
  "DeclareKnownSymbols",
  "DeclarePackage",
  "Decompose",
  "DeconvolutionLayer",
  "Decrement",
  "Decrypt",
  "DecryptFile",
  "DedekindEta",
  "DeepSpaceProbeData",
  "Default",
  "DefaultAxesStyle",
  "DefaultBaseStyle",
  "DefaultBoxStyle",
  "DefaultButton",
  "DefaultColor",
  "DefaultControlPlacement",
  "DefaultDuplicateCellStyle",
  "DefaultDuration",
  "DefaultElement",
  "DefaultFaceGridsStyle",
  "DefaultFieldHintStyle",
  "DefaultFont",
  "DefaultFontProperties",
  "DefaultFormatType",
  "DefaultFormatTypeForStyle",
  "DefaultFrameStyle",
  "DefaultFrameTicksStyle",
  "DefaultGridLinesStyle",
  "DefaultInlineFormatType",
  "DefaultInputFormatType",
  "DefaultLabelStyle",
  "DefaultMenuStyle",
  "DefaultNaturalLanguage",
  "DefaultNewCellStyle",
  "DefaultNewInlineCellStyle",
  "DefaultNotebook",
  "DefaultOptions",
  "DefaultOutputFormatType",
  "DefaultPrintPrecision",
  "DefaultStyle",
  "DefaultStyleDefinitions",
  "DefaultTextFormatType",
  "DefaultTextInlineFormatType",
  "DefaultTicksStyle",
  "DefaultTooltipStyle",
  "DefaultValue",
  "DefaultValues",
  "Defer",
  "DefineExternal",
  "DefineInputStreamMethod",
  "DefineOutputStreamMethod",
  "DefineResourceFunction",
  "Definition",
  "Degree",
  "DegreeCentrality",
  "DegreeGraphDistribution",
  "DegreeLexicographic",
  "DegreeReverseLexicographic",
  "DEigensystem",
  "DEigenvalues",
  "Deinitialization",
  "Del",
  "DelaunayMesh",
  "Delayed",
  "Deletable",
  "Delete",
  "DeleteAnomalies",
  "DeleteBorderComponents",
  "DeleteCases",
  "DeleteChannel",
  "DeleteCloudExpression",
  "DeleteContents",
  "DeleteDirectory",
  "DeleteDuplicates",
  "DeleteDuplicatesBy",
  "DeleteFile",
  "DeleteMissing",
  "DeleteObject",
  "DeletePermissionsKey",
  "DeleteSearchIndex",
  "DeleteSmallComponents",
  "DeleteStopwords",
  "DeleteWithContents",
  "DeletionWarning",
  "DelimitedArray",
  "DelimitedSequence",
  "Delimiter",
  "DelimiterFlashTime",
  "DelimiterMatching",
  "Delimiters",
  "DeliveryFunction",
  "Dendrogram",
  "Denominator",
  "DensityGraphics",
  "DensityHistogram",
  "DensityPlot",
  "DensityPlot3D",
  "DependentVariables",
  "Deploy",
  "Deployed",
  "Depth",
  "DepthFirstScan",
  "Derivative",
  "DerivativeFilter",
  "DerivedKey",
  "DescriptorStateSpace",
  "DesignMatrix",
  "DestroyAfterEvaluation",
  "Det",
  "DeviceClose",
  "DeviceConfigure",
  "DeviceExecute",
  "DeviceExecuteAsynchronous",
  "DeviceObject",
  "DeviceOpen",
  "DeviceOpenQ",
  "DeviceRead",
  "DeviceReadBuffer",
  "DeviceReadLatest",
  "DeviceReadList",
  "DeviceReadTimeSeries",
  "Devices",
  "DeviceStreams",
  "DeviceWrite",
  "DeviceWriteBuffer",
  "DGaussianWavelet",
  "DiacriticalPositioning",
  "Diagonal",
  "DiagonalizableMatrixQ",
  "DiagonalMatrix",
  "DiagonalMatrixQ",
  "Dialog",
  "DialogIndent",
  "DialogInput",
  "DialogLevel",
  "DialogNotebook",
  "DialogProlog",
  "DialogReturn",
  "DialogSymbols",
  "Diamond",
  "DiamondMatrix",
  "DiceDissimilarity",
  "DictionaryLookup",
  "DictionaryWordQ",
  "DifferenceDelta",
  "DifferenceOrder",
  "DifferenceQuotient",
  "DifferenceRoot",
  "DifferenceRootReduce",
  "Differences",
  "DifferentialD",
  "DifferentialRoot",
  "DifferentialRootReduce",
  "DifferentiatorFilter",
  "DigitalSignature",
  "DigitBlock",
  "DigitBlockMinimum",
  "DigitCharacter",
  "DigitCount",
  "DigitQ",
  "DihedralAngle",
  "DihedralGroup",
  "Dilation",
  "DimensionalCombinations",
  "DimensionalMeshComponents",
  "DimensionReduce",
  "DimensionReducerFunction",
  "DimensionReduction",
  "Dimensions",
  "DiracComb",
  "DiracDelta",
  "DirectedEdge",
  "DirectedEdges",
  "DirectedGraph",
  "DirectedGraphQ",
  "DirectedInfinity",
  "Direction",
  "Directive",
  "Directory",
  "DirectoryName",
  "DirectoryQ",
  "DirectoryStack",
  "DirichletBeta",
  "DirichletCharacter",
  "DirichletCondition",
  "DirichletConvolve",
  "DirichletDistribution",
  "DirichletEta",
  "DirichletL",
  "DirichletLambda",
  "DirichletTransform",
  "DirichletWindow",
  "DisableConsolePrintPacket",
  "DisableFormatting",
  "DiscreteAsymptotic",
  "DiscreteChirpZTransform",
  "DiscreteConvolve",
  "DiscreteDelta",
  "DiscreteHadamardTransform",
  "DiscreteIndicator",
  "DiscreteLimit",
  "DiscreteLQEstimatorGains",
  "DiscreteLQRegulatorGains",
  "DiscreteLyapunovSolve",
  "DiscreteMarkovProcess",
  "DiscreteMaxLimit",
  "DiscreteMinLimit",
  "DiscretePlot",
  "DiscretePlot3D",
  "DiscreteRatio",
  "DiscreteRiccatiSolve",
  "DiscreteShift",
  "DiscreteTimeModelQ",
  "DiscreteUniformDistribution",
  "DiscreteVariables",
  "DiscreteWaveletData",
  "DiscreteWaveletPacketTransform",
  "DiscreteWaveletTransform",
  "DiscretizeGraphics",
  "DiscretizeRegion",
  "Discriminant",
  "DisjointQ",
  "Disjunction",
  "Disk",
  "DiskBox",
  "DiskMatrix",
  "DiskSegment",
  "Dispatch",
  "DispatchQ",
  "DispersionEstimatorFunction",
  "Display",
  "DisplayAllSteps",
  "DisplayEndPacket",
  "DisplayFlushImagePacket",
  "DisplayForm",
  "DisplayFunction",
  "DisplayPacket",
  "DisplayRules",
  "DisplaySetSizePacket",
  "DisplayString",
  "DisplayTemporary",
  "DisplayWith",
  "DisplayWithRef",
  "DisplayWithVariable",
  "DistanceFunction",
  "DistanceMatrix",
  "DistanceTransform",
  "Distribute",
  "Distributed",
  "DistributedContexts",
  "DistributeDefinitions",
  "DistributionChart",
  "DistributionDomain",
  "DistributionFitTest",
  "DistributionParameterAssumptions",
  "DistributionParameterQ",
  "Dithering",
  "Div",
  "Divergence",
  "Divide",
  "DivideBy",
  "Dividers",
  "DivideSides",
  "Divisible",
  "Divisors",
  "DivisorSigma",
  "DivisorSum",
  "DMSList",
  "DMSString",
  "Do",
  "DockedCells",
  "DocumentGenerator",
  "DocumentGeneratorInformation",
  "DocumentGeneratorInformationData",
  "DocumentGenerators",
  "DocumentNotebook",
  "DocumentWeightingRules",
  "Dodecahedron",
  "DomainRegistrationInformation",
  "DominantColors",
  "DOSTextFormat",
  "Dot",
  "DotDashed",
  "DotEqual",
  "DotLayer",
  "DotPlusLayer",
  "Dotted",
  "DoubleBracketingBar",
  "DoubleContourIntegral",
  "DoubleDownArrow",
  "DoubleLeftArrow",
  "DoubleLeftRightArrow",
  "DoubleLeftTee",
  "DoubleLongLeftArrow",
  "DoubleLongLeftRightArrow",
  "DoubleLongRightArrow",
  "DoubleRightArrow",
  "DoubleRightTee",
  "DoubleUpArrow",
  "DoubleUpDownArrow",
  "DoubleVerticalBar",
  "DoublyInfinite",
  "Down",
  "DownArrow",
  "DownArrowBar",
  "DownArrowUpArrow",
  "DownLeftRightVector",
  "DownLeftTeeVector",
  "DownLeftVector",
  "DownLeftVectorBar",
  "DownRightTeeVector",
  "DownRightVector",
  "DownRightVectorBar",
  "Downsample",
  "DownTee",
  "DownTeeArrow",
  "DownValues",
  "DragAndDrop",
  "DrawEdges",
  "DrawFrontFaces",
  "DrawHighlighted",
  "Drop",
  "DropoutLayer",
  "DSolve",
  "DSolveValue",
  "Dt",
  "DualLinearProgramming",
  "DualPolyhedron",
  "DualSystemsModel",
  "DumpGet",
  "DumpSave",
  "DuplicateFreeQ",
  "Duration",
  "Dynamic",
  "DynamicBox",
  "DynamicBoxOptions",
  "DynamicEvaluationTimeout",
  "DynamicGeoGraphics",
  "DynamicImage",
  "DynamicLocation",
  "DynamicModule",
  "DynamicModuleBox",
  "DynamicModuleBoxOptions",
  "DynamicModuleParent",
  "DynamicModuleValues",
  "DynamicName",
  "DynamicNamespace",
  "DynamicReference",
  "DynamicSetting",
  "DynamicUpdating",
  "DynamicWrapper",
  "DynamicWrapperBox",
  "DynamicWrapperBoxOptions",
  "E",
  "EarthImpactData",
  "EarthquakeData",
  "EccentricityCentrality",
  "Echo",
  "EchoFunction",
  "EclipseType",
  "EdgeAdd",
  "EdgeBetweennessCentrality",
  "EdgeCapacity",
  "EdgeCapForm",
  "EdgeColor",
  "EdgeConnectivity",
  "EdgeContract",
  "EdgeCost",
  "EdgeCount",
  "EdgeCoverQ",
  "EdgeCycleMatrix",
  "EdgeDashing",
  "EdgeDelete",
  "EdgeDetect",
  "EdgeForm",
  "EdgeIndex",
  "EdgeJoinForm",
  "EdgeLabeling",
  "EdgeLabels",
  "EdgeLabelStyle",
  "EdgeList",
  "EdgeOpacity",
  "EdgeQ",
  "EdgeRenderingFunction",
  "EdgeRules",
  "EdgeShapeFunction",
  "EdgeStyle",
  "EdgeTaggedGraph",
  "EdgeTaggedGraphQ",
  "EdgeTags",
  "EdgeThickness",
  "EdgeWeight",
  "EdgeWeightedGraphQ",
  "Editable",
  "EditButtonSettings",
  "EditCellTagsSettings",
  "EditDistance",
  "EffectiveInterest",
  "Eigensystem",
  "Eigenvalues",
  "EigenvectorCentrality",
  "Eigenvectors",
  "Element",
  "ElementData",
  "ElementwiseLayer",
  "ElidedForms",
  "Eliminate",
  "EliminationOrder",
  "Ellipsoid",
  "EllipticE",
  "EllipticExp",
  "EllipticExpPrime",
  "EllipticF",
  "EllipticFilterModel",
  "EllipticK",
  "EllipticLog",
  "EllipticNomeQ",
  "EllipticPi",
  "EllipticReducedHalfPeriods",
  "EllipticTheta",
  "EllipticThetaPrime",
  "EmbedCode",
  "EmbeddedHTML",
  "EmbeddedService",
  "EmbeddingLayer",
  "EmbeddingObject",
  "EmitSound",
  "EmphasizeSyntaxErrors",
  "EmpiricalDistribution",
  "Empty",
  "EmptyGraphQ",
  "EmptyRegion",
  "EnableConsolePrintPacket",
  "Enabled",
  "Encode",
  "Encrypt",
  "EncryptedObject",
  "EncryptFile",
  "End",
  "EndAdd",
  "EndDialogPacket",
  "EndFrontEndInteractionPacket",
  "EndOfBuffer",
  "EndOfFile",
  "EndOfLine",
  "EndOfString",
  "EndPackage",
  "EngineEnvironment",
  "EngineeringForm",
  "Enter",
  "EnterExpressionPacket",
  "EnterTextPacket",
  "Entity",
  "EntityClass",
  "EntityClassList",
  "EntityCopies",
  "EntityFunction",
  "EntityGroup",
  "EntityInstance",
  "EntityList",
  "EntityPrefetch",
  "EntityProperties",
  "EntityProperty",
  "EntityPropertyClass",
  "EntityRegister",
  "EntityStore",
  "EntityStores",
  "EntityTypeName",
  "EntityUnregister",
  "EntityValue",
  "Entropy",
  "EntropyFilter",
  "Environment",
  "Epilog",
  "EpilogFunction",
  "Equal",
  "EqualColumns",
  "EqualRows",
  "EqualTilde",
  "EqualTo",
  "EquatedTo",
  "Equilibrium",
  "EquirippleFilterKernel",
  "Equivalent",
  "Erf",
  "Erfc",
  "Erfi",
  "ErlangB",
  "ErlangC",
  "ErlangDistribution",
  "Erosion",
  "ErrorBox",
  "ErrorBoxOptions",
  "ErrorNorm",
  "ErrorPacket",
  "ErrorsDialogSettings",
  "EscapeRadius",
  "EstimatedBackground",
  "EstimatedDistribution",
  "EstimatedProcess",
  "EstimatorGains",
  "EstimatorRegulator",
  "EuclideanDistance",
  "EulerAngles",
  "EulerCharacteristic",
  "EulerE",
  "EulerGamma",
  "EulerianGraphQ",
  "EulerMatrix",
  "EulerPhi",
  "Evaluatable",
  "Evaluate",
  "Evaluated",
  "EvaluatePacket",
  "EvaluateScheduledTask",
  "EvaluationBox",
  "EvaluationCell",
  "EvaluationCompletionAction",
  "EvaluationData",
  "EvaluationElements",
  "EvaluationEnvironment",
  "EvaluationMode",
  "EvaluationMonitor",
  "EvaluationNotebook",
  "EvaluationObject",
  "EvaluationOrder",
  "Evaluator",
  "EvaluatorNames",
  "EvenQ",
  "EventData",
  "EventEvaluator",
  "EventHandler",
  "EventHandlerTag",
  "EventLabels",
  "EventSeries",
  "ExactBlackmanWindow",
  "ExactNumberQ",
  "ExactRootIsolation",
  "ExampleData",
  "Except",
  "ExcludedForms",
  "ExcludedLines",
  "ExcludedPhysicalQuantities",
  "ExcludePods",
  "Exclusions",
  "ExclusionsStyle",
  "Exists",
  "Exit",
  "ExitDialog",
  "ExoplanetData",
  "Exp",
  "Expand",
  "ExpandAll",
  "ExpandDenominator",
  "ExpandFileName",
  "ExpandNumerator",
  "Expectation",
  "ExpectationE",
  "ExpectedValue",
  "ExpGammaDistribution",
  "ExpIntegralE",
  "ExpIntegralEi",
  "ExpirationDate",
  "Exponent",
  "ExponentFunction",
  "ExponentialDistribution",
  "ExponentialFamily",
  "ExponentialGeneratingFunction",
  "ExponentialMovingAverage",
  "ExponentialPowerDistribution",
  "ExponentPosition",
  "ExponentStep",
  "Export",
  "ExportAutoReplacements",
  "ExportByteArray",
  "ExportForm",
  "ExportPacket",
  "ExportString",
  "Expression",
  "ExpressionCell",
  "ExpressionGraph",
  "ExpressionPacket",
  "ExpressionUUID",
  "ExpToTrig",
  "ExtendedEntityClass",
  "ExtendedGCD",
  "Extension",
  "ExtentElementFunction",
  "ExtentMarkers",
  "ExtentSize",
  "ExternalBundle",
  "ExternalCall",
  "ExternalDataCharacterEncoding",
  "ExternalEvaluate",
  "ExternalFunction",
  "ExternalFunctionName",
  "ExternalIdentifier",
  "ExternalObject",
  "ExternalOptions",
  "ExternalSessionObject",
  "ExternalSessions",
  "ExternalStorageBase",
  "ExternalStorageDownload",
  "ExternalStorageGet",
  "ExternalStorageObject",
  "ExternalStoragePut",
  "ExternalStorageUpload",
  "ExternalTypeSignature",
  "ExternalValue",
  "Extract",
  "ExtractArchive",
  "ExtractLayer",
  "ExtractPacletArchive",
  "ExtremeValueDistribution",
  "FaceAlign",
  "FaceForm",
  "FaceGrids",
  "FaceGridsStyle",
  "FacialFeatures",
  "Factor",
  "FactorComplete",
  "Factorial",
  "Factorial2",
  "FactorialMoment",
  "FactorialMomentGeneratingFunction",
  "FactorialPower",
  "FactorInteger",
  "FactorList",
  "FactorSquareFree",
  "FactorSquareFreeList",
  "FactorTerms",
  "FactorTermsList",
  "Fail",
  "Failure",
  "FailureAction",
  "FailureDistribution",
  "FailureQ",
  "False",
  "FareySequence",
  "FARIMAProcess",
  "FeatureDistance",
  "FeatureExtract",
  "FeatureExtraction",
  "FeatureExtractor",
  "FeatureExtractorFunction",
  "FeatureNames",
  "FeatureNearest",
  "FeatureSpacePlot",
  "FeatureSpacePlot3D",
  "FeatureTypes",
  "FEDisableConsolePrintPacket",
  "FeedbackLinearize",
  "FeedbackSector",
  "FeedbackSectorStyle",
  "FeedbackType",
  "FEEnableConsolePrintPacket",
  "FetalGrowthData",
  "Fibonacci",
  "Fibonorial",
  "FieldCompletionFunction",
  "FieldHint",
  "FieldHintStyle",
  "FieldMasked",
  "FieldSize",
  "File",
  "FileBaseName",
  "FileByteCount",
  "FileConvert",
  "FileDate",
  "FileExistsQ",
  "FileExtension",
  "FileFormat",
  "FileHandler",
  "FileHash",
  "FileInformation",
  "FileName",
  "FileNameDepth",
  "FileNameDialogSettings",
  "FileNameDrop",
  "FileNameForms",
  "FileNameJoin",
  "FileNames",
  "FileNameSetter",
  "FileNameSplit",
  "FileNameTake",
  "FilePrint",
  "FileSize",
  "FileSystemMap",
  "FileSystemScan",
  "FileTemplate",
  "FileTemplateApply",
  "FileType",
  "FilledCurve",
  "FilledCurveBox",
  "FilledCurveBoxOptions",
  "Filling",
  "FillingStyle",
  "FillingTransform",
  "FilteredEntityClass",
  "FilterRules",
  "FinancialBond",
  "FinancialData",
  "FinancialDerivative",
  "FinancialIndicator",
  "Find",
  "FindAnomalies",
  "FindArgMax",
  "FindArgMin",
  "FindChannels",
  "FindClique",
  "FindClusters",
  "FindCookies",
  "FindCurvePath",
  "FindCycle",
  "FindDevices",
  "FindDistribution",
  "FindDistributionParameters",
  "FindDivisions",
  "FindEdgeCover",
  "FindEdgeCut",
  "FindEdgeIndependentPaths",
  "FindEquationalProof",
  "FindEulerianCycle",
  "FindExternalEvaluators",
  "FindFaces",
  "FindFile",
  "FindFit",
  "FindFormula",
  "FindFundamentalCycles",
  "FindGeneratingFunction",
  "FindGeoLocation",
  "FindGeometricConjectures",
  "FindGeometricTransform",
  "FindGraphCommunities",
  "FindGraphIsomorphism",
  "FindGraphPartition",
  "FindHamiltonianCycle",
  "FindHamiltonianPath",
  "FindHiddenMarkovStates",
  "FindImageText",
  "FindIndependentEdgeSet",
  "FindIndependentVertexSet",
  "FindInstance",
  "FindIntegerNullVector",
  "FindKClan",
  "FindKClique",
  "FindKClub",
  "FindKPlex",
  "FindLibrary",
  "FindLinearRecurrence",
  "FindList",
  "FindMatchingColor",
  "FindMaximum",
  "FindMaximumCut",
  "FindMaximumFlow",
  "FindMaxValue",
  "FindMeshDefects",
  "FindMinimum",
  "FindMinimumCostFlow",
  "FindMinimumCut",
  "FindMinValue",
  "FindMoleculeSubstructure",
  "FindPath",
  "FindPeaks",
  "FindPermutation",
  "FindPostmanTour",
  "FindProcessParameters",
  "FindRepeat",
  "FindRoot",
  "FindSequenceFunction",
  "FindSettings",
  "FindShortestPath",
  "FindShortestTour",
  "FindSpanningTree",
  "FindSystemModelEquilibrium",
  "FindTextualAnswer",
  "FindThreshold",
  "FindTransientRepeat",
  "FindVertexCover",
  "FindVertexCut",
  "FindVertexIndependentPaths",
  "Fine",
  "FinishDynamic",
  "FiniteAbelianGroupCount",
  "FiniteGroupCount",
  "FiniteGroupData",
  "First",
  "FirstCase",
  "FirstPassageTimeDistribution",
  "FirstPosition",
  "FischerGroupFi22",
  "FischerGroupFi23",
  "FischerGroupFi24Prime",
  "FisherHypergeometricDistribution",
  "FisherRatioTest",
  "FisherZDistribution",
  "Fit",
  "FitAll",
  "FitRegularization",
  "FittedModel",
  "FixedOrder",
  "FixedPoint",
  "FixedPointList",
  "FlashSelection",
  "Flat",
  "Flatten",
  "FlattenAt",
  "FlattenLayer",
  "FlatTopWindow",
  "FlipView",
  "Floor",
  "FlowPolynomial",
  "FlushPrintOutputPacket",
  "Fold",
  "FoldList",
  "FoldPair",
  "FoldPairList",
  "FollowRedirects",
  "Font",
  "FontColor",
  "FontFamily",
  "FontForm",
  "FontName",
  "FontOpacity",
  "FontPostScriptName",
  "FontProperties",
  "FontReencoding",
  "FontSize",
  "FontSlant",
  "FontSubstitutions",
  "FontTracking",
  "FontVariations",
  "FontWeight",
  "For",
  "ForAll",
  "ForceVersionInstall",
  "Format",
  "FormatRules",
  "FormatType",
  "FormatTypeAutoConvert",
  "FormatValues",
  "FormBox",
  "FormBoxOptions",
  "FormControl",
  "FormFunction",
  "FormLayoutFunction",
  "FormObject",
  "FormPage",
  "FormTheme",
  "FormulaData",
  "FormulaLookup",
  "FortranForm",
  "Forward",
  "ForwardBackward",
  "Fourier",
  "FourierCoefficient",
  "FourierCosCoefficient",
  "FourierCosSeries",
  "FourierCosTransform",
  "FourierDCT",
  "FourierDCTFilter",
  "FourierDCTMatrix",
  "FourierDST",
  "FourierDSTMatrix",
  "FourierMatrix",
  "FourierParameters",
  "FourierSequenceTransform",
  "FourierSeries",
  "FourierSinCoefficient",
  "FourierSinSeries",
  "FourierSinTransform",
  "FourierTransform",
  "FourierTrigSeries",
  "FractionalBrownianMotionProcess",
  "FractionalGaussianNoiseProcess",
  "FractionalPart",
  "FractionBox",
  "FractionBoxOptions",
  "FractionLine",
  "Frame",
  "FrameBox",
  "FrameBoxOptions",
  "Framed",
  "FrameInset",
  "FrameLabel",
  "Frameless",
  "FrameMargins",
  "FrameRate",
  "FrameStyle",
  "FrameTicks",
  "FrameTicksStyle",
  "FRatioDistribution",
  "FrechetDistribution",
  "FreeQ",
  "FrenetSerretSystem",
  "FrequencySamplingFilterKernel",
  "FresnelC",
  "FresnelF",
  "FresnelG",
  "FresnelS",
  "Friday",
  "FrobeniusNumber",
  "FrobeniusSolve",
  "FromAbsoluteTime",
  "FromCharacterCode",
  "FromCoefficientRules",
  "FromContinuedFraction",
  "FromDate",
  "FromDigits",
  "FromDMS",
  "FromEntity",
  "FromJulianDate",
  "FromLetterNumber",
  "FromPolarCoordinates",
  "FromRomanNumeral",
  "FromSphericalCoordinates",
  "FromUnixTime",
  "Front",
  "FrontEndDynamicExpression",
  "FrontEndEventActions",
  "FrontEndExecute",
  "FrontEndObject",
  "FrontEndResource",
  "FrontEndResourceString",
  "FrontEndStackSize",
  "FrontEndToken",
  "FrontEndTokenExecute",
  "FrontEndValueCache",
  "FrontEndVersion",
  "FrontFaceColor",
  "FrontFaceOpacity",
  "Full",
  "FullAxes",
  "FullDefinition",
  "FullForm",
  "FullGraphics",
  "FullInformationOutputRegulator",
  "FullOptions",
  "FullRegion",
  "FullSimplify",
  "Function",
  "FunctionCompile",
  "FunctionCompileExport",
  "FunctionCompileExportByteArray",
  "FunctionCompileExportLibrary",
  "FunctionCompileExportString",
  "FunctionDomain",
  "FunctionExpand",
  "FunctionInterpolation",
  "FunctionPeriod",
  "FunctionRange",
  "FunctionSpace",
  "FussellVeselyImportance",
  "GaborFilter",
  "GaborMatrix",
  "GaborWavelet",
  "GainMargins",
  "GainPhaseMargins",
  "GalaxyData",
  "GalleryView",
  "Gamma",
  "GammaDistribution",
  "GammaRegularized",
  "GapPenalty",
  "GARCHProcess",
  "GatedRecurrentLayer",
  "Gather",
  "GatherBy",
  "GaugeFaceElementFunction",
  "GaugeFaceStyle",
  "GaugeFrameElementFunction",
  "GaugeFrameSize",
  "GaugeFrameStyle",
  "GaugeLabels",
  "GaugeMarkers",
  "GaugeStyle",
  "GaussianFilter",
  "GaussianIntegers",
  "GaussianMatrix",
  "GaussianOrthogonalMatrixDistribution",
  "GaussianSymplecticMatrixDistribution",
  "GaussianUnitaryMatrixDistribution",
  "GaussianWindow",
  "GCD",
  "GegenbauerC",
  "General",
  "GeneralizedLinearModelFit",
  "GenerateAsymmetricKeyPair",
  "GenerateConditions",
  "GeneratedCell",
  "GeneratedDocumentBinding",
  "GenerateDerivedKey",
  "GenerateDigitalSignature",
  "GenerateDocument",
  "GeneratedParameters",
  "GeneratedQuantityMagnitudes",
  "GenerateFileSignature",
  "GenerateHTTPResponse",
  "GenerateSecuredAuthenticationKey",
  "GenerateSymmetricKey",
  "GeneratingFunction",
  "GeneratorDescription",
  "GeneratorHistoryLength",
  "GeneratorOutputType",
  "Generic",
  "GenericCylindricalDecomposition",
  "GenomeData",
  "GenomeLookup",
  "GeoAntipode",
  "GeoArea",
  "GeoArraySize",
  "GeoBackground",
  "GeoBoundingBox",
  "GeoBounds",
  "GeoBoundsRegion",
  "GeoBubbleChart",
  "GeoCenter",
  "GeoCircle",
  "GeoContourPlot",
  "GeoDensityPlot",
  "GeodesicClosing",
  "GeodesicDilation",
  "GeodesicErosion",
  "GeodesicOpening",
  "GeoDestination",
  "GeodesyData",
  "GeoDirection",
  "GeoDisk",
  "GeoDisplacement",
  "GeoDistance",
  "GeoDistanceList",
  "GeoElevationData",
  "GeoEntities",
  "GeoGraphics",
  "GeogravityModelData",
  "GeoGridDirectionDifference",
  "GeoGridLines",
  "GeoGridLinesStyle",
  "GeoGridPosition",
  "GeoGridRange",
  "GeoGridRangePadding",
  "GeoGridUnitArea",
  "GeoGridUnitDistance",
  "GeoGridVector",
  "GeoGroup",
  "GeoHemisphere",
  "GeoHemisphereBoundary",
  "GeoHistogram",
  "GeoIdentify",
  "GeoImage",
  "GeoLabels",
  "GeoLength",
  "GeoListPlot",
  "GeoLocation",
  "GeologicalPeriodData",
  "GeomagneticModelData",
  "GeoMarker",
  "GeometricAssertion",
  "GeometricBrownianMotionProcess",
  "GeometricDistribution",
  "GeometricMean",
  "GeometricMeanFilter",
  "GeometricOptimization",
  "GeometricScene",
  "GeometricTransformation",
  "GeometricTransformation3DBox",
  "GeometricTransformation3DBoxOptions",
  "GeometricTransformationBox",
  "GeometricTransformationBoxOptions",
  "GeoModel",
  "GeoNearest",
  "GeoPath",
  "GeoPosition",
  "GeoPositionENU",
  "GeoPositionXYZ",
  "GeoProjection",
  "GeoProjectionData",
  "GeoRange",
  "GeoRangePadding",
  "GeoRegionValuePlot",
  "GeoResolution",
  "GeoScaleBar",
  "GeoServer",
  "GeoSmoothHistogram",
  "GeoStreamPlot",
  "GeoStyling",
  "GeoStylingImageFunction",
  "GeoVariant",
  "GeoVector",
  "GeoVectorENU",
  "GeoVectorPlot",
  "GeoVectorXYZ",
  "GeoVisibleRegion",
  "GeoVisibleRegionBoundary",
  "GeoWithinQ",
  "GeoZoomLevel",
  "GestureHandler",
  "GestureHandlerTag",
  "Get",
  "GetBoundingBoxSizePacket",
  "GetContext",
  "GetEnvironment",
  "GetFileName",
  "GetFrontEndOptionsDataPacket",
  "GetLinebreakInformationPacket",
  "GetMenusPacket",
  "GetPageBreakInformationPacket",
  "Glaisher",
  "GlobalClusteringCoefficient",
  "GlobalPreferences",
  "GlobalSession",
  "Glow",
  "GoldenAngle",
  "GoldenRatio",
  "GompertzMakehamDistribution",
  "GoochShading",
  "GoodmanKruskalGamma",
  "GoodmanKruskalGammaTest",
  "Goto",
  "Grad",
  "Gradient",
  "GradientFilter",
  "GradientOrientationFilter",
  "GrammarApply",
  "GrammarRules",
  "GrammarToken",
  "Graph",
  "Graph3D",
  "GraphAssortativity",
  "GraphAutomorphismGroup",
  "GraphCenter",
  "GraphComplement",
  "GraphData",
  "GraphDensity",
  "GraphDiameter",
  "GraphDifference",
  "GraphDisjointUnion",
  "GraphDistance",
  "GraphDistanceMatrix",
  "GraphElementData",
  "GraphEmbedding",
  "GraphHighlight",
  "GraphHighlightStyle",
  "GraphHub",
  "Graphics",
  "Graphics3D",
  "Graphics3DBox",
  "Graphics3DBoxOptions",
  "GraphicsArray",
  "GraphicsBaseline",
  "GraphicsBox",
  "GraphicsBoxOptions",
  "GraphicsColor",
  "GraphicsColumn",
  "GraphicsComplex",
  "GraphicsComplex3DBox",
  "GraphicsComplex3DBoxOptions",
  "GraphicsComplexBox",
  "GraphicsComplexBoxOptions",
  "GraphicsContents",
  "GraphicsData",
  "GraphicsGrid",
  "GraphicsGridBox",
  "GraphicsGroup",
  "GraphicsGroup3DBox",
  "GraphicsGroup3DBoxOptions",
  "GraphicsGroupBox",
  "GraphicsGroupBoxOptions",
  "GraphicsGrouping",
  "GraphicsHighlightColor",
  "GraphicsRow",
  "GraphicsSpacing",
  "GraphicsStyle",
  "GraphIntersection",
  "GraphLayout",
  "GraphLinkEfficiency",
  "GraphPeriphery",
  "GraphPlot",
  "GraphPlot3D",
  "GraphPower",
  "GraphPropertyDistribution",
  "GraphQ",
  "GraphRadius",
  "GraphReciprocity",
  "GraphRoot",
  "GraphStyle",
  "GraphUnion",
  "Gray",
  "GrayLevel",
  "Greater",
  "GreaterEqual",
  "GreaterEqualLess",
  "GreaterEqualThan",
  "GreaterFullEqual",
  "GreaterGreater",
  "GreaterLess",
  "GreaterSlantEqual",
  "GreaterThan",
  "GreaterTilde",
  "Green",
  "GreenFunction",
  "Grid",
  "GridBaseline",
  "GridBox",
  "GridBoxAlignment",
  "GridBoxBackground",
  "GridBoxDividers",
  "GridBoxFrame",
  "GridBoxItemSize",
  "GridBoxItemStyle",
  "GridBoxOptions",
  "GridBoxSpacings",
  "GridCreationSettings",
  "GridDefaultElement",
  "GridElementStyleOptions",
  "GridFrame",
  "GridFrameMargins",
  "GridGraph",
  "GridLines",
  "GridLinesStyle",
  "GroebnerBasis",
  "GroupActionBase",
  "GroupBy",
  "GroupCentralizer",
  "GroupElementFromWord",
  "GroupElementPosition",
  "GroupElementQ",
  "GroupElements",
  "GroupElementToWord",
  "GroupGenerators",
  "Groupings",
  "GroupMultiplicationTable",
  "GroupOrbits",
  "GroupOrder",
  "GroupPageBreakWithin",
  "GroupSetwiseStabilizer",
  "GroupStabilizer",
  "GroupStabilizerChain",
  "GroupTogetherGrouping",
  "GroupTogetherNestedGrouping",
  "GrowCutComponents",
  "Gudermannian",
  "GuidedFilter",
  "GumbelDistribution",
  "HaarWavelet",
  "HadamardMatrix",
  "HalfLine",
  "HalfNormalDistribution",
  "HalfPlane",
  "HalfSpace",
  "HalftoneShading",
  "HamiltonianGraphQ",
  "HammingDistance",
  "HammingWindow",
  "HandlerFunctions",
  "HandlerFunctionsKeys",
  "HankelH1",
  "HankelH2",
  "HankelMatrix",
  "HankelTransform",
  "HannPoissonWindow",
  "HannWindow",
  "HaradaNortonGroupHN",
  "HararyGraph",
  "HarmonicMean",
  "HarmonicMeanFilter",
  "HarmonicNumber",
  "Hash",
  "HatchFilling",
  "HatchShading",
  "Haversine",
  "HazardFunction",
  "Head",
  "HeadCompose",
  "HeaderAlignment",
  "HeaderBackground",
  "HeaderDisplayFunction",
  "HeaderLines",
  "HeaderSize",
  "HeaderStyle",
  "Heads",
  "HeavisideLambda",
  "HeavisidePi",
  "HeavisideTheta",
  "HeldGroupHe",
  "HeldPart",
  "HelpBrowserLookup",
  "HelpBrowserNotebook",
  "HelpBrowserSettings",
  "Here",
  "HermiteDecomposition",
  "HermiteH",
  "HermitianMatrixQ",
  "HessenbergDecomposition",
  "Hessian",
  "HeunB",
  "HeunBPrime",
  "HeunC",
  "HeunCPrime",
  "HeunD",
  "HeunDPrime",
  "HeunG",
  "HeunGPrime",
  "HeunT",
  "HeunTPrime",
  "HexadecimalCharacter",
  "Hexahedron",
  "HexahedronBox",
  "HexahedronBoxOptions",
  "HiddenItems",
  "HiddenMarkovProcess",
  "HiddenSurface",
  "Highlighted",
  "HighlightGraph",
  "HighlightImage",
  "HighlightMesh",
  "HighpassFilter",
  "HigmanSimsGroupHS",
  "HilbertCurve",
  "HilbertFilter",
  "HilbertMatrix",
  "Histogram",
  "Histogram3D",
  "HistogramDistribution",
  "HistogramList",
  "HistogramTransform",
  "HistogramTransformInterpolation",
  "HistoricalPeriodData",
  "HitMissTransform",
  "HITSCentrality",
  "HjorthDistribution",
  "HodgeDual",
  "HoeffdingD",
  "HoeffdingDTest",
  "Hold",
  "HoldAll",
  "HoldAllComplete",
  "HoldComplete",
  "HoldFirst",
  "HoldForm",
  "HoldPattern",
  "HoldRest",
  "HolidayCalendar",
  "HomeDirectory",
  "HomePage",
  "Horizontal",
  "HorizontalForm",
  "HorizontalGauge",
  "HorizontalScrollPosition",
  "HornerForm",
  "HostLookup",
  "HotellingTSquareDistribution",
  "HoytDistribution",
  "HTMLSave",
  "HTTPErrorResponse",
  "HTTPRedirect",
  "HTTPRequest",
  "HTTPRequestData",
  "HTTPResponse",
  "Hue",
  "HumanGrowthData",
  "HumpDownHump",
  "HumpEqual",
  "HurwitzLerchPhi",
  "HurwitzZeta",
  "HyperbolicDistribution",
  "HypercubeGraph",
  "HyperexponentialDistribution",
  "Hyperfactorial",
  "Hypergeometric0F1",
  "Hypergeometric0F1Regularized",
  "Hypergeometric1F1",
  "Hypergeometric1F1Regularized",
  "Hypergeometric2F1",
  "Hypergeometric2F1Regularized",
  "HypergeometricDistribution",
  "HypergeometricPFQ",
  "HypergeometricPFQRegularized",
  "HypergeometricU",
  "Hyperlink",
  "HyperlinkAction",
  "HyperlinkCreationSettings",
  "Hyperplane",
  "Hyphenation",
  "HyphenationOptions",
  "HypoexponentialDistribution",
  "HypothesisTestData",
  "I",
  "IconData",
  "Iconize",
  "IconizedObject",
  "IconRules",
  "Icosahedron",
  "Identity",
  "IdentityMatrix",
  "If",
  "IgnoreCase",
  "IgnoreDiacritics",
  "IgnorePunctuation",
  "IgnoreSpellCheck",
  "IgnoringInactive",
  "Im",
  "Image",
  "Image3D",
  "Image3DProjection",
  "Image3DSlices",
  "ImageAccumulate",
  "ImageAdd",
  "ImageAdjust",
  "ImageAlign",
  "ImageApply",
  "ImageApplyIndexed",
  "ImageAspectRatio",
  "ImageAssemble",
  "ImageAugmentationLayer",
  "ImageBoundingBoxes",
  "ImageCache",
  "ImageCacheValid",
  "ImageCapture",
  "ImageCaptureFunction",
  "ImageCases",
  "ImageChannels",
  "ImageClip",
  "ImageCollage",
  "ImageColorSpace",
  "ImageCompose",
  "ImageContainsQ",
  "ImageContents",
  "ImageConvolve",
  "ImageCooccurrence",
  "ImageCorners",
  "ImageCorrelate",
  "ImageCorrespondingPoints",
  "ImageCrop",
  "ImageData",
  "ImageDeconvolve",
  "ImageDemosaic",
  "ImageDifference",
  "ImageDimensions",
  "ImageDisplacements",
  "ImageDistance",
  "ImageEffect",
  "ImageExposureCombine",
  "ImageFeatureTrack",
  "ImageFileApply",
  "ImageFileFilter",
  "ImageFileScan",
  "ImageFilter",
  "ImageFocusCombine",
  "ImageForestingComponents",
  "ImageFormattingWidth",
  "ImageForwardTransformation",
  "ImageGraphics",
  "ImageHistogram",
  "ImageIdentify",
  "ImageInstanceQ",
  "ImageKeypoints",
  "ImageLabels",
  "ImageLegends",
  "ImageLevels",
  "ImageLines",
  "ImageMargins",
  "ImageMarker",
  "ImageMarkers",
  "ImageMeasurements",
  "ImageMesh",
  "ImageMultiply",
  "ImageOffset",
  "ImagePad",
  "ImagePadding",
  "ImagePartition",
  "ImagePeriodogram",
  "ImagePerspectiveTransformation",
  "ImagePosition",
  "ImagePreviewFunction",
  "ImagePyramid",
  "ImagePyramidApply",
  "ImageQ",
  "ImageRangeCache",
  "ImageRecolor",
  "ImageReflect",
  "ImageRegion",
  "ImageResize",
  "ImageResolution",
  "ImageRestyle",
  "ImageRotate",
  "ImageRotated",
  "ImageSaliencyFilter",
  "ImageScaled",
  "ImageScan",
  "ImageSize",
  "ImageSizeAction",
  "ImageSizeCache",
  "ImageSizeMultipliers",
  "ImageSizeRaw",
  "ImageSubtract",
  "ImageTake",
  "ImageTransformation",
  "ImageTrim",
  "ImageType",
  "ImageValue",
  "ImageValuePositions",
  "ImagingDevice",
  "ImplicitRegion",
  "Implies",
  "Import",
  "ImportAutoReplacements",
  "ImportByteArray",
  "ImportOptions",
  "ImportString",
  "ImprovementImportance",
  "In",
  "Inactivate",
  "Inactive",
  "IncidenceGraph",
  "IncidenceList",
  "IncidenceMatrix",
  "IncludeAromaticBonds",
  "IncludeConstantBasis",
  "IncludeDefinitions",
  "IncludeDirectories",
  "IncludeFileExtension",
  "IncludeGeneratorTasks",
  "IncludeHydrogens",
  "IncludeInflections",
  "IncludeMetaInformation",
  "IncludePods",
  "IncludeQuantities",
  "IncludeRelatedTables",
  "IncludeSingularTerm",
  "IncludeWindowTimes",
  "Increment",
  "IndefiniteMatrixQ",
  "Indent",
  "IndentingNewlineSpacings",
  "IndentMaxFraction",
  "IndependenceTest",
  "IndependentEdgeSetQ",
  "IndependentPhysicalQuantity",
  "IndependentUnit",
  "IndependentUnitDimension",
  "IndependentVertexSetQ",
  "Indeterminate",
  "IndeterminateThreshold",
  "IndexCreationOptions",
  "Indexed",
  "IndexEdgeTaggedGraph",
  "IndexGraph",
  "IndexTag",
  "Inequality",
  "InexactNumberQ",
  "InexactNumbers",
  "InfiniteFuture",
  "InfiniteLine",
  "InfinitePast",
  "InfinitePlane",
  "Infinity",
  "Infix",
  "InflationAdjust",
  "InflationMethod",
  "Information",
  "InformationData",
  "InformationDataGrid",
  "Inherited",
  "InheritScope",
  "InhomogeneousPoissonProcess",
  "InitialEvaluationHistory",
  "Initialization",
  "InitializationCell",
  "InitializationCellEvaluation",
  "InitializationCellWarning",
  "InitializationObjects",
  "InitializationValue",
  "Initialize",
  "InitialSeeding",
  "InlineCounterAssignments",
  "InlineCounterIncrements",
  "InlineRules",
  "Inner",
  "InnerPolygon",
  "InnerPolyhedron",
  "Inpaint",
  "Input",
  "InputAliases",
  "InputAssumptions",
  "InputAutoReplacements",
  "InputField",
  "InputFieldBox",
  "InputFieldBoxOptions",
  "InputForm",
  "InputGrouping",
  "InputNamePacket",
  "InputNotebook",
  "InputPacket",
  "InputSettings",
  "InputStream",
  "InputString",
  "InputStringPacket",
  "InputToBoxFormPacket",
  "Insert",
  "InsertionFunction",
  "InsertionPointObject",
  "InsertLinebreaks",
  "InsertResults",
  "Inset",
  "Inset3DBox",
  "Inset3DBoxOptions",
  "InsetBox",
  "InsetBoxOptions",
  "Insphere",
  "Install",
  "InstallService",
  "InstanceNormalizationLayer",
  "InString",
  "Integer",
  "IntegerDigits",
  "IntegerExponent",
  "IntegerLength",
  "IntegerName",
  "IntegerPart",
  "IntegerPartitions",
  "IntegerQ",
  "IntegerReverse",
  "Integers",
  "IntegerString",
  "Integral",
  "Integrate",
  "Interactive",
  "InteractiveTradingChart",
  "Interlaced",
  "Interleaving",
  "InternallyBalancedDecomposition",
  "InterpolatingFunction",
  "InterpolatingPolynomial",
  "Interpolation",
  "InterpolationOrder",
  "InterpolationPoints",
  "InterpolationPrecision",
  "Interpretation",
  "InterpretationBox",
  "InterpretationBoxOptions",
  "InterpretationFunction",
  "Interpreter",
  "InterpretTemplate",
  "InterquartileRange",
  "Interrupt",
  "InterruptSettings",
  "IntersectedEntityClass",
  "IntersectingQ",
  "Intersection",
  "Interval",
  "IntervalIntersection",
  "IntervalMarkers",
  "IntervalMarkersStyle",
  "IntervalMemberQ",
  "IntervalSlider",
  "IntervalUnion",
  "Into",
  "Inverse",
  "InverseBetaRegularized",
  "InverseCDF",
  "InverseChiSquareDistribution",
  "InverseContinuousWaveletTransform",
  "InverseDistanceTransform",
  "InverseEllipticNomeQ",
  "InverseErf",
  "InverseErfc",
  "InverseFourier",
  "InverseFourierCosTransform",
  "InverseFourierSequenceTransform",
  "InverseFourierSinTransform",
  "InverseFourierTransform",
  "InverseFunction",
  "InverseFunctions",
  "InverseGammaDistribution",
  "InverseGammaRegularized",
  "InverseGaussianDistribution",
  "InverseGudermannian",
  "InverseHankelTransform",
  "InverseHaversine",
  "InverseImagePyramid",
  "InverseJacobiCD",
  "InverseJacobiCN",
  "InverseJacobiCS",
  "InverseJacobiDC",
  "InverseJacobiDN",
  "InverseJacobiDS",
  "InverseJacobiNC",
  "InverseJacobiND",
  "InverseJacobiNS",
  "InverseJacobiSC",
  "InverseJacobiSD",
  "InverseJacobiSN",
  "InverseLaplaceTransform",
  "InverseMellinTransform",
  "InversePermutation",
  "InverseRadon",
  "InverseRadonTransform",
  "InverseSeries",
  "InverseShortTimeFourier",
  "InverseSpectrogram",
  "InverseSurvivalFunction",
  "InverseTransformedRegion",
  "InverseWaveletTransform",
  "InverseWeierstrassP",
  "InverseWishartMatrixDistribution",
  "InverseZTransform",
  "Invisible",
  "InvisibleApplication",
  "InvisibleTimes",
  "IPAddress",
  "IrreduciblePolynomialQ",
  "IslandData",
  "IsolatingInterval",
  "IsomorphicGraphQ",
  "IsotopeData",
  "Italic",
  "Item",
  "ItemAspectRatio",
  "ItemBox",
  "ItemBoxOptions",
  "ItemDisplayFunction",
  "ItemSize",
  "ItemStyle",
  "ItoProcess",
  "JaccardDissimilarity",
  "JacobiAmplitude",
  "Jacobian",
  "JacobiCD",
  "JacobiCN",
  "JacobiCS",
  "JacobiDC",
  "JacobiDN",
  "JacobiDS",
  "JacobiNC",
  "JacobiND",
  "JacobiNS",
  "JacobiP",
  "JacobiSC",
  "JacobiSD",
  "JacobiSN",
  "JacobiSymbol",
  "JacobiZeta",
  "JankoGroupJ1",
  "JankoGroupJ2",
  "JankoGroupJ3",
  "JankoGroupJ4",
  "JarqueBeraALMTest",
  "JohnsonDistribution",
  "Join",
  "JoinAcross",
  "Joined",
  "JoinedCurve",
  "JoinedCurveBox",
  "JoinedCurveBoxOptions",
  "JoinForm",
  "JordanDecomposition",
  "JordanModelDecomposition",
  "JulianDate",
  "JuliaSetBoettcher",
  "JuliaSetIterationCount",
  "JuliaSetPlot",
  "JuliaSetPoints",
  "K",
  "KagiChart",
  "KaiserBesselWindow",
  "KaiserWindow",
  "KalmanEstimator",
  "KalmanFilter",
  "KarhunenLoeveDecomposition",
  "KaryTree",
  "KatzCentrality",
  "KCoreComponents",
  "KDistribution",
  "KEdgeConnectedComponents",
  "KEdgeConnectedGraphQ",
  "KeepExistingVersion",
  "KelvinBei",
  "KelvinBer",
  "KelvinKei",
  "KelvinKer",
  "KendallTau",
  "KendallTauTest",
  "KernelExecute",
  "KernelFunction",
  "KernelMixtureDistribution",
  "KernelObject",
  "Kernels",
  "Ket",
  "Key",
  "KeyCollisionFunction",
  "KeyComplement",
  "KeyDrop",
  "KeyDropFrom",
  "KeyExistsQ",
  "KeyFreeQ",
  "KeyIntersection",
  "KeyMap",
  "KeyMemberQ",
  "KeypointStrength",
  "Keys",
  "KeySelect",
  "KeySort",
  "KeySortBy",
  "KeyTake",
  "KeyUnion",
  "KeyValueMap",
  "KeyValuePattern",
  "Khinchin",
  "KillProcess",
  "KirchhoffGraph",
  "KirchhoffMatrix",
  "KleinInvariantJ",
  "KnapsackSolve",
  "KnightTourGraph",
  "KnotData",
  "KnownUnitQ",
  "KochCurve",
  "KolmogorovSmirnovTest",
  "KroneckerDelta",
  "KroneckerModelDecomposition",
  "KroneckerProduct",
  "KroneckerSymbol",
  "KuiperTest",
  "KumaraswamyDistribution",
  "Kurtosis",
  "KuwaharaFilter",
  "KVertexConnectedComponents",
  "KVertexConnectedGraphQ",
  "LABColor",
  "Label",
  "Labeled",
  "LabeledSlider",
  "LabelingFunction",
  "LabelingSize",
  "LabelStyle",
  "LabelVisibility",
  "LaguerreL",
  "LakeData",
  "LambdaComponents",
  "LambertW",
  "LaminaData",
  "LanczosWindow",
  "LandauDistribution",
  "Language",
  "LanguageCategory",
  "LanguageData",
  "LanguageIdentify",
  "LanguageOptions",
  "LaplaceDistribution",
  "LaplaceTransform",
  "Laplacian",
  "LaplacianFilter",
  "LaplacianGaussianFilter",
  "Large",
  "Larger",
  "Last",
  "Latitude",
  "LatitudeLongitude",
  "LatticeData",
  "LatticeReduce",
  "Launch",
  "LaunchKernels",
  "LayeredGraphPlot",
  "LayerSizeFunction",
  "LayoutInformation",
  "LCHColor",
  "LCM",
  "LeaderSize",
  "LeafCount",
  "LeapYearQ",
  "LearnDistribution",
  "LearnedDistribution",
  "LearningRate",
  "LearningRateMultipliers",
  "LeastSquares",
  "LeastSquaresFilterKernel",
  "Left",
  "LeftArrow",
  "LeftArrowBar",
  "LeftArrowRightArrow",
  "LeftDownTeeVector",
  "LeftDownVector",
  "LeftDownVectorBar",
  "LeftRightArrow",
  "LeftRightVector",
  "LeftTee",
  "LeftTeeArrow",
  "LeftTeeVector",
  "LeftTriangle",
  "LeftTriangleBar",
  "LeftTriangleEqual",
  "LeftUpDownVector",
  "LeftUpTeeVector",
  "LeftUpVector",
  "LeftUpVectorBar",
  "LeftVector",
  "LeftVectorBar",
  "LegendAppearance",
  "Legended",
  "LegendFunction",
  "LegendLabel",
  "LegendLayout",
  "LegendMargins",
  "LegendMarkers",
  "LegendMarkerSize",
  "LegendreP",
  "LegendreQ",
  "LegendreType",
  "Length",
  "LengthWhile",
  "LerchPhi",
  "Less",
  "LessEqual",
  "LessEqualGreater",
  "LessEqualThan",
  "LessFullEqual",
  "LessGreater",
  "LessLess",
  "LessSlantEqual",
  "LessThan",
  "LessTilde",
  "LetterCharacter",
  "LetterCounts",
  "LetterNumber",
  "LetterQ",
  "Level",
  "LeveneTest",
  "LeviCivitaTensor",
  "LevyDistribution",
  "Lexicographic",
  "LibraryDataType",
  "LibraryFunction",
  "LibraryFunctionError",
  "LibraryFunctionInformation",
  "LibraryFunctionLoad",
  "LibraryFunctionUnload",
  "LibraryLoad",
  "LibraryUnload",
  "LicenseID",
  "LiftingFilterData",
  "LiftingWaveletTransform",
  "LightBlue",
  "LightBrown",
  "LightCyan",
  "Lighter",
  "LightGray",
  "LightGreen",
  "Lighting",
  "LightingAngle",
  "LightMagenta",
  "LightOrange",
  "LightPink",
  "LightPurple",
  "LightRed",
  "LightSources",
  "LightYellow",
  "Likelihood",
  "Limit",
  "LimitsPositioning",
  "LimitsPositioningTokens",
  "LindleyDistribution",
  "Line",
  "Line3DBox",
  "Line3DBoxOptions",
  "LinearFilter",
  "LinearFractionalOptimization",
  "LinearFractionalTransform",
  "LinearGradientImage",
  "LinearizingTransformationData",
  "LinearLayer",
  "LinearModelFit",
  "LinearOffsetFunction",
  "LinearOptimization",
  "LinearProgramming",
  "LinearRecurrence",
  "LinearSolve",
  "LinearSolveFunction",
  "LineBox",
  "LineBoxOptions",
  "LineBreak",
  "LinebreakAdjustments",
  "LineBreakChart",
  "LinebreakSemicolonWeighting",
  "LineBreakWithin",
  "LineColor",
  "LineGraph",
  "LineIndent",
  "LineIndentMaxFraction",
  "LineIntegralConvolutionPlot",
  "LineIntegralConvolutionScale",
  "LineLegend",
  "LineOpacity",
  "LineSpacing",
  "LineWrapParts",
  "LinkActivate",
  "LinkClose",
  "LinkConnect",
  "LinkConnectedQ",
  "LinkCreate",
  "LinkError",
  "LinkFlush",
  "LinkFunction",
  "LinkHost",
  "LinkInterrupt",
  "LinkLaunch",
  "LinkMode",
  "LinkObject",
  "LinkOpen",
  "LinkOptions",
  "LinkPatterns",
  "LinkProtocol",
  "LinkRankCentrality",
  "LinkRead",
  "LinkReadHeld",
  "LinkReadyQ",
  "Links",
  "LinkService",
  "LinkWrite",
  "LinkWriteHeld",
  "LiouvilleLambda",
  "List",
  "Listable",
  "ListAnimate",
  "ListContourPlot",
  "ListContourPlot3D",
  "ListConvolve",
  "ListCorrelate",
  "ListCurvePathPlot",
  "ListDeconvolve",
  "ListDensityPlot",
  "ListDensityPlot3D",
  "Listen",
  "ListFormat",
  "ListFourierSequenceTransform",
  "ListInterpolation",
  "ListLineIntegralConvolutionPlot",
  "ListLinePlot",
  "ListLogLinearPlot",
  "ListLogLogPlot",
  "ListLogPlot",
  "ListPicker",
  "ListPickerBox",
  "ListPickerBoxBackground",
  "ListPickerBoxOptions",
  "ListPlay",
  "ListPlot",
  "ListPlot3D",
  "ListPointPlot3D",
  "ListPolarPlot",
  "ListQ",
  "ListSliceContourPlot3D",
  "ListSliceDensityPlot3D",
  "ListSliceVectorPlot3D",
  "ListStepPlot",
  "ListStreamDensityPlot",
  "ListStreamPlot",
  "ListSurfacePlot3D",
  "ListVectorDensityPlot",
  "ListVectorPlot",
  "ListVectorPlot3D",
  "ListZTransform",
  "Literal",
  "LiteralSearch",
  "LocalAdaptiveBinarize",
  "LocalCache",
  "LocalClusteringCoefficient",
  "LocalizeDefinitions",
  "LocalizeVariables",
  "LocalObject",
  "LocalObjects",
  "LocalResponseNormalizationLayer",
  "LocalSubmit",
  "LocalSymbol",
  "LocalTime",
  "LocalTimeZone",
  "LocationEquivalenceTest",
  "LocationTest",
  "Locator",
  "LocatorAutoCreate",
  "LocatorBox",
  "LocatorBoxOptions",
  "LocatorCentering",
  "LocatorPane",
  "LocatorPaneBox",
  "LocatorPaneBoxOptions",
  "LocatorRegion",
  "Locked",
  "Log",
  "Log10",
  "Log2",
  "LogBarnesG",
  "LogGamma",
  "LogGammaDistribution",
  "LogicalExpand",
  "LogIntegral",
  "LogisticDistribution",
  "LogisticSigmoid",
  "LogitModelFit",
  "LogLikelihood",
  "LogLinearPlot",
  "LogLogisticDistribution",
  "LogLogPlot",
  "LogMultinormalDistribution",
  "LogNormalDistribution",
  "LogPlot",
  "LogRankTest",
  "LogSeriesDistribution",
  "LongEqual",
  "Longest",
  "LongestCommonSequence",
  "LongestCommonSequencePositions",
  "LongestCommonSubsequence",
  "LongestCommonSubsequencePositions",
  "LongestMatch",
  "LongestOrderedSequence",
  "LongForm",
  "Longitude",
  "LongLeftArrow",
  "LongLeftRightArrow",
  "LongRightArrow",
  "LongShortTermMemoryLayer",
  "Lookup",
  "Loopback",
  "LoopFreeGraphQ",
  "Looping",
  "LossFunction",
  "LowerCaseQ",
  "LowerLeftArrow",
  "LowerRightArrow",
  "LowerTriangularize",
  "LowerTriangularMatrixQ",
  "LowpassFilter",
  "LQEstimatorGains",
  "LQGRegulator",
  "LQOutputRegulatorGains",
  "LQRegulatorGains",
  "LUBackSubstitution",
  "LucasL",
  "LuccioSamiComponents",
  "LUDecomposition",
  "LunarEclipse",
  "LUVColor",
  "LyapunovSolve",
  "LyonsGroupLy",
  "MachineID",
  "MachineName",
  "MachineNumberQ",
  "MachinePrecision",
  "MacintoshSystemPageSetup",
  "Magenta",
  "Magnification",
  "Magnify",
  "MailAddressValidation",
  "MailExecute",
  "MailFolder",
  "MailItem",
  "MailReceiverFunction",
  "MailResponseFunction",
  "MailSearch",
  "MailServerConnect",
  "MailServerConnection",
  "MailSettings",
  "MainSolve",
  "MaintainDynamicCaches",
  "Majority",
  "MakeBoxes",
  "MakeExpression",
  "MakeRules",
  "ManagedLibraryExpressionID",
  "ManagedLibraryExpressionQ",
  "MandelbrotSetBoettcher",
  "MandelbrotSetDistance",
  "MandelbrotSetIterationCount",
  "MandelbrotSetMemberQ",
  "MandelbrotSetPlot",
  "MangoldtLambda",
  "ManhattanDistance",
  "Manipulate",
  "Manipulator",
  "MannedSpaceMissionData",
  "MannWhitneyTest",
  "MantissaExponent",
  "Manual",
  "Map",
  "MapAll",
  "MapAt",
  "MapIndexed",
  "MAProcess",
  "MapThread",
  "MarchenkoPasturDistribution",
  "MarcumQ",
  "MardiaCombinedTest",
  "MardiaKurtosisTest",
  "MardiaSkewnessTest",
  "MarginalDistribution",
  "MarkovProcessProperties",
  "Masking",
  "MatchingDissimilarity",
  "MatchLocalNameQ",
  "MatchLocalNames",
  "MatchQ",
  "Material",
  "MathematicalFunctionData",
  "MathematicaNotation",
  "MathieuC",
  "MathieuCharacteristicA",
  "MathieuCharacteristicB",
  "MathieuCharacteristicExponent",
  "MathieuCPrime",
  "MathieuGroupM11",
  "MathieuGroupM12",
  "MathieuGroupM22",
  "MathieuGroupM23",
  "MathieuGroupM24",
  "MathieuS",
  "MathieuSPrime",
  "MathMLForm",
  "MathMLText",
  "Matrices",
  "MatrixExp",
  "MatrixForm",
  "MatrixFunction",
  "MatrixLog",
  "MatrixNormalDistribution",
  "MatrixPlot",
  "MatrixPower",
  "MatrixPropertyDistribution",
  "MatrixQ",
  "MatrixRank",
  "MatrixTDistribution",
  "Max",
  "MaxBend",
  "MaxCellMeasure",
  "MaxColorDistance",
  "MaxDate",
  "MaxDetect",
  "MaxDuration",
  "MaxExtraBandwidths",
  "MaxExtraConditions",
  "MaxFeatureDisplacement",
  "MaxFeatures",
  "MaxFilter",
  "MaximalBy",
  "Maximize",
  "MaxItems",
  "MaxIterations",
  "MaxLimit",
  "MaxMemoryUsed",
  "MaxMixtureKernels",
  "MaxOverlapFraction",
  "MaxPlotPoints",
  "MaxPoints",
  "MaxRecursion",
  "MaxStableDistribution",
  "MaxStepFraction",
  "MaxSteps",
  "MaxStepSize",
  "MaxTrainingRounds",
  "MaxValue",
  "MaxwellDistribution",
  "MaxWordGap",
  "McLaughlinGroupMcL",
  "Mean",
  "MeanAbsoluteLossLayer",
  "MeanAround",
  "MeanClusteringCoefficient",
  "MeanDegreeConnectivity",
  "MeanDeviation",
  "MeanFilter",
  "MeanGraphDistance",
  "MeanNeighborDegree",
  "MeanShift",
  "MeanShiftFilter",
  "MeanSquaredLossLayer",
  "Median",
  "MedianDeviation",
  "MedianFilter",
  "MedicalTestData",
  "Medium",
  "MeijerG",
  "MeijerGReduce",
  "MeixnerDistribution",
  "MellinConvolve",
  "MellinTransform",
  "MemberQ",
  "MemoryAvailable",
  "MemoryConstrained",
  "MemoryConstraint",
  "MemoryInUse",
  "MengerMesh",
  "Menu",
  "MenuAppearance",
  "MenuCommandKey",
  "MenuEvaluator",
  "MenuItem",
  "MenuList",
  "MenuPacket",
  "MenuSortingValue",
  "MenuStyle",
  "MenuView",
  "Merge",
  "MergeDifferences",
  "MergingFunction",
  "MersennePrimeExponent",
  "MersennePrimeExponentQ",
  "Mesh",
  "MeshCellCentroid",
  "MeshCellCount",
  "MeshCellHighlight",
  "MeshCellIndex",
  "MeshCellLabel",
  "MeshCellMarker",
  "MeshCellMeasure",
  "MeshCellQuality",
  "MeshCells",
  "MeshCellShapeFunction",
  "MeshCellStyle",
  "MeshConnectivityGraph",
  "MeshCoordinates",
  "MeshFunctions",
  "MeshPrimitives",
  "MeshQualityGoal",
  "MeshRange",
  "MeshRefinementFunction",
  "MeshRegion",
  "MeshRegionQ",
  "MeshShading",
  "MeshStyle",
  "Message",
  "MessageDialog",
  "MessageList",
  "MessageName",
  "MessageObject",
  "MessageOptions",
  "MessagePacket",
  "Messages",
  "MessagesNotebook",
  "MetaCharacters",
  "MetaInformation",
  "MeteorShowerData",
  "Method",
  "MethodOptions",
  "MexicanHatWavelet",
  "MeyerWavelet",
  "Midpoint",
  "Min",
  "MinColorDistance",
  "MinDate",
  "MinDetect",
  "MineralData",
  "MinFilter",
  "MinimalBy",
  "MinimalPolynomial",
  "MinimalStateSpaceModel",
  "Minimize",
  "MinimumTimeIncrement",
  "MinIntervalSize",
  "MinkowskiQuestionMark",
  "MinLimit",
  "MinMax",
  "MinorPlanetData",
  "Minors",
  "MinRecursion",
  "MinSize",
  "MinStableDistribution",
  "Minus",
  "MinusPlus",
  "MinValue",
  "Missing",
  "MissingBehavior",
  "MissingDataMethod",
  "MissingDataRules",
  "MissingQ",
  "MissingString",
  "MissingStyle",
  "MissingValuePattern",
  "MittagLefflerE",
  "MixedFractionParts",
  "MixedGraphQ",
  "MixedMagnitude",
  "MixedRadix",
  "MixedRadixQuantity",
  "MixedUnit",
  "MixtureDistribution",
  "Mod",
  "Modal",
  "Mode",
  "Modular",
  "ModularInverse",
  "ModularLambda",
  "Module",
  "Modulus",
  "MoebiusMu",
  "Molecule",
  "MoleculeContainsQ",
  "MoleculeEquivalentQ",
  "MoleculeGraph",
  "MoleculeModify",
  "MoleculePattern",
  "MoleculePlot",
  "MoleculePlot3D",
  "MoleculeProperty",
  "MoleculeQ",
  "MoleculeRecognize",
  "MoleculeValue",
  "Moment",
  "Momentary",
  "MomentConvert",
  "MomentEvaluate",
  "MomentGeneratingFunction",
  "MomentOfInertia",
  "Monday",
  "Monitor",
  "MonomialList",
  "MonomialOrder",
  "MonsterGroupM",
  "MoonPhase",
  "MoonPosition",
  "MorletWavelet",
  "MorphologicalBinarize",
  "MorphologicalBranchPoints",
  "MorphologicalComponents",
  "MorphologicalEulerNumber",
  "MorphologicalGraph",
  "MorphologicalPerimeter",
  "MorphologicalTransform",
  "MortalityData",
  "Most",
  "MountainData",
  "MouseAnnotation",
  "MouseAppearance",
  "MouseAppearanceTag",
  "MouseButtons",
  "Mouseover",
  "MousePointerNote",
  "MousePosition",
  "MovieData",
  "MovingAverage",
  "MovingMap",
  "MovingMedian",
  "MoyalDistribution",
  "Multicolumn",
  "MultiedgeStyle",
  "MultigraphQ",
  "MultilaunchWarning",
  "MultiLetterItalics",
  "MultiLetterStyle",
  "MultilineFunction",
  "Multinomial",
  "MultinomialDistribution",
  "MultinormalDistribution",
  "MultiplicativeOrder",
  "Multiplicity",
  "MultiplySides",
  "Multiselection",
  "MultivariateHypergeometricDistribution",
  "MultivariatePoissonDistribution",
  "MultivariateTDistribution",
  "N",
  "NakagamiDistribution",
  "NameQ",
  "Names",
  "NamespaceBox",
  "NamespaceBoxOptions",
  "Nand",
  "NArgMax",
  "NArgMin",
  "NBernoulliB",
  "NBodySimulation",
  "NBodySimulationData",
  "NCache",
  "NDEigensystem",
  "NDEigenvalues",
  "NDSolve",
  "NDSolveValue",
  "Nearest",
  "NearestFunction",
  "NearestMeshCells",
  "NearestNeighborGraph",
  "NearestTo",
  "NebulaData",
  "NeedCurrentFrontEndPackagePacket",
  "NeedCurrentFrontEndSymbolsPacket",
  "NeedlemanWunschSimilarity",
  "Needs",
  "Negative",
  "NegativeBinomialDistribution",
  "NegativeDefiniteMatrixQ",
  "NegativeIntegers",
  "NegativeMultinomialDistribution",
  "NegativeRationals",
  "NegativeReals",
  "NegativeSemidefiniteMatrixQ",
  "NeighborhoodData",
  "NeighborhoodGraph",
  "Nest",
  "NestedGreaterGreater",
  "NestedLessLess",
  "NestedScriptRules",
  "NestGraph",
  "NestList",
  "NestWhile",
  "NestWhileList",
  "NetAppend",
  "NetBidirectionalOperator",
  "NetChain",
  "NetDecoder",
  "NetDelete",
  "NetDrop",
  "NetEncoder",
  "NetEvaluationMode",
  "NetExtract",
  "NetFlatten",
  "NetFoldOperator",
  "NetGANOperator",
  "NetGraph",
  "NetInformation",
  "NetInitialize",
  "NetInsert",
  "NetInsertSharedArrays",
  "NetJoin",
  "NetMapOperator",
  "NetMapThreadOperator",
  "NetMeasurements",
  "NetModel",
  "NetNestOperator",
  "NetPairEmbeddingOperator",
  "NetPort",
  "NetPortGradient",
  "NetPrepend",
  "NetRename",
  "NetReplace",
  "NetReplacePart",
  "NetSharedArray",
  "NetStateObject",
  "NetTake",
  "NetTrain",
  "NetTrainResultsObject",
  "NetworkPacketCapture",
  "NetworkPacketRecording",
  "NetworkPacketRecordingDuring",
  "NetworkPacketTrace",
  "NeumannValue",
  "NevilleThetaC",
  "NevilleThetaD",
  "NevilleThetaN",
  "NevilleThetaS",
  "NewPrimitiveStyle",
  "NExpectation",
  "Next",
  "NextCell",
  "NextDate",
  "NextPrime",
  "NextScheduledTaskTime",
  "NHoldAll",
  "NHoldFirst",
  "NHoldRest",
  "NicholsGridLines",
  "NicholsPlot",
  "NightHemisphere",
  "NIntegrate",
  "NMaximize",
  "NMaxValue",
  "NMinimize",
  "NMinValue",
  "NominalVariables",
  "NonAssociative",
  "NoncentralBetaDistribution",
  "NoncentralChiSquareDistribution",
  "NoncentralFRatioDistribution",
  "NoncentralStudentTDistribution",
  "NonCommutativeMultiply",
  "NonConstants",
  "NondimensionalizationTransform",
  "None",
  "NoneTrue",
  "NonlinearModelFit",
  "NonlinearStateSpaceModel",
  "NonlocalMeansFilter",
  "NonNegative",
  "NonNegativeIntegers",
  "NonNegativeRationals",
  "NonNegativeReals",
  "NonPositive",
  "NonPositiveIntegers",
  "NonPositiveRationals",
  "NonPositiveReals",
  "Nor",
  "NorlundB",
  "Norm",
  "Normal",
  "NormalDistribution",
  "NormalGrouping",
  "NormalizationLayer",
  "Normalize",
  "Normalized",
  "NormalizedSquaredEuclideanDistance",
  "NormalMatrixQ",
  "NormalsFunction",
  "NormFunction",
  "Not",
  "NotCongruent",
  "NotCupCap",
  "NotDoubleVerticalBar",
  "Notebook",
  "NotebookApply",
  "NotebookAutoSave",
  "NotebookClose",
  "NotebookConvertSettings",
  "NotebookCreate",
  "NotebookCreateReturnObject",
  "NotebookDefault",
  "NotebookDelete",
  "NotebookDirectory",
  "NotebookDynamicExpression",
  "NotebookEvaluate",
  "NotebookEventActions",
  "NotebookFileName",
  "NotebookFind",
  "NotebookFindReturnObject",
  "NotebookGet",
  "NotebookGetLayoutInformationPacket",
  "NotebookGetMisspellingsPacket",
  "NotebookImport",
  "NotebookInformation",
  "NotebookInterfaceObject",
  "NotebookLocate",
  "NotebookObject",
  "NotebookOpen",
  "NotebookOpenReturnObject",
  "NotebookPath",
  "NotebookPrint",
  "NotebookPut",
  "NotebookPutReturnObject",
  "NotebookRead",
  "NotebookResetGeneratedCells",
  "Notebooks",
  "NotebookSave",
  "NotebookSaveAs",
  "NotebookSelection",
  "NotebookSetupLayoutInformationPacket",
  "NotebooksMenu",
  "NotebookTemplate",
  "NotebookWrite",
  "NotElement",
  "NotEqualTilde",
  "NotExists",
  "NotGreater",
  "NotGreaterEqual",
  "NotGreaterFullEqual",
  "NotGreaterGreater",
  "NotGreaterLess",
  "NotGreaterSlantEqual",
  "NotGreaterTilde",
  "Nothing",
  "NotHumpDownHump",
  "NotHumpEqual",
  "NotificationFunction",
  "NotLeftTriangle",
  "NotLeftTriangleBar",
  "NotLeftTriangleEqual",
  "NotLess",
  "NotLessEqual",
  "NotLessFullEqual",
  "NotLessGreater",
  "NotLessLess",
  "NotLessSlantEqual",
  "NotLessTilde",
  "NotNestedGreaterGreater",
  "NotNestedLessLess",
  "NotPrecedes",
  "NotPrecedesEqual",
  "NotPrecedesSlantEqual",
  "NotPrecedesTilde",
  "NotReverseElement",
  "NotRightTriangle",
  "NotRightTriangleBar",
  "NotRightTriangleEqual",
  "NotSquareSubset",
  "NotSquareSubsetEqual",
  "NotSquareSuperset",
  "NotSquareSupersetEqual",
  "NotSubset",
  "NotSubsetEqual",
  "NotSucceeds",
  "NotSucceedsEqual",
  "NotSucceedsSlantEqual",
  "NotSucceedsTilde",
  "NotSuperset",
  "NotSupersetEqual",
  "NotTilde",
  "NotTildeEqual",
  "NotTildeFullEqual",
  "NotTildeTilde",
  "NotVerticalBar",
  "Now",
  "NoWhitespace",
  "NProbability",
  "NProduct",
  "NProductFactors",
  "NRoots",
  "NSolve",
  "NSum",
  "NSumTerms",
  "NuclearExplosionData",
  "NuclearReactorData",
  "Null",
  "NullRecords",
  "NullSpace",
  "NullWords",
  "Number",
  "NumberCompose",
  "NumberDecompose",
  "NumberExpand",
  "NumberFieldClassNumber",
  "NumberFieldDiscriminant",
  "NumberFieldFundamentalUnits",
  "NumberFieldIntegralBasis",
  "NumberFieldNormRepresentatives",
  "NumberFieldRegulator",
  "NumberFieldRootsOfUnity",
  "NumberFieldSignature",
  "NumberForm",
  "NumberFormat",
  "NumberLinePlot",
  "NumberMarks",
  "NumberMultiplier",
  "NumberPadding",
  "NumberPoint",
  "NumberQ",
  "NumberSeparator",
  "NumberSigns",
  "NumberString",
  "Numerator",
  "NumeratorDenominator",
  "NumericalOrder",
  "NumericalSort",
  "NumericArray",
  "NumericArrayQ",
  "NumericArrayType",
  "NumericFunction",
  "NumericQ",
  "NuttallWindow",
  "NValues",
  "NyquistGridLines",
  "NyquistPlot",
  "O",
  "ObservabilityGramian",
  "ObservabilityMatrix",
  "ObservableDecomposition",
  "ObservableModelQ",
  "OceanData",
  "Octahedron",
  "OddQ",
  "Off",
  "Offset",
  "OLEData",
  "On",
  "ONanGroupON",
  "Once",
  "OneIdentity",
  "Opacity",
  "OpacityFunction",
  "OpacityFunctionScaling",
  "Open",
  "OpenAppend",
  "Opener",
  "OpenerBox",
  "OpenerBoxOptions",
  "OpenerView",
  "OpenFunctionInspectorPacket",
  "Opening",
  "OpenRead",
  "OpenSpecialOptions",
  "OpenTemporary",
  "OpenWrite",
  "Operate",
  "OperatingSystem",
  "OperatorApplied",
  "OptimumFlowData",
  "Optional",
  "OptionalElement",
  "OptionInspectorSettings",
  "OptionQ",
  "Options",
  "OptionsPacket",
  "OptionsPattern",
  "OptionValue",
  "OptionValueBox",
  "OptionValueBoxOptions",
  "Or",
  "Orange",
  "Order",
  "OrderDistribution",
  "OrderedQ",
  "Ordering",
  "OrderingBy",
  "OrderingLayer",
  "Orderless",
  "OrderlessPatternSequence",
  "OrnsteinUhlenbeckProcess",
  "Orthogonalize",
  "OrthogonalMatrixQ",
  "Out",
  "Outer",
  "OuterPolygon",
  "OuterPolyhedron",
  "OutputAutoOverwrite",
  "OutputControllabilityMatrix",
  "OutputControllableModelQ",
  "OutputForm",
  "OutputFormData",
  "OutputGrouping",
  "OutputMathEditExpression",
  "OutputNamePacket",
  "OutputResponse",
  "OutputSizeLimit",
  "OutputStream",
  "Over",
  "OverBar",
  "OverDot",
  "Overflow",
  "OverHat",
  "Overlaps",
  "Overlay",
  "OverlayBox",
  "OverlayBoxOptions",
  "Overscript",
  "OverscriptBox",
  "OverscriptBoxOptions",
  "OverTilde",
  "OverVector",
  "OverwriteTarget",
  "OwenT",
  "OwnValues",
  "Package",
  "PackingMethod",
  "PackPaclet",
  "PacletDataRebuild",
  "PacletDirectoryAdd",
  "PacletDirectoryLoad",
  "PacletDirectoryRemove",
  "PacletDirectoryUnload",
  "PacletDisable",
  "PacletEnable",
  "PacletFind",
  "PacletFindRemote",
  "PacletInformation",
  "PacletInstall",
  "PacletInstallSubmit",
  "PacletNewerQ",
  "PacletObject",
  "PacletObjectQ",
  "PacletSite",
  "PacletSiteObject",
  "PacletSiteRegister",
  "PacletSites",
  "PacletSiteUnregister",
  "PacletSiteUpdate",
  "PacletUninstall",
  "PacletUpdate",
  "PaddedForm",
  "Padding",
  "PaddingLayer",
  "PaddingSize",
  "PadeApproximant",
  "PadLeft",
  "PadRight",
  "PageBreakAbove",
  "PageBreakBelow",
  "PageBreakWithin",
  "PageFooterLines",
  "PageFooters",
  "PageHeaderLines",
  "PageHeaders",
  "PageHeight",
  "PageRankCentrality",
  "PageTheme",
  "PageWidth",
  "Pagination",
  "PairedBarChart",
  "PairedHistogram",
  "PairedSmoothHistogram",
  "PairedTTest",
  "PairedZTest",
  "PaletteNotebook",
  "PalettePath",
  "PalindromeQ",
  "Pane",
  "PaneBox",
  "PaneBoxOptions",
  "Panel",
  "PanelBox",
  "PanelBoxOptions",
  "Paneled",
  "PaneSelector",
  "PaneSelectorBox",
  "PaneSelectorBoxOptions",
  "PaperWidth",
  "ParabolicCylinderD",
  "ParagraphIndent",
  "ParagraphSpacing",
  "ParallelArray",
  "ParallelCombine",
  "ParallelDo",
  "Parallelepiped",
  "ParallelEvaluate",
  "Parallelization",
  "Parallelize",
  "ParallelMap",
  "ParallelNeeds",
  "Parallelogram",
  "ParallelProduct",
  "ParallelSubmit",
  "ParallelSum",
  "ParallelTable",
  "ParallelTry",
  "Parameter",
  "ParameterEstimator",
  "ParameterMixtureDistribution",
  "ParameterVariables",
  "ParametricFunction",
  "ParametricNDSolve",
  "ParametricNDSolveValue",
  "ParametricPlot",
  "ParametricPlot3D",
  "ParametricRampLayer",
  "ParametricRegion",
  "ParentBox",
  "ParentCell",
  "ParentConnect",
  "ParentDirectory",
  "ParentForm",
  "Parenthesize",
  "ParentList",
  "ParentNotebook",
  "ParetoDistribution",
  "ParetoPickandsDistribution",
  "ParkData",
  "Part",
  "PartBehavior",
  "PartialCorrelationFunction",
  "PartialD",
  "ParticleAcceleratorData",
  "ParticleData",
  "Partition",
  "PartitionGranularity",
  "PartitionsP",
  "PartitionsQ",
  "PartLayer",
  "PartOfSpeech",
  "PartProtection",
  "ParzenWindow",
  "PascalDistribution",
  "PassEventsDown",
  "PassEventsUp",
  "Paste",
  "PasteAutoQuoteCharacters",
  "PasteBoxFormInlineCells",
  "PasteButton",
  "Path",
  "PathGraph",
  "PathGraphQ",
  "Pattern",
  "PatternFilling",
  "PatternSequence",
  "PatternTest",
  "PauliMatrix",
  "PaulWavelet",
  "Pause",
  "PausedTime",
  "PDF",
  "PeakDetect",
  "PeanoCurve",
  "PearsonChiSquareTest",
  "PearsonCorrelationTest",
  "PearsonDistribution",
  "PercentForm",
  "PerfectNumber",
  "PerfectNumberQ",
  "PerformanceGoal",
  "Perimeter",
  "PeriodicBoundaryCondition",
  "PeriodicInterpolation",
  "Periodogram",
  "PeriodogramArray",
  "Permanent",
  "Permissions",
  "PermissionsGroup",
  "PermissionsGroupMemberQ",
  "PermissionsGroups",
  "PermissionsKey",
  "PermissionsKeys",
  "PermutationCycles",
  "PermutationCyclesQ",
  "PermutationGroup",
  "PermutationLength",
  "PermutationList",
  "PermutationListQ",
  "PermutationMax",
  "PermutationMin",
  "PermutationOrder",
  "PermutationPower",
  "PermutationProduct",
  "PermutationReplace",
  "Permutations",
  "PermutationSupport",
  "Permute",
  "PeronaMalikFilter",
  "Perpendicular",
  "PerpendicularBisector",
  "PersistenceLocation",
  "PersistenceTime",
  "PersistentObject",
  "PersistentObjects",
  "PersistentValue",
  "PersonData",
  "PERTDistribution",
  "PetersenGraph",
  "PhaseMargins",
  "PhaseRange",
  "PhysicalSystemData",
  "Pi",
  "Pick",
  "PIDData",
  "PIDDerivativeFilter",
  "PIDFeedforward",
  "PIDTune",
  "Piecewise",
  "PiecewiseExpand",
  "PieChart",
  "PieChart3D",
  "PillaiTrace",
  "PillaiTraceTest",
  "PingTime",
  "Pink",
  "PitchRecognize",
  "Pivoting",
  "PixelConstrained",
  "PixelValue",
  "PixelValuePositions",
  "Placed",
  "Placeholder",
  "PlaceholderReplace",
  "Plain",
  "PlanarAngle",
  "PlanarGraph",
  "PlanarGraphQ",
  "PlanckRadiationLaw",
  "PlaneCurveData",
  "PlanetaryMoonData",
  "PlanetData",
  "PlantData",
  "Play",
  "PlayRange",
  "Plot",
  "Plot3D",
  "Plot3Matrix",
  "PlotDivision",
  "PlotJoined",
  "PlotLabel",
  "PlotLabels",
  "PlotLayout",
  "PlotLegends",
  "PlotMarkers",
  "PlotPoints",
  "PlotRange",
  "PlotRangeClipping",
  "PlotRangeClipPlanesStyle",
  "PlotRangePadding",
  "PlotRegion",
  "PlotStyle",
  "PlotTheme",
  "Pluralize",
  "Plus",
  "PlusMinus",
  "Pochhammer",
  "PodStates",
  "PodWidth",
  "Point",
  "Point3DBox",
  "Point3DBoxOptions",
  "PointBox",
  "PointBoxOptions",
  "PointFigureChart",
  "PointLegend",
  "PointSize",
  "PoissonConsulDistribution",
  "PoissonDistribution",
  "PoissonProcess",
  "PoissonWindow",
  "PolarAxes",
  "PolarAxesOrigin",
  "PolarGridLines",
  "PolarPlot",
  "PolarTicks",
  "PoleZeroMarkers",
  "PolyaAeppliDistribution",
  "PolyGamma",
  "Polygon",
  "Polygon3DBox",
  "Polygon3DBoxOptions",
  "PolygonalNumber",
  "PolygonAngle",
  "PolygonBox",
  "PolygonBoxOptions",
  "PolygonCoordinates",
  "PolygonDecomposition",
  "PolygonHoleScale",
  "PolygonIntersections",
  "PolygonScale",
  "Polyhedron",
  "PolyhedronAngle",
  "PolyhedronCoordinates",
  "PolyhedronData",
  "PolyhedronDecomposition",
  "PolyhedronGenus",
  "PolyLog",
  "PolynomialExtendedGCD",
  "PolynomialForm",
  "PolynomialGCD",
  "PolynomialLCM",
  "PolynomialMod",
  "PolynomialQ",
  "PolynomialQuotient",
  "PolynomialQuotientRemainder",
  "PolynomialReduce",
  "PolynomialRemainder",
  "Polynomials",
  "PoolingLayer",
  "PopupMenu",
  "PopupMenuBox",
  "PopupMenuBoxOptions",
  "PopupView",
  "PopupWindow",
  "Position",
  "PositionIndex",
  "Positive",
  "PositiveDefiniteMatrixQ",
  "PositiveIntegers",
  "PositiveRationals",
  "PositiveReals",
  "PositiveSemidefiniteMatrixQ",
  "PossibleZeroQ",
  "Postfix",
  "PostScript",
  "Power",
  "PowerDistribution",
  "PowerExpand",
  "PowerMod",
  "PowerModList",
  "PowerRange",
  "PowerSpectralDensity",
  "PowersRepresentations",
  "PowerSymmetricPolynomial",
  "Precedence",
  "PrecedenceForm",
  "Precedes",
  "PrecedesEqual",
  "PrecedesSlantEqual",
  "PrecedesTilde",
  "Precision",
  "PrecisionGoal",
  "PreDecrement",
  "Predict",
  "PredictionRoot",
  "PredictorFunction",
  "PredictorInformation",
  "PredictorMeasurements",
  "PredictorMeasurementsObject",
  "PreemptProtect",
  "PreferencesPath",
  "Prefix",
  "PreIncrement",
  "Prepend",
  "PrependLayer",
  "PrependTo",
  "PreprocessingRules",
  "PreserveColor",
  "PreserveImageOptions",
  "Previous",
  "PreviousCell",
  "PreviousDate",
  "PriceGraphDistribution",
  "PrimaryPlaceholder",
  "Prime",
  "PrimeNu",
  "PrimeOmega",
  "PrimePi",
  "PrimePowerQ",
  "PrimeQ",
  "Primes",
  "PrimeZetaP",
  "PrimitivePolynomialQ",
  "PrimitiveRoot",
  "PrimitiveRootList",
  "PrincipalComponents",
  "PrincipalValue",
  "Print",
  "PrintableASCIIQ",
  "PrintAction",
  "PrintForm",
  "PrintingCopies",
  "PrintingOptions",
  "PrintingPageRange",
  "PrintingStartingPageNumber",
  "PrintingStyleEnvironment",
  "Printout3D",
  "Printout3DPreviewer",
  "PrintPrecision",
  "PrintTemporary",
  "Prism",
  "PrismBox",
  "PrismBoxOptions",
  "PrivateCellOptions",
  "PrivateEvaluationOptions",
  "PrivateFontOptions",
  "PrivateFrontEndOptions",
  "PrivateKey",
  "PrivateNotebookOptions",
  "PrivatePaths",
  "Probability",
  "ProbabilityDistribution",
  "ProbabilityPlot",
  "ProbabilityPr",
  "ProbabilityScalePlot",
  "ProbitModelFit",
  "ProcessConnection",
  "ProcessDirectory",
  "ProcessEnvironment",
  "Processes",
  "ProcessEstimator",
  "ProcessInformation",
  "ProcessObject",
  "ProcessParameterAssumptions",
  "ProcessParameterQ",
  "ProcessStateDomain",
  "ProcessStatus",
  "ProcessTimeDomain",
  "Product",
  "ProductDistribution",
  "ProductLog",
  "ProgressIndicator",
  "ProgressIndicatorBox",
  "ProgressIndicatorBoxOptions",
  "Projection",
  "Prolog",
  "PromptForm",
  "ProofObject",
  "Properties",
  "Property",
  "PropertyList",
  "PropertyValue",
  "Proportion",
  "Proportional",
  "Protect",
  "Protected",
  "ProteinData",
  "Pruning",
  "PseudoInverse",
  "PsychrometricPropertyData",
  "PublicKey",
  "PublisherID",
  "PulsarData",
  "PunctuationCharacter",
  "Purple",
  "Put",
  "PutAppend",
  "Pyramid",
  "PyramidBox",
  "PyramidBoxOptions",
  "QBinomial",
  "QFactorial",
  "QGamma",
  "QHypergeometricPFQ",
  "QnDispersion",
  "QPochhammer",
  "QPolyGamma",
  "QRDecomposition",
  "QuadraticIrrationalQ",
  "QuadraticOptimization",
  "Quantile",
  "QuantilePlot",
  "Quantity",
  "QuantityArray",
  "QuantityDistribution",
  "QuantityForm",
  "QuantityMagnitude",
  "QuantityQ",
  "QuantityUnit",
  "QuantityVariable",
  "QuantityVariableCanonicalUnit",
  "QuantityVariableDimensions",
  "QuantityVariableIdentifier",
  "QuantityVariablePhysicalQuantity",
  "Quartics",
  "QuartileDeviation",
  "Quartiles",
  "QuartileSkewness",
  "Query",
  "QueueingNetworkProcess",
  "QueueingProcess",
  "QueueProperties",
  "Quiet",
  "Quit",
  "Quotient",
  "QuotientRemainder",
  "RadialGradientImage",
  "RadialityCentrality",
  "RadicalBox",
  "RadicalBoxOptions",
  "RadioButton",
  "RadioButtonBar",
  "RadioButtonBox",
  "RadioButtonBoxOptions",
  "Radon",
  "RadonTransform",
  "RamanujanTau",
  "RamanujanTauL",
  "RamanujanTauTheta",
  "RamanujanTauZ",
  "Ramp",
  "Random",
  "RandomChoice",
  "RandomColor",
  "RandomComplex",
  "RandomEntity",
  "RandomFunction",
  "RandomGeoPosition",
  "RandomGraph",
  "RandomImage",
  "RandomInstance",
  "RandomInteger",
  "RandomPermutation",
  "RandomPoint",
  "RandomPolygon",
  "RandomPolyhedron",
  "RandomPrime",
  "RandomReal",
  "RandomSample",
  "RandomSeed",
  "RandomSeeding",
  "RandomVariate",
  "RandomWalkProcess",
  "RandomWord",
  "Range",
  "RangeFilter",
  "RangeSpecification",
  "RankedMax",
  "RankedMin",
  "RarerProbability",
  "Raster",
  "Raster3D",
  "Raster3DBox",
  "Raster3DBoxOptions",
  "RasterArray",
  "RasterBox",
  "RasterBoxOptions",
  "Rasterize",
  "RasterSize",
  "Rational",
  "RationalFunctions",
  "Rationalize",
  "Rationals",
  "Ratios",
  "RawArray",
  "RawBoxes",
  "RawData",
  "RawMedium",
  "RayleighDistribution",
  "Re",
  "Read",
  "ReadByteArray",
  "ReadLine",
  "ReadList",
  "ReadProtected",
  "ReadString",
  "Real",
  "RealAbs",
  "RealBlockDiagonalForm",
  "RealDigits",
  "RealExponent",
  "Reals",
  "RealSign",
  "Reap",
  "RebuildPacletData",
  "RecognitionPrior",
  "RecognitionThreshold",
  "Record",
  "RecordLists",
  "RecordSeparators",
  "Rectangle",
  "RectangleBox",
  "RectangleBoxOptions",
  "RectangleChart",
  "RectangleChart3D",
  "RectangularRepeatingElement",
  "RecurrenceFilter",
  "RecurrenceTable",
  "RecurringDigitsForm",
  "Red",
  "Reduce",
  "RefBox",
  "ReferenceLineStyle",
  "ReferenceMarkers",
  "ReferenceMarkerStyle",
  "Refine",
  "ReflectionMatrix",
  "ReflectionTransform",
  "Refresh",
  "RefreshRate",
  "Region",
  "RegionBinarize",
  "RegionBoundary",
  "RegionBoundaryStyle",
  "RegionBounds",
  "RegionCentroid",
  "RegionDifference",
  "RegionDimension",
  "RegionDisjoint",
  "RegionDistance",
  "RegionDistanceFunction",
  "RegionEmbeddingDimension",
  "RegionEqual",
  "RegionFillingStyle",
  "RegionFunction",
  "RegionImage",
  "RegionIntersection",
  "RegionMeasure",
  "RegionMember",
  "RegionMemberFunction",
  "RegionMoment",
  "RegionNearest",
  "RegionNearestFunction",
  "RegionPlot",
  "RegionPlot3D",
  "RegionProduct",
  "RegionQ",
  "RegionResize",
  "RegionSize",
  "RegionSymmetricDifference",
  "RegionUnion",
  "RegionWithin",
  "RegisterExternalEvaluator",
  "RegularExpression",
  "Regularization",
  "RegularlySampledQ",
  "RegularPolygon",
  "ReIm",
  "ReImLabels",
  "ReImPlot",
  "ReImStyle",
  "Reinstall",
  "RelationalDatabase",
  "RelationGraph",
  "Release",
  "ReleaseHold",
  "ReliabilityDistribution",
  "ReliefImage",
  "ReliefPlot",
  "RemoteAuthorizationCaching",
  "RemoteConnect",
  "RemoteConnectionObject",
  "RemoteFile",
  "RemoteRun",
  "RemoteRunProcess",
  "Remove",
  "RemoveAlphaChannel",
  "RemoveAsynchronousTask",
  "RemoveAudioStream",
  "RemoveBackground",
  "RemoveChannelListener",
  "RemoveChannelSubscribers",
  "Removed",
  "RemoveDiacritics",
  "RemoveInputStreamMethod",
  "RemoveOutputStreamMethod",
  "RemoveProperty",
  "RemoveScheduledTask",
  "RemoveUsers",
  "RemoveVideoStream",
  "RenameDirectory",
  "RenameFile",
  "RenderAll",
  "RenderingOptions",
  "RenewalProcess",
  "RenkoChart",
  "RepairMesh",
  "Repeated",
  "RepeatedNull",
  "RepeatedString",
  "RepeatedTiming",
  "RepeatingElement",
  "Replace",
  "ReplaceAll",
  "ReplaceHeldPart",
  "ReplaceImageValue",
  "ReplaceList",
  "ReplacePart",
  "ReplacePixelValue",
  "ReplaceRepeated",
  "ReplicateLayer",
  "RequiredPhysicalQuantities",
  "Resampling",
  "ResamplingAlgorithmData",
  "ResamplingMethod",
  "Rescale",
  "RescalingTransform",
  "ResetDirectory",
  "ResetMenusPacket",
  "ResetScheduledTask",
  "ReshapeLayer",
  "Residue",
  "ResizeLayer",
  "Resolve",
  "ResourceAcquire",
  "ResourceData",
  "ResourceFunction",
  "ResourceObject",
  "ResourceRegister",
  "ResourceRemove",
  "ResourceSearch",
  "ResourceSubmissionObject",
  "ResourceSubmit",
  "ResourceSystemBase",
  "ResourceSystemPath",
  "ResourceUpdate",
  "ResourceVersion",
  "ResponseForm",
  "Rest",
  "RestartInterval",
  "Restricted",
  "Resultant",
  "ResumePacket",
  "Return",
  "ReturnEntersInput",
  "ReturnExpressionPacket",
  "ReturnInputFormPacket",
  "ReturnPacket",
  "ReturnReceiptFunction",
  "ReturnTextPacket",
  "Reverse",
  "ReverseApplied",
  "ReverseBiorthogonalSplineWavelet",
  "ReverseElement",
  "ReverseEquilibrium",
  "ReverseGraph",
  "ReverseSort",
  "ReverseSortBy",
  "ReverseUpEquilibrium",
  "RevolutionAxis",
  "RevolutionPlot3D",
  "RGBColor",
  "RiccatiSolve",
  "RiceDistribution",
  "RidgeFilter",
  "RiemannR",
  "RiemannSiegelTheta",
  "RiemannSiegelZ",
  "RiemannXi",
  "Riffle",
  "Right",
  "RightArrow",
  "RightArrowBar",
  "RightArrowLeftArrow",
  "RightComposition",
  "RightCosetRepresentative",
  "RightDownTeeVector",
  "RightDownVector",
  "RightDownVectorBar",
  "RightTee",
  "RightTeeArrow",
  "RightTeeVector",
  "RightTriangle",
  "RightTriangleBar",
  "RightTriangleEqual",
  "RightUpDownVector",
  "RightUpTeeVector",
  "RightUpVector",
  "RightUpVectorBar",
  "RightVector",
  "RightVectorBar",
  "RiskAchievementImportance",
  "RiskReductionImportance",
  "RogersTanimotoDissimilarity",
  "RollPitchYawAngles",
  "RollPitchYawMatrix",
  "RomanNumeral",
  "Root",
  "RootApproximant",
  "RootIntervals",
  "RootLocusPlot",
  "RootMeanSquare",
  "RootOfUnityQ",
  "RootReduce",
  "Roots",
  "RootSum",
  "Rotate",
  "RotateLabel",
  "RotateLeft",
  "RotateRight",
  "RotationAction",
  "RotationBox",
  "RotationBoxOptions",
  "RotationMatrix",
  "RotationTransform",
  "Round",
  "RoundImplies",
  "RoundingRadius",
  "Row",
  "RowAlignments",
  "RowBackgrounds",
  "RowBox",
  "RowHeights",
  "RowLines",
  "RowMinHeight",
  "RowReduce",
  "RowsEqual",
  "RowSpacings",
  "RSolve",
  "RSolveValue",
  "RudinShapiro",
  "RudvalisGroupRu",
  "Rule",
  "RuleCondition",
  "RuleDelayed",
  "RuleForm",
  "RulePlot",
  "RulerUnits",
  "Run",
  "RunProcess",
  "RunScheduledTask",
  "RunThrough",
  "RuntimeAttributes",
  "RuntimeOptions",
  "RussellRaoDissimilarity",
  "SameQ",
  "SameTest",
  "SameTestProperties",
  "SampledEntityClass",
  "SampleDepth",
  "SampledSoundFunction",
  "SampledSoundList",
  "SampleRate",
  "SamplingPeriod",
  "SARIMAProcess",
  "SARMAProcess",
  "SASTriangle",
  "SatelliteData",
  "SatisfiabilityCount",
  "SatisfiabilityInstances",
  "SatisfiableQ",
  "Saturday",
  "Save",
  "Saveable",
  "SaveAutoDelete",
  "SaveConnection",
  "SaveDefinitions",
  "SavitzkyGolayMatrix",
  "SawtoothWave",
  "Scale",
  "Scaled",
  "ScaleDivisions",
  "ScaledMousePosition",
  "ScaleOrigin",
  "ScalePadding",
  "ScaleRanges",
  "ScaleRangeStyle",
  "ScalingFunctions",
  "ScalingMatrix",
  "ScalingTransform",
  "Scan",
  "ScheduledTask",
  "ScheduledTaskActiveQ",
  "ScheduledTaskInformation",
  "ScheduledTaskInformationData",
  "ScheduledTaskObject",
  "ScheduledTasks",
  "SchurDecomposition",
  "ScientificForm",
  "ScientificNotationThreshold",
  "ScorerGi",
  "ScorerGiPrime",
  "ScorerHi",
  "ScorerHiPrime",
  "ScreenRectangle",
  "ScreenStyleEnvironment",
  "ScriptBaselineShifts",
  "ScriptForm",
  "ScriptLevel",
  "ScriptMinSize",
  "ScriptRules",
  "ScriptSizeMultipliers",
  "Scrollbars",
  "ScrollingOptions",
  "ScrollPosition",
  "SearchAdjustment",
  "SearchIndexObject",
  "SearchIndices",
  "SearchQueryString",
  "SearchResultObject",
  "Sec",
  "Sech",
  "SechDistribution",
  "SecondOrderConeOptimization",
  "SectionGrouping",
  "SectorChart",
  "SectorChart3D",
  "SectorOrigin",
  "SectorSpacing",
  "SecuredAuthenticationKey",
  "SecuredAuthenticationKeys",
  "SeedRandom",
  "Select",
  "Selectable",
  "SelectComponents",
  "SelectedCells",
  "SelectedNotebook",
  "SelectFirst",
  "Selection",
  "SelectionAnimate",
  "SelectionCell",
  "SelectionCellCreateCell",
  "SelectionCellDefaultStyle",
  "SelectionCellParentStyle",
  "SelectionCreateCell",
  "SelectionDebuggerTag",
  "SelectionDuplicateCell",
  "SelectionEvaluate",
  "SelectionEvaluateCreateCell",
  "SelectionMove",
  "SelectionPlaceholder",
  "SelectionSetStyle",
  "SelectWithContents",
  "SelfLoops",
  "SelfLoopStyle",
  "SemanticImport",
  "SemanticImportString",
  "SemanticInterpretation",
  "SemialgebraicComponentInstances",
  "SemidefiniteOptimization",
  "SendMail",
  "SendMessage",
  "Sequence",
  "SequenceAlignment",
  "SequenceAttentionLayer",
  "SequenceCases",
  "SequenceCount",
  "SequenceFold",
  "SequenceFoldList",
  "SequenceForm",
  "SequenceHold",
  "SequenceLastLayer",
  "SequenceMostLayer",
  "SequencePosition",
  "SequencePredict",
  "SequencePredictorFunction",
  "SequenceReplace",
  "SequenceRestLayer",
  "SequenceReverseLayer",
  "SequenceSplit",
  "Series",
  "SeriesCoefficient",
  "SeriesData",
  "SeriesTermGoal",
  "ServiceConnect",
  "ServiceDisconnect",
  "ServiceExecute",
  "ServiceObject",
  "ServiceRequest",
  "ServiceResponse",
  "ServiceSubmit",
  "SessionSubmit",
  "SessionTime",
  "Set",
  "SetAccuracy",
  "SetAlphaChannel",
  "SetAttributes",
  "Setbacks",
  "SetBoxFormNamesPacket",
  "SetCloudDirectory",
  "SetCookies",
  "SetDelayed",
  "SetDirectory",
  "SetEnvironment",
  "SetEvaluationNotebook",
  "SetFileDate",
  "SetFileLoadingContext",
  "SetNotebookStatusLine",
  "SetOptions",
  "SetOptionsPacket",
  "SetPermissions",
  "SetPrecision",
  "SetProperty",
  "SetSecuredAuthenticationKey",
  "SetSelectedNotebook",
  "SetSharedFunction",
  "SetSharedVariable",
  "SetSpeechParametersPacket",
  "SetStreamPosition",
  "SetSystemModel",
  "SetSystemOptions",
  "Setter",
  "SetterBar",
  "SetterBox",
  "SetterBoxOptions",
  "Setting",
  "SetUsers",
  "SetValue",
  "Shading",
  "Shallow",
  "ShannonWavelet",
  "ShapiroWilkTest",
  "Share",
  "SharingList",
  "Sharpen",
  "ShearingMatrix",
  "ShearingTransform",
  "ShellRegion",
  "ShenCastanMatrix",
  "ShiftedGompertzDistribution",
  "ShiftRegisterSequence",
  "Short",
  "ShortDownArrow",
  "Shortest",
  "ShortestMatch",
  "ShortestPathFunction",
  "ShortLeftArrow",
  "ShortRightArrow",
  "ShortTimeFourier",
  "ShortTimeFourierData",
  "ShortUpArrow",
  "Show",
  "ShowAutoConvert",
  "ShowAutoSpellCheck",
  "ShowAutoStyles",
  "ShowCellBracket",
  "ShowCellLabel",
  "ShowCellTags",
  "ShowClosedCellArea",
  "ShowCodeAssist",
  "ShowContents",
  "ShowControls",
  "ShowCursorTracker",
  "ShowGroupOpenCloseIcon",
  "ShowGroupOpener",
  "ShowInvisibleCharacters",
  "ShowPageBreaks",
  "ShowPredictiveInterface",
  "ShowSelection",
  "ShowShortBoxForm",
  "ShowSpecialCharacters",
  "ShowStringCharacters",
  "ShowSyntaxStyles",
  "ShrinkingDelay",
  "ShrinkWrapBoundingBox",
  "SiderealTime",
  "SiegelTheta",
  "SiegelTukeyTest",
  "SierpinskiCurve",
  "SierpinskiMesh",
  "Sign",
  "Signature",
  "SignedRankTest",
  "SignedRegionDistance",
  "SignificanceLevel",
  "SignPadding",
  "SignTest",
  "SimilarityRules",
  "SimpleGraph",
  "SimpleGraphQ",
  "SimplePolygonQ",
  "SimplePolyhedronQ",
  "Simplex",
  "Simplify",
  "Sin",
  "Sinc",
  "SinghMaddalaDistribution",
  "SingleEvaluation",
  "SingleLetterItalics",
  "SingleLetterStyle",
  "SingularValueDecomposition",
  "SingularValueList",
  "SingularValuePlot",
  "SingularValues",
  "Sinh",
  "SinhIntegral",
  "SinIntegral",
  "SixJSymbol",
  "Skeleton",
  "SkeletonTransform",
  "SkellamDistribution",
  "Skewness",
  "SkewNormalDistribution",
  "SkinStyle",
  "Skip",
  "SliceContourPlot3D",
  "SliceDensityPlot3D",
  "SliceDistribution",
  "SliceVectorPlot3D",
  "Slider",
  "Slider2D",
  "Slider2DBox",
  "Slider2DBoxOptions",
  "SliderBox",
  "SliderBoxOptions",
  "SlideView",
  "Slot",
  "SlotSequence",
  "Small",
  "SmallCircle",
  "Smaller",
  "SmithDecomposition",
  "SmithDelayCompensator",
  "SmithWatermanSimilarity",
  "SmoothDensityHistogram",
  "SmoothHistogram",
  "SmoothHistogram3D",
  "SmoothKernelDistribution",
  "SnDispersion",
  "Snippet",
  "SnubPolyhedron",
  "SocialMediaData",
  "Socket",
  "SocketConnect",
  "SocketListen",
  "SocketListener",
  "SocketObject",
  "SocketOpen",
  "SocketReadMessage",
  "SocketReadyQ",
  "Sockets",
  "SocketWaitAll",
  "SocketWaitNext",
  "SoftmaxLayer",
  "SokalSneathDissimilarity",
  "SolarEclipse",
  "SolarSystemFeatureData",
  "SolidAngle",
  "SolidData",
  "SolidRegionQ",
  "Solve",
  "SolveAlways",
  "SolveDelayed",
  "Sort",
  "SortBy",
  "SortedBy",
  "SortedEntityClass",
  "Sound",
  "SoundAndGraphics",
  "SoundNote",
  "SoundVolume",
  "SourceLink",
  "Sow",
  "Space",
  "SpaceCurveData",
  "SpaceForm",
  "Spacer",
  "Spacings",
  "Span",
  "SpanAdjustments",
  "SpanCharacterRounding",
  "SpanFromAbove",
  "SpanFromBoth",
  "SpanFromLeft",
  "SpanLineThickness",
  "SpanMaxSize",
  "SpanMinSize",
  "SpanningCharacters",
  "SpanSymmetric",
  "SparseArray",
  "SpatialGraphDistribution",
  "SpatialMedian",
  "SpatialTransformationLayer",
  "Speak",
  "SpeakerMatchQ",
  "SpeakTextPacket",
  "SpearmanRankTest",
  "SpearmanRho",
  "SpeciesData",
  "SpecificityGoal",
  "SpectralLineData",
  "Spectrogram",
  "SpectrogramArray",
  "Specularity",
  "SpeechCases",
  "SpeechInterpreter",
  "SpeechRecognize",
  "SpeechSynthesize",
  "SpellingCorrection",
  "SpellingCorrectionList",
  "SpellingDictionaries",
  "SpellingDictionariesPath",
  "SpellingOptions",
  "SpellingSuggestionsPacket",
  "Sphere",
  "SphereBox",
  "SpherePoints",
  "SphericalBesselJ",
  "SphericalBesselY",
  "SphericalHankelH1",
  "SphericalHankelH2",
  "SphericalHarmonicY",
  "SphericalPlot3D",
  "SphericalRegion",
  "SphericalShell",
  "SpheroidalEigenvalue",
  "SpheroidalJoiningFactor",
  "SpheroidalPS",
  "SpheroidalPSPrime",
  "SpheroidalQS",
  "SpheroidalQSPrime",
  "SpheroidalRadialFactor",
  "SpheroidalS1",
  "SpheroidalS1Prime",
  "SpheroidalS2",
  "SpheroidalS2Prime",
  "Splice",
  "SplicedDistribution",
  "SplineClosed",
  "SplineDegree",
  "SplineKnots",
  "SplineWeights",
  "Split",
  "SplitBy",
  "SpokenString",
  "Sqrt",
  "SqrtBox",
  "SqrtBoxOptions",
  "Square",
  "SquaredEuclideanDistance",
  "SquareFreeQ",
  "SquareIntersection",
  "SquareMatrixQ",
  "SquareRepeatingElement",
  "SquaresR",
  "SquareSubset",
  "SquareSubsetEqual",
  "SquareSuperset",
  "SquareSupersetEqual",
  "SquareUnion",
  "SquareWave",
  "SSSTriangle",
  "StabilityMargins",
  "StabilityMarginsStyle",
  "StableDistribution",
  "Stack",
  "StackBegin",
  "StackComplete",
  "StackedDateListPlot",
  "StackedListPlot",
  "StackInhibit",
  "StadiumShape",
  "StandardAtmosphereData",
  "StandardDeviation",
  "StandardDeviationFilter",
  "StandardForm",
  "Standardize",
  "Standardized",
  "StandardOceanData",
  "StandbyDistribution",
  "Star",
  "StarClusterData",
  "StarData",
  "StarGraph",
  "StartAsynchronousTask",
  "StartExternalSession",
  "StartingStepSize",
  "StartOfLine",
  "StartOfString",
  "StartProcess",
  "StartScheduledTask",
  "StartupSound",
  "StartWebSession",
  "StateDimensions",
  "StateFeedbackGains",
  "StateOutputEstimator",
  "StateResponse",
  "StateSpaceModel",
  "StateSpaceRealization",
  "StateSpaceTransform",
  "StateTransformationLinearize",
  "StationaryDistribution",
  "StationaryWaveletPacketTransform",
  "StationaryWaveletTransform",
  "StatusArea",
  "StatusCentrality",
  "StepMonitor",
  "StereochemistryElements",
  "StieltjesGamma",
  "StippleShading",
  "StirlingS1",
  "StirlingS2",
  "StopAsynchronousTask",
  "StoppingPowerData",
  "StopScheduledTask",
  "StrataVariables",
  "StratonovichProcess",
  "StreamColorFunction",
  "StreamColorFunctionScaling",
  "StreamDensityPlot",
  "StreamMarkers",
  "StreamPlot",
  "StreamPoints",
  "StreamPosition",
  "Streams",
  "StreamScale",
  "StreamStyle",
  "String",
  "StringBreak",
  "StringByteCount",
  "StringCases",
  "StringContainsQ",
  "StringCount",
  "StringDelete",
  "StringDrop",
  "StringEndsQ",
  "StringExpression",
  "StringExtract",
  "StringForm",
  "StringFormat",
  "StringFreeQ",
  "StringInsert",
  "StringJoin",
  "StringLength",
  "StringMatchQ",
  "StringPadLeft",
  "StringPadRight",
  "StringPart",
  "StringPartition",
  "StringPosition",
  "StringQ",
  "StringRepeat",
  "StringReplace",
  "StringReplaceList",
  "StringReplacePart",
  "StringReverse",
  "StringRiffle",
  "StringRotateLeft",
  "StringRotateRight",
  "StringSkeleton",
  "StringSplit",
  "StringStartsQ",
  "StringTake",
  "StringTemplate",
  "StringToByteArray",
  "StringToStream",
  "StringTrim",
  "StripBoxes",
  "StripOnInput",
  "StripWrapperBoxes",
  "StrokeForm",
  "StructuralImportance",
  "StructuredArray",
  "StructuredArrayHeadQ",
  "StructuredSelection",
  "StruveH",
  "StruveL",
  "Stub",
  "StudentTDistribution",
  "Style",
  "StyleBox",
  "StyleBoxAutoDelete",
  "StyleData",
  "StyleDefinitions",
  "StyleForm",
  "StyleHints",
  "StyleKeyMapping",
  "StyleMenuListing",
  "StyleNameDialogSettings",
  "StyleNames",
  "StylePrint",
  "StyleSheetPath",
  "Subdivide",
  "Subfactorial",
  "Subgraph",
  "SubMinus",
  "SubPlus",
  "SubresultantPolynomialRemainders",
  "SubresultantPolynomials",
  "Subresultants",
  "Subscript",
  "SubscriptBox",
  "SubscriptBoxOptions",
  "Subscripted",
  "Subsequences",
  "Subset",
  "SubsetCases",
  "SubsetCount",
  "SubsetEqual",
  "SubsetMap",
  "SubsetPosition",
  "SubsetQ",
  "SubsetReplace",
  "Subsets",
  "SubStar",
  "SubstitutionSystem",
  "Subsuperscript",
  "SubsuperscriptBox",
  "SubsuperscriptBoxOptions",
  "SubtitleEncoding",
  "SubtitleTracks",
  "Subtract",
  "SubtractFrom",
  "SubtractSides",
  "SubValues",
  "Succeeds",
  "SucceedsEqual",
  "SucceedsSlantEqual",
  "SucceedsTilde",
  "Success",
  "SuchThat",
  "Sum",
  "SumConvergence",
  "SummationLayer",
  "Sunday",
  "SunPosition",
  "Sunrise",
  "Sunset",
  "SuperDagger",
  "SuperMinus",
  "SupernovaData",
  "SuperPlus",
  "Superscript",
  "SuperscriptBox",
  "SuperscriptBoxOptions",
  "Superset",
  "SupersetEqual",
  "SuperStar",
  "Surd",
  "SurdForm",
  "SurfaceAppearance",
  "SurfaceArea",
  "SurfaceColor",
  "SurfaceData",
  "SurfaceGraphics",
  "SurvivalDistribution",
  "SurvivalFunction",
  "SurvivalModel",
  "SurvivalModelFit",
  "SuspendPacket",
  "SuzukiDistribution",
  "SuzukiGroupSuz",
  "SwatchLegend",
  "Switch",
  "Symbol",
  "SymbolName",
  "SymletWavelet",
  "Symmetric",
  "SymmetricGroup",
  "SymmetricKey",
  "SymmetricMatrixQ",
  "SymmetricPolynomial",
  "SymmetricReduction",
  "Symmetrize",
  "SymmetrizedArray",
  "SymmetrizedArrayRules",
  "SymmetrizedDependentComponents",
  "SymmetrizedIndependentComponents",
  "SymmetrizedReplacePart",
  "SynchronousInitialization",
  "SynchronousUpdating",
  "Synonyms",
  "Syntax",
  "SyntaxForm",
  "SyntaxInformation",
  "SyntaxLength",
  "SyntaxPacket",
  "SyntaxQ",
  "SynthesizeMissingValues",
  "SystemCredential",
  "SystemCredentialData",
  "SystemCredentialKey",
  "SystemCredentialKeys",
  "SystemCredentialStoreObject",
  "SystemDialogInput",
  "SystemException",
  "SystemGet",
  "SystemHelpPath",
  "SystemInformation",
  "SystemInformationData",
  "SystemInstall",
  "SystemModel",
  "SystemModeler",
  "SystemModelExamples",
  "SystemModelLinearize",
  "SystemModelParametricSimulate",
  "SystemModelPlot",
  "SystemModelProgressReporting",
  "SystemModelReliability",
  "SystemModels",
  "SystemModelSimulate",
  "SystemModelSimulateSensitivity",
  "SystemModelSimulationData",
  "SystemOpen",
  "SystemOptions",
  "SystemProcessData",
  "SystemProcesses",
  "SystemsConnectionsModel",
  "SystemsModelDelay",
  "SystemsModelDelayApproximate",
  "SystemsModelDelete",
  "SystemsModelDimensions",
  "SystemsModelExtract",
  "SystemsModelFeedbackConnect",
  "SystemsModelLabels",
  "SystemsModelLinearity",
  "SystemsModelMerge",
  "SystemsModelOrder",
  "SystemsModelParallelConnect",
  "SystemsModelSeriesConnect",
  "SystemsModelStateFeedbackConnect",
  "SystemsModelVectorRelativeOrders",
  "SystemStub",
  "SystemTest",
  "Tab",
  "TabFilling",
  "Table",
  "TableAlignments",
  "TableDepth",
  "TableDirections",
  "TableForm",
  "TableHeadings",
  "TableSpacing",
  "TableView",
  "TableViewBox",
  "TableViewBoxBackground",
  "TableViewBoxItemSize",
  "TableViewBoxOptions",
  "TabSpacings",
  "TabView",
  "TabViewBox",
  "TabViewBoxOptions",
  "TagBox",
  "TagBoxNote",
  "TagBoxOptions",
  "TaggingRules",
  "TagSet",
  "TagSetDelayed",
  "TagStyle",
  "TagUnset",
  "Take",
  "TakeDrop",
  "TakeLargest",
  "TakeLargestBy",
  "TakeList",
  "TakeSmallest",
  "TakeSmallestBy",
  "TakeWhile",
  "Tally",
  "Tan",
  "Tanh",
  "TargetDevice",
  "TargetFunctions",
  "TargetSystem",
  "TargetUnits",
  "TaskAbort",
  "TaskExecute",
  "TaskObject",
  "TaskRemove",
  "TaskResume",
  "Tasks",
  "TaskSuspend",
  "TaskWait",
  "TautologyQ",
  "TelegraphProcess",
  "TemplateApply",
  "TemplateArgBox",
  "TemplateBox",
  "TemplateBoxOptions",
  "TemplateEvaluate",
  "TemplateExpression",
  "TemplateIf",
  "TemplateObject",
  "TemplateSequence",
  "TemplateSlot",
  "TemplateSlotSequence",
  "TemplateUnevaluated",
  "TemplateVerbatim",
  "TemplateWith",
  "TemporalData",
  "TemporalRegularity",
  "Temporary",
  "TemporaryVariable",
  "TensorContract",
  "TensorDimensions",
  "TensorExpand",
  "TensorProduct",
  "TensorQ",
  "TensorRank",
  "TensorReduce",
  "TensorSymmetry",
  "TensorTranspose",
  "TensorWedge",
  "TestID",
  "TestReport",
  "TestReportObject",
  "TestResultObject",
  "Tetrahedron",
  "TetrahedronBox",
  "TetrahedronBoxOptions",
  "TeXForm",
  "TeXSave",
  "Text",
  "Text3DBox",
  "Text3DBoxOptions",
  "TextAlignment",
  "TextBand",
  "TextBoundingBox",
  "TextBox",
  "TextCases",
  "TextCell",
  "TextClipboardType",
  "TextContents",
  "TextData",
  "TextElement",
  "TextForm",
  "TextGrid",
  "TextJustification",
  "TextLine",
  "TextPacket",
  "TextParagraph",
  "TextPosition",
  "TextRecognize",
  "TextSearch",
  "TextSearchReport",
  "TextSentences",
  "TextString",
  "TextStructure",
  "TextStyle",
  "TextTranslation",
  "Texture",
  "TextureCoordinateFunction",
  "TextureCoordinateScaling",
  "TextWords",
  "Therefore",
  "ThermodynamicData",
  "ThermometerGauge",
  "Thick",
  "Thickness",
  "Thin",
  "Thinning",
  "ThisLink",
  "ThompsonGroupTh",
  "Thread",
  "ThreadingLayer",
  "ThreeJSymbol",
  "Threshold",
  "Through",
  "Throw",
  "ThueMorse",
  "Thumbnail",
  "Thursday",
  "Ticks",
  "TicksStyle",
  "TideData",
  "Tilde",
  "TildeEqual",
  "TildeFullEqual",
  "TildeTilde",
  "TimeConstrained",
  "TimeConstraint",
  "TimeDirection",
  "TimeFormat",
  "TimeGoal",
  "TimelinePlot",
  "TimeObject",
  "TimeObjectQ",
  "TimeRemaining",
  "Times",
  "TimesBy",
  "TimeSeries",
  "TimeSeriesAggregate",
  "TimeSeriesForecast",
  "TimeSeriesInsert",
  "TimeSeriesInvertibility",
  "TimeSeriesMap",
  "TimeSeriesMapThread",
  "TimeSeriesModel",
  "TimeSeriesModelFit",
  "TimeSeriesResample",
  "TimeSeriesRescale",
  "TimeSeriesShift",
  "TimeSeriesThread",
  "TimeSeriesWindow",
  "TimeUsed",
  "TimeValue",
  "TimeWarpingCorrespondence",
  "TimeWarpingDistance",
  "TimeZone",
  "TimeZoneConvert",
  "TimeZoneOffset",
  "Timing",
  "Tiny",
  "TitleGrouping",
  "TitsGroupT",
  "ToBoxes",
  "ToCharacterCode",
  "ToColor",
  "ToContinuousTimeModel",
  "ToDate",
  "Today",
  "ToDiscreteTimeModel",
  "ToEntity",
  "ToeplitzMatrix",
  "ToExpression",
  "ToFileName",
  "Together",
  "Toggle",
  "ToggleFalse",
  "Toggler",
  "TogglerBar",
  "TogglerBox",
  "TogglerBoxOptions",
  "ToHeldExpression",
  "ToInvertibleTimeSeries",
  "TokenWords",
  "Tolerance",
  "ToLowerCase",
  "Tomorrow",
  "ToNumberField",
  "TooBig",
  "Tooltip",
  "TooltipBox",
  "TooltipBoxOptions",
  "TooltipDelay",
  "TooltipStyle",
  "ToonShading",
  "Top",
  "TopHatTransform",
  "ToPolarCoordinates",
  "TopologicalSort",
  "ToRadicals",
  "ToRules",
  "ToSphericalCoordinates",
  "ToString",
  "Total",
  "TotalHeight",
  "TotalLayer",
  "TotalVariationFilter",
  "TotalWidth",
  "TouchPosition",
  "TouchscreenAutoZoom",
  "TouchscreenControlPlacement",
  "ToUpperCase",
  "Tr",
  "Trace",
  "TraceAbove",
  "TraceAction",
  "TraceBackward",
  "TraceDepth",
  "TraceDialog",
  "TraceForward",
  "TraceInternal",
  "TraceLevel",
  "TraceOff",
  "TraceOn",
  "TraceOriginal",
  "TracePrint",
  "TraceScan",
  "TrackedSymbols",
  "TrackingFunction",
  "TracyWidomDistribution",
  "TradingChart",
  "TraditionalForm",
  "TraditionalFunctionNotation",
  "TraditionalNotation",
  "TraditionalOrder",
  "TrainingProgressCheckpointing",
  "TrainingProgressFunction",
  "TrainingProgressMeasurements",
  "TrainingProgressReporting",
  "TrainingStoppingCriterion",
  "TrainingUpdateSchedule",
  "TransferFunctionCancel",
  "TransferFunctionExpand",
  "TransferFunctionFactor",
  "TransferFunctionModel",
  "TransferFunctionPoles",
  "TransferFunctionTransform",
  "TransferFunctionZeros",
  "TransformationClass",
  "TransformationFunction",
  "TransformationFunctions",
  "TransformationMatrix",
  "TransformedDistribution",
  "TransformedField",
  "TransformedProcess",
  "TransformedRegion",
  "TransitionDirection",
  "TransitionDuration",
  "TransitionEffect",
  "TransitiveClosureGraph",
  "TransitiveReductionGraph",
  "Translate",
  "TranslationOptions",
  "TranslationTransform",
  "Transliterate",
  "Transparent",
  "TransparentColor",
  "Transpose",
  "TransposeLayer",
  "TrapSelection",
  "TravelDirections",
  "TravelDirectionsData",
  "TravelDistance",
  "TravelDistanceList",
  "TravelMethod",
  "TravelTime",
  "TreeForm",
  "TreeGraph",
  "TreeGraphQ",
  "TreePlot",
  "TrendStyle",
  "Triangle",
  "TriangleCenter",
  "TriangleConstruct",
  "TriangleMeasurement",
  "TriangleWave",
  "TriangularDistribution",
  "TriangulateMesh",
  "Trig",
  "TrigExpand",
  "TrigFactor",
  "TrigFactorList",
  "Trigger",
  "TrigReduce",
  "TrigToExp",
  "TrimmedMean",
  "TrimmedVariance",
  "TropicalStormData",
  "True",
  "TrueQ",
  "TruncatedDistribution",
  "TruncatedPolyhedron",
  "TsallisQExponentialDistribution",
  "TsallisQGaussianDistribution",
  "TTest",
  "Tube",
  "TubeBezierCurveBox",
  "TubeBezierCurveBoxOptions",
  "TubeBox",
  "TubeBoxOptions",
  "TubeBSplineCurveBox",
  "TubeBSplineCurveBoxOptions",
  "Tuesday",
  "TukeyLambdaDistribution",
  "TukeyWindow",
  "TunnelData",
  "Tuples",
  "TuranGraph",
  "TuringMachine",
  "TuttePolynomial",
  "TwoWayRule",
  "Typed",
  "TypeSpecifier",
  "UnateQ",
  "Uncompress",
  "UnconstrainedParameters",
  "Undefined",
  "UnderBar",
  "Underflow",
  "Underlined",
  "Underoverscript",
  "UnderoverscriptBox",
  "UnderoverscriptBoxOptions",
  "Underscript",
  "UnderscriptBox",
  "UnderscriptBoxOptions",
  "UnderseaFeatureData",
  "UndirectedEdge",
  "UndirectedGraph",
  "UndirectedGraphQ",
  "UndoOptions",
  "UndoTrackedVariables",
  "Unequal",
  "UnequalTo",
  "Unevaluated",
  "UniformDistribution",
  "UniformGraphDistribution",
  "UniformPolyhedron",
  "UniformSumDistribution",
  "Uninstall",
  "Union",
  "UnionedEntityClass",
  "UnionPlus",
  "Unique",
  "UnitaryMatrixQ",
  "UnitBox",
  "UnitConvert",
  "UnitDimensions",
  "Unitize",
  "UnitRootTest",
  "UnitSimplify",
  "UnitStep",
  "UnitSystem",
  "UnitTriangle",
  "UnitVector",
  "UnitVectorLayer",
  "UnityDimensions",
  "UniverseModelData",
  "UniversityData",
  "UnixTime",
  "Unprotect",
  "UnregisterExternalEvaluator",
  "UnsameQ",
  "UnsavedVariables",
  "Unset",
  "UnsetShared",
  "UntrackedVariables",
  "Up",
  "UpArrow",
  "UpArrowBar",
  "UpArrowDownArrow",
  "Update",
  "UpdateDynamicObjects",
  "UpdateDynamicObjectsSynchronous",
  "UpdateInterval",
  "UpdatePacletSites",
  "UpdateSearchIndex",
  "UpDownArrow",
  "UpEquilibrium",
  "UpperCaseQ",
  "UpperLeftArrow",
  "UpperRightArrow",
  "UpperTriangularize",
  "UpperTriangularMatrixQ",
  "Upsample",
  "UpSet",
  "UpSetDelayed",
  "UpTee",
  "UpTeeArrow",
  "UpTo",
  "UpValues",
  "URL",
  "URLBuild",
  "URLDecode",
  "URLDispatcher",
  "URLDownload",
  "URLDownloadSubmit",
  "URLEncode",
  "URLExecute",
  "URLExpand",
  "URLFetch",
  "URLFetchAsynchronous",
  "URLParse",
  "URLQueryDecode",
  "URLQueryEncode",
  "URLRead",
  "URLResponseTime",
  "URLSave",
  "URLSaveAsynchronous",
  "URLShorten",
  "URLSubmit",
  "UseGraphicsRange",
  "UserDefinedWavelet",
  "Using",
  "UsingFrontEnd",
  "UtilityFunction",
  "V2Get",
  "ValenceErrorHandling",
  "ValidationLength",
  "ValidationSet",
  "Value",
  "ValueBox",
  "ValueBoxOptions",
  "ValueDimensions",
  "ValueForm",
  "ValuePreprocessingFunction",
  "ValueQ",
  "Values",
  "ValuesData",
  "Variables",
  "Variance",
  "VarianceEquivalenceTest",
  "VarianceEstimatorFunction",
  "VarianceGammaDistribution",
  "VarianceTest",
  "VectorAngle",
  "VectorAround",
  "VectorAspectRatio",
  "VectorColorFunction",
  "VectorColorFunctionScaling",
  "VectorDensityPlot",
  "VectorGlyphData",
  "VectorGreater",
  "VectorGreaterEqual",
  "VectorLess",
  "VectorLessEqual",
  "VectorMarkers",
  "VectorPlot",
  "VectorPlot3D",
  "VectorPoints",
  "VectorQ",
  "VectorRange",
  "Vectors",
  "VectorScale",
  "VectorScaling",
  "VectorSizes",
  "VectorStyle",
  "Vee",
  "Verbatim",
  "Verbose",
  "VerboseConvertToPostScriptPacket",
  "VerificationTest",
  "VerifyConvergence",
  "VerifyDerivedKey",
  "VerifyDigitalSignature",
  "VerifyFileSignature",
  "VerifyInterpretation",
  "VerifySecurityCertificates",
  "VerifySolutions",
  "VerifyTestAssumptions",
  "Version",
  "VersionedPreferences",
  "VersionNumber",
  "VertexAdd",
  "VertexCapacity",
  "VertexColors",
  "VertexComponent",
  "VertexConnectivity",
  "VertexContract",
  "VertexCoordinateRules",
  "VertexCoordinates",
  "VertexCorrelationSimilarity",
  "VertexCosineSimilarity",
  "VertexCount",
  "VertexCoverQ",
  "VertexDataCoordinates",
  "VertexDegree",
  "VertexDelete",
  "VertexDiceSimilarity",
  "VertexEccentricity",
  "VertexInComponent",
  "VertexInDegree",
  "VertexIndex",
  "VertexJaccardSimilarity",
  "VertexLabeling",
  "VertexLabels",
  "VertexLabelStyle",
  "VertexList",
  "VertexNormals",
  "VertexOutComponent",
  "VertexOutDegree",
  "VertexQ",
  "VertexRenderingFunction",
  "VertexReplace",
  "VertexShape",
  "VertexShapeFunction",
  "VertexSize",
  "VertexStyle",
  "VertexTextureCoordinates",
  "VertexWeight",
  "VertexWeightedGraphQ",
  "Vertical",
  "VerticalBar",
  "VerticalForm",
  "VerticalGauge",
  "VerticalSeparator",
  "VerticalSlider",
  "VerticalTilde",
  "Video",
  "VideoEncoding",
  "VideoExtractFrames",
  "VideoFrameList",
  "VideoFrameMap",
  "VideoPause",
  "VideoPlay",
  "VideoQ",
  "VideoStop",
  "VideoStream",
  "VideoStreams",
  "VideoTimeSeries",
  "VideoTracks",
  "VideoTrim",
  "ViewAngle",
  "ViewCenter",
  "ViewMatrix",
  "ViewPoint",
  "ViewPointSelectorSettings",
  "ViewPort",
  "ViewProjection",
  "ViewRange",
  "ViewVector",
  "ViewVertical",
  "VirtualGroupData",
  "Visible",
  "VisibleCell",
  "VoiceStyleData",
  "VoigtDistribution",
  "VolcanoData",
  "Volume",
  "VonMisesDistribution",
  "VoronoiMesh",
  "WaitAll",
  "WaitAsynchronousTask",
  "WaitNext",
  "WaitUntil",
  "WakebyDistribution",
  "WalleniusHypergeometricDistribution",
  "WaringYuleDistribution",
  "WarpingCorrespondence",
  "WarpingDistance",
  "WatershedComponents",
  "WatsonUSquareTest",
  "WattsStrogatzGraphDistribution",
  "WaveletBestBasis",
  "WaveletFilterCoefficients",
  "WaveletImagePlot",
  "WaveletListPlot",
  "WaveletMapIndexed",
  "WaveletMatrixPlot",
  "WaveletPhi",
  "WaveletPsi",
  "WaveletScale",
  "WaveletScalogram",
  "WaveletThreshold",
  "WeaklyConnectedComponents",
  "WeaklyConnectedGraphComponents",
  "WeaklyConnectedGraphQ",
  "WeakStationarity",
  "WeatherData",
  "WeatherForecastData",
  "WebAudioSearch",
  "WebElementObject",
  "WeberE",
  "WebExecute",
  "WebImage",
  "WebImageSearch",
  "WebSearch",
  "WebSessionObject",
  "WebSessions",
  "WebWindowObject",
  "Wedge",
  "Wednesday",
  "WeibullDistribution",
  "WeierstrassE1",
  "WeierstrassE2",
  "WeierstrassE3",
  "WeierstrassEta1",
  "WeierstrassEta2",
  "WeierstrassEta3",
  "WeierstrassHalfPeriods",
  "WeierstrassHalfPeriodW1",
  "WeierstrassHalfPeriodW2",
  "WeierstrassHalfPeriodW3",
  "WeierstrassInvariantG2",
  "WeierstrassInvariantG3",
  "WeierstrassInvariants",
  "WeierstrassP",
  "WeierstrassPPrime",
  "WeierstrassSigma",
  "WeierstrassZeta",
  "WeightedAdjacencyGraph",
  "WeightedAdjacencyMatrix",
  "WeightedData",
  "WeightedGraphQ",
  "Weights",
  "WelchWindow",
  "WheelGraph",
  "WhenEvent",
  "Which",
  "While",
  "White",
  "WhiteNoiseProcess",
  "WhitePoint",
  "Whitespace",
  "WhitespaceCharacter",
  "WhittakerM",
  "WhittakerW",
  "WienerFilter",
  "WienerProcess",
  "WignerD",
  "WignerSemicircleDistribution",
  "WikidataData",
  "WikidataSearch",
  "WikipediaData",
  "WikipediaSearch",
  "WilksW",
  "WilksWTest",
  "WindDirectionData",
  "WindingCount",
  "WindingPolygon",
  "WindowClickSelect",
  "WindowElements",
  "WindowFloating",
  "WindowFrame",
  "WindowFrameElements",
  "WindowMargins",
  "WindowMovable",
  "WindowOpacity",
  "WindowPersistentStyles",
  "WindowSelected",
  "WindowSize",
  "WindowStatusArea",
  "WindowTitle",
  "WindowToolbars",
  "WindowWidth",
  "WindSpeedData",
  "WindVectorData",
  "WinsorizedMean",
  "WinsorizedVariance",
  "WishartMatrixDistribution",
  "With",
  "WolframAlpha",
  "WolframAlphaDate",
  "WolframAlphaQuantity",
  "WolframAlphaResult",
  "WolframLanguageData",
  "Word",
  "WordBoundary",
  "WordCharacter",
  "WordCloud",
  "WordCount",
  "WordCounts",
  "WordData",
  "WordDefinition",
  "WordFrequency",
  "WordFrequencyData",
  "WordList",
  "WordOrientation",
  "WordSearch",
  "WordSelectionFunction",
  "WordSeparators",
  "WordSpacings",
  "WordStem",
  "WordTranslation",
  "WorkingPrecision",
  "WrapAround",
  "Write",
  "WriteLine",
  "WriteString",
  "Wronskian",
  "XMLElement",
  "XMLObject",
  "XMLTemplate",
  "Xnor",
  "Xor",
  "XYZColor",
  "Yellow",
  "Yesterday",
  "YuleDissimilarity",
  "ZernikeR",
  "ZeroSymmetric",
  "ZeroTest",
  "ZeroWidthTimes",
  "Zeta",
  "ZetaZero",
  "ZIPCodeData",
  "ZipfDistribution",
  "ZoomCenter",
  "ZoomFactor",
  "ZTest",
  "ZTransform",
  "$Aborted",
  "$ActivationGroupID",
  "$ActivationKey",
  "$ActivationUserRegistered",
  "$AddOnsDirectory",
  "$AllowDataUpdates",
  "$AllowExternalChannelFunctions",
  "$AllowInternet",
  "$AssertFunction",
  "$Assumptions",
  "$AsynchronousTask",
  "$AudioDecoders",
  "$AudioEncoders",
  "$AudioInputDevices",
  "$AudioOutputDevices",
  "$BaseDirectory",
  "$BasePacletsDirectory",
  "$BatchInput",
  "$BatchOutput",
  "$BlockchainBase",
  "$BoxForms",
  "$ByteOrdering",
  "$CacheBaseDirectory",
  "$Canceled",
  "$ChannelBase",
  "$CharacterEncoding",
  "$CharacterEncodings",
  "$CloudAccountName",
  "$CloudBase",
  "$CloudConnected",
  "$CloudConnection",
  "$CloudCreditsAvailable",
  "$CloudEvaluation",
  "$CloudExpressionBase",
  "$CloudObjectNameFormat",
  "$CloudObjectURLType",
  "$CloudRootDirectory",
  "$CloudSymbolBase",
  "$CloudUserID",
  "$CloudUserUUID",
  "$CloudVersion",
  "$CloudVersionNumber",
  "$CloudWolframEngineVersionNumber",
  "$CommandLine",
  "$CompilationTarget",
  "$ConditionHold",
  "$ConfiguredKernels",
  "$Context",
  "$ContextPath",
  "$ControlActiveSetting",
  "$Cookies",
  "$CookieStore",
  "$CreationDate",
  "$CurrentLink",
  "$CurrentTask",
  "$CurrentWebSession",
  "$DataStructures",
  "$DateStringFormat",
  "$DefaultAudioInputDevice",
  "$DefaultAudioOutputDevice",
  "$DefaultFont",
  "$DefaultFrontEnd",
  "$DefaultImagingDevice",
  "$DefaultLocalBase",
  "$DefaultMailbox",
  "$DefaultNetworkInterface",
  "$DefaultPath",
  "$DefaultProxyRules",
  "$DefaultSystemCredentialStore",
  "$Display",
  "$DisplayFunction",
  "$DistributedContexts",
  "$DynamicEvaluation",
  "$Echo",
  "$EmbedCodeEnvironments",
  "$EmbeddableServices",
  "$EntityStores",
  "$Epilog",
  "$EvaluationCloudBase",
  "$EvaluationCloudObject",
  "$EvaluationEnvironment",
  "$ExportFormats",
  "$ExternalIdentifierTypes",
  "$ExternalStorageBase",
  "$Failed",
  "$FinancialDataSource",
  "$FontFamilies",
  "$FormatType",
  "$FrontEnd",
  "$FrontEndSession",
  "$GeoEntityTypes",
  "$GeoLocation",
  "$GeoLocationCity",
  "$GeoLocationCountry",
  "$GeoLocationPrecision",
  "$GeoLocationSource",
  "$HistoryLength",
  "$HomeDirectory",
  "$HTMLExportRules",
  "$HTTPCookies",
  "$HTTPRequest",
  "$IgnoreEOF",
  "$ImageFormattingWidth",
  "$ImageResolution",
  "$ImagingDevice",
  "$ImagingDevices",
  "$ImportFormats",
  "$IncomingMailSettings",
  "$InitialDirectory",
  "$Initialization",
  "$InitializationContexts",
  "$Input",
  "$InputFileName",
  "$InputStreamMethods",
  "$Inspector",
  "$InstallationDate",
  "$InstallationDirectory",
  "$InterfaceEnvironment",
  "$InterpreterTypes",
  "$IterationLimit",
  "$KernelCount",
  "$KernelID",
  "$Language",
  "$LaunchDirectory",
  "$LibraryPath",
  "$LicenseExpirationDate",
  "$LicenseID",
  "$LicenseProcesses",
  "$LicenseServer",
  "$LicenseSubprocesses",
  "$LicenseType",
  "$Line",
  "$Linked",
  "$LinkSupported",
  "$LoadedFiles",
  "$LocalBase",
  "$LocalSymbolBase",
  "$MachineAddresses",
  "$MachineDomain",
  "$MachineDomains",
  "$MachineEpsilon",
  "$MachineID",
  "$MachineName",
  "$MachinePrecision",
  "$MachineType",
  "$MaxExtraPrecision",
  "$MaxLicenseProcesses",
  "$MaxLicenseSubprocesses",
  "$MaxMachineNumber",
  "$MaxNumber",
  "$MaxPiecewiseCases",
  "$MaxPrecision",
  "$MaxRootDegree",
  "$MessageGroups",
  "$MessageList",
  "$MessagePrePrint",
  "$Messages",
  "$MinMachineNumber",
  "$MinNumber",
  "$MinorReleaseNumber",
  "$MinPrecision",
  "$MobilePhone",
  "$ModuleNumber",
  "$NetworkConnected",
  "$NetworkInterfaces",
  "$NetworkLicense",
  "$NewMessage",
  "$NewSymbol",
  "$NotebookInlineStorageLimit",
  "$Notebooks",
  "$NoValue",
  "$NumberMarks",
  "$Off",
  "$OperatingSystem",
  "$Output",
  "$OutputForms",
  "$OutputSizeLimit",
  "$OutputStreamMethods",
  "$Packages",
  "$ParentLink",
  "$ParentProcessID",
  "$PasswordFile",
  "$PatchLevelID",
  "$Path",
  "$PathnameSeparator",
  "$PerformanceGoal",
  "$Permissions",
  "$PermissionsGroupBase",
  "$PersistenceBase",
  "$PersistencePath",
  "$PipeSupported",
  "$PlotTheme",
  "$Post",
  "$Pre",
  "$PreferencesDirectory",
  "$PreInitialization",
  "$PrePrint",
  "$PreRead",
  "$PrintForms",
  "$PrintLiteral",
  "$Printout3DPreviewer",
  "$ProcessID",
  "$ProcessorCount",
  "$ProcessorType",
  "$ProductInformation",
  "$ProgramName",
  "$PublisherID",
  "$RandomState",
  "$RecursionLimit",
  "$RegisteredDeviceClasses",
  "$RegisteredUserName",
  "$ReleaseNumber",
  "$RequesterAddress",
  "$RequesterWolframID",
  "$RequesterWolframUUID",
  "$RootDirectory",
  "$ScheduledTask",
  "$ScriptCommandLine",
  "$ScriptInputString",
  "$SecuredAuthenticationKeyTokens",
  "$ServiceCreditsAvailable",
  "$Services",
  "$SessionID",
  "$SetParentLink",
  "$SharedFunctions",
  "$SharedVariables",
  "$SoundDisplay",
  "$SoundDisplayFunction",
  "$SourceLink",
  "$SSHAuthentication",
  "$SubtitleDecoders",
  "$SubtitleEncoders",
  "$SummaryBoxDataSizeLimit",
  "$SuppressInputFormHeads",
  "$SynchronousEvaluation",
  "$SyntaxHandler",
  "$System",
  "$SystemCharacterEncoding",
  "$SystemCredentialStore",
  "$SystemID",
  "$SystemMemory",
  "$SystemShell",
  "$SystemTimeZone",
  "$SystemWordLength",
  "$TemplatePath",
  "$TemporaryDirectory",
  "$TemporaryPrefix",
  "$TestFileName",
  "$TextStyle",
  "$TimedOut",
  "$TimeUnit",
  "$TimeZone",
  "$TimeZoneEntity",
  "$TopDirectory",
  "$TraceOff",
  "$TraceOn",
  "$TracePattern",
  "$TracePostAction",
  "$TracePreAction",
  "$UnitSystem",
  "$Urgent",
  "$UserAddOnsDirectory",
  "$UserAgentLanguages",
  "$UserAgentMachine",
  "$UserAgentName",
  "$UserAgentOperatingSystem",
  "$UserAgentString",
  "$UserAgentVersion",
  "$UserBaseDirectory",
  "$UserBasePacletsDirectory",
  "$UserDocumentsDirectory",
  "$Username",
  "$UserName",
  "$UserURLBase",
  "$Version",
  "$VersionNumber",
  "$VideoDecoders",
  "$VideoEncoders",
  "$VoiceStyles",
  "$WolframDocumentsDirectory",
  "$WolframID",
  "$WolframUUID"
];

/*
Language: Wolfram Language
Description: The Wolfram Language is the programming language used in Wolfram Mathematica, a modern technical computing system spanning most areas of technical computing.
Authors: Patrick Scheibe <patrick@halirutan.de>, Robert Jacobson <robertjacobson@acm.org>
Website: https://www.wolfram.com/mathematica/
Category: scientific
*/

/** @type LanguageFn */
function mathematica(hljs) {
  const regex = hljs.regex;
  /*
  This rather scary looking matching of Mathematica numbers is carefully explained by Robert Jacobson here:
  https://wltools.github.io/LanguageSpec/Specification/Syntax/Number-representations/
   */
  const BASE_RE = /([2-9]|[1-2]\d|[3][0-5])\^\^/;
  const BASE_DIGITS_RE = /(\w*\.\w+|\w+\.\w*|\w+)/;
  const NUMBER_RE = /(\d*\.\d+|\d+\.\d*|\d+)/;
  const BASE_NUMBER_RE = regex.either(regex.concat(BASE_RE, BASE_DIGITS_RE), NUMBER_RE);

  const ACCURACY_RE = /``[+-]?(\d*\.\d+|\d+\.\d*|\d+)/;
  const PRECISION_RE = /`([+-]?(\d*\.\d+|\d+\.\d*|\d+))?/;
  const APPROXIMATE_NUMBER_RE = regex.either(ACCURACY_RE, PRECISION_RE);

  const SCIENTIFIC_NOTATION_RE = /\*\^[+-]?\d+/;

  const MATHEMATICA_NUMBER_RE = regex.concat(
    BASE_NUMBER_RE,
    regex.optional(APPROXIMATE_NUMBER_RE),
    regex.optional(SCIENTIFIC_NOTATION_RE)
  );

  const NUMBERS = {
    className: 'number',
    relevance: 0,
    begin: MATHEMATICA_NUMBER_RE
  };

  const SYMBOL_RE = /[a-zA-Z$][a-zA-Z0-9$]*/;
  const SYSTEM_SYMBOLS_SET = new Set(SYSTEM_SYMBOLS);
  /** @type {Mode} */
  const SYMBOLS = { variants: [
    {
      className: 'builtin-symbol',
      begin: SYMBOL_RE,
      // for performance out of fear of regex.either(...Mathematica.SYSTEM_SYMBOLS)
      "on:begin": (match, response) => {
        if (!SYSTEM_SYMBOLS_SET.has(match[0])) response.ignoreMatch();
      }
    },
    {
      className: 'symbol',
      relevance: 0,
      begin: SYMBOL_RE
    }
  ] };

  const NAMED_CHARACTER = {
    className: 'named-character',
    begin: /\\\[[$a-zA-Z][$a-zA-Z0-9]+\]/
  };

  const OPERATORS = {
    className: 'operator',
    relevance: 0,
    begin: /[+\-*/,;.:@~=><&|_`'^?!%]+/
  };
  const PATTERNS = {
    className: 'pattern',
    relevance: 0,
    begin: /([a-zA-Z$][a-zA-Z0-9$]*)?_+([a-zA-Z$][a-zA-Z0-9$]*)?/
  };

  const SLOTS = {
    className: 'slot',
    relevance: 0,
    begin: /#[a-zA-Z$][a-zA-Z0-9$]*|#+[0-9]?/
  };

  const BRACES = {
    className: 'brace',
    relevance: 0,
    begin: /[[\](){}]/
  };

  const MESSAGES = {
    className: 'message-name',
    relevance: 0,
    begin: regex.concat("::", SYMBOL_RE)
  };

  return {
    name: 'Mathematica',
    aliases: [
      'mma',
      'wl'
    ],
    classNameAliases: {
      brace: 'punctuation',
      pattern: 'type',
      slot: 'type',
      symbol: 'variable',
      'named-character': 'variable',
      'builtin-symbol': 'built_in',
      'message-name': 'string'
    },
    contains: [
      hljs.COMMENT(/\(\*/, /\*\)/, { contains: [ 'self' ] }),
      PATTERNS,
      SLOTS,
      MESSAGES,
      SYMBOLS,
      NAMED_CHARACTER,
      hljs.QUOTE_STRING_MODE,
      NUMBERS,
      OPERATORS,
      BRACES
    ]
  };
}

module.exports = mathematica;

},{}],15:[function(require,module,exports){
/*
Language: Matlab
Author: Denis Bardadym <bardadymchik@gmail.com>
Contributors: Eugene Nizhibitsky <nizhibitsky@ya.ru>, Egor Rogov <e.rogov@postgrespro.ru>
Website: https://www.mathworks.com/products/matlab.html
Category: scientific
*/

/*
  Formal syntax is not published, helpful link:
  https://github.com/kornilova-l/matlab-IntelliJ-plugin/blob/master/src/main/grammar/Matlab.bnf
*/
function matlab(hljs) {
  const TRANSPOSE_RE = '(\'|\\.\')+';
  const TRANSPOSE = {
    relevance: 0,
    contains: [ { begin: TRANSPOSE_RE } ]
  };

  return {
    name: 'Matlab',
    keywords: {
      keyword:
        'arguments break case catch classdef continue else elseif end enumeration events for function '
        + 'global if methods otherwise parfor persistent properties return spmd switch try while',
      built_in:
        'sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan '
        + 'atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot '
        + 'cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog '
        + 'realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal '
        + 'cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli '
        + 'besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma '
        + 'gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms '
        + 'nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones '
        + 'eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length '
        + 'ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril '
        + 'triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute '
        + 'shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i|0 inf nan '
        + 'isnan isinf isfinite j|0 why compan gallery hadamard hankel hilb invhilb magic pascal '
        + 'rosser toeplitz vander wilkinson max min nanmax nanmin mean nanmean type table '
        + 'readtable writetable sortrows sort figure plot plot3 scatter scatter3 cellfun '
        + 'legend intersect ismember procrustes hold num2cell '
    },
    illegal: '(//|"|#|/\\*|\\s+/\\w+)',
    contains: [
      {
        className: 'function',
        beginKeywords: 'function',
        end: '$',
        contains: [
          hljs.UNDERSCORE_TITLE_MODE,
          {
            className: 'params',
            variants: [
              {
                begin: '\\(',
                end: '\\)'
              },
              {
                begin: '\\[',
                end: '\\]'
              }
            ]
          }
        ]
      },
      {
        className: 'built_in',
        begin: /true|false/,
        relevance: 0,
        starts: TRANSPOSE
      },
      {
        begin: '[a-zA-Z][a-zA-Z_0-9]*' + TRANSPOSE_RE,
        relevance: 0
      },
      {
        className: 'number',
        begin: hljs.C_NUMBER_RE,
        relevance: 0,
        starts: TRANSPOSE
      },
      {
        className: 'string',
        begin: '\'',
        end: '\'',
        contains: [ { begin: '\'\'' } ]
      },
      {
        begin: /\]|\}|\)/,
        relevance: 0,
        starts: TRANSPOSE
      },
      {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [ { begin: '""' } ],
        starts: TRANSPOSE
      },
      hljs.COMMENT('^\\s*%\\{\\s*$', '^\\s*%\\}\\s*$'),
      hljs.COMMENT('%', '$')
    ]
  };
}

module.exports = matlab;

},{}],16:[function(require,module,exports){
/*
Language: Nginx config
Author: Peter Leonov <gojpeg@yandex.ru>
Contributors: Ivan Sagalaev <maniac@softwaremaniacs.org>
Category: config, web
Website: https://www.nginx.com
*/

/** @type LanguageFn */
function nginx(hljs) {
  const regex = hljs.regex;
  const VAR = {
    className: 'variable',
    variants: [
      { begin: /\$\d+/ },
      { begin: /\$\{\w+\}/ },
      { begin: regex.concat(/[$@]/, hljs.UNDERSCORE_IDENT_RE) }
    ]
  };
  const LITERALS = [
    "on",
    "off",
    "yes",
    "no",
    "true",
    "false",
    "none",
    "blocked",
    "debug",
    "info",
    "notice",
    "warn",
    "error",
    "crit",
    "select",
    "break",
    "last",
    "permanent",
    "redirect",
    "kqueue",
    "rtsig",
    "epoll",
    "poll",
    "/dev/poll"
  ];
  const DEFAULT = {
    endsWithParent: true,
    keywords: {
      $pattern: /[a-z_]{2,}|\/dev\/poll/,
      literal: LITERALS
    },
    relevance: 0,
    illegal: '=>',
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'string',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          VAR
        ],
        variants: [
          {
            begin: /"/,
            end: /"/
          },
          {
            begin: /'/,
            end: /'/
          }
        ]
      },
      // this swallows entire URLs to avoid detecting numbers within
      {
        begin: '([a-z]+):/',
        end: '\\s',
        endsWithParent: true,
        excludeEnd: true,
        contains: [ VAR ]
      },
      {
        className: 'regexp',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          VAR
        ],
        variants: [
          {
            begin: "\\s\\^",
            end: "\\s|\\{|;",
            returnEnd: true
          },
          // regexp locations (~, ~*)
          {
            begin: "~\\*?\\s+",
            end: "\\s|\\{|;",
            returnEnd: true
          },
          // *.example.com
          { begin: "\\*(\\.[a-z\\-]+)+" },
          // sub.example.*
          { begin: "([a-z\\-]+\\.)+\\*" }
        ]
      },
      // IP
      {
        className: 'number',
        begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
      },
      // units
      {
        className: 'number',
        begin: '\\b\\d+[kKmMgGdshdwy]?\\b',
        relevance: 0
      },
      VAR
    ]
  };

  return {
    name: 'Nginx config',
    aliases: [ 'nginxconf' ],
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        beginKeywords: "upstream location",
        end: /;|\{/,
        contains: DEFAULT.contains,
        keywords: { section: "upstream location" }
      },
      {
        className: 'section',
        begin: regex.concat(hljs.UNDERSCORE_IDENT_RE + regex.lookahead(/\s+\{/)),
        relevance: 0
      },
      {
        begin: regex.lookahead(hljs.UNDERSCORE_IDENT_RE + '\\s'),
        end: ';|\\{',
        contains: [
          {
            className: 'attribute',
            begin: hljs.UNDERSCORE_IDENT_RE,
            starts: DEFAULT
          }
        ],
        relevance: 0
      }
    ],
    illegal: '[^\\s\\}\\{]'
  };
}

module.exports = nginx;

},{}],17:[function(require,module,exports){
/*
Language: Plain text
Author: Egor Rogov (e.rogov@postgrespro.ru)
Description: Plain text without any highlighting.
Category: common
*/

function plaintext(hljs) {
  return {
    name: 'Plain text',
    aliases: [
      'text',
      'txt'
    ],
    disableAutodetect: true
  };
}

module.exports = plaintext;

},{}],18:[function(require,module,exports){
/*
Language: Python
Description: Python is an interpreted, object-oriented, high-level programming language with dynamic semantics.
Website: https://www.python.org
Category: common
*/

function python(hljs) {
  const regex = hljs.regex;
  const IDENT_RE = /[\p{XID_Start}_]\p{XID_Continue}*/u;
  const RESERVED_WORDS = [
    'and',
    'as',
    'assert',
    'async',
    'await',
    'break',
    'case',
    'class',
    'continue',
    'def',
    'del',
    'elif',
    'else',
    'except',
    'finally',
    'for',
    'from',
    'global',
    'if',
    'import',
    'in',
    'is',
    'lambda',
    'match',
    'nonlocal|10',
    'not',
    'or',
    'pass',
    'raise',
    'return',
    'try',
    'while',
    'with',
    'yield'
  ];

  const BUILT_INS = [
    '__import__',
    'abs',
    'all',
    'any',
    'ascii',
    'bin',
    'bool',
    'breakpoint',
    'bytearray',
    'bytes',
    'callable',
    'chr',
    'classmethod',
    'compile',
    'complex',
    'delattr',
    'dict',
    'dir',
    'divmod',
    'enumerate',
    'eval',
    'exec',
    'filter',
    'float',
    'format',
    'frozenset',
    'getattr',
    'globals',
    'hasattr',
    'hash',
    'help',
    'hex',
    'id',
    'input',
    'int',
    'isinstance',
    'issubclass',
    'iter',
    'len',
    'list',
    'locals',
    'map',
    'max',
    'memoryview',
    'min',
    'next',
    'object',
    'oct',
    'open',
    'ord',
    'pow',
    'print',
    'property',
    'range',
    'repr',
    'reversed',
    'round',
    'set',
    'setattr',
    'slice',
    'sorted',
    'staticmethod',
    'str',
    'sum',
    'super',
    'tuple',
    'type',
    'vars',
    'zip'
  ];

  const LITERALS = [
    '__debug__',
    'Ellipsis',
    'False',
    'None',
    'NotImplemented',
    'True'
  ];

  // https://docs.python.org/3/library/typing.html
  // TODO: Could these be supplemented by a CamelCase matcher in certain
  // contexts, leaving these remaining only for relevance hinting?
  const TYPES = [
    "Any",
    "Callable",
    "Coroutine",
    "Dict",
    "List",
    "Literal",
    "Generic",
    "Optional",
    "Sequence",
    "Set",
    "Tuple",
    "Type",
    "Union"
  ];

  const KEYWORDS = {
    $pattern: /[A-Za-z]\w+|__\w+__/,
    keyword: RESERVED_WORDS,
    built_in: BUILT_INS,
    literal: LITERALS,
    type: TYPES
  };

  const PROMPT = {
    className: 'meta',
    begin: /^(>>>|\.\.\.) /
  };

  const SUBST = {
    className: 'subst',
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS,
    illegal: /#/
  };

  const LITERAL_BRACKET = {
    begin: /\{\{/,
    relevance: 0
  };

  const STRING = {
    className: 'string',
    contains: [ hljs.BACKSLASH_ESCAPE ],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT
        ],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT
        ],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          PROMPT,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10
      },
      {
        begin: /([uU]|[rR])"/,
        end: /"/,
        relevance: 10
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          LITERAL_BRACKET,
          SUBST
        ]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };

  // https://docs.python.org/3.9/reference/lexical_analysis.html#numeric-literals
  const digitpart = '[0-9](_?[0-9])*';
  const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
  // Whitespace after a number (or any lexical token) is needed only if its absence
  // would change the tokenization
  // https://docs.python.org/3.9/reference/lexical_analysis.html#whitespace-between-tokens
  // We deviate slightly, requiring a word boundary or a keyword
  // to avoid accidentally recognizing *prefixes* (e.g., `0` in `0x41` or `08` or `0__1`)
  const lookahead = `\\b|${RESERVED_WORDS.join('|')}`;
  const NUMBER = {
    className: 'number',
    relevance: 0,
    variants: [
      // exponentfloat, pointfloat
      // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
      // optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      // Note: no leading \b because floats can start with a decimal point
      // and we don't want to mishandle e.g. `fn(.5)`,
      // no trailing \b for pointfloat because it can end with a decimal point
      // and we don't want to mishandle e.g. `0..hex()`; this should be safe
      // because both MUST contain a decimal point and so cannot be confused with
      // the interior part of an identifier
      {
        begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
      },
      {
        begin: `(${pointfloat})[jJ]?`
      },

      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
      },

      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b(${digitpart})[jJ](?=${lookahead})`
      }
    ]
  };
  const COMMENT_TYPE = {
    className: "comment",
    begin: regex.lookahead(/# type:/),
    end: /$/,
    keywords: KEYWORDS,
    contains: [
      { // prevent keywords from coloring `type`
        begin: /# type:/
      },
      // comment within a datatype comment includes no keywords
      {
        begin: /#/,
        end: /\b\B/,
        endsWithParent: true
      }
    ]
  };
  const PARAMS = {
    className: 'params',
    variants: [
      // Exclude params in functions without params
      {
        className: "",
        begin: /\(\s*\)/,
        skip: true
      },
      {
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          'self',
          PROMPT,
          NUMBER,
          STRING,
          hljs.HASH_COMMENT_MODE
        ]
      }
    ]
  };
  SUBST.contains = [
    STRING,
    NUMBER,
    PROMPT
  ];

  return {
    name: 'Python',
    aliases: [
      'py',
      'gyp',
      'ipython'
    ],
    unicodeRegex: true,
    keywords: KEYWORDS,
    illegal: /(<\/|->|\?)|=>/,
    contains: [
      PROMPT,
      NUMBER,
      {
        // very common convention
        begin: /\bself\b/
      },
      {
        // eat "if" prior to string so that it won't accidentally be
        // labeled as an f-string
        beginKeywords: "if",
        relevance: 0
      },
      STRING,
      COMMENT_TYPE,
      hljs.HASH_COMMENT_MODE,
      {
        match: [
          /\bdef/, /\s+/,
          IDENT_RE,
        ],
        scope: {
          1: "keyword",
          3: "title.function"
        },
        contains: [ PARAMS ]
      },
      {
        variants: [
          {
            match: [
              /\bclass/, /\s+/,
              IDENT_RE, /\s*/,
              /\(\s*/, IDENT_RE,/\s*\)/
            ],
          },
          {
            match: [
              /\bclass/, /\s+/,
              IDENT_RE
            ],
          }
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          6: "title.class.inherited",
        }
      },
      {
        className: 'meta',
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [
          NUMBER,
          PARAMS,
          STRING
        ]
      }
    ]
  };
}

module.exports = python;

},{}],19:[function(require,module,exports){
const MODES = (hljs) => {
  return {
    IMPORTANT: {
      scope: 'meta',
      begin: '!important'
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: 'number',
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: 'selector-attr',
      begin: /\[/,
      end: /\]/,
      illegal: '$',
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: 'number',
      begin: hljs.NUMBER_RE + '(' +
        '%|em|ex|ch|rem' +
        '|vw|vh|vmin|vmax' +
        '|cm|mm|in|pt|pc|px' +
        '|deg|grad|rad|turn' +
        '|s|ms' +
        '|Hz|kHz' +
        '|dpi|dpcm|dppx' +
        ')?',
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z][A-Za-z0-9_-]*/
    }
  };
};

const TAGS = [
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'audio',
  'b',
  'blockquote',
  'body',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'dd',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'mark',
  'menu',
  'nav',
  'object',
  'ol',
  'p',
  'q',
  'quote',
  'samp',
  'section',
  'span',
  'strong',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'ul',
  'var',
  'video'
];

const MEDIA_FEATURES = [
  'any-hover',
  'any-pointer',
  'aspect-ratio',
  'color',
  'color-gamut',
  'color-index',
  'device-aspect-ratio',
  'device-height',
  'device-width',
  'display-mode',
  'forced-colors',
  'grid',
  'height',
  'hover',
  'inverted-colors',
  'monochrome',
  'orientation',
  'overflow-block',
  'overflow-inline',
  'pointer',
  'prefers-color-scheme',
  'prefers-contrast',
  'prefers-reduced-motion',
  'prefers-reduced-transparency',
  'resolution',
  'scan',
  'scripting',
  'update',
  'width',
  // TODO: find a better solution?
  'min-width',
  'max-width',
  'min-height',
  'max-height'
];

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
const PSEUDO_CLASSES = [
  'active',
  'any-link',
  'blank',
  'checked',
  'current',
  'default',
  'defined',
  'dir', // dir()
  'disabled',
  'drop',
  'empty',
  'enabled',
  'first',
  'first-child',
  'first-of-type',
  'fullscreen',
  'future',
  'focus',
  'focus-visible',
  'focus-within',
  'has', // has()
  'host', // host or host()
  'host-context', // host-context()
  'hover',
  'indeterminate',
  'in-range',
  'invalid',
  'is', // is()
  'lang', // lang()
  'last-child',
  'last-of-type',
  'left',
  'link',
  'local-link',
  'not', // not()
  'nth-child', // nth-child()
  'nth-col', // nth-col()
  'nth-last-child', // nth-last-child()
  'nth-last-col', // nth-last-col()
  'nth-last-of-type', //nth-last-of-type()
  'nth-of-type', //nth-of-type()
  'only-child',
  'only-of-type',
  'optional',
  'out-of-range',
  'past',
  'placeholder-shown',
  'read-only',
  'read-write',
  'required',
  'right',
  'root',
  'scope',
  'target',
  'target-within',
  'user-invalid',
  'valid',
  'visited',
  'where' // where()
];

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
const PSEUDO_ELEMENTS = [
  'after',
  'backdrop',
  'before',
  'cue',
  'cue-region',
  'first-letter',
  'first-line',
  'grammar-error',
  'marker',
  'part',
  'placeholder',
  'selection',
  'slotted',
  'spelling-error'
];

const ATTRIBUTES = [
  'align-content',
  'align-items',
  'align-self',
  'all',
  'animation',
  'animation-delay',
  'animation-direction',
  'animation-duration',
  'animation-fill-mode',
  'animation-iteration-count',
  'animation-name',
  'animation-play-state',
  'animation-timing-function',
  'backface-visibility',
  'background',
  'background-attachment',
  'background-blend-mode',
  'background-clip',
  'background-color',
  'background-image',
  'background-origin',
  'background-position',
  'background-repeat',
  'background-size',
  'block-size',
  'border',
  'border-block',
  'border-block-color',
  'border-block-end',
  'border-block-end-color',
  'border-block-end-style',
  'border-block-end-width',
  'border-block-start',
  'border-block-start-color',
  'border-block-start-style',
  'border-block-start-width',
  'border-block-style',
  'border-block-width',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-style',
  'border-bottom-width',
  'border-collapse',
  'border-color',
  'border-image',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',
  'border-image-source',
  'border-image-width',
  'border-inline',
  'border-inline-color',
  'border-inline-end',
  'border-inline-end-color',
  'border-inline-end-style',
  'border-inline-end-width',
  'border-inline-start',
  'border-inline-start-color',
  'border-inline-start-style',
  'border-inline-start-width',
  'border-inline-style',
  'border-inline-width',
  'border-left',
  'border-left-color',
  'border-left-style',
  'border-left-width',
  'border-radius',
  'border-right',
  'border-right-color',
  'border-right-style',
  'border-right-width',
  'border-spacing',
  'border-style',
  'border-top',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-style',
  'border-top-width',
  'border-width',
  'bottom',
  'box-decoration-break',
  'box-shadow',
  'box-sizing',
  'break-after',
  'break-before',
  'break-inside',
  'caption-side',
  'caret-color',
  'clear',
  'clip',
  'clip-path',
  'clip-rule',
  'color',
  'column-count',
  'column-fill',
  'column-gap',
  'column-rule',
  'column-rule-color',
  'column-rule-style',
  'column-rule-width',
  'column-span',
  'column-width',
  'columns',
  'contain',
  'content',
  'content-visibility',
  'counter-increment',
  'counter-reset',
  'cue',
  'cue-after',
  'cue-before',
  'cursor',
  'direction',
  'display',
  'empty-cells',
  'filter',
  'flex',
  'flex-basis',
  'flex-direction',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'float',
  'flow',
  'font',
  'font-display',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-size',
  'font-size-adjust',
  'font-smoothing',
  'font-stretch',
  'font-style',
  'font-synthesis',
  'font-variant',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-variation-settings',
  'font-weight',
  'gap',
  'glyph-orientation-vertical',
  'grid',
  'grid-area',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-auto-rows',
  'grid-column',
  'grid-column-end',
  'grid-column-start',
  'grid-gap',
  'grid-row',
  'grid-row-end',
  'grid-row-start',
  'grid-template',
  'grid-template-areas',
  'grid-template-columns',
  'grid-template-rows',
  'hanging-punctuation',
  'height',
  'hyphens',
  'icon',
  'image-orientation',
  'image-rendering',
  'image-resolution',
  'ime-mode',
  'inline-size',
  'isolation',
  'justify-content',
  'left',
  'letter-spacing',
  'line-break',
  'line-height',
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'margin',
  'margin-block',
  'margin-block-end',
  'margin-block-start',
  'margin-bottom',
  'margin-inline',
  'margin-inline-end',
  'margin-inline-start',
  'margin-left',
  'margin-right',
  'margin-top',
  'marks',
  'mask',
  'mask-border',
  'mask-border-mode',
  'mask-border-outset',
  'mask-border-repeat',
  'mask-border-slice',
  'mask-border-source',
  'mask-border-width',
  'mask-clip',
  'mask-composite',
  'mask-image',
  'mask-mode',
  'mask-origin',
  'mask-position',
  'mask-repeat',
  'mask-size',
  'mask-type',
  'max-block-size',
  'max-height',
  'max-inline-size',
  'max-width',
  'min-block-size',
  'min-height',
  'min-inline-size',
  'min-width',
  'mix-blend-mode',
  'nav-down',
  'nav-index',
  'nav-left',
  'nav-right',
  'nav-up',
  'none',
  'normal',
  'object-fit',
  'object-position',
  'opacity',
  'order',
  'orphans',
  'outline',
  'outline-color',
  'outline-offset',
  'outline-style',
  'outline-width',
  'overflow',
  'overflow-wrap',
  'overflow-x',
  'overflow-y',
  'padding',
  'padding-block',
  'padding-block-end',
  'padding-block-start',
  'padding-bottom',
  'padding-inline',
  'padding-inline-end',
  'padding-inline-start',
  'padding-left',
  'padding-right',
  'padding-top',
  'page-break-after',
  'page-break-before',
  'page-break-inside',
  'pause',
  'pause-after',
  'pause-before',
  'perspective',
  'perspective-origin',
  'pointer-events',
  'position',
  'quotes',
  'resize',
  'rest',
  'rest-after',
  'rest-before',
  'right',
  'row-gap',
  'scroll-margin',
  'scroll-margin-block',
  'scroll-margin-block-end',
  'scroll-margin-block-start',
  'scroll-margin-bottom',
  'scroll-margin-inline',
  'scroll-margin-inline-end',
  'scroll-margin-inline-start',
  'scroll-margin-left',
  'scroll-margin-right',
  'scroll-margin-top',
  'scroll-padding',
  'scroll-padding-block',
  'scroll-padding-block-end',
  'scroll-padding-block-start',
  'scroll-padding-bottom',
  'scroll-padding-inline',
  'scroll-padding-inline-end',
  'scroll-padding-inline-start',
  'scroll-padding-left',
  'scroll-padding-right',
  'scroll-padding-top',
  'scroll-snap-align',
  'scroll-snap-stop',
  'scroll-snap-type',
  'scrollbar-color',
  'scrollbar-gutter',
  'scrollbar-width',
  'shape-image-threshold',
  'shape-margin',
  'shape-outside',
  'speak',
  'speak-as',
  'src', // @font-face
  'tab-size',
  'table-layout',
  'text-align',
  'text-align-all',
  'text-align-last',
  'text-combine-upright',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-style',
  'text-emphasis',
  'text-emphasis-color',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-indent',
  'text-justify',
  'text-orientation',
  'text-overflow',
  'text-rendering',
  'text-shadow',
  'text-transform',
  'text-underline-position',
  'top',
  'transform',
  'transform-box',
  'transform-origin',
  'transform-style',
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'unicode-bidi',
  'vertical-align',
  'visibility',
  'voice-balance',
  'voice-duration',
  'voice-family',
  'voice-pitch',
  'voice-range',
  'voice-rate',
  'voice-stress',
  'voice-volume',
  'white-space',
  'widows',
  'width',
  'will-change',
  'word-break',
  'word-spacing',
  'word-wrap',
  'writing-mode',
  'z-index'
  // reverse makes sure longer attributes `font-weight` are matched fully
  // instead of getting false positives on say `font`
].reverse();

/*
Language: SCSS
Description: Scss is an extension of the syntax of CSS.
Author: Kurt Emch <kurt@kurtemch.com>
Website: https://sass-lang.com
Category: common, css, web
*/

/** @type LanguageFn */
function scss(hljs) {
  const modes = MODES(hljs);
  const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS;
  const PSEUDO_CLASSES$1 = PSEUDO_CLASSES;

  const AT_IDENTIFIER = '@[a-z-]+'; // @font-face
  const AT_MODIFIERS = "and or not only";
  const IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  const VARIABLE = {
    className: 'variable',
    begin: '(\\$' + IDENT_RE + ')\\b',
    relevance: 0
  };

  return {
    name: 'SCSS',
    case_insensitive: true,
    illegal: '[=/|\']',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: 'selector-id',
        begin: '#[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'selector-class',
        begin: '\\.[A-Za-z0-9_-]+',
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: 'selector-tag',
        begin: '\\b(' + TAGS.join('|') + ')\\b',
        // was there, before, but why?
        relevance: 0
      },
      {
        className: 'selector-pseudo',
        begin: ':(' + PSEUDO_CLASSES$1.join('|') + ')'
      },
      {
        className: 'selector-pseudo',
        begin: ':(:)?(' + PSEUDO_ELEMENTS$1.join('|') + ')'
      },
      VARIABLE,
      { // pseudo-selector params
        begin: /\(/,
        end: /\)/,
        contains: [ modes.CSS_NUMBER_MODE ]
      },
      modes.CSS_VARIABLE,
      {
        className: 'attribute',
        begin: '\\b(' + ATTRIBUTES.join('|') + ')\\b'
      },
      { begin: '\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b' },
      {
        begin: /:/,
        end: /[;}{]/,
        relevance: 0,
        contains: [
          modes.BLOCK_COMMENT,
          VARIABLE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.IMPORTANT,
          modes.FUNCTION_DISPATCH
        ]
      },
      // matching these here allows us to treat them more like regular CSS
      // rules so everything between the {} gets regular rule highlighting,
      // which is what we want for page and font-face
      {
        begin: '@(page|font-face)',
        keywords: {
          $pattern: AT_IDENTIFIER,
          keyword: '@page @font-face'
        }
      },
      {
        begin: '@',
        end: '[{;]',
        returnBegin: true,
        keywords: {
          $pattern: /[a-z-]+/,
          keyword: AT_MODIFIERS,
          attribute: MEDIA_FEATURES.join(" ")
        },
        contains: [
          {
            begin: AT_IDENTIFIER,
            className: "keyword"
          },
          {
            begin: /[a-z-]+(?=:)/,
            className: "attribute"
          },
          VARIABLE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE
        ]
      },
      modes.FUNCTION_DISPATCH
    ]
  };
}

module.exports = scss;

},{}],20:[function(require,module,exports){
/*
 Language: SQL
 Website: https://en.wikipedia.org/wiki/SQL
 Category: common, database
 */

/*

Goals:

SQL is intended to highlight basic/common SQL keywords and expressions

- If pretty much every single SQL server includes supports, then it's a canidate.
- It is NOT intended to include tons of vendor specific keywords (Oracle, MySQL,
  PostgreSQL) although the list of data types is purposely a bit more expansive.
- For more specific SQL grammars please see:
  - PostgreSQL and PL/pgSQL - core
  - T-SQL - https://github.com/highlightjs/highlightjs-tsql
  - sql_more (core)

 */

function sql(hljs) {
  const regex = hljs.regex;
  const COMMENT_MODE = hljs.COMMENT('--', '$');
  const STRING = {
    className: 'string',
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [ { begin: /''/ } ]
      }
    ]
  };
  const QUOTED_IDENTIFIER = {
    begin: /"/,
    end: /"/,
    contains: [ { begin: /""/ } ]
  };

  const LITERALS = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ];

  const MULTI_WORD_TYPES = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ];

  const TYPES = [
    'bigint',
    'binary',
    'blob',
    'boolean',
    'char',
    'character',
    'clob',
    'date',
    'dec',
    'decfloat',
    'decimal',
    'float',
    'int',
    'integer',
    'interval',
    'nchar',
    'nclob',
    'national',
    'numeric',
    'real',
    'row',
    'smallint',
    'time',
    'timestamp',
    'varchar',
    'varying', // modifier (character varying)
    'varbinary'
  ];

  const NON_RESERVED_WORDS = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ];

  // https://jakewheat.github.io/sql-overview/sql-2016-foundation-grammar.html#reserved-word
  const RESERVED_WORDS = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year",
  ];

  // these are reserved words we have identified to be functions
  // and should only be highlighted in a dispatch-like context
  // ie, array_agg(...), etc.
  const RESERVED_FUNCTIONS = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket",
  ];

  // these functions can
  const POSSIBLE_WITHOUT_PARENS = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ];

  // those exist to boost relevance making these very
  // "SQL like" keyword combos worth +1 extra relevance
  const COMBOS = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ];

  const FUNCTIONS = RESERVED_FUNCTIONS;

  const KEYWORDS = [
    ...RESERVED_WORDS,
    ...NON_RESERVED_WORDS
  ].filter((keyword) => {
    return !RESERVED_FUNCTIONS.includes(keyword);
  });

  const VARIABLE = {
    className: "variable",
    begin: /@[a-z0-9]+/,
  };

  const OPERATOR = {
    className: "operator",
    begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0,
  };

  const FUNCTION_CALL = {
    begin: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
    relevance: 0,
    keywords: { built_in: FUNCTIONS }
  };

  // keywords with less than 3 letters are reduced in relevancy
  function reduceRelevancy(list, {
    exceptions, when
  } = {}) {
    const qualifyFn = when;
    exceptions = exceptions || [];
    return list.map((item) => {
      if (item.match(/\|\d+$/) || exceptions.includes(item)) {
        return item;
      } else if (qualifyFn(item)) {
        return `${item}|0`;
      } else {
        return item;
      }
    });
  }

  return {
    name: 'SQL',
    case_insensitive: true,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword:
        reduceRelevancy(KEYWORDS, { when: (x) => x.length < 3 }),
      literal: LITERALS,
      type: TYPES,
      built_in: POSSIBLE_WITHOUT_PARENS
    },
    contains: [
      {
        begin: regex.either(...COMBOS),
        relevance: 0,
        keywords: {
          $pattern: /[\w\.]+/,
          keyword: KEYWORDS.concat(COMBOS),
          literal: LITERALS,
          type: TYPES
        },
      },
      {
        className: "type",
        begin: regex.either(...MULTI_WORD_TYPES)
      },
      FUNCTION_CALL,
      VARIABLE,
      STRING,
      QUOTED_IDENTIFIER,
      hljs.C_NUMBER_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      OPERATOR
    ]
  };
}

module.exports = sql;

},{}],21:[function(require,module,exports){
const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
const KEYWORDS = [
  "as", // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
const LITERALS = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
const TYPES = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];

const ERROR_TYPES = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];

const BUILT_IN_GLOBALS = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",

  "require",
  "exports",

  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];

const BUILT_IN_VARIABLES = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "module",
  "global" // Node.js
];

const BUILT_INS = [].concat(
  BUILT_IN_GLOBALS,
  TYPES,
  ERROR_TYPES
);

/*
Language: JavaScript
Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
Category: common, scripting, web
Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
*/

/** @type LanguageFn */
function javascript(hljs) {
  const regex = hljs.regex;
  /**
   * Takes a string like "<Booger" and checks to see
   * if we can find a matching "</Booger" later in the
   * content.
   * @param {RegExpMatchArray} match
   * @param {{after:number}} param1
   */
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };

  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: '<>',
    end: '</>'
  };
  // to avoid some special cases inside isTrulyOpeningTag
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" ||
        // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ",") {
        response.ignoreMatch();
        return;
      }

      // `<something>`
      // Quite possibly a tag, lets look for a matching closing tag...
      if (nextChar === ">") {
        // if we cannot find a matching closing tag, then we
        // will ignore it
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }

      // `<blah />` (self-closing)
      // handled by simpleSelfClosing rule

      // `<From extends string>`
      // technically this could be HTML, but it smells like a type
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      // NOTE: This is ugh, but added specifically for https://github.com/highlightjs/highlight.js/issues/3276
      if ((m = afterMatch.match(/^\s+extends\s+/))) {
        if (m.index === 0) {
          response.ignoreMatch();
          // eslint-disable-next-line no-useless-return
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };

  // https://tc39.es/ecma262/#sec-literals-numeric-literals
  const decimalDigits = '[0-9](_?[0-9])*';
  const frac = `\\.(${decimalDigits})`;
  // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
  // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: 'number',
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
        `[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" },
    ],
    relevance: 0
  };

  const SUBST = {
    className: 'subst',
    begin: '\\$\\{',
    end: '\\}',
    keywords: KEYWORDS$1,
    contains: [] // defined later
  };
  const HTML_TEMPLATE = {
    begin: 'html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'xml'
    }
  };
  const CSS_TEMPLATE = {
    begin: 'css`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'css'
    }
  };
  const TEMPLATE_STRING = {
    className: 'string',
    begin: '`',
    end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    '\\*/',
    {
      relevance: 0,
      contains: [
        {
          begin: '(?=@[A-Za-z]+)',
          relevance: 0,
          contains: [
            {
              className: 'doctag',
              begin: '@[A-Za-z]+'
            },
            {
              className: 'type',
              begin: '\\{',
              end: '\\}',
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: 'variable',
              begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER,
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS
    .concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: 'params',
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };

  // ES6 classes
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      },

    ]
  };

  const CLASS_REFERENCE = {
    relevance: 0,
    match:
    regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/,
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };

  const USE_STRICT = {
    label: "use_strict",
    className: 'meta',
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };

  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [ PARAMS ],
    illegal: /%/
  };

  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };

  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }

  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS,
        "super"
      ]),
      IDENT_RE$1, regex.lookahead(/\(/)),
    className: "title.function",
    relevance: 0
  };

  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };

  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      { // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };

  const FUNC_LEAD_IN_RE = '(\\(' +
    '[^()]*(\\(' +
    '[^()]*(\\(' +
    '[^()]*' +
    '\\)[^()]*)*' +
    '\\)[^()]*)*' +
    '\\)|' + hljs.UNDERSCORE_IDENT_RE + ')\\s*=>';

  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/, /\s+/,
      IDENT_RE$1, /\s*/,
      /=\s*/,
      /(async\s*)?/, // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };

  return {
    name: 'Javascript',
    aliases: ['js', 'jsx', 'mjs', 'cjs'],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      NUMBER,
      CLASS_REFERENCE,
      {
        className: 'attr',
        begin: IDENT_RE$1 + regex.lookahead(':'),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          { // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          { // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                'on:begin': XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: 'xml',
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ['self']
              }
            ]
          }
        ],
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: '\\b(?!function)' + hljs.UNDERSCORE_IDENT_RE +
          '\\(' + // first parens
          '[^()]*(\\(' +
            '[^()]*(\\(' +
              '[^()]*' +
            '\\)[^()]*)*' +
          '\\)[^()]*)*' +
          '\\)\\s*\\{', // end parens
        returnBegin:true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: '\\$' + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [ /\bconstructor(?=\s*\()/ ],
        className: { 1: "title.function" },
        contains: [ PARAMS ]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}

/*
Language: TypeScript
Author: Panu Horsmalahti <panu.horsmalahti@iki.fi>
Contributors: Ike Ku <dempfi@yahoo.com>
Description: TypeScript is a strict superset of JavaScript
Website: https://www.typescriptlang.org
Category: common, scripting
*/

/** @type LanguageFn */
function typescript(hljs) {
  const tsLanguage = javascript(hljs);

  const IDENT_RE$1 = IDENT_RE;
  const TYPES = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ];
  const NAMESPACE = {
    beginKeywords: 'namespace',
    end: /\{/,
    excludeEnd: true,
    contains: [ tsLanguage.exports.CLASS_REFERENCE ]
  };
  const INTERFACE = {
    beginKeywords: 'interface',
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: 'interface extends',
      built_in: TYPES
    },
    contains: [ tsLanguage.exports.CLASS_REFERENCE ]
  };
  const USE_STRICT = {
    className: 'meta',
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  };
  const TS_SPECIFIC_KEYWORDS = [
    "type",
    "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override"
  ];
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS.concat(TS_SPECIFIC_KEYWORDS),
    literal: LITERALS,
    built_in: BUILT_INS.concat(TYPES),
    "variable.language": BUILT_IN_VARIABLES
  };
  const DECORATOR = {
    className: 'meta',
    begin: '@' + IDENT_RE$1,
  };

  const swapMode = (mode, label, replacement) => {
    const indx = mode.contains.findIndex(m => m.label === label);
    if (indx === -1) { throw new Error("can not find mode to replace"); }

    mode.contains.splice(indx, 1, replacement);
  };


  // this should update anywhere keywords is used since
  // it will be the same actual JS object
  Object.assign(tsLanguage.keywords, KEYWORDS$1);

  tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
  tsLanguage.contains = tsLanguage.contains.concat([
    DECORATOR,
    NAMESPACE,
    INTERFACE,
  ]);

  // TS gets a simpler shebang rule than JS
  swapMode(tsLanguage, "shebang", hljs.SHEBANG());
  // JS use strict rule purposely excludes `asm` which makes no sense
  swapMode(tsLanguage, "use_strict", USE_STRICT);

  const functionDeclaration = tsLanguage.contains.find(m => m.label === "func.def");
  functionDeclaration.relevance = 0; // () => {} is more typical in TypeScript

  Object.assign(tsLanguage, {
    name: 'TypeScript',
    aliases: [
      'ts',
      'tsx'
    ]
  });

  return tsLanguage;
}

module.exports = typescript;

},{}],22:[function(require,module,exports){
/*
Language: HTML, XML
Website: https://www.w3.org/XML/
Category: common, web
Audit: 2020
*/

/** @type LanguageFn */
function xml(hljs) {
  const regex = hljs.regex;
  // XML names can have the following additional letters: https://www.w3.org/TR/xml/#NT-NameChar
  // OTHER_NAME_CHARS = /[:\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]/;
  // Element names start with NAME_START_CHAR followed by optional other Unicode letters, ASCII digits, hyphens, underscores, and periods
  // const TAG_NAME_RE = regex.concat(/[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, regex.optional(/[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*:/), /[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*/);;
  // const XML_IDENT_RE = /[A-Z_a-z:\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]+/;
  // const TAG_NAME_RE = regex.concat(/[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, regex.optional(/[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*:/), /[A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*/);
  // however, to cater for performance and more Unicode support rely simply on the Unicode letter class
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: 'symbol',
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const XML_META_KEYWORDS = {
    begin: /\s/,
    contains: [
      {
        className: 'keyword',
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  };
  const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
    begin: /\(/,
    end: /\)/
  });
  const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: 'string' });
  const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: 'string' });
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [ XML_ENTITIES ]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [ XML_ENTITIES ]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: 'HTML, XML',
    aliases: [
      'html',
      'xhtml',
      'rss',
      'atom',
      'xjb',
      'xsd',
      'xsl',
      'plist',
      'wsf',
      'svg'
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: 'meta',
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          XML_META_KEYWORDS,
          QUOTE_META_STRING_MODE,
          APOS_META_STRING_MODE,
          XML_META_PAR_KEYWORDS,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: 'meta',
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  XML_META_KEYWORDS,
                  XML_META_PAR_KEYWORDS,
                  QUOTE_META_STRING_MODE,
                  APOS_META_STRING_MODE
                ]
              }
            ]
          }
        ]
      },
      hljs.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      XML_ENTITIES,
      // xml processing instructions
      {
        className: 'meta',
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              QUOTE_META_STRING_MODE
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/,
          }
        ]

      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: 'style' },
        contains: [ TAG_INTERNALS ],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            'css',
            'xml'
          ]
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: 'script' },
        contains: [ TAG_INTERNALS ],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            'javascript',
            'handlebars',
            'xml'
          ]
        }
      },
      // we need this for now for jSX
      {
        className: 'tag',
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: 'tag',
        begin: regex.concat(
          /</,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            // <tag/>
            // <tag>
            // <tag ...
            regex.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: 'name',
            begin: TAG_NAME_RE,
            relevance: 0,
            starts: TAG_INTERNALS
          }
        ]
      },
      // close tag
      {
        className: 'tag',
        begin: regex.concat(
          /<\//,
          regex.lookahead(regex.concat(
            TAG_NAME_RE, />/
          ))
        ),
        contains: [
          {
            className: 'name',
            begin: TAG_NAME_RE,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
}

module.exports = xml;

},{}],23:[function(require,module,exports){
/*
Language: YAML
Description: Yet Another Markdown Language
Author: Stefan Wienert <stwienert@gmail.com>
Contributors: Carl Baxter <carl@cbax.tech>
Requires: ruby.js
Website: https://yaml.org
Category: common, config
*/
function yaml(hljs) {
  const LITERALS = 'true false yes no null';

  // YAML spec allows non-reserved URI characters in tags.
  const URI_CHARACTERS = '[\\w#;/?:@&=+$,.~*\'()[\\]]+';

  // Define keys as starting with a word character
  // ...containing word chars, spaces, colons, forward-slashes, hyphens and periods
  // ...and ending with a colon followed immediately by a space, tab or newline.
  // The YAML spec allows for much more than this, but this covers most use-cases.
  const KEY = {
    className: 'attr',
    variants: [
      { begin: '\\w[\\w :\\/.-]*:(?=[ \t]|$)' },
      { // double quoted keys
        begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' },
      { // single quoted keys
        begin: '\'\\w[\\w :\\/.-]*\':(?=[ \t]|$)' }
    ]
  };

  const TEMPLATE_VARIABLES = {
    className: 'template-variable',
    variants: [
      { // jinja templates Ansible
        begin: /\{\{/,
        end: /\}\}/
      },
      { // Ruby i18n
        begin: /%\{/,
        end: /\}/
      }
    ]
  };
  const STRING = {
    className: 'string',
    relevance: 0,
    variants: [
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      },
      { begin: /\S+/ }
    ],
    contains: [
      hljs.BACKSLASH_ESCAPE,
      TEMPLATE_VARIABLES
    ]
  };

  // Strings inside of value containers (objects) can't contain braces,
  // brackets, or commas
  const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
    {
      begin: /'/,
      end: /'/
    },
    {
      begin: /"/,
      end: /"/
    },
    { begin: /[^\s,{}[\]]+/ }
  ] });

  const DATE_RE = '[0-9]{4}(-[0-9][0-9]){0,2}';
  const TIME_RE = '([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?';
  const FRACTION_RE = '(\\.[0-9]*)?';
  const ZONE_RE = '([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?';
  const TIMESTAMP = {
    className: 'number',
    begin: '\\b' + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + '\\b'
  };

  const VALUE_CONTAINER = {
    end: ',',
    endsWithParent: true,
    excludeEnd: true,
    keywords: LITERALS,
    relevance: 0
  };
  const OBJECT = {
    begin: /\{/,
    end: /\}/,
    contains: [ VALUE_CONTAINER ],
    illegal: '\\n',
    relevance: 0
  };
  const ARRAY = {
    begin: '\\[',
    end: '\\]',
    contains: [ VALUE_CONTAINER ],
    illegal: '\\n',
    relevance: 0
  };

  const MODES = [
    KEY,
    {
      className: 'meta',
      begin: '^---\\s*$',
      relevance: 10
    },
    { // multi line string
      // Blocks start with a | or > followed by a newline
      //
      // Indentation of subsequent lines must be the same to
      // be considered part of the block
      className: 'string',
      begin: '[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*'
    },
    { // Ruby/Rails erb
      begin: '<%[%=-]?',
      end: '[%-]?%>',
      subLanguage: 'ruby',
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    },
    { // named tags
      className: 'type',
      begin: '!\\w+!' + URI_CHARACTERS
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    { // verbatim tags
      className: 'type',
      begin: '!<' + URI_CHARACTERS + ">"
    },
    { // primary tags
      className: 'type',
      begin: '!' + URI_CHARACTERS
    },
    { // secondary tags
      className: 'type',
      begin: '!!' + URI_CHARACTERS
    },
    { // fragment id &ref
      className: 'meta',
      begin: '&' + hljs.UNDERSCORE_IDENT_RE + '$'
    },
    { // fragment reference *ref
      className: 'meta',
      begin: '\\*' + hljs.UNDERSCORE_IDENT_RE + '$'
    },
    { // array listing
      className: 'bullet',
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: '-(?=[ ]|$)',
      relevance: 0
    },
    hljs.HASH_COMMENT_MODE,
    {
      beginKeywords: LITERALS,
      keywords: { literal: LITERALS }
    },
    TIMESTAMP,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: 'number',
      begin: hljs.C_NUMBER_RE + '\\b',
      relevance: 0
    },
    OBJECT,
    ARRAY,
    STRING
  ];

  const VALUE_MODES = [ ...MODES ];
  VALUE_MODES.pop();
  VALUE_MODES.push(CONTAINER_STRING);
  VALUE_CONTAINER.contains = VALUE_MODES;

  return {
    name: 'YAML',
    case_insensitive: true,
    aliases: [ 'yml' ],
    contains: MODES
  };
}

module.exports = yaml;

},{}],24:[function(require,module,exports){
// jshint multistr:true

(function (w, d) {
    'use strict';

    var TABLE_NAME = 'hljs-ln',
        LINE_NAME = 'hljs-ln-line',
        CODE_BLOCK_NAME = 'hljs-ln-code',
        NUMBERS_BLOCK_NAME = 'hljs-ln-numbers',
        NUMBER_LINE_NAME = 'hljs-ln-n',
        DATA_ATTR_NAME = 'data-line-number',
        BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

    if (w.hljs) {
        w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
        w.hljs.lineNumbersBlock = lineNumbersBlock;
        w.hljs.lineNumbersValue = lineNumbersValue;

        addStyles();
    } else {
        w.console.error('highlight.js not detected!');
    }

    function isHljsLnCodeDescendant(domElt) {
        var curElt = domElt;
        while (curElt) {
            if (curElt.className && curElt.className.indexOf('hljs-ln-code') !== -1) {
                return true;
            }
            curElt = curElt.parentNode;
        }
        return false;
    }

    function getHljsLnTable(hljsLnDomElt) {
        var curElt = hljsLnDomElt;
        while (curElt.nodeName !== 'TABLE') {
            curElt = curElt.parentNode;
        }
        return curElt;
    }

    // Function to workaround a copy issue with Microsoft Edge.
    // Due to hljs-ln wrapping the lines of code inside a <table> element,
    // itself wrapped inside a <pre> element, window.getSelection().toString()
    // does not contain any line breaks. So we need to get them back using the
    // rendered code in the DOM as reference.
    function edgeGetSelectedCodeLines(selection) {
        // current selected text without line breaks
        var selectionText = selection.toString();

        // get the <td> element wrapping the first line of selected code
        var tdAnchor = selection.anchorNode;
        while (tdAnchor.nodeName !== 'TD') {
            tdAnchor = tdAnchor.parentNode;
        }

        // get the <td> element wrapping the last line of selected code
        var tdFocus = selection.focusNode;
        while (tdFocus.nodeName !== 'TD') {
            tdFocus = tdFocus.parentNode;
        }

        // extract line numbers
        var firstLineNumber = parseInt(tdAnchor.dataset.lineNumber);
        var lastLineNumber = parseInt(tdFocus.dataset.lineNumber);

        // multi-lines copied case
        if (firstLineNumber != lastLineNumber) {

            var firstLineText = tdAnchor.textContent;
            var lastLineText = tdFocus.textContent;

            // if the selection was made backward, swap values
            if (firstLineNumber > lastLineNumber) {
                var tmp = firstLineNumber;
                firstLineNumber = lastLineNumber;
                lastLineNumber = tmp;
                tmp = firstLineText;
                firstLineText = lastLineText;
                lastLineText = tmp;
            }

            // discard not copied characters in first line
            while (selectionText.indexOf(firstLineText) !== 0) {
                firstLineText = firstLineText.slice(1);
            }

            // discard not copied characters in last line
            while (selectionText.lastIndexOf(lastLineText) === -1) {
                lastLineText = lastLineText.slice(0, -1);
            }

            // reconstruct and return the real copied text
            var selectedText = firstLineText;
            var hljsLnTable = getHljsLnTable(tdAnchor);
            for (var i = firstLineNumber + 1 ; i < lastLineNumber ; ++i) {
                var codeLineSel = format('.{0}[{1}="{2}"]', [CODE_BLOCK_NAME, DATA_ATTR_NAME, i]);
                var codeLineElt = hljsLnTable.querySelector(codeLineSel);
                selectedText += '\n' + codeLineElt.textContent;
            }
            selectedText += '\n' + lastLineText;
            return selectedText;
        // single copied line case
        } else {
            return selectionText;
        }
    }

    // ensure consistent code copy/paste behavior across all browsers
    // (see https://github.com/wcoder/highlightjs-line-numbers.js/issues/51)
    document.addEventListener('copy', function(e) {
        // get current selection
        var selection = window.getSelection();
        // override behavior when one wants to copy line of codes
        if (isHljsLnCodeDescendant(selection.anchorNode)) {
            var selectionText;
            // workaround an issue with Microsoft Edge as copied line breaks
            // are removed otherwise from the selection string
            if (window.navigator.userAgent.indexOf('Edge') !== -1) {
                selectionText = edgeGetSelectedCodeLines(selection);
            } else {
                // other browsers can directly use the selection string
                selectionText = selection.toString();
            }
            e.clipboardData.setData('text/plain', selectionText);
            e.preventDefault();
        }
    });

    function addStyles () {
        var css = d.createElement('style');
        css.type = 'text/css';
        css.innerHTML = format(
            '.{0}{border-collapse:collapse}' +
            '.{0} td{padding:0}' +
            '.{1}:before{content:attr({2})}',
        [
            TABLE_NAME,
            NUMBER_LINE_NAME,
            DATA_ATTR_NAME
        ]);
        d.getElementsByTagName('head')[0].appendChild(css);
    }

    function initLineNumbersOnLoad (options) {
        if (d.readyState === 'interactive' || d.readyState === 'complete') {
            documentReady(options);
        } else {
            w.addEventListener('DOMContentLoaded', function () {
                documentReady(options);
            });
        }
    }

    function documentReady (options) {
        try {
            var blocks = d.querySelectorAll('code.hljs,code.nohighlight');

            for (var i in blocks) {
                if (blocks.hasOwnProperty(i)) {
                    if (!isPluginDisabledForBlock(blocks[i])) {
                        lineNumbersBlock(blocks[i], options);
                    }
                }
            }
        } catch (e) {
            w.console.error('LineNumbers error: ', e);
        }
    }

    function isPluginDisabledForBlock(element) {
        return element.classList.contains('nohljsln');
    }

    function lineNumbersBlock (element, options) {
        if (typeof element !== 'object') return;

        async(function () {
            element.innerHTML = lineNumbersInternal(element, options);
        });
    }

    function lineNumbersValue (value, options) {
        if (typeof value !== 'string') return;

        var element = document.createElement('code')
        element.innerHTML = value

        return lineNumbersInternal(element, options);
    }

    function lineNumbersInternal (element, options) {

        var internalOptions = mapOptions(element, options);

        duplicateMultilineNodes(element);

        return addLineNumbersBlockFor(element.innerHTML, internalOptions);
    }

    function addLineNumbersBlockFor (inputHtml, options) {
        var lines = getLines(inputHtml);

        // if last line contains only carriage return remove it
        if (lines[lines.length-1].trim() === '') {
            lines.pop();
        }

        if (lines.length > 1 || options.singleLine) {
            var html = '';

            for (var i = 0, l = lines.length; i < l; i++) {
                html += format(
                    '<tr>' +
                        '<td class="{0} {1}" {3}="{5}">' +
                            '<div class="{2}" {3}="{5}"></div>' +
                        '</td>' +
                        '<td class="{0} {4}" {3}="{5}">' +
                            '{6}' +
                        '</td>' +
                    '</tr>',
                [
                    LINE_NAME,
                    NUMBERS_BLOCK_NAME,
                    NUMBER_LINE_NAME,
                    DATA_ATTR_NAME,
                    CODE_BLOCK_NAME,
                    i + options.startFrom,
                    lines[i].length > 0 ? lines[i] : ' '
                ]);
            }

            return format('<table class="{0}">{1}</table>', [ TABLE_NAME, html ]);
        }

        return inputHtml;
    }

    /**
     * @param {HTMLElement} element Code block.
     * @param {Object} options External API options.
     * @returns {Object} Internal API options.
     */
    function mapOptions (element, options) {
        options = options || {};
        return {
            singleLine: getSingleLineOption(options),
            startFrom: getStartFromOption(element, options)
        };
    }

    function getSingleLineOption (options) {
        var defaultValue = false;
        if (!!options.singleLine) {
            return options.singleLine;
        }
        return defaultValue;
    }

    function getStartFromOption (element, options) {
        var defaultValue = 1;
        var startFrom = defaultValue;

        if (isFinite(options.startFrom)) {
            startFrom = options.startFrom;
        }

        // can be overridden because local option is priority
        var value = getAttribute(element, 'data-ln-start-from');
        if (value !== null) {
            startFrom = toNumber(value, defaultValue);
        }

        return startFrom;
    }

    /**
     * Recursive method for fix multi-line elements implementation in highlight.js
     * Doing deep passage on child nodes.
     * @param {HTMLElement} element
     */
    function duplicateMultilineNodes (element) {
        var nodes = element.childNodes;
        for (var node in nodes) {
            if (nodes.hasOwnProperty(node)) {
                var child = nodes[node];
                if (getLinesCount(child.textContent) > 0) {
                    if (child.childNodes.length > 0) {
                        duplicateMultilineNodes(child);
                    } else {
                        duplicateMultilineNode(child.parentNode);
                    }
                }
            }
        }
    }

    /**
     * Method for fix multi-line elements implementation in highlight.js
     * @param {HTMLElement} element
     */
    function duplicateMultilineNode (element) {
        var className = element.className;

        if ( ! /hljs-/.test(className)) return;

        var lines = getLines(element.innerHTML);

        for (var i = 0, result = ''; i < lines.length; i++) {
            var lineText = lines[i].length > 0 ? lines[i] : ' ';
            result += format('<span class="{0}">{1}</span>\n', [ className,  lineText ]);
        }

        element.innerHTML = result.trim();
    }

    function getLines (text) {
        if (text.length === 0) return [];
        return text.split(BREAK_LINE_REGEXP);
    }

    function getLinesCount (text) {
        return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
    }

    ///
    /// HELPERS
    ///

    function async (func) {
        w.setTimeout(func, 0);
    }

    /**
     * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
     * @param {string} format
     * @param {array} args
     */
    function format (format, args) {
        return format.replace(/\{(\d+)\}/g, function(m, n){
            return args[n] !== undefined ? args[n] : m;
        });
    }

    /**
     * @param {HTMLElement} element Code block.
     * @param {String} attrName Attribute name.
     * @returns {String} Attribute value or empty.
     */
    function getAttribute (element, attrName) {
        return element.hasAttribute(attrName) ? element.getAttribute(attrName) : null;
    }

    /**
     * @param {String} str Source string.
     * @param {Number} fallback Fallback value.
     * @returns Parsed number or fallback value.
     */
    function toNumber (str, fallback) {
        if (!str) return fallback;
        var number = Number(str);
        return isFinite(number) ? number : fallback;
    }

}(window, document));

},{}]},{},[2]);
