import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, rows = 3, maxRows = 10, autoResize = false, ...props }, ref) => {
  const textareaRef = React.useRef(null);
  const combinedRef = useCombinedRefs(ref, textareaRef);
  
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      adjustHeight();
    }
  }, [props.value, autoResize]);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the number of rows based on scrollHeight
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
    const currentRows = Math.ceil((textarea.scrollHeight - paddingTop - paddingBottom) / lineHeight);
    
    // Set the height based on content but limit to maxRows
    const newRows = Math.min(Math.max(rows, currentRows), maxRows);
    textarea.style.height = `${newRows * lineHeight + paddingTop + paddingBottom}px`;
  };
  
  const handleInput = (e) => {
    if (autoResize) {
      adjustHeight();
    }
    props.onInput?.(e);
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-y-hidden",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      rows={rows}
      ref={combinedRef}
      onInput={handleInput}
      {...props}
    />
  )
});

// Utility to combine refs
function useCombinedRefs(...refs) {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);
  
  return targetRef;
}

Textarea.displayName = "Textarea";

export { Textarea }
