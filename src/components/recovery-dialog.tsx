import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Info, Lock, MailCheck } from "lucide-react";


export default function RecoveryDialog() {
    const navigate = useNavigate();

    return (
    <Dialog>
        <DialogTrigger asChild>
            <span className="flex justify-center items-center">
                <Info className="h-4 w-4 mt-[0.20rem] mr-1" />
                <p className="text-sm underline font-bold cursor-pointer">Rocovery</p>
            </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Account Recovery</DialogTitle>
            <DialogDescription>
                Trouble logging in? recover your account instantly
            </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
                <Alert className="mb-5 cursor-pointer" onClick={() => navigate('/forgot-password')}>
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Forgot Password</AlertTitle>
                    <AlertDescription>
                        I don&apos;t remember my password, want to reset.
                    </AlertDescription>
                </Alert>
                <Alert className="mb-5 cursor-pointer" onClick={() => navigate('/resend-verification')}>
                    <MailCheck className="h-4 w-4" />
                    <AlertTitle>Resend Verification</AlertTitle>
                    <AlertDescription>
                        I didn&apos;t recived the account verification email, want to resend it.
                    </AlertDescription>
                </Alert>
            </div>
        </DialogContent>
    </Dialog>
    )
}