'use client';
import { useSession } from 'next-auth/react';
import { BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type for transactions
export interface Stat {
  name: string;
  value: string;
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
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

async function fetchStatementData(page: number = 1, limit: number = 10) {
  const response = await fetch(`/api/statement?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch statement data');
  }
  return response.json();
}

export default function Statement() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      redirect('/login');
    }
    fetchData();
  }, [session, status]);

  const fetchData = async (page: number = 1, limit: number = 10) => {
    try {
      const { summary, transactions, pagination } = await fetchStatementData(page, limit);
      setStats([
        { 
          name: 'Total Balance', 
          value: `R$ ${summary.total_balance.toFixed(2)}`,
          icon: 'BanknotesIcon'
        },
        { 
          name: 'Income', 
          value: `R$ ${summary.total_income.toFixed(2)}`,
          icon: 'ArrowTrendingUpIcon'
        },
        { 
          name: 'Expenses', 
          value: `R$ ${summary.total_expenses.toFixed(2)}`,
          icon: 'ArrowTrendingDownIcon'
        }
      ]);
      setTransactions(transactions);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchData(newPage);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Hello, {session?.user?.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here is your complete transaction statement
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
                  <h3 className={`text-sm font-medium ${stat.name === 'Total Balance' ? 'text-blue-600' : stat.name === 'Income' ? 'text-green-600' : 'text-gray-500'}`}>
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

      {/* Transactions table */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Transaction Statement
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Complete list of your transactions
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BRL Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction: Transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.transaction_type === 'expense' ? '-' : ''}{Number(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">
                      R$ {(transaction.amount * transaction.exchange_rate).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {transaction.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {pagination.currentPage} of {pagination.totalPages} pages
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
