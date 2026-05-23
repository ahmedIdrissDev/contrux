"use client";

import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20  flex items-center justify-center  ">
        <ShieldAlert className="w-10 h-10 text-red-600" />
      </div>
      
      <h1 className="heading-3 text-ink mb-2">Accès non autorisé</h1>
      <p className="body-md text-steel mb-2">
        Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page. <br />
        Veuillez contacter un administrateur si vous pensez qu'il s'agit d'une erreur.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
       
        <button 
          onClick={() => router.back()}
          className="text-amber-700 cursor-pointer gap-1 w-50 flex justify-center items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Page précédente
        </button>
      </div>
    </div>
  );
}
