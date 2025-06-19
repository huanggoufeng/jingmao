// src/components/admin/subjects/subject-table.tsx
'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'; // Added Edit, Trash2, Eye icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // Not used as dialog is controlled
  // DialogFooter, // Not used as form has its own save/cancel
  // DialogClose // Not used
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { SubjectForm } from './subject-form'; // Import the form

// Define Subject type locally or import from a shared types file
export interface Subject {
  id: number;
  name: string;
  description?: string | null;
}

interface SubjectTableProps {
  subjects: Subject[];
}

export function SubjectTable({ subjects }: SubjectTableProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleEditOpen = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedSubject(null);
  };

  const handleSaveSuccess = () => {
    handleEditClose();
    router.refresh(); // Refresh data on the page
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const res = await fetch(`${appUrl}/api/admin/subjects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete subject' }));
        throw new Error(errorData.error || `Failed to delete subject: ${res.statusText}`);
      }

      toast.success("Subject deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error(`Error deleting subject: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <Table>
        <TableCaption>A list of your subjects. ({subjects.length} total)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No subjects found.
              </TableCell>
            </TableRow>
          )}
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.description || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => toast.info('View details not implemented yet.')}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditOpen(subject)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(subject.id)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSubject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>
                Make changes to the subject details here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <SubjectForm
              initialData={{
                id: selectedSubject.id,
                name: selectedSubject.name,
                description: selectedSubject.description || '',
              }}
              onSave={handleSaveSuccess}
            />
            {/* Footer can be removed if SubjectForm handles its own buttons appropriately in dialog mode */}
            {/* Or, SubjectForm can be adapted to not show buttons if onSave is passed */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
