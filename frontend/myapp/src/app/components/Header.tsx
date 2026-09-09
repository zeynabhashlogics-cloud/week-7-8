
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    router.push("/");
  }

  return (
    <header className="bg-sky-200 shadow-md">
      <nav className="flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-semibold hover:text-blue-700" >
            Home
          </Link>

          <Link
            href="/about"
            className="font-semibold hover:text-blue-700">
            About
          </Link>

          <Link
            href="/tasks"
            className="font-semibold hover:text-blue-700">
            Tasks
          </Link>
        </div>

        {isLoggedIn && (
          <button
            onClick={logout}
            className="rounded-md bg-red-500 px-5
             py-2 font-semibold text-white hover:bg-red-600">
            Logout
          </button>
        )}

      </nav>
    </header>
  );
}
