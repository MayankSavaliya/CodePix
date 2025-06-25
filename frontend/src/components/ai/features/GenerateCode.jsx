import { useState } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { SparklesIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";

const GenerateCodeContent = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);  const [prompt, setPrompt] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("javascript");
  const [complexity, setComplexity] = useState("intermediate");
  const [modelProvider, setModelProvider] = useState("gemini");

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
    navigator.clipboard.writeText(response);
    toast.success("Copied to clipboard!");
  };

  const applyToEditor = () => {
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    if (codeMatch) {
      usePreferencesStore.setState({ 
        code: codeMatch[1],
        language: targetLanguage
      });
      toast.success("Generated code applied to editor!");
      onClose();
    } else {
      toast.error("No code found in response");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">
            Describe what you want to generate
          </label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A function to sort an array of objects by date"
            className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
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
        <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg border-red-500/30">
          <div className="p-4">
            <div className="bg-red-900/20 text-red-300 rounded-lg p-3 text-sm whitespace-pre-wrap">
              <h4 className="font-medium mb-1">Error connecting to backend API</h4>
              <p>{error}</p>
              <div className="mt-2 text-xs text-neutral-300 space-y-1">
                <p>Troubleshooting steps:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Verify the Python backend is running on port 5000</li>
                  <li>Check if your GEMINI_API_KEY is set in the .env file</li>
                  <li>Ensure you have the required Python packages installed</li>
                  <li>Check the backend console for any error messages</li>
                </ol>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-xs flex-1"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('http://localhost:5000/api/status', '_blank')}
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-xs flex-1"
              >
                Check API Status
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {response && (
        <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg">
          <div className="p-4">
            <div className="bg-neutral-800 rounded-lg p-3 text-sm text-neutral-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {response}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 flex-1 text-xs"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={applyToEditor}
                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 flex-1 text-xs"
              >
                Apply
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
