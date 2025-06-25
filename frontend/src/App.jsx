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
import { Toaster } from "react-hot-toast";
import './App.css';

function App() {
  const [width, setWidth] = useState("auto");
  const [showWidth, setShowWidth] = useState(false);
  const [showSnippetLibrary, setShowSnippetLibrary] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(false);

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

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <Toaster toastOptions={{ className: "toast" }} />
      
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
                Snippix
              </h1>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowSnippetLibrary(true)}
                variant="outline"
                size="sm"
                className="bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">My Snippets</span>
              </Button>

              <Button
                onClick={() => setShowAiSidebar(!showAiSidebar)}
                variant="outline"
                size="sm"
                className={`border-purple-500/50 transition-all ${
                  showAiSidebar 
                    ? 'bg-purple-600 text-white border-purple-400' 
                    : 'bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700'
                }`}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="hidden sm:inline">AI Features</span>
              </Button>

              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 max-w-7xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Side - Code Editor (Now placed first with 60% width - 3/5) */}
          <div className="lg:col-span-3 order-1 flex flex-col items-center justify-center">
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

          {/* Right Side - Either Customization Panel or AI Panel (40% width - 2/5) */}
          <div className="lg:col-span-2 order-2">
            <div className="h-[calc(100vh-100px)] flex flex-col lg:sticky lg:top-24 overflow-visible pr-1">
              {!showAiSidebar ? (
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

                  <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 rounded-lg shadow-lg mt-3 mb-3">
                    <CardHeader className="pb-3 pt-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold text-neutral-200">
                          Export
                        </CardTitle>
                        <div className="z-10">
                          <ExportOptions targetRef={editorRef} />
                        </div>
                      </div>
                    </CardHeader>
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
