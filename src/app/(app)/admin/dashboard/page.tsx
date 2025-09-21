
"use client";

import { useState, useMemo } from "react";
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
import { mockStudents, mockSubjects, mockSubscriptions, mockTeachers, type Student, type Subject, type Subscription, type Teacher, mockScratchCards, type ScratchCard } from "@/lib/mock-data";
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
  ArrowUpRight
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
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

type Assignment = {
    teacherId: string;
    subjectId: string;
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

function DashboardView() {
    const { schoolName } = useSchool();
    
    const stats = [
        { title: "Total Students", value: mockStudents.length, icon: <Users className="h-6 w-6 text-primary" /> },
        { title: "Total Teachers", value: mockTeachers.length, icon: <BookUser className="h-6 w-6 text-primary" /> },
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
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}><ResultsManagementTab /></div>
                </div>
            </div>
        </div>
    );
}

function UserManagementTab() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    
    const handleUpdateTeacher = (updatedTeacher: Teacher) => {
        setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
        toast({ title: "Teacher Updated", description: `${updatedTeacher.name}'s details have been saved.` });
        setEditingTeacher(null);
    };

    const handleUpdateStudent = (updatedStudent: Student) => {
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        toast({ title: "Student Updated", description: `${updatedStudent.name}'s details have been saved.` });
        setEditingStudent(null);
    };

    const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
        const newId = `S${String(students.length + 1).padStart(3, '0')}`;
        setStudents(prev => [...prev, { ...newStudent, id: newId }]);
        toast({ title: "Student Added", description: `${newStudent.name} has been added to the school.` });
        setIsAddStudentOpen(false);
    };

    const handleRemoveStudent = (studentId: string) => {
        const studentName = students.find(s => s.id === studentId)?.name;
        setStudents(prev => prev.filter(s => s.id !== studentId));
        toast({ title: "Student Removed", description: `${studentName} has been removed.`, variant: "destructive" });
    }

    const handleDeactivateTeacher = (teacherId: string) => {
        setTeachers(prev => prev.map(t => t.id === teacherId ? {...t, status: 'inactive'} : t));
        toast({ title: "Teacher Deactivated", variant: "destructive" });
    }

    return (
        <>
            <Card id="user-management">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline">User Management</CardTitle>
                        </div>
                        <Button onClick={() => setIsAddStudentOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Student
                        </Button>
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
                                            {teachers.map(teacher => (
                                                <TableRow key={teacher.id}>
                                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                                    <TableCell>{teacher.email}</TableCell>
                                                    <TableCell><Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className={teacher.status === 'active' ? 'bg-green-600' : ''}>{teacher.status}</Badge></TableCell>
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
                                                                <DropdownMenuItem>
                                                                    Reset Password
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivateTeacher(teacher.id)}>
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
                                            {students.map(student => (
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
        </>
    );
}


function EditTeacherDialog({ teacher, onSave, onOpenChange }: { teacher: Teacher | null, onSave: (teacher: Teacher) => void, onOpenChange: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    React.useEffect(() => {
        if (teacher) {
            setName(teacher.name);
            setEmail(teacher.email);
        }
    }, [teacher]);

    const handleSave = () => {
        if (teacher) {
            onSave({ ...teacher, name, email });
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
                        <Input id="teacher-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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

function EditStudentDialog({ student, onSave, onOpenChange }: { student: Student | null, onSave: (student: Student) => void, onOpenChange: () => void }) {
    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");

    React.useEffect(() => {
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
                    <Button onClick={handleSave}>Add Student</Button>
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
    const [assignments, setAssignments] = useState<Assignment[]>([
        { teacherId: 't1', subjectId: 'SUB01', classId: 'JSS 1' },
        { teacherId: 't1', subjectId: 'SUB03', classId: 'JSS 1' },
        { teacherId: 't2', subjectId: 'SUB05', classId: 'SSS 2' },
    ]);

    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const handleSaveAssignment = () => {
        if (!selectedTeacher || !selectedSubject || !selectedClass) {
            toast({
                title: "Incomplete Assignment",
                description: "Please select a teacher, subject, and class.",
                variant: "destructive"
            });
            return;
        }

        const newAssignment = { teacherId: selectedTeacher, subjectId: selectedSubject, classId: selectedClass };
        
        setAssignments(prev => [...prev, newAssignment]);

        toast({
            title: "Assignment Saved Successfully",
            description: `Assigned subject to teacher for ${selectedClass}.`
        });
        
        setSelectedTeacher('');
        setSelectedSubject('');
        setSelectedClass('');
    }

    const getTeacherName = (id: string) => mockTeachers.find(t => t.id === id)?.name || 'Unknown';
    const getSubjectName = (id: string) => mockSubjects.find(s => s.id === id)?.name || 'Unknown';

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <PenSquare className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Assign Subject to Teacher</CardTitle>
                </div>
                <CardDescription>Assign teachers to specific subjects and classes, and view current assignments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="rounded-md border p-4 space-y-4">
                    <h3 className="font-medium text-lg">Create New Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Teacher</Label>
                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                                <SelectContent>
                                    {mockTeachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                <SelectContent>
                                    {mockSubjects.map(subject => (
                                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                                <SelectContent>
                                    {classesData.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90" 
                            onClick={handleSaveAssignment}
                            disabled={!selectedTeacher || !selectedSubject || !selectedClass}
                        >
                            Save Assignment
                        </Button>
                    </div>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {assignments.map((assignment, index) => (
                                 <TableRow key={index}>
                                    <TableCell><Badge variant="secondary">{assignment.classId}</Badge></TableCell>
                                    <TableCell className="font-medium">{getSubjectName(assignment.subjectId)}</TableCell>
                                    <TableCell>{getTeacherName(assignment.teacherId)}</TableCell>
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
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);

  const isRenewalDue = (renewalDate: Date) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return renewalDate <= thirtyDaysFromNow;
  };

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
                              <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {activeSubscriptions.map(sub => {
                            const renewalDue = isRenewalDue(sub.nextBillingDate);
                            const canRenew = sub.status === 'Inactive' || renewalDue;
                            
                            return (
                              <TableRow key={sub.id}>
                                  <TableCell className="font-medium">EduResult Pro - School Plan (Yearly)</TableCell>
                                  <TableCell>
                                      <Badge variant={sub.status === 'Active' ? 'default' : 'destructive'} className={sub.status === 'Active' ? 'bg-green-600' : ''}>
                                          {sub.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>{sub.nextBillingDate.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm" disabled={!canRenew}>
                                        <Link href="https://paystack.shop/pay/ecs8d7d7fa" target="_blank" rel="noopener noreferrer">
                                            <History className="mr-2 h-4 w-4" />
                                            Renew Now
                                        </Link>
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          )})}
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

type AdminView = 'dashboard' | 'user-management' | 'subjects' | 'assignments' | 'results-management' | 'scratch-cards' | 'billing';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = (searchParams.get('view') as AdminView) || 'dashboard';
  const [cards, setCards] = useState<ScratchCard[]>(mockScratchCards);

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
        <TabsContent value="scratch-cards"><ScratchCardGenerator cards={cards} /></TabsContent>
        <TabsContent value="billing"><SubscriptionManagementTab /></TabsContent>
      </Tabs>
    </div>
  );
}
