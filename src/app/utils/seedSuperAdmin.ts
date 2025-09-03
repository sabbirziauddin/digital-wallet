import  bcrypt  from 'bcryptjs';
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IAuthType, IUser, Role } from '../modules/user/user.interface';

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExists) {
            console.log("Super Admin already exists.");
            return;
        }
        console.log("Trying to create Seeding Super Admin...");
        const hashedPassword = await bcrypt.hash(
            envVars.SUPER_ADMIN_PASSWORD,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        );
        const authProvider: IAuthType = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL,
        };
        const payload: IUser = {
            name: "Super_Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auths: [authProvider],
            isPasswordMatched: async function (password: string): Promise<boolean> {
                // Dummy implementation for seeding, actual logic should be in the model
                return Promise.resolve(true);
            }
        };
        const superAdmin = await User.create(payload)
        console.log(`Super Admin created with email: ${superAdmin.email}\n`);
        console.log(superAdmin);

    } catch (error) {
        console.error("Error seeding super admin:", error);

    }
}