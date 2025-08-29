import jwt from "jsonwebtoken";
import {ENV} from "../config/env";

import type { SignOptions } from "jsonwebtoken";

export function signJwt(payload: object, expiresIn: SignOptions["expiresIn"] = "7d") {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token:string):T{
    return jwt.verify(token,ENV.JWT_SECRET) as T;
}