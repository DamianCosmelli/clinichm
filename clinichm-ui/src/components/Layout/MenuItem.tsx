import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface MenuItemProps {
    menuName: ReactNode; // Cambiado de string a ReactNode
    route: string;
    hide?: boolean; // Añadido para manejar la visibilidad del menú
}

export function MenuItem({ menuName, route , hide = false}: MenuItemProps) {
    return (
        <Link 
            to={`/${route.toLowerCase()}`} 
            className={`text-principal text-sm hover:bg-[var(--color-burbela-items)] hover:border hover:border-[var(--color-burbela-items)] hover:rounded-md p-1 m-4 flex items-center
            ${
                hide ? 'hidden' : ''
            }`}
        >
            {menuName}
        </Link>
    );
}