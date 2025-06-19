// src/app/admin/subjects/new/page.tsx
import { SubjectForm } from '@/components/admin/subjects/subject-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function NewSubjectPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Subject</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/subjects">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
      </div>
      <SubjectForm />
    </div>
  );
}
