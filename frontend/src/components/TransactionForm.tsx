'use client';

import { useState, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
}

export default function TransactionForm({ isOpen, onClose, onTransactionCreated }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'BRL',
    exchange_rate: '1.00',
    transaction_type: 'expense' as 'expense' | 'income',
  });
  
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Toggle exchange rate visibility based on currency
    if (name === 'currency') {
      setShowExchangeRate(value !== 'BRL');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (value: string | undefined) => {
    if (value === undefined || value === '') {
      setFormData(prev => ({
        ...prev,
        amount: '',
      }));
      return;
    }

    // Allow only numbers and one comma
    const cleanValue = value
      .replace(/[^0-9,]/g, '') // Keep only numbers and comma
      .replace(/(\d*),(\d*),/g, '$1$2'); // Remove extra commas

    setFormData(prev => ({
      ...prev,
      amount: cleanValue,
    }));
  };

  const formatDisplay = (value: string): string => {
    if (!value) return '';
    // Format with thousand separators
    const parts = value.split(',');
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Add decimal part if exists
    return parts[1] ? `${integerPart},${parts[1]}` : integerPart;
  };

  const parseAmount = (value: string): number => {
    if (!value) return 0;
    // Replace comma with dot for parsing
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  const getCurrencyConfig = useCallback(() => {
    switch (formData.currency) {
      case 'BRL':
        return {
          decimalSeparator: ',',
          groupSeparator: '.',
          prefix: 'R$ ',
          decimalScale: 2,
        };
      case 'EUR':
        return {
          decimalSeparator: ',',
          groupSeparator: '.',
          prefix: '€ ',
          decimalScale: 2,
        };
      case 'USD':
      default:
        return {
          decimalSeparator: '.',
          groupSeparator: ',',
          prefix: '$ ',
          decimalScale: 2,
        };
    }
  }, [formData.currency]);

  const formatAmountForDisplay = (value: string): string => {
    if (!value) return '';
    // Format with thousand separators and 2 decimal places
    const numberValue = parseAmount(value);
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.description || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (status === 'loading') {
      setError('Loading session...');
      return;
    }

    if (status === 'unauthenticated' || !session?.user?.accessToken) {
      setError('Please log in to create a transaction');
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = parseAmount(formData.amount);
      
      if (amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          amount: amount,
          transaction_date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transaction');
      }

      // Reset form and close modal
      setFormData({
        description: '',
        amount: '',
        currency: 'BRL',
        exchange_rate: '1.00',
        transaction_type: 'expense',
      });
      onTransactionCreated();
      onClose();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Add New Transaction</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  placeholder="0,00"
                  value={formatDisplay(formData.amount)}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Moeda
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              
              {showExchangeRate && (
                <div>
                  <label htmlFor="exchange_rate" className="block text-sm font-medium text-gray-700">
                    Exchange Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    id="exchange_rate"
                    name="exchange_rate"
                    value={formData.exchange_rate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-2"
                    placeholder="Ex: 5.20"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  formData.transaction_type === 'expense'
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'expense' as const }))}
                disabled={isSubmitting}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  formData.transaction_type === 'income'
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'income' }))}
                disabled={isSubmitting}
              >
                Income
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
