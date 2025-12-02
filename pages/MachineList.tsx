import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Wrench } from 'lucide-react';
import { MachineModal } from '../components/MachineModal';

export const MachineList: React.FC = () => {
  const { machines, addMachine } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = machines.filter(m => 
    m.brand.toLowerCase().includes(search.toLowerCase()) || 
    m.model.toLowerCase().includes(search.toLowerCase()) ||
    m.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Máquinas</h1>
          <p className="text-slate-500 mt-1">Equipamentos cadastrados no sistema.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2">
            <Plus size={20} /> Nova Máquina
        </button>
      </header>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar por marca, modelo ou número de série..." 
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
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Equipamento</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Marca</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Modelo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nº Série</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map(machine => (
                    <tr key={machine.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Wrench size={16} />
                                </div>
                                <span className="font-medium text-slate-700">{machine.type}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{machine.brand}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{machine.model}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{machine.serialNumber}</td>
                    </tr>
                ))}
            </tbody>
         </table>
         {filtered.length === 0 && <p className="text-center py-8 text-slate-400">Nenhuma máquina encontrada.</p>}
      </div>

      <MachineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addMachine} />
    </div>
  );
};