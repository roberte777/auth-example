import { sign } from "jsonwebtoken";

export const createAccessToken = (user: any) => {
  return sign({ userId: user.username }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: any) => {
  return sign(
    { userId: user.username, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    path: "/",
  });
};
export const sendAccessToken = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    path: "/",
  });
};
