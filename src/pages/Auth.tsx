import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const fullName = formData.get("full-name") as string;

    const redirectUrl = `${window.location.origin}/app`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Could not sign up",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/app`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({
        title: "Could not connect",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Could not sign in",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <NightSkyBackground>
      <div className="min-h-screen flex flex-col">
        {/* Minimal Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="px-5 pt-8 pb-4 text-center"
        >
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.3em]">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-start justify-center px-5 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-sm space-y-8"
        >
          
          {/* Auth Forms */}
          <AnimatePresence mode="wait">
          <motion.div 
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-card/20 backdrop-blur-sm rounded-xl p-6 space-y-6"
          >
            {mode === 'signup' ? (
              <form onSubmit={handleSignUp} className="space-y-5">
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-[13px] text-foreground/60 border-border/50 hover:bg-foreground/5"
                >
                  <img src="/google-logo.svg" alt="" className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-transparent text-[10px] text-foreground/30 uppercase tracking-wider">
                      or
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name">Name</Label>
                  <Input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="Your name"
                    required
                    disabled={isLoading}
                    className="text-[13px] bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 h-auto focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="text-[13px] bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 h-auto focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="text-[13px] bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 h-auto focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/20"
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full text-[13px]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Create Account"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-5">
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-[13px] text-foreground/60 border-border/50 hover:bg-foreground/5"
                >
                  <img src="/google-logo.svg" alt="" className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-transparent text-[10px] text-foreground/30 uppercase tracking-wider">
                      or
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="text-[13px] bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 h-auto focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="signin-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="text-[13px] bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 h-auto focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/20"
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full text-[13px]" 
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Sign In"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
          </AnimatePresence>
          
          {/* Toggle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-[11px] text-foreground/40"
          >
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-foreground/60 hover:text-foreground/80"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-foreground/60 hover:text-foreground/80"
                >
                  Sign up
                </button>
              </>
            )}
          </motion.p>
        </motion.div>
        </div>
      </div>
    </NightSkyBackground>
  );
};

export default Auth;
