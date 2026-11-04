import AdminPage from '@/pages/AdminPage';
import HomePage from '@/pages/HomePage';
import SetupNotice from '@/components/SetupNotice';
import { isSupabaseConfigured } from '@/lib/supabase';

function isAdminPath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === '/admin';
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  if (isAdminPath(window.location.pathname)) return <AdminPage />;
  return <HomePage />;
}
