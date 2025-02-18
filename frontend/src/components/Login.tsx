import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface LoginProps {
  onLogin: (token: string, userData: { name: string; picture: string }) => void;
  loggedIn: boolean;  
  user: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, loggedIn, user }) => {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credential,
      });
      const { token, user } = res.data;
      onLogin(token, user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full md:w-1/2 flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 transition-all"
    >
      {loggedIn ? (
        <motion.div
          className="text-white text-xl font-bold"
          animate={{ opacity: [0, 1], scale: [0.8, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          Welcome {user?.name}! 🚀
        </motion.div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-4">Login with Google</h1>
          <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
        </>
      )}
    </motion.div>
  );
};

export default Login;