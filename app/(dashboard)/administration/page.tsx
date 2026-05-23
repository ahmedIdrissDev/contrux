"use client";

import { Users, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdministrationPage() {
  const adminSections = [
    {
      title: "Utilisateurs",
      description: "Gérez les rôles et les permissions des utilisateurs.",
      href: "/administration/users",
      icon: Users,
    },
    {
      title: "Paramètres",
      description: "Configurez les paramètres globaux de l'application.",
      href: "/administration/settings",
      icon: Settings,
    },
    {
      title: "Sécurité",
      description: "Audit des logs et paramètres de sécurité.",
      href: "/administration/security",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="border-l-4 border-brand-green pl-4">
        <h1 className="heading-2 text-ink">Administration</h1>
        <p className="body-md text-steel">Gérez les paramètres du système et les utilisateurs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card-base flex flex-col gap-6 hover:border-brand-green transition-all"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-surface rounded-full text-steel">
              <section.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="heading-3 text-ink">
                {section.title}
              </h2>
              <p className="mt-2 body-md text-steel leading-relaxed">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
