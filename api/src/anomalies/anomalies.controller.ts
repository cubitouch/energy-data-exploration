import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from "@nestjs/common";
import { AnomaliesService } from "./anomalies.service";

@Controller("anomalies")
export class AnomaliesController {
  constructor(
    @Inject("anomaliesService")
    private readonly anomaliesService: AnomaliesService
  ) {}

  @Get()
  async detectAnomalies(
    @Query("time_period") timePeriod?: string,
    @Query("algorithm") algorithm?: string
  ) {
    const period = parseInt(timePeriod ?? "90", 10);
    if (isNaN(period) || period > 90 || period < 1) {
      throw new BadRequestException(
        "Invalid time_period: Must be between 1 and 90 days"
      );
    }

    const algo = algorithm ?? "fast";
    if (!["fast", "ml"].includes(algo)) {
      throw new BadRequestException(
        'Invalid algorithm: Must be "fast" or "ml"'
      );
    }

    return this.anomaliesService.detectAnomalies(period, algo);
  }
}
