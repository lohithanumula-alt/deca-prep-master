"use client";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-blue-700 mt-4 mb-1">
            {renderInline(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {renderInline(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">
            {renderInline(line.slice(2))}
          </h1>
        );
      }
      // List items
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={i} className="ml-4 text-gray-700 mb-1 list-disc list-inside">
            {renderInline(line.slice(2))}
          </li>
        );
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, "");
        elements.push(
          <li key={i} className="ml-4 text-gray-700 mb-1 list-decimal list-inside">
            {renderInline(content)}
          </li>
        );
      }
      // Empty line
      else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={i} className="text-gray-700 mb-1 leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
        }
        parts.push(<strong key={key++} className="text-gray-900 font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Italic
      const italicMatch = remaining.match(/\*(.+?)\*/);
      if (italicMatch && italicMatch.index !== undefined) {
        if (italicMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, italicMatch.index)}</span>);
        }
        parts.push(<em key={key++} className="text-blue-700 italic">{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
        continue;
      }

      // Code
      const codeMatch = remaining.match(/`(.+?)`/);
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
        }
        parts.push(
          <code key={key++} className="bg-gray-100 text-green-700 px-1 rounded text-sm">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
        continue;
      }

      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    return <>{parts}</>;
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}
