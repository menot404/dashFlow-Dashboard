/**
 * Formate une date en chaîne lisible (fr-FR)
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formate un montant en euros (fr-FR)
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté en euros
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

/**
 * Crée une fonction debounced (retarde l'exécution)
 * @param {function} func - Fonction à exécuter
 * @param {number} wait - Délai en ms
 * @returns {function} Fonction debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ...existing code...

/**
 * Génère des données aléatoires pour les graphiques (trend, labels, variance)
 * @param {number} count - Nombre de points de données
 * @param {Object} options - Options de configuration
 * @returns {Array} Données formatées pour les graphiques
 */
export const generateRandomData = (count, options = {}) => {
  const {
    min = 100,
    max = 1000,
    trend = "up", // 'up', 'down', 'stable', 'sinusoidal'
    labels = "auto",
    variance = 0.3,
  } = options;

  const data = [];
  let currentValue = min + (max - min) / 2;

  // Générer des labels si non fournis
  /**
   * Génère les labels pour les points de données
   * @returns {Array} Labels
   */
  const generateLabels = () => {
    if (Array.isArray(labels)) return labels.slice(0, count);

    if (labels === "months") {
      return [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ].slice(0, count);
    }

    if (labels === "days") {
      return Array.from({ length: count }, (_, i) => `J${i + 1}`);
    }

    if (labels === "weeks") {
      return Array.from({ length: count }, (_, i) => `S${i + 1}`);
    }

    // Par défaut, des lettres
    return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i));
  };

  const labelArray = generateLabels();

  for (let i = 0; i < count; i++) {
    let value;

    switch (trend) {
      case "up":
        value = currentValue + (max - min) * (i / count) * 0.5;
        break;
      case "down":
        value = currentValue - (max - min) * (i / count) * 0.5;
        break;
      case "sinusoidal": {
        // Note: Utilisation d'un bloc {} pour cette case
        const phase = (i / count) * Math.PI * 2;
        value = currentValue + Math.sin(phase) * (max - min) * 0.3;
        break;
      }
      default: // stable
        value = currentValue;
    }

    // Ajouter de la variance aléatoire
    const randomFactor = 1 + (Math.random() - 0.5) * variance * 2;
    value *= randomFactor;

    // S'assurer que la valeur reste dans les limites
    value = Math.max(min, Math.min(max, value));

    data.push({
      label: labelArray[i],
      value: Math.round(value),
    });

    currentValue = value;
  }

  return data;
};
/**
 * Génère des données de vente réalistes pour un dashboard
 * @param {string} period - 'daily', 'weekly', 'monthly'
 * @returns {Array} Données de vente formatées
 */
/**
 * Génère des données de vente réalistes pour un dashboard
 * @param {string} period - 'daily', 'weekly', 'monthly'
 * @returns {Array} Données de vente formatées
 */
export const generateSalesData = (period = "monthly") => {
  const periods = {
    daily: 30,
    weekly: 12,
    monthly: 12,
  };

  const count = periods[period] || 12;
  const baseValues = {
    daily: { min: 500, max: 5000 },
    weekly: { min: 3000, max: 20000 },
    monthly: { min: 10000, max: 80000 },
  };

  const { min, max } = baseValues[period] || baseValues.monthly;

  return generateRandomData(count, {
    min,
    max,
    trend: "up",
    labels:
      period === "monthly" ? "months" : period === "weekly" ? "weeks" : "days",
    variance: period === "daily" ? 0.4 : 0.2,
  });
};

/**
 * Génère des données d'utilisateurs réalistes
 * @returns {Array} Données d'utilisateurs
 */
/**
 * Génère des données d'évolution du nombre d'utilisateurs
 * @returns {Array} Données d'utilisateurs
 */
export const generateUserGrowthData = () => {
  const count = 12;
  const data = [];
  let totalUsers = 1000;

  for (let i = 0; i < count; i++) {
    const growthRate = 0.05 + Math.random() * 0.1; // 5-15% de croissance mensuelle
    totalUsers += Math.round(totalUsers * growthRate);

    data.push({
      label: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ][i],
      value: totalUsers,
    });
  }

  return data;
};

/**
 * Génère des données de performance par catégorie
 * @returns {Array} Données de performance
 */
/**
 * Génère des données de performance par catégorie
 * @returns {Array} Données de performance
 */
export const generatePerformanceData = () => {
  const categories = [
    "Mobile",
    "Desktop",
    "Tablette",
    "API",
    "Direct",
    "Réseaux sociaux",
  ];

  return categories.map((category) => ({
    label: category,
    value: Math.floor(Math.random() * 4000) + 1000,
    color: getRandomColor(),
  }));
};

/**
 * Génère une couleur aléatoire (format hexadécimal)
 * @returns {string} Couleur hexadécimale
 */
/**
 * Génère une couleur aléatoire (hexadécimal)
 * @returns {string} Couleur hexadécimale
 */
export const getRandomColor = () => {
  const colors = [
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
    "#6366F1", // indigo-500
    "#84CC16", // lime-500
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Calcule les statistiques à partir d'un tableau de données
 * @param {Array} data - Tableau de données { value }
 * @returns {Object} Statistiques calculées
 */
/**
 * Calcule les statistiques à partir d'un tableau de données
 * @param {Array} data - Tableau de données { value }
 * @returns {Object} Statistiques calculées
 */
export const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return {
      total: 0,
      average: 0,
      min: 0,
      max: 0,
      trend: 0,
    };
  }

  const values = data.map((item) => item.value);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calcul de la tendance (comparaison premier vs dernier trimestre)
  const firstQuarter = values.slice(0, Math.floor(values.length / 4));
  const lastQuarter = values.slice(-Math.floor(values.length / 4));
  const firstAvg =
    firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
  const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
  const trend = ((lastAvg - firstAvg) / firstAvg) * 100;

  return {
    total,
    average: Math.round(average),
    min,
    max,
    trend: Math.round(trend * 100) / 100,
  };
};

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @param {number} decimals - Nombre de décimales
 * @returns {string} Nombre formaté
 */
/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @param {number} decimals - Nombre de décimales
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num, decimals = 0) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Génère un pourcentage de progression réaliste
 * @param {number} baseValue - Valeur de base
 * @param {number} variance - Variance (0-1)
 * @returns {number} Pourcentage de progression
 */
/**
 * Génère un pourcentage de progression réaliste
 * @param {number} baseValue - Valeur de base
 * @param {number} variance - Variance (0-1)
 * @returns {number} Pourcentage de progression
 */
export const generateGrowthPercentage = (baseValue, variance = 0.3) => {
  const trend = Math.random() > 0.3 ? 1 : -1; // 70% de chances d'être positif
  const growth = baseValue * (1 + Math.random() * variance * trend);
  return Math.round(growth * 100) / 100;
};

/**
 * Simule des données de performance métier
 * @param {string} metricType - Type de métrique
 * @returns {Object} Métriques de performance
 */
/**
 * Simule des métriques métier (ventes, utilisateurs, conversion, revenu)
 * @param {string} metricType - Type de métrique
 * @returns {Object} Métriques de performance
 */
export const generateBusinessMetrics = (metricType = "sales") => {
  const metrics = {
    sales: {
      current: Math.floor(Math.random() * 50000) + 10000,
      previous: Math.floor(Math.random() * 45000) + 8000,
      target: 60000,
    },
    users: {
      current: Math.floor(Math.random() * 5000) + 1000,
      previous: Math.floor(Math.random() * 4500) + 800,
      target: 6000,
    },
    conversion: {
      current: Math.random() * 5 + 1, // 1-6%
      previous: Math.random() * 4.5 + 1,
      target: 7,
    },
    revenue: {
      current: Math.floor(Math.random() * 200000) + 50000,
      previous: Math.floor(Math.random() * 180000) + 40000,
      target: 250000,
    },
  };

  const metric = metrics[metricType] || metrics.sales;
  const growth = ((metric.current - metric.previous) / metric.previous) * 100;
  const progress = (metric.current / metric.target) * 100;

  return {
    ...metric,
    growth: Math.round(growth * 10) / 10,
    progress: Math.min(100, Math.round(progress * 10) / 10),
    isPositive: growth >= 0,
  };
};

/**
 * Génère des données pour un graphique circulaire (pie/donut)
 * @param {number} segments - Nombre de segments
 * @returns {Array} Données pour graphique circulaire
 */
/**
 * Génère des données pour un graphique circulaire (pie/donut)
 * @param {number} segments - Nombre de segments
 * @returns {Array} Données pour graphique circulaire
 */
export const generatePieData = (segments = 5) => {
  const categories = [
    "Électronique",
    "Vêtements",
    "Alimentation",
    "Maison",
    "Sport",
    "Loisirs",
    "Automobile",
    "Santé",
  ].slice(0, segments);

  return categories.map((category) => ({
    label: category,
    value: Math.floor(Math.random() * 1000) + 100,
    color: getRandomColor(),
    percentage: 0, // Serra calculé plus tard
  }));
};

/**
 * Simule des données temporelles avec saisonnalité
 * @param {number} points - Nombre de points
 * @param {string} frequency - 'daily', 'hourly', 'weekly'
 * @returns {Array} Séries temporelles
 */
/**
 * Simule des séries temporelles avec saisonnalité
 * @param {number} points - Nombre de points
 * @param {string} frequency - 'daily', 'hourly', 'weekly'
 * @returns {Array} Séries temporelles
 */
export const generateTimeSeries = (points = 24, frequency = "daily") => {
  const data = [];
  const now = new Date();

  let baseValue = 100;
  const amplitude = 50; // Amplitude des variations
  const seasonality =
    frequency === "hourly" ? 24 : frequency === "weekly" ? 7 : 30;

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);

    if (frequency === "hourly") {
      date.setHours(date.getHours() - i);
    } else if (frequency === "daily") {
      date.setDate(date.getDate() - i);
    } else {
      date.setDate(date.getDate() - i * 7);
    }

    // Ajouter de la saisonnalité
    const seasonalFactor = Math.sin(
      (i % seasonality) * ((2 * Math.PI) / seasonality),
    );

    // Tendance à long terme
    const trendFactor = i * 0.5;

    // Bruit aléatoire
    const noise = (Math.random() - 0.5) * 20;

    const value = baseValue + seasonalFactor * amplitude + trendFactor + noise;

    data.push({
      timestamp: date,
      label: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        ...(frequency !== "hourly" ? { weekday: "short" } : {}),
      }),
      value: Math.max(0, Math.round(value)),
    });
  }

  return data;
};

/**
 * Formatte une durée en texte lisible
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
/**
 * Formatte une durée en texte lisible (ex: 1h30)
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${remainingMinutes}`;
};

/**
 * Calcule la différence en pourcentage entre deux valeurs
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {number} Différence en pourcentage
 */
/**
 * Calcule la différence en pourcentage entre deux valeurs
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {number} Différence en pourcentage
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
