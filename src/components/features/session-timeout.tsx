
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogOut, Timer } from "lucide-react";

interface SessionTimeoutDialogProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  countdown: number;
}

export function SessionTimeoutDialog({
  isOpen,
  onContinue,
  onLogout,
  countdown,
}: SessionTimeoutDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-headline">
            <Timer className="h-6 w-6 text-primary" />
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have been inactive for a while. For your security, you will be automatically logged out in <span className="font-bold">{countdown}</span> seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out Now
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={onContinue}>
            Continue Session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
