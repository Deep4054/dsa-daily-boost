import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback started");
      console.log("Current URL:", window.location.href);
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state change:", event, session);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in:", session.user.email);
          navigate("/dashboard");
        } else if (event === 'SIGNED_OUT' || !session) {
          console.log("No session, redirecting home");
          navigate("/");
        }
      });
      
      // Also check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Existing session found:", session.user.email);
        navigate("/dashboard");
      }
      
      // Cleanup after 10 seconds if nothing happens
      setTimeout(() => {
        subscription.unsubscribe();
        if (window.location.pathname === '/auth/callback') {
          console.log("Timeout reached, redirecting home");
          navigate("/");
        }
      }, 10000);
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Completing sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;