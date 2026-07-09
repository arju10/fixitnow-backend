export interface JwtPayload {
    userId: string;
    role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
}
export declare const signToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map