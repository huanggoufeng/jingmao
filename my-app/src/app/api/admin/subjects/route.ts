import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';
import { eq, asc, desc, ilike } from 'drizzle-orm'; // Import operators

export async function GET(request: Request) {
  try {
    // Placeholder: Replace with actual database query
    const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.id));
    return NextResponse.json(allSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Basic validation
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    // Placeholder: Replace with actual database insert
    const newSubject = await db.insert(subjects).values({
      name: data.name,
      description: data.description,
    }).returning();
    return NextResponse.json(newSubject[0], { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
