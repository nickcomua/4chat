import { Effect } from "effect";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import DOMPurify from "isomorphic-dompurify"
import markedKatex from "marked-katex-extension";
import katex from "katex";
// Create a marked instance with highlight.js integration
const markedInstance = new Marked(
    markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang) {
            try {
                const language = hljs.getLanguage(lang) ? lang : "plaintext";
                return hljs.highlight(code, { language }).value;
            } catch (error) {
                console.error("Highlight.js error:", error);
                return code; // Fallback to plain text if highlighting fails
            }
        },
    }),
    markedKatex({
        nonStandard: true,
        throwOnError: false
    })
);
// Effect for parsing markdown with syntax highlighting
export const parseMarkdown = (markdown: string) =>
    Effect.try({
        try: () => 
            DOMPurify.sanitize(markedInstance.parse(markdown) as string)
        ,
        catch: (error) => {
            console.error("Markdown parsing error:", error);
            return `Error parsing markdown: ${error instanceof Error ? error.message : String(error)}`;
        },
    });

// Example usage:
// const result = await Effect.runPromise(parseMarkdown("```javascript\nconst code = 'example';\n```")); 