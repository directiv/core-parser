/**
 * Module dependencies
 */

var htmlparser = require('htmlparser2');

module.exports = function(html) {
  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) throw err;
    return dom;
  }, {
    normalizeWhitespace: true
  });

  var parser = new htmlparser.Parser(handler, {
    recognizeSelfClosing: true
  });
  parser.write(html);
  parser.end();
  return transform(handler.dom);
};

function transform(dom) {
  if (Array.isArray(dom)) return dom.map(transform).filter(notNull);
  if (dom.type === 'text' && dom.data === ' ') return null;
  if (dom.type === 'comment') return null;

  dom.props = dom.attribs || {};

  dom.children = transform(dom.children || []);

  dom.tag = dom.name;
  dom.type = dom.type;
  delete dom.next;
  delete dom.prev;
  delete dom.parent;

  return dom;
}

function notNull(item) {
  return item !== null;
}
