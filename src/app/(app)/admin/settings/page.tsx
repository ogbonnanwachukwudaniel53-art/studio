
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, PenSquare, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSchool } from "@/lib/school-context";

function SchoolProfileSettings() {
    const { toast } = useToast();
    const { schoolName, setSchoolName } = useSchool();
    const [editingSchoolName, setEditingSchoolName] = useState(false);
    const [tempSchoolName, setTempSchoolName] = useState(schoolName);

    const handleSaveSchoolName = () => {
        setSchoolName(tempSchoolName);
        setEditingSchoolName(false);
        toast({ title: "School Name Updated", description: "The new school name has been saved." });
    };

    const handleCancelEdit = () => {
        setTempSchoolName(schoolName);
        setEditingSchoolName(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">School Profile</CardTitle>
                <CardDescription>Update your school's name.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="school-name">School Name</Label>
                    <div className="flex items-center gap-2">
                         <Building className="h-5 w-5 text-muted-foreground" />
                         <Input 
                            id="school-name"
                            value={tempSchoolName} 
                            onChange={(e) => setTempSchoolName(e.target.value)} 
                            disabled={!editingSchoolName}
                        />
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    {editingSchoolName ? (
                        <>
                            <Button size="sm" onClick={handleSaveSchoolName}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setEditingSchoolName(true)}>
                            <PenSquare className="mr-2 h-4 w-4" /> Edit School Name
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your school's profile.</p>
      </div>
      
      <div className="space-y-6">
        <SchoolProfileSettings />
      </div>
    </div>
  );
}
