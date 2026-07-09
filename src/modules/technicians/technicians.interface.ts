export interface ITechnicianProfile {
  id: string;
  userId: string;
  bio: string | null;
  experienceYrs: number;
  location: string | null;
  avgRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITechnicianProfileWithUser extends ITechnicianProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
  };
}

export interface IAvailabilitySlot {
  id: string;
  technicianId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ITechnicianService {
  getTechnicianProfile(userId: string): Promise<ITechnicianProfileWithUser>;
  getAllTechnicians(filters?: any): Promise<ITechnicianProfileWithUser[]>;
  updateTechnicianProfile(userId: string, input: any): Promise<ITechnicianProfileWithUser>;
  addAvailabilitySlot(userId: string, input: any): Promise<IAvailabilitySlot>;
  getAvailabilitySlots(userId: string): Promise<IAvailabilitySlot[]>;
  removeAvailabilitySlot(slotId: string, userId: string): Promise<void>;
}
