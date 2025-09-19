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
  grade: string;
  term: string;
};

export type ScratchCard = {
    id: string;
    pin: string;
    isUsed: boolean;
    generatedAt: Date;
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
];

export const mockResults: Result[] = [
  { id: "R01", studentId: "S001", subject: "Mathematics", grade: "A", term: "First Term" },
  { id: "R02", studentId: "S001", subject: "English Language", grade: "A", term: "First Term" },
  { id: "R03", studentId: "S001", subject: "Basic Science", grade: "B", term: "First Term" },
];

export const mockScratchCards: ScratchCard[] = [
    { id: "C01", pin: "1234-5678-9012", isUsed: true, generatedAt: new Date('2023-09-01T10:00:00Z') },
    { id: "C02", pin: "9876-5432-1098", isUsed: false, generatedAt: new Date('2023-09-01T10:05:00Z') },
    { id: "C03", pin: "1122-3344-5566", isUsed: false, generatedAt: new Date('2023-09-01T10:10:00Z') },
]

export const mockUser = {
    student: { name: "Alice Johnson", id: "S001", class: "JSS 1", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    teacher: { name: "Mr. David Chen", email: "david.chen@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    admin: { name: "Mrs. Smith", email: "admin@example.com", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" }
}
