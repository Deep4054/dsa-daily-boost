import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Handle OAuth callback from URL hash
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        console.log('✅ Found existing session:', data.session.user.email);
        setUser(data.session.user);
      }
    };

    handleAuthCallback();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in successfully');
        setUser(session?.user ?? null);
        setLoading(false);
        toast({
          title: "Welcome!",
          description: `Signed in as ${session?.user?.email}`,
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log("🚀 Starting Google OAuth...");
      console.log("Environment check:", {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasGoogleClientId: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectTo: `${window.location.origin}/`
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      console.log("📋 OAuth response:", { data, error });
      
      if (error) {
        console.error("❌ OAuth error details:", {
          message: error.message,
          status: error.status,
          details: error
        });
        throw error;
      }
      
      console.log("✅ OAuth initiated successfully");
    } catch (error: any) {
      console.error("💥 Sign in error:", error);
      toast({
        title: "Sign In Error",
        description: `${error.message || 'Unknown error'}. Check console for details.`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear user state immediately
      setUser(null);
      
      // Clear localStorage
      localStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Supabase signout error:', error);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Reload page to reset all state
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      // Force sign out anyway
      setUser(null);
      localStorage.clear();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <Button
          onClick={signOut}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }



  return (
    <Button
      onClick={signInWithGoogle}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};