import type { Request, Response } from 'express';
import type { CreatePaymentInput } from './payments.validation';
export interface IPayment {
    id: string;
    bookingId: string;
    userId: string;
    transactionId: string;
    amount: number;
    method: string;
    provider: string;
    status: string;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPaymentWithDetails extends IPayment {
    booking: {
        id: string;
        customer: {
            id: string;
            name: string;
            email: string;
        };
        service: {
            id: string;
            title: string;
            price: number;
        };
        technician: {
            id: string;
            user: {
                id: string;
                name: string;
                email: string;
            };
        };
    };
}
export interface IPaymentService {
    createPayment(userId: string, input: CreatePaymentInput): Promise<{
        payment: IPayment;
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string): Promise<IPaymentWithDetails>;
    getPaymentHistory(userId: string): Promise<IPaymentWithDetails[]>;
    getPaymentById(paymentId: string, userId: string): Promise<IPaymentWithDetails>;
    handleStripeWebhook(event: any): Promise<void>;
}
export interface IPaymentController {
    createPayment: (req: Request, res: Response) => Promise<void>;
    confirmPayment: (req: Request, res: Response) => Promise<void>;
    getPaymentHistory: (req: Request, res: Response) => Promise<void>;
    getPaymentById: (req: Request, res: Response) => Promise<void>;
    webhook: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=payments.interface.d.ts.map