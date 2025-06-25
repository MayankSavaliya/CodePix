import { useState, useEffect } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { SparklesIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";
import CodeDisplayBlock from "../components/CodeDisplayBlock";
import "./CodeBlock.css";

const GenerateCodeContent = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("javascript");
  const [complexity, setComplexity] = useState("intermediate");
  const [modelProvider, setModelProvider] = useState("gemini");
  const [extractedCode, setExtractedCode] = useState("");

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
      // If all else fails, use the entire response as code
      return responseText.trim();
    }
  };
  
  // Update extracted code when response changes
  useEffect(() => {
    if (response) {
      setExtractedCode(extractCode(response));
    }
  }, [response]);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" }
  ];

  const complexityLevels = [
    { value: "simple", label: "Simple", description: "Basic implementation with minimal features" },
    { value: "intermediate", label: "Intermediate", description: "Includes error handling and best practices" },
    { value: "advanced", label: "Advanced", description: "Complex implementation with optimizations" }
  ];
  
  const modelProviders = [
    { value: "gemini", label: "Gemini" },
    { value: "groq", label: "Groq" }
  ];  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what code you want to generate!");
      return;
    }
    
    setIsLoading(true);
    setResponse(""); // Clear any previous response
    setError(null); // Clear any previous errors
    
    const toastId = "generate-toast";
    try {
      toast.loading(`Generating code with ${modelProvider}...`, { id: toastId });
      
      // Add a timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const result = await aiService.generateCode(prompt, targetLanguage, complexity, modelProvider);
      clearTimeout(timeoutId);
      
      if (!result) {
        throw new Error("Empty response from API");
      }
      
      setResponse(result);
      toast.success(`Code generated successfully using ${modelProvider}!`, { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to generate code";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. The server took too long to respond.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      console.error("Code generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = () => {
    // Copy the extracted code if available, otherwise copy the full response
    navigator.clipboard.writeText(extractedCode || response);
    toast.success("Code copied to clipboard!");
  };  const applyToEditor = () => {
    if (extractedCode) {
      usePreferencesStore.setState({ 
        code: extractedCode,
        language: targetLanguage
      });
      toast.success("Generated code applied to editor!");
      onClose();
    } else {
      // Should never happen, but just in case
      usePreferencesStore.setState({ 
        code: response.trim(),
        language: targetLanguage
      });
      toast.success("Content applied to editor");
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>          <label className="text-sm text-neutral-400 mb-1 block">
            Describe what you want to generate
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A function to sort an array of objects by date"
            className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
            rows={3}
            maxRows={8}
            autoResize={true}
          />
        </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">
              Language
            </label>
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">
              Complexity
            </label>
            <Select
              value={complexity}
              onValueChange={setComplexity}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                {complexityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-3">
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
        
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <span>Generate</span>
          )}
        </Button>
      </div>      {error && (
        <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg border-red-500/20 animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <div className="p-4">
            <div className="bg-red-900/10 border border-red-800/30 text-red-300 rounded-lg p-4 text-sm whitespace-pre-wrap shadow-inner">
              <div className="flex items-start gap-3">
                <div className="bg-red-500/20 p-1.5 rounded-full flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2 text-red-200">Error connecting to backend API</h4>
                  <p className="max-h-32 overflow-y-auto">{error}</p>
                  <div className="mt-4 text-xs text-neutral-300 space-y-1.5 bg-neutral-800/50 p-3 rounded border border-neutral-700/50">
                    <p className="font-medium flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                      Troubleshooting steps:
                    </p>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Verify the Python backend is running on port 5000</li>
                      <li>Check if your GEMINI_API_KEY is set in the .env file</li>
                      <li>Ensure you have the required Python packages installed</li>
                      <li>Check the backend console for any error messages</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="bg-neutral-800/70 border-neutral-700 hover:bg-neutral-700 hover:border-red-500/50 text-sm flex-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('http://localhost:5000/api/status', '_blank')}
                className="bg-neutral-800/70 border-neutral-700 hover:bg-neutral-700 hover:border-blue-500/50 text-sm flex-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                Check API Status
              </Button>
            </div>
          </div>
        </Card>
      )}{response && (
        <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <div className="p-4">
            <div className="relative">              <div className="absolute top-0 right-0 p-1.5 bg-neutral-800/70 rounded-bl rounded-tr-lg border-b border-l border-neutral-700/50 z-10">
                <div className="flex items-center text-xs text-neutral-400 gap-1.5 px-1">
                  <span className="font-mono bg-neutral-700/50 px-1.5 py-0.5 rounded">{targetLanguage}</span>
                  <span>•</span>
                  <span>{modelProvider}</span>
                </div>
              </div>
                {/* Use the reusable CodeDisplayBlock component */}
              <CodeDisplayBlock 
                code={extractedCode || response}
                language={targetLanguage}
                provider={modelProvider}
                showHeader={true}
                title="Generated Code"
              />
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="bg-neutral-800/70 border-neutral-700 hover:bg-neutral-700 hover:border-blue-500/30 flex-1 text-sm transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 group-hover:text-blue-400 transition-colors"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12c0-1.1.9-2 2-2h2"/><path d="M4 8c0-1.1.9-2 2-2h2"/></svg>
                Copy to Clipboard
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={applyToEditor}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-transparent text-white flex-1 text-sm shadow-md shadow-purple-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M12 20v-6m0 0 3 3m-3-3-3 3"/><path d="M17 17v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M21 15V9"/><path d="M21 15h-4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h4"/></svg>
                Apply to Editor
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const GenerateCode = {
  id: "generate",
  title: "Generate Code",
  description: "Create code from description",
  icon: SparklesIcon,
  color: "from-pink-500 to-rose-500",
    execute(code, language, callbacks) {
    const { setModalContent, setShowModal } = callbacks;
    
    setModalContent(
      <FeatureModal
        isOpen={true}
        onClose={() => setShowModal(false)}
        title="Generate Code"
        description="Create code from natural language description"
        icon={SparklesIcon}
        color="from-pink-500 to-rose-500"
      >
        <GenerateCodeContent 
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
      <GenerateCodeContent 
        onClose={() => callbacks.setActiveFeature(null)}
      />
    );
  }
};

export default GenerateCode;
