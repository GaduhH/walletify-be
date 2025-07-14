const serverless = require("serverless-http")
const app = require("../server")

export const handler = serverless(app);
