import toast, { ToastPosition } from "react-hot-toast";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

interface NotifyOptions {
    message?: string;
    duration?: number;
    type?: "success" | "error" | "info" | "warning";
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const getIcon = (type: NotifyOptions["type"]) => {
    switch (type) {
        case "success":
            return <CheckCircle className="text-green-500" />;
        case "error":
            return <XCircle className="text-red-500" />;
        case "info":
            return <Info className="text-blue-500" />;
        case "warning":
            return <AlertTriangle className="text-yellow-500" />;
        default:
            return null;
    }
};

export const notify = ({
    message = "",
    duration = 4000,
    type = "info",
    position = "top-right",
}: NotifyOptions) => {
    toast(message, {
        duration,
        icon: getIcon(type),
        position: position as ToastPosition,
    });
};
