import React, { useState, useMemo } from 'react';
import { Activity, Thermometer, Wind, Droplet, TreePine, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  modelType: 'do_bod' | 'carbon_budget' | 'species_area';
  onSimulateAction?: () => void;
}

export const EnvironmentalSimulator: React.FC<Props> = ({ modelType, onSimulateAction }) => {
  // Model 1: Streeter-Phelps DO/BOD State
  const [bodDischarge, setBodDischarge] = useState<number>(45); // mg/L
  const [initialDo, setInitialDo] = useState<number>(8.5); // mg/L
  const [waterTemp, setWaterTemp] = useState<number>(20); // °C
  const [k1Deoxygenation, setK1Deoxygenation] = useState<number>(0.25); // day^-1
  const [k2Reaeration, setK2Reaeration] = useState<number>(0.55); // day^-1
  const [streamVelocity, setStreamVelocity] = useState<number>(25); // km/day

  // Model 2: Carbon Budget State
  const [annualEmissions, setAnnualEmissions] = useState<number>(40); // GtCO2/yr
  const [targetTemp, setTargetTemp] = useState<number>(1.5); // °C
  const [cdrRemovals, setCdrRemovals] = useState<number>(2); // GtCO2/yr

  // Model 3: Island Biogeography State
  const [islandArea, setIslandArea] = useState<number>(120); // km^2
  const [distanceToMainland, setDistanceToMainland] = useState<number>(35); // km
  const [corridorWidth, setCorridorWidth] = useState<number>(40); // m

  // Streeter-Phelps calculations
  const streeterPhelpsResult = useMemo(() => {
    // DO saturation as function of temp (approx Henry's Law)
    const doSaturation = 14.652 - 0.41022 * waterTemp + 0.007991 * Math.pow(waterTemp, 2) - 0.000077774 * Math.pow(waterTemp, 3);
    const initialDeficit = Math.max(0, doSaturation - initialDo);
    const L0 = bodDischarge; // initial ultimate BOD

    // Critical time (t_crit) where deficit is maximal
    let tCrit = 0;
    if (k2Reaeration > k1Deoxygenation) {
      const numerator = Math.log((k2Reaeration / k1Deoxygenation) * (1 - initialDeficit * (k2Reaeration - k1Deoxygenation) / (k1Deoxygenation * L0)));
      tCrit = Math.max(0.1, numerator / (k2Reaeration - k1Deoxygenation));
    } else {
      tCrit = 1.0;
    }

    // Points along the river from day 0 to day 10
    const points: { day: number; distanceKm: number; doConc: number; bodRemaining: number; deficit: number }[] = [];
    let minDo = doSaturation;

    for (let day = 0; day <= 10; day += 0.5) {
      const exp1 = Math.exp(-k1Deoxygenation * day);
      const exp2 = Math.exp(-k2Reaeration * day);
      const deficit = ((k1Deoxygenation * L0) / (k2Reaeration - k1Deoxygenation)) * (exp1 - exp2) + initialDeficit * exp2;
      const doConc = Math.max(0, doSaturation - deficit);
      const bodRemaining = L0 * exp1;
      const distanceKm = day * streamVelocity;

      if (doConc < minDo) {
        minDo = doConc;
      }

      points.push({
        day,
        distanceKm,
        doConc: Number(doConc.toFixed(2)),
        bodRemaining: Number(bodRemaining.toFixed(1)),
        deficit: Number(deficit.toFixed(2))
      });
    }

    const criticalDistanceKm = tCrit * streamVelocity;

    return {
      doSaturation: Number(doSaturation.toFixed(2)),
      minDo: Number(minDo.toFixed(2)),
      tCrit: Number(tCrit.toFixed(2)),
      criticalDistanceKm: Number(criticalDistanceKm.toFixed(1)),
      points,
      hypoxiaRisk: minDo < 4.0,
      anoxiaRisk: minDo < 2.0
    };
  }, [bodDischarge, initialDo, waterTemp, k1Deoxygenation, k2Reaeration, streamVelocity]);

  // Carbon budget calculations
  const carbonBudgetResult = useMemo(() => {
    // IPCC AR6 budget for 1.5C is ~380 GtCO2 from 2024; for 2.0C is ~1150 GtCO2
    const baseBudget = targetTemp === 1.5 ? 380 : 1150;
    const netAnnual = Math.max(0.1, annualEmissions - cdrRemovals);
    const yearsRemaining = baseBudget / netAnnual;
    const exhaustionYear = Math.round(2024 + yearsRemaining);
    const radiativeForcingEst = 2.72 + (annualEmissions * 0.02);

    return {
      baseBudget,
      netAnnual: Number(netAnnual.toFixed(1)),
      yearsRemaining: Number(yearsRemaining.toFixed(1)),
      exhaustionYear,
      radiativeForcingEst: Number(radiativeForcingEst.toFixed(2))
    };
  }, [annualEmissions, targetTemp, cdrRemovals]);

  // Island Biogeography calculations
  const islandResult = useMemo(() => {
    // S = c * A^z. Let c = 10, z = 0.28 baseline
    // Distance decreases colonization rate
    // Corridors increase effective area and decrease isolation
    const effectiveArea = islandArea * (1 + corridorWidth / 100);
    const isolationFactor = Math.max(0.2, 1 - (distanceToMainland / 150) + (corridorWidth / 200));
    const speciesRichness = Math.round(10 * Math.pow(effectiveArea, 0.28) * isolationFactor);
    const extinctionVulnerability = Math.max(5, Math.min(95, Math.round(100 - (effectiveArea * 0.3) - (isolationFactor * 40))));

    return {
      effectiveArea: Number(effectiveArea.toFixed(1)),
      speciesRichness,
      extinctionVulnerability,
      isolationGrade: isolationFactor > 0.75 ? 'Low Isolation (Strong Corridors)' : isolationFactor > 0.45 ? 'Moderate Habitat Isolation' : 'Severe Habitat Fragmentation'
    };
  }, [islandArea, distanceToMainland, corridorWidth]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-xl" id="environmental-simulator-container">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-950/80 border border-emerald-700/60 rounded-lg text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              EDEN Mathematical Simulator
            </div>
            <h4 className="text-base font-medium text-slate-100">
              {modelType === 'do_bod' && 'Streeter-Phelps River Oxygen Sag & BOD Attenuation'}
              {modelType === 'carbon_budget' && 'IPCC AR6 Global Carbon Budget & Radiative Forcing'}
              {modelType === 'species_area' && 'MacArthur-Wilson Island Biogeography & Corridor Model'}
            </h4>
          </div>
        </div>

        {onSimulateAction && (
          <button
            onClick={onSimulateAction}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors"
            id="log-simulation-btn"
          >
            Log to Competency
          </button>
        )}
      </div>

      {/* Model 1: Streeter-Phelps */}
      {modelType === 'do_bod' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric Cards */}
            <div className={`p-4 rounded-xl border ${streeterPhelpsResult.anoxiaRisk ? 'bg-red-950/30 border-red-800/80 text-red-200' : streeterPhelpsResult.hypoxiaRisk ? 'bg-amber-950/30 border-amber-800/80 text-amber-200' : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'}`}>
              <div className="text-xs text-slate-400 font-medium">Critical Minimum DO</div>
              <div className="text-2xl font-bold mt-1">
                {streeterPhelpsResult.minDo} <span className="text-sm font-normal">mg/L</span>
              </div>
              <div className="text-xs mt-1">
                {streeterPhelpsResult.anoxiaRisk ? '🚨 Severe Anoxia (Fish Kill Risk)' : streeterPhelpsResult.hypoxiaRisk ? '⚠️ Hypoxic Stress (< 4 mg/L)' : '✓ Healthy Aquatic Ecosystem'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Critical Downstream Location (t_crit)</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {streeterPhelpsResult.criticalDistanceKm} <span className="text-sm font-normal text-slate-400">km</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Occurs at Day {streeterPhelpsResult.tCrit} downstream of outfall
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Saturation DO Baseline</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {streeterPhelpsResult.doSaturation} <span className="text-sm font-normal text-slate-400">mg/L</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Calculated at {waterTemp}°C water temperature
              </div>
            </div>
          </div>

          {/* SVG Sag Curve Visualizer */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Downstream Distance & Dissolved Oxygen Sag Curve</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Dissolved Oxygen (mg/L)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> BOD Remaining (mg/L)</span>
              </div>
            </div>

            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                {/* Horizontal reference line for 4.0 mg/L hypoxia */}
                <line x1="0" y1="105" x2="500" y2="105" stroke="#ef4444" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />
                <text x="5" y="101" fill="#ef4444" fontSize="9" opacity="0.8">Hypoxia Threshold (4.0 mg/L)</text>

                {/* BOD Curve (decay) */}
                <path
                  d={streeterPhelpsResult.points.map((p, i) => {
                    const x = (p.day / 10) * 500;
                    // Max BOD normalized to 100 for svg height
                    const y = 140 - Math.min(130, (p.bodRemaining / 80) * 120);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* DO Sag Curve */}
                <path
                  d={streeterPhelpsResult.points.map((p, i) => {
                    const x = (p.day / 10) * 500;
                    // DO max 14
                    const y = 140 - (p.doConc / 14) * 125;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Critical Sag point marker */}
                {streeterPhelpsResult.tCrit <= 10 && (
                  <circle
                    cx={(streeterPhelpsResult.tCrit / 10) * 500}
                    cy={140 - (streeterPhelpsResult.minDo / 14) * 125}
                    r="5"
                    fill="#ec4899"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Day 0 (Outfall)</span>
              <span>Day 2.5</span>
              <span>Day 5.0</span>
              <span>Day 7.5</span>
              <span>Day 10.0 (Recovery Zone)</span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Wastewater BOD₅ Discharge:</span>
                <span className="text-emerald-400 font-bold">{bodDischarge} mg/L</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={bodDischarge}
                onChange={e => setBodDischarge(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                id="slider-bod"
              />

              <div className="flex justify-between font-medium pt-2">
                <span className="text-slate-300">River Water Temperature:</span>
                <span className="text-cyan-400 font-bold">{waterTemp} °C</span>
              </div>
              <input
                type="range"
                min="5"
                max="32"
                value={waterTemp}
                onChange={e => setWaterTemp(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
                id="slider-temp"
              />
            </div>

            <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Reaeration Rate (k₂):</span>
                <span className="text-emerald-400 font-bold">{k2Reaeration} day⁻¹</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.05"
                value={k2Reaeration}
                onChange={e => setK2Reaeration(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                id="slider-k2"
              />

              <div className="flex justify-between font-medium pt-2">
                <span className="text-slate-300">Stream Velocity:</span>
                <span className="text-cyan-400 font-bold">{streamVelocity} km/day</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={streamVelocity}
                onChange={e => setStreamVelocity(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
                id="slider-velocity"
              />
            </div>
          </div>
        </div>
      )}

      {/* Model 2: Carbon Budget */}
      {modelType === 'carbon_budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${carbonBudgetResult.yearsRemaining < 8 ? 'bg-red-950/30 border-red-800 text-red-200' : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'}`}>
              <div className="text-xs text-slate-400 font-medium">Years of Remaining Carbon Budget</div>
              <div className="text-2xl font-bold mt-1">
                {carbonBudgetResult.yearsRemaining} <span className="text-sm font-normal">years</span>
              </div>
              <div className="text-xs mt-1">
                Exhaustion threshold estimated by year ~{carbonBudgetResult.exhaustionYear}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Allowable Cumulative Budget</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {carbonBudgetResult.baseBudget} <span className="text-sm font-normal text-slate-400">GtCO₂</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                For {targetTemp}°C target with 50% probability (IPCC AR6)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Effective Radiative Forcing</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                +{carbonBudgetResult.radiativeForcingEst} <span className="text-sm font-normal text-slate-400">W/m²</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Pre-industrial baseline: 0.0 W/m² (at 280 ppm CO₂)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div className="space-y-3">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Annual Gross Global Emissions:</span>
                <span className="text-emerald-400 font-bold">{annualEmissions} GtCO₂/year</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                value={annualEmissions}
                onChange={e => setAnnualEmissions(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                id="slider-emissions"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Carbon Dioxide Removal (CDR / DACCS):</span>
                <span className="text-cyan-400 font-bold">{cdrRemovals} GtCO₂/year</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={cdrRemovals}
                onChange={e => setCdrRemovals(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
                id="slider-cdr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Model 3: Island Biogeography */}
      {modelType === 'species_area' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800 text-emerald-200">
              <div className="text-xs text-slate-400 font-medium">Equilibrium Species Richness (S)</div>
              <div className="text-2xl font-bold mt-1">
                {islandResult.speciesRichness} <span className="text-sm font-normal">species</span>
              </div>
              <div className="text-xs mt-1">Arrhenius Relationship S = c · Aᶻ</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Extinction Vulnerability Index</div>
              <div className={`text-2xl font-bold mt-1 ${islandResult.extinctionVulnerability > 60 ? 'text-red-400' : 'text-slate-100'}`}>
                {islandResult.extinctionVulnerability}%
              </div>
              <div className="text-xs text-slate-400 mt-1">{islandResult.isolationGrade}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Effective Connected Area</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {islandResult.effectiveArea} <span className="text-sm font-normal text-slate-400">km²</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Includes biological corridor gain</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Reserve Core Area:</span>
                <span className="text-emerald-400 font-bold">{islandArea} km²</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={islandArea}
                onChange={e => setIslandArea(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                id="slider-area"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Distance to Mainland:</span>
                <span className="text-cyan-400 font-bold">{distanceToMainland} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={distanceToMainland}
                onChange={e => setDistanceToMainland(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
                id="slider-dist"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-300">Corridor Width:</span>
                <span className="text-indigo-400 font-bold">{corridorWidth} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={corridorWidth}
                onChange={e => setCorridorWidth(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
                id="slider-corridor"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
