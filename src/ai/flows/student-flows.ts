
'use server';
/**
 * @fileOverview Flows for managing student data in Firestore.
 *
 * - Student - The Zod schema and type for a student.
 * - getStudents - Retrieves all students from Firestore.
 * - createStudent - Creates a new student in Firestore.
 * - updateStudent - Updates an existing student in Firestore.
 * - deleteStudent - Deletes a student from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// Zod schema for student data
export const StudentSchema = z.object({
  id: z.string().describe("The student's unique registration number."),
  name: z.string().describe("The student's full name."),
  class: z.string().describe("The student's current class."),
});
export type Student = z.infer<typeof StudentSchema>;

// Input schema for creating a student (ID is auto-generated)
const CreateStudentInputSchema = z.object({
  name: z.string(),
  class: z.string(),
});
export type CreateStudentInput = z.infer<typeof CreateStudentInputSchema>;

// Input schema for deleting a student
const DeleteStudentInputSchema = z.object({
    id: z.string(),
});
export type DeleteStudentInput = z.infer<typeof DeleteStudentInputSchema>;


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


// Exported wrapper functions
export async function getStudents(): Promise<Student[]> {
  return getStudentsFlow();
}

export async function createStudent(input: CreateStudentInput): Promise<Student> {
  return createStudentFlow(input);
}

export async function updateStudent(input: Student): Promise<void> {
  return updateStudentFlow(input);
}

export async function deleteStudent(input: DeleteStudentInput): Promise<void> {
  return deleteStudentFlow(input);
}


// Genkit flow to get all students
const getStudentsFlow = ai.defineFlow(
  {
    name: 'getStudentsFlow',
    inputSchema: z.void(),
    outputSchema: z.array(StudentSchema),
  },
  async () => {
    getFirebaseAdminApp();
    const db = getFirestore();
    const studentsSnapshot = await db.collection('students').get();
    
    const students: Student[] = [];
    studentsSnapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() } as Student);
    });

    return students.sort((a, b) => a.id.localeCompare(b.id));;
  }
);

// Genkit flow to create a new student
const createStudentFlow = ai.defineFlow(
  {
    name: 'createStudentFlow',
    inputSchema: CreateStudentInputSchema,
    outputSchema: StudentSchema,
  },
  async ({ name, 'class': studentClass }) => {
    getFirebaseAdminApp();
    const db = getFirestore();

    // Generate a new registration number
    const studentsCollection = db.collection('students');
    const lastStudentSnapshot = await studentsCollection.orderBy('id', 'desc').limit(1).get();
    let newIdNumber = 1;
    if (!lastStudentSnapshot.empty) {
        const lastId = lastStudentSnapshot.docs[0].id;
        const lastNumber = parseInt(lastId.replace('S', ''), 10);
        newIdNumber = lastNumber + 1;
    }
    const newStudentId = `S${String(newIdNumber).padStart(3, '0')}`;

    const newStudent: Student = {
      id: newStudentId,
      name,
      class: studentClass,
    };

    await studentsCollection.doc(newStudentId).set(newStudent);
    return newStudent;
  }
);

// Genkit flow to update a student
const updateStudentFlow = ai.defineFlow(
  {
    name: 'updateStudentFlow',
    inputSchema: StudentSchema,
    outputSchema: z.void(),
  },
  async (student) => {
    getFirebaseAdminApp();
    const db = getFirestore();
    
    const { id, ...dataToUpdate } = student;
    await db.collection('students').doc(id).update(dataToUpdate);
  }
);

// Genkit flow to delete a student
const deleteStudentFlow = ai.defineFlow(
  {
    name: 'deleteStudentFlow',
    inputSchema: DeleteStudentInputSchema,
    outputSchema: z.void(),
  },
  async ({ id }) => {
    getFirebaseAdminApp();
    const db = getFirestore();
    await db.collection('students').doc(id).delete();
  }
);

    