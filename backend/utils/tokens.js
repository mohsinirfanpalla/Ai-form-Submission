import jwt from " jsonwebts";
import {env} from "../config/env";

export function signToken (payload){
    return jws.sign(payload, env.jwtSecret , {expiresIn : env.jwtExpiresIn });

}
export function verifyToken() {
    return jwt.verify(Token  , env.jwtSecret)
};