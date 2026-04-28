import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure Auth API",
      version: "1.0.0",
      description:
        "Production-ready Auth API with JWT, Refresh Token Rotation, OTP verification, and Redis rate limiting",
    },
    servers: [
      {
        url: "https://express-mysql-auth-api.onrender.com/api/auth",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Session", description: "Session management APIs" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);