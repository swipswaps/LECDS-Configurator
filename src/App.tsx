import React, { useState, useEffect, useCallback } from 'react';
import MaterialSelector from './components/MaterialSelector';
import TemperatureProfile from './components/TemperatureProfile';
import YieldChart from './components/YieldChart';
import PVGainGauge from './components/PVGainGauge';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Activity, Droplets, Zap, Thermometer, Info, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

interface Params {
  hydrogelType: string;
  fabricPermeability: number;
  foilEmissivity: number;
  pcmLoading: number;
  saltPercent: number;
  vacuumKPa: number;
  aerogelThicknessMm: number;
}

interface Results {
  deltaT: number;
  distillateYield: number;
  efficiencyGain: number;
  pvhiMitigation: number;
  tempProfile: { pos: number; temp: number }[];
}

export default function App() {
  const [params, setParams] = useState<Params>({
    hydrogelType: 'PNIPAM_PAM',
    fabricPermeability: 1e-9,
    foilEmissivity: 0.95,
    pcmLoading: 15,
    saltPercent: 5,
    vacuumKPa: 40,
    aerogelThicknessMm: 2
  });

  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCFD = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      console.error('Simulation failed:', err.message);
      setError('Simulation failed — Using cached preview');
      // Fallback to mock results if API fails (e.g. during dev)
      setResults({
        deltaT: 18,
        distillateYield: 2.1,
        efficiencyGain: 12.5,
        pvhiMitigation: 2.2,
        tempProfile: Array.from({ length: 21 }, (_, i) => ({ pos: i, temp: 75 - i * 1.2 }))
      });
    }
    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchCFD();
  }, [fetchCFD]);

  const updateParam = (key: keyof Params, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: string) => {
    if (preset === 'bestCooling') {
      setParams({ ...params, vacuumKPa: 20, pcmLoading: 25, aerogelThicknessMm: 5, hydrogelType: 'PNIPAM_PAM' });
    } else if (preset === 'maxDistillate') {
      setParams({ ...params, vacuumKPa: 30, saltPercent: 10, hydrogelType: 'PNIPAM_PAM' });
    } else if (preset === 'balanced') {
      setParams({ ...params, vacuumKPa: 40, pcmLoading: 15, saltPercent: 5, aerogelThicknessMm: 2 });
    } else if (preset === 'reset') {
      setParams({
        hydrogelType: 'PNIPAM_PAM',
        fabricPermeability: 1e-9,
        foilEmissivity: 0.95,
        pcmLoading: 15,
        saltPercent: 5,
        vacuumKPa: 40,
        aerogelThicknessMm: 2
      });
    }
  };

  const getSimulationStatus = () => {
    if (!results) return null;
    if (results.deltaT < 10) return { label: 'Ineffective', color: 'text-red-500', bg: 'bg-red-50', icon: <AlertCircle className="w-4 h-4" />, message: 'Low thermal impact. Try increasing vacuum or PCM loading.' };
    if (results.deltaT < 15) return { label: 'Sub-optimal', color: 'text-amber-500', bg: 'bg-amber-50', icon: <Info className="w-4 h-4" />, message: 'Moderate performance. Adjust salt or permeability for better wicking.' };
    return { label: 'Optimal', color: 'text-green-500', bg: 'bg-green-50', icon: <Activity className="w-4 h-4" />, message: 'System is operating at peak efficiency for these materials.' };
  };

  const status = getSimulationStatus();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-bottom border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">LECDS Config</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Parallel CFD Simulation</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {status && (
            <section className={`p-4 rounded-2xl ${status.bg} border border-current/10`}>
              <div className={`flex items-center gap-2 font-bold ${status.color} mb-1`}>
                {status.icon}
                <span className="text-xs uppercase tracking-wider">{status.label} Config</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{status.message}</p>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Presets
              </h2>
              <button 
                onClick={() => applyPreset('reset')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => applyPreset('bestCooling')} 
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-semibold group"
              >
                Best Cooling <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button 
                onClick={() => applyPreset('maxDistillate')} 
                className="flex items-center justify-between p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-semibold group"
              >
                Max Distillate <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button 
                onClick={() => applyPreset('balanced')} 
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-semibold group"
              >
                Balanced <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Material Parameters
            </h2>
            <MaterialSelector params={params} onChange={updateParam} />
          </section>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Info className="w-4 h-4 text-blue-500" />
            <p>Adjusting parameters triggers a real-time 1D CFD simulation.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Live CFD Preview</h2>
              <p className="text-gray-500 text-lg">Laminated Evaporative Cooling & Distillation System</p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-200"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Simulating...
                  </motion.div>
                )}
              </AnimatePresence>
              {error && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </header>

          {results ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100"
              >
                <TemperatureProfile data={results.tempProfile} />
              </motion.div>

              {/* Metrics Grid */}
              <div className="lg:col-span-4 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100"
                >
                  <YieldChart data={results} />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100"
                >
                  <PVGainGauge data={results} />
                </motion.div>
              </div>

              {/* Summary Cards */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-2xl">
                      <Thermometer className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Thermal Impact</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Panel Cooling</p>
                      <p className="text-4xl font-bold">-{results.deltaT.toFixed(1)}°C</p>
                    </div>
                    <div className="h-px bg-white/20" />
                    <div>
                      <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">PVHI Mitigation</p>
                      <p className="text-2xl font-bold">{results.pvhiMitigation.toFixed(2)}°C Reduction</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 p-3 rounded-2xl">
                      <Droplets className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Effluent Output</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Daily Distillate</p>
                      <p className="text-4xl font-bold text-green-600">{results.distillateYield.toFixed(2)} <span className="text-xl font-medium text-gray-400">L/m²</span></p>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="flex items-center gap-2 text-gray-500">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <p className="text-sm">Driven by {results.efficiencyGain.toFixed(1)}% efficiency gain</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
              <RefreshCw className="w-12 h-12 animate-spin mb-4" />
              <p className="text-xl font-medium">Initializing CFD Solver...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
