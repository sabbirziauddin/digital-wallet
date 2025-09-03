import { Token } from './../../../node_modules/path-to-regexp/dist/index.d';
import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateJwtToken = (payload: JwtPayload, secret: string, expiresIn: string | number) => {
    const accessToken = Jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return accessToken;
}

export const verifyJwtToken = (Token:string,secret:string)=>{
    const verifyToken = Jwt.verify(Token,secret) as JwtPayload;
    return verifyToken;

}   