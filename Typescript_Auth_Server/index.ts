import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./libs/tokens";
import cors from "cors";
import express, { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schema";

const prisma = new PrismaClient();

(async () => {
  const app = express();
  const corsOptions = {
    origin: function (origin: any, callback: any) {
      callback(false, [
        "http://localhost:3000",
        "https://studio.apollographql.com",
      ]);
    },
  };
  app.use(cors(corsOptions));

  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("hello"));
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and
    // we can send back an access token
    const user = await prisma.user.findUnique({
      where: { username: payload.userId },
    });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, prisma }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
})();
