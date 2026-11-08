import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Loader2, KeyRound } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToWebsite,
}) => {
  const [email, setEmail] = useState("admin@dr-lovelydas-clinic.com");
  const [password, setPassword] = useState("LDAdmin@2026!Secure");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showAutoInit, setShowAutoInit] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage(
            "Account not found or password incorrect. If this is your first time setting up the clinic, click 'Initialize Admin Account' below."
          );
          setShowAutoInit(true);
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data?.session) {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper to initialize the default admin account if not created yet in Supabase Auth
  const handleCreateDefaultAdmin = async () => {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: "admin@dr-lovelydas-clinic.com",
        password: "LDAdmin@2026!Secure",
        options: {
          data: {
            full_name: "Dr. Lovely Das Admin",
            role: "admin",
          },
        },
      });

      if (error) {
        setErrorMessage(
          `Could not initialize user automatically (${error.message}). Please create the user in your Supabase Auth dashboard or SQL editor.`
        );
      } else if (data?.user) {
        // If email confirmation is disabled, user is immediately active
        if (data.session) {
          setInfoMessage("Admin account initialized and signed in successfully!");
          onLoginSuccess();
        } else {
          setInfoMessage(
            "Admin account created! If Supabase requires email verification, confirm it in your Supabase Auth dashboard or run the SQL trigger."
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Initialization failed";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative selection:bg-teal-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg bg-slate-900 border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Clinic Website</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-900/40">
            <Shield className="w-7 h-7 text-teal-100" />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-teal-400 uppercase bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
            Clinic Management Portal
          </span>
          <h2 className="text-2xl font-bold font-serif text-white mt-2">
            Dr. Lovely Das
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            MDS Endodontist & Root Canal Specialist · Mukundapur
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{infoMessage}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Doctor / Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dr-lovelydas-clinic.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-teal-400 font-mono">
                Initial: LDAdmin@2026!Secure
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-teal-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Initialize helper if first time */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-2">
            First time logging in or account not created yet?
          </p>
          <button
            type="button"
            onClick={handleCreateDefaultAdmin}
            disabled={loading}
            className="text-xs font-medium text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Initialize Default Clinic Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};
