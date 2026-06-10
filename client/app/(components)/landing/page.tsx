"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/(Context)/UserContext";

const DEMO_ROLL = "21BDS062";
const DEMO_PASSWORD = "123454321";

export default function LandingPage() {
  const [copiedField, setCopiedField] = useState<"roll" | "pass" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setUser } = useUserContext();
  const router = useRouter();

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ roll_no: DEMO_ROLL, password: DEMO_PASSWORD }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/dashboard");
      } else {
        setError(data.message || "An error occurred during demo sign-in.");
      }
    } catch (error) {
      setError("An error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, field: "roll" | "pass") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-36 h-10 bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: "url('/images/CGC-5.jpg')" }}
            />
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold bg-[#3056D3] hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            CGC Placement Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the centralized platform for CGC students.
          </p>

          <div className="border-t border-gray-100 pt-8 mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Demo Access credentials.
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Use these credentials to explore the platform instantly.
            </p>

            <div className="flex flex-col gap-3 mb-6 text-left">
              <div className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-lg p-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Roll No. / ID</p>
                  <code className="text-gray-900 font-mono text-sm">{DEMO_ROLL}</code>
                </div>
                <button
                  onClick={() => copy(DEMO_ROLL, "roll")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    copiedField === "roll"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {copiedField === "roll" ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-lg p-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Password</p>
                  <code className="text-gray-900 font-mono text-sm">{DEMO_PASSWORD}</code>
                </div>
                <button
                  onClick={() => copy(DEMO_PASSWORD, "pass")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    copiedField === "pass"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {copiedField === "pass" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className={`block w-full py-2.5 bg-[#3056D3] hover:bg-blue-700 text-white font-semibold rounded-lg text-sm text-center transition-colors shadow-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Login with Demo Credentials"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
        </div>
      </main>
      
      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} CGC College of Engineering
      </footer>
    </div>
  );
}
