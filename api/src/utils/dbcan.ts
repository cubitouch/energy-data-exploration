/**
 * Implements DBSCAN clustering from scratch in TypeScript.
 * Identifies outliers as noise points (anomalies).
 */

type Point = {
  timestamp: number;
  energy_value: number;
  cluster?: number | null; // Assigned cluster (-1 = noise)
};

export class DBSCAN {
  private epsilon: number;
  private minPoints: number;
  private data: Point[];
  private clusters: number[][]; // Stores clusters
  private visited: Set<number>;
  private noise: Set<number>;

  constructor(data: Point[], epsilon: number, minPoints: number) {
    this.data = data;
    this.epsilon = epsilon;
    this.minPoints = minPoints;
    this.clusters = [];
    this.visited = new Set();
    this.noise = new Set();
  }

  /**
   * Compute Euclidean distance between two points
   */
  private euclideanDistance(a: Point, b: Point): number {
    return Math.sqrt(
      (a.timestamp - b.timestamp) ** 2 + (a.energy_value - b.energy_value) ** 2
    );
  }

  /**
   * Find neighbors within `epsilon` distance
   */
  private findNeighbors(index: number): number[] {
    return this.data
      .map((point, i) =>
        i !== index &&
        this.euclideanDistance(this.data[index], point) <= this.epsilon
          ? i
          : -1
      )
      .filter((i) => i !== -1);
  }

  /**
   * Expands a cluster recursively
   */
  private expandCluster(
    pointIndex: number,
    neighbors: number[],
    clusterId: number
  ) {
    const cluster = [pointIndex];
    this.data[pointIndex].cluster = clusterId;

    for (let i = 0; i < neighbors.length; i++) {
      const neighborIndex = neighbors[i];

      if (!this.visited.has(neighborIndex)) {
        this.visited.add(neighborIndex);
        const newNeighbors = this.findNeighbors(neighborIndex);

        if (newNeighbors.length >= this.minPoints) {
          neighbors.push(...newNeighbors);
        }
      }

      if (this.data[neighborIndex].cluster === undefined) {
        this.data[neighborIndex].cluster = clusterId;
        cluster.push(neighborIndex);
      }
    }

    this.clusters.push(cluster);
  }

  /**
   * Runs the DBSCAN clustering algorithm
   */
  public run(): { clusters: number[][]; anomalies: Point[] } {
    let clusterId = 0;

    for (let i = 0; i < this.data.length; i++) {
      if (this.visited.has(i)) continue;

      this.visited.add(i);
      const neighbors = this.findNeighbors(i);

      if (neighbors.length < this.minPoints) {
        this.noise.add(i);
        this.data[i].cluster = -1; // Mark as noise
      } else {
        this.expandCluster(i, neighbors, clusterId++);
      }
    }

    // Identify anomalies (points marked as noise)
    const anomalies = this.data.filter((point) => point.cluster === -1);

    return { clusters: this.clusters, anomalies };
  }
}

/**
 * Detect anomalies using DBSCAN.
 * @param data Array of { timestamp: number; energy_value: number }
 * @returns Array of detected anomalies
 */
export function detectDbscanAnomalies(
  data: { timestamp: number; energy_value: number }[],
  epsilon = 1000, // Adjust this based on your dataset
  minPoints = 4
) {
  const dbscan = new DBSCAN(data, epsilon, minPoints);
  const { clusters, anomalies } = dbscan.run();

  return anomalies.map((point) => ({
    timestamp: point.timestamp,
    value: point.energy_value,
    reason: "DBSCAN anomaly (noise point)",
  }));
}
