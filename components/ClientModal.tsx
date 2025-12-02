import React, { useState, useEffect } from 'react';
import { Client, PersonType } from '../types';
import { fetchAddressByCep } from '../services/viacep';
import { X, Search, Building2, User } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<PersonType>('PF');
  const [formData, setFormData] = useState({
    name: '',
    document: '', // CPF/CNPJ
    ie: '',
    whatsapp: '',
    email: '',
    zipCode: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
        setFormData({
            name: '', document: '', ie: '', whatsapp: '', email: '',
            zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '', complement: ''
        });
        setType('PF');
    }
  }, [isOpen]);

  const handleCepBlur = async () => {
    if (formData.zipCode.length >= 8) {
      setLoadingCep(true);
      const data = await fetchAddressByCep(formData.zipCode);
      setLoadingCep(false);
      if (data) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      name: formData.name,
      document: formData.document,
      ie: formData.ie,
      whatsapp: formData.whatsapp,
      email: formData.email,
      address: {
        zipCode: formData.zipCode,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        complement: formData.complement
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Novo Cliente</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Tipo de Pessoa Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit">
            <button
              type="button"
              onClick={() => setType('PF')}
              className={`flex-1 flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'PF' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={16} /> Pessoa Física
            </button>
            <button
              type="button"
              onClick={() => setType('PJ')}
              className={`flex-1 flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'PJ' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Building2 size={16} /> Pessoa Jurídica
            </button>
          </div>

          {/* Dados Pessoais / Empresariais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="col-span-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">{type === 'PF' ? 'Nome Completo' : 'Razão Social'}</label>
                <input required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{type === 'PF' ? 'CPF' : 'CNPJ'}</label>
                <input required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                  value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} placeholder={type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'} />
             </div>

             {type === 'PJ' && (
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Inscrição Estadual</label>
                  <input className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={formData.ie} onChange={e => setFormData({...formData, ie: e.target.value})} />
               </div>
             )}

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Telefone</label>
                <input required className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                   value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                   value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
          </div>

          <hr className="border-slate-100" />

          {/* Endereço */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">CEP</label>
                    <div className="relative">
                        <input className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none" 
                        value={formData.zipCode} 
                        onChange={e => setFormData({...formData, zipCode: e.target.value})}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        />
                        {loadingCep && <div className="absolute right-3 top-3 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>}
                    </div>
                </div>
                
                <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Logradouro</label>
                    <input className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" 
                      value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Número</label>
                    <input className="w-full border border-slate-300 rounded-lg p-2.5" 
                      value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Bairro</label>
                    <input className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" 
                      value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Cidade</label>
                    <input className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" 
                      value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 sticky bottom-0">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg shadow-lg shadow-blue-900/10 hover:bg-slate-800 transition-colors">Salvar Cliente</button>
        </div>
      </div>
    </div>
  );
};