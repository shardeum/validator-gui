import express, { Request, Response, NextFunction, response } from "express";
import { execFile } from "child_process";
import { cliStderrResponse, unautorizedResponse } from "./handlers/util";
import * as crypto from "@shardus/crypto-utils";
import rateLimit from "express-rate-limit";
const yaml = require("js-yaml");
const jwt = require("jsonwebtoken");

function isValidSecret(secret: unknown) {
  return typeof secret === "string" && secret.length >= 32;
}

function generateRandomSecret() {
  return Buffer.from(crypto.randomBytes(32)).toString("hex");
}

const jwtSecret = isValidSecret(process.env.JWT_SECRET)
  ? process.env.JWT_SECRET
  : generateRandomSecret();
crypto.init("64f152869ca2d473e4ba64ab53f49ccdb2edae22da192c126850970e788af347");

const MAX_CONCURRENT_EXEC = 1;
let currentExecCount = 0;
export const loginHandler = async (req: Request, res: Response) => {
  if (currentExecCount >= MAX_CONCURRENT_EXEC) {
    res
      .status(429)
      .send({ error: "Server is too busy. Please try again later." });
    return;
  }
  const password = req.body && req.body.password;
  const hashedPass = crypto.hash(password);
  const ip = String(req.socket.remoteAddress);

  // Exec the CLI validator login command
  execFile(
    "operator-cli",
    ["gui", "login", hashedPass, ip],
    (err, stdout, stderr) => {
      currentExecCount--;
      if (err) {
        cliStderrResponse(res, "Unable to check login", err.message);
        return;
      }
      if (stderr) {
        cliStderrResponse(res, "Unable to check login", stderr);
        return;
      }

      const cliResponse = yaml.load(stdout);
      if (cliResponse.login === "blocked") {
        res.status(403).json({ errorMessage: "Blocked" });
        // Set a timeout to unlock the IP after 30 minutes
        setTimeout( () => {
          execFile(
            "operator-cli",
            ["gui", "unlock", ip],
            (err, stdout, stderr) => {
              console.log("executing operator-cli gui unlock");
              if (err) {
                console.error("Unable to unlock IP", err.message);
              } else if (stderr) {
                console.error("Unable to unlock IP", stderr);
              } else {
                console.log("IP unlocked successfully");
              }
            }
          );
        }, 30 * 60 * 1000); // 30 minutes in milliseconds

        return;
      }
      if (cliResponse.login !== "authorized") {
        unautorizedResponse(req, res);
        return;
      }
      const accessToken = jwt.sign(
        { nodeId: "" /** add unique node id  */ },
        jwtSecret,
        { expiresIn: "8h" }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.send({ status: "ok" });
    }
  );
  console.log("executing operator-cli gui login...");
};

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.send({ status: "ok" });
};

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1500, // Limit each IP to 1500 requests per windowMs
  message: "Too many requests from this IP, please try again after 10 minutes",
});
export const checkIpHandler = (req:Request,res:Response) =>{
  const ip = String(req.socket.remoteAddress);
// Exec the CLI validator check-ip command
execFile(
  "operator-cli",
  ["gui", "ipStatus", ip],
  (err, stdout, stderr) => {
    currentExecCount--;
    if (err) {
      cliStderrResponse(res, "Unable to check ip", err.message);
      return;
    }
    if (stderr) {
      cliStderrResponse(res, "Unable to check ip", stderr);
      return;
    }

    const cliResponse = yaml.load(stdout);
    if(cliResponse.status === "blocked"){
      res.status(200).json({ip: "blocked"})
    }
    else{
      res.status(200).json({ip: "unblocked"})
    }
  }
);
console.log("executing operator-cli gui ipStatus");
}
export const httpBodyLimiter = express.json({ limit: "100kb" });

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    unautorizedResponse(req, res);
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, jwtData: any) => {
    if (err) {
      // invalid token
      unautorizedResponse(req, res);
      return;
    }

    next();
  });
};
