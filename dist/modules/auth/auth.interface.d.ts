import { Role } from '@prisma/client';
export interface IRegisterInput {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: Role;
}
export interface ILoginInput {
    email: string;
    password: string;
}
export interface IJwtPayload {
    userId: string;
    email: string;
    role: Role;
}
//# sourceMappingURL=auth.interface.d.ts.map