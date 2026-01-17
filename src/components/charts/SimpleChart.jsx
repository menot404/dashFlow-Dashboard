
const SimpleChart = ({ data, title, type = 'bar' }) => {
    const maxValue = Math.max(...data.map(item => item.value))

    return (
        <div className="p-4">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <div className="flex items-end justify-between h-48">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div
                            className={`
                w-full rounded-t-lg transition-all duration-300
                ${type === 'bar' ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gradient-to-t from-primary-400 to-primary-600'}
              `}
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                        />
                        <span className="mt-2 text-xs text-gray-500">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SimpleChart;