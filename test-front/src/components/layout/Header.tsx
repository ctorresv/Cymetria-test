import { Users } from "lucide-react";

export default function Header() {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Users className="h-6 w-6" />
                    <span>Cymetria Test</span>
                </div>
                <nav className="ml-auto flex gap-4 text-sm font-medium text-muted-foreground">
                    <a href="/" className="hover:text-foreground transition-colors">Usuarios</a>
                    <a href="https://github.com/CymetriaGroup/test-back" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                        Repositorio Base
                    </a>
                </nav>
            </div>
        </header>
    );
}