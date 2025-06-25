import { useState, useEffect } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { MessageSquareIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";
import CodeDisplayBlock from "../components/CodeDisplayBlock";

const ExplainCodeContent = ({ code, language, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [modelProvider, setModelProvider] = useState("gemini");
  const [extractedCode, setExtractedCode] = useState("");
  
  const modelProviders = [
    { value: "gemini", label: "Gemini" },
    { value: "groq", label: "Groq" }
  ];

  // Extract code blocks from response
  const extractCode = (responseText) => {
    // First try the standard code block format
    let codeMatch = responseText.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    
    // If that doesn't work, try without newlines around the code
    if (!codeMatch) {
      codeMatch = responseText.match(/```(?:\w+)?([^`]+)```/);
    }
    
    // If still no match, try to extract any content between triple backticks
    if (!codeMatch) {
      codeMatch = responseText.match(/```([\s\S]*?)```/);
    }
    
    if (codeMatch) {
      return codeMatch[1].trim();
    } else {
      // For ExplainCode, we treat the entire response as an explanation, not code
      return ""; // Return empty since this is mainly for explanation text
    }
  };
  
  // Update extracted code when response changes
  useEffect(() => {
    if (response) {
      setExtractedCode(extractCode(response));
    }
  }, [response]);

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("Please add some code first!");
      return;
    }
    
    setIsLoading(true);
    const toastId = "explain-toast";
    try {
      toast.loading(`Analyzing code with ${modelProvider}...`, { id: toastId });
      const result = await aiService.explainCode(code, language, modelProvider);
      setResponse(result);
      toast.success(`Code explanation generated using ${modelProvider}!`, { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to explain code";
      if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: toastId });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = () => {
    // For explanations, we want to copy the full explanation
    navigator.clipboard.writeText(response);
    toast.success("Explanation copied to clipboard!");
  };
  const applyToEditor = () => {
    // For explanations, we add the explanation as a comment block
    let commentedExplanation;
    
    if (language === 'python') {
      commentedExplanation = `"""\n${response}\n"""`;
    } else {
      commentedExplanation = `/**\n * ${response.replace(/\n/g, '\n * ')}\n */`;
    }
    
    const currentCode = usePreferencesStore.getState().code;
    usePreferencesStore.setState({ 
      code: commentedExplanation + '\n\n' + currentCode
    });
    
    toast.success("Explanation added as comment to editor!");
    onClose();
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm text-neutral-400 mb-1 block">
            Model Provider
          </label>
          <Select
            value={modelProvider}
            onValueChange={setModelProvider}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Select model provider" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
              {modelProviders.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleExplain}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <span>Explain Code</span>
            )}
          </Button>
        </div>
      </div>      {response && (
        <Card className="bg-neutral-900/70 backdrop-blur border-neutral-800/70 shadow-xl animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <div className="p-4">
            <div className="relative">
              <div className="absolute top-0 right-0 p-1.5 bg-neutral-800/70 rounded-bl rounded-tr-lg border-b border-l border-neutral-700/50 z-10">
                <div className="flex items-center text-xs text-neutral-400 gap-1.5 px-1">
                  <span className="font-mono bg-neutral-700/50 px-1.5 py-0.5 rounded">{language}</span>
                  <span>•</span>
                  <span>{modelProvider}</span>
                </div>
              </div>
              
              {/* Code editor style header for consistency with CodeDisplayBlock */}
              <div className="rounded-t-lg bg-neutral-900 border-x border-t border-neutral-700/50 px-4 py-2 flex justify-between items-center">
                <div className="flex gap-1.5">
                  <div className="rounded-full h-2.5 w-2.5 bg-red-500/70"></div>
                  <div className="rounded-full h-2.5 w-2.5 bg-yellow-500/70"></div>
                  <div className="rounded-full h-2.5 w-2.5 bg-green-500/70"></div>
                </div>
                <div className="text-xs text-neutral-400 font-medium">
                  Code Explanation
                </div>
                <div className="w-16"></div> {/* Empty space to balance the layout */}
              </div>
              
              {/* Styled explanation block matching CodeDisplayBlock styling */}
              <div className="bg-neutral-800/80 rounded-b-lg p-4 text-sm text-neutral-100 whitespace-pre-wrap max-h-96 overflow-y-auto border border-neutral-700/50 shadow-inner">
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-blue-300 prose-pre:bg-neutral-900/70 prose-pre:border prose-pre:border-neutral-700/50 prose-pre:rounded prose-code:text-cyan-300 prose-code:bg-neutral-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-strong:text-blue-200 prose-a:text-blue-400 prose-p:leading-relaxed">
                  {response}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="bg-neutral-800/70 border-neutral-700 hover:bg-neutral-700/90 hover:border-blue-500/30 flex-1 text-sm transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 group-hover:text-blue-400 transition-colors"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12c0-1.1.9-2 2-2h2"/><path d="M4 8c0-1.1.9-2 2-2h2"/></svg>
                <span className="group-hover:text-blue-300 transition-colors">Copy Explanation</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={applyToEditor}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-transparent text-white flex-1 text-sm shadow-md shadow-blue-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 transition-transform group-hover:scale-110"><path d="M12 20v-6m0 0 3 3m-3-3-3 3"/><path d="M17 17v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M21 15V9"/><path d="M21 15h-4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h4"/></svg>
                Add as Comment
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const ExplainCode = {
  id: "explain",
  title: "Explain Code",
  description: "Get a clear explanation of what this code does",
  icon: MessageSquareIcon,
  color: "from-blue-500 to-cyan-500",
    execute(code, language, callbacks) {
    const { setModalContent, setShowModal } = callbacks;
    
    setModalContent(
      <FeatureModal
        isOpen={true}
        onClose={() => setShowModal(false)}
        title="Explain Code"
        description="Get a clear explanation of your code"
        icon={MessageSquareIcon}
        color="from-blue-500 to-cyan-500"
      >
        <ExplainCodeContent 
          code={code} 
          language={language} 
          onClose={() => setShowModal(false)}
        />
      </FeatureModal>
    );
    
    setShowModal(true);
  },
  
  // New method to render directly in the sidebar
  executeInline(code, language, callbacks) {
    const { setFeatureContent } = callbacks;
    
    setFeatureContent(
      <ExplainCodeContent 
        code={code} 
        language={language} 
        onClose={() => callbacks.setActiveFeature(null)}
      />
    );
  }
};

export default ExplainCode;
