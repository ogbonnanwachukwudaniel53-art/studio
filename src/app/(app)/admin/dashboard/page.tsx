
"use client";

import { useState } from "react";
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
import { mockStudents, mockSubjects, mockSubscriptions, type Student, type Subject, type Subscription } from "@/lib/mock-data";
import {
  Home,
  Users,
  BookUser,
  CreditCard,
  Ticket,
  PlusCircle,
  Trash2,
  History,
  MessageSquareWarning,
  User,
  ListChecks,
  Lock,
  Unlock,
  Book,
  PenSquare,
  Building,
  Save,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { ErrorReporting } from "@/components/features/admin/error-reporting";
import { Switch } from "@/components/ui/switch";
import { useResults } from "@/lib/results-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Assignment = {
    teacherId: string;
    subjectId: string;
    classId: string;
};

const teachersData = [
    { id: "t1", name: "Mr. David Chen", email: "david.chen@example.com" },
    { id: "t2", name: "Ms. Emily White", email: "emily.white@example.com" }
];
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
    const [schoolName] = useState("EduResult Pro High School");
    
    const stats = [
        { title: "Total Students", value: mockStudents.length, icon: <Users className="h-6 w-6 text-primary" /> },
        { title: "Total Teachers", value: teachersData.length, icon: <BookUser className="h-6 w-6 text-primary" /> },
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
    const [students] = useState<Student[]>(mockStudents);
    const [teachers] = useState(teachersData);
    const [assignments] = useState<Assignment[]>([
        { teacherId: 't1', subjectId: 'SUB01', classId: 'JSS 1' },
        { teacherId: 't1', subjectId: 'SUB03', classId: 'JSS 1' },
        { teacherId: 't2', subjectId: 'SUB02', classId: 'JSS 2' },
    ]);
    const [subjects] = useState<Subject[]>(mockSubjects);

    return (
        <Card id="user-management">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">User Management</CardTitle>
                </div>
                <CardDescription>Manage teachers and students from one central place.</CardDescription>
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
                                            <TableHead>Assignments</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachers.map(teacher => {
                                            const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id);
                                            return (
                                            <TableRow key={teacher.id}>
                                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                                <TableCell>{teacher.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacherAssignments.length > 0 ? teacherAssignments.map((a, i) => (
                                                            <Badge key={i} variant="secondary">
                                                                {subjects.find(s => s.id === a.subjectId)?.name} ({a.classId})
                                                            </Badge>
                                                        )) : <span className="text-xs text-muted-foreground">None</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">Edit</Button>
                                                </TableCell>
                                            </TableRow>
                                        )})}
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
                                                    <Button variant="outline" size="sm">Edit</Button>
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

        // In a real app, this would update the database.
        toast({
            title: "Assignment Saved Successfully",
            description: `Assigned ${selectedSubject} to ${selectedTeacher} for ${selectedClass}.`
        });
        
        // Reset form
        setSelectedTeacher('');
        setSelectedSubject('');
        setSelectedClass('');
    }

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <PenSquare className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Assign Subject to Teacher</CardTitle>
                </div>
                <CardDescription>Assign teachers to specific subjects and classes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Teacher</Label>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                            <SelectContent>
                                {teachersData.map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
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
                                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
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
          <CardHeader>
              <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline">Subscription Management</CardTitle>
              </div>
              <CardDescription>View and manage yearly app renewal subscriptions.</CardDescription>
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
                                      <Button variant="outline" size="sm" disabled={!canRenew}>
                                        <History className="mr-2 h-4 w-4" />
                                        Renew Now
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          )})}
                      </TableBody>
                  </Table>
              </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-center">
                    <p className="text-muted-foreground">There are no active subscriptions.</p>
                </div>
            )}
          </CardContent>
      </Card>
  );
}

type AdminView = 'dashboard' | 'user-management' | 'subjects' | 'assignments' | 'results-management' | 'scratch-cards' | 'reports';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view') as AdminView || 'dashboard';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>

      <Tabs value={activeView} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="mb-6 inline-flex">
                <TabsTrigger value="dashboard" asChild><a href="?view=dashboard"><Home className="mr-2 h-4 w-4"/>Dashboard</a></TabsTrigger>
                <TabsTrigger value="user-management" asChild><a href="?view=user-management"><Users className="mr-2 h-4 w-4"/>Users</a></TabsTrigger>
                <TabsTrigger value="subjects" asChild><a href="?view=subjects"><Book className="mr-2 h-4 w-4"/>Subjects</a></TabsTrigger>
                <TabsTrigger value="assignments" asChild><a href="?view=assignments"><PenSquare className="mr-2 h-4 w-4"/>Assignments</a></TabsTrigger>
                <TabsTrigger value="results-management" asChild><a href="?view=results-management"><ListChecks className="mr-2 h-4 w-4"/>Results</a></TabsTrigger>
                <TabsTrigger value="scratch-cards" asChild><a href="?view=scratch-cards"><Ticket className="mr-2 h-4 w-4"/>Cards</a></TabsTrigger>
                <TabsTrigger value="reports" asChild><a href="?view=reports"><MessageSquareWarning className="mr-2 h-4 w-4"/>Reports</a></TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="dashboard"><DashboardView /></TabsContent>
        <TabsContent value="user-management"><UserManagementTab /></TabsContent>
        <TabsContent value="subjects"><SubjectManagementTab /></TabsContent>
        <TabsContent value="assignments"><SubjectAssignmentTab /></TabsContent>
        <TabsContent value="results-management"><ResultsManagementTab /></TabsContent>
        <TabsContent value="scratch-cards"><ScratchCardGenerator /></TabsContent>
        <TabsContent value="reports"><ErrorReporting /></TabsContent>
      </Tabs>
    </div>
  );
}
