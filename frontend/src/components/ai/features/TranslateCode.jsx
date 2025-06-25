import { useState, useEffect } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { ArrowRightLeftIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";
import CodeDisplayBlock from "../components/CodeDisplayBlock";

const TranslateCodeContent = ({ code, sourceLanguage, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("python");
  const [modelProvider, setModelProvider] = useState("gemini");
  const [extractedCode, setExtractedCode] = useState("");

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
  
  const modelProviders = [
    { value: "gemini", label: "Gemini" },
    { value: "groq", label: "Groq" }
  ];
  const handleTranslate = async () => {
    if (!code.trim()) {
      toast.error("Please add some code first!");
      return;
    }
    
    setIsLoading(true);
    const toastId = "translate-toast";
    try {
      toast.loading(`Translating code with ${modelProvider}...`, { id: toastId });
      const result = await aiService.translateCode(code, sourceLanguage, targetLanguage, modelProvider);
      setResponse(result);
      toast.success(`Code translated to ${targetLanguage} using ${modelProvider}!`, { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to translate code";
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
    // Copy the extracted code if available, otherwise copy the full response
    navigator.clipboard.writeText(extractedCode || response);
    toast.success("Code copied to clipboard!");
  };

  const applyToEditor = () => {
    if (extractedCode) {
      usePreferencesStore.setState({ 
        code: extractedCode,
        language: targetLanguage
      });
      toast.success(`Translated code applied to editor! Language set to ${targetLanguage}`);
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

  // Keep this comment to avoid conflicts
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

  return (
    <div className="space-y-4">      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">
            Target Language
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
          onClick={handleTranslate}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 text-white md:col-span-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Translating...</span>
            </div>
          ) : (
            <span>Translate Code</span>
          )}
        </Button>
      </div>      {response && (
        <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <div className="p-4">
            <div className="relative">
              <div className="absolute top-0 right-0 p-1.5 bg-neutral-800/70 rounded-bl rounded-tr-lg border-b border-l border-neutral-700/50 z-10">
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
                title="Translated Code"
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
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 border-transparent text-white flex-1 text-sm shadow-md shadow-orange-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20"
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

const TranslateCode = {
  id: "translate",
  title: "Translate Language",
  description: "Convert to another language",
  icon: ArrowRightLeftIcon,
  color: "from-orange-500 to-amber-500",
    execute(code, language, callbacks) {
    const { setModalContent, setShowModal } = callbacks;
    
    setModalContent(
      <FeatureModal
        isOpen={true}
        onClose={() => setShowModal(false)}
        title="Translate Language"
        description="Convert your code to another programming language"
        icon={ArrowRightLeftIcon}
        color="from-orange-500 to-amber-500"
      >
        <TranslateCodeContent 
          code={code} 
          sourceLanguage={language} 
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
      <TranslateCodeContent 
        code={code} 
        sourceLanguage={language} 
        onClose={() => callbacks.setActiveFeature(null)}
      />
    );
  }
};

export default TranslateCode;
