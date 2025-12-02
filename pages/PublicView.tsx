import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, Clock, MessageCircle, Wrench, Hammer } from 'lucide-react';

export const PublicView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getServiceOrder, getClient, getMachine } = useApp();

  const os = id ? getServiceOrder(id) : undefined;
  
  if (!os) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-400">
            <div className="text-center">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Orçamento não encontrado.</p>
            </div>
        </div>
    );
  }

  const client = getClient(os.clientId);
  
  // New Calc with multiple equipments
  const totalItems = os.equipmentItems.reduce((acc, eq) => {
      return acc + eq.budgetItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }, 0);
  const total = Math.max(0, totalItems - (os.discount || 0));

  const steps = [
      { id: 'ANALYSIS', label: 'Análise' },
      { id: 'BUDGETED', label: 'Orçado' },
      { id: 'APPROVED', label: 'Em Produção' },
      { id: 'FINISHED', label: 'Pronto' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === os.status);
  let activeIndex = currentStepIndex;
  if(os.status === 'WAITING_PARTS') activeIndex = 2; 
  if(os.status === 'DELIVERED') activeIndex = 4;

  const handleWhatsApp = () => {
      const msg = `Olá, vi o orçamento da OS #${os.shortId} e gostaria de falar sobre.`;
      window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative font-sans">
      <div className="bg-primary h-2 w-full absolute top-0 left-0"></div>
      
      {/* Header */}
      <div className="p-8 text-center border-b border-slate-100">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-accent mx-auto mb-4 shadow-lg shadow-blue-900/20">
              <Wrench size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">VoltManage Tech</h1>
          <p className="text-sm text-slate-500 mt-1">Assistência Técnica Especializada</p>
      </div>

      <div className="p-6 bg-slate-50/50">
          <p className="text-lg text-slate-700 font-medium mb-1">Olá, <span className="font-bold">{client?.name.split(' ')[0]}</span></p>
          <p className="text-slate-500 text-sm leading-relaxed">
              Aqui está o status atual e o orçamento detalhado.
          </p>
      </div>

      {/* Timeline */}
      <div className="px-8 py-8">
          <div className="flex justify-between relative">
              <div className="absolute top-3 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
              {steps.map((step, idx) => {
                  const isActive = idx <= activeIndex;
                  return (
                      <div key={step.id} className="flex flex-col items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors duration-300 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-200 text-slate-400'}`}>
                              {isActive && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className={`text-[10px] font-medium ${isActive ? 'text-slate-800' : 'text-slate-300'}`}>{step.label}</span>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* Equipment Loop */}
      <div className="px-6 pb-6 space-y-6">
        {os.equipmentItems.map((eq, idx) => {
            const machine = getMachine(eq.machineId);
            const subtotal = eq.budgetItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);

            return (
                <div key={eq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-slate-500 border border-slate-200">
                             <Wrench size={16} />
                        </div>
                        <div>
                             <h3 className="font-bold text-slate-800 text-sm">{machine?.brand} {machine?.model}</h3>
                             <p className="text-xs text-slate-400 font-mono">#{machine?.serialNumber}</p>
                        </div>
                    </div>
                    
                    {os.status !== 'ANALYSIS' && (
                        <div className="p-4 space-y-2">
                             {eq.budgetItems.map(item => (
                                 <div key={item.id} className="flex justify-between text-sm items-center">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        {item.type === 'PART' ? <Hammer size={12} /> : <Wrench size={12} />}
                                        <span className="text-xs">{item.quantity}x {item.description}</span>
                                    </div>
                                    <span className="font-medium text-slate-800 text-xs">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                                 </div>
                             ))}
                             {eq.budgetItems.length === 0 && <p className="text-xs text-slate-400 italic">Sem itens lançados.</p>}
                             <div className="pt-2 mt-2 border-t border-dashed border-slate-100 text-right">
                                 <span className="text-xs font-bold text-slate-500">Subtotal: R$ {subtotal.toFixed(2)}</span>
                             </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>


      {/* Financials Totals */}
      {os.status !== 'ANALYSIS' && (
          <div className="px-6 pb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                      <span>Soma dos Equipamentos</span>
                      <span>R$ {totalItems.toFixed(2)}</span>
                  </div>
                  {os.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium mb-2">
                          <span>Desconto</span>
                          <span>- R$ {os.discount.toFixed(2)}</span>
                      </div>
                  )}
                  <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                      <span className="text-sm font-medium text-slate-600">Total a pagar</span>
                      <span className="text-2xl font-bold text-slate-900">R$ {total.toFixed(2)}</span>
                  </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                  {os.status === 'BUDGETED' && (
                      <button className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-transform active:scale-95">
                          APROVAR ORÇAMENTO
                      </button>
                  )}
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                      <MessageCircle size={18} className="text-green-500" />
                      FALAR NO WHATSAPP
                  </button>
              </div>
          </div>
      )}
      
      {os.status === 'ANALYSIS' && (
          <div className="px-6 pb-12 text-center text-slate-500 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <p>Seus equipamentos estão em análise. Em breve você receberá o orçamento detalhado.</p>
          </div>
      )}

    </div>
  );
};