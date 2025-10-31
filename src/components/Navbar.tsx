import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-brand-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-accent">
            Darwaza
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-accent hover:text-cocoa-900">
              Home
            </Link>
            <Link href="/shop" className="text-accent hover:text-cocoa-900">
              Shop
            </Link>
            <Link href="/about" className="text-accent hover:text-cocoa-900">
              About
            </Link>
            <Link href="/contact" className="text-accent hover:text-cocoa-900">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="rounded-full bg-brand-base px-4 py-2 text-accent hover:opacity-90">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}