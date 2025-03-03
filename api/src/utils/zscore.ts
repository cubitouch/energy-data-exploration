export function detectFastAnomalies(
  data: { timestamp: number; energy_value: number }[]
) {
  if (data.length === 0) {
    return [];
  }

  // Compute mean
  const values = data.map((d) => d.energy_value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Compute "sample" standard deviation (dividing by (n - 1))
  const stdDeviation = Math.sqrt(
    values
      .map((val) => (val - mean) ** 2)
      .reduce((sum, diff) => sum + diff, 0) /
      (values.length - 1)
  );

  const zThreshold = 2.5; // Detects values beyond 2.5 std deviations

  return data
    .map((d) => {
      const zScore = (d.energy_value - mean) / stdDeviation;
      if (Math.abs(zScore) > zThreshold) {
        return {
          timestamp: d.timestamp,
          value: d.energy_value,
          reason: "Z-Score Anomaly (exceeds 3 std deviations)",
        };
      }
      return null;
    })
    .filter(
      (d): d is { timestamp: number; value: number; reason: string } => !!d
    );
}
