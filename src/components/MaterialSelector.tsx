import React from 'react';

interface Params {
  hydrogelType: string;
  fabricPermeability: number;
  foilEmissivity: number;
  pcmLoading: number;
  saltPercent: number;
  vacuumKPa: number;
  aerogelThicknessMm: number;
}

interface MaterialSelectorProps {
  params: Params;
  onChange: (key: keyof Params, value: any) => void;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({ params, onChange }) => (
  <div className="space-y-8">
    {/* Each slider has a tooltip that explains the real CFD meaning without jargon */}
    <div>
      <label className="block text-sm font-medium mb-1">Hydrogel Type</label>
      <select 
        value={params.hydrogelType} 
        onChange={e => onChange('hydrogelType', e.target.value)} 
        className="w-full rounded-2xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      >
        <option value="PNIPAM_PAM">PNIPAM/PAM – highest cooling</option>
        <option value="PVA">PVA – balanced</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Fabric Permeability (higher = faster wicking)</label>
      <input 
        type="range" 
        min="1e-10" 
        max="1e-8" 
        step="1e-10" 
        value={params.fabricPermeability} 
        onChange={e => onChange('fabricPermeability', parseFloat(e.target.value))} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
      />
      <div className="text-xs text-gray-400 mt-1">{params.fabricPermeability.toExponential(2)} m²</div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Vacuum Level (lower = stronger evaporation)</label>
      <input 
        type="range" 
        min="10" 
        max="101" 
        value={params.vacuumKPa} 
        onChange={e => onChange('vacuumKPa', parseInt(e.target.value))} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
      />
      <div className="text-xs text-gray-400 mt-1">{params.vacuumKPa} kPa</div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">PCM Loading (Phase Change Material %)</label>
      <input 
        type="range" 
        min="0" 
        max="30" 
        value={params.pcmLoading} 
        onChange={e => onChange('pcmLoading', parseInt(e.target.value))} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
      />
      <div className="text-xs text-gray-400 mt-1">{params.pcmLoading} %</div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Salt Concentration (BPE Optimization)</label>
      <input 
        type="range" 
        min="0" 
        max="15" 
        value={params.saltPercent} 
        onChange={e => onChange('saltPercent', parseInt(e.target.value))} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
      />
      <div className="text-xs text-gray-400 mt-1">{params.saltPercent} %</div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Aerogel Thickness (Insulation)</label>
      <input 
        type="range" 
        min="0" 
        max="10" 
        value={params.aerogelThicknessMm} 
        onChange={e => onChange('aerogelThicknessMm', parseInt(e.target.value))} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
      />
      <div className="text-xs text-gray-400 mt-1">{params.aerogelThicknessMm} mm</div>
    </div>
  </div>
);

export default MaterialSelector;
