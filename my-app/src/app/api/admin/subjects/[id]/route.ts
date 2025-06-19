import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    // Placeholder: Replace with actual database query
    const subject = await db.select().from(subjects).where(eq(subjects.id, id));

    if (!subject || subject.length === 0) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json(subject[0]);
  } catch (error) {
    console.error(`Error fetching subject ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch subject' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    const data = await request.json();
    // Basic validation
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required for update' }, { status: 400 });
    }

    // Placeholder: Replace with actual database update
    const updatedSubject = await db.update(subjects)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(subjects.id, id))
      .returning();

    if (!updatedSubject || updatedSubject.length === 0) {
      return NextResponse.json({ error: 'Subject not found or not updated' }, { status: 404 });
    }
    return NextResponse.json(updatedSubject[0]);
  } catch (error) {
    console.error(`Error updating subject ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    // Placeholder: Replace with actual database delete
    const deletedSubject = await db.delete(subjects)
      .where(eq(subjects.id, id))
      .returning();

    if (!deletedSubject || deletedSubject.length === 0) {
      return NextResponse.json({ error: 'Subject not found or not deleted' }, { status: 404 });
    }
    // Return a 204 No Content response or the deleted item
    return NextResponse.json({ message: 'Subject deleted successfully' });
    // return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting subject ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}
