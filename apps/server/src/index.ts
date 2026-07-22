import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World! pas bonjour");
});

// 3000 est pris par le client Next
const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Serveur sur http://localhost:${port}`);
});
