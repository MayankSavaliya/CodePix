import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/use-auth-store';
import { useSnippetStore } from '../../store/use-snippet-store';
import { usePreferencesStore } from '../../store/use-preferences-store';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { 
  Save, 
  Folder, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  Heart,
  Calendar,
  Code,
  Clock,
  FileText,
  Palette,
  Type,
  Grid3X3,
  List,
  Zap,
  Copy,
  ExternalLink,
  Star,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { themes } from '../../options';

export default function SnippetLibrary({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my-snippets');
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const { user, isAuthenticated } = useAuthStore();
  const { 
    snippets, 
    loading, 
    saveSnippet, 
    loadUserSnippets, 
    deleteSnippet,
    loadPublicSnippets,
    setCurrentSnippet 
  } = useSnippetStore();
  
  const currentPreferences = usePreferencesStore();
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSnippets(user.uid);
    }
  }, [isAuthenticated, user, loadUserSnippets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        setShowSaveDialog(true);
      }
      if (e.key === 'Escape') {
        if (showSaveDialog) {
          setShowSaveDialog(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSaveDialog, onClose]);

  const handleSaveCurrentSnippet = async () => {
    if (!user) return;
    
    const snippetData = {
      code: currentPreferences.code,
      language: currentPreferences.language,
      theme: currentPreferences.theme,
      fontStyle: currentPreferences.fontStyle,
      fontSize: currentPreferences.fontSize,
      padding: currentPreferences.padding,
      showBackground: currentPreferences.showBackground,
      darkMode: currentPreferences.darkMode
    };

    try {
      await saveSnippet(user, snippetData, saveTitle || 'Untitled');
      setSaveTitle('');
      setShowSaveDialog(false);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleLoadSnippet = (snippet) => {
    // Load snippet into current preferences
    usePreferencesStore.setState({
      code: snippet.code,
      language: snippet.language,
      theme: snippet.theme,
      fontStyle: snippet.fontStyle,
      fontSize: snippet.fontSize,
      padding: snippet.padding,
      showBackground: snippet.showBackground,
      darkMode: snippet.darkMode
    });
    
    setCurrentSnippet(snippet);
    onClose();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'from-yellow-500 to-orange-500',
      typescript: 'from-blue-500 to-purple-500',
      python: 'from-blue-600 to-green-600',
      java: 'from-red-500 to-orange-500',
      cpp: 'from-blue-600 to-purple-600',
      csharp: 'from-purple-500 to-pink-500',
      php: 'from-purple-600 to-blue-600',
      ruby: 'from-red-600 to-pink-600',
      go: 'from-blue-500 to-cyan-500',
      rust: 'from-orange-500 to-red-500',
      swift: 'from-orange-500 to-red-500',
      kotlin: 'from-purple-500 to-orange-500',
      html: 'from-orange-500 to-red-500',
      css: 'from-blue-500 to-purple-500',
      sql: 'from-blue-600 to-cyan-600',
      json: 'from-yellow-500 to-orange-500',
      xml: 'from-orange-500 to-red-500',
      markdown: 'from-gray-500 to-blue-500',
      bash: 'from-green-500 to-emerald-500'
    };
    return colors[language.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (date) => {
    const now = new Date();
    const snippetDate = new Date(date);
    const diffTime = Math.abs(now - snippetDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return snippetDate.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
          <CardContent className="text-center py-8">
            <Folder className="mx-auto mb-4 h-12 w-12 text-neutral-500" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Sign In Required
            </h3>
            <p className="text-neutral-400 mb-4">
              Please sign in to save and manage your code snippets.
            </p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <Card className="w-full max-w-7xl h-[90vh] bg-neutral-900/95 backdrop-blur border-neutral-700 flex flex-col shadow-2xl">
        {/* Enhanced Header */}
        <CardHeader className="border-b border-neutral-700/50 bg-gradient-to-r from-neutral-900 to-neutral-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Code Snippets
                </CardTitle>
                <p className="text-sm text-neutral-400">
                  {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} • {snippets.length} total
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSaveDialog(true)}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Current
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                size="sm"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
              >
                ✕ Close
              </Button>
            </div>
          </div>
          
          {/* Enhanced Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search snippets by title, code, or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-purple-500"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'text-neutral-400 hover:text-white'}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'text-neutral-400 hover:text-white'}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          {/* Enhanced Save Dialog */}
          {showSaveDialog && (
            <div className="p-6 border-b border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Snippet Title
                  </label>
                  <Input
                    placeholder="Enter a descriptive title for your snippet..."
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className="bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveCurrentSnippet()}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <Button 
                    onClick={handleSaveCurrentSnippet} 
                    disabled={loading || !saveTitle.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Snippet'}
                  </Button>
                  <Button 
                    onClick={() => setShowSaveDialog(false)} 
                    variant="outline"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Toolbar */}
          {!loading && filteredSnippets.length > 0 && (
            <div className="px-6 py-3 border-b border-neutral-700/30 bg-neutral-900/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span>
                    <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">Ctrl</kbd> + 
                    <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs ml-1">S</kbd> 
                    <span className="ml-2">Save Current</span>
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">Esc</kbd>
                    <span className="ml-2">Close</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">
                    {viewMode === 'list' ? 'List View' : 'Grid View'} • {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Area - Fixed scrolling */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-neutral-400 mt-4 text-lg">Loading your snippets...</p>
              </div>
            ) : filteredSnippets.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {searchTerm ? 'No Matches Found' : 'No Snippets Yet'}
                </h3>
                <p className="text-neutral-400 text-lg max-w-md mx-auto">
                  {searchTerm 
                    ? `No snippets match "${searchTerm}". Try adjusting your search terms.`
                    : 'Create your first snippet by clicking "Save Current" to get started!'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="mt-4 border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : viewMode === 'list' ? (
              // List View - Redesigned Code Boxes
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredSnippets.map((snippet, index) => (
                    <div
                      key={snippet.id}
                      className={cn(
                        "group relative bg-gradient-to-br from-neutral-800/30 via-neutral-800/20 to-neutral-900/30 border border-neutral-700/40 rounded-2xl p-5 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/15 hover:scale-[1.02] backdrop-blur-sm h-fit",
                        selectedSnippet?.id === snippet.id && "border-purple-500/60 bg-purple-500/10 ring-1 ring-purple-500/20"
                      )}
                      onClick={() => handleLoadSnippet(snippet)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0",
                            getLanguageColor(snippet.language)
                          )}>
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                              {snippet.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(snippet.updatedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {snippet.code.length} chars
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCode(snippet.code);
                            }}
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg"
                            title="Copy Code"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSnippet(snippet.id);
                            }}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Redesigned Code Preview Box */}
                      <div className="relative mb-4">
                        {/* Code Box Header */}
                        <div className="flex items-center justify-between bg-neutral-900/80 rounded-t-xl px-4 py-2 border-b border-neutral-700/50">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                            </div>
                            <span className="text-xs text-neutral-300 font-medium ml-2">
                              {snippet.language}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <Type className="w-3 h-3" />
                              {snippet.fontSize}px
                            </span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              {snippet.theme}
                            </span>
                          </div>
                        </div>
                        
                        {/* Code Content */}
                        <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 rounded-b-xl p-4 border border-neutral-700/50 group-hover:border-neutral-600/60 transition-colors">
                          <pre className="text-sm text-neutral-200 font-mono leading-relaxed overflow-hidden max-h-32">
                            <code>
                              {snippet.code.substring(0, 180)}
                              {snippet.code.length > 180 && (
                                <span className="text-neutral-500">...</span>
                              )}
                            </code>
                          </pre>
                        </div>
                        
                        {/* Code Box Shadow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
                      </div>
                      
                      {/* Footer Section */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-full font-medium">
                            {snippet.language}
                          </span>
                          <span className="text-xs bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/40 text-green-300 px-3 py-1 rounded-full font-medium">
                            {snippet.theme}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Click to load
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Grid View - Redesigned Code Boxes
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredSnippets.map((snippet) => (
                    <Card 
                      key={snippet.id}
                      className="bg-gradient-to-br from-neutral-800/30 via-neutral-800/20 to-neutral-900/30 border-neutral-700/40 hover:border-purple-500/60 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/15 hover:scale-[1.02] overflow-hidden backdrop-blur-sm rounded-2xl h-fit"
                      onClick={() => handleLoadSnippet(snippet)}
                    >
                      {/* Compact Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0",
                              getLanguageColor(snippet.language)
                            )}>
                              <Code className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-white truncate text-sm group-hover:text-purple-300 transition-colors">
                                {snippet.title}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(snippet.code);
                              }}
                              className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-md"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSnippet(snippet.id);
                              }}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(snippet.updatedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {snippet.code.length} chars
                          </span>
                        </div>
                      </div>
                      
                      {/* Redesigned Compact Code Preview Box */}
                      <div className="px-4 pb-3">
                        <div className="relative">
                          {/* Mini Code Box Header */}
                          <div className="flex items-center justify-between bg-neutral-900/80 rounded-t-lg px-3 py-1.5 border-b border-neutral-700/50">
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
                              </div>
                              <span className="text-xs text-neutral-300 font-medium ml-1.5">
                                {snippet.language}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-neutral-500">
                                {snippet.fontSize}px
                              </span>
                              <span className="text-xs text-neutral-500">•</span>
                              <span className="text-xs text-neutral-500">
                                {snippet.theme}
                              </span>
                            </div>
                          </div>
                          
                          {/* Code Content */}
                          <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 rounded-b-lg p-3 border border-neutral-700/50 group-hover:border-neutral-600/60 transition-colors">
                            <pre className="text-xs text-neutral-200 font-mono leading-relaxed max-h-20 overflow-hidden">
                              <code>
                                {snippet.code.substring(0, 100)}
                                {snippet.code.length > 100 && (
                                  <span className="text-neutral-500">...</span>
                                )}
                              </code>
                            </pre>
                          </div>
                          
                          {/* Mini Code Box Shadow Effect */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      {/* Compact Footer */}
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/40 text-purple-300 px-2 py-1 rounded-full font-medium">
                              {snippet.language}
                            </span>
                            <span className="text-xs bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/40 text-green-300 px-2 py-1 rounded-full font-medium">
                              {snippet.theme}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Load
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
