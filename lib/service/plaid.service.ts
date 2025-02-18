"use server"

import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";
import { config } from "../config";
import { NextResponse } from "next/server";

export const getAuthToken = async () => {
    const supportedCountries: CountryCode[] = [CountryCode.Ca]
    const requestedProducts: Products[] = [Products.Balance, Products.Auth, Products.Statements]

    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: process.env.PLAID_USER_ID! },
            client_name: 'fips',
            products: requestedProducts,
            country_codes: supportedCountries,
            language: 'en'
        })
        return NextResponse.json({ link_token: response.data.link_token })
    } catch(err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Failed to create link token' },
            { status: 500 }
          );
    }
}