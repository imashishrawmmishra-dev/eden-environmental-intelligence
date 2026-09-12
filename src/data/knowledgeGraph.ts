import { KnowledgeNode, KnowledgeEdge, CuratedResource, LearnerCompetency, LearnerRecommendation } from '../types';

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'bod',
    title: 'Biochemical Oxygen Demand (BOD)',
    category: 'pollution_indicators',
    summary: 'The amount of dissolved oxygen needed by aerobic biological organisms to break down organic material present in a given water sample at certain temperature over a specific time period (typically 5 days at 20°C, BOD₅).',
    deepDive: 'BOD serves as a fundamental metric for water pollution from domestic sewage, agricultural runoff, and industrial wastewater. Higher BOD indicates higher organic load, leading directly to microbial oxygen consumption and rapid dissolved oxygen (DO) depletion.',
    formulaOrMetric: 'BOD₅ = (DO_initial - DO_final) / P [where P is dilution factor, expressed in mg/L or ppm]',
    keyPrinciples: [
      'Unpolluted pristine surface waters typically exhibit BOD < 1-2 mg/L.',
      'Moderately polluted wastewater discharges show BOD 20-100 mg/L.',
      'Raw municipal sewage ranges between 150-300 mg/L BOD.',
      'The Streeter-Phelps equation mathematically couples BOD exertion with atmospheric reaeration.'
    ],
    examRelevance: 'Heavily tested in AP Environmental Science (Unit 8: Aquatic Pollution) and PE Environmental Exam (Water Resources & Wastewater Treatment kinetics).',
    careerRelevance: 'Core daily metric for Environmental Engineers, Wastewater Operations Supervisors, and EPA Compliance Inspectors.',
    practicalAction: 'Perform standard 5-day dilution incubation protocol using dark Winkler bottles or calibrated optical DO luminescence probes.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria', 'wmo_water_assessment'],
    difficulty: 'Intermediate'
  },
  {
    id: 'do',
    title: 'Dissolved Oxygen (DO)',
    category: 'hydrosphere',
    summary: 'The level of free, non-compound oxygen molecules dissolved in water bodies, critical for sustaining aerobic aquatic organisms like salmonids, invertebrates, and benthic communities.',
    deepDive: 'DO solubility is inversely proportional to water temperature (cold water holds significantly more oxygen than warm water) and decreases with increasing salinity and elevation. When DO drops below 4.0 mg/L, hypoxia ensues; below 2.0 mg/L, mass fish kills occur in dead zones.',
    formulaOrMetric: 'Henry’s Law: C_s = k_H * P_gas (Saturation DO ~14.6 mg/L at 0°C to 7.6 mg/L at 30°C)',
    keyPrinciples: [
      'Healthy aquatic ecosystems require DO levels > 6.0-8.0 mg/L.',
      'Thermal pollution from power plants reduces saturation solubility.',
      'Diurnal fluctuation: Photosynthesis drives DO peaks at mid-afternoon, respiration causes nadirs before dawn.',
      'Decomposition of algal blooms precipitates severe benthic anoxia.'
    ],
    examRelevance: 'Prominent in APES exam frqs, UPSC Ecology modules, and College Limnology lab exams.',
    careerRelevance: 'Hydrologists, Fisheries Biologists, and Marine Conservationists monitor DO profiles across stratification layers (epilimnion vs hypolimnion).',
    practicalAction: 'Calibrate optical DO sensor with 100% water-saturated air chamber before field limnological transects.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria', 'noaa_ocean_acid'],
    difficulty: 'Foundational'
  },
  {
    id: 'streeter_phelps',
    title: 'Streeter-Phelps Oxygen Sag Curve',
    category: 'hydrosphere',
    summary: 'The classical mathematical model governing dissolved oxygen deficit along a river receiving a point-source organic pollutant discharge.',
    deepDive: 'Balances two competing continuous rate processes: deoxygenation (microbial degradation of organic substrate at rate constant k₁) and reaeration (atmospheric diffusion at rate constant k₂ across the water-air interface). Produces the characteristic "sag" curve with a critical minimum DO point (t_crit).',
    formulaOrMetric: 'D(t) = [k₁ L₀ / (k₂ - k₁)] * (e^(-k₁ t) - e^(-k₂ t)) + D₀ * e^(-k₂ t)',
    keyPrinciples: [
      'Zone of Degradation: Initial discharge, high turbidity, DO begins rapid drop.',
      'Zone of Active Decomposition: Lowest DO, septic conditions if DO reaches 0, anaerobic sludge.',
      'Zone of Recovery: Reaeration rate outpaces deoxygenation, DO climbs back.',
      'Zone of Clean Water: Normal aquatic fauna restored, BOD levels return to baseline.'
    ],
    examRelevance: 'Standard quantitative computational problem in PE Environmental Engineering and University Environmental Fluid Mechanics.',
    careerRelevance: 'Used by river basin authorities to calculate Maximum Allowable Daily Loads (TMDL) for municipal treatment plants.',
    practicalAction: 'Calculate critical travel time (t_crit) and downstream distance to protect spawning river reaches.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria'],
    difficulty: 'Advanced'
  },
  {
    id: 'eutrophication',
    title: 'Cultural Eutrophication & Hypoxia',
    category: 'hydrosphere',
    summary: 'Excess nutrient enrichment of water bodies (primarily nitrates NO₃⁻ and phosphates PO₄³⁻) triggering explosive microalgae blooms, sunlight blockage, and subsequent suffocating microbial decomposition.',
    deepDive: 'Anthropogenic causes include synthetic fertilizer runoff from agricultural corn/soy belts and untreated wastewater. In coastal seas (e.g., Gulf of Mexico Dead Zone, Baltic Sea), stratified water columns prevent vertical mixing, trapping hypoxic bottom waters.',
    formulaOrMetric: 'Redfield Ratio: C:N:P = 106:16:1 (Phosphorus usually limits freshwater; Nitrogen limits marine)',
    keyPrinciples: [
      'Oligotrophic (clear, low nutrients) transitioning to Eutrophic/Hypereutrophic.',
      'Harmful Algal Blooms (HABs) can release hepatotoxins (Microcystin) and neurotoxins.',
      'Night-time respiration spike by blooms suppresses DO before daylight photosynthesizes.',
      'Secondary impact: Submerged aquatic vegetation (SAV) dies from light attenuation.'
    ],
    examRelevance: 'High-frequency APES Exam question; tested in UPSC Civil Services Mains Paper III (Environment).',
    careerRelevance: 'Watershed Management Coordinators, Agricultural Extension Officers, and Wetland Restoration Specialists.',
    practicalAction: 'Implement riparian buffer strips (minimum 15-30m width) with deep-rooted native vegetation along agricultural drainage channels.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria', 'unep_water_report'],
    difficulty: 'Foundational'
  },
  {
    id: 'radiative_forcing',
    title: 'Radiative Forcing & Greenhouse Effect',
    category: 'atmosphere',
    summary: 'The net change in the energy balance of the Earth system due to an imposed perturbation (e.g., increased atmospheric concentration of GHGs), expressed in Watts per square meter (W/m²).',
    deepDive: 'Solar radiation (shortwave ~0.2-4 μm) warms the Earth’s surface, which re-radiates terrestrial heat in the infrared spectrum (longwave ~4-100 μm). Greenhouse gases (CO₂, CH₄, N₂O, Fluorinated gases) possess rotational-vibrational dipole absorption bands that absorb and re-emit this terrestrial thermal radiation.',
    formulaOrMetric: 'ΔF = 5.35 * ln(C / C₀) [W/m² for CO₂, where C₀ is pre-industrial 280 ppm]',
    keyPrinciples: [
      'Total anthropogenic effective radiative forcing has reached +2.72 W/m² (IPCC AR6 WG1 estimate).',
      'Global Warming Potential (GWP₁₀₀): CO₂ = 1, CH₄ = ~28-30, N₂O = ~273, SF₆ = ~25,200.',
      'Water vapor feedback provides the strongest natural amplification factor (~double direct forcing).',
      'Aerosols (sulfates) provide negative direct and indirect (cloud albedo) cooling forcing.'
    ],
    examRelevance: 'Fundamental across AP Environmental Science Unit 9 (Global Change), GRE Earth Systems, and Climate Masters curricula.',
    careerRelevance: 'Climate Modelers, Carbon Accounting Consultants, and ESG Sustainability Directors.',
    practicalAction: 'Audit Scope 1, 2, and 3 organizational emissions using GHG Protocol Corporate Accounting Standard.',
    simulationModel: 'carbon_budget',
    resourceIds: ['ipcc_ar6_wg1', 'wmo_ghg_bulletin', 'noaa_gml'],
    difficulty: 'Intermediate'
  },
  {
    id: 'carbon_budget',
    title: 'Remaining Global Carbon Budget (1.5°C & 2.0°C)',
    category: 'atmosphere',
    summary: 'The cumulative amount of carbon dioxide (CO₂) emissions permitted over time to maintain global temperature rise below specified thermal limits relative to pre-industrial baselines.',
    deepDive: 'IPCC AR6 established a near-linear empirical relationship between cumulative net anthropogenic CO₂ emissions and global mean surface warming (TCRE: Transient Climate Response to Cumulative Carbon Emissions, ~0.45°C per 1000 GtCO₂). At current annual emissions (~40 GtCO₂/yr), the 50% 1.5°C budget will be exhausted within this decade.',
    formulaOrMetric: 'Remaining Budget (50% probability 1.5°C) ≈ 500 GtCO₂ from Jan 2020; diminishing by ~40 GtCO₂ each year',
    keyPrinciples: [
      'Every 1,000 GtCO₂ cumulatively emitted generates ~0.27°C to 0.63°C of warming.',
      'Net Zero implies anthropogenic emissions equal anthropogenic removals (CDR / afforestation / DACCS).',
      'Overshoot scenarios risk triggering non-linear tipping elements (permafrost thaw, Amazon dieback).',
      'Differentiated historic cumulative responsibility between Annex I and Non-Annex nations.'
    ],
    examRelevance: 'Core to Climate Policy certifications, UPSC GS-III, and Paris Agreement Nationally Determined Contributions (NDCs).',
    careerRelevance: 'National Climate Negotiators, Renewable Energy Transition Strategists, Energy Economists.',
    practicalAction: 'Model corporate decarbonization trajectories in alignment with Science Based Targets initiative (SBTi).',
    simulationModel: 'carbon_budget',
    resourceIds: ['ipcc_ar6_wg1', 'unfccc_paris_agreement', 'wmo_ghg_bulletin'],
    difficulty: 'Advanced'
  },
  {
    id: 'island_biogeography',
    title: 'Theory of Island Biogeography & Wildlife Corridors',
    category: 'biosphere',
    summary: 'MacArthur and Wilson’s equilibrium model stating that species richness on an ecological "island" is a dynamic balance between colonization rates (governed by distance to mainland) and extinction rates (governed by island area).',
    deepDive: 'Applied extensively to fragmented terrestrial landscapes where agricultural fields, highways, and urban sprawl turn continuous forest into isolated habitat islands. Biological corridors, stepping-stone reserves, and SLOSS (Single Large or Several Small) reserve designs mitigate genetic bottlenecking and local extirpation.',
    formulaOrMetric: 'Arrhenius Species-Area Relationship: S = c * A^z (where z typically ranges from 0.20 to 0.35)',
    keyPrinciples: [
      'Near islands have higher immigration/colonization rates than far islands.',
      'Large islands support larger population sizes with lower extinction probabilities.',
      'Edge effects: Habitat fragmentation alters microclimate (higher wind, lower humidity, invasive intrusion) along perimeter zones.',
      'Metapopulation dynamics: "Source" populations rescue sub-populations in marginal "sink" habitats.'
    ],
    examRelevance: 'Major component of APES Unit 2 (The Living World: Biodiversity) and GRE Biology Ecology section.',
    careerRelevance: 'Conservation Biologists, GIS Habitat Connectivity Modelers, National Park Planners.',
    practicalAction: 'Delineate functional wildlife overpasses and riparian forest ribbons across highway choke-points using Circuitscape / Linkage Mapper.',
    simulationModel: 'species_area',
    resourceIds: ['iucn_redlist', 'ramsar_wetlands'],
    difficulty: 'Intermediate'
  },
  {
    id: 'keystone_species',
    title: 'Keystone Species & Trophic Cascades',
    category: 'biosphere',
    summary: 'Species that exert disproportionately large architectural influence on ecosystem community structure relative to their numerical abundance or biomass.',
    deepDive: 'Classic example: Robert Paine’s removal of Pisaster ochraceus sea stars in rocky intertidal zones caused mussel monocultures that collapsed species diversity from 15 to 1. Trophic cascades describe reciprocal predator-prey alterations down the trophic pyramid (e.g., Yellowstone wolf reintroduction controlling elk browse and restoring riparian aspen/beaver hydrology).',
    formulaOrMetric: 'Community Importance index: CI_i = [(t_N - t_D) / t_N] * (1 / p_i)',
    keyPrinciples: [
      'Keystone predators (sea otters keeping sea urchins from mowing kelp forests).',
      'Ecosystem engineers (beavers constructing wetlands, creating hydrologic retention).',
      'Keystone mutualists (fig wasps and pollinators sustaining forest fruiting cycles).',
      'Loss of a keystone species triggers secondary extinctions and trophic collapse.'
    ],
    examRelevance: 'Pivotal conceptual benchmark in APES, IB Environmental Systems and Societies, and MCAT Biology.',
    careerRelevance: 'Wildlife Ecologists, Rewilding Project Leaders, Endangered Species Recovery Coordinators.',
    practicalAction: 'Design ecosystem trophic baseline assessment prior to reintroducing apex carnivores or ecosystem engineers.',
    simulationModel: 'species_area',
    resourceIds: ['iucn_redlist'],
    difficulty: 'Foundational'
  },
  {
    id: 'paris_agreement',
    title: 'Paris Climate Agreement & Article 6 Mechanisms',
    category: 'environmental_policy',
    summary: 'A legally binding international treaty on climate change adopted by 196 Parties at COP21 in Paris, committed to holding global temperature increase well below 2°C above pre-industrial levels and pursuing efforts to limit it to 1.5°C.',
    deepDive: 'Structured on bottom-up Nationally Determined Contributions (NDCs) submitted every 5 years with an embedded "ratchet mechanism". Article 6 governs international compliance carbon markets (6.2 bilateral cooperative approaches and 6.4 centralized crediting mechanism) to avoid double counting through Corresponding Adjustments.',
    formulaOrMetric: 'Global Stocktake (GST) cycle: 5-year reviews assessing collective implementation trajectory',
    keyPrinciples: [
      'Principle of Common But Differentiated Responsibilities and Respective Capabilities (CBDR-RC).',
      'Loss and Damage fund establishment for climate-vulnerable developing states.',
      'Transparency Framework (ETF) mandating biennial transparency reports (BTRs).',
      'Enhanced ambition cycles pushing decarbonization of high-emitting sectors.'
    ],
    examRelevance: 'High importance for UPSC GS-II/III, Law School Environmental Law, and Master of Public Policy examinations.',
    careerRelevance: 'Climate Diplomacy Officers, ESG Carbon Offset Auditors, International Carbon Trading Specialists.',
    practicalAction: 'Audit bilateral carbon offset transactions to confirm Corresponding Adjustments match UNFCCC Article 6 guidance.',
    simulationModel: 'carbon_budget',
    resourceIds: ['unfccc_paris_agreement', 'ipcc_ar6_wg1'],
    difficulty: 'Advanced'
  },
  {
    id: 'clean_water_act',
    title: 'Clean Water Act (CWA) & NPDES Permits',
    category: 'environmental_policy',
    summary: 'The primary federal law in the United States governing water pollution, enacted in 1972 with the objective of restoring and maintaining the chemical, physical, and biological integrity of the Nation’s waters.',
    deepDive: 'Establishes the National Pollutant Discharge Elimination System (NPDES) permit program under Section 402, making it unlawful to discharge any pollutant from a point source into "waters of the United States" (WOTUS) without a permit. Section 303(d) mandates Total Maximum Daily Load (TMDL) calculations for impaired waters.',
    formulaOrMetric: 'TMDL = Σ WLA (Waste Load Allocations) + Σ LA (Load Allocations) + MOS (Margin of Safety)',
    keyPrinciples: [
      'Distinction between Point Source (pipes, ditches) and Non-Point Source (diffuse agricultural runoff).',
      'Technology-based effluent limits (TBELs) vs Water Quality-based effluent limits (WQBELs).',
      'Section 404 dredge and fill permits regulated jointly by USACE and EPA for wetlands.',
      'Antidegradation policies guarding high-quality pristine waters against deterioration.'
    ],
    examRelevance: 'Crucial in APES Environmental Laws module, Fundamentals of Engineering (FE) Environmental, and Bar Environmental Law exams.',
    careerRelevance: 'Environmental Compliance Managers, Municipal Stormwater Coordinators, Environmental Lawyers.',
    practicalAction: 'Draft and review Stormwater Pollution Prevention Plans (SWPPP) adhering to NPDES Construction General Permit rules.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria'],
    difficulty: 'Intermediate'
  },
  {
    id: 'career_env_engineer',
    title: 'Environmental Engineer Career Pathway',
    category: 'careers',
    summary: 'Professional engineers who combine principles of engineering, soil science, biology, and chemistry to develop solutions to environmental problems including water purification, air emission scrubbers, and remediation.',
    deepDive: 'Typical progression: ABET-accredited B.S. in Environmental or Civil Engineering -> FE (Fundamentals of Engineering) Exam -> 4 years supervised professional engineering experience -> PE (Professional Engineer) Licensure. Specializations include water resources, hazardous waste bioremediation, and air quality modeling.',
    formulaOrMetric: 'Median Salary: $96,820/yr (US BLS 2023); Projected growth rate: 6% (Faster than average)',
    keyPrinciples: [
      'Core competencies: Mass and energy balances, reactor kinetics, hydrology, environmental fluid mechanics.',
      'Key tools: EPA SWMM (Storm Water Management Model), MODFLOW, AERMOD, ArcGIS Pro.',
      'Design responsibilities: Municipal wastewater treatment facilities (aeration basins, clarifiers, UV disinfection).',
      'Ethical obligation under PE canon: Hold paramount the safety, health, and welfare of the public and environment.'
    ],
    examRelevance: 'Direct pathway to FE Environmental and PE Environmental licensure exams.',
    careerRelevance: 'Direct career profile with mapped educational prerequisites and engineering competencies.',
    practicalAction: 'Practice open-channel Manning equation flow calculations and activated sludge aeration oxygen requirements.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria'],
    difficulty: 'Intermediate'
  },
  {
    id: 'exam_apes',
    title: 'AP Environmental Science (APES) Exam Framework',
    category: 'exams',
    summary: 'College Board advanced placement curriculum covering 9 interdisciplinary units spanning Earth systems, living world, populations, resources, energy, atmospheric pollution, aquatic pollution, and global change.',
    deepDive: 'Exam format: Section I consists of 80 Multiple-Choice Questions (60% of score, 90 mins); Section II consists of 3 Free-Response Questions (40% of score, 70 mins): Design an Investigation, Propose a Solution with Calculations, and Environmental Problem Analysis.',
    formulaOrMetric: 'Unit Weightings: Unit 8 (Aquatic & Terrestrial Pollution) 7-10%, Unit 9 (Global Change) 15-20%',
    keyPrinciples: [
      'Concept 1: Energy transfer drives biological and atmospheric circulation.',
      'Concept 2: Human systems alter natural biogeochemical cycles (C, N, P, S).',
      'Quantitative requirement: Dimensional analysis, metric conversions, percent change calculations without calculators on FRQs.',
      'Scientific practice: Experimental design, identifying independent/dependent variables, controls, and error sources.'
    ],
    examRelevance: 'Primary high school / college freshman benchmark for environmental literacy and collegiate course credit.',
    careerRelevance: 'Foundational entry gateway inspiring future environmental scientists, hydrologists, and policymakers.',
    practicalAction: 'Review sample 5-point Free Response rubric on Streeter-Phelps BOD/DO sag curve and agricultural runoff buffers.',
    simulationModel: 'do_bod',
    resourceIds: ['epa_water_criteria', 'ipcc_ar6_wg1'],
    difficulty: 'Foundational'
  }
];

export const KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  {
    id: 'e1',
    source: 'bod',
    target: 'do',
    relation: 'interacts_with',
    description: 'High Biochemical Oxygen Demand directly drives microbial consumption and subsequent depletion of Dissolved Oxygen in aquatic systems.',
    strength: 0.95
  },
  {
    id: 'e2',
    source: 'bod',
    target: 'streeter_phelps',
    relation: 'measured_by',
    description: 'Streeter-Phelps equation mathematically calculates the downstream DO deficit curve as a function of initial BOD exertion and atmospheric reaeration.',
    strength: 0.9
  },
  {
    id: 'e3',
    source: 'eutrophication',
    target: 'bod',
    relation: 'leads_to',
    description: 'Decomposing algal blooms generate massive organic sediment load, drastically escalating BOD in the benthic zone.',
    strength: 0.88
  },
  {
    id: 'e4',
    source: 'eutrophication',
    target: 'do',
    relation: 'interacts_with',
    description: 'Severe eutrophication produces widespread seasonal and permanent aquatic hypoxia/anoxia (DO < 2.0 mg/L).',
    strength: 0.92
  },
  {
    id: 'e5',
    source: 'clean_water_act',
    target: 'bod',
    relation: 'regulated_by',
    description: 'Clean Water Act NPDES permits establish maximum allowable daily and monthly effluent BOD limits on wastewater discharge facilities.',
    strength: 0.85
  },
  {
    id: 'e6',
    source: 'clean_water_act',
    target: 'do',
    relation: 'regulated_by',
    description: 'CWA Section 303(d) water quality standards require streams to maintain minimum DO thresholds (e.g. 5-7 mg/L) for designated aquatic life uses.',
    strength: 0.86
  },
  {
    id: 'e7',
    source: 'radiative_forcing',
    target: 'carbon_budget',
    relation: 'interacts_with',
    description: 'Cumulative atmospheric radiative forcing from CO2 and GHGs determines the remaining allowable carbon budget before breaching the 1.5°C threshold.',
    strength: 0.95
  },
  {
    id: 'e8',
    source: 'paris_agreement',
    target: 'carbon_budget',
    relation: 'regulated_by',
    description: 'The Paris Agreement provides the global diplomatic architecture requiring national NDCs to align with the remaining carbon budget for 1.5°C.',
    strength: 0.92
  },
  {
    id: 'e9',
    source: 'island_biogeography',
    target: 'keystone_species',
    relation: 'interacts_with',
    description: 'Habitat fragmentation governed by Island Biogeography principles restricts range territories required by apex keystone predators.',
    strength: 0.82
  },
  {
    id: 'e10',
    source: 'career_env_engineer',
    target: 'streeter_phelps',
    relation: 'career_pathway',
    description: 'Environmental Engineers apply Streeter-Phelps calculations to design aeration lagoons and municipal wastewater treatment discharges.',
    strength: 0.89
  },
  {
    id: 'e11',
    source: 'career_env_engineer',
    target: 'clean_water_act',
    relation: 'career_pathway',
    description: 'Environmental Engineers prepare NPDES discharge permits, industrial pretreatment plans, and SWPPP compliance audits.',
    strength: 0.91
  },
  {
    id: 'e12',
    source: 'exam_apes',
    target: 'bod',
    relation: 'exam_relevance',
    description: 'BOD and DO relationships form standard FRQ questions on aquatic pollution in the AP Environmental Science exam.',
    strength: 0.94
  },
  {
    id: 'e13',
    source: 'exam_apes',
    target: 'radiative_forcing',
    relation: 'exam_relevance',
    description: 'Greenhouse gas GWP metrics and thermal radiative forcing are central to APES Unit 9 scoring rubrics.',
    strength: 0.92
  }
];

export const CURATED_RESOURCES: CuratedResource[] = [
  {
    id: 'ipcc_ar6_wg1',
    title: 'IPCC Sixth Assessment Report: The Physical Science Basis (WG1)',
    organization: 'IPCC',
    type: 'Assessment Report',
    url: 'https://www.ipcc.ch/report/ar6/wg1/',
    license: 'Open Access / UN Attribution (CC-BY-4.0)',
    summary: 'Authoritative global consensus assessment of the physical science of climate change, quantifying radiative forcing (+2.72 W/m²), climate sensitivity, and remaining carbon budgets for 1.5°C and 2.0°C trajectories.',
    conceptIds: ['radiative_forcing', 'carbon_budget', 'paris_agreement'],
    peerReviewed: true,
    reliabilityTier: 'Tier-1 Authoritative'
  },
  {
    id: 'wmo_ghg_bulletin',
    title: 'WMO Greenhouse Gas Bulletin (Global Atmosphere Watch)',
    organization: 'WMO',
    type: 'Observation Bulletin',
    url: 'https://wmo.int/our-mandate/climate/wmo-greenhouse-gas-bulletin',
    license: 'Public Domain / WMO Official Release',
    summary: 'Annual observational report detailing atmospheric concentrations of globally averaged CO₂, CH₄, and N₂O, tracking the NOAA Annual Greenhouse Gas Index and Keeling curve trends.',
    conceptIds: ['radiative_forcing', 'carbon_budget'],
    peerReviewed: true,
    reliabilityTier: 'Tier-1 Authoritative'
  },
  {
    id: 'epa_water_criteria',
    title: 'EPA National Recommended Water Quality Criteria for Aquatic Life',
    organization: 'EPA',
    type: 'Technical Standard',
    url: 'https://www.epa.gov/wqc/national-recommended-water-quality-criteria-aquatic-life-criteria-table',
    license: 'US Government Work (Public Domain)',
    summary: 'Federal technical guidelines setting numeric criteria for Dissolved Oxygen, BOD limits, temperature limits, and nutrient (N/P) thresholds under Section 304(a) of the Clean Water Act.',
    conceptIds: ['bod', 'do', 'streeter_phelps', 'eutrophication', 'clean_water_act'],
    peerReviewed: true,
    reliabilityTier: 'Government Standard'
  },
  {
    id: 'iucn_redlist',
    title: 'IUCN Red List of Threatened Species: Categories & Criteria (v3.1)',
    organization: 'IUCN',
    type: 'Database',
    url: 'https://www.iucnredlist.org/',
    license: 'Creative Commons Attribution-NonCommercial (CC-BY-NC 4.0)',
    summary: 'The world’s most comprehensive inventory of the global conservation status of biological species, detailing quantitative extinction risk thresholds, geographic range reduction, and population decline metrics.',
    conceptIds: ['island_biogeography', 'keystone_species'],
    peerReviewed: true,
    reliabilityTier: 'Tier-1 Authoritative'
  },
  {
    id: 'unfccc_paris_agreement',
    title: 'UNFCCC Paris Climate Agreement (Treaty Text & Article 6 Rulebook)',
    organization: 'UNFCCC',
    type: 'Legal Framework',
    url: 'https://unfccc.int/process-and-meetings/the-paris-agreement',
    license: 'United Nations Treaty Series (Public Domain)',
    summary: 'The international legal framework codifying global temperature goals, nationally determined contributions (NDCs), transparency arrangements, and Article 6 international carbon market rules.',
    conceptIds: ['paris_agreement', 'carbon_budget'],
    peerReviewed: true,
    reliabilityTier: 'Treaty Document'
  },
  {
    id: 'ramsar_wetlands',
    title: 'Ramsar Convention on Wetlands: Strategic Plan & Wetland Wise Use',
    organization: 'Ramsar',
    type: 'Legal Framework',
    url: 'https://www.ramsar.org/',
    license: 'Intergovernmental Treaty Document',
    summary: 'International treaty framework providing national action and international cooperation for the conservation and sustainable utilization of freshwater, coastal, and peatland wetlands.',
    conceptIds: ['eutrophication', 'island_biogeography', 'do'],
    peerReviewed: true,
    reliabilityTier: 'Treaty Document'
  },
  {
    id: 'noaa_gml',
    title: 'NOAA Global Monitoring Laboratory: Atmospheric Carbon Observations',
    organization: 'NOAA',
    type: 'Observation Bulletin',
    url: 'https://gml.noaa.gov/ccgg/trends/',
    license: 'US Federal Government Public Domain',
    summary: 'Continuous high-precision atmospheric gas measurements from Mauna Loa Observatory and worldwide sampling network, providing definitive observational records of CO2, methane, and halocarbons.',
    conceptIds: ['radiative_forcing', 'carbon_budget'],
    peerReviewed: true,
    reliabilityTier: 'Government Standard'
  },
  {
    id: 'unep_water_report',
    title: 'UNEP Global Environment Monitoring System for Freshwater (GEMS/Water)',
    organization: 'UNEP',
    type: 'Assessment Report',
    url: 'https://www.unep.org/explore-topics/water/what-we-do/monitoring-water-quality',
    license: 'United Nations Official Publication',
    summary: 'Global environmental surveillance program tracking water quality indicators, ambient water quality index (AWQI), and SDG 6.3.2 achievement across worldwide river basins.',
    conceptIds: ['bod', 'do', 'eutrophication'],
    peerReviewed: true,
    reliabilityTier: 'Tier-1 Authoritative'
  }
];

export const INITIAL_COMPETENCIES: LearnerCompetency[] = [
  {
    id: 'comp_limnology',
    name: 'Aquatic Chemistry & Limnology (DO / BOD)',
    category: 'hydrosphere',
    score: 82,
    level: 'Proficient',
    lastPracticed: 'Today',
    eventsCount: 14
  },
  {
    id: 'comp_atmospheric',
    name: 'Atmospheric Dynamics & Radiative Forcing',
    category: 'atmosphere',
    score: 68,
    level: 'Developing',
    lastPracticed: 'Yesterday',
    eventsCount: 9
  },
  {
    id: 'comp_conservation',
    name: 'Conservation Biology & Island Biogeography',
    category: 'biosphere',
    score: 75,
    level: 'Proficient',
    lastPracticed: '2 days ago',
    eventsCount: 11
  },
  {
    id: 'comp_policy',
    name: 'Environmental Law & International Treaties',
    category: 'environmental_policy',
    score: 55,
    level: 'Developing',
    lastPracticed: '4 days ago',
    eventsCount: 6
  },
  {
    id: 'comp_engineering',
    name: 'Environmental Engineering & Treatment Kinetics',
    category: 'careers',
    score: 42,
    level: 'Novice',
    lastPracticed: '5 days ago',
    eventsCount: 4
  },
  {
    id: 'comp_exam_mastery',
    name: 'APES & Professional Exam Problem Solving',
    category: 'exams',
    score: 85,
    level: 'Master',
    lastPracticed: 'Today',
    eventsCount: 18
  }
];

export const INITIAL_RECOMMENDATIONS: LearnerRecommendation[] = [
  {
    id: 'rec_1',
    title: 'Master the Streeter-Phelps Reaeration Differential',
    category: 'hydrosphere',
    reason: 'Strengthen quantitative engineering kinetics before attempting professional practice problems.',
    priority: 'High',
    targetNodeId: 'streeter_phelps'
  },
  {
    id: 'rec_2',
    title: 'Explore Paris Agreement Article 6 Market Rules',
    category: 'environmental_policy',
    reason: 'Your policy competency is below 60%. Understand Corresponding Adjustments and international carbon trading.',
    priority: 'Medium',
    targetNodeId: 'paris_agreement'
  },
  {
    id: 'rec_3',
    title: 'Simulate Species-Area Curves for Wildlife Corridors',
    category: 'biosphere',
    reason: 'Test your intuition on how highway fragmentation affects island biogeography extinction rates.',
    priority: 'Medium',
    targetNodeId: 'island_biogeography'
  }
];
