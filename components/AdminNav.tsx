import Link from 'next/link';

export function AdminNav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-serif tracking-wider">
            Kalpavruksha Admin
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/classes" className="text-foreground/80 hover:text-primary transition-colors">Classes</Link>
            <Link href="/resources" className="text-foreground/80 hover:text-primary transition-colors">Resources</Link>
            <Link href="http://localhost:3000" target="_blank" className="text-foreground/80 hover:text-primary transition-colors">View Student Portal</Link>
        </div>
      </div>
    </nav>
  );
}
