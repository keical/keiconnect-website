import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsAuthorized } from "@/services/auth-checker";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PasswordInput from "@/components/ui/custom/password-input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangePasswordRequest, LoginHistoryResponse } from "@/types/api/user";
import { useChangePassword } from "@/services/mutations";
import { toast } from "sonner";
import { isAxiosError } from "@/services/axios";
import { getFromLocalStorage } from "@/services/localstorage";
import { useGetLoginHistory } from "@/services/queries";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTimestamp } from "@/helpers/utils";
import { Loader2 } from "lucide-react";

const changePasswordFormSchema = z.object({
    currentPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
}).refine(data => data.newPassword === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export default function SecurityPage () {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated } = useIsAuthorized();
    const { VITE_APP_SITENAME } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    useEffect(() => {
        document.title = `Security - ${VITE_APP_SITENAME}`;
    }, []);

    const [loginHistoryData, setLoginHistoryData] = useState<{
        isFetching: boolean,
        isFetched: boolean,
        data?: LoginHistoryResponse["data"],
    }>({
        isFetching: true,
        isFetched: false,
        data: null,
    });

    const accessToken = getFromLocalStorage('accessToken');
    const { data, isError, isSuccess } = useGetLoginHistory(accessToken || '');

    useEffect(() => {
        if (!accessToken) {
            setLoginHistoryData({ isFetching: false, isFetched: false });
        } else if (isError) {
            setLoginHistoryData({ isFetching: false, isFetched: false });
        } else if (isSuccess) {
            setLoginHistoryData({ isFetching: false, isFetched: true, data: data.data.data });
        }
    }, [data, isError, isSuccess, accessToken]);

    const changePasswordForm = useForm<z.infer<typeof changePasswordFormSchema>>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const passwordChanger = useChangePassword();

    const handlePasswordChangeSubmit: SubmitHandler<ChangePasswordRequest> = (data) => {
        passwordChanger.mutate(data, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                changePasswordForm.reset();
            },
            onError: (error) => {
                if(isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || 'Something went wrong!';
                    toast.error(errorMessage);
                } else {
                    toast.error('Something went wrong!');
                }
            }
        });
    }

    if (isAuthenticating) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-16">
                <Loader2 className="h-10 w-10 animate-spin"/>
            </main>
        );
    }

    return (
        <main className="flex flex-col min-h-screen p-7">
            <div className="heading mb-10">
                <h1 className="text-3xl font-bold">Security Settings</h1>
                <p className="text-muted-foreground mt-2">Monitor and control your account's security in one place</p>
                <Breadcrumb className="mt-5">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard">
                            Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Security</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="security-settings">
                <Tabs defaultValue="auth" className="">
                    <TabsList className="grid min-h-fit grid-cols-1 sm:grid-cols-2 lg:block lg:w-fit">
                        <TabsTrigger value="auth">Authentication</TabsTrigger>
                        <TabsTrigger value="login-history">Login History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="auth">
                        <Card className="w-full mt-5">
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Your current login password is compromised? or, you want to make it more hard to guess? it is a good prctice to change your password in few months. You can change it anytime here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...changePasswordForm}>
                                    <form onSubmit={changePasswordForm.handleSubmit(handlePasswordChangeSubmit)}>
                                        <FormField control={changePasswordForm.control} name="currentPassword" render={({ field }) => (
                                            <FormItem className="mb-3">
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput placeholder="Enter current password" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}></FormField>
                                        <FormField control={changePasswordForm.control} name="newPassword" render={({ field }) => (
                                            <FormItem className="mb-3">
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput placeholder="Enter new password" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}></FormField>
                                        <FormField control={changePasswordForm.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem className="mb-3">
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput placeholder="Enter new password again to confirm" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}></FormField>
                                        <Button className="mt-3" type="submit" disabled={!changePasswordForm.formState.isValid || passwordChanger.isPending}>Change</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login-history">
                        <Table className="mt-5">
                            {
                                !loginHistoryData.data ? (
                                    <TableCaption>No login history available</TableCaption>
                                ) : null
                            }
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Login IP</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loginHistoryData.data?.map((login) => (
                                    <TableRow key={login.id}>
                                        <TableCell>{login.ip}</TableCell>
                                        <TableCell>{login.platform}</TableCell>
                                        <TableCell>{login.browser}</TableCell>
                                        <TableCell>{formatTimestamp(login.timestamp)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}