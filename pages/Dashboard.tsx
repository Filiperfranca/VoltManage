import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

export const Dashboard: React.FC = () => {
  const { serviceOrders, clients } = useApp();

  // Calculations
  const totalRevenue = serviceOrders.reduce((acc, os) => {
    if (os.status === 'FINISHED' || os.status === 'DELIVERED') {
         const itemsTotal = os.equipmentItems.reduce((eqAcc, eq) => {
             return eqAcc + eq.budgetItems.reduce((itemAcc, item) => itemAcc + (item.quantity * item.unitPrice), 0);
         }, 0);
         return acc + (itemsTotal - (os.discount || 0));
    }
    return acc;
  }, 0);

  const totalDeals = serviceOrders.length;
  const recentOS = serviceOrders.slice(0, 5);

  // Fake Data for Chart
  const chartData = [40, 55, 45, 70, 65, 85, 95, 75, 85, 100, 90, 110];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-1">Insights</h2>
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          </div>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg shadow-sm hover:bg-slate-50">Download Report</button>
             <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-lg shadow-primary/30 hover:bg-primary-dark">Create New OS</button>
          </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h3 className="font-bold text-lg text-slate-800">Performance This Month</h3>
              <select className="text-sm bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer">
                  <option>This Month</option>
                  <option>Last Month</option>
              </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
              {/* Stats */}
              <div className="flex lg:flex-col gap-8 lg:w-48">
                  <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">Total Revenue</p>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h2>
                      <div className="flex items-center gap-1 mt-2 text-sm font-medium text-success bg-success/10 w-fit px-2 py-0.5 rounded-full">
                          <TrendingUp size={14} />
                          <span>+12.5%</span>
                      </div>
                  </div>
                  <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">Total OS</p>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{totalDeals}</h2>
                  </div>
              </div>

              {/* Gradient Bar Chart Simulation */}
              <div className="flex-1 h-64 flex items-end justify-between gap-3 px-2 relative">
                   {/* Grid Lines */}
                   <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-slate-100 w-full h-full"></div>
                        <div className="border-t border-slate-100 w-full h-full"></div>
                        <div className="border-t border-slate-100 w-full h-full"></div>
                        <div className="border-t border-slate-100 w-full h-full"></div>
                   </div>

                   {chartData.map((h, i) => (
                      <div key={i} className="w-full h-full flex items-end relative group z-10">
                          <div 
                            className="w-full rounded-t-sm transition-all duration-700 ease-out hover:brightness-110"
                            style={{ 
                                height: `${h}%`,
                                background: 'linear-gradient(180deg, #4F46E5 0%, rgba(79, 70, 229, 0.4) 100%)',
                                borderRadius: '4px 4px 0 0',
                            }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl whitespace-nowrap pointer-events-none">
                              {h}% Performance
                              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Leads (Table Style) */}
          <div className="lg:col-span-2 bg-surface rounded-2xl p-6 shadow-card border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-800">Recent Service Orders</h3>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{totalDeals}</span>
                  </div>
                  <div className="flex gap-2">
                      <button className="text-xs font-semibold text-slate-500 hover:text-primary px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">This Week</button>
                      <button className="text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md">This Month</button>
                  </div>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead className="text-left">
                          <tr>
                              <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Client / Machine</th>
                              <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                              <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                              <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-2">Action</th>
                          </tr>
                      </thead>
                      <tbody className="space-y-4">
                          {recentOS.map((os) => {
                              const client = clients.find(c => c.id === os.clientId);
                              // Get first machine
                              const firstEq = os.equipmentItems[0]; // Assuming at least one eq exists from previous logic, or handle mock
                              const machineName = firstEq ? "Equipamento..." : "N/A"; 

                              return (
                                  <tr key={os.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                      <td className="py-3 pl-2">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                  {client?.name.substring(0,2)}
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-slate-800">{client?.name}</p>
                                                  <p className="text-xs text-slate-500">OS #{os.shortId}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="py-3 text-sm text-slate-500">
                                          {new Date(os.entryDate).toLocaleDateString()}
                                          <br/><span className="text-xs text-slate-400">12:30 PM</span>
                                      </td>
                                      <td className="py-3">
                                          <StatusBadge status={os.status} />
                                      </td>
                                      <td className="py-3 text-right pr-2">
                                          <button className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center justify-end gap-1 w-full">
                                              View <ArrowUpRight size={16} />
                                          </button>
                                      </td>
                                  </tr>
                              )
                          })}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Side Card (Revenue) */}
          <div className="bg-surface rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">Revenue</h3>
                  <button className="text-sm font-medium text-slate-500 hover:text-primary">See all</button>
              </div>
              
              <div className="mb-6">
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">Total gross income this period.</p>
              </div>

              <div className="mt-auto">
                   <div className="flex items-center gap-4 mb-4">
                       <div className="flex-1 bg-primary/10 h-2 rounded-full overflow-hidden">
                           <div className="bg-primary h-full w-[70%] rounded-full"></div>
                       </div>
                       <span className="text-sm font-bold text-slate-700">70%</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <div>
                           <p className="text-xs text-slate-500 font-medium uppercase mb-1">Goal</p>
                           <p className="text-lg font-bold text-slate-800">R$ 500k</p>
                       </div>
                       <div className="h-10 w-[1px] bg-slate-200"></div>
                       <div>
                            <p className="text-xs text-slate-500 font-medium uppercase mb-1">Reality</p>
                            <p className="text-lg font-bold text-primary">R$ {totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}</p>
                       </div>
                   </div>
              </div>
          </div>

      </div>
    </div>
  );
};

// Helper for clean status badges
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let colorClass = "";
    // Mapping Tailwind colors manually to ensure compatibility with index.html config
    switch (status) {
        case 'ANALYSIS': colorClass = "bg-blue-50 text-blue-700"; break;
        case 'BUDGETED': colorClass = "bg-yellow-50 text-yellow-700"; break;
        case 'APPROVED': colorClass = "bg-orange-50 text-orange-700"; break;
        case 'WAITING_PARTS': colorClass = "bg-red-50 text-red-700"; break;
        case 'FINISHED': colorClass = "bg-emerald-50 text-emerald-700"; break;
        case 'DELIVERED': colorClass = "bg-slate-100 text-slate-600"; break;
        default: colorClass = "bg-slate-50 text-slate-600";
    }

    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${colorClass}`}>
            {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
        </span>
    )
}