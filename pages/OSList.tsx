import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ArrowUpRight } from 'lucide-react';
import { STATUS_LABELS } from '../constants';
import { OSStatus } from '../types';

export const OSList: React.FC = () => {
  const { serviceOrders, getClient, getMachine } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OSStatus | 'ALL'>('ALL');

  const filteredOrders = serviceOrders.filter(os => {
    const client = getClient(os.clientId);
    const hasMachineMatch = os.equipmentItems.some(eq => {
        const m = getMachine(eq.machineId);
        return m?.brand.toLowerCase().includes(search.toLowerCase()) || m?.model.toLowerCase().includes(search.toLowerCase());
    });
    
    const matchesSearch = 
      os.shortId.includes(search) ||
      client?.name.toLowerCase().includes(search.toLowerCase()) ||
      hasMachineMatch;

    const matchesStatus = filterStatus === 'ALL' || os.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ordens de Serviço</h1>
          <p className="text-slate-500 mt-2">Manage all your repair jobs, track status and revenue.</p>
        </div>
        <button 
            onClick={() => navigate('/new')}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
        >
            <Plus size={20} />
            New Order
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface p-1 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search by client, ID or machine..." 
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="h-auto w-[1px] bg-slate-200 hidden md:block my-2"></div>
        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
             {/* Status Filters as Ghost Buttons */}
             {['ALL', 'ANALYSIS', 'BUDGETED', 'APPROVED', 'FINISHED'].map((st) => (
                 <button
                    key={st}
                    onClick={() => setFilterStatus(st as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        filterStatus === st 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                 >
                    {st === 'ALL' ? 'All Orders' : STATUS_LABELS[st as OSStatus]}
                 </button>
             ))}
             <button className="px-3 py-1.5 text-slate-400 hover:text-primary transition-colors">
                 <Filter size={16} />
             </button>
        </div>
      </div>

      {/* Table / List View */}
      <div className="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Equipments</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(os => {
                    const client = getClient(os.clientId);
                    
                    // Calculate total
                    let totalItems = 0;
                    const machinesList: string[] = [];
                    os.equipmentItems.forEach(eq => {
                        const m = getMachine(eq.machineId);
                        if(m) machinesList.push(`${m.brand} ${m.model}`);
                        totalItems += eq.budgetItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
                    });
                    const total = Math.max(0, totalItems - (os.discount || 0));

                    return (
                        <tr key={os.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => navigate(`/os/${os.id}`)}>
                            <td className="px-6 py-4">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">#{os.shortId}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-white border border-indigo-50 flex items-center justify-center text-primary font-bold text-xs">
                                        {client?.name.substring(0,1)}
                                    </div>
                                    <div className="max-w-[140px]">
                                        <p className="text-sm font-bold text-slate-700 truncate">{client?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{client?.whatsapp}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {machinesList.slice(0, 1).map((m, idx) => (
                                        <span key={idx} className="text-sm font-medium text-slate-600 truncate">{m}</span>
                                    ))}
                                    {machinesList.length > 1 && <span className="text-xs text-slate-400 font-medium">+{machinesList.length - 1} more</span>}
                                    {machinesList.length === 0 && <span className="text-xs text-slate-300 italic">No equipment</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">{new Date(os.entryDate).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-4">
                                {total > 0 ? (
                                    <span className="text-sm font-bold text-slate-800">R$ {total.toFixed(2)}</span>
                                ) : (
                                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Pending</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <StatusBadge status={os.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                                    <ArrowUpRight size={18} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-300" size={24} />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">No orders found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let colorClass = "";
    switch (status) {
        case 'ANALYSIS': colorClass = "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10"; break;
        case 'BUDGETED': colorClass = "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-700/10"; break;
        case 'APPROVED': colorClass = "bg-orange-50 text-orange-700 ring-1 ring-orange-700/10"; break;
        case 'WAITING_PARTS': colorClass = "bg-red-50 text-red-700 ring-1 ring-red-700/10"; break;
        case 'FINISHED': colorClass = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10"; break;
        case 'DELIVERED': colorClass = "bg-slate-100 text-slate-600 ring-1 ring-slate-600/10"; break;
        default: colorClass = "bg-slate-50 text-slate-600";
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
            {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
        </span>
    )
}