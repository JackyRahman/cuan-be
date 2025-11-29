declare module "swagger-ui-express" {
  import type { RequestHandler } from "express";

  interface SwaggerUi {
    serve: RequestHandler[];
    setup: (spec?: unknown) => RequestHandler;
  }

  const swaggerUi: SwaggerUi;
  export default swaggerUi;
}

declare module "swagger-jsdoc" {
  export interface Options {
    definition?: Record<string, unknown>;
    swaggerDefinition?: Record<string, unknown>;
    apis: string[];
  }

  export default function swaggerJSDoc(options: Options): unknown;
}

declare module "postgrator" {
  interface PostgratorConfig {
    migrationPattern: string;
    driver: "pg";
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: { rejectUnauthorized: boolean };
    schemaTable?: string;
  }

  export default class Postgrator {
    constructor(config: PostgratorConfig);
    migrate(target: string | number): Promise<{ version: string | number } | void>;
  }
}