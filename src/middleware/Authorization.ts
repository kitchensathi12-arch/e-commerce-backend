import { config } from "@/config";
import { NotAuthorizedError,IAuthPayload} from "@kitchensathi12-arch/ecommerce-types";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = async (req: Request, _res: Response, next: NextFunction):Promise<void> => {
    const accessToken = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    
    if (!accessToken) {
        throw new NotAuthorizedError("Access token is missing", "authMiddleware() method error");
    }

    try {
        const decoded = jwt.verify(accessToken, config.JWT_SECRET!) as IAuthPayload;
        req.currentUser = decoded;
        next();
    } catch (error) {
        next(new NotAuthorizedError("Invalid access token", "authMiddleware() method error"));
    }

}