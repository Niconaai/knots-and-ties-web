import Link from 'next/link'
import { playfair, inter } from './fonts'
import './globals.css'

export default function RootNotFound() {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
          <div className="text-center space-y-8 max-w-lg">
            
            {/* Decorative Element */}
            <div className="relative">
              <span className="text-[150px] font-serif text-stone-200 leading-none block">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">👔</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-serif text-zinc-900">
                Page Not Found
              </h1>
              
              <p className="text-zinc-600 max-w-md mx-auto">
                The page you're looking for seems to have wandered off. 
                Perhaps it's out getting fitted for a new tie?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/en"
                className="px-8 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors"
              >
                Go Home
              </Link>
              
              <Link
                href="/en/shop"
                className="px-8 py-3 border border-zinc-300 text-zinc-900 text-sm font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors"
              >
                Browse Shop
              </Link>
            </div>
            
            {/* Decorative footer */}
            <p className="text-xs text-zinc-400 pt-8 uppercase tracking-widest">
              Knots & Ties — Handmade in South Africa
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
