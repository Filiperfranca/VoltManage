export type OSStatus = 
  | 'ANALYSIS' // Em Análise
  | 'BUDGETED' // Orçado - A Confirmar
  | 'APPROVED' // Orçado - Em Produção
  | 'WAITING_PARTS' // Aguardando Peça
  | 'FINISHED' // Finalizado
  | 'DELIVERED'; // Entregue

export type PersonType = 'PF' | 'PJ';

export interface Address {
  zipCode: string; // CEP
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

export interface Client {
  id: string;
  type: PersonType;
  name: string; // Nome ou Razão Social
  document: string; // CPF ou CNPJ
  ie?: string; // Inscrição Estadual (apenas PJ)
  whatsapp: string;
  email?: string;
  address: Address;
}

export interface Machine {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  type: string; // e.g., Martelete, Serra, Parafusadeira
}

export interface Part {
  id: string;
  name: string;
  code: string; // SKU
  costPrice: number;
  sellPrice: number;
  supplier: string;
  stockQuantity: number;
}

export type BudgetItemType = 'PART' | 'SERVICE';

export interface BudgetItem {
  id: string;
  type: BudgetItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  partId?: string; // Link opcional com o estoque
}

export interface OSEquipment {
    id: string; // ID interno na OS
    machineId: string;
    defectReported: string;
    diagnosisNotes?: string;
    budgetItems: BudgetItem[];
}

export interface Payment {
  id: string;
  description: string; // ex: Sinal, Parcela 1
  method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BOLETO';
  amount: number;
  date: string;
}

export interface ServiceOrder {
  id: string;
  shortId: string;
  clientId: string;
  
  entryDate: string;
  deadlineDate?: string; // Data de Entrega
  status: OSStatus;
  
  // Lista de Equipamentos (1 OS pode ter várias máquinas)
  equipmentItems: OSEquipment[];

  discount: number;
  
  // Financeiro
  payments: Payment[];

  history: {
    date: string;
    status: OSStatus;
    note?: string;
  }[];
}

export interface DashboardFilter {
  query: string;
  status?: OSStatus;
}