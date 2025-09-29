
'use server';
/**
 * @fileOverview A flow for retrieving all teacher accounts from Firebase Auth.
 *
 * - getTeachers - A function that returns a list of all teachers.
 * - Teacher - The type representing a teacher user record.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

const TeacherSchema = z.object({
  uid: z.string(),
  email: z.string().email().optional().nullable(),
  displayName: z.string().optional().nullable(),
  disabled: z.boolean(),
});
export type Teacher = z.infer<typeof TeacherSchema>;

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

export async function getTeachers(): Promise<Teacher[]> {
  return getTeachersFlow();
}

const getTeachersFlow = ai.defineFlow(
  {
    name: 'getTeachersFlow',
    inputSchema: z.void(),
    outputSchema: z.array(TeacherSchema),
  },
  async () => {
    getFirebaseAdminApp();
    const auth = getAuth();

    try {
      const listUsersResult = await auth.listUsers();
      const teachers: Teacher[] = listUsersResult.users.map((user: UserRecord) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        disabled: user.disabled,
      }));
      return teachers;
    } catch (error: any) {
        console.error('Error listing users:', error);
        throw new Error('An unexpected error occurred while fetching the teacher list.');
    }
  }
);
