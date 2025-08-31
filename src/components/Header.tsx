import { GraduationCap, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { useUserData } from "@/hooks/useUserData";

interface HeaderProps {
  isTimerActive?: boolean;
}

export const Header = ({ isTimerActive = false }: HeaderProps) => {
  const { user } = useUserData();
  const location = useLocation();

  return (
    <header className="bg-purple-900 border-b border-purple-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DSA Mastery</h1>
                <p className="text-sm text-white/80">Your path to algorithmic excellence</p>
              </div>
            </Link>
            


            {isTimerActive && (
              <div className="text-red-400 text-sm font-medium">
                🔒 Study Session Active - Navigation Locked
              </div>
            )}
          </div>
          
          <div className={isTimerActive ? "opacity-50 pointer-events-none" : ""}>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};