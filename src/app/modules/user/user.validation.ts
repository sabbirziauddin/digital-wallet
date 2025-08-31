import { email } from './../../../../node_modules/zod/src/v4/core/regexes';
import  z  from 'zod';
import { Role, Status } from './user.interface';

const authProviderSchema = z.object({
    provider: z.string(),
    providerId: z.string(),
});

export const createZodUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().trim().min(6, 'Password must be at least 6 characters long').optional(),
    role: z.nativeEnum(Role).default(Role.USER).optional(),
    status: z.nativeEnum(Status).default(Status.ACTIVE).optional(),
    isDeleted: z.boolean().default(false).optional(),
    isVerified: z.boolean().default(false).optional(),
    auths: z.array(authProviderSchema).default([]).optional(),
});

export const updateUserValidationSchema = createZodUserSchema.partial();

export const UserValidation = {
    createZodUserSchema,
    updateUserValidationSchema,
};
