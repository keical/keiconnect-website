import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/services/mutations";
import { type UserLoginRequest } from "@/types/api/user";
import { isAxiosError } from "@/services/axios";
import { addToLocalStorage } from "@/services/localstorage";
import { useIsAuthorized } from "@/services/auth-checker";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import RecoveryDialog from "@/components/recovery-dialog";
import PasswordInput from "@/components/ui/custom/password-input";
import { Loader2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.email({
    error: (issue) => issue.input === undefined || issue.input === null || issue.input === ""
      ? "Email is required"
      : "Invalid email address",
  }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  gRecaptchaResponse: z.string().min(1, { message: "Please complete the captcha" }),
});

export default function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME, VITE_APP_RECAPTCHA_SITE_KEY } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    useEffect(() => {
        document.title = `Login - ${VITE_APP_SITENAME}`;
    }, []);
    
    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
            gRecaptchaResponse: "",
        },
    });

    const initLogin = useLogin();
    const captchaRef = useRef<ReCAPTCHA>(null);

    const handleLoginSubmit: SubmitHandler<UserLoginRequest> = (data) => {
        initLogin.mutate(data, {
        onSuccess: (response) => {
            if (captchaRef.current) {
                captchaRef.current.reset();
                loginForm.setValue('gRecaptchaResponse', '');
            }
            addToLocalStorage('accessToken', response.data.accessToken);
            addToLocalStorage('refreshToken', response.data.refreshToken);
            navigate('/dashboard');
        },
        onError: (error) => {
            if(isAxiosError(error)) {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    loginForm.setValue('gRecaptchaResponse', '');
                }
                const errorMessage = error.response?.data?.message || 'Something went wrong!';
                toast.error(errorMessage);
            } else {
                if (captchaRef.current) {
                    captchaRef.current.reset();
                    loginForm.setValue('gRecaptchaResponse', '');
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
            <Card className="w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to login</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
                            <FormField control={loginForm.control} name="email" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter registered email address" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={loginForm.control} name="password" render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <FormField control={loginForm.control} name="gRecaptchaResponse" render={() => (
                                <FormItem className="">
                                    <FormControl>
                                    <div className="mt-5" style={{transform:"scale(0.75)", transformOrigin:"0 0"}}>
                                        <ReCAPTCHA
                                            sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                                            onChange={value => loginForm.setValue('gRecaptchaResponse', value || '', { shouldValidate: true })}
                                            ref={captchaRef}
                                            theme="dark"
                                        />
                                    </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}></FormField>
                            <Button className="mt-3 w-full" type="submit" disabled={!loginForm.formState.isValid || initLogin.isPending}>Login</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <p className="text-sm">Don&apos;t have an account? <Link className="underline font-bold" to="/signup">Signup</Link></p>
                    <RecoveryDialog />
                </CardFooter>
            </Card>
        </main>
    )
}