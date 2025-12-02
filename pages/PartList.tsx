import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Package } from 'lucide-react';
import { PartModal } from '../components/PartModal';

export const PartList: React.FC = () => {
  const { parts, addPart } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = parts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Peças & Estoque</h1>
          <p className="text-slate-500 mt-1">Gerencie seu inventário e preços.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-md flex items-center gap-2">
            <Plus size={20} /> Nova Peça
        </button>
      </header>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar peça por nome ou código..." 
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
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Peça</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Código</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estoque</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Preço Custo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Preço Venda</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fornecedor</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map(part => (
                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Package size={16} />
                                </div>
                                <span className="font-medium text-slate-700">{part.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{part.code}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${part.stockQuantity < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {part.stockQuantity} un
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">R$ {part.costPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">R$ {part.sellPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{part.supplier}</td>
                    </tr>
                ))}
            </tbody>
         </table>
         {filtered.length === 0 && <p className="text-center py-8 text-slate-400">Nenhuma peça encontrada.</p>}
      </div>

      <PartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addPart} />
    </div>
  );
};