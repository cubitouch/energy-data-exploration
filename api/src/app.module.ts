import { Module, DynamicModule } from "@nestjs/common";
import { AnomaliesController } from "./anomalies/anomalies.controller";
import { createDIContainer } from "./di";
import { Container } from "iti";

@Module({})
export class AppModule {
  static async register(): Promise<DynamicModule> {
    const { container, getService } = await createDIContainer();

    type ContainerType = Awaited<
      ReturnType<typeof createDIContainer>
    >["container"];
    type ServiceKeys = ContainerType extends Container<infer T, any>
      ? keyof T
      : never;

    const serviceKeys = Object.keys(container.getTokens()) as ServiceKeys[];

    const providers = serviceKeys.map((key) => ({
      provide: key,
      useFactory: async () => await getService(key),
    }));

    return {
      module: AppModule,
      controllers: [AnomaliesController],
      providers,
      exports: providers.map((p) => p.provide),
    };
  }
}
