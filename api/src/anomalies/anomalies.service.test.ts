import { createAnomaliesService } from "./anomalies.service";

describe("AnomaliesService", () => {
  let anomaliesService: ReturnType<typeof createAnomaliesService>;
  let mockRepository: any;
  const mockEnergyData = [
    { t: new Date("2025-03-01T10:00:00Z"), actual: 5000 },
    { t: new Date("2025-03-01T10:15:00Z"), actual: 5020 },
    { t: new Date("2025-03-01T10:30:00Z"), actual: 5050 },
    { t: new Date("2025-03-01T10:45:00Z"), actual: 5070 },
    { t: new Date("2025-03-01T11:00:00Z"), actual: 5090 },
    { t: new Date("2025-03-01T11:15:00Z"), actual: 5100 },
    { t: new Date("2025-03-01T11:30:00Z"), actual: 5080 },
    { t: new Date("2025-03-01T11:45:00Z"), actual: 5060 },
    { t: new Date("2025-03-01T12:00:00Z"), actual: 6400 }, // 🚨 Anomaly!
    { t: new Date("2025-03-01T12:15:00Z"), actual: 5055 },
  ];

  beforeEach(() => {
    // Mock repository
    mockRepository = {
      getEnergyConsumption: jest.fn(),
    };
    anomaliesService = createAnomaliesService(mockRepository);
  });

  it("should detect 1 anomaly using 'fast' method", async () => {
    // Mock data returned by the repository
    mockRepository.getEnergyConsumption.mockResolvedValue(mockEnergyData);

    // Run the service with the "fast" algorithm
    const result = await anomaliesService.detectAnomalies(90, "fast");

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(6400);
  });

  it("should detect 1 anomaly using 'ml' method", async () => {
    // Mock data returned by the repository
    mockRepository.getEnergyConsumption.mockResolvedValue(mockEnergyData);

    // Run the service with the "ml" algorithm
    const result = await anomaliesService.detectAnomalies(90, "ml");

    // Validate the response
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(6400);
  });
});
