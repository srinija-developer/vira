import AppLayout from '@/components/AppLayout';
import AccountPage from './components/AccountPage';

export const metadata = {
  title: 'Account — VIRA',
  description: 'Manage your subscription, API usage, saved reports, team, and integrations.',
};

export default function Page() {
  return (
    <AppLayout>
      <AccountPage />
    </AppLayout>
  );
}
