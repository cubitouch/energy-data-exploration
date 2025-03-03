import { DataSource } from "typeorm";

export type EnergyRepository = ReturnType<typeof createEnergyRepository>;

export const createEnergyRepository = (dataSource: DataSource) => ({
  getEnergyConsumption: async (timePeriod: number) => {
    const data = await dataSource.query(`
        SELECT t, actual
        FROM analytics_staging.stg_energy_market_france
        WHERE t >= CURRENT_DATE - INTERVAL '${timePeriod} days'
        AND t < CURRENT_DATE 
        ORDER BY t ASC;
      `);
    return data as { t: Date; actual: number }[];
  },
});
