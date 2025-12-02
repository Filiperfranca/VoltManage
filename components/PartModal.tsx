import React, { useState } from 'react';
import { Part } from '../types';
import { X, Package } from 'lucide-react';

interface PartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (part: Omit<Part, 'id'>) => void;
}

export const PartModal: React.FC<PartModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    costPrice: 0,
    sellPrice: 0,
    supplier: '',
    stockQuantity: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', code: '', costPrice: 0, sellPrice: 0, supplier: '', stockQuantity: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-accent" size={20} />
            Nova Peça
          </h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Peça</label>
                <input required placeholder="Ex: Induzido" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código (SKU)</label>
                <input required placeholder="Ex: IND-001" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Custo (R$)</label>
                <input type="number" step="0.01" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Venda (R$)</label>
                <input type="number" step="0.01" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: parseFloat(e.target.value)})} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fornecedor</label>
                <input placeholder="Nome do fornecedor" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qtd. Estoque</label>
                <input type="number" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: parseFloat(e.target.value)})} />
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
             <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 font-medium">Cadastrar Peça</button>
          </div>
        </form>
      </div>
    </div>
  );
};