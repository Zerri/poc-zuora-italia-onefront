import type { User } from './types/user';

export * from './types/generic';
export * from './types/user';
export * from './types/grid';

export type Role = 'admin' | 'sales' | 'touchpoint';

export type TagType = 
  | "success" 
  | "error" 
  | "info" 
  | "warning" 
  | "tone1" 
  | "tone2" 
  | "tone3" 
  | "tone4" 
  | "tone5" 
  | "tone6" 
  | "tone7" 
  | "tone8" 
  | "blueSapphire" 
  | "islamicGreen" 
  | "russianViolet" 
  | "maximumPurple" 
  | undefined;

export type TagVariant = 'filter' | 'duotone' | 'filled';

// Altre definizioni di tipi utili
export type ViewMode = 'cards' | 'grid';
export type CategoryFilter = 'tutti' | string;

export interface Pricing {
  currency?: string;
  price?: number;
  tiers?: {
    startingUnit: number;
    endingUnit: number;
    price: number;
    priceFormat?: string;
  }[];
}

export interface ExtendedCharge extends Charge {
  id: string | number;
  model: string;
  pricing?: Pricing[];
  defaultQuantity?: string | number;
  type: string;
  calculatedPrice?: number;
  billingPeriod?: string;
  billingTiming?: string;
  billingPeriodAlignment?: string;
  priceFormat?: string;
  billingDay?: string;
  uom?: string;
}

// Definizione dell'interfaccia Product condivisa tra i componenti
export interface Product {
  id: string | number;
  name: string;
  price?: number;
  customerPrice?: number;
  quantity?: number;
  categoria?: string; // Nota: mantenuto 'categoria' per compatibilità
  category?: string;
  description?: string;
  ratePlan?: RatePlan;
  charges?: Charge[];
  productRatePlans?: RatePlan[];
  replacesProductId?: string;
  [key: string]: any;
}

// Altre interfacce comuni
export interface RatePlan {
  id: string | number;
  name: string;
  description?: string;
  productRatePlanCharges: Charge[];
  [key: string]: any;
}

export interface ExtendedRatePlan extends RatePlan {
  id: string | number;
  Infrastructure__c?: string;
  productRatePlanCharges: ExtendedCharge[];
  status?: string;
  ModalitaDiVendita__c?: string;
  UdM__c?: string;
}

export interface Charge {
  id: string | number;
  name: string;
  type: string;
  model: string;
  value?: string | number;
  calculatedPrice?: number;
}

export interface ProductToAdd {
  id: string | number;
  name: string;
  price: number;
  customerPrice: number;
  quantity: number;
  category?: string;
  description?: string;
  ratePlan: {
    id: string | number;
    name: string;
    description: string;
  };
  charges: {
    id: string | number;
    name: string;
    type: string;
    model: string;
    value: number;
    calculatedPrice: number;
  }[];
}

export interface Quote {
  id: string | number;
  number: string;
  products: ProductToAdd[];
}

export interface DrawerData {
  product: Product;
  selectedRatePlan: RatePlan;
  totalPrice?: number;
  customerPrice?: number;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface MigrationPath {
  id: string;
  title: string;
  description: string;
  totalValue: number;
  percentChange?: string;
  benefits?: string[];
  products?: Product[];
}

// User Management Types
export type UserRole = 'Administrator' | 'User' | 'Moderator';
export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface UserFormData {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserFilters {
  status: string; // 'All' | UserStatus
  role: string;   // 'All' | UserRole  
  searchTerm: string;
}

export interface UserMutationData {
  id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// User Actions Types
export type UserAction = 'edit' | 'delete' | 'changeStatus' | 'options';

export interface UserActionEvent {
  action: UserAction;
  user: User;
}