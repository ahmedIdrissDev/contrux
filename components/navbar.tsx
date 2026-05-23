"use client";

import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import { Settings } from "lucide-react";

export function Navbar() {
  const { signOut } = useClerk();

  return (
    <header className="h-16 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] flex items-center justify-end px-6 sticky top-0 z-10">
      <div className="flex h-full items-center gap-4">
        <button 
          onClick={() => signOut({ redirectUrl: "/" })}
          className="button-secondary"
        >
          Se déconnecter
        </button>
        <UserButton/>
      </div>
    </header>
  );
}
