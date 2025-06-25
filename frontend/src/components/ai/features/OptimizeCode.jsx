import { useState } from "react";
import { aiService } from "../../../lib/ai-service";
import { usePreferencesStore } from "../../../store/use-preferences-store";
import toast from "react-hot-toast";
import { WandIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import FeatureModal from "./FeatureModal";
import { Card } from "../../ui/card";

const OptimizeCodeContent = ({ code, language, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [modelProvider, setModelProvider] = useState("gemini");
  
  const modelProviders = [
    { value: "gemini", label: "Gemini" },
    { value: "groq", label: "Groq" }
  ];

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error("Please add some code first!");
      return;
    }
    
    setIsLoading(true);
    const toastId = "optimize-toast";
    try {
      toast.loading(`Optimizing code with ${modelProvider}...`, { id: toastId });
      const result = await aiService.optimizeCode(code, language, modelProvider);
      setResponse(result);
      toast.success(`Optimization suggestions generated using ${modelProvider}!`, { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to optimize code";
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
      toast.success("Optimized code applied to editor!");
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
            onClick={handleOptimize}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Optimizing...</span>
              </div>
            ) : (
              <span>Optimize Code</span>
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

const OptimizeCode = {
  id: "optimize",
  title: "Optimize Code",
  description: "Get suggestions to improve performance",
  icon: WandIcon,
  color: "from-green-500 to-emerald-500",
    execute(code, language, callbacks) {
    const { setModalContent, setShowModal } = callbacks;
    
    setModalContent(
      <FeatureModal
        isOpen={true}
        onClose={() => setShowModal(false)}
        title="Optimize Code"
        description="Get suggestions to improve performance and readability"
        icon={WandIcon}
        color="from-green-500 to-emerald-500"
      >
        <OptimizeCodeContent 
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
      <OptimizeCodeContent 
        code={code} 
        language={language} 
        onClose={() => callbacks.setActiveFeature(null)}
      />
    );
  }
};

export default OptimizeCode;
