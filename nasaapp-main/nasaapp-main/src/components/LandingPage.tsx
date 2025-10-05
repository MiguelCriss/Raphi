import { CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onViewAirQuality: () => void;
  onHowItWorks: () => void;
}

export default function LandingPage({ onViewAirQuality, onHowItWorks }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/40 via-sky-500/30 to-gray-900/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Raphi — Tu aire, claro y a tiempo 🕐💨
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 font-medium max-w-3xl mx-auto">
            Pronósticos hiperlocales de calidad del aire con datos TEMPO + estaciones + clima.
          </p>

          {/* Features List */}
          <div className="space-y-4 max-w-2xl mx-auto pt-8">
            <div className="flex items-center justify-start space-x-3 text-white">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl text-left">Pronóstico 24-72 h por barrio.</span>
            </div>
            <div className="flex items-center justify-start space-x-3 text-white">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl text-left">Alertas tempranas personalizadas 🔔.</span>
            </div>
            <div className="flex items-center justify-start space-x-3 text-white">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl text-left">Mapas interactivos por contaminante.</span>
            </div>
            <div className="flex items-center justify-start space-x-3 text-white">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl text-left">Recomendaciones de salud en tiempo real 🏃.</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={onViewAirQuality}
              className="w-full sm:w-auto px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ver ahora tu calidad del aire
            </button>
            <button
              onClick={onHowItWorks}
              className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ¿Cómo funciona Raphi?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/70 text-sm">
            Privacidad • Fuentes de datos • Créditos (NASA TEMPO/OpenAQ/NOAA)
          </p>
        </div>
      </div>
    </div>
  );
}
