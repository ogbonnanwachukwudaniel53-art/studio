
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquareWarning, CheckCircle2, ChevronDown } from "lucide-react";
import { mockErrorReports, type ErrorReport } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


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
          <div className="rounded-md border">
            <Accordion type="single" collapsible className="w-full">
              {reports.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()).map(report => (
                  <AccordionItem value={report.id} key={report.id}>
                    <AccordionTrigger className="flex w-full items-center justify-between p-4 hover:no-underline">
                      <div className="flex-1 text-left">{report.studentName}</div>
                      <div className="flex-1 text-left text-muted-foreground">{report.subject}</div>
                       <div className="flex-1 text-left text-muted-foreground">{report.reportedAt.toLocaleDateString()}</div>
                      <div className="flex-1 text-left">
                          <Badge variant={report.status === 'Pending' ? 'destructive' : 'default'} className={cn(report.status === 'Resolved' && 'bg-green-600')}>
                              {report.status}
                          </Badge>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 bg-muted/50 space-y-4">
                      <p className="text-sm text-muted-foreground pt-4 border-t">{report.message}</p>
                      {report.status === "Pending" && (
                          <div className="flex justify-end">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsResolved(report.id)}
                              >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Resolved
                              </Button>
                          </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
              ))}
            </Accordion>
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

    