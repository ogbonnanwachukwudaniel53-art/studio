
'use server';
/**
 * @fileOverview A flow for updating a teacher's details in Firebase Auth.
 *
 * - updateTeacher - A function that handles updating the user.
 * - UpdateTeacherInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

const UpdateTeacherInputSchema = z.object({
  uid: z.string().describe("The UID of the teacher to update."),
  displayName: z.string().optional().describe("The new display name for the teacher."),
  disabled: z.boolean().optional().describe("The new disabled status for the teacher."),
});
export type UpdateTeacherInput = z.infer<typeof UpdateTeacherInputSchema>;

// Initialize Firebase Admin SDK if it hasn't been already
function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Firebase service account credentials are not set in environment variables.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}


export async function updateTeacher(input: UpdateTeacherInput): Promise<void> {
  return updateTeacherFlow(input);
}


const updateTeacherFlow = ai.defineFlow(
  {
    name: 'updateTeacherFlow',
    inputSchema: UpdateTeacherInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    getFirebaseAdminApp();
    const auth = getAuth();
    
    const { uid, ...dataToUpdate } = input;

    // Filter out undefined values so we only update what's provided
    const updatePayload: { [key: string]: any } = {};
    if (dataToUpdate.displayName !== undefined) {
      updatePayload.displayName = dataToUpdate.displayName;
    }
    if (dataToUpdate.disabled !== undefined) {
      updatePayload.disabled = dataToUpdate.disabled;
    }

    if (Object.keys(updatePayload).length === 0) {
        // Nothing to update
        return;
    }

    try {
      await auth.updateUser(uid, updatePayload);
    } catch (error: any) {
        console.error('Error updating user:', error);
        throw new Error('An unexpected error occurred while updating the teacher account.');
    }
  }
);

    