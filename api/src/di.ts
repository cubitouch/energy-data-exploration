import { strict as assert } from "assert";
import { Container, createContainer } from "iti";
import { DataSource } from "typeorm";
import { createAnomaliesService } from "./anomalies/anomalies.service";
import { createEnergyRepository } from "./repositories/energy.repository";

// Initialize your database connection asynchronously
const initializeDataSource = async () => {
  assert(process.env.DATABASE_URL, "❌ Missing DATABASE_URL in .env");

  const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Use this if a self-signed certificate is used
    },
    synchronize: true,
    logging: false,
    entities: [],
  });

  try {
    await dataSource.initialize();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }

  return dataSource;
};

export const createDIContainer = async () => {
  const dataSource = await initializeDataSource();

  const container = createContainer()
    .add({ dataSource }) // Register dataSource directly as an object
    .add(({ dataSource }) => ({
      energyRepository: createEnergyRepository(dataSource),
    }))
    .add(({ energyRepository }) => ({
      anomaliesService: createAnomaliesService(energyRepository),
    }));
  type ContainerType = typeof container extends Container<infer S, any>
    ? S
    : never;

  return {
    container,
    getService: <K extends keyof ContainerType>(
      serviceName: K
    ): ReturnType<typeof container.get<K>> => container.get(serviceName),
  };
};
