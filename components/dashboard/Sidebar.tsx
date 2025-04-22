"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DocumentTextIcon,
  PhotoIcon,
  CodeBracketIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

const items = [
  { name: "Report", href: "/dashboard/pdf", icon: DocumentTextIcon },
  { name: "Immagini", href: "/dashboard/image", icon: PhotoIcon },
  { name: "Codice", href: "/dashboard/code", icon: CodeBracketIcon },
  { name: "Audio", href: "/dashboard/audio", icon: MicrophoneIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-zinc-950 border-r border-zinc-800 p-6">
      <div className="mb-10 pt-4">
        <h1 className="text-2xl font-bold text-white text-center">Mini AI Hub</h1>
        <p className="text-sm text-zinc-400 mt-2 text-center">Le tue app AI preferite</p>
      </div>
      
      <nav className="space-y-2">
        {items.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active 
                  ? "bg-purple-600 text-white shadow-md" 
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 