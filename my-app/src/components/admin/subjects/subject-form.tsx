// src/components/admin/subjects/subject-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Added for description
// import { useToast } from '@/components/ui/use-toast'; // From original shadcn/ui
import { toast } from "sonner" // Using sonner as per previous subtask report
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const subjectFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

// Props might include an initial subject for editing later
interface SubjectFormProps {
  initialData?: SubjectFormValues & { id?: number }; // For editing
  onSave?: () => void; // Callback for when save is successful (e.g. to close a dialog)
}

export function SubjectForm({ initialData, onSave }: SubjectFormProps) {
  // const { toast: shadcnToast } = useToast(); // Original toast
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  });

  async function onSubmit(data: SubjectFormValues) {
    setIsSubmitting(true);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const method = initialData?.id ? 'PUT' : 'POST';
    const url = initialData?.id
      ? `${appUrl}/api/admin/subjects/${initialData.id}`
      : `${appUrl}/api/admin/subjects`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Failed to save subject: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(initialData?.id ? 'Subject updated successfully!' : 'Subject created successfully!');

      if (onSave) {
        onSave(); // Call this if provided (e.g., to close dialog)
      } else {
        router.push('/admin/subjects'); // Redirect to the list page
        router.refresh(); // Refresh the list page to show the new/updated item
      }
    } catch (error) {
      console.error('Failed to save subject:', error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics" {...field} />
              </FormControl>
              <FormDescription>
                The name of the subject.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the subject."
                  className="resize-none"
                  {...field}
                  // value={field.value || ''} // Ensure value is not null
                />
              </FormControl>
              <FormDescription>
                Provide some details about the subject.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData?.id ? 'Saving...' : 'Creating...') : (initialData?.id ? 'Save Changes' : 'Create Subject')}
          </Button>
          {!onSave && ( // Show cancel button only if not used in a dialog with its own close
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
