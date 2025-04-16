"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`;
      } catch (err) {
        console.error("Logout failed:", err);
        router.push("/"); 
      }
    };

    logout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Logging you out...</p>
      </div>
    </div>
  );
}
