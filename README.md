# LECDS Configurator

A specialized tool for simulating and optimizing the **Laminated Evaporative Cooling & Distillation System (LECDS)** for solar panels.

## How We Got Here

The LECDS project was born from the need to solve two critical challenges in renewable energy: **solar panel efficiency degradation due to heat** and **global water scarcity**. 

Standard photovoltaic (PV) panels lose efficiency as they heat up. By integrating a multi-layered evaporative cooling system directly onto the back of the panel, we can maintain lower operating temperatures. Furthermore, by capturing the evaporated moisture in a controlled distillation process, the system can simultaneously produce clean, distilled water from saline or brackish sources.

This configurator was developed to bridge the gap between complex CFD (Computational Fluid Dynamics) simulations and practical engineering design, allowing for rapid iteration of material combinations and operating parameters.

## Where We Are

The current version of the LECDS Configurator provides a real-time, web-based interface for exploring the performance of various system designs.

### Key Features:
- **Dynamic CFD Previews**: A specialized simulation model that calculates cooling performance ($\Delta T$), distillate yield, and efficiency gains.
- **Material Selection**: Fine-grained control over hydrogel types, fabric permeability, and aerogel insulation thickness.
- **Environmental Simulation**: Adjust vacuum pressure to simulate different operating conditions and their impact on evaporation rates.
- **Visual Analytics**: Interactive temperature profiles and yield comparisons to visualize thermal gradients across the 20cm channel.
- **Configuration Feedback**: Real-time status indicators that flag sub-optimal or ineffective material pairings.

## What Makes Sense Next

The roadmap for the LECDS Configurator includes several key technical advancements:
1. **High-Fidelity Solver Integration**: Moving from the current simplified model to a full integration with OpenFOAM for 3D thermal mapping.
2. **Time-Dependent Simulations**: Adding the ability to simulate performance over a full 24-hour diurnal cycle, accounting for changing solar irradiance and ambient temperatures.
3. **Advanced Wicking Models**: Incorporating non-linear wicking behaviors and salt crystallization thresholds for more accurate long-term performance predictions.
4. **Manufacturing Export**: Generating detailed material specification reports that can be used directly for prototyping and production.

## User Guide

### Adjusting Parameters
- **Hydrogel Type**: Choose between different polymer matrices (e.g., PNIPAM_PAM or SA_PAM) which have different water retention and release characteristics.
- **Fabric Permeability**: Controls how easily vapor can transport through the wicking layer. Higher permeability generally increases yield but may require more robust vacuum control.
- **PCM Loading**: Adjust the percentage of Phase Change Material to enhance thermal stability during peak sun hours.
- **Vacuum Pressure**: Lowering the pressure (increasing vacuum) significantly boosts evaporation rates but increases system complexity.

### Interpreting Results
- **Temperature Profile**: Shows the thermal gradient from the inlet to the outlet of the 20cm channel. Look for a steep drop in the "Hydrogel Zone" for effective cooling.
- **Distillate Yield**: Measured in Liters per square meter per day (L/m²/day). Compare your current yield against the baseline to see the impact of your enhancements.
- **Simulation Status**: If your configuration is flagged as "Ineffective," try increasing the vacuum or the PCM loading to improve thermal performance.

## Troubleshooting

- **Simulation Fails to Load**: Ensure you have a stable network connection. If the error persists, use the **Reset** button in the sidebar to return to a known stable configuration.
- **Charts are Static**: If the charts do not update when you move a slider, try refreshing the page. The backend simulation usually takes less than 500ms to respond.
- **Unrealistic Results**: The model is optimized for realistic material bounds. Extreme combinations (e.g., 0% salt with 100kPa vacuum) may produce edge-case results that require manual verification against the project literature.

---
*Developed for the LECDS Research & Engineering Team.*
