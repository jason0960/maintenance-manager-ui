// ==================== ENUMS ====================

export const ROLES = ['ADMIN', 'PROPERTY_MANAGER', 'TECH'] as const;
export type Role = typeof ROLES[number];

export const WORK_ORDER_CATEGORIES = ['PLUMBING', 'ELECTRICAL', 'HVAC', 'APPLIANCE', 'PAINTING', 'GENERAL'] as const;
export type WorkOrderCategory = typeof WORK_ORDER_CATEGORIES[number];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'] as const;
export type Priority = typeof PRIORITIES[number];

export const WORK_ORDER_STATUSES = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type WorkOrderStatus = typeof WORK_ORDER_STATUSES[number];

export const INVOICE_STATUSES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

// ==================== RESPONSES ====================

export interface UserResponse {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone: string | null;
  companyId: number;
  companyName: string;
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface CompanyResponse {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  active: boolean;
  createdAt: string;
}

export interface UnitResponse {
  id: number;
  propertyId: number;
  unitNumber: string;
  createdAt: string;
}

export interface PropertyResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  managerId: number;
  companyId: number;
  units: UnitResponse[];
  createdAt: string;
}

export interface WorkOrderResponse {
  id: number;
  submittedById: number;
  submittedByName: string;
  unitId: number;
  unitNumber: string;
  propertyId: number;
  propertyName: string;
  title: string;
  description: string | null;
  category: WorkOrderCategory;
  priority: Priority;
  status: WorkOrderStatus;
  assignedToId: number | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

// ==================== REQUESTS ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  companyId: number;
}

export interface CompanyRequest {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface PropertyRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface UnitRequest {
  unitNumber: string;
}

export interface WorkOrderRequest {
  propertyId: number;
  unitId: number;
  title: string;
  description?: string;
  category: WorkOrderCategory;
  priority: Priority;
}

export interface WorkOrderUpdateRequest {
  status?: WorkOrderStatus;
  assignedToId?: number;
}

// ==================== INVOICE TYPES ====================

export interface InvoiceLineItemResponse {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  workOrderId: number;
  workOrderTitle: string;
  propertyId: number;
  propertyName: string;
  unitNumber: string;
  companyId: number;
  companyName: string;
  createdById: number;
  createdByName: string;
  status: InvoiceStatus;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  dueDate: string;
  paidAt: string | null;
  lineItems: InvoiceLineItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceRequest {
  workOrderId: number;
  lineItems: InvoiceLineItemRequest[];
  taxRate?: number;
  notes?: string;
  dueDate: string;
}

export interface InvoiceUpdateRequest {
  status?: InvoiceStatus;
  notes?: string;
  dueDate?: string;
  taxRate?: number;
  lineItems?: InvoiceLineItemRequest[];
}

// ==================== BADGE COLOR MAPS ====================

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  EMERGENCY: 'bg-red-100 text-red-800',
};

export const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-800',
  ASSIGNED: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

// ==================== DISPLAY LABELS ====================

export const CATEGORY_LABELS: Record<WorkOrderCategory, string> = {
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  HVAC: 'HVAC',
  APPLIANCE: 'Appliance',
  PAINTING: 'Painting',
  GENERAL: 'General',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  EMERGENCY: 'Emergency',
};

export const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  PROPERTY_MANAGER: 'Property Manager',
  TECH: 'Technician',
};

// ==================== INVOICE DISPLAY MAPS ====================

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
};
