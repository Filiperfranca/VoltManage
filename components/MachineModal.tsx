import React, { useState } from 'react';
import { Machine } from '../types';
import { X, Wrench } from 'lucide-react';

interface MachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: Omit<Machine, 'id'>) => void;
}

export const MachineModal: React.FC<MachineModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    type: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ brand: '', model: '', serialNumber: '', type: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="text-accent" size={20} />
            Nova Máquina
          </h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Equipamento</label>
            <input required placeholder="Ex: Martelete, Serra Circular, Lixadeira" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marca</label>
                <input required placeholder="Ex: Makita" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Modelo</label>
                <input required placeholder="Ex: HR2470" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none"
                  value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número de Série</label>
            <input required placeholder="Código gravado na carcaça" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none font-mono"
              value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
          </div>

          <div className="pt-4 flex justify-end gap-2">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
             <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 font-medium">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};