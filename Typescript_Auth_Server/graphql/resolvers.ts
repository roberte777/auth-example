import { PrismaClient } from "@prisma/client";
import {
  clearCookies,
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../libs/tokens";
import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
const bcrypt = require("bcrypt");

type Context = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
};
const resolvers = {
  Query: {
    hello: () => "hello world!",
    user: (_: any, __: any, ctx: Context) => {
      const { accessToken } = ctx.req.cookies;
      if (!accessToken) {
        console.log("no access token");
        throw new Error("not authenticated");
      }
      try {
        const { userId } = verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET!
        ) as any;

        return ctx.prisma.user.findUnique({ where: { username: userId } });
      } catch (err) {
        console.log(err);
        throw new Error("not authenticated");
      }
    },
    getUsers: async (_: any, __: any, ctx: Context) => {
      return await ctx.prisma.user.findMany();
    },
  },
  Mutation: {
    async createUser(
      _parent: any,
      args: {
        username: string;
        password: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
      },
      context: Context
    ) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(args.password, salt);
        return await context.prisma.user.create({
          data: {
            username: args.username,
            password: hashedPassword,
            email: args.email,
            firstname: args.firstName,
            lastname: args.lastName,
            phone: args.phone,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    async login(
      _parent: any,
      args: { username: string; password: string },
      context: Context
    ) {
      const user = await context.prisma.user.findUnique({
        where: { username: args.username },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }
      const accessToken = createAccessToken(user);
      sendRefreshToken(context.res, createRefreshToken(user));
      sendAccessToken(context.res, accessToken);
      console.log(user.username);
      return { user: user, token: accessToken };
    },
    async logout(_: any, __: any, ctx: Context) {
      clearCookies(ctx.res);
    },
  },
};
export default resolvers;
