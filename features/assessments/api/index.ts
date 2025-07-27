import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // TODO: Implement assessment listing logic
    return NextResponse.json({ message: 'Assessments API endpoint' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
