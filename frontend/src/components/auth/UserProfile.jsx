import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/use-auth-store';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User, Settings, LogOut, Crown } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Button
        onClick={() => navigate('/login')}
        variant="outline"
        size="sm"
        className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
      >
        <User className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </span>
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-neutral-400">
              {user.plan === 'pro' ? 'Pro' : 'Free'} Plan
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-white">{user.displayName}</p>
          <p className="text-xs text-neutral-400">{user.email}</p>
        </div>
        
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="text-white hover:bg-neutral-800"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-white hover:bg-neutral-800">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        {user.plan !== 'pro' && (
          <DropdownMenuItem className="text-white hover:bg-neutral-800">
            <Crown className="mr-2 h-4 w-4 text-yellow-500" />
            Upgrade to Pro
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-neutral-800" />
        
        <DropdownMenuItem 
          onClick={signOut}
          className="text-red-400 hover:bg-neutral-800 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
