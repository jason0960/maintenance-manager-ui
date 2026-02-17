import api from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
  CompanyResponse,
  CompanyRequest,
  PropertyResponse,
  PropertyRequest,
  UnitRequest,
  UnitResponse,
  WorkOrderResponse,
  WorkOrderRequest,
  WorkOrderUpdateRequest,
  InvoiceResponse,
  InvoiceRequest,
  InvoiceUpdateRequest,
} from '@/types';

// ==================== AUTH ====================

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  me: () =>
    api.get<UserResponse>('/auth/me').then((r) => r.data),
};

// ==================== COMPANIES ====================

export const companiesApi = {
  list: () =>
    api.get<CompanyResponse[]>('/companies').then((r) => r.data),

  get: (id: number) =>
    api.get<CompanyResponse>(`/companies/${id}`).then((r) => r.data),

  create: (data: CompanyRequest) =>
    api.post<CompanyResponse>('/companies', data).then((r) => r.data),

  update: (id: number, data: CompanyRequest) =>
    api.put<CompanyResponse>(`/companies/${id}`, data).then((r) => r.data),
};

// ==================== PROPERTIES ====================

export const propertiesApi = {
  list: () =>
    api.get<PropertyResponse[]>('/properties').then((r) => r.data),

  get: (id: number) =>
    api.get<PropertyResponse>(`/properties/${id}`).then((r) => r.data),

  create: (data: PropertyRequest) =>
    api.post<PropertyResponse>('/properties', data).then((r) => r.data),

  update: (id: number, data: PropertyRequest) =>
    api.put<PropertyResponse>(`/properties/${id}`, data).then((r) => r.data),

  addUnit: (propertyId: number, data: UnitRequest) =>
    api.post<UnitResponse>(`/properties/${propertyId}/units`, data).then((r) => r.data),
};

// ==================== WORK ORDERS ====================

export const workOrdersApi = {
  list: () =>
    api.get<WorkOrderResponse[]>('/work-orders').then((r) => r.data),

  get: (id: number) =>
    api.get<WorkOrderResponse>(`/work-orders/${id}`).then((r) => r.data),

  create: (data: WorkOrderRequest) =>
    api.post<WorkOrderResponse>('/work-orders', data).then((r) => r.data),

  update: (id: number, data: WorkOrderUpdateRequest) =>
    api.patch<WorkOrderResponse>(`/work-orders/${id}`, data).then((r) => r.data),
};

// ==================== USERS ====================

export const usersApi = {
  listByRole: (role: string) =>
    api.get<UserResponse[]>(`/users?role=${role}`).then((r) => r.data),
};

// ==================== INVOICES ====================

export const invoicesApi = {
  list: () =>
    api.get<InvoiceResponse[]>('/invoices').then((r) => r.data),

  get: (id: number) =>
    api.get<InvoiceResponse>(`/invoices/${id}`).then((r) => r.data),

  create: (data: InvoiceRequest) =>
    api.post<InvoiceResponse>('/invoices', data).then((r) => r.data),

  update: (id: number, data: InvoiceUpdateRequest) =>
    api.patch<InvoiceResponse>(`/invoices/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/invoices/${id}`).then((r) => r.data),
};

// ==================== PAYMENTS ====================

export const paymentsApi = {
  createCheckout: (invoiceId: number) =>
    api.post<{ checkoutUrl: string }>(`/payments/checkout/${invoiceId}`).then((r) => r.data),
};
