import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Token data:', token);
    
    console.log('Fetching dashboard data from backend...');
    
    // Fetch summary data
    console.log('Fetching current summary...');
    const summaryResponse = await fetch(`${process.env.API_URL}/transactions/summary`, {
      headers: {
        'Authorization': `Bearer ${token.accessToken}`,
        'Accept': 'application/json'
      },
    });
    if (!summaryResponse.ok) {
      console.error('Error fetching summary:', summaryResponse.status, summaryResponse.statusText);
      throw new Error('Failed to fetch summary data');
    }
    const summaryData = await summaryResponse.json();
    console.log('Current summary data:', summaryData);

    // Fetch recent transactions
    console.log('Fetching recent transactions...');
    const transactionsResponse = await fetch(`${process.env.API_URL}/transactions?limit=5&order=desc`, {
      headers: {
        'Authorization': `Bearer ${token.accessToken}`,
        'Accept': 'application/json'
      },
    });
    if (!transactionsResponse.ok) {
      console.error('Error fetching transactions:', transactionsResponse.status, transactionsResponse.statusText);
      throw new Error('Failed to fetch transactions data');
    }
    const transactionsData = await transactionsResponse.json();
    console.log('Recent transactions data:', transactionsData);
    

    // Create stats directly from current summary
    console.log('Creating stats from current summary...');
    const { total_balance, total_income, total_expenses } = summaryData;

    // Create stats
    const stats = [
      { 
        name: 'Total Balance', 
        value: `R$ ${total_balance.toFixed(2)}`,
        icon: 'BanknotesIcon'
      },
      { 
        name: 'Income', 
        value: `R$ ${total_income.toFixed(2)}`,
        icon: 'ArrowTrendingUpIcon'
      },
      { 
        name: 'Expenses', 
        value: `R$ ${total_expenses.toFixed(2)}`,
        icon: 'ArrowTrendingDownIcon'
      }
    ];

    return NextResponse.json({
      stats,
      recentTransactionsList: transactionsData.transactions || []
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
