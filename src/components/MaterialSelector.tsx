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
      <label className="block text-sm font-medium mb-1" title="The type of polymer matrix used to hold the working fluid. PNIPAM offers superior thermo-responsive cooling.">Hydrogel Type</label>
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
      <label className="block text-sm font-medium mb-1" title="How easily fluid moves through the fabric. Higher permeability increases wicking speed but may reduce structural integrity.">Fabric Permeability (higher = faster wicking)</label>
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
      <label className="block text-sm font-medium mb-1" title="Internal pressure of the system. Lower pressure (stronger vacuum) significantly boosts evaporation rates.">Vacuum Level (lower = stronger evaporation)</label>
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
      <label className="block text-sm font-medium mb-1" title="Percentage of Phase Change Material. PCM buffers temperature swings by absorbing latent heat during peak sun.">PCM Loading (Phase Change Material %)</label>
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
      <label className="block text-sm font-medium mb-1" title="Salt concentration in the working fluid. Optimized salt levels improve thermal conductivity and boiling point elevation (BPE).">Salt Concentration (BPE Optimization)</label>
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
      <label className="block text-sm font-medium mb-1" title="Thickness of the aerogel insulation layer. Thicker insulation reduces heat loss to ambient air.">Aerogel Thickness (Insulation)</label>
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
