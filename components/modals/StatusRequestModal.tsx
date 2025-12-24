"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
  currentStatus?: string;
}

export default function StatusRequestModal({
  open,
  onClose,
  userEmail,
  currentStatus,
}: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    setLoading(true);
    await fetch("/api/status-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        currentStatus,
        requestedStatus: 'active',
      }),
    });
    setLoading(false);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Status Change</DialogTitle>
        </DialogHeader>

        <Textarea
          placeholder="Explain why you are requesting a status change..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <DialogFooter>
          <Button className="cursor-pointer" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="cursor-pointer" onClick={submitRequest} disabled={!message || loading}>
            {loading ? (
                <>Sending<Loader className="animate-spin" /></>
              ) : (
                "Send Request"
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
