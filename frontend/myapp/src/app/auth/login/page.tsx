"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) 
    {
      setError("Email and password are required");
      return;
    }

    if (password.trim() === "") 
   { setError("Password is required"); 
    return; 
   } 
  
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  
    if (!emailFormat.test(email.trim())) 
    { 
      setError("Enter a valid email"); 
      return; 
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) 
      {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/tasks");
    } 
    catch (error)
     {
      console.log("Error ", error);
      setError("Unable to connect to the server");

    }
    finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Login to access your tasks
        </p>

        {error && (
          <div className="mt-5 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-5">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300
               px-4 py-2.5"/>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium
             text-white hover:bg-blue-700 disabled:cursor-not-allowed 
             disabled:opacity-50">

            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </main>
  );
}

