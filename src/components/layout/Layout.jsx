import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { Menu } from 'lucide-react'
import Breadcrumbs from '../common/Breadcrumbs'

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Détecter si on est sur mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Empêcher le scroll du body quand le sidebar est ouvert sur mobile
    useEffect(() => {
        if (sidebarOpen && isMobile) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [sidebarOpen, isMobile])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Overlay mobile avec blur */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar avec son propre scroll */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:z-0 md:flex md:flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                h-screen overflow-hidden
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Contenu principal avec son propre scroll */}
            <div className={`
                flex-1 flex flex-col min-w-0 h-screen overflow-hidden
                transition-all duration-300
                ${sidebarOpen && isMobile ? 'opacity-70 blur-sm' : 'opacity-100 blur-0'}
            `}>
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 main-content">
                    <Breadcrumbs />
                    <Outlet />
                </main>
            </div>

            {/* Bouton menu mobile flottant */}
            <button
                onClick={() => setSidebarOpen(true)}
                className={`
                    fixed bottom-4 right-4 z-50 md:hidden p-3 
                    bg-primary-600 text-white rounded-full shadow-lg 
                    hover:bg-primary-700 transition-all duration-300
                    flex items-center justify-center
                    ${sidebarOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}
                `}
                aria-label="Ouvrir le menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    )
}

export default Layout