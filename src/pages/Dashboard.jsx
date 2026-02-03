import { useEffect, useState, useMemo, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import SimpleChart from '../components/charts/SimpleChart'
import { useApi } from '../hooks/useApi'
import { productsService } from '../services/productsService'
import { usersService } from '../services/usersService'
import SkeletonLoader from '../components/common/SkeletonLoader'
import {
    Users, Package, TrendingUp, DollarSign, Calendar,
    ShoppingCart, BarChart3, Clock, Download,
    TrendingDown, Zap, ThumbsUp,
    Smartphone, Monitor, Tablet, Globe, Menu, X
} from 'lucide-react'
import {
    formatCurrency,
    generateRandomData,
    generateSalesData,
    generateUserGrowthData,
    generatePerformanceData,
    generateBusinessMetrics,
    formatNumber,
} from '../utils/helpers'

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, change, color, loading, subtitle, trend = 'up' }) => (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
                    {loading ? (
                        <div className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1 sm:mt-2" />
                    ) : (
                        <>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 truncate">{value}</p>
                            {subtitle && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{subtitle}</p>
                            )}
                            {change !== undefined && (
                                <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${trend === 'up'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {trend === 'up' ? '↗' : '↘'} {Math.abs(change)}%
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden xs:inline">
                                        vs mois dernier
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className={`ml-2 p-2 sm:p-3 rounded-lg sm:rounded-xl ${color} bg-opacity-10 group-hover:scale-110 hover:transition-transform hover:duration-300 shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                </div>
            </div>
        </CardContent>
    </Card>
)

// eslint-disable-next-line no-unused-vars
const MetricBadge = ({ value, label, icon: Icon, variant = 'default' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    }

    return (
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className={`p-1.5 sm:p-2 rounded-lg ${variants[variant]}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{value}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{label}</p>
            </div>
        </div>
    )
}

const DeviceIcon = ({ type }) => {
    const icons = {
        mobile: Smartphone,
        desktop: Monitor,
        tablet: Tablet,
        other: Globe
    }

    const Icon = icons[type] || Globe
    const colors = {
        mobile: 'text-blue-500',
        desktop: 'text-purple-500',
        tablet: 'text-green-500',
        other: 'text-gray-500'
    }

    return (
        <div className={`p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${colors[type]}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
    )
}

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        revenue: 0,
        growth: 12.5,
        orders: 1452,
        conversion: 3.2,
        avgOrderValue: 124.50,
        customerSatisfaction: 4.8,
        monthlyVisitors: 12500,
        bounceRate: 32.5,
        avgSessionDuration: '3m 42s',
        newCustomers: 245
    })

    const [timeRange, setTimeRange] = useState('30d')
    const [chartType, setChartType] = useState('line')
    const [activeChart, setActiveChart] = useState('sales')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const chartContainerRef = useRef(null)

    const usersApi = useApi(usersService.getUsers)
    const productsApi = useApi(productsService.getProducts)

    // Génération de données simulées
    const salesData = useMemo(() => {
        const period = timeRange === '7d' ? 'daily' : timeRange === '30d' ? 'daily' : timeRange === '90d' ? 'weekly' : 'monthly'
        return generateSalesData(period)
    }, [timeRange])

    const revenueData = useMemo(() => {
        const count = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 12 : 12
        const labels = timeRange === '7d' ? 'days' : timeRange === '30d' ? 'days' : timeRange === '90d' ? 'weeks' : 'months'

        return generateRandomData(count, {
            min: 10000,
            max: 80000,
            trend: 'up',
            labels: labels,
            variance: 0.2
        })
    }, [timeRange])

    const userGrowthData = useMemo(() => generateUserGrowthData(), [])
    const performanceData = useMemo(() => generatePerformanceData(), [])

    const trafficData = useMemo(() => {
        const devices = [
            { label: 'Mobile', value: 65, type: 'mobile' },
            { label: 'Desktop', value: 25, type: 'desktop' },
            { label: 'Tablette', value: 8, type: 'tablet' },
            { label: 'Autres', value: 2, type: 'other' }
        ]
        return devices
    }, [])

    const salesMetrics = useMemo(() => generateBusinessMetrics('sales'), [])
    const userMetrics = useMemo(() => generateBusinessMetrics('users'), [])
    const conversionMetrics = useMemo(() => generateBusinessMetrics('conversion'), [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, products] = await Promise.all([
                    usersApi.execute(),
                    productsApi.execute(),
                ])

                const totalRevenue = products.reduce((sum, product) => sum + product.price, 0) * 25

                const monthlyVisitors = 12500 + Math.floor(Math.random() * 5000)
                const bounceRate = 30 + Math.random() * 10
                const avgSessionMinutes = 3 + Math.random() * 2
                const avgSessionSeconds = Math.floor(Math.random() * 60)
                const newCustomers = 200 + Math.floor(Math.random() * 100)

                setStats({
                    totalUsers: users.length,
                    totalProducts: products.length,
                    revenue: totalRevenue,
                    growth: 12.5 + (Math.random() * 5),
                    orders: 1452 + Math.floor(Math.random() * 500),
                    conversion: 3.2 + (Math.random() * 1.5),
                    avgOrderValue: 124.50 + (Math.random() * 50),
                    customerSatisfaction: 4.2 + (Math.random() * 0.8),
                    monthlyVisitors,
                    bounceRate: parseFloat(bounceRate.toFixed(1)),
                    avgSessionDuration: `${Math.floor(avgSessionMinutes)}m ${avgSessionSeconds}s`,
                    newCustomers
                })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const recentActivities = [
        { user: 'John Doe', action: 'a ajouté un produit', time: '2 min', icon: Package, amount: '€125,99' },
        { user: 'Jane Smith', action: 'profil mis à jour', time: '15 min', icon: Users, amount: null },
        { user: 'Robert Johnson', action: 'commande créée', time: '1h', icon: ShoppingCart, amount: '€89,50' },
        { user: 'Sarah Williams', action: 'rapport généré', time: '2h', icon: BarChart3, amount: null },
        { user: 'Michael Brown', action: 'réunion planifiée', time: '3h', icon: Calendar, amount: null },
        { user: 'Emily Davis', action: 'remboursement traité', time: '4h', icon: DollarSign, amount: '€45,00' },
    ]

    const topProducts = [
        { name: 'iPhone 15 Pro', sales: 245, revenue: '€58 800', growth: 24, category: 'Électronique' },
        { name: 'MacBook Air M2', sales: 189, revenue: '€23 625', growth: 18, category: 'Informatique' },
        { name: 'AirPods Pro', sales: 312, revenue: '€18 720', growth: 32, category: 'Audio' },
        { name: 'iPad Pro', sales: 156, revenue: '€31 200', growth: 12, category: 'Tablette' },
        { name: 'Apple Watch', sales: 278, revenue: '€13 900', growth: 21, category: 'Wearable' },
    ]

    const paymentMethods = [
        { method: 'Carte de crédit', percentage: 65, color: 'bg-blue-500' },
        { method: 'PayPal', percentage: 22, color: 'bg-blue-400' },
        { method: 'Virement bancaire', percentage: 8, color: 'bg-green-500' },
        { method: 'Apple Pay', percentage: 5, color: 'bg-black' },
    ]

    // Fonction pour ajuster la hauteur du graphique
    useEffect(() => {
        const updateChartHeight = () => {
            if (chartContainerRef.current) {
                const width = chartContainerRef.current.offsetWidth
                const height = Math.max(250, Math.min(width * 0.6, 400))
                chartContainerRef.current.style.height = `${height}px`
            }
        }

        updateChartHeight()
        window.addEventListener('resize', updateChartHeight)
        return () => window.removeEventListener('resize', updateChartHeight)
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <SkeletonLoader type="text" className="h-8 w-48 mb-2" />
                    <SkeletonLoader type="text" className="h-4 w-64" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <SkeletonLoader type="text" className="h-4 w-24 mb-2" />
                                        <SkeletonLoader type="text" className="h-8 w-16" />
                                        <SkeletonLoader type="text" className="h-3 w-20 mt-1" />
                                    </div>
                                    <SkeletonLoader type="avatar" className="w-12 h-12 rounded-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <SkeletonLoader type="text" className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <SkeletonLoader type="card" className="h-48" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <SkeletonLoader type="text" className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3">
                                    <div>
                                        <SkeletonLoader type="text" className="h-4 w-32 mb-1" />
                                        <SkeletonLoader type="text" className="h-3 w-24" />
                                    </div>
                                    <SkeletonLoader type="text" className="h-3 w-16" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
            {/* Header avec menu mobile */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="flex-1 ml-4 lg:ml-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Tableau de bord
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Aperçu global • Mis à jour à l'instant
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {['7d', '30d', '90d', '1a'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors ${timeRange === range
                                    ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400 font-medium'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Exporter"
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Menu mobile */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['7d', '30d', '90d', '1a'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-sm rounded transition-colors ${timeRange === range
                                    ? 'bg-primary-600 text-white font-medium'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
                        <Download className="w-4 h-4" />
                        Exporter les données
                    </button>
                </div>
            )}

            {/* Grille de statistiques principales - Responsive */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    title="Utilisateurs totaux"
                    value={formatNumber(stats.totalUsers)}
                    subtitle={`+${stats.newCustomers} nouveaux`}
                    icon={Users}
                    change={8.2}
                    trend="up"
                    color="text-blue-500"
                    loading={usersApi.loading}
                />
                <StatCard
                    title="Revenu total"
                    value={formatCurrency(stats.revenue)}
                    subtitle={`Objectif: ${formatCurrency(stats.revenue * 1.2)}`}
                    icon={DollarSign}
                    change={salesMetrics.growth}
                    trend={salesMetrics.isPositive ? "up" : "down"}
                    color="text-green-500"
                />
                <StatCard
                    title="Commandes"
                    value={formatNumber(stats.orders)}
                    subtitle="En attente: 12"
                    icon={ShoppingCart}
                    change={-3.2}
                    trend="down"
                    color="text-purple-500"
                />
                <StatCard
                    title="Taux de conversion"
                    value={`${stats.conversion.toFixed(1)}%`}
                    subtitle={`+${(stats.conversion - 3.0).toFixed(1)}% vs hier`}
                    icon={TrendingUp}
                    change={conversionMetrics.growth}
                    trend={conversionMetrics.isPositive ? "up" : "down"}
                    color="text-orange-500"
                />
            </div>

            {/* Contrôles graphiques */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="w-full sm:w-auto overflow-x-auto">
                    <div className="flex gap-1 sm:gap-2 pb-2">
                        {['sales', 'revenue', 'users', 'performance'].map((chart) => (
                            <button
                                key={chart}
                                onClick={() => setActiveChart(chart)}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeChart === chart
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {chart === 'sales' && 'Ventes'}
                                {chart === 'revenue' && 'Revenus'}
                                {chart === 'users' && 'Utilisateurs'}
                                {chart === 'performance' && 'Performance'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-1 text-sm rounded ${chartType === 'line' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                    >
                        Ligne
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                    >
                        Barres
                    </button>
                    <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-1 text-sm rounded ${chartType === 'area' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                    >
                        Zone
                    </button>
                </div>
            </div>

            {/* Graphiques principaux avec conteneur responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Graphique principal */}
                <Card className="h-full">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                                <CardTitle className="text-lg sm:text-xl">
                                    {activeChart === 'sales' && 'Vue d\'ensemble des ventes'}
                                    {activeChart === 'revenue' && 'Revenus générés'}
                                    {activeChart === 'users' && 'Croissance des utilisateurs'}
                                    {activeChart === 'performance' && 'Performance par canal'}
                                </CardTitle>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                    {activeChart === 'sales' && 'Performances sur les derniers mois'}
                                    {activeChart === 'revenue' && 'Évolution des revenus'}
                                    {activeChart === 'users' && 'Tendance d\'acquisition'}
                                    {activeChart === 'performance' && 'Distribution par canal de vente'}
                                </p>
                            </div>
                            <div className="text-sm font-medium text-green-600 dark:text-green-400 shrink-0">
                                {activeChart === 'sales' && `+${salesMetrics.growth}%`}
                                {activeChart === 'revenue' && `+${salesMetrics.growth}%`}
                                {activeChart === 'users' && `+${userMetrics.growth}%`}
                                {activeChart === 'performance' && `Objectif: ${conversionMetrics.target}%`}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div
                            ref={chartContainerRef}
                            className="w-full min-h-62.5 max-h-100 overflow-hidden"
                        >
                            <SimpleChart
                                data={
                                    activeChart === 'sales' ? salesData :
                                        activeChart === 'revenue' ? revenueData :
                                            activeChart === 'users' ? userGrowthData :
                                                performanceData
                                }
                                type={chartType}
                                title=""
                                responsive={true}
                                maintainAspectRatio={false}
                                color={
                                    activeChart === 'sales' ? 'primary' :
                                        activeChart === 'revenue' ? 'success' :
                                            activeChart === 'users' ? 'warning' :
                                                'danger'
                                }
                                animation={true}
                                showTooltip={true}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution du trafic */}
                <Card className="h-full">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <CardTitle className="text-lg sm:text-xl">Distribution du trafic</CardTitle>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Répartition par type d'appareil
                                </p>
                            </div>
                            <Globe className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-4 sm:space-y-6">
                            {trafficData.map((device, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <DeviceIcon type={device.type} />
                                            <span className="font-medium text-sm sm:text-base truncate">
                                                {device.label}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <span className="font-bold text-sm sm:text-base">{device.value}%</span>
                                            <span className="text-xs text-gray-500 ml-1 sm:ml-2 hidden xs:inline">
                                                {device.value > 60 ? '↗ Dominant' : device.value > 30 ? '→ Stable' : '↘ Secondaire'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${device.type === 'mobile' ? 'bg-blue-500' :
                                                device.type === 'desktop' ? 'bg-purple-500' :
                                                    device.type === 'tablet' ? 'bg-green-500' :
                                                        'bg-gray-500'
                                                }`}
                                            style={{ width: `${device.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Métriques de trafic */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatNumber(stats.monthlyVisitors)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Visites/mois</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.bounceRate}%
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rebond</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.avgSessionDuration}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Durée</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatNumber(stats.newCustomers)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Nouveaux</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Deuxième ligne - Tableau et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Top produits */}
                <Card className="lg:col-span-2">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl">Top produits</CardTitle>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Meilleurs vendeurs du mois
                        </p>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                            {topProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center shrink-0">
                                            <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {product.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                        <div className="text-right">
                                            <p className="font-bold text-sm sm:text-base">{product.revenue}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} ventes</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${product.growth > 20
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            ↗ {product.growth}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Métriques de performance */}
                <div className="space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">Performance clés</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Conversion</span>
                                        <span className="font-bold">{stats.conversion.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full"
                                            style={{ width: `${Math.min(stats.conversion * 10, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
                                        <span className="font-bold">{stats.customerSatisfaction.toFixed(1)}/5</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-orange-400 to-orange-600 rounded-full"
                                            style={{ width: `${stats.customerSatisfaction * 20}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Panier moyen</span>
                                        <span className="font-bold">{formatCurrency(stats.avgOrderValue)}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-purple-400 to-purple-600 rounded-full"
                                            style={{ width: `${Math.min((stats.avgOrderValue / 200) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Méthodes de paiement */}
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">Méthodes de paiement</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-2 sm:space-y-3">
                                {paymentMethods.map((method, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${method.color}`} />
                                            <span className="text-sm truncate">{method.method}</span>
                                        </div>
                                        <span className="font-medium text-sm sm:text-base">{method.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Activités récentes */}
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">Activité récente</CardTitle>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Dernières actions sur la plateforme
                            </p>
                        </div>
                        <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                        {recentActivities.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors"
                            >
                                <div className="shrink-0 mr-3 sm:mr-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center">
                                        <activity.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        <span className="font-normal text-gray-600 dark:text-gray-400">
                                            {activity.user}
                                        </span> {activity.action}
                                    </p>
                                    {activity.amount && (
                                        <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                                            {activity.amount}
                                        </p>
                                    )}
                                </div>
                                <div className="shrink-0 ml-2 sm:ml-4">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Métriques additionnelles */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <MetricBadge
                    value={`${stats.bounceRate}%`}
                    label="Taux de rebond"
                    icon={TrendingDown}
                    variant={stats.bounceRate < 35 ? "success" : "warning"}
                />
                <MetricBadge
                    value={stats.avgSessionDuration}
                    label="Session moyenne"
                    icon={Clock}
                    variant="primary"
                />
                <MetricBadge
                    value="98.2%"
                    label="Disponibilité"
                    icon={Zap}
                    variant="success"
                />
                <MetricBadge
                    value="4.8/5"
                    label="Satisfaction"
                    icon={ThumbsUp}
                    variant="warning"
                />
            </div>
        </div>
    )
}

export default Dashboard