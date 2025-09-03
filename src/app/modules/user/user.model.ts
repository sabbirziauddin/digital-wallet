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
    password: { type: String, required: false, trim: true, select: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: { type: [authProviderSchema], required: false, default: [] },

}, {
    timestamps: true,
    versionKey: false
})
userSchema.pre("save", async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password") || !this.password) return next();

    // If password is a bcrypt hash, don't hash it again
    // Bcrypt hashes start with $2a$, $2b$, or $2y$
    const isHashed = /^\$2[aby]\$/.test(this.password);
    if (isHashed) {
        return next();
    }

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);

    next();
});
userSchema.methods.isPasswordMatched = async function (plainPassword: any) {
    return await bcrypt.compare(plainPassword, this.password);
};


export const User = model<IUser>('User', userSchema)