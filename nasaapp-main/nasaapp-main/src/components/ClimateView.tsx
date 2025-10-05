import { Bell, User, MapPin, Thermometer, Droplets, Wind, Gauge, Sun, Cloud } from 'lucide-react';
import { useState } from 'react';

interface ClimateViewProps {
  onBack: () => void;
  onNavigateToMap: () => void;
}

interface WeatherMetric {
  value: string;
  change: string;
  changeValue: string;
  icon: React.ReactNode;
  advice: string;
}

export default function ClimateView({ onBack, onNavigateToMap }: ClimateViewProps) {
  const [selectedTab, setSelectedTab] = useState<'temperatura' | 'humedad' | 'viento'>('temperatura');

  const getTemperatureAdvice = (temp: number): string => {
    if (temp < 10) return 'Temperatura baja. Usa ropa abrigada y protege las extremidades del frío.';
    if (temp < 20) return 'Temperatura fresca. Se recomienda ropa ligera de manga larga.';
    if (temp < 25) return 'Temperatura agradable. Perfecto para actividades al aire libre.';
    if (temp < 30) return 'Temperatura cálida. Usa protector solar y mantente hidratado.';
    return 'Temperatura alta. Evita exposición prolongada al sol, usa protector solar SPF 50+ y bebe mucha agua.';
  };

  const getHumidityAdvice = (humidity: number): string => {
    if (humidity < 30) return 'Humedad baja. Hidrata tu piel y bebe suficiente agua.';
    if (humidity < 50) return 'Humedad confortable. Condiciones ideales para la mayoría de actividades.';
    if (humidity < 70) return 'Humedad moderada-alta. Puede sentirse más caluroso de lo que indica la temperatura.';
    return 'Humedad alta. Evita ejercicio intenso, la sensación térmica será mayor.';
  };

  const getWindAdvice = (wind: number): string => {
    if (wind < 10) return 'Viento suave. Condiciones tranquilas para actividades al aire libre.';
    if (wind < 20) return 'Viento moderado. Puede dificultar algunas actividades al aire libre.';
    if (wind < 30) return 'Viento fuerte. Ten precaución con objetos sueltos y paraguas.';
    return 'Viento muy fuerte. Evita actividades al aire libre y asegura objetos.';
  };

  const getPressureAdvice = (pressure: number): string => {
    if (pressure < 1000) return 'Presión baja. Posible clima inestable, prepárate para cambios.';
    if (pressure < 1015) return 'Presión normal-baja. Condiciones meteorológicas estables.';
    if (pressure < 1025) return 'Presión normal. Clima estable y agradable.';
    return 'Presión alta. Cielos despejados y clima estable esperado.';
  };

  const getSolarRadiationAdvice = (radiation: number): string => {
    if (radiation < 100) return 'Radiación baja. Puedes estar al aire libre sin mucha protección.';
    if (radiation < 200) return 'Radiación moderada. Usa protector solar si estarás expuesto más de 30 minutos.';
    if (radiation < 400) return 'Radiación alta. Usa protector solar SPF 30+, sombrero y gafas de sol.';
    return 'Radiación muy alta. Protección máxima: protector solar SPF 50+, sombrero, gafas y busca sombra.';
  };

  const getCloudAdvice = (cloudiness: number): string => {
    if (cloudiness < 20) return 'Cielo despejado. Excelente visibilidad, usa protección solar.';
    if (cloudiness < 40) return 'Parcialmente nublado. Buenas condiciones, pero sigue usando protección solar.';
    if (cloudiness < 70) return 'Mayormente nublado. Protección solar moderada aún recomendada.';
    return 'Muy nublado. Poca radiación solar directa, puede haber precipitación.';
  };

  const weatherData: WeatherMetric[] = [
    {
      value: '25°C',
      change: '+2°C (24h)',
      changeValue: 'up',
      icon: <Thermometer className="w-6 h-6 text-orange-400" />,
      advice: getTemperatureAdvice(25)
    },
    {
      value: '60%',
      change: '-5% (24h)',
      changeValue: 'down',
      icon: <Droplets className="w-6 h-6 text-blue-400" />,
      advice: getHumidityAdvice(60)
    },
    {
      value: '15 km/h',
      change: '+3 km/h (24h)',
      changeValue: 'up',
      icon: <Wind className="w-6 h-6 text-cyan-400" />,
      advice: getWindAdvice(15)
    },
    {
      value: '1012 hPa',
      change: '-2 hPa (24h)',
      changeValue: 'down',
      icon: <Gauge className="w-6 h-6 text-purple-400" />,
      advice: getPressureAdvice(1012)
    },
    {
      value: '300 W/m²',
      change: '+50 W/m² (24h)',
      changeValue: 'up',
      icon: <Sun className="w-6 h-6 text-yellow-400" />,
      advice: getSolarRadiationAdvice(300)
    },
    {
      value: '40%',
      change: '-10% (24h)',
      changeValue: 'down',
      icon: <Cloud className="w-6 h-6 text-gray-400" />,
      advice: getCloudAdvice(40)
    }
  ];

  const labels = ['Temperatura', 'Humedad', 'Viento', 'Presión', 'Radiación Solar', 'Nubosidad'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Raphi</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={onNavigateToMap} className="text-gray-300 hover:text-white transition-colors">Mapa</button>
              <button className="text-green-400 font-medium">Pronóstico</button>
              <button className="text-gray-300 hover:text-white transition-colors">Calidad del aire</button>
              <button className="text-gray-300 hover:text-white transition-colors">Alertas</button>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <User className="w-8 h-8 text-gray-300 bg-gray-700 rounded-full p-1" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white flex items-center space-x-3">
            <span>Clima en tu ubicación</span>
            <span className="text-3xl">🌹</span>
          </h2>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Seleccionar ubicación</span>
          </button>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {weatherData.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{labels[index]}</p>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                </div>
                <div className="p-2 bg-gray-800 rounded-lg">
                  {metric.icon}
                </div>
              </div>
              <p className={`text-sm mb-3 ${metric.changeValue === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {metric.changeValue === 'up' ? '↑' : '↓'} {metric.change}
              </p>
              <div className="pt-3 border-t border-gray-800">
                <p className="text-sm text-gray-300 leading-relaxed">{metric.advice}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b border-gray-800">
            <button
              onClick={() => setSelectedTab('temperatura')}
              className={`pb-3 px-1 font-medium transition-colors ${
                selectedTab === 'temperatura'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Temperatura
            </button>
            <button
              onClick={() => setSelectedTab('humedad')}
              className={`pb-3 px-1 font-medium transition-colors ${
                selectedTab === 'humedad'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Humedad
            </button>
            <button
              onClick={() => setSelectedTab('viento')}
              className={`pb-3 px-1 font-medium transition-colors ${
                selectedTab === 'viento'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Viento
            </button>
          </div>

          {/* Chart Title */}
          <h3 className="text-white text-lg font-semibold mb-6">
            {selectedTab === 'temperatura' && 'Temperatura (Últimas 24h)'}
            {selectedTab === 'humedad' && 'Humedad (Últimas 24h)'}
            {selectedTab === 'viento' && 'Viento (Últimas 24h)'}
          </h3>

          {/* Chart Placeholder */}
          <div className="relative h-64 bg-gradient-to-br from-green-900/20 to-transparent rounded-lg">
            <svg className="w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
                  <stop offset="40%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M 0 180 Q 100 120 200 100 T 400 140 T 600 80 T 800 160 T 1000 60"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* Time Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-gray-500 text-sm">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </main>
    </div>
  );
}
