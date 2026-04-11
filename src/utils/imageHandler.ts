import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";


export const uploadImage = async (file: string, public_id?: string, overwrite?: boolean, invalidate?: boolean): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file,
            { public_id, overwrite, invalidate, resource_type: 'auto' },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) resolve(error);
                resolve(result);
            })
    })
}
