import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminCMS from '../../components/AdminCMS';
import { isAdminCookieStore } from '../../lib/adminAuth';

async function AdminPage() {
  const cookieStore = await cookies();

  if (!isAdminCookieStore(cookieStore)) {
    redirect('/admin/login');
  }

  return <AdminCMS />;
}

export default AdminPage;
