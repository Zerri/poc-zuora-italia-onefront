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