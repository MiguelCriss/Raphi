import { useState, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { Cloud, Copy, Play } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  onBack: () => void;
}

interface ClickedLocation {
  lat: number;
  lng: number;
}

function MapClickHandler({ onLocationClick }: { onLocationClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export default function MapView({ onBack }: MapViewProps) {
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [selectedPollutant, setSelectedPollutant] = useState<string>('NO2');
  const [timeSlider, setTimeSlider] = useState<number>(12);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  const airQualityData = [
    { name: 'NO₂', value: '23.5 ppb', status: 'good' },
    { name: 'O₃', value: '45.2 ppb', status: 'good' },
    { name: 'HCHO', value: '1.8 ppb', status: 'good' },
    { name: 'Aerosols (AI)', value: '0.7', status: 'good' },
    { name: 'PM₂.₅', value: '12 μg/m³', status: 'good' },
    { name: 'PM₁₀', value: '25 μg/m³', status: 'good' },
  ];

  const pollutantButtons = ['NO₂', 'O₃', 'HCHO', 'Aerosols (AI)', 'PM₂.₅', 'PM₁₀'];

  const handleLocationClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    setCopiedCoords(false);
  };

  const copyCoordinates = () => {
    if (clickedLocation) {
      const coords = `${clickedLocation.lat.toFixed(6)}, ${clickedLocation.lng.toFixed(6)}`;
      navigator.clipboard.writeText(coords);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Mapa Interactivo + Datos TEMPO</h1>

        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-900 rounded-lg p-6 flex flex-col">
            <h2 className="text-white text-xl font-bold mb-6">Lectura actual</h2>

            {/* Air Quality Readings */}
            <div className="space-y-3 mb-8 flex-1">
              {airQualityData.map((item, index) => (
                <div
                  key={index}
                  className="bg-green-900/40 border border-green-600/50 rounded-lg p-4 flex items-center space-x-3"
                >
                  <Cloud className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-gray-300 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AQI Status */}
            <div className="bg-green-900/40 border border-green-600/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-bold mb-2">Calidad del aire (AQI) local</h3>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">😊</div>
                <div>
                  <p className="text-green-400 font-semibold">Moderado</p>
                  <p className="text-gray-300 text-sm">
                    Calidad del aire moderada. Considera limitar actividades al aire libre si eres sensible.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>🛰️ TEMPO</span>
              <span>📍 Estación</span>
              <span>🌡️ Modelo meteo</span>
            </div>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>

          {/* Map Container */}
          <div className="flex-1 bg-white rounded-lg overflow-hidden relative">
            {/* Search Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-96">
              <input
                type="text"
                placeholder="Buscar ubicación"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
              <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-xl">+</span>
              </button>
              <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-xl">−</span>
              </button>
              <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                🧭
              </button>
            </div>

            {/* Leaflet Map */}
            <MapContainer
              center={[19.4326, -99.1332]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler onLocationClick={handleLocationClick} />
              {clickedLocation && (
                <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={createCustomIcon()}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold mb-2">Coordenadas:</p>
                      <p className="text-sm mb-2">
                        {clickedLocation.lat.toFixed(6)}, {clickedLocation.lng.toFixed(6)}
                      </p>
                      <button
                        onClick={copyCoordinates}
                        className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCoords ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Pollutant Filter Buttons */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-[1000] flex space-x-2">
              {pollutantButtons.map((pollutant) => (
                <button
                  key={pollutant}
                  onClick={() => setSelectedPollutant(pollutant)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedPollutant === pollutant
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {pollutant}
                </button>
              ))}
            </div>

            {/* Time Slider */}
            <div className="absolute bottom-8 left-8 right-8 z-[1000] bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Hora</span>
                <span className="text-green-400 font-bold">{timeSlider}:00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={timeSlider}
                  onChange={(e) => setTimeSlider(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(timeSlider / 23) * 100}%, #374151 ${(timeSlider / 23) * 100}%, #374151 100%)`,
                  }}
                />
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Ver animación</span>
                </button>
              </div>
            </div>

            {/* Coordinates Display */}
            {clickedLocation && (
              <div className="absolute top-20 left-4 z-[1000] bg-gray-900 text-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-semibold mb-2">Ubicación seleccionada:</p>
                <p className="text-xs mb-2">
                  Lat: {clickedLocation.lat.toFixed(6)}<br />
                  Lng: {clickedLocation.lng.toFixed(6)}
                </p>
                <button
                  onClick={copyCoordinates}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 w-full justify-center"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCoords ? 'Copiado!' : 'Copiar coordenadas'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
