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
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));

window.hljs = hljs;

// NOTE: 原始的包没有导出
// const highlightjsCopy = require('highlightjs-copy')
const plugins = require('./highlightPlugins.js')

require('highlightjs-line-numbers.js')

hljs.configure({
    ignoreUnescapedHTML: true,
});
hljs.initLineNumbersOnLoad();
hljs.addPlugin(new plugins.CopyButtonPlugin());
document.addEventListener('DOMContentLoaded', (event) => {
    hljs.highlightAll();
});