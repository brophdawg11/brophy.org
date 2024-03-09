import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import prism from 'prismjs';

const markedWithHighlighting = new Marked(
  markedHighlight({
    //langPrefix: 'hljs language-',
    highlight(code, lang) {
      return prism.highlight(code, prism.languages[lang], lang);
    },
  }),
);

export function md(str: string): string {
  return markedWithHighlighting.parse(str) as string;
}
