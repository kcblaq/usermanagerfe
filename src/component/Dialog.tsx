import { useState } from "react";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";

interface MyDialogProps {
    openText: string | React.ReactNode;
    warning: string;
    description: string;
    onClose: () => void; 
    onConfirm?: () => void;
}

export function MyDialog({
    openText,
    warning,
    description,
    onClose,
    onConfirm
}: MyDialogProps) {
    // State to control dialog open/close
    const [open, setOpen] = useState(false);
    

    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        setOpen(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {typeof openText === 'string' ? (
                    <Button variant="outline">{openText}</Button>
                ) : (
                    openText
                )}
            </DialogTrigger>
           
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{warning}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} className="cursor-pointer">Cancel</Button>
                    <Button onClick={handleConfirm} className="bg-red-500 text-white cursor-pointer hover:bg-white hover:text-red-500 hover:border hover:border-red-500">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}