import swaggerJSDoc from "swagger-jsdoc";

type SwaggerJSDocOptions = {
  definition?: Record<string, unknown>;
  swaggerDefinition?: Record<string, unknown>;
  apis: string[];
};

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "POS / Retail API",
    version: "1.0.0",
    description: "API backend untuk aplikasi toko / supermarket / petshop"
  },
   components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local dev"
    }
  ]
};

const options: SwaggerJSDocOptions = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.route.ts", "./src/modules/**/*.controller.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);