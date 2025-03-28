import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function GET() {
  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID!;
  const range = 'Sheet1!A:Z';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return NextResponse.json(response.data.values || []);
  } catch (error: any) {
    return NextResponse.json({ error: `Error fetching sheet data: ${error.message}` }, { status: 500 });
  }
}
