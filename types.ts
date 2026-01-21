
export enum UserRole {
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  BROKER = 'BROKER',
  CLERK = 'CLERK',
  ACCOUNTANT = 'ACCOUNTANT'
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  SOLD = 'SOLD',
  RESERVED = 'RESERVED'
}

export enum PropertyType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  LAND = 'LAND'
}

export enum DealType {
  RENT = 'RENT',
  SALE = 'SALE',
  BOTH = 'BOTH'
}

export interface Client {
  id: string;
  name: string;
  document: string; // CPF/CNPJ
  email: string;
  phone: string;
  role: 'OWNER' | 'TENANT' | 'BUYER' | 'SELLER' | 'GUARANTOR';
  address: string;
}

export interface FinancialSettings {
  discountRate: number;        // Ex: 0.10 para 10%
  fineRate: number;            // Ex: 0.02 para 2%
  monthlyInterestRate: number; // Ex: 0.01 para 1%
  gracePeriod: number;         // Dias de carência antes da multa
}

export interface MercadoPagoSettings {
  publicKey: string;
  accessToken: string;
  isSandbox: boolean;
  webhookBaseUrl: string;
}

export interface InvoiceDetail {
  originalValue: number; // Valor Nominal (Cheio)
  discount: number;      // Valor do Desconto de Pontualidade
  dueDate: string;
  fine: number;          // Multa
  interest: number;       // Juros
  totalValue: number;
  daysOverdue: number;
  isOverdue: boolean;
}

export interface PaymentNotification {
  id: string;
  clientName: string;
  propertyCode: string;
  amount: number;
  timestamp: string;
  type: 'PIX' | 'BOLETO' | 'TRANSFER';
}
