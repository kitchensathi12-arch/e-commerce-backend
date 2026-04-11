import { NextFunction, Request, Response } from "express";

export const Validator = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      await Promise.resolve(schema.validate(data, { abortEarly: false }));
      // console.log("out of this file")
      next();
    } catch (err: any) {
      console.log(err)
      if (err.inner) {
        const errors = err.inner.map((e: any) => ({
          path: e.path,
          message: e.message,
        }));
        return res.status(400).json({ errors });
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };
};