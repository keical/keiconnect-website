import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsAuthorized } from "@/services/auth-checker";
import { toast } from "sonner";
import { isAxiosError } from "@/services/axios";
import { type UserSignupRequest } from "@/types/api/user";
import { useSignup } from "@/services/mutations";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/custom/password-input";
import { Loader2 } from "lucide-react";
import { Head } from "@unhead/react";

const signupFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({
        error: (issue) => issue.input === undefined || issue.input === null || issue.input === ""
        ? "Email is required"
        : "Invalid email address",
    }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confpass: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    gRecaptchaResponse: z.string().min(1, { message: "Please complete the captcha" }),
}).refine(data => data.password === data.confpass, { message: "Passwords do not match", path: ["confpass"] });

export default function SignupPage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME, VITE_APP_RECAPTCHA_SITE_KEY } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    const signupForm = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confpass: "",
            gRecaptchaResponse: "",
        },
    });

    const initSignup = useSignup();
    const captchaRef = useRef<ReCAPTCHA>(null);

    const handleSignupSubmit: SubmitHandler<UserSignupRequest> = (data) => {
        initSignup.mutate(data, {
        onSuccess: (response) => {
            if (captchaRef.current) {
                captchaRef.current.reset();
                signupForm.setValue('gRecaptchaResponse', '');
            }
            toast.success(response.data.message);
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    signupForm.setValue('gRecaptchaResponse', '');
                }
                const errorMessage = error.response?.data?.message || 'Something went wrong!';
                toast.error(errorMessage);
            } else {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    signupForm.setValue('gRecaptchaResponse', '');
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
                <title>Signup - {VITE_APP_SITENAME}</title>
            </Head>
            <Card className="w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                    <CardDescription>Enter your details to create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)}>
                            <FormField control={signupForm.control} name="name" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={signupForm.control} name="email" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email address" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={signupForm.control} name="password" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Enter a password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={signupForm.control} name="confpass" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Confirm the password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={signupForm.control} name="gRecaptchaResponse" render={() => (
                                <FormItem className="">
                                    <FormControl>
                                    <div className="mt-5" style={{transform:"scale(0.75)", transformOrigin:"0 0"}}>
                                        <ReCAPTCHA
                                            sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                            onChange={value => signupForm.setValue('gRecaptchaResponse', value || '', { shouldValidate: true })}
                                            ref={captchaRef}
                                            theme="dark"
                                        />
                                    </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <Button className="mt-3 w-full" type="submit" disabled={!signupForm.formState.isValid || initSignup.isPending}>Signup</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm">Already have an account? <Link className="underline font-bold" to="/login">Login</Link></p>
                </CardFooter>
            </Card>
        </main>
    );
}