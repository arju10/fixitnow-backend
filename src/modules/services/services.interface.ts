export interface IService {
  id: string;
  title: string;
  description: string | null;
  price: number;
  durationMins: number;
  categoryId: string;
  technicianId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceWithDetails extends IService {
  category: {
    id: string;
    name: string;
  };
  technician: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  };
}

export interface IServiceService {
  getAllServices(filters?: any): Promise<IServiceWithDetails[]>;
  getServiceById(serviceId: string): Promise<IServiceWithDetails>;
  getServicesByTechnician(technicianId: string): Promise<IService[]>;
  createService(technicianId: string, input: any): Promise<IServiceWithDetails>;
  updateService(serviceId: string, input: any): Promise<IServiceWithDetails>;
  deleteService(serviceId: string): Promise<void>;
}
