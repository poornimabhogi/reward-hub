import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.access_token, email);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(googleEmail, googlePassword)) {
      toast({
        title: "Success",
        description: "Logged in with Google successfully",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Invalid Google credentials",
        variant: "destructive",
      });
    }
  };

  const continueAsGuest = () => {
    if (login("guest@example.com", "guest123456")) {
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground mt-2">Sign in to your account</p>
      </div>

      {!showGoogleForm ? (
        <>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowGoogleForm(true)}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={continueAsGuest}
            >
              Continue as Guest
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleGoogleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Google Email"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Google Password"
              value={googlePassword}
              onChange={(e) => setGooglePassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowGoogleForm(false)}
          >
            Back to Regular Login
          </Button>
        </form>
      )}

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            onClick={() => navigate("/signup")}
            className="p-0"
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};