import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useIsAuthorized } from "@/services/auth-checker";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useResendVerification } from "@/services/mutations";
import type { ResendVerificationRequest } from "@/types/api/user";
import { isAxiosError } from "@/services/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const resendVerificationFormSchema = z.object({
    email: z.email({
        error: (issue) => issue.input === undefined || issue.input === null || issue.input === ""
        ? "Email is required"
        : "Invalid email address",
    }),
    gRecaptchaResponse: z.string().min(1, { message: "Please complete the captcha" }),
});

export default function ResendVerificationPage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME, VITE_APP_RECAPTCHA_SITE_KEY } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    useEffect(() => {
        document.title = `Resend Verifiaction - ${VITE_APP_SITENAME}`;
    }, []);

    const resendVerificationForm = useForm<z.infer<typeof resendVerificationFormSchema>>({
        resolver: zodResolver(resendVerificationFormSchema),
        defaultValues: {
            email: "",
            gRecaptchaResponse: "",
        },
    });

    const initResendVerfication = useResendVerification();
    const captchaRef = useRef<ReCAPTCHA>(null);

    const handleResendVerificationSubmit: SubmitHandler<ResendVerificationRequest> = (data) => {
        initResendVerfication.mutate(data, {
        onSuccess: (response) => {
            if (captchaRef.current) {
                captchaRef.current.reset();
                resendVerificationForm.setValue('gRecaptchaResponse', '');
            }
            toast.success(response.data.message);
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    resendVerificationForm.setValue('gRecaptchaResponse', '');
                }
                const errorMessage = error.response?.data?.message || 'Something went wrong!';
                toast.error(errorMessage);
            } else {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    resendVerificationForm.setValue('gRecaptchaResponse', '');
                }
                toast.error('Something went wrong!');
            }
        }
        });
    }

    if(isAuthenticating) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-16">
                <Loader2 className="h-10 w-10 animate-spin"/>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <Card className="w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%] mt-16">
                <CardHeader>
                    <CardTitle>Resend Verfication</CardTitle>
                    <CardDescription>Resend account verification link if you didn&apos;t recived it</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...resendVerificationForm}>
                        <form onSubmit={resendVerificationForm.handleSubmit(handleResendVerificationSubmit)}>
                            <FormField control={resendVerificationForm.control} name="email" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter registered email address" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={resendVerificationForm.control} name="gRecaptchaResponse" render={() => (
                                <FormItem className="">
                                    <FormControl>
                                    <div className="mt-5" style={{transform:"scale(0.75)", transformOrigin:"0 0"}}>
                                        <ReCAPTCHA
                                            sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                            onChange={value => resendVerificationForm.setValue('gRecaptchaResponse', value || '', { shouldValidate: true })}
                                            ref={captchaRef}
                                            theme="dark"
                                        />
                                    </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <Button className="mt-3 w-full" type="submit" disabled={!resendVerificationForm.formState.isValid || initResendVerfication.isPending}>Send Verification Link</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm">Already verified account? <Link className="underline font-bold" to="/login">Login</Link></p>
                </CardFooter>
            </Card>
        </main>
    );
}