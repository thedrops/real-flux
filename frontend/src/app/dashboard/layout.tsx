'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Fragment, Suspense } from 'react';
import { 
  ChartBarIcon, 
  HomeIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import Loader from '@/components/Loader';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transações', href: '/dashboard/transactions', icon: CurrencyDollarIcon },
  { name: 'Relatórios', href: '/dashboard/reports', icon: ChartBarIcon },
];

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push('/');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-16'}
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className={`text-xl font-bold text-gray-800 transition-opacity duration-300
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              Real Flux
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDoubleRightIcon className="w-6 h-6 text-gray-500" />
              )}
            </button>
          </div>

          {/* Sidebar content */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 group
                        ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                    >
                      <Icon className="w-6 h-6 shrink-0" />
                      <span className={`ml-3 transition-opacity duration-300
                        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden -m-2.5 p-2.5 text-gray-700 hover:text-gray-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
                <div className="flex-1" />
                <div className="flex items-center gap-x-4">
                  {/* User menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-x-2 p-2 hover:bg-gray-50 rounded-lg">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      <span className="hidden lg:block text-sm text-gray-700">
                        {session?.user?.name}
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {session?.user?.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {session?.user?.email}
                          </p>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-lg"
                    title="Sair"
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardContent children={children} />
    </Suspense>
  );
}
