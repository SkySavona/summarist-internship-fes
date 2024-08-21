"use client";

import React, { useState, useEffect, Suspense } from "react";
import { getFirebaseAuth, getFirebaseDb, googleProvider } from "@/services/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  User,
  Auth
} from "firebase/auth";
import { FaGoogle, FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../ui/LoadingSpinner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl") || "/for-you";

  const [auth, setAuth] = useState<Auth | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const authInstance = getFirebaseAuth();
        setAuth(authInstance);
        setIsFirebaseInitialized(true);
        console.log("Firebase Auth initialized successfully");
      } catch (error) {
        console.error("Error initializing Firebase Auth:", error);
        setError("Failed to initialize authentication. Please try again later.");
      }
    };

    initFirebase();
  }, []);

  useEffect(() => {
    if (auth && isFirebaseInitialized) {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          setUser(user);
          setLoading(false);
        },
        (error) => {
          console.error("Auth state change error:", error);
          setAuthError("An error occurred during authentication. Please try again.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [auth, isFirebaseInitialized]);

  const createUserDocument = async (user: User) => {
    const db = getFirebaseDb();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Guest",
          provider: user.providerData[0]?.providerId,
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
        });
        console.log("User document created successfully");
        return true; // New user
      } catch (error) {
        console.error("Error creating user document:", error);
        throw new Error("Failed to create user profile. Please try again.");
      }
    }
    return false; // Existing user
  };

  const handleSuccessfulAuth = async (user: User, isNewUser: boolean) => {
    try {
      if (isNewUser) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          router.push(returnUrl);
          onClose();
        }, 3000);
      } else {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        router.push(returnUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error in handleSuccessfulAuth:", error);
      setError("An error occurred during authentication. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      console.error("Auth is not initialized");
      setError("Authentication is not ready. Please try again.");
      return;
    }
    setError("");
    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const isNewUser = await createUserDocument(result.user);
        await handleSuccessfulAuth(result.user, isNewUser);
      } else if (mode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const db = getFirebaseDb();
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error("User profile not found. Please sign up first.");
        }
        await handleSuccessfulAuth(result.user, false);
      } else if (mode === "forgot") {
        await handleForgotPassword();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) {
      console.error("Auth is not initialized");
      setError("Authentication is not ready. Please try again.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const db = getFirebaseDb();
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await handleSuccessfulAuth(result.user, false);
        } else {
          if (window.confirm("You don't have an account yet. Would you like to create one?")) {
            const isNewUser = await createUserDocument(result.user);
            await handleSuccessfulAuth(result.user, isNewUser);
          } else {
            await auth.signOut();
            setError("Account creation cancelled. You can try again or use a different method to sign in.");
          }
        }
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError(error.message || "An error occurred during sign-in. Please try again.");
    }
  };

  const handleGuestLogin = async () => {
    if (!auth) {
      console.error("Auth is not initialized");
      setError("Authentication is not ready. Please try again.");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
      const isNewUser = await createUserDocument(result.user);
      await handleSuccessfulAuth(result.user, isNewUser);
    } catch (error: any) {
      console.error("Guest login error:", error);
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth) {
      console.error("Auth is not initialized");
      setError("Authentication is not ready. Please try again.");
      return;
    }
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message);
    }
  };

  const toggleMode = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    setError("");
    setResetEmailSent(false);
  };

  if (!isOpen) return null;

  if (loading) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {mode === "login"
              ? "Login to Summarist"
              : mode === "signup"
              ? "Sign up for Summarist"
              : "Reset Password"}
          </h2>
          <div className="space-y-4">
            {mode === "login" && (
              <>
                <button
                  onClick={handleGuestLogin}
                  className="w-full bg-[#032b41] text-white py-3 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-slate-600"
                >
                  <FaUser className="mr-2" /> Login as a Guest
                </button>
                <button
                  onClick={handleGoogleAuth}
                  className="w-full bg-[#032b41] border-gray-300 text-white py-3 rounded-md hover:bg-slate-600 duration-200 flex items-center justify-center transition-colors"
                >
                  <FaGoogle className="mr-2" /> Login with Google
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                onClick={handleGoogleAuth}
                className="w-full bg-[#032b41] border-gray-300 text-white py-3 rounded-md hover:bg-slate-600 duration-200 flex items-center justify-center transition-colors"
              >
                <FaGoogle className="mr-2" /> Sign up with Google
              </button>
            )}
            {(mode === "login" || mode === "signup") && (
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 bg-white">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {mode !== "forgot" && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              )}
              {mode === "signup" && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password *"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {mode === "forgot" && resetEmailSent && (
                <p className="text-green-500 text-sm">
                  Password reset email sent! Please check your inbox.
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                {mode === "login"
                  ? "Login"
                  : mode === "signup"
                  ? "Sign Up"
                  : "Reset Password"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600">
              {mode === "login" && (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => toggleMode("signup")}
                    className="text-green-500 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
              {mode === "signup" && (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => toggleMode("login")}
                    className="text-green-500 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
              {mode === "forgot" && (
                <button
                  onClick={() => toggleMode("login")}
                  className="text-green-500 hover:underline"
                >
                  Back to Login
                </button>
              )}
            </p>
            {mode !== "forgot" && (
              <p className="text-center text-sm">
                <button
                  onClick={() => toggleMode("forgot")}
                  className="text-green-500 hover:underline"
                >
                  Forgot your password?
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">Thank you for signing up!</h2>
            <p>You will be redirected shortly...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;