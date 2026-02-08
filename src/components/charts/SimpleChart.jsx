import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Info } from 'lucide-react';

const SimpleChart = ({
    data,
    title,
    type = 'bar',
    height = 300,
    showGrid = true,
    showLabels = true,
    color = 'primary',
    showTooltip = true,
    animation = true
}) => {
    // État pour l'index survolé, position et visibilité du tooltip
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    // Référence au conteneur SVG pour calculer la position du tooltip
    const containerRef = useRef(null);
    // Valeurs min/max pour l'échelle
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    // Définition des couleurs selon le type
    const colors = {
        primary: {
            bar: 'from-primary-500 to-primary-700',
            line: 'bg-primary-500',
            gradient: 'from-primary-500/20 to-primary-500/0'
        },
        success: {
            bar: 'from-green-500 to-green-700',
            line: 'bg-green-500',
            gradient: 'from-green-500/20 to-green-500/0'
        },
        warning: {
            bar: 'from-orange-500 to-orange-700',
            line: 'bg-orange-500',
            gradient: 'from-orange-500/20 to-orange-500/0'
        },
        danger: {
            bar: 'from-red-500 to-red-700',
            line: 'bg-red-500',
            gradient: 'from-red-500/20 to-red-500/0'
        }
    };

    // Gestion du survol pour afficher le tooltip
    const handleMouseMove = (e, index) => {
        if (containerRef.current && showTooltip) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setHoveredIndex(index);
            setTooltipVisible(true);
        }
    };

    // Masquer le tooltip au départ du survol
    const handleMouseLeave = () => {
        setTooltipVisible(false);
        setHoveredIndex(null);
    };

    // Animation delay effect
    const getAnimationDelay = (index) => {
        return animation ? { animationDelay: `${index * 50}ms` } : {};
    };

    return (
        <div className="relative p-4 sm:p-6" ref={containerRef}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                {title && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">30 derniers jours</p>
                    </div>
                )}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Info className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Chart Container */}
            <div
                className="relative"
                style={{ height: `${height}px` }}
                onMouseLeave={handleMouseLeave}
            >
                {/* Grid Lines */}
                {showGrid && (
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="border-t border-gray-100 dark:border-gray-700"
                                style={{
                                    top: `${(i * 25)}%`,
                                    width: '100%'
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Bars */}
                {type === 'bar' && (
                    <div className="absolute inset-0 flex items-end justify-between px-2">
                        {data.map((item, index) => {
                            const barHeight = (item.value / maxValue) * 100;
                            const isHovered = hoveredIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="relative flex flex-col items-center group"
                                    style={{ width: `${90 / data.length}%` }}
                                    onMouseMove={(e) => handleMouseMove(e, index)}
                                    onMouseEnter={() => showTooltip && setHoveredIndex(index)}
                                >
                                    {/* Bar */}
                                    <div
                                        className={`
                        w-full rounded-t-lg transition-all duration-500 
                        bg-linear-to-t ${colors[color].bar}
                        hover:shadow-lg hover:scale-105
                        ${animation ? 'animate-bar-grow' : ''}
                        ${isHovered ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
                    `}
                                        style={{
                                            height: `${barHeight}%`,
                                            ...getAnimationDelay(index)
                                        }}
                                    />

                                    {/* Label */}
                                    {showLabels && (
                                        <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {item.label}
                                        </span>
                                    )}

                                    {/* Value on hover */}
                                    {isHovered && (
                                        <div className="absolute -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                                            {item.value}
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Line Chart */}
                {type === 'line' && (
                    <div className="absolute inset-0 px-2">
                        {/* Gradient Area */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area Path */}
                            <path
                                d={`
                  M ${(100 / (data.length - 1)) * 0} ${100 - (data[0].value / maxValue) * 100}
                    ${data.slice(1).map((item, i) =>
                                    `L ${(100 / (data.length - 1)) * (i + 1)} ${100 - (item.value / maxValue) * 100}`
                                ).join(' ')}
                        L 100 100
                    L 0 100
                    Z
                `}
                                fill="url(#line-gradient)"
                                className="text-primary-500"
                            />
                        </svg>
                        {/* Line */}
                        <div className="relative h-full">
                            {data.map((item, index) => {
                                const x = (100 / (data.length - 1)) * index;
                                const y = 100 - (item.value / maxValue) * 100;
                                const nextItem = data[index + 1];

                                if (!nextItem) return null;

                                const nextX = (100 / (data.length - 1)) * (index + 1);
                                const nextY = 100 - (nextItem.value / maxValue) * 100;

                                return (
                                    <React.Fragment key={index}>
                                        {/* Connection Line */}
                                        <div
                                            className="absolute h-0.5 bg-primary-500 transform -translate-y-1/2"
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                width: `${nextX - x}%`,
                                                transform: `rotate(${Math.atan2(nextY - y, nextX - x) * (180 / Math.PI)}deg)`,
                                                transformOrigin: '0 0',
                                            }}
                                        />

                                        {/* Data Point */}
                                        <div
                                            className={`
                        absolute w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 
                        transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                        hover:scale-150 hover:shadow-lg
                        ${colors[color].line}
                        ${animation ? 'animate-pulse' : ''}
                        `}
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                ...getAnimationDelay(index)
                                            }}
                                            onMouseMove={(e) => handleMouseMove(e, index)}
                                            onMouseEnter={() => showTooltip && setHoveredIndex(index)}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Area Chart */}
                {type === 'area' && (
                    <div className="absolute inset-0">
                        <div className="relative h-full">
                            {data.map((item, index) => {
                                const heightPercentage = (item.value / maxValue) * 100;

                                return (
                                    <div
                                        key={index}
                                        className="absolute bottom-0 flex flex-col items-center"
                                        style={{
                                            left: `${(index * 100) / data.length}%`,
                                            width: `${100 / data.length}%`,
                                            height: `${heightPercentage}%`,
                                        }}
                                        onMouseMove={(e) => handleMouseMove(e, index)}
                                        onMouseEnter={() => showTooltip && setHoveredIndex(index)}
                                    >
                                        <div
                                            className={`
                        w-full rounded-t-lg bg-linear-to-t ${colors[color].bar}
                        transition-all duration-500
                        ${animation ? 'animate-bar-grow' : ''}
                        `}
                                            style={getAnimationDelay(index)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Y-axis Labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="text-right">
                            {Math.round(maxValue - (i * (maxValue - minValue) / 4))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltipVisible && hoveredIndex !== null && (
                <div
                    className="absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl"
                    style={{
                        left: `${tooltipPosition.x + 10}px`,
                        top: `${tooltipPosition.y - 40}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="text-sm font-medium">
                        {data[hoveredIndex].label}
                    </div>
                    <div className="text-xs opacity-80">
                        Valeur: <span className="font-bold">{data[hoveredIndex].value}</span>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center mt-6 space-x-4">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${type === 'line' ? 'bg-primary-500' : `bg-linear-to-t ${colors[color].bar}`}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {type === 'bar' ? 'Ventes' : type === 'line' ? 'Tendance' : 'Performance'}
                    </span>
                </div>
                <div className="text-sm text-gray-400">
                    Max: {maxValue} • Min: {minValue} • Moy: {Math.round(data.reduce((a, b) => a + b.value, 0) / data.length)}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes barGrow {
                    from { height: 0%; opacity: 0; }
                    to { height: var(--target-height); opacity: 1; }
                }
                
                .animate-bar-grow {
                    animation: barGrow 0.6s ease-out forwards;
                    animation-delay: var(--animation-delay, 0ms);
                }
                
                .animate-line-draw {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw 1.5s ease-out forwards;
                }
                
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
        `}</style>
        </div>
    );
};

SimpleChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })
    ).isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['bar', 'line', 'area']),
    height: PropTypes.number,
    showGrid: PropTypes.bool,
    showLabels: PropTypes.bool,
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
    showTooltip: PropTypes.bool,
    animation: PropTypes.bool
};

export default SimpleChart;