import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

const page = () => {
  return (
    <div className='flex flex-col space-y-8 w-full max-w-[400px] mx-auto'>
      <div className="flex flex-col space-y-4">
        <Image 
          className="w-40" 
          src={'/img/logo.svg'} 
          width={160} 
          height={40} 
          alt="Construx Pro" 
          priority
        />
        <div className="space-y-2">
          <h2 className="heading-3 text-ink">Bienvenue sur Construx</h2>
          <p className='body-md text-steel'>
            La plateforme intelligente pour la gestion de vos ressources et de vos chantiers.
          </p>
        </div>
      </div>
      
      <div className="pt-4">
        <Link 
          href={'/sign-in'} 
          className='button-primary group flex items-center justify-center gap-2 w-full h-12 text-base font-semibold transition-all hover:gap-3'
        >
          Continuer vers la connexion
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-4 text-center body-sm text-muted">
          Pas encore de compte ? Contactez votre administrateur.
        </p>
      </div>
    </div>
  )
}

export default page