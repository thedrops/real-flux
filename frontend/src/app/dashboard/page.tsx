'use client';
import { useSession } from 'next-auth/react';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type for transactions
export interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

interface Transaction {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  transaction_type: 'income' | 'expense';
  transaction_date: Date;
  created_at: Date | null;
  updated_at: Date | null;
  users: {
    id: number;
    name: string;
    email: string;
    created_at: Date | null;
    updated_at: Date | null;
  };
};

async function fetchDashboardData() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentTransactionsList, setRecentTransactionsList] = useState<Transaction[]>([]);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      const { stats, recentTransactionsList } = await fetchDashboardData();
      setStats(stats);
      setRecentTransactionsList(recentTransactionsList);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Hello, {session?.user?.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here is a summary of your finances
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: { icon: string; name: string; value: string; }, index: number) => {
          let Icon;
          switch (stat.icon) {
            case 'BanknotesIcon':
              Icon = BanknotesIcon;
              break;
            case 'ArrowTrendingUpIcon':
              Icon = ArrowTrendingUpIcon;
              break;
            case 'ArrowTrendingDownIcon':
              Icon = ArrowTrendingDownIcon;
              break;
            default:
              Icon = BanknotesIcon;
          }
          return (
            <div
              key={index}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${stat.name === 'Total Balance' ? 'text-blue-600' : stat.name === 'Income' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`text-sm font-medium ${stat.name === 'Total Balance' ? 'text-blue-600' : stat.name === 'Income' ? 'text-green-600' : 'text-gray-500'}`} >
                    {stat.name}
                  </h3>
                  <p className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action button */}
      <div className="mb-6">
        <a href="/dashboard/statement" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          View Complete Statement
        </a>
      </div>

      {/* Recent transactions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Transactions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Latest transactions in your account
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list">
            {recentTransactionsList.map((transaction: Transaction) => (
              <li
                key={transaction.id}
                className="relative flex items-center gap-x-4 px-6 py-4 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-x-4">
                      <p className={`text-sm font-medium ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.transaction_type === 'expense' ? '-' : ''}{Number(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        R$ {(transaction.amount * transaction.exchange_rate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <p>{new Date(transaction.transaction_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</p>
                    <p>{transaction.currency}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
