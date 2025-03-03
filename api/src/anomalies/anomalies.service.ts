import { EnergyRepository } from "@repositories/energy.repository";
import { detectDbscanAnomalies } from "@utils/dbcan";
import { detectFastAnomalies } from "@utils/zscore";

export type AnomaliesService = ReturnType<typeof createAnomaliesService>;

const msToHoursRatio = 60 * 60 * 1000;
export const createAnomaliesService = (energyRepository: EnergyRepository) => ({
  detectAnomalies: async (timePeriod: number, algorithm: string) => {
    const data = await energyRepository.getEnergyConsumption(timePeriod);
    const normalizedData = data.map((d) => ({
      timestamp: d.t.getTime() / msToHoursRatio,
      energy_value: Number(d.actual),
    }));

    const energyValues = normalizedData.map((d) => d.energy_value);
    const energyRange = Math.max(...energyValues) - Math.min(...energyValues);
    const epsilon = energyRange * 0.05; // 5% of the energy value range

    const anomalies =
      algorithm === "fast"
        ? detectFastAnomalies(normalizedData)
        : detectDbscanAnomalies(normalizedData, epsilon);

    return anomalies.map((a) => ({
      ...a,
      timestamp: new Date(a.timestamp * msToHoursRatio),
    }));
  },
});
