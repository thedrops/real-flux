'use client';

import { useSession } from 'next-auth/react';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const stats = [
  { 
    name: 'Saldo Total', 
    value: 'R$ 24.500,00', 
    change: '+4.75%',
    changeType: 'positive',
    icon: BanknotesIcon 
  },
  { 
    name: 'Receitas', 
    value: 'R$ 12.300,00', 
    change: '+12.3%',
    changeType: 'positive',
    icon: ArrowTrendingUpIcon 
  },
  { 
    name: 'Despesas', 
    value: 'R$ 7.800,00', 
    change: '-2.4%',
    changeType: 'negative',
    icon: ArrowTrendingDownIcon 
  },
  { 
    name: 'Investimentos', 
    value: 'R$ 4.400,00', 
    change: '+8.1%',
    changeType: 'positive',
    icon: ChartBarIcon 
  },
];

const recentTransactions = [
  {
    id: 1,
    name: 'Salário',
    amount: 'R$ 5.000,00',
    type: 'credit',
    category: 'Receita',
    date: '12 Abr, 2025',
  },
  {
    id: 2,
    name: 'Aluguel',
    amount: 'R$ 1.200,00',
    type: 'debit',
    category: 'Moradia',
    date: '10 Abr, 2025',
  },
  {
    id: 3,
    name: 'Supermercado',
    amount: 'R$ 450,00',
    type: 'debit',
    category: 'Alimentação',
    date: '09 Abr, 2025',
  },
];

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Olá, {session?.user?.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Aqui está um resumo das suas finanças
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </h3>
                  <p className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent transactions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Transações Recentes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Últimas movimentações na sua conta
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list">
            {recentTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="relative flex items-center gap-x-4 px-6 py-4 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.name}
                    </p>
                    <p className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'debit' ? '-' : ''}{transaction.amount}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                    <p>{transaction.category}</p>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <p>{transaction.date}</p>
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
