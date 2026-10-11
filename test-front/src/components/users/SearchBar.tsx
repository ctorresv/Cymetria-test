// src/components/users/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (value: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [value, setValue] = useState("");

    // Guardamos la función más reciente en un ref para evitar problemas de closure
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchRef.current(value); // Usamos el ref, no la prop directa
        }, 300);

        return () => clearTimeout(timer);
    }, [value]); // 👈 Solo value en dependencias, no onSearch

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
        </div>
    );
}