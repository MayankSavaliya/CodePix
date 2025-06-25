import { useState } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { ArrowRightLeftIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";

const TranslateCodeContent = ({ code, sourceLanguage, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("python");
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
      toast.success("Translated code applied to editor!");
      onClose();
    } else {
      toast.error("No code found in response");
    }
  };

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
      </div>

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
