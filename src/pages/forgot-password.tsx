import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useIsAuthorized } from "@/services/auth-checker";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForgotPassword } from "@/services/mutations";
import type { ForgotPasswordRequest } from "@/types/api/user";
import { isAxiosError } from "@/services/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Head } from "@unhead/react";

const forgotPasswordFormSchema = z.object({
    email: z.email({
        error: (issue) => issue.input === undefined || issue.input === null || issue.input === ""
        ? "Email is required"
        : "Invalid email address",
    }),
    gRecaptchaResponse: z.string().min(1, { message: "Please complete the captcha" }),
});

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME, VITE_APP_RECAPTCHA_SITE_KEY } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: "",
            gRecaptchaResponse: "",
        },
    });

    const initForgotPassword = useForgotPassword();
    const captchaRef = useRef<ReCAPTCHA>(null);

    const handleForgotPasswordSubmit: SubmitHandler<ForgotPasswordRequest> = (data) => {
        initForgotPassword.mutate(data, {
        onSuccess: (response) => {
            if (captchaRef.current) {
                captchaRef.current.reset();
                forgotPasswordForm.setValue('gRecaptchaResponse', '');
            }
            toast.success(response.data.message);
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    forgotPasswordForm.setValue('gRecaptchaResponse', '');
                }
                const errorMessage = error.response?.data?.message || 'Something went wrong!';
                toast.error(errorMessage);
            } else {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    forgotPasswordForm.setValue('gRecaptchaResponse', '');
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
            <Head>
                <title>Forgot Password - {VITE_APP_SITENAME}</title>
            </Head>
            <Card className="w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%] mt-16">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter your email to reset your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...forgotPasswordForm}>
                        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPasswordSubmit)}>
                            <FormField control={forgotPasswordForm.control} name="email" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter registered email address" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={forgotPasswordForm.control} name="gRecaptchaResponse" render={() => (
                                <FormItem className="">
                                    <FormControl>
                                    <div className="mt-5" style={{transform:"scale(0.75)", transformOrigin:"0 0"}}>
                                        <ReCAPTCHA
                                            sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                            onChange={value => forgotPasswordForm.setValue('gRecaptchaResponse', value || '', { shouldValidate: true })}
                                            ref={captchaRef}
                                            theme="dark"
                                        />
                                    </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <Button className="mt-3 w-full" type="submit" disabled={!forgotPasswordForm.formState.isValid || initForgotPassword.isPending}>Send Reset Link</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm">Remember your password? <Link className="underline font-bold" to="/login">Login</Link></p>
                </CardFooter>
            </Card>
        </main>
    );
}