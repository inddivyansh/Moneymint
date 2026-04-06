import Sidebar from '@/components/Sidebar';
import { DashboardProvider } from '@/lib/dashboard-store';

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <Sidebar />
        <main className="md:ml-[220px] min-h-screen pb-24 sm:pb-20 md:pb-0">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
