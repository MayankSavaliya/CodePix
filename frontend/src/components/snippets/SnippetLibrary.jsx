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
  Code
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SnippetLibrary({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my-snippets');
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Card className="w-full max-w-6xl max-h-[95vh] bg-neutral-900/95 backdrop-blur border-neutral-700 flex flex-col shadow-2xl">
        {/* Enhanced Header */}
        <CardHeader className="border-b border-neutral-700/50 bg-gradient-to-r from-neutral-900 to-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  My Snippets
                </CardTitle>
                <p className="text-sm text-neutral-400">
                  {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} found
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
          
          {/* Enhanced Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by title, code, or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-purple-500"
              />
            </div>
            
            {/* Quick Filter Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'my-snippets' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('my-snippets')}
                className={activeTab === 'my-snippets' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'text-neutral-400 hover:text-white'}
              >
                My Snippets
              </Button>
              <Button
                variant={activeTab === 'favorites' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('favorites')}
                className={activeTab === 'favorites' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'text-neutral-400 hover:text-white'}
              >
                <Heart className="w-4 h-4 mr-1" />
                Favorites
              </Button>
            </div>
          </div>
        </CardHeader>        <CardContent className="flex-1 overflow-hidden p-0">
          {/* Enhanced Save Dialog */}
          {showSaveDialog && (
            <div className="p-6 border-b border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur">
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
                </div>              </div>
            </div>
          )}

          {/* Quick Actions Toolbar */}
          {!loading && filteredSnippets.length > 0 && (
            <div className="px-6 py-3 border-b border-neutral-700/30 bg-neutral-900/30">
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
                    Showing {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="overflow-y-auto max-h-full">
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
            ) : (              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in">
                  {filteredSnippets.map((snippet) => (
                    <Card 
                      key={snippet.id}
                      className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]"
                      onClick={() => handleLoadSnippet(snippet)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate text-lg group-hover:text-purple-300 transition-colors">
                              {snippet.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full">
                                {snippet.language}
                              </span>
                              <span className="text-xs text-neutral-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(snippet.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit functionality
                              }}
                              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSnippet(snippet.id);
                              }}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="bg-neutral-900/60 rounded-lg p-3 mb-3 border border-neutral-700/30">
                          <code className="text-sm text-neutral-300 font-mono leading-relaxed">
                            {snippet.code.substring(0, 120)}
                            {snippet.code.length > 120 && (
                              <span className="text-neutral-500">...</span>
                            )}
                          </code>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3 text-neutral-400">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              {snippet.theme}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              {snippet.fontSize}px
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
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
