"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { SIDEBAR_NAV_ITEMS } from "@/constants/sidebar-nav";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;

  return (
    <aside className="w-64 bg-neutral-50 border-r border-[var(--color-hairline)] h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-hairline)]">
        <Link href="/">
          <Image className="w-32" src={'/img/logo.svg'} width={1000} height={1000} alt="construx pro" />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-0 ">
        {SIDEBAR_NAV_ITEMS.map((item) => {
        

          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "pill-tab flex items-center gap-3 px-4 py-2 border-none",
                isActive && "active"
              )}
            >
              <Icon className="w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
    </aside>
  );
}
