import { config } from '@/config';
import { winstonLogger } from '@/utils/logger';
import Email from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';


const logger = winstonLogger('email transport', 'debug');

export const emailTemplate = async (template:string,reciverEmail:string,locals?:any):Promise<void> => {
try {
        
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD,
        },
    });
    
    const email = new Email({
        message: {
            from: `E-commerce <${config.EMAIL_USER}>`
        },
        send: true,
        preview: false, // Development mein true kar sakte ho preview dekhne ke liye
        transport: transporter,
        views: {
            options: {
                extension: 'ejs'
            }
        },
        juice: true,
        juiceResources: {
            preserveImportant: true,
            webResources: {
                relativeTo: path.join(__dirname,"../",'../build')
            }
        }
    });

    await email.send({
        template: path.join(__dirname,"../","templates",template),
        message:{
            to:reciverEmail
        },
        locals
    })

    logger.info(`Email sent successfully to ${reciverEmail} using template ${template}`);
} catch (error) {
    logger.error("Error setting up email transport:", error);
}



}