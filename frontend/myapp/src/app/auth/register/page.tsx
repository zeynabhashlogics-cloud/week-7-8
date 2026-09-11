"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    
    if (!name.trim() || !email.trim() || !password) 
      {
      setError("Name, email and password are required");
      return;
    }

    if (name.trim().length < 2) 
      {
      setError("Name must be at least 2 characters");
      return;
    }

    if (password.trim()==="")
    {
       setError ("password is required");
       return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailFormat.test(email.trim()))
{
  setError("enter a valid email");
  return;
}
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess(
        "Registration successful!"
      );
      setTimeout(() => 
        {
        router.push("/auth/login");
      }, 1000);

    } 

    catch (error)
     {
      console.log("error" ,error);
      setError("cannot connect to the server");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        {error && (
          <div className="mt-5 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-md bg-green-100 px-4 py-3 text-sm 
          text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="mt-6 space-y-5">

        
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5"/>
          </div>

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
              className="mt-1 w-full rounded-md border border-gray-300 px-4 
              py-2.5"/>
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5"/>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 
            font-medium text-white hover:bg-blue-700 
            disabled:cursor-not-allowed disabled:opacity-50">

            {loading ? "Creating account..." : "Register"}
          </button>

        </form>
        
      </div>
    </main>
  );
}

