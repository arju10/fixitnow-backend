import type { Request, Response } from 'express';
import type { UpdateCustomerProfileInput } from './customer.validation';
export interface ICustomerProfile {
    id: string;
    userId: string;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICustomerWithUser extends ICustomerProfile {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        profileImage: string | null;
    };
}
export interface ICustomerService {
    getCustomerProfile(userId: string): Promise<ICustomerWithUser>;
    updateCustomerProfile(userId: string, input: UpdateCustomerProfileInput): Promise<ICustomerWithUser>;
    getCustomerBookings(userId: string): Promise<any[]>;
}
export interface ICustomerController {
    getMyProfile: (req: Request, res: Response) => Promise<void>;
    updateMyProfile: (req: Request, res: Response) => Promise<void>;
    getMyBookings: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=customer.interface.d.ts.map