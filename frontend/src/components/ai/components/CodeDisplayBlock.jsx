import { useState, useEffect } from "react";
import hljs from "highlight.js";
import { fonts } from "../../../options";
import "../features/CodeBlock.css";
import { usePreferencesStore } from "../../../store/use-preferences-store";

/**
 * A reusable component for displaying code with syntax highlighting
 * To be used across all AI features for consistent code display
 */
const CodeDisplayBlock = ({ 
  code, 
  language = "plaintext",
  provider = null,
  showHeader = true,
  maxHeight = "96",
  title = "Generated Code"
}) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const fontStyle = usePreferencesStore(state => state.fontStyle);
  
  // Apply syntax highlighting when code or language changes
  useEffect(() => {
    if (!code) return;
    
    try {
      // Apply syntax highlighting
      const highlighted = hljs.highlight(code, { 
        language: language || "plaintext"
      }).value;
      setHighlightedCode(highlighted);
    } catch (err) {
      console.error("Error highlighting code:", err);
      setHighlightedCode(code); // Fallback to plain text
    }
  }, [code, language]);
  
  return (
    <div className="relative">
      {provider && (
        <div className="absolute top-0 right-0 p-1.5 bg-neutral-800/70 rounded-bl rounded-tr-lg border-b border-l border-neutral-700/50 z-10">
          <div className="flex items-center text-xs text-neutral-400 gap-1.5 px-1">
            <span className="font-mono bg-neutral-700/50 px-1.5 py-0.5 rounded">{language}</span>
            {provider && (
              <>
                <span>•</span>
                <span>{provider}</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Code editor style header */}
      {showHeader && (
        <div className="rounded-t-lg bg-neutral-900 border-x border-t border-neutral-700/50 px-4 py-2 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="rounded-full h-2.5 w-2.5 bg-red-500/70"></div>
            <div className="rounded-full h-2.5 w-2.5 bg-yellow-500/70"></div>
            <div className="rounded-full h-2.5 w-2.5 bg-green-500/70"></div>
          </div>
          <div className="text-xs text-neutral-400 font-medium">
            {title}
          </div>
          <div className="w-16"></div> {/* Empty space to balance the layout */}
        </div>
      )}
      
      {/* Code display with syntax highlighting */}
      <div 
        className={`bg-neutral-800/80 ${showHeader ? 'rounded-b-lg' : 'rounded-lg'} p-4 text-sm text-neutral-100 whitespace-pre-wrap max-h-${maxHeight} overflow-y-auto border border-neutral-700/50 shadow-inner`}
        style={{ fontFamily: fonts[fontStyle]?.name || 'monospace' }}
      >
        {highlightedCode ? (
          <pre 
            className="code-container" 
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <pre>{code}</pre>
        )}
      </div>
    </div>
  );
};

export default CodeDisplayBlock;
