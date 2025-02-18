import { plaidClient } from '@/lib/plaid';
import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';

export async function POST() {
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'Your App Name',
      products: [Products.Auth, Products.Balance, Products.Balance],
      country_codes: [CountryCode.Ca],
      language: 'en',
    });

    return NextResponse.json({ link_token: createTokenResponse.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}