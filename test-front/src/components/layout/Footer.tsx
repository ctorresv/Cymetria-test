export default function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Desarrollado para la prueba técnica de Cymetria.
                    <span className="font-medium text-foreground"> Arquitectura Hexagonal + Next.js 16</span>.
                </p>
                <p className="text-sm text-muted-foreground">
                    © 2026 Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}