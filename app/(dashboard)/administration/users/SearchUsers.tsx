'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== (searchParams.get('search') || '')) {
        const params = new URLSearchParams(searchParams.toString())
        if (inputValue) {
          params.set('search', inputValue)
        } else {
          params.delete('search')
        }
        
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`)
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue, pathname, router, searchParams])

  const handleClear = () => {
    setInputValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="search-pill w-full">
      <Search className="w-4 h-4 text-steel" />
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Rechercher des utilisateurs (nom, email...)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 outline-none bg-transparent"
      />
      <div className="flex items-center gap-2">
        {isPending && (
          <div className="w-4 h-4 border-2 border-[var(--color-brand-green)] border-t-transparent rounded-full animate-spin" />
        )}
        {inputValue && (
          <button 
            onClick={handleClear}
            className="text-stone hover:text-ink transition-colors p-1"
            title="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
