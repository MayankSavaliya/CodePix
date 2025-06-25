import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/use-auth-store';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Code, 
  Palette, 
  Download, 
  Share2, 
  Zap, 
  Users,
  Star,
  ArrowRight,
  Github
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Beautiful Code Snippets",
      description: "Create stunning visual representations of your code with syntax highlighting"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Multiple Themes",
      description: "Choose from a variety of beautiful themes and color schemes"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Options",
      description: "Export as PNG, SVG, or copy directly to clipboard"
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Easy Sharing",
      description: "Share your snippets with others via direct links"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Auto-Detection",
      description: "Automatically detect programming languages for proper highlighting"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Save & Organize",
      description: "Save your snippets and organize them in your personal library"
    }
  ];
  const handleGetStarted = () => {
    if (isAuthenticated) {
      onGetStarted();
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">CodePix</h1>
          </div>
            <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-neutral-300 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              onClick={handleGetStarted}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Create Beautiful Code Snippets</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Turn Your Code Into
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Beautiful Images
            </span>
          </h1>
          
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Create stunning, shareable images of your code snippets with beautiful themes, 
            custom fonts, and professional styling. Perfect for social media, documentation, and presentations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
            >
              Try It Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onGetStarted}
              className="border-neutral-600 text-neutral-300 hover:text-white hover:border-neutral-500 text-lg px-8 py-3"
            >
              Skip Sign Up
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-neutral-400">
            No credit card required • Free forever • 2 minutes to get started
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-neutral-300 text-lg">
              Powerful features to create professional-looking code snippets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-neutral-900/50 backdrop-blur border-neutral-800 hover:border-neutral-700 shadow-lg transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-purple-400">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Amazing Code Snippets?
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Join thousands of developers who use CodePix to share their code beautifully
          </p>
          
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">CodePix</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>        </div>
      </footer>
    </div>
  );
}
