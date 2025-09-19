
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquareWarning, CheckCircle2 } from "lucide-react";
import { mockErrorReports, type ErrorReport } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export function ErrorReporting() {
  const [reports, setReports] = useState<ErrorReport[]>(mockErrorReports);
  const { toast } = useToast();

  const handleMarkAsResolved = (reportId: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: "Resolved" } : report
      )
    );
    toast({
        title: "Report Resolved",
        description: "The error report has been marked as resolved."
    })
  };

  return (
    <Card id="error-reports">
      <CardHeader>
        <div className="flex items-center gap-3">
          <MessageSquareWarning className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Student Error Reports</CardTitle>
        </div>
        <CardDescription>Review and manage result-related issues reported by students.</CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
            <div className="max-h-96 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()).map(report => (
                    <Accordion key={report.id} type="single" collapsible className="w-full" asChild>
                        <TableRow className="[&>td]:!p-0 [&_tr]:!border-b-0">
                             <TableCell colSpan={5}>
                                <AccordionItem value={report.id} className="border-b-0">
                                    <AccordionTrigger className="w-full h-full p-4 hover:no-underline [&[data-state=open]>svg]:-rotate-180">
                                        <div className="grid grid-cols-5 items-center w-full text-left">
                                             <p className="col-span-1 font-medium">{report.studentName}</p>
                                             <p className="col-span-1">{report.subject}</p>
                                             <p className="col-span-1">{report.reportedAt.toLocaleDateString()}</p>
                                             <div className="col-span-1">
                                                 <Badge variant={report.status === 'Pending' ? 'destructive' : 'default'} className={report.status === 'Resolved' ? 'bg-green-600' : ''}>
                                                    {report.status}
                                                </Badge>
                                             </div>
                                             <div className="col-span-1 flex justify-end">
                                               {report.status === "Pending" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsResolved(report.id);
                                                    }}
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Mark as Resolved
                                                </Button>
                                                )}
                                             </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0 bg-muted/50">
                                        <p className="text-sm text-muted-foreground">{report.message}</p>
                                    </AccordionContent>
                                </AccordionItem>
                             </TableCell>
                        </TableRow>
                    </Accordion>
                  ))}
                </TableBody>
              </Table>
            </div>
        ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-center">
                <p className="text-muted-foreground">No error reports have been submitted yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
