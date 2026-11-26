
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogIn, UserPlus } from "lucide-react";
import "./Pages.css";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setMessage(
          data.session
            ? "Account created successfully!"
            : "Account created! Check your email to verify it."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">🌷</div>

        <h1>Welcome to StudyBloom</h1>
        <p>Your personal academic and placement planner.</p>

        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? (
            <><UserPlus size={17} /> Sign Up</>
          ) : (
            <><LogIn size={17} /> Login</>
          )}
        </button>

        {message && <p className="login-message">{message}</p>}

        <p className="login-switch">
          {isSignup ? "Already have an account?" : "New to StudyBloom?"}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup ? "Login" : "Create Account"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
