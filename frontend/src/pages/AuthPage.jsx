import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Moon, Sun, Mail, Lock, User, Eye, EyeOff,
  XCircle, X, Loader2
} from "lucide-react";

export default function AuthPage() {
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (mode === "register" && !form.name.trim())
      newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setApiError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: "", email: "", password: "" });
    setErrors({});
    setApiError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] dark:bg-[#0b0f1e] transition-colors duration-300 px-4">

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white text-sm font-medium backdrop-blur-md shadow-lg hover:scale-105 transition-all"
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
        {isDark ? "Dark Mode" : "Light Mode"}
      </button>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141929] shadow-2xl p-8 transition-all duration-300">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-3 shadow-lg">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NoteVault
          </h1>
        </div>

        {/* Divider dot */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-purple-500 mx-3" />
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        {/* API Error */}
        {apiError && (
          <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
            <div className="flex items-center gap-2">
              <XCircle size={18} />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-6">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200
                ${mode === m
                  ? "bg-white dark:bg-[#1e2a45] text-purple-600 dark:text-purple-400 shadow"
                  : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-4">

          {/* Name — register only */}
          {mode === "register" && (
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
                Full Name
              </label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 bg-white dark:bg-white/5 transition-all
                ${errors.name ? "border-red-500" : "border-gray-300 dark:border-white/10 focus-within:border-purple-500"}`}>
                <User size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full text-sm"
                />
              </div>
              {errors.name && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
              Email
            </label>
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 bg-white dark:bg-white/5 transition-all
              ${errors.email ? "border-red-500" : "border-gray-300 dark:border-white/10 focus-within:border-purple-500"}`}>
              <Mail size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full text-sm"
              />
            </div>
            {errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
              Password
            </label>
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 bg-white dark:bg-white/5 transition-all
              ${errors.password ? "border-red-500" : "border-gray-300 dark:border-white/10 focus-within:border-purple-500"}`}>
              <Lock size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full text-sm"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 shrink-0">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span>{mode === "login" ? "Logging in..." : "Creating account..."}</span>
              <Loader2 size={18} className="animate-spin" />
            </>
          ) : (
            mode === "login" ? "Login" : "Create Account"
          )}
        </button>

        {/* Switch Mode Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button onClick={() => switchMode("register")} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => switchMode("login")} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}