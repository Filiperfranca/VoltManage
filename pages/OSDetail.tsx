import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { OSStatus, BudgetItem, Payment, OSEquipment } from '../types';
import { ArrowLeft, Save, Share2, Printer, Plus, Trash2, UserPlus, Wrench, Calendar, DollarSign, PenTool, Hammer, Package } from 'lucide-react';
import { ClientModal } from '../components/ClientModal';
import { MachineModal } from '../components/MachineModal';
import { PartModal } from '../components/PartModal';

export const OSDetail: React.FC<{ isNew?: boolean }> = ({ isNew }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    serviceOrders, clients, machines, parts,
    addClient, addMachine, addPart, addServiceOrder, updateServiceOrder, 
    getServiceOrder, getClient, getMachine 
  } = useApp();

  // --- States ---
  const [clientId, setClientId] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [status, setStatus] = useState<OSStatus>('ANALYSIS');
  const [discount, setDiscount] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);

  // List of Equipments
  const [equipmentItems, setEquipmentItems] = useState<OSEquipment[]>([]);

  // Modals Control
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  
  // Track which item triggered the part modal
  const [pendingPartTarget, setPendingPartTarget] = useState<{eqId: string, itemId: string} | null>(null);

  // --- Initialize ---
  useEffect(() => {
    if (!isNew && id) {
      const os = getServiceOrder(id);
      if (os) {
        setClientId(os.clientId);
        setEntryDate(os.entryDate.split('T')[0]);
        setDeadlineDate(os.deadlineDate ? os.deadlineDate.split('T')[0] : '');
        setStatus(os.status);
        setDiscount(os.discount || 0);
        setPayments(os.payments || []);
        setEquipmentItems(os.equipmentItems || []);
      }
    } else if (isNew && equipmentItems.length === 0) {
        // Start with one empty equipment card
        addEquipmentCard();
    }
  }, [id, isNew, getServiceOrder]);

  // --- Calculations ---
  // Calculates total of all items across all equipments
  const totalItems = equipmentItems.reduce((acc, eq) => {
      return acc + eq.budgetItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }, 0);

  const totalOS = Math.max(0, totalItems - discount);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = totalOS - totalPaid;

  // --- Handlers ---
  const handleSave = () => {
    if (!clientId) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    if (equipmentItems.length === 0 || !equipmentItems[0].machineId) {
        alert("Adicione pelo menos um equipamento.");
        return;
    }

    const payload = {
      clientId,
      entryDate: new Date(entryDate).toISOString(),
      deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : undefined,
      status,
      equipmentItems,
      discount,
      payments,
    };

    if (isNew) {
      const newOS = addServiceOrder({
        ...payload,
        history: [{ date: new Date().toISOString(), status: 'ANALYSIS', note: 'OS Criada' }]
      });
      navigate(`/os/${newOS.id}`);
    } else if (id) {
        updateServiceOrder(id, payload);
        alert("Salvo com sucesso!");
    }
  };

  // --- Equipment Handlers ---
  const addEquipmentCard = () => {
      const newEq: OSEquipment = {
          id: `eq-${Date.now()}`,
          machineId: '',
          defectReported: '',
          diagnosisNotes: '',
          budgetItems: []
      };
      setEquipmentItems([...equipmentItems, newEq]);
  };

  const removeEquipmentCard = (eqId: string) => {
      if(confirm('Remover este equipamento e seu orçamento?')) {
          setEquipmentItems(equipmentItems.filter(eq => eq.id !== eqId));
      }
  };

  const updateEquipment = (eqId: string, field: keyof OSEquipment, value: any) => {
      setEquipmentItems(equipmentItems.map(eq => eq.id === eqId ? { ...eq, [field]: value } : eq));
  };

  // --- Budget Item Handlers (Nested) ---
  const addBudgetItem = (eqId: string, type: 'PART' | 'SERVICE') => {
      const newItem: BudgetItem = {
        id: `item-${Date.now()}`,
        type,
        description: '',
        quantity: 1,
        unitPrice: 0
      };
      
      setEquipmentItems(equipmentItems.map(eq => {
          if (eq.id === eqId) {
              return { ...eq, budgetItems: [...eq.budgetItems, newItem] };
          }
          return eq;
      }));
  };

  const updateBudgetItem = (eqId: string, itemId: string, field: keyof BudgetItem, value: any) => {
      setEquipmentItems(equipmentItems.map(eq => {
          if (eq.id === eqId) {
              const updatedItems = eq.budgetItems.map(item => item.id === itemId ? { ...item, [field]: value } : item);
              return { ...eq, budgetItems: updatedItems };
          }
          return eq;
      }));
  };

  const removeBudgetItem = (eqId: string, itemId: string) => {
      setEquipmentItems(equipmentItems.map(eq => {
          if (eq.id === eqId) {
              return { ...eq, budgetItems: eq.budgetItems.filter(i => i.id !== itemId) };
          }
          return eq;
      }));
  };

  const handlePartSelect = (eqId: string, itemId: string, partId: string) => {
      const part = parts.find(p => p.id === partId);
      if (part) {
           updateBudgetItem(eqId, itemId, 'partId', part.id);
           updateBudgetItem(eqId, itemId, 'description', part.name);
           updateBudgetItem(eqId, itemId, 'unitPrice', part.sellPrice);
      } else {
           updateBudgetItem(eqId, itemId, 'partId', undefined);
      }
  };

  const openQuickPartAdd = (eqId: string, itemId: string) => {
      setPendingPartTarget({ eqId, itemId });
      setIsPartModalOpen(true);
  }

  // --- Payment Handlers ---
  const addPayment = () => {
    const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        description: 'Sinal',
        method: 'PIX',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
    };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: string, field: keyof Payment, value: any) => {
      setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePayment = (id: string) => {
      setPayments(payments.filter(p => p.id !== id));
  };

  const selectedClient = clients.find(c => c.id === clientId);

  const copyLink = () => {
      if(!id) return;
      const url = `${window.location.origin}/#/os/view/${id}`;
      navigator.clipboard.writeText(url);
      alert("Link copiado: " + url);
  }

  return (
    <div className="pb-32 max-w-5xl mx-auto">
      {/* --- Topbar --- */}
      <div className="sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10 py-4 mb-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
           {!isNew && (
               <>
                 <button onClick={copyLink} className="btn-icon" title="Copiar Link"><Share2 size={20} /></button>
                 <button className="btn-icon" title="Imprimir"><Printer size={20} /></button>
               </>
           )}
           <button onClick={handleSave} className="bg-primary hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-transform active:scale-95">
             <Save size={18} /> {isNew ? 'Gerar OS' : 'Salvar'}
           </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* --- Header da OS (Status & Datas) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Ordem de Serviço {isNew ? '(Nova)' : `#${getServiceOrder(id!)?.shortId}`}</h2>
                </div>
                {!isNew && (
                    <div className="flex items-center gap-3">
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value as OSStatus)}
                            className={`font-bold text-sm px-4 py-2 rounded-lg border outline-none cursor-pointer ${STATUS_COLORS[status]}`}
                        >
                            {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Cliente Selector moved here for prominence */}
                 <div>
                    <label className="label-field flex items-center justify-between">
                        Cliente
                        <button onClick={() => setIsClientModalOpen(true)} className="text-xs font-bold text-accent hover:underline">+ Novo</button>
                    </label>
                    <select 
                        value={clientId} onChange={(e) => setClientId(e.target.value)}
                        className="input-field bg-slate-50"
                    >
                        <option value="">Selecione o Cliente...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {selectedClient && <p className="text-xs text-slate-500 mt-1">{selectedClient.document} • {selectedClient.whatsapp}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label-field">Entrada</label>
                        <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="label-field">Previsão</label>
                        <input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} className="input-field" />
                    </div>
                </div>
            </div>
        </div>

        {/* --- LISTA DE EQUIPAMENTOS --- */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Wrench className="text-slate-400" /> Equipamentos & Serviços
                </h3>
                <button onClick={addEquipmentCard} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                    <Plus size={16} /> Adicionar Equipamento
                </button>
            </div>

            {equipmentItems.map((eq, index) => (
                <div key={eq.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-500 text-sm">ITEM #{index + 1}</span>
                        <button onClick={() => removeEquipmentCard(eq.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Seleção da Máquina */}
                        <div>
                             <label className="label-field flex justify-between">
                                 Equipamento
                                 <button onClick={() => setIsMachineModalOpen(true)} className="text-xs font-bold text-accent hover:underline">+ Nova Máquina</button>
                             </label>
                             <select 
                                value={eq.machineId} 
                                onChange={(e) => updateEquipment(eq.id, 'machineId', e.target.value)}
                                className="input-field font-medium text-lg"
                             >
                                <option value="">Selecione o equipamento...</option>
                                {machines.map(m => <option key={m.id} value={m.id}>{m.type} - {m.brand} {m.model} ({m.serialNumber})</option>)}
                             </select>
                        </div>

                        {/* Defeito e Diagnóstico (Lado a Lado) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="label-field">Defeito Relatado</label>
                                <textarea 
                                    className="input-field h-32 resize-none"
                                    placeholder="O que o cliente relatou..."
                                    value={eq.defectReported}
                                    onChange={(e) => updateEquipment(eq.id, 'defectReported', e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="label-field flex items-center gap-2"><PenTool size={14} /> Diagnóstico Técnico</label>
                                <textarea 
                                    className="input-field h-32 resize-none bg-yellow-50/30 border-yellow-200 focus:ring-yellow-200"
                                    placeholder="Análise técnica..."
                                    value={eq.diagnosisNotes}
                                    onChange={(e) => updateEquipment(eq.id, 'diagnosisNotes', e.target.value)}
                                />
                             </div>
                        </div>

                        {/* Tabela de Orçamento deste Item */}
                        <div className="border border-slate-100 rounded-lg overflow-hidden">
                            <div className="bg-slate-50/80 p-3 border-b border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-700">Peças e Serviços</span>
                                <div className="flex gap-2">
                                    <button onClick={() => addBudgetItem(eq.id, 'PART')} className="btn-small bg-white border border-slate-200 hover:bg-slate-50">
                                        <Hammer size={12} className="text-orange-600" /> + Peça
                                    </button>
                                    <button onClick={() => addBudgetItem(eq.id, 'SERVICE')} className="btn-small bg-white border border-slate-200 hover:bg-slate-50">
                                        <Wrench size={12} className="text-blue-600" /> + Mão de Obra
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 space-y-2">
                                {eq.budgetItems.length === 0 && <p className="text-center text-slate-400 text-sm py-2 italic">Nenhuma peça ou serviço adicionado.</p>}
                                
                                {eq.budgetItems.map(item => (
                                    <div key={item.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center p-2 rounded hover:bg-slate-50 transition-colors">
                                        <div className="text-slate-400 p-2">
                                            {item.type === 'PART' ? <Package size={16} /> : <Wrench size={16} />}
                                        </div>

                                        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
                                            {item.type === 'PART' && (
                                                <div className="flex gap-1 md:w-56">
                                                    <select 
                                                        className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-accent"
                                                        value={item.partId || ''}
                                                        onChange={(e) => handlePartSelect(eq.id, item.id, e.target.value)}
                                                    >
                                                        <option value="">-- Estoque --</option>
                                                        {parts.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name} (R$ {p.sellPrice})</option>
                                                        ))}
                                                        <option value="">Manual</option>
                                                    </select>
                                                    <button 
                                                        onClick={() => openQuickPartAdd(eq.id, item.id)}
                                                        className="px-2 bg-slate-100 hover:bg-accent hover:text-white border border-slate-200 rounded transition-colors text-slate-600"
                                                        title="Cadastrar Nova Peça no Estoque"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            
                                            <input 
                                                className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-accent outline-none px-2 py-1 text-sm font-medium text-slate-700"
                                                placeholder="Descrição..."
                                                value={item.description}
                                                onChange={(e) => updateBudgetItem(eq.id, item.id, 'description', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                             <input 
                                                type="number" 
                                                className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-sm"
                                                value={item.quantity}
                                                onChange={(e) => updateBudgetItem(eq.id, item.id, 'quantity', parseFloat(e.target.value))}
                                            />
                                            <span className="text-xs text-slate-400">x</span>
                                            <div className="relative w-24">
                                                <span className="absolute left-2 top-1 text-xs text-slate-400">R$</span>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-slate-200 rounded pl-6 pr-2 py-1 text-right text-sm"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateBudgetItem(eq.id, item.id, 'unitPrice', parseFloat(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-20 text-right font-bold text-slate-700 text-sm">
                                                R$ {(item.quantity * item.unitPrice).toFixed(2)}
                                            </div>
                                            <button onClick={() => removeBudgetItem(eq.id, item.id)} className="p-1.5 text-red-300 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Subtotal do Item */}
                            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-end">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Subtotal Item:</span>
                                <span className="text-sm font-bold text-slate-800">
                                    R$ {eq.budgetItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* --- TOTALIZADORES --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
             <div className="flex justify-between items-center text-slate-600">
                 <span>Soma dos Itens</span>
                 <span className="font-medium">R$ {totalItems.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center text-slate-600">
                 <span>Desconto Global</span>
                 <input 
                    type="number" 
                    className="w-32 text-right border border-slate-200 rounded px-2 py-1 text-red-600 font-medium"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                 />
             </div>
             <div className="flex justify-between items-center text-2xl font-bold text-slate-900 pt-4 border-t border-slate-100">
                 <span>Total da OS</span>
                 <span>R$ {totalOS.toFixed(2)}</span>
             </div>
        </div>

        {/* --- PAGAMENTOS --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign size={18} className="text-green-600" /> Pagamentos
                </h3>
                <button onClick={addPayment} className="btn-small bg-white border border-green-200 text-green-700 hover:bg-green-50">
                    + Adicionar
                </button>
            </div>
            <div className="p-4 space-y-3">
                 {payments.length === 0 && <p className="text-center text-slate-400 text-sm py-2">Nenhum pagamento registrado.</p>}
                 {payments.map(pay => (
                     <div key={pay.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-white border border-slate-100 p-2 rounded-lg">
                         <div className="md:col-span-3">
                            <input className="w-full text-sm border-none bg-transparent focus:ring-0 font-medium placeholder-slate-400" placeholder="Descrição" value={pay.description} onChange={e => updatePayment(pay.id, 'description', e.target.value)} />
                         </div>
                         <div className="md:col-span-3">
                            <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded p-1.5" value={pay.method} onChange={e => updatePayment(pay.id, 'method', e.target.value)}>
                                <option value="PIX">Pix</option>
                                <option value="CREDIT_CARD">Cartão Crédito</option>
                                <option value="DEBIT_CARD">Cartão Débito</option>
                                <option value="CASH">Dinheiro</option>
                                <option value="BOLETO">Boleto</option>
                            </select>
                         </div>
                         <div className="md:col-span-3">
                             <input type="date" className="w-full text-sm bg-slate-50 border border-slate-200 rounded p-1.5" value={pay.date} onChange={e => updatePayment(pay.id, 'date', e.target.value)} />
                         </div>
                         <div className="md:col-span-2 relative">
                             <span className="absolute left-2 top-1.5 text-xs text-slate-400">R$</span>
                             <input type="number" className="w-full pl-6 text-sm bg-slate-50 border border-slate-200 rounded p-1.5 font-bold text-slate-700" value={pay.amount} onChange={e => updatePayment(pay.id, 'amount', parseFloat(e.target.value))} />
                         </div>
                         <div className="md:col-span-1 text-right">
                             <button onClick={() => removePayment(pay.id)} className="text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                         </div>
                     </div>
                 ))}
            </div>
             <div className="bg-green-50/50 p-4 flex justify-between items-center text-sm font-medium border-t border-green-100">
                <span className="text-green-800">Total Pago: R$ {totalPaid.toFixed(2)}</span>
                <span className={`${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>Restante: R$ {remainingBalance.toFixed(2)}</span>
            </div>
        </div>

      </div>

      {/* Modals */}
      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        onSave={(c) => { 
            const newClient = addClient(c); 
            setClientId(newClient.id); 
        }} 
      />
      
      <MachineModal 
        isOpen={isMachineModalOpen} 
        onClose={() => setIsMachineModalOpen(false)} 
        onSave={(m) => { 
            // We just add the machine to the database, user must select it in the dropdown
            addMachine(m); 
        }} 
      />

      <PartModal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        onSave={(p) => {
            const newPart = addPart(p);
            // If triggered from a specific line item, auto-select it
            if (pendingPartTarget) {
                handlePartSelect(pendingPartTarget.eqId, pendingPartTarget.itemId, newPart.id);
            }
            setPendingPartTarget(null);
        }}
      />

      <style>{`
        .input-field {
            @apply w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700;
        }
        .label-field {
            @apply block text-sm font-medium text-slate-700 mb-1;
        }
        .btn-icon {
            @apply p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors;
        }
        .btn-small {
            @apply px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm;
        }
      `}</style>
    </div>
  );
};