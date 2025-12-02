import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Machine, ServiceOrder, OSStatus, Part } from '../types';
import { MOCK_CLIENTS, MOCK_MACHINES, MOCK_OSS, MOCK_PARTS } from '../constants';

interface AppContextType {
  clients: Client[];
  machines: Machine[];
  parts: Part[];
  serviceOrders: ServiceOrder[];
  addClient: (client: Omit<Client, 'id'>) => Client;
  addMachine: (machine: Omit<Machine, 'id'>) => Machine;
  addPart: (part: Omit<Part, 'id'>) => Part;
  addServiceOrder: (os: Omit<ServiceOrder, 'id' | 'shortId'>) => ServiceOrder;
  updateServiceOrder: (id: string, data: Partial<ServiceOrder>) => void;
  getServiceOrder: (id: string) => ServiceOrder | undefined;
  getClient: (id: string) => Client | undefined;
  getMachine: (id: string) => Machine | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [parts, setParts] = useState<Part[]>(MOCK_PARTS);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(MOCK_OSS);

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: `c${Date.now()}`
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const addMachine = (machineData: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
      ...machineData,
      id: `m${Date.now()}`
    };
    setMachines(prev => [...prev, newMachine]);
    return newMachine;
  };

  const addPart = (partData: Omit<Part, 'id'>) => {
    const newPart: Part = {
      ...partData,
      id: `p${Date.now()}`
    };
    setParts(prev => [...prev, newPart]);
    return newPart;
  };

  const addServiceOrder = (osData: Omit<ServiceOrder, 'id' | 'shortId'>) => {
    const newOS: ServiceOrder = {
      ...osData,
      id: `os${Date.now()}`,
      shortId: `${Math.floor(4100 + Math.random() * 1000)}` // Simple auto-increment mock
    };
    setServiceOrders(prev => [newOS, ...prev]);
    return newOS;
  };

  const updateServiceOrder = (id: string, data: Partial<ServiceOrder>) => {
    setServiceOrders(prev => prev.map(os => os.id === id ? { ...os, ...data } : os));
  };

  const getServiceOrder = (id: string) => serviceOrders.find(os => os.id === id);
  const getClient = (id: string) => clients.find(c => c.id === id);
  const getMachine = (id: string) => machines.find(m => m.id === id);

  return (
    <AppContext.Provider value={{
      clients,
      machines,
      parts,
      serviceOrders,
      addClient,
      addMachine,
      addPart,
      addServiceOrder,
      updateServiceOrder,
      getServiceOrder,
      getClient,
      getMachine
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};