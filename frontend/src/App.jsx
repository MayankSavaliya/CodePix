import { useEffect, useRef, useState } from "react";
import { usePreferencesStore } from "./store/use-preferences-store";
import { useAuthStore } from "./store/use-auth-store";
import { fonts, themes } from "./options";
import { cn } from "./lib/utils";
import CodeEditor from "./components/CodeEditor";
import WidthMeasurement from "./components/WidthMeasurement";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Resizable } from "re-resizable";
import ThemeSelect from "./components/controls/ThemeSelect";
import LanguageSelect from "./components/controls/LanguageSelect";
import { ResetIcon } from "@radix-ui/react-icons";
import FontSelect from "./components/controls/FontSelect";
import FontSizeInput from "./components/controls/FontSizeInput";
import PaddingSlider from "./components/controls/PaddingSlider";
import BackgroundSwitch from "./components/controls/BackgroundSwitch";
import DarkModeSwitch from "./components/controls/DarkModeSwitch";
import ExportOptions from "./components/controls/ExportOptions";
import UserProfile from "./components/auth/UserProfile";
import SnippetLibrary from "./components/snippets/SnippetLibrary";
import AiSidebar from "./components/ai/AiSidebar";
import { PanelRightClose, PanelRightOpen, Settings, Brain, FolderOpen, Download, Menu, X, Palette, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./components/ui/dropdown-menu";
import './App.css';

function App() {
  const [width, setWidth] = useState("auto");
  const [showWidth, setShowWidth] = useState(false);
  const [showSnippetLibrary, setShowSnippetLibrary] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [activePanel, setActivePanel] = useState("customization"); // "customization" or "ai"

  const theme = usePreferencesStore((state) => state.theme);
  const padding = usePreferencesStore((state) => state.padding);
  const fontStyle = usePreferencesStore((state) => state.fontStyle);
  const showBackground = usePreferencesStore((state) => state.showBackground);

  const editorRef = useRef(null);

  // Handle URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size === 0) return;
    const state = Object.fromEntries(queryParams);

    usePreferencesStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    });
  }, []);

  // Function to show customization panel
  const showCustomization = () => {
    setActivePanel("customization");
    setShowRightSidebar(true);
    setShowAiSidebar(false);
  };

  // Function to show AI panel
  const showAI = () => {
    setActivePanel("ai");
    setShowRightSidebar(true);
    setShowAiSidebar(true);
  };

  // Function to hide panel
  const hidePanel = () => {
    setShowRightSidebar(false);
    setShowAiSidebar(false);
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      
      {/* Dynamic Theme and Font Links */}
      <link
        rel="stylesheet"
        href={themes[theme]?.theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle]?.src}
        crossOrigin="anonymous"
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodePix
              </h1>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              {/* Main Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 text-white hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 bg-neutral-900/95 backdrop-blur-xl border-neutral-800 shadow-2xl"
                >
                  <DropdownMenuLabel className="text-neutral-400 font-medium px-3 py-2">
                    Quick Actions
                  </DropdownMenuLabel>
                  
                  {/* Export */}
                  <DropdownMenuItem className="text-white hover:bg-neutral-800/50 cursor-pointer px-3 py-3">
                    <div className="flex items-center w-full">
                      <Download className="mr-3 h-4 w-4 text-blue-400" />
                      <span>Export</span>
                      <div className="ml-auto">
                        <ExportOptions targetRef={editorRef} />
                      </div>
                    </div>
                  </DropdownMenuItem>

                  {/* My Snippets */}
                  <DropdownMenuItem 
                    onClick={() => setShowSnippetLibrary(true)}
                    className="text-white hover:bg-neutral-800/50 cursor-pointer px-3 py-3"
                  >
                    <FolderOpen className="mr-3 h-4 w-4 text-purple-400" />
                    My Snippets
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-neutral-800" />
                  
                  <DropdownMenuLabel className="text-neutral-400 font-medium px-3 py-2">
                    Panels
                  </DropdownMenuLabel>
                  
                  {/* Customization */}
                  <DropdownMenuItem 
                    onClick={showCustomization}
                    className={`text-white hover:bg-neutral-800/50 cursor-pointer px-3 py-3 ${
                      showRightSidebar && activePanel === "customization" 
                        ? 'bg-blue-600/20 text-blue-300' 
                        : ''
                    }`}
                  >
                    <Palette className="mr-3 h-4 w-4 text-blue-400" />
                    <span>Customize Appearance</span>
                    {showRightSidebar && activePanel === "customization" && (
                      <span className="ml-auto text-xs bg-blue-600 px-2 py-1 rounded">Active</span>
                    )}
                  </DropdownMenuItem>

                  {/* AI Features */}
                  <DropdownMenuItem 
                    onClick={showAI}
                    className={`text-white hover:bg-neutral-800/50 cursor-pointer px-3 py-3 ${
                      showRightSidebar && activePanel === "ai" 
                        ? 'bg-purple-600/20 text-purple-300' 
                        : ''
                    }`}
                  >
                    <Sparkles className="mr-3 h-4 w-4 text-purple-400" />
                    <span>AI Assistant</span>
                    {showRightSidebar && activePanel === "ai" && (
                      <span className="ml-auto text-xs bg-purple-600 px-2 py-1 rounded">Active</span>
                    )}
                  </DropdownMenuItem>

                  {/* Hide Panel - Only show when panel is visible */}
                  {showRightSidebar && (
                    <>
                      <DropdownMenuSeparator className="bg-neutral-800" />
                      <DropdownMenuItem 
                        onClick={hidePanel}
                        className="text-white hover:bg-neutral-800/50 cursor-pointer px-3 py-3"
                      >
                        <X className="mr-3 h-4 w-4 text-red-400" />
                        <span>Close Panel</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Separator */}
              <div className="w-px h-6 bg-neutral-700 mx-2"></div>

              {/* User Profile */}
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 max-w-7xl transition-all duration-300">
        <div className={cn(
          "grid gap-6 transition-all duration-300",
          showRightSidebar 
            ? "grid-cols-1 lg:grid-cols-5" 
            : "grid-cols-1"
        )}>
          
          {/* Left Side - Code Editor */}
          <div className={cn(
            "order-1 flex flex-col items-center justify-center transition-all duration-300",
            showRightSidebar ? "lg:col-span-3" : "lg:col-span-1"
          )}>
            <div className="w-full">
              <Resizable
                enable={{ left: true, right: true }}
                minWidth={padding * 2 + 300}
                maxWidth="100%"
                size={{ width }}
                onResize={(e, dir, ref) => setWidth(ref.offsetWidth.toString())}
                onResizeStart={() => setShowWidth(true)}
                onResizeStop={() => setShowWidth(false)}
                className="mx-auto w-full"
              >
                <div
                  className={cn(
                    "mb-0 transition-all ease-out shadow-2xl rounded-lg",
                    showBackground
                      ? themes[theme]?.background
                      : "ring-2 ring-neutral-800"
                  )}
                  style={{ padding, minHeight: "calc(100vh - 140px)" }}
                  ref={editorRef}
                >
                  <CodeEditor />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0">
                  <WidthMeasurement showWidth={showWidth} width={Number(width)} />
                  
                  <div
                    className={cn(
                      "transition-opacity w-fit mx-auto -mt-2",
                      showWidth || width === "auto"
                        ? "invisible opacity-0 hidden"
                        : "visible opacity-100"
                    )}
                  >
                    <Button 
                      size="sm" 
                      onClick={() => setWidth("auto")} 
                      variant="ghost"
                      className="text-neutral-400 hover:text-white"
                    >
                      <ResetIcon className="mr-2" />
                      Reset width
                    </Button>
                  </div>
                </div>
              </Resizable>
            </div>
          </div>

          {/* Right Side - Either Customization Panel or AI Panel */}
          {showRightSidebar && (
            <div className="lg:col-span-2 order-2">
              <div className="h-[calc(100vh-100px)] flex flex-col lg:sticky lg:top-24 overflow-visible pr-1">
                {activePanel === "customization" ? (
                  /* Customization Panel */
                  <div className="flex flex-col h-full">
                    <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 rounded-lg shadow-lg flex-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-md font-semibold text-neutral-200">
                          Appearance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <ThemeSelect />
                          <LanguageSelect />
                          <FontSelect />
                          <FontSizeInput />
                          <PaddingSlider />
                          <div className="flex items-center justify-between">
                            <BackgroundSwitch />
                            <DarkModeSwitch />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  /* AI Sidebar - Embedded directly in the layout */
                  <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-lg overflow-hidden h-full flex-1 shadow-lg">
                    <AiSidebar 
                      isOpen={showAiSidebar}
                      onToggle={() => setShowAiSidebar(!showAiSidebar)}
                      inline={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showSnippetLibrary && (
        <SnippetLibrary onClose={() => setShowSnippetLibrary(false)} />
      )}

      {/* AI Code Completion */}

    </div>
  );
}

export default App;
