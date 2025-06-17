import Markdown from "marked-react";
import { CodeBlock } from "@/components/ui/code-block";

interface MarkdownRendererProps {
  content: string;
}

const renderer = {
  code(snippet: string, lang: string) {
    return <CodeBlock key={snippet} code={snippet} language={lang} />;
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <Markdown value={content} renderer={renderer} />
  );
} 