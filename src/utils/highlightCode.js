import 'highlight.js/styles/default.css';

import { registerLanguage, highlightAuto } from 'highlight.js/lib/highlight';
import highlightJavascript from 'highlight.js/lib/languages/javascript';
import highlightPython from 'highlight.js/lib/languages/python';
import highlightXml from 'highlight.js/lib/languages/xml';

registerLanguage('javascript', highlightJavascript);
registerLanguage('python', highlightPython);
registerLanguage('xml', highlightXml);

/**
 * hightlights code with hightlight.js
 * @param {string} source
 * @returns {string}
 */
export default function highlightCode(source) {
  return highlightAuto(source).value;
}
