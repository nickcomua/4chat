import { useState } from "react";
import { Download, Check, Copy, Text, WrapText } from "lucide-react";
import hljs from "highlight.js";
import { toast } from "sonner";

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isWrapped, setIsWrapped] = useState(false);

    const validLanguage = hljs.getLanguage(language || '') ? language : 'plaintext';
    const highlightedCode = hljs.highlight(code, { language: validLanguage || 'plaintext' }).value;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Copied!")
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${validLanguage || 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative mt-2 flex w-full flex-col pt-9">
            <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-between rounded-t bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                <span className="font-mono">{validLanguage}</span>
                <div>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs size-8 rounded-md bg-secondary p-2 transition-colors hover:bg-muted-foreground/10 hover:text-muted-foreground dark:hover:bg-muted-foreground/5"
                    >
                        <Download className="size-4" />
                    </button>
                    <button
                        onClick={() => setIsWrapped(!isWrapped)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs mr-6 size-8 rounded-md bg-secondary p-2 transition-colors hover:bg-muted-foreground/10 hover:text-muted-foreground dark:hover:bg-muted-foreground/5"
                        aria-label={isWrapped ? "Disable text wrapping" : "Enable text wrapping"}
                    >
                        {isWrapped ?
                            <WrapText className="size-4" /> :
                            <Text className="size-4" />}
                    </button>
                </div>
            </div>
            <div className="sticky left-auto z-[1] ml-auto h-1.5 w-8 transition-[top] top-7 max-900:top-[74px]">
                <div className="absolute -top-[calc(2rem+2px)] right-2 flex gap-1">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 text-xs size-8 rounded-md bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-muted-foreground/10 hover:text-muted-foreground dark:hover:bg-muted-foreground/5"
                        aria-label="Copy code to clipboard"
                    >
                        <div className="relative size-4">
                            <Copy
                                className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                                    }`}
                            />
                            <Check
                                className={`absolute inset-0 transition-all duration-200 ease-snappy ${isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                    }`}
                            />
                        </div>
                    </button>
                </div>
            </div>
            <div className="-mb-1.5"></div>
            <div className="shiki not-prose relative bg-chat-accent text-sm font-[450] text-secondary-foreground [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:px-[1em] [&_pre]:py-[1em]">
                <pre
                    className={`shiki T3 Dark ${isWrapped ? "whitespace-pre-wrap" : ""}`}
                    tabIndex={-1}
                    style={{ backgroundColor: "rgb(29, 25, 33)", color: "rgb(210, 199, 225)" }}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </div>
        </div>
    );
} 