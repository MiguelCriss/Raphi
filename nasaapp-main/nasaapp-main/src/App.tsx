import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ClimateView from './components/ClimateView';
import MapView from './components/MapView';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'airQuality' | 'howItWorks' | 'map'>('landing');

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && (
        <LandingPage
          onViewAirQuality={() => setCurrentView('airQuality')}
          onHowItWorks={() => setCurrentView('howItWorks')}
        />
      )}
      {currentView === 'airQuality' && (
        <ClimateView
          onBack={() => setCurrentView('landing')}
          onNavigateToMap={() => setCurrentView('map')}
        />
      )}
      {currentView === 'map' && (
        <MapView onBack={() => setCurrentView('airQuality')} />
      )}
      {currentView === 'howItWorks' && (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">¿Cómo Funciona Raphi?</h1>
            <button
              onClick={() => setCurrentView('landing')}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
