import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import SimpleChart from '../components/charts/SimpleChart'
import { useApi } from '../hooks/useApi'
import { productsService } from '../services/productsService'
import { usersService } from '../services/usersService'
import { Users, Package, TrendingUp, DollarSign, Calendar, ShoppingCart, BarChart3, Clock } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

const StatCard = ({ title, value, icon: Icon, change, color, loading }) => (
    <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                    ) : (
                        <>
                            <p className="text-xl sm:text-2xl font-bold mt-2 truncate">{value}</p>
                            {change !== undefined && (
                                <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
                                </p>
                            )}
                        </>
                    )}
                </div>
                <div className={`ml-4 p-3 rounded-full ${color} bg-opacity-10 flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </CardContent>
    </Card>
)

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        revenue: 0,
        growth: 0,
        orders: 0,
        conversion: 0,
    })

    const usersApi = useApi(usersService.getUsers)
    const productsApi = useApi(productsService.getProducts)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, products] = await Promise.all([
                    usersApi.execute(),
                    productsApi.execute(),
                ])

                const totalRevenue = products.reduce((sum, product) => sum + product.price, 0)

                setStats({
                    totalUsers: users.length,
                    totalProducts: products.length,
                    revenue: totalRevenue,
                    growth: 12.5,
                    orders: 145,
                    conversion: 3.2,
                })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
    }, [])

    const chartData = [
        { label: 'Jan', value: 65 },
        { label: 'Fév', value: 78 },
        { label: 'Mar', value: 90 },
        { label: 'Avr', value: 85 },
        { label: 'Mai', value: 110 },
        { label: 'Jun', value: 120 },
    ]

    const recentActivities = [
        { user: 'John Doe', action: 'a ajouté un nouveau produit', time: '2 min', icon: Package },
        { user: 'Jane Smith', action: 'a mis à jour le profil', time: '15 min', icon: Users },
        { user: 'Robert Johnson', action: 'a créé une commande', time: '1h', icon: ShoppingCart },
        { user: 'Sarah Williams', action: 'a généré un rapport', time: '2h', icon: BarChart3 },
        { user: 'Michael Brown', action: 'planifié une réunion', time: '3h', icon: Calendar },
    ]

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Bienvenue sur votre tableau de bord</p>
            </div>

            {/* Grille de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    title="Utilisateurs"
                    value={stats.totalUsers}
                    icon={Users}
                    change={5.2}
                    color="text-blue-500"
                    loading={usersApi.loading}
                />
                <StatCard
                    title="Produits"
                    value={stats.totalProducts}
                    icon={Package}
                    change={12.5}
                    color="text-green-500"
                    loading={productsApi.loading}
                />
                <StatCard
                    title="Revenu"
                    value={formatCurrency(stats.revenue)}
                    icon={DollarSign}
                    change={8.3}
                    color="text-purple-500"
                />
                <StatCard
                    title="Croissance"
                    value={`${stats.growth}%`}
                    icon={TrendingUp}
                    change={stats.growth}
                    color="text-orange-500"
                />
            </div>

            {/* Graphiques et activités */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Graphique */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Vue d'ensemble des ventes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 sm:h-72">
                            <SimpleChart data={chartData} type="bar" />
                        </div>
                    </CardContent>
                </Card>

                {/* Activités récentes */}
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Activité récente</CardTitle>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                                            <activity.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {activity.user}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {activity.action}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 ml-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cartes supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Taux de conversion</span>
                                    <span className="font-medium">{stats.conversion}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${stats.conversion}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Commandes ce mois</span>
                                    <span className="font-medium">{stats.orders}</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${Math.min((stats.orders / 200) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24h</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Visiteurs</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">98%</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.3s</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Temps de chargement</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nouveaux clients</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;