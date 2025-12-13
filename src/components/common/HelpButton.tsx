import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-elevated hover:shadow-glow transition-all duration-300"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-4 py-2 border-b shrink-0">
            <DialogTitle className="text-base">User Manual</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src="/User_Manual.pdf"
              className="w-full h-full"
              title="User Manual"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpButton;
