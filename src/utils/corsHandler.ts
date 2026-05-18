import { config } from "@/config"
import { CorsOptions } from "cors";

const corsHandler = () => {
    switch (config.NODE_ENV) {
        case "development":
            return config.LOCAL_CLIENT_URL;
        case "production":
            return config.CLIENT_URL.split(",").map(url => url.trim());
        case "stg":
            return config.STG_CLIENT_URL.split(",").map(url => url.trim());
        default:
            return config.LOCAL_CLIENT_URL;
    }
};


console.log(corsHandler());


export const corsOptions:CorsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin || corsHandler().includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

