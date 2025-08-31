import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, Role, Status } from "./user.interface";
const authProviderSchema = new Schema({
    provider: { type: String, required: true, trim: true },
    providerId: { type: String, required: true, trim: true },
}, {
    _id: false,
    versionKey: false
})
const userSchema = new Schema<IUser>({
    name: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: false, trim: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: { type: [authProviderSchema], required: false, default: [] },
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },

}, {
    timestamps: true,
    versionKey: false
})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


export const User = model<IUser>('User', userSchema)