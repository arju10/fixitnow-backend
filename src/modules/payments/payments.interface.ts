import { PaymentStatus, PaymentProvider } from '@prisma/client';

export interface IPayment {
  id: string;
  bookingId: string;
  userId: string;
  transactionId: string;
  amount: number;
  method: string;
  provider: PaymentProvider;
  providerTransactionId: string;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentWithRelations extends IPayment {
  booking: {
    id: string;
    scheduledAt: Date;
    totalAmount: number;
    status: string;
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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ICreatePaymentInput {
  bookingId: string;
  provider: PaymentProvider;
}

export interface IConfirmPaymentInput {
  transactionId: string;
}
