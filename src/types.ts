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

// Definizione dell'interfaccia Product condivisa tra i componenti
export interface Product {
  id: string | number;
  name: string;
  price: number;
  customerPrice?: number;
  quantity?: number;
  category?: string;
  description?: string;
  ratePlan?: RatePlan;
  charges?: Charge[];
  [key: string]: any;
}

// Altre interfacce comuni
export interface RatePlan {
  name: string;
  [key: string]: any;
}

export interface Charge {
  name: string;
  value: string | number;
  calculatedPrice: number;
}