import http from 'http';
import express, { Application, NextFunction, Request, Response } from 'express';
import { winstonLogger } from '@/utils/logger';
import cors from "cors";
import { config } from '@/config';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { RootRouter } from './routes';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '@kitchensathi12-arch/ecommerce-types';
import cookieSession from "cookie-session";

const SERVER_PORT = 4000;

const logger = winstonLogger('Server file', 'debug');

export const start = (app: Application): void => {
    slanderedMiddleware(app);
    routesHandler(app);
    errorHandler(app);
    startServer(app);
};

function slanderedMiddleware(app: Application): void {
    app.set('trust proxy', 1); 
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    app.use(cors({
        origin: config.NODE_ENV === "development" ? config.LOCAL_CLIENT_URL : config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }));
    app.use(cookieSession({
        name: "session",
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 3600000,
        sameSite: "lax",
        secure: config.NODE_ENV !== "development",
    }));
    app.use(cookieParser());
    app.use(compression());
}

function routesHandler(app: Application): void {
    app.get("/health", (_req: Request, res: Response) => res.send("server is healthy and okay"));
    app.use("/api/v1", RootRouter())

};

function errorHandler(app: Application): void {
    app.use("/", (req: Request, res: Response, _next: NextFunction) => {
        {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            logger.error(`Route not found: ${fullUrl}`);
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'Route not found',
                url: fullUrl
            });
        }
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof CustomError) {
            logger.error(err.message, err);
            res.status(err.statusCodes).json(err.serializeError());
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message || "Something went wrong",
                stack: err.stack,
                err:err

            });
        };

        // next();
    });
}

function startServer(app: Application): void {
    const server: http.Server = new http.Server(app);
    server.listen(SERVER_PORT, () => {
        logger.info(`Server is running on port ${SERVER_PORT}`);
    });
}
