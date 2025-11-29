import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "POS / Retail API",
    version: "1.0.0",
    description: "API backend untuk aplikasi toko / supermarket / petshop"
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local dev"
    }
  ]
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.route.ts", "./src/modules/**/*.controller.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);