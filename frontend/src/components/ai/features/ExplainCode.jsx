import { useState } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { MessageSquareIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";

const ExplainCodeContent = ({ code, language, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [modelProvider, setModelProvider] = useState("gemini");
  
  const modelProviders = [
    { value: "gemini", label: "Gemini" },
    { value: "groq", label: "Groq" }
  ];
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
    navigator.clipboard.writeText(response);
    toast.success("Copied to clipboard!");
  };

  const applyToEditor = () => {
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    if (codeMatch) {
      usePreferencesStore.setState({ code: codeMatch[1] });
      toast.success("Code applied to editor!");
      onClose();
    } else {
      toast.error("No code found in response");
    }
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
