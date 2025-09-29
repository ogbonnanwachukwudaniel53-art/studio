
'use server';
/**
 * @fileOverview A flow for creating a new teacher account in Firebase Auth.
 *
 * - createTeacher - A function that handles creating the user.
 * - CreateTeacherInput - The input type for the function.
 * - CreateTeacherOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, type ServiceAccount } from 'firebase-admin/app';

const CreateTeacherInputSchema = z.object({
  email: z.string().email().describe('The email address for the new teacher.'),
  name: z.string().describe('The full name of the new teacher.'),
});
export type CreateTeacherInput = z.infer<typeof CreateTeacherInputSchema>;

const CreateTeacherOutputSchema = z.object({
  uid: z.string().describe('The new user\'s UID.'),
  email: z.string().email().describe('The new user\'s email.'),
  tempPass: z.string().describe('The auto-generated temporary password.'),
});
export type CreateTeacherOutput = z.infer<typeof CreateTeacherOutputSchema>;

// Initialize Firebase Admin SDK if it hasn't been already
function getFirebaseAdminApp(): App {
    if (getApps().length) {
        return getApps()[0];
    }
     const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    return initializeApp({
        credential: {
            // @ts-ignore
            getAccessToken: () => ({
                expires_in: 0,
                access_token: '',
            }),
            getCertificate: () => serviceAccount,
        },
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

export async function createTeacher(input: CreateTeacherInput): Promise<CreateTeacherOutput> {
  return createTeacherFlow(input);
}

// Generates a random password
const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};


const createTeacherFlow = ai.defineFlow(
  {
    name: 'createTeacherFlow',
    inputSchema: CreateTeacherInputSchema,
    outputSchema: CreateTeacherOutputSchema,
  },
  async (input) => {
    getFirebaseAdminApp();
    const auth = getAuth();
    
    const tempPass = generatePassword();

    try {
      const userRecord = await auth.createUser({
        email: input.email,
        emailVerified: true,
        password: tempPass,
        displayName: input.name,
        disabled: false,
      });

      return {
        uid: userRecord.uid,
        email: userRecord.email!,
        tempPass: tempPass,
      };
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            throw new Error('A user with this email address already exists.');
        } else if (error.code === 'auth/invalid-email') {
             throw new Error('The email address is not valid.');
        }
        console.error('Error creating new user:', error);
        throw new Error('An unexpected error occurred while creating the teacher account.');
    }
  }
);
