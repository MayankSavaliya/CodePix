import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePreferencesStore } from "../../store/use-preferences-store";
import { useAuthStore } from "../../store/use-auth-store";
import aiFeatures from "./features";
import toast from "react-hot-toast";
import { 
  BrainIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ArrowLeftIcon,
  Folder,
  LockIcon
} from "lucide-react";

export default function AiSidebar({ isOpen, onToggle, inline = false }) {
  const [activeFeature, setActiveFeature] = useState(null);
  const [featureContent, setFeatureContent] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const code = usePreferencesStore((state) => state.code);
  const language = usePreferencesStore((state) => state.language);
  const { isAuthenticated } = useAuthStore();
    const handleAiAction = async (featureId) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    
    const feature = aiFeatures.find(f => f.id === featureId);
    if (!feature) return;
    
    setActiveFeature(featureId);
    
    const callbacks = {
      setFeatureContent,
      setActiveFeature
    };
    
    try {
      // Get the feature content
      await feature.executeInline(code, language, callbacks);
    } catch (error) {
      toast.error(`Failed to open ${featureId} feature`);
      console.error(error);
      setActiveFeature(null);
    }
  };

  // Authentication Prompt component
  const renderAuthPrompt = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
          <CardContent className="text-center py-8">
            <LockIcon className="mx-auto mb-4 h-12 w-12 text-neutral-500" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Sign In Required
            </h3>
            <p className="text-neutral-400 mb-4">
              Please sign in to access AI features for code generation, explanation, and optimization.
            </p>
            <Button onClick={() => setShowAuthPrompt(false)}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    // If there's an active feature with content, render the feature interface
    if (activeFeature && featureContent) {
      const feature = aiFeatures.find(f => f.id === activeFeature);
      const IconComponent = feature?.icon || BrainIcon;
      
      return (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Feature Header with Back Button */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFeature(null);
                setFeatureContent(null);
              }}
              className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature?.color || 'from-purple-500 to-blue-500'} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-medium text-white text-base">
                {feature?.title || 'AI Feature'}
              </h3>
            </div>
          </div>
          
          {/* Feature Content */}
          <div className="animate-in fade-in-0 zoom-in-95 duration-200">
            {featureContent}
          </div>
        </div>
      );
    }
    
    // Otherwise, render the list of available features
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {aiFeatures.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <Card 
                key={feature.id}
                className="bg-neutral-900/50 backdrop-blur border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer shadow-lg"
                onClick={() => handleAiAction(feature.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };  return (
    <>
      {/* Show Authentication Prompt if needed */}
      {showAuthPrompt && renderAuthPrompt()}
      
      {inline ? (
        // Inline mode for embedding directly in the layout
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin overflow-x-hidden">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BrainIcon className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              </div>
              <Button
                onClick={onToggle}
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              AI-powered code analysis and generation
            </p>
          </div>
          
          {/* Render the common content */}
          {renderContent()}
        </div>
      ) : (
        // Original floating sidebar mode
        <>
          {/* AI Sidebar Toggle Button */}
          <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-40">
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className={`rounded-l-lg rounded-r-none bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-0'
              }`}
            >
              {isOpen ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* AI Sidebar Panel */}
          <div className={`fixed top-0 right-0 h-full w-80 bg-neutral-900/50 backdrop-blur border-l border-neutral-800 transform transition-transform duration-300 ease-in-out z-30 shadow-lg ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-neutral-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <BrainIcon className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                  </div>
                  <Button
                    onClick={onToggle}
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400 hover:text-white"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-neutral-400 mt-1">
                  AI-powered code analysis and generation
                </p>
              </div>
              
              {/* Content */}
              {renderContent()}
            </div>
          </div>

          {/* Overlay - only shown in floating mode */}
          {isOpen && !inline && (
            <div 
              className="fixed inset-0 bg-black/20 z-20"
              onClick={onToggle}
            />
          )}
        </>
      )}
    </>
  );
}
