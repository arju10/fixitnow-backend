export interface IAdminProfile {
  id: string;
  userId: string;
  department: string | null;
  position: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminWithUser extends IAdminProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
  };
}
