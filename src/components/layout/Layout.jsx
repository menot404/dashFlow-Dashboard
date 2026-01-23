import { useState } from 'react';
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react'
import Breadcrumbs from '../common/Breadcrumbs';
const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar pour mobile (overlay) */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col w-full min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <Breadcrumbs/>
                    <Outlet />
                </main>
            </div>

            {/* Bouton menu mobile flottant */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="fixed bottom-4 right-4 z-40 md:hidden p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                aria-label="Ouvrir le menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    )
}

export default Layout;