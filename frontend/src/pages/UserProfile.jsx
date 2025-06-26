import { useState, useEffect } from "react";
import { useAuthStore } from "../store/use-auth-store";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "react-hot-toast";
import { LogOut, User, Zap, ShieldAlert, ChevronLeft, ChevronRight, Mail, Calendar, Menu, X } from "lucide-react";

const SIDEBAR_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Usage", icon: Zap },
  { id: "danger", label: "Danger Zone", icon: ShieldAlert },
];

export default function UserProfile() {
  const { user, updateUserProfile, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [section, setSection] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const [avatarInput, setAvatarInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Close mobile menu when section changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [section]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="mb-2 text-xl text-white">Not signed in</CardTitle>
          <p className="mb-4 text-neutral-400">Please sign in to view your profile.</p>
          <Button 
            onClick={() => window.location.href = '/login'} 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // Profile Info Save
  const handleSave = async () => {
    setProfileLoading(true);
    try {
      await updateUserProfile({ displayName, photoURL: avatarUrl });
      toast.success("Profile updated!");
      setEditing(false);
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Avatar
  const handleAvatarChange = () => {
    if (!avatarInput.trim()) return;
    setAvatarUrl(avatarInput.trim());
    setAvatarInput("");
  };

  // Password change functionality (UI only)
  const handleChangePassword = async () => {
    setPasswordLoading(true);
    try {
      toast.success("Password change link sent to your email");
      setShowPassword(false);
      setPassword("");
    } catch {
      toast.error("Failed to send password change link");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Mobile Header
  const MobileHeader = (
    <div className="lg:hidden sticky top-0 z-50 bg-neutral-900/80 backdrop-blur border-b border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=8b5cf6&color=fff`}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-purple-500/50 object-cover"
          />
          <div>
            <div className="text-sm font-semibold text-white">{user.displayName || 'No Name'}</div>
            <div className="text-xs text-neutral-400">
              {SIDEBAR_SECTIONS.find(s => s.id === section)?.label}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 p-4 space-y-2">
          {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={section === id ? 'default' : 'ghost'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 justify-start ${
                section === id 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
              }`}
              onClick={() => setSection(id)}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Button>
          ))}
          <div className="pt-4 border-t border-neutral-800">
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Desktop Sidebar
  const Sidebar = (
    <aside className={`hidden lg:flex bg-neutral-900/50 backdrop-blur border-r border-neutral-800 h-screen sticky top-0 flex-col py-6 px-4 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} min-w-[5rem]`}>
      <div className="flex flex-col items-center gap-4 mb-8 pb-6 border-b border-neutral-800">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <img
            src={avatarUrl || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=8b5cf6&color=fff`}
            alt="Avatar"
            className="relative w-16 h-16 rounded-full border-2 border-purple-500/50 shadow-lg object-cover bg-neutral-800"
          />
        </div>
        {sidebarOpen && (
          <div className="text-center">
            <div className="text-base font-semibold text-white truncate max-w-[200px]">
              {user.displayName || 'No Name'}
            </div>
            <div className="text-sm text-neutral-400 truncate max-w-[200px] mb-3">
              {user.email}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <span className="text-xs text-purple-300 font-medium">
                {user.plan || "Free"} Plan
              </span>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={section === id ? 'default' : 'ghost'}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
              section === id 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
            } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            onClick={() => setSection(id)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </Button>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-neutral-800 flex flex-col gap-3">
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="w-full border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {sidebarOpen && "Sign Out"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );

  // Main Content Sections
  const MainContent = (
    <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
      <div className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
        {/* Profile Info */}
        {section === "profile" && (
          <div className="space-y-6 fade-in">
            {/* Hero Profile Card */}
            <Card className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur border-neutral-800 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <img
                      src={avatarUrl || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=8b5cf6&color=fff`}
                      alt="Avatar"
                      className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-purple-500/50 shadow-xl object-cover bg-neutral-800"
                    />
                    {editing && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
                        <Input
                          type="url"
                          placeholder="Paste image URL"
                          value={avatarInput}
                          onChange={e => setAvatarInput(e.target.value)}
                          className="w-full sm:w-48 text-sm bg-neutral-800/50 border-neutral-700 focus:border-purple-500"
                          disabled={profileLoading}
                        />
                        <Button 
                          size="sm" 
                          onClick={handleAvatarChange} 
                          disabled={profileLoading || !avatarInput.trim()}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 w-full sm:w-auto"
                        >
                          Set
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    {editing ? (
                      <Input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="text-xl lg:text-2xl font-bold bg-neutral-800/50 border-neutral-700 focus:border-purple-500 mb-4"
                        disabled={profileLoading}
                        maxLength={32}
                      />
                    ) : (
                      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                        {user.displayName || "No Name"}
                      </h1>
                    )}
                    
                    <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 text-neutral-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      {editing ? (
                        <>
                          <Button 
                            onClick={handleSave} 
                            disabled={profileLoading}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          >
                            {profileLoading ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button 
                            onClick={() => setEditing(false)} 
                            variant="outline" 
                            className="border-neutral-700 hover:bg-neutral-800"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setEditing(true)} 
                          variant="outline" 
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 stagger-fade-in">
              <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                    <User className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{user?.displayName ? 1 : 0}</div>
                  <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Profile Completeness</div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                    <Zap className="w-7 h-7 text-green-400 group-hover:text-green-300" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">-</div>
                  <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">AI Interactions</div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group cursor-pointer sm:col-span-2 lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
                    <Zap className="w-7 h-7 text-orange-400 group-hover:text-orange-300" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">{user.plan || "Free"}</div>
                  <div className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Current Plan</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* AI Usage */}
        {section === "ai" && (
          <div className="fade-in">
            <Card className="bg-neutral-900/50 backdrop-blur border-neutral-800 shadow-lg hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-xl lg:text-2xl text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6" />
                  AI Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 lg:p-8">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI Features Coming Soon</h3>
                  <p className="text-neutral-400 mb-8 max-w-md mx-auto">Track your AI usage, manage preferences, and view detailed analytics.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
                    <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700">
                      <div className="text-3xl font-bold text-white mb-2">-</div>
                      <div className="text-sm text-neutral-400">Prompts Used</div>
                    </div>
                    <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700">
                      <div className="text-3xl font-bold text-white mb-2">-</div>
                      <div className="text-sm text-neutral-400">Code Generated</div>
                    </div>
                    <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700">
                      <div className="text-3xl font-bold text-white mb-2">-</div>
                      <div className="text-sm text-neutral-400">Last Used</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
                    disabled
                  >
                    Manage AI Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Danger Zone */}
        {section === "danger" && (
          <div className="fade-in">
            <Card className="bg-neutral-900/50 backdrop-blur border-red-500/30 shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
              <CardHeader className="border-b border-red-500/30">
                <CardTitle className="text-xl lg:text-2xl text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 space-y-8">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-red-400 font-semibold text-lg mb-3">Change Password</h3>
                  <p className="text-sm text-neutral-400 mb-6">
                    Update your account password. You'll receive an email with instructions.
                  </p>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 mb-4"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    Change Password
                  </Button>
                  {showPassword && (
                    <div className="space-y-4">
                      <Input
                        type="password"
                        placeholder="New password (demo only)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-neutral-800/50 border-neutral-700 focus:border-red-500"
                        disabled={passwordLoading}
                      />
                      <Button
                        onClick={handleChangePassword}
                        disabled={passwordLoading || !password}
                        className="bg-red-600 hover:bg-red-700 text-white w-full lg:w-auto"
                      >
                        {passwordLoading ? "Sending..." : "Send Password Reset Email"}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-red-400 font-semibold text-lg mb-3">Delete Account</h3>
                  <p className="text-sm text-neutral-400 mb-6">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white w-full lg:w-auto"
                    disabled
                  >
                    Delete Account (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {MobileHeader}
      <div className="flex min-h-screen lg:max-w-7xl lg:mx-auto">
        {Sidebar}
        {MainContent}
      </div>
    </div>
  );
} 