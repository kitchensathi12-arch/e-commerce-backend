import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

class Config {
  public NODE_ENV: string;
  public JWT_SECRET: string;
  public MONDODB_URI: string;
  public CLIENT_URL: string;
  public LOCAL_CLIENT_URL: string;
  public EMAIL_USER: string;
  public EMAIL_PASSWORD: string;
  public SECRET_KEY_ONE: string;
  public SECRET_KEY_TWO: string;
  public GOOGLE_API_KEY: string;
  public GOOGLE_API_SECRET: string;
  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.MONDODB_URI = process.env.MONDODB_URI || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.LOCAL_CLIENT_URL = process.env.LOCAL_CLIENT_URL || '';
    this.EMAIL_USER = process.env.EMAIL_USER || '';
    this.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
    this.GOOGLE_API_SECRET = process.env.GOOGLE_API_SECRET || '';

  }

  public cloudinaryConfig():void{
    cloudinary.v2.config({
      cloud_name:process.env.CLOUD_NAME ,
      api_key:process.env.CLOUD_API_KEY,
      api_secret:process.env.CLOUD_API_SECRET
    })
  }

}

export const config: Config = new Config();
