import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const API_URL = process.env.API_URL || 'http://localhost:3001';

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['description', 'amount', 'currency', 'transaction_type'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (!['income', 'expense'].includes(body.transaction_type)) {
      return NextResponse.json(
        { message: 'Transaction type must be either "income" or "expense"' },
        { status: 400 }
      );
    }

    // Prepare transaction data
    const exchangeRate = body.currency === 'BRL' 
      ? 1 
      : parseFloat(body.exchange_rate) || 1;
      
    if (isNaN(exchangeRate) || exchangeRate <= 0) {
      return NextResponse.json(
        { message: 'Exchange rate must be a positive number' },
        { status: 400 }
      );
    }

    const transactionData = {
      description: String(body.description).trim(),
      amount: amount,
      currency: String(body.currency),
      exchange_rate: exchangeRate,
      transaction_type: body.transaction_type,
      transaction_date: body.transaction_date || new Date().toISOString(),
    };

    // Forward to backend API
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(transactionData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Error creating transaction' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
