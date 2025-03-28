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

  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      intervalId = setInterval(async () => {
        try {
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
          });

          const data = response.data.values || [];
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
          controller.error(error);
        }
      }, 5000); 
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
