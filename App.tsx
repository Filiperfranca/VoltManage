import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { OSList } from './pages/OSList';
import { ClientList } from './pages/ClientList';
import { MachineList } from './pages/MachineList';
import { PartList } from './pages/PartList';
import { OSDetail } from './pages/OSDetail';
import { PublicView } from './pages/PublicView';

// Wrapper for layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>{children}</Layout>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/os-list" element={<AppLayout><OSList /></AppLayout>} />
          <Route path="/clients" element={<AppLayout><ClientList /></AppLayout>} />
          <Route path="/machines" element={<AppLayout><MachineList /></AppLayout>} />
          <Route path="/parts" element={<AppLayout><PartList /></AppLayout>} />
          
          <Route path="/new" element={<AppLayout><OSDetail isNew /></AppLayout>} />
          <Route path="/os/:id" element={<AppLayout><OSDetail /></AppLayout>} />
          
          {/* Public Route (No sidebar layout) */}
          <Route path="/os/view/:id" element={<PublicView />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;