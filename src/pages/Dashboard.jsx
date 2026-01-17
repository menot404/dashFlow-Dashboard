import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import SimpleChart from '../components/charts/SimpleChart'
import { useApi } from '../hooks/useApi'
import { productsService } from '../services/productsService'
import { usersService } from '../services/usersService'
import { Users, Package, TrendingUp, DollarSign } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

const StatCard = ({ title, value, icon: Icon, change, color }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </CardContent>
    </Card>
)

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        revenue: 0,
        growth: 0,
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
                    growth: 12.5, // Fake growth percentage
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Bienvenue sur votre tableau de bord</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Utilisateurs"
                    value={stats.totalUsers}
                    icon={Users}
                    change={5.2}
                    color="text-blue-500"
                />
                <StatCard
                    title="Produits"
                    value={stats.totalProducts}
                    icon={Package}
                    change={12.5}
                    color="text-green-500"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Vue d'ensemble des ventes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleChart
                            data={chartData}
                            type="bar"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { user: 'John Doe', action: 'a ajouté un nouveau produit', time: '2 min ago' },
                                { user: 'Jane Smith', action: 'a mis à jour le profil', time: '15 min ago' },
                                { user: 'Robert Johnson', action: 'a supprimé un utilisateur', time: '1h ago' },
                                { user: 'Sarah Williams', action: 'a créé une commande', time: '2h ago' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="font-medium">{activity.user}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard;