import { Client, Machine, ServiceOrder, OSStatus, Part } from './types';

export const STATUS_LABELS: Record<OSStatus, string> = {
  ANALYSIS: 'Em Análise',
  BUDGETED: 'A Confirmar',
  APPROVED: 'Em Produção',
  WAITING_PARTS: 'Aguardando Peça',
  FINISHED: 'Pronto',
  DELIVERED: 'Entregue',
};

export const STATUS_COLORS: Record<OSStatus, string> = {
  ANALYSIS: 'bg-blue-100 text-blue-800 border-blue-200',
  BUDGETED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-orange-100 text-orange-800 border-orange-200',
  WAITING_PARTS: 'bg-red-100 text-red-800 border-red-200',
  FINISHED: 'bg-green-100 text-green-800 border-green-200',
  DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Mocks atualizados
export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    type: 'PF',
    name: 'Carlos Eduardo', 
    document: '123.456.789-00',
    whatsapp: '(11) 99999-9999', 
    email: 'carlos@example.com',
    address: {
      zipCode: '01001-000',
      street: 'Praça da Sé',
      number: '100',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP'
    }
  },
  { 
    id: 'c2', 
    type: 'PJ',
    name: 'Oficina do Zé LTDA', 
    document: '12.345.678/0001-90',
    ie: '123456789',
    whatsapp: '(11) 98888-8888', 
    email: 'ze@oficina.com',
    address: {
      zipCode: '04571-010',
      street: 'Av. Engenheiro Luís Carlos Berrini',
      number: '500',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    }
  }
];

export const MOCK_MACHINES: Machine[] = [
  { id: 'm1', brand: 'Makita', model: '5007N', type: 'Serra Circular', serialNumber: '99887766' },
  { id: 'm2', brand: 'Bosch', model: 'GSB 13 RE', type: 'Furadeira Impacto', serialNumber: 'AABBCC' },
];

export const MOCK_PARTS: Part[] = [
  { id: 'p1', name: 'Induzido Makita 5007N', code: 'IND-5007', costPrice: 80.00, sellPrice: 150.00, supplier: 'J Nakao', stockQuantity: 5 },
  { id: 'p2', name: 'Jogo de Escovas CB-153', code: 'ESC-CB153', costPrice: 10.00, sellPrice: 35.00, supplier: 'Gimawa', stockQuantity: 20 },
  { id: 'p3', name: 'Rolamento 608ZZ', code: 'ROL-608', costPrice: 5.00, sellPrice: 15.00, supplier: 'Distribuidora X', stockQuantity: 50 },
];

export const MOCK_OSS: ServiceOrder[] = [
  {
    id: 'os1',
    shortId: '4092',
    clientId: 'c1',
    entryDate: new Date().toISOString(),
    status: 'BUDGETED',
    equipmentItems: [
        {
            id: 'eq1',
            machineId: 'm1',
            defectReported: 'Parou de funcionar durante o corte.',
            diagnosisNotes: 'Induzido queimado, escovas gastas.',
            budgetItems: [
                { id: 'i1', type: 'PART', description: 'Induzido Makita 5007N', quantity: 1, unitPrice: 150.00, partId: 'p1' },
                { id: 'i2', type: 'PART', description: 'Jogo de Escovas CB-153', quantity: 1, unitPrice: 35.00, partId: 'p2' },
                { id: 'i3', type: 'SERVICE', description: 'Mão de Obra Especializada', quantity: 1, unitPrice: 80.00 }
            ]
        }
    ],
    discount: 0,
    payments: [],
    history: [
      { date: new Date().toISOString(), status: 'ANALYSIS', note: 'Recebido' },
      { date: new Date().toISOString(), status: 'BUDGETED', note: 'Orçamento enviado' }
    ]
  },
  {
    id: 'os2',
    shortId: '4093',
    clientId: 'c2',
    entryDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'ANALYSIS',
    equipmentItems: [
        {
            id: 'eq2',
            machineId: 'm2',
            defectReported: 'Cheiro de queimado.',
            diagnosisNotes: '',
            budgetItems: []
        }
    ],
    discount: 0,
    payments: [],
    history: [
      { date: new Date(Date.now() - 86400000).toISOString(), status: 'ANALYSIS', note: 'Recebido' }
    ]
  }
];