'use client'

import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn()
  
  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    if (!signIn) return;

    const { error } = await signIn.password({
      emailAddress,
      password,
    })

    if (error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          window.location.href = decorateUrl('/')
        },
      })
    }
  }

  const handleVerify = async (formData: FormData) => {
    const code = formData.get('code') as string
    if (!signIn) return;

    let verification;
    if (signIn.status === 'needs_first_factor') {
      verification = await signIn.emailCode.verifyCode({ code })
    } else {
      verification = await signIn.mfa.verifyEmailCode({ code })
    }

    if (verification.error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          window.location.href = decorateUrl('/')
        },
      })
    }
  }

  const buttonClasses = "button-primary w-full mt-6";
  const inputClasses = "text-input w-full";

  if (!signIn) return null;

  if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_first_factor' || signIn.status === 'needs_second_factor') {
    return (
      <div className="dialog-content max-w-[500px]">
        <h1 className="heading-1 mb-8 text-ink">Vérifiez votre compte</h1>
        <form action={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-xs text-stone font-medium mb-1.5 uppercase">Code de vérification</label>
            <input id="code" name="code" type="text" required className={inputClasses} />
            {errors?.fields?.code && <p className="mt-2 text-xs text-red-600">{errors.fields.code.message}</p>}
          </div>
          <button type="submit" disabled={fetchStatus === 'fetching'} className={buttonClasses}>
            Vérifier
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="card-base flex flex-col gap-6 w-[500px]">
      <div className="flex flex-col space-y-4">
        <Image className="w-32" src={'/img/logo.svg'} width={1000} height={1000} alt="construx pro" />
        <p className='body-md text-steel'>Une solution complète pour la gestion des chantiers.</p>
      </div>
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs text-stone font-medium mb-1.5 uppercase">Adresse email</label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="nom@entreprise.com" />
          {errors?.fields?.identifier && <p className="mt-2 text-xs text-red-600">{errors.fields.identifier.message}</p>}
        </div>
        <div>
          <label htmlFor="password" title='Password' className="block text-xs text-stone font-medium mb-1.5 uppercase">Mot de passe</label>
          <input id="password" name="password" type="password" required className={inputClasses} placeholder="••••••••" />
          {errors?.fields?.password && <p className="mt-2 text-xs text-red-600">{errors.fields.password.message}</p>}
        </div>
        <button type="submit" disabled={fetchStatus === 'fetching'} className={buttonClasses}>
          Continuer
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="body-md text-steel">
          Pas encore de compte ?{' '}
          <Link href="/sign-up" className="font-semibold text-brand-green-dark hover:opacity-80 transition-opacity underline-offset-4">
            Inscrivez-vous
          </Link>
        </p>
      </div>

      {errors?.global && errors.global.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md">
          {errors.global.map((error, index) => (
            <p key={index} className="text-xs">{error.message}</p>
          ))}
        </div>
      )}
    </div>
  )
}
