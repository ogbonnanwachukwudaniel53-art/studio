

export type Student = {
  id: string;
  name: string;
  class: string;
};

export type Subject = {
  id: string;
  name: string;
};

export type Result = {
  id: string;
  studentId: string;
  subject: string;
  caScore: number;
  examScore: number;
  grade: string;
  term: string;
};

export type ScratchCard = {
    id: string;
    pin: string;
    used: boolean;
    assignedTo: string | null;
    term: string;
    session: string;
}

export type Subscription = {
  id:string;
  studentId: string;
  studentName: string;
  status: "Active" | "Inactive";
  nextBillingDate: Date;
}

export type ErrorReport = {
    id: string;
    studentId: string;
    studentName: string;
    subject: string;
    message: string;
    reportedAt: Date;
    status: "Pending" | "Resolved";
}


export const mockStudents: Student[] = [
  { id: "S001", name: "Alice Johnson", class: "JSS 1" },
  { id: "S002", name: "Bob Williams", class: "JSS 1" },
  { id: "S003", name: "Charlie Brown", class: "JSS 2" },
];

export const mockSubjects: Subject[] = [
  { id: "SUB01", name: "Mathematics" },
  { id: "SUB02", name: "English Language" },
  { id: "SUB03", name: "Basic Science" },
  { id: "SUB04", name: "Social Studies" },
  { id: "SUB05", name: "Physics" },
];

export const mockResults: Result[] = [
  { id: "R01", studentId: "S001", subject: "Mathematics", caScore: 35, examScore: 50, grade: "A", term: "First Term" },
  { id: "R02", studentId: "S001", subject: "English Language", caScore: 38, examScore: 55, grade: "A", term: "First Term" },
  { id: "R03", studentId: "S001", subject: "Basic Science", caScore: 28, examScore: 38, grade: "B", term: "First Term" },
];

export const mockScratchCards: ScratchCard[] = [];


// Dates for subscriptions
const farFutureDate = new Date();
farFutureDate.setFullYear(farFutureDate.getFullYear() + 1);

const nearFutureDate = new Date();
nearFutureDate.setDate(nearFutureDate.getDate() + 15); // 15 days from now

const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 20); // 20 days ago


export const mockSubscriptions: Subscription[] = [
    { id: "SUB1", studentId: "S001", studentName: "Alice Johnson", status: "Active", nextBillingDate: farFutureDate},
    { id: "SUB2", studentId: "S002", studentName: "Bob Williams", status: "Active", nextBillingDate: nearFutureDate},
    { id: "SUB3", studentId: "S003", studentName: "Charlie Brown", status: "Inactive", nextBillingDate: pastDate},
]

export const mockErrorReports: ErrorReport[] = [
    { id: "ER01", studentId: "S001", studentName: "Alice Johnson", subject: "Basic Science", message: "I believe my grade should be 'A', not 'B'. I scored 95% on the final exam.", reportedAt: new Date(new Date().setDate(new Date().getDate() - 1)), status: "Pending"},
    { id: "ER02", studentId: "S003", studentName: "Charlie Brown", subject: "Mathematics", message: "My attendance score was not included in the final grade calculation.", reportedAt: new Date(new Date().setDate(new Date().getDate() - 3)), status: "Resolved"},
]


export const mockUser = {
    student: { name: "Alice Johnson", id: "S001", class: "JSS 1" },
    teacher: { name: "Mr. David Chen", email: "david.chen@example.com" },
    admin: { name: "Admin User", email: "admin@eduresult.pro", password: "admin123", pin: "12345" }
}
