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

    // Get query parameters
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';

    console.log('Fetching statement data from backend...');
    
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

    // Fetch transactions with pagination
    console.log('Fetching transactions...');
    const transactionsResponse = await fetch(`${process.env.API_URL}/transactions?limit=${limit}&page=${page}&order=desc`, {
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
    console.log('Transactions data:', transactionsData);

    return NextResponse.json({
      summary: summaryData,
      transactions: transactionsData.transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: transactionsData.totalPages,
        totalItems: transactionsData.totalItems
      }
    });

  } catch (error) {
    console.error('Error fetching statement data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statement data' },
      { status: 500 }
    );
  }
}
