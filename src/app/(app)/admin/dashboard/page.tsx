
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockStudents, mockSubjects, mockScratchCards, mockSubscriptions, mockErrorReports, type Student, type Subject, type ScratchCard, type Subscription, type ErrorReport } from "@/lib/mock-data";
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
  CheckCircle2,
  User
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { ErrorReporting } from "@/components/features/admin/error-reporting";

const teachersData = [
    { id: "t1", name: "Mr. David Chen", email: "david.chen@example.com" },
    { id: "t2", name: "Ms. Emily White", email: "emily.white@example.com" }
];
const classesData = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

function DashboardView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}><ErrorReporting /></div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}><ScratchCardGenerator /></div>
            </div>
            <div className="space-y-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}><UserManagementTab /></div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}><SubjectAssignmentTab /></div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}><SubscriptionManagementTab /></div>
            </div>
        </div>
    );
}

function UserManagementTab() {
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [teachers, setTeachers] = useState(teachersData);

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
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachers.map(teacher => (
                                            <TableRow key={teacher.id}>
                                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                                <TableCell>{teacher.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">Edit</Button>
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

function SubjectAssignmentTab() {
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

    const handleSaveAssignment = (subjectName: string) => {
        toast({
            title: "Assignment Saved",
            description: `Teacher and class assignments for "${subjectName}" have been updated.`
        });
    }

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BookUser className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Subject & Teacher Assignment</CardTitle>
                </div>
                <CardDescription>Add, remove, and assign teachers and classes to subjects.</CardDescription>
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

                <Accordion type="single" collapsible className="w-full space-y-2">
                    {subjects.map(subject => (
                        <AccordionItem value={subject.id} key={subject.id} className="border rounded-lg">
                           <div className="flex items-center pr-4">
                                <AccordionTrigger className="flex-1 p-4 font-medium hover:no-underline">
                                    {subject.name}
                                </AccordionTrigger>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSubject(subject.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete {subject.name}</span>
                                </Button>
                           </div>
                            <AccordionContent className="p-4 pt-0 border-t">
                                <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Assigned Teacher</Label>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                                                <SelectContent>
                                                    {teachersData.map(teacher => (
                                                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Assigned Classes</Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-md border p-2 max-h-40 overflow-y-auto">
                                                {classesData.map(c => (
                                                    <div key={c} className="flex items-center gap-2">
                                                        <Checkbox id={`class-${subject.id}-${c}`} />
                                                        <Label htmlFor={`class-${subject.id}-${c}`} className="font-normal">{c}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={() => handleSaveAssignment(subject.name)}>Save Assignment</Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

function SubscriptionManagementTab() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

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

type AdminView = 'dashboard' | 'user-management' | 'subjects' | 'subscriptions' | 'scratch-cards' | 'error-reports';

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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" asChild><a href="?view=dashboard"><Home className="mr-2 h-4 w-4"/>Dashboard</a></TabsTrigger>
            <TabsTrigger value="user-management" asChild><a href="?view=user-management"><Users className="mr-2 h-4 w-4"/>Users</a></TabsTrigger>
            <TabsTrigger value="subjects" asChild><a href="?view=subjects"><BookUser className="mr-2 h-4 w-4"/>Subjects</a></TabsTrigger>
            <TabsTrigger value="subscriptions" asChild><a href="?view=subscriptions"><CreditCard className="mr-2 h-4 w-4"/>Subscription</a></TabsTrigger>
            <TabsTrigger value="scratch-cards" asChild><a href="?view=scratch-cards"><Ticket className="mr-2 h-4 w-4"/>Cards</a></TabsTrigger>
            <TabsTrigger value="error-reports" asChild><a href="?view=error-reports"><MessageSquareWarning className="mr-2 h-4 w-4"/>Reports</a></TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard"><DashboardView /></TabsContent>
        <TabsContent value="user-management"><UserManagementTab /></TabsContent>
        <TabsContent value="subjects"><SubjectAssignmentTab /></TabsContent>
        <TabsContent value="subscriptions"><SubscriptionManagementTab /></TabsContent>
        <TabsContent value="scratch-cards"><ScratchCardGenerator /></TabsContent>
        <TabsContent value="error-reports"><ErrorReporting /></TabsContent>
      </Tabs>
    </div>
  );
}
