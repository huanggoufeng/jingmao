// src/app/admin/subjects/page.tsx
import { SubjectTable } from '@/components/admin/subjects/subject-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import Link

// Define a type for Subject for clarity, though it might come from API client later
export interface Subject {
  id: number;
  name: string;
  description?: string | null;
  // Add other fields if necessary, like createdAt, updatedAt
}

async function getSubjects(): Promise<Subject[]> {
  // In a real app, NEXT_PUBLIC_APP_URL should be in .env.local
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${appUrl}/api/admin/subjects`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch subjects: ${res.statusText} (status: ${res.status})`);
    }
    const data = await res.json();
    return data as Subject[];
  } catch (error) {
    console.error("Error in getSubjects:", error);
    // Return an empty array or handle error as appropriate for your UI
    // You might want to throw the error to be caught by an ErrorBoundary or display a message
    return [];
  }
}

export default async function AdminSubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Subjects</h1>
        {/* Button to navigate to a new subject page (to be created) */}
        {/* For now, this button won't do much other than be a placeholder */}
        <Button asChild>
          <Link href="/admin/subjects/new">Add New Subject</Link>
        </Button>
      </div>
      <SubjectTable subjects={subjects} />
    </div>
  );
}
