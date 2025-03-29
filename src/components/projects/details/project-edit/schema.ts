
import { z } from 'zod';

// Define project type as an enum to match database expectations
export const ProjectType = {
  NewBuild: "New Build",
  Remodel: "Remodel",
  Other: "Other"
} as const;

// Create a schema for form validation
export const formSchema = z.object({
  project_name: z.string().min(1, { message: 'Project name is required' }),
  client: z.string().optional(),
  location: z.string().optional(),
  due_date: z.string().optional(),
  project_type: z.enum(["New Build", "Remodel", "Other"]),
  status: z.string(),
  progress: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).max(100)
  ),
});

export type FormValues = z.infer<typeof formSchema>;

// Helper function to ensure project type matches one of the allowed values
export const validateProjectType = (type: string): "New Build" | "Remodel" | "Other" => {
  if (type === "New Build" || type === "Remodel" || type === "Other") {
    return type;
  }
  // Default to "Other" if not a valid type
  return "Other";
};

// Helper to format date for the form input
export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'No due date') {
    return '';
  }
  
  try {
    const dateObj = new Date(dateString);
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error parsing date:', error);
    return '';
  }
};
