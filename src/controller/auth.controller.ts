import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import crypto from "crypto";
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { OAuth2Client } from "google-auth-library";
import { BadRequestError, IAuthDocument, lowerCase, NotFoundError } from '@kitchensathi12-arch/ecommerce-types';

// ~ ------------------- local imports start here ---------------------------------
import { config } from '@/config';
import { emailTemplate } from '@/helper/email.transport';
import { createUser, findUserByEmail, findUserByEmailOrUsername, findUserByEmailVerificationToken, findUserById, findUserByIdWithPassword, updateUserById } from '@/services/user.service';
import { AsyncHandler } from '@/utils/AsyncHandler';
import { generateOTP } from '@/utils/otpGenerator';

// **************************************
// ~ Register user method start here.
// **************************************
export const registerUser = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, username, password, phone, role, full_name } = req.body;
  const exist = await findUserByEmailOrUsername(lowerCase(email), lowerCase(username));
  if (exist) {
    throw new BadRequestError('User with this email or username already exist', 'RegisterUser() method error');
  }

  // const profile_public_id = uuidv4();

  // const image = await uploadImage(profile_picture, `${profile_public_id}`, true, true) as UploadApiResponse;

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
  const randomCharacters: string = randomBytes.toString('hex');

  const userData = {
    full_name,
    email,
    username,
    role,
    phone,
    password,
    email_verification_token: randomCharacters
  } as IAuthDocument


  const result: IAuthDocument = await createUser(userData);


  const token = sign({ id: result._id, email: result.email, username: result.username }, config.JWT_SECRET!);

  const clientUrl = config.NODE_ENV === "development" ? config.LOCAL_CLIENT_URL : config.CLIENT_URL;

  const verificationLink = `${clientUrl}/confirm_email?v_token=${result.email_verification_token}`

  await emailTemplate('verify-email', result.email as string, {
    userName: result.username,
    verificationLink,
    expiryHours: '24',
    companyName: 'Kitchen Shati',
    websiteUrl: 'https://yourwebsite.com',
    supportEmail: config.EMAIL_USER,
    privacyUrl: `${clientUrl}/privacy` || '#'
  });

  // res.cookie('AT_JWT', token, {
  //   httpOnly: true,
  //   secure: config.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  // });

  req.session = { jwt: token }

  res.status(StatusCodes.CREATED).json({ result, token, success: true });



});


// **************************************
// ~ Login user method start here.
// **************************************
export const loginUser = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const getUser = await findUserByEmailOrUsername(username, username);

  if (!getUser) {
    throw new BadRequestError('Invalid credentials', 'LoginUser() method error');
  }

  const isPasswordValid = await bcrypt.compare(password, getUser.password!);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials', 'LoginUser() method error');
  }

  const token = sign({ id: getUser._id, email: getUser.email, username: getUser.username }, config.JWT_SECRET!);

  // res.cookie('AT_SEC', token, {
  //   httpOnly: true,
  //   secure: config.NODE_ENV !== 'development',
  //   sameSite: 'none',
  //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  // });

  req.session = { jwt: token }
  getUser.password = undefined;
  getUser.profile_public_id = undefined;
  getUser.verified = undefined;
  getUser.email_verification_token = undefined;

  res.status(StatusCodes.OK).json({ user: getUser, token, success: true });
});


// **************************************
// ~ get logged In user method start here.
// * get logged in use method main role to authenticate user after login give the 200 ok response.
// **************************************
export const getLoggedInUser = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await findUserById(req.currentUser!.id as unknown as Types.ObjectId) as IAuthDocument;
  res.status(StatusCodes.OK).json({ user: user, success: true });
});

// **************************************
// ~ verify email method start here.
// * verify email main use after register user so we send 
// * a mail to check the user will register with valid id.
// **************************************
export const verifyEmail = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  const checkIfUserExist = await findUserByEmailVerificationToken(token);
  if (!checkIfUserExist) {
    throw new BadRequestError('Verification token is either invalid or is already used.', 'VerifyEmail() method error');
  };

  await updateUserById(checkIfUserExist._id, { verified: true, email_verification_token: "" } as IAuthDocument);

  const updatedUser = await findUserById(checkIfUserExist._id)
  res.status(StatusCodes.OK).json({
    message: "Email verified successfully.",
    user: updatedUser
  })

});


// **************************************
// ~ resend otp method start here.
// **************************************
export const resendOtp = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) throw new NotFoundError('User not found', 'resend OTP');
  if (user.verified) {
    res.status(400).json({ message: 'Email already verified' });
    return;
  }
  const newOtp = generateOTP();
  // ⏳ Set expiry (10 minutes from now)
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = newOtp;
  user.otp_expiry = expiry;
  await (user as { save: () => Promise<any> }).save();
  await emailTemplate('verify-email', user.email as string, {
    userName: user.username,
    otp: newOtp,
    expiryMinutes: '10',
    companyName: 'E-commerce',
    websiteUrl: 'https://yourwebsite.com',
    supportEmail: 'support@yourcompany.com',
    privacyUrl: 'https://yourwebsite.com/privacy'
  });
  res.status(200).json({ message: 'OTP resent successfully' });
});

// **************************************
// ~ logout user method start here
// **************************************
export const logout = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = req.currentUser;
  if (!user) {
    throw new BadRequestError("Invalid creadintial and User", "logout() method error");
  };
  req.session = null;
  res.status(StatusCodes.OK).json({
    message: "User logout successfully"
  })
});

// **************************************
// ~ login with google method start here
// **************************************
export const loginWithGoogle = AsyncHandler(async (req: Request, res: Response) => {

  const { credential, client_id } = req.body;
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: client_id,
  });

  const payload = ticket.getPayload();
  const all = ticket.getAttributes();

  res.status(StatusCodes.OK).json({ payload, all })
});

// **************************************
// ~ change password method start here
// **************************************
export const changePassword = AsyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.currentUser!.id as unknown as Types.ObjectId;
  const user = await findUserByIdWithPassword(userId);
  console.log(user)
  if (!user) {
    throw new NotFoundError('User not found', 'changePassword() method error');
  }
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password!);
  if (!isPasswordValid) {
    throw new BadRequestError('Current password is incorrect', 'changePassword() method error');
  }
  user.password = newPassword;
  await user.save();
  const token = sign({ id: user._id, email: user.email, username: user.username }, config.JWT_SECRET!);
  req.session = { jwt: token }
  user.password = undefined;
  user.profile_public_id = undefined;
  user.verified = undefined;
  user.email_verification_token = undefined;
  res.status(StatusCodes.OK).json({ user, token, success: true });
});






