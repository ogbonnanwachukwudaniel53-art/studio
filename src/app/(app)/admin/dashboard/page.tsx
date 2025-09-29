
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockSubjects, type Subject, type Subscription, type ScratchCard } from "@/lib/mock-data";
import {
  Home,
  Users,
  BookUser,
  CreditCard,
  Ticket,
  PlusCircle,
  Trash2,
  History,
  User,
  ListChecks,
  Lock,
  Unlock,
  Book,
  PenSquare,
  Building,
  Save,
  X,
  MoreVertical,
  Eye,
  ArrowUpRight,
  LoaderCircle,
  ClipboardCopy,
  ClipboardCheck,
  MessageSquareWarning
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { ErrorReporting } from "@/components/features/admin/error-reporting";
import { Switch } from "@/components/ui/switch";
import { useResults } from "@/lib/results-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSchool } from "@/lib/school-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendPasswordResetEmail } from "@/ai/flows/send-reset-email-flow";
import { createTeacher, type CreateTeacherOutput } from "@/ai/flows/create-teacher-flow";
import { getTeachers, type Teacher as FirebaseTeacher } from "@/ai/flows/get-teachers-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createStudent, getStudents, updateStudent, deleteStudent, type Student } from "@/ai/flows/student-flows";
import { updateTeacher } from "@/ai/flows/update-teacher-flow";


type Assignment = {
    id: string;
    teacherId: string;
    teacherName: string;
    subjectId: string;
    subjectName: string;
    classId: string;
};

const classesData = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

function ResultsManagementTab() {
    const { areResultsOnHold, setAreResultsOnHold } = useResults();
    const { toast } = useToast();

    const handleToggle = (checked: boolean) => {
        setAreResultsOnHold(checked);
        toast({
            title: checked ? "Results On Hold" : "Results Released",
            description: checked ? "Students will not be able to view their results." : "Students can now view their results.",
            variant: checked ? "destructive" : "default"
        });
    }
    
    return (
        <Card id="results-management">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ListChecks className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Results Management</CardTitle>
                </div>
                <CardDescription>Control the visibility of student results across the entire system.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="results-toggle" className="text-base font-medium">
                            Hold All Results
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            When enabled, students will not be able to check their results.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <Switch
                            id="results-toggle"
                            checked={areResultsOnHold}
                            onCheckedChange={handleToggle}
                            aria-label="Hold or Release Results"
                        />
                        <Unlock className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ErrorReportingTab() {
    return <ErrorReporting />;
}

function DashboardView() {
    const { schoolName } = useSchool();
    const [teacherCount, setTeacherCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);


    useEffect(() => {
        async function fetchCounts() {
            try {
                const [fetchedTeachers, fetchedStudents] = await Promise.all([
                    getTeachers(),
                    getStudents()
                ]);
                setTeacherCount(fetchedTeachers.length);
                setStudentCount(fetchedStudents.length);
            } catch (error) {
                console.error("Failed to fetch dashboard counts:", error);
            }
        }
        fetchCounts();
    }, []);
    
    const stats = [
        { title: "Total Students", value: studentCount, icon: <Users className="h-6 w-6 text-primary" /> },
        { title: "Total Teachers", value: teacherCount, icon: <BookUser className="h-6 w-6 text-primary" /> },
        { title: "Total Classes", value: classesData.length, icon: <Building className="h-6 w-6 text-primary" /> },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Building className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">{schoolName}</CardTitle>
                    </div>
                    <CardDescription>A quick snapshot of the entire school.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                             <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s`}}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    {stat.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="space-y-6">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}><ResultsManagementTab /></div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}><ErrorReportingTab /></div>
                </div>
            </div>
        </div>
    );
}

function UserManagementTab() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<FirebaseTeacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [editingTeacher, setEditingTeacher] = useState<FirebaseTeacher | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            const [fetchedTeachers, fetchedStudents] = await Promise.all([
                getTeachers(),
                getStudents()
            ]);
            setTeachers(fetchedTeachers);
            setStudents(fetchedStudents);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast({
                title: "Failed to load user data",
                description: "Could not retrieve users from the server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllUsers();
    }, [toast]);
    
    const handleUpdateTeacher = async (updatedTeacher: FirebaseTeacher) => {
        try {
            await updateTeacher({
                uid: updatedTeacher.uid,
                displayName: updatedTeacher.displayName,
                disabled: updatedTeacher.disabled
            });
            setTeachers(prev => prev.map(t => t.uid === updatedTeacher.uid ? updatedTeacher : t));
            toast({ title: "Teacher Updated", description: `${updatedTeacher.displayName}'s details have been saved.` });
            setEditingTeacher(null);
        } catch (error) {
            toast({ title: "Update Failed", description: "Could not update teacher details.", variant: "destructive" });
        }
    };

    const handleUpdateStudent = async (updatedStudent: Student) => {
        try {
            await updateStudent(updatedStudent);
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            toast({ title: "Student Updated", description: `${updatedStudent.name}'s details have been saved.` });
            setEditingStudent(null);
        } catch (error) {
            toast({ title: "Update Failed", description: "Could not update student details.", variant: "destructive" });
        }
    };

    const handleAddStudent = async (newStudentData: { name: string; class: string }) => {
        try {
            const newStudent = await createStudent(newStudentData);
            setStudents(prev => [...prev, newStudent]);
            toast({ title: "Student Added", description: `${newStudent.name} has been added to the school.` });
            setIsAddStudentOpen(false);
        } catch (error) {
             toast({ title: "Failed to Add Student", description: "An error occurred while adding the student.", variant: "destructive" });
        }
    };
    
    const handleAddTeacher = (newTeacher: CreateTeacherOutput & { name: string }) => {
        const newFirebaseTeacher: FirebaseTeacher = {
            uid: newTeacher.uid,
            email: newTeacher.email,
            displayName: newTeacher.name,
            disabled: false,
        };
        setTeachers(prev => [...prev, newFirebaseTeacher]);
    };

    const handleRemoveStudent = async (studentId: string) => {
        const studentName = students.find(s => s.id === studentId)?.name;
        try {
            await deleteStudent({ id: studentId });
            setStudents(prev => prev.filter(s => s.id !== studentId));
            toast({ title: "Student Removed", description: `${studentName} has been removed.`, variant: "destructive" });
        } catch (error) {
            toast({ title: "Removal Failed", description: "Could not remove the student.", variant: "destructive" });
        }
    }

    const handleDeactivateTeacher = async (teacher: FirebaseTeacher) => {
        try {
            const updatedTeacher = { ...teacher, disabled: true };
            await updateTeacher({ uid: teacher.uid, disabled: true });
            setTeachers(prev => prev.map(t => t.uid === teacher.uid ? updatedTeacher : t));
            toast({ title: "Teacher Deactivated", variant: "destructive" });
        } catch (error) {
             toast({ title: "Deactivation Failed", description: "Could not deactivate the teacher.", variant: "destructive" });
        }
    }

    const handleResetPassword = async (email: string) => {
        if (!email) {
            toast({
                title: "Error",
                description: "This teacher does not have an email to send a reset link to.",
                variant: "destructive",
            });
            return;
        }
        try {
            await sendPasswordResetEmail({ email });
            toast({
                title: "Password Reset Email Sent",
                description: `A reset link has been sent to ${email}.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send password reset email.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Card id="user-management">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">User Management</CardTitle>
                    </div>
                    <CardDescription>Add, remove, and manage teachers and students from one central place.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="teachers" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 sm:w-auto">
                            <TabsTrigger value="teachers"><BookUser className="mr-2 h-4 w-4" /> Teachers</TabsTrigger>
                            <TabsTrigger value="students"><User className="mr-2 h-4 w-4" /> Students</TabsTrigger>
                        </TabsList>
                        <div className="pt-6">
                            <TabsContent value="teachers">
                                <div className="flex justify-end mb-4">
                                     <Button onClick={() => setIsAddTeacherOpen(true)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Teacher
                                    </Button>
                                </div>
                                <div className="rounded-md border max-h-96 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center">
                                                        <LoaderCircle className="mx-auto animate-spin" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : teachers.map(teacher => (
                                                <TableRow key={teacher.uid}>
                                                    <TableCell className="font-medium">{teacher.displayName || 'N/A'}</TableCell>
                                                    <TableCell>{teacher.email || 'N/A'}</TableCell>
                                                    <TableCell><Badge variant={!teacher.disabled ? 'default' : 'secondary'} className={!teacher.disabled ? 'bg-green-600' : ''}>{!teacher.disabled ? 'active' : 'inactive'}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => setEditingTeacher(teacher)}>
                                                                    Edit Teacher
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleResetPassword(teacher.email || '')}>
                                                                    Reset Password
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivateTeacher(teacher)}>
                                                                    Deactivate Teacher
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                            <TabsContent value="students">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => setIsAddStudentOpen(true)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Student
                                    </Button>
                                </div>
                                <div className="rounded-md border max-h-96 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Reg. Number</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Class</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center">
                                                        <LoaderCircle className="mx-auto animate-spin" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : students.map(student => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-mono">{student.id}</TableCell>
                                                    <TableCell className="font-medium">{student.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{student.class}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                                                                    Edit Student
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveStudent(student.id)}>
                                                                    Remove Student
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <EditTeacherDialog teacher={editingTeacher} onSave={handleUpdateTeacher} onOpenChange={() => setEditingTeacher(null)} />
            <EditStudentDialog student={editingStudent} onSave={handleUpdateStudent} onOpenChange={() => setEditingStudent(null)} />
            <AddStudentDialog isOpen={isAddStudentOpen} onSave={handleAddStudent} onOpenChange={setIsAddStudentOpen} />
            <AddTeacherDialog isOpen={isAddTeacherOpen} onSave={handleAddTeacher} onOpenChange={setIsAddTeacherOpen} />

        </>
    );
}

function AddTeacherDialog({ isOpen, onSave, onOpenChange }: { isOpen: boolean, onSave: (teacher: CreateTeacherOutput & { name: string }) => void, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [createdTeacher, setCreatedTeacher] = useState<CreateTeacherOutput | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCreateTeacher = async () => {
        if (!name || !email) return;

        setIsLoading(true);
        setCreatedTeacher(null);
        try {
            const result = await createTeacher({ name, email });
            setCreatedTeacher(result);
            onSave({ ...result, name });
            setName("");
            setEmail("");
        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to Create Teacher",
                description: error instanceof Error ? error.message : "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        if (createdTeacher) {
            const textToCopy = `Email: ${createdTeacher.email}\nTemporary Password: ${createdTeacher.tempPass}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                setIsCopied(true);
                toast({ title: "Copied to Clipboard" });
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };
    
    const handleClose = () => {
        setCreatedTeacher(null);
        setName("");
        setEmail("");
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{createdTeacher ? 'Teacher Account Created' : 'Add New Teacher'}</DialogTitle>
                    <DialogDescription>
                        {createdTeacher
                            ? 'The teacher account has been created. Share these credentials securely.'
                            : 'This will create a new user in Firebase Authentication with a temporary password.'}
                    </DialogDescription>
                </DialogHeader>

                {createdTeacher ? (
                    <div className="space-y-4 py-4">
                        <Alert>
                            <AlertTitle>Credentials</AlertTitle>
                            <AlertDescription className="flex flex-col gap-2">
                                <div>Email: <span className="font-mono">{createdTeacher.email}</span></div>
                                <div>Password: <span className="font-mono">{createdTeacher.tempPass}</span></div>
                            </AlertDescription>
                        </Alert>
                        <Button variant="outline" onClick={handleCopyToClipboard} className="w-full">
                            {isCopied ? <ClipboardCheck className="mr-2" /> : <ClipboardCopy className="mr-2" />}
                            {isCopied ? 'Copied!' : 'Copy Credentials'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="teacher-name">Full Name</Label>
                            <Input id="teacher-name" placeholder="e.g., John Smith" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher-email">Email</Label>
                            <Input id="teacher-email" type="email" placeholder="teacher@school.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {createdTeacher ? (
                        <Button onClick={handleClose}>Done</Button>
                    ) : (
                        <>
                            <DialogClose asChild><Button variant="outline" disabled={isLoading}>Cancel</Button></DialogClose>
                            <Button onClick={handleCreateTeacher} disabled={isLoading || !name || !email}>
                                {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                                {isLoading ? "Creating..." : "Create Teacher"}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditTeacherDialog({ teacher, onSave, onOpenChange }: { teacher: FirebaseTeacher | null, onSave: (teacher: FirebaseTeacher) => void, onOpenChange: (open: boolean) => void }) {
    const [name, setName] = useState("");
    
    useEffect(() => {
        if (teacher) {
            setName(teacher.displayName || "");
        }
    }, [teacher]);

    const handleSave = () => {
        if (teacher) {
            onSave({ ...teacher, displayName: name });
        }
    };
    
    return (
        <Dialog open={!!teacher} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogDescription>Update the teacher's details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="teacher-name">Name</Label>
                        <Input id="teacher-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teacher-email">Email</Label>
                        <Input id="teacher-email" type="email" value={teacher?.email || ""} disabled />
                        <p className="text-xs text-muted-foreground">Email addresses cannot be changed.</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditStudentDialog({ student, onSave, onOpenChange }: { student: Student | null, onSave: (student: Student) => void, onOpenChange: (open: boolean) => void }) {
    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");

    useEffect(() => {
        if (student) {
            setName(student.name);
            setStudentClass(student.class);
        }
    }, [student]);

    const handleSave = () => {
        if (student) {
            onSave({ ...student, name, class: studentClass });
        }
    };

    return (
        <Dialog open={!!student} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>Update the student's details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="student-reg">Registration Number</Label>
                        <Input id="student-reg" value={student?.id || ""} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student-name">Name</Label>
                        <Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student-class">Class</Label>
                        <Select value={studentClass} onValueChange={setStudentClass}>
                            <SelectTrigger id="student-class"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {classesData.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddStudentDialog({ isOpen, onSave, onOpenChange }: { isOpen: boolean, onSave: (student: {name: string, class: string}) => void, onOpenChange: (open: boolean) => void }) {
    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");

    const handleSave = () => {
        if (name && studentClass) {
            onSave({ name, class: studentClass });
            setName("");
            setStudentClass("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Enter the details for the new student.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-student-name">Full Name</Label>
                        <Input id="new-student-name" placeholder="e.g., Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-student-class">Class</Label>
                         <Select onValueChange={setStudentClass} value={studentClass}>
                            <SelectTrigger id="new-student-class"><SelectValue placeholder="Select a class" /></SelectTrigger>
                            <SelectContent>
                                {classesData.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave} disabled={!name || !studentClass}>Add Student</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function SubjectManagementTab() {
    const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
    const [newSubjectName, setNewSubjectName] = useState("");
    const { toast } = useToast();

    const handleAddSubject = () => {
        if (newSubjectName.trim()) {
            const newSubject: Subject = {
                id: `SUB${Date.now()}`,
                name: newSubjectName.trim(),
            };
            setSubjects(prev => [newSubject, ...prev]);
            setNewSubjectName("");
            toast({ title: "Subject Added", description: `"${newSubject.name}" has been added to the list.` });
        }
    }

    const handleDeleteSubject = (id: string) => {
        const subjectName = subjects.find(s => s.id === id)?.name;
        setSubjects(prev => prev.filter(s => s.id !== id));
        toast({ title: "Subject Deleted", description: `"${subjectName}" has been removed.`, variant: "destructive" });
    }

    return (
        <Card id="manage-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Book className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Subject Management</CardTitle>
                </div>
                <CardDescription>Add, remove, and manage subjects offered by the school.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-md border p-4 space-y-4">
                    <Label htmlFor="new-subject" className="font-medium">Add New Subject</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            id="new-subject"
                            placeholder="e.g., Further Mathematics"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                        />
                        <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border max-h-96 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {subjects.map(subject => (
                            <TableRow key={subject.id}>
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell className="text-right">
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => handleDeleteSubject(subject.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete {subject.name}</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function SubjectAssignmentTab() {
    const { toast } = useToast();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [teachers, setTeachers] = useState<FirebaseTeacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const [fetchedTeachers] = await Promise.all([
                    getTeachers(),
                ]);
                setTeachers(fetchedTeachers.filter(t => !t.disabled));
            } catch (error) {
                console.error("Failed to fetch data for assignments:", error);
                toast({
                    title: "Failed to load data",
                    description: "Could not retrieve teachers for assignment.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [toast]);
    
    const handleClassSelection = (classId: string, isChecked: boolean) => {
        setSelectedClasses(prev => 
            isChecked ? [...prev, classId] : prev.filter(c => c !== classId)
        );
    };

    const handleSubjectSelection = (subjectId: string, isChecked: boolean) => {
        setSelectedSubjects(prev => 
            isChecked ? [...prev, subjectId] : prev.filter(s => s !== subjectId)
        );
    };

    const handleSaveAssignment = () => {
        if (!selectedTeacher || selectedSubjects.length === 0 || selectedClasses.length === 0) {
            toast({
                title: "Incomplete Assignment",
                description: "Please select a teacher, at least one subject, and at least one class.",
                variant: "destructive"
            });
            return;
        }

        const teacher = teachers.find(t => t.uid === selectedTeacher);
        
        const newAssignments: Assignment[] = [];
        selectedSubjects.forEach(subjectId => {
            const subject = subjects.find(s => s.id === subjectId);
            if (!subject) return;

            selectedClasses.forEach(classId => {
                newAssignments.push({
                    id: `ASG-${Date.now()}-${subjectId}-${classId}`, // Temporary unique ID
                    teacherId: selectedTeacher,
                    teacherName: teacher?.displayName || 'Unknown Teacher',
                    subjectId: subject.id,
                    subjectName: subject.name,
                    classId: classId
                });
            });
        });
        
        setAssignments(prev => [...prev, ...newAssignments]);

        const subjectNames = selectedSubjects.map(id => subjects.find(s => s.id === id)?.name).join(', ');
        toast({
            title: "Assignments Saved",
            description: `${subjectNames} assigned to ${teacher?.displayName} for ${selectedClasses.join(', ')}.`
        });
        
        // Reset form
        setSelectedTeacher('');
        setSelectedSubjects([]);
        setSelectedClasses([]);
    };

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <PenSquare className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Assign Subjects to Teacher</CardTitle>
                </div>
                <CardDescription>Assign teachers to specific subjects and classes, and view current assignments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="rounded-md border p-4 space-y-4">
                    <h3 className="font-medium text-lg">Create New Assignment</h3>
                    {isLoading ? (
                         <div className="text-center p-4">
                            <LoaderCircle className="mx-auto animate-spin" />
                            <p className="text-sm text-muted-foreground mt-2">Loading data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Teacher</Label>
                                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                    <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                                    <SelectContent>
                                        {teachers.map(teacher => (
                                            <SelectItem key={teacher.uid} value={teacher.uid}>{teacher.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Subjects</Label>
                                <ScrollArea className="h-40 w-full rounded-md border p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {subjects.map(subject => (
                                        <div key={subject.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`subject-${subject.id}`}
                                                checked={selectedSubjects.includes(subject.id)}
                                                onCheckedChange={(checked) => handleSubjectSelection(subject.id, !!checked)}
                                            />
                                            <label
                                                htmlFor={`subject-${subject.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {subject.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                </ScrollArea>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Classes</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 rounded-lg border p-4">
                                    {classesData.map(c => (
                                        <div key={c} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`class-${c}`}
                                                checked={selectedClasses.includes(c)}
                                                onCheckedChange={(checked) => handleClassSelection(c, !!checked)}
                                            />
                                            <label
                                                htmlFor={`class-${c}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {c}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90" 
                                    onClick={handleSaveAssignment}
                                    disabled={!selectedTeacher || selectedSubjects.length === 0 || selectedClasses.length === 0}
                                >
                                    Save Assignment(s)
                                </Button>
                            </div>
                        </div>
                    )}
                 </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                         <Eye className="h-5 w-5 text-muted-foreground" />
                         <h3 className="font-medium text-lg">Current Assignments Overview</h3>
                    </div>
                     <div className="rounded-md border max-h-96 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Assigned Teacher</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {assignments.length === 0 ? (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center h-24">No assignments created yet.</TableCell>
                                 </TableRow>
                               ) : assignments.sort((a, b) => a.classId.localeCompare(b.classId)).map((assignment) => (
                                 <TableRow key={assignment.id}>
                                    <TableCell><Badge variant="secondary">{assignment.classId}</Badge></TableCell>
                                    <TableCell className="font-medium">{assignment.subjectName}</TableCell>
                                    <TableCell>{assignment.teacherName}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                 </TableRow>
                               ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function SubscriptionManagementTab() {
  const [subscriptions] = useState<Subscription[]>([]);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active');

  return (
      <Card id="manage-subscriptions">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Subscription Management</CardTitle>
                </div>
                <CardDescription>View, renew, or create yearly app subscriptions.</CardDescription>
            </div>
            <Button asChild>
                <Link href="https://paystack.shop/pay/ecs8d7d7fa" target="_blank" rel="noopener noreferrer">
                    Make Payment
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeSubscriptions.length > 0 ? (
              <div className="max-h-96 overflow-auto rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Plan</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Renewal Date</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {activeSubscriptions.map(sub => (
                              <TableRow key={sub.id}>
                                  <TableCell className="font-medium">EduResult Pro - School Plan (Yearly)</TableCell>
                                  <TableCell>
                                      <Badge variant={sub.status === 'Active' ? 'default' : 'destructive'} className={sub.status === 'Active' ? 'bg-green-600' : ''}>
                                          {sub.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>{sub.nextBillingDate.toLocaleDateString()}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
            ) : (
                <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <p className="text-muted-foreground">There are no active subscriptions.</p>
                    <Button asChild className="mt-4">
                        <Link href="https://paystack.shop/pay/ecs8d7d7fa" target="_blank" rel="noopener noreferrer">
                            Make First Payment
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}
          </CardContent>
      </Card>
  );
}

type AdminView = 'dashboard' | 'user-management' | 'subjects' | 'assignments' | 'results-management' | 'scratch-cards' | 'billing' | 'error-reports';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = (searchParams.get('view') as AdminView) || 'dashboard';
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    async function fetchStudentsForPINs() {
        if(activeView === 'scratch-cards') {
            try {
                const fetchedStudents = await getStudents();
                setStudents(fetchedStudents);
            } catch(e) {
                console.error("Could not fetch students for PIN generator");
            }
        }
    }
    fetchStudentsForPINs();
  }, [activeView])

  const handleTabChange = (value: string) => {
    router.push(`/admin/dashboard?view=${value}`, { scroll: false });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>

      <Tabs value={activeView} onValueChange={handleTabChange} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="mb-6 inline-flex">
                <TabsTrigger value="dashboard"><Home className="mr-2 h-4 w-4"/>Dashboard</TabsTrigger>
                <TabsTrigger value="user-management"><Users className="mr-2 h-4 w-4"/>Users</TabsTrigger>
                <TabsTrigger value="subjects"><Book className="mr-2 h-4 w-4"/>Subjects</TabsTrigger>
                <TabsTrigger value="assignments"><PenSquare className="mr-2 h-4 w-4"/>Assignments</TabsTrigger>
                <TabsTrigger value="results-management"><ListChecks className="mr-2 h-4 w-4"/>Results</TabsTrigger>
                <TabsTrigger value="error-reports"><MessageSquareWarning className="mr-2 h-4 w-4" />Error Reports</TabsTrigger>
                <TabsTrigger value="scratch-cards"><Ticket className="mr-2 h-4 w-4"/>Student PINs</TabsTrigger>
                <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4"/>Billing</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="dashboard"><DashboardView /></TabsContent>
        <TabsContent value="user-management"><UserManagementTab /></TabsContent>
        <TabsContent value="subjects"><SubjectManagementTab /></TabsContent>
        <TabsContent value="assignments"><SubjectAssignmentTab /></TabsContent>
        <TabsContent value="results-management"><ResultsManagementTab /></TabsContent>
        <TabsContent value="error-reports"><ErrorReportingTab /></TabsContent>
        <TabsContent value="scratch-cards"><ScratchCardGenerator students={students} /></TabsContent>
        <TabsContent value="billing"><SubscriptionManagementTab /></TabsContent>
      </Tabs>
    </div>
  );
}

    