import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, User, Building2 } from 'lucide-react';
import { ClientModal } from '../components/ClientModal';

export const ClientList: React.FC = () => {
  const { clients, addClient } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.document.includes(search)
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-500 mt-1">Base de clientes cadastrados.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2">
            <Plus size={20} /> Novo Cliente
        </button>
      </header>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar cliente por nome ou documento..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome / Razão</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Documento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contato</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cidade</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    {client.type === 'PF' ? <User size={16} /> : <Building2 size={16} />}
                                </div>
                                <span className="font-medium text-slate-700">{client.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{client.document}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                            <div className="flex flex-col">
                                <span>{client.whatsapp}</span>
                                <span className="text-xs text-slate-400">{client.email}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{client.address.city} - {client.address.state}</td>
                    </tr>
                ))}
            </tbody>
         </table>
         {filtered.length === 0 && <p className="text-center py-8 text-slate-400">Nenhum cliente encontrado.</p>}
      </div>

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addClient} />
    </div>
  );
};