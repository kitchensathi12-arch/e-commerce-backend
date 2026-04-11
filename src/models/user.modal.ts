import { IAuthDocument } from "@kitchensathi12-arch/ecommerce-types";
import { Model, Schema,model} from "mongoose";
import bcrypt from "bcrypt";


const userSchema:Schema = new Schema<IAuthDocument>({
    full_name: {type:String,required:true},
    email: {type:String,required:true},
    phone: {type:String,required:true},
    password: {type:String,required:true},
    username: {type:String,required:true},
    role: {type:String,required:true,enum:["admin","user"],default:"user"},
    profile_picture: {type:String},
    profile_public_id:{type:String},
    otp: {type:String},
    otp_expiry: {type:Date},
    verified: {type:Boolean,default:false},
    email_verification_token:{type:String},
    password_reset_token:{type:String},
    password_reset_expiry:{type:Date}
},{
    timestamps:true
});

userSchema.index({email:1},{unique:true});
userSchema.index({username:1},{unique:true});
userSchema.index({email_verification_token:1},{unique:true});

userSchema.pre("save", async function(){
    const user = this;
    if(!this.isModified("password"))return;
    const salt:string = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password as string,salt);
    this.password = hash;
});

userSchema.pre("findOneAndUpdate",async function(){
    const update:any = this.getUpdate();
    if(update.password){
        const salt:string = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(update.password,salt);
        this.setUpdate({ ...update, password: hash });
    }
});

export const UserModel:Model<IAuthDocument> = model<IAuthDocument>("User",userSchema);

