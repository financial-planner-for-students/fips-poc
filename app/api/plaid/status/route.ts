import { plaidClient } from '@/lib/plaid';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Get access token from your database for the current user
    const accessToken = await getStoredAccessToken();
    
    if (!accessToken) {
      return NextResponse.json({ connected: false });
    }

    const authResponse = await plaidClient.authGet({
      access_token: accessToken,
    });

    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: authResponse.data.item.institution_id,
      country_codes: ['US'],
    });

    return NextResponse.json({
      connected: true,
      institution: {
        name: institutionResponse.data.institution.name,
        institution_id: institutionResponse.data.institution.institution_id,
      },
      accounts: authResponse.data.accounts,
    });
  } catch (error) {
    console.error('Error fetching Plaid status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connection status' },
      { status: 500 }
    );
  }
}