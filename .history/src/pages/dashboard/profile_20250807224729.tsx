import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthorized } from "@/services/auth-checker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getShortName, logout } from "@/helpers/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEmailRequest, UpdateProfileRequest } from "@/types/api/user";
import { useChangeEmail, useRemoveImage, useUpdateProfile } from "@/services/mutations";
import { isAxiosError } from "@/services/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { getFromLocalStorage } from "@/services/localstorage";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PasswordInput from "@/components/ui/custom/password-input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Camera, Loader2, Trash, TriangleAlert } from "lucide-react";
import { Head } from "@unhead/react";

const MAX_FILE_SIZE = 1024 * 200; // 200KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; // Only jpeg, png and webp formats are allowed

const updateProfileFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image upload size is 200KB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

const changeEmailFormSchema = z.object({
  newEmail: z.string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string()
    .min(1, { message: "Password is required" }),
});


export default function ProfilePage() {
    const navigate = useNavigate();
    const { isAuthenticating, isAuthenticated, userData } = useIsAuthorized();
    const { VITE_APP_SITENAME } = import.meta.env;

    useEffect(() => {
        if (!isAuthenticating && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticating, isAuthenticated, navigate]);

    const updateProfileForm = useForm<z.infer<typeof updateProfileFormSchema>>({
        resolver: zodResolver(updateProfileFormSchema),
        defaultValues: {
            name: userData?.name,
        },
    });

    const changeEmailForm = useForm<z.infer<typeof changeEmailFormSchema>>({
        resolver: zodResolver(changeEmailFormSchema),
        defaultValues: {
            newEmail: userData?.email,
            password: "",
        },
    });

    useEffect(() => {
        updateProfileForm.reset({
            ...updateProfileForm.getValues(),
            name: userData?.name,
        });
    }, [userData, updateProfileForm]);

    useEffect(() => {
        changeEmailForm.reset({
            ...changeEmailForm.getValues(),
            newEmail: userData?.email,
        });
    }, [userData, changeEmailForm]);

    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const [avatarSrc, setAvatarSrc] = useState<string>('');
    const [isSaveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [isEmailChangeButtonEnabled, setEmailChangeButtonEnabled] = useState(false);
    const watchedName = updateProfileForm.watch('name');
    const watchedEmail = changeEmailForm.watch('newEmail');

    const handleProfileImageSelection = () => {
        profileImageInputRef.current?.click();
    };

    useEffect(() => {
        const nameHasChanged = watchedName !== userData?.name;
        setSaveButtonEnabled(nameHasChanged);
    }, [watchedName, userData?.name]);

    useEffect(() => {
        const emailHasChanged = watchedEmail !== userData?.email;
        setEmailChangeButtonEnabled(emailHasChanged);
    }, [watchedEmail, userData?.email]);

    const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setSaveButtonEnabled(true);
            updateProfileForm.setValue('image', file);
        } else {
            setSaveButtonEnabled(false);
        }
    };

    const profileUpdater = useUpdateProfile();
    const profileImageRemover = useRemoveImage();
    const emailChanger = useChangeEmail();
    const queryClient = useQueryClient();
    const accessToken = getFromLocalStorage('accessToken') || '';

    const handleUpdateProfileSubmit: SubmitHandler<UpdateProfileRequest> = (data) => {
        profileUpdater.mutate(data, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                queryClient.invalidateQueries({ queryKey: ['user', accessToken] });
                updateProfileForm.reset();
                setSaveButtonEnabled(false);
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

    const handleRemoveImage = () => {
        profileImageRemover.mutate(undefined, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                queryClient.invalidateQueries({ queryKey: ['user', accessToken] });
                setAvatarSrc('');
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

    const handleEmailChangeSubmit: SubmitHandler<ChangeEmailRequest> = (data) => {
        emailChanger.mutate(data, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                logout(navigate);
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
            <Head>
                <title>Profile - {VITE_APP_SITENAME}</title>
            </Head>
            <div className="profile-overview w-full flex">
                <div className="flex items-center mr-10">
                    <Avatar className="h-28 w-28 hover:cursor-pointer">
                        <AvatarImage className="object-cover" src={avatarSrc || userData?.image} alt={getShortName(userData?.name || "")} />
                        <AvatarFallback className="text-2xl tracking-widest font-light">{getShortName(userData?.name || "")}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">{userData?.name}</h1>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    <span className="flex mt-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className="mr-5" variant="outline" size="icon" onClick={handleProfileImageSelection}>
                                    <Camera className="w-4 h-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Choose Profile Image</p>
                            </TooltipContent>
                        </Tooltip>
                        <AlertDialog>
                            <Tooltip>
                                <AlertDialogTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button className="" variant="outline" size="icon" disabled={userData?.image ? false : true}>
                                            <Trash className="w-4 h-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                </AlertDialogTrigger>
                                <TooltipContent>
                                <p>Remove Profile Image</p>
                                </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account profile picture.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRemoveImage}>Remove</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </span>
                </div>
            </div>
            <Breadcrumb className="mt-10">
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
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="update-profile w-full flex-col mt-7">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Update Profile</CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...updateProfileForm}>
                            <form onSubmit={updateProfileForm.handleSubmit(handleUpdateProfileSubmit)}>
                                <FormField control={updateProfileForm.control} name="name" render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter full name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                                <FormField control={updateProfileForm.control} name="image" render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="hidden" type="file" accept="image/jpeg, image/jpg, image/png, image/webp" ref={profileImageInputRef} onChange={handleProfileImageChange}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                                <Button className="mt-3" type="submit" disabled={!isSaveButtonEnabled || !updateProfileForm.formState.isValid || profileUpdater.isPending}>Save</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="change-email w-full flex-col mt-5">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Change Email</CardTitle>
                        <CardDescription>
                            <p className="mb-3">Change your registered email address</p> <br />
                            <span className="flex items-center">
                                <TriangleAlert className="w-4 h-4 text-[rgba(255,213,0,0.7)] mr-2"/> WARNING:
                            </span>
                            <ul className="mt-1">
                                <li> * You will be logged out instantly</li>
                                <li> * You will need to re-verify your new email address first in order to login</li>
                                <li> * Double check the email address before submitting. You will loose access to your account if you enter wrong email and fail to re-verify</li>
                            </ul>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...changeEmailForm}>
                            <form onSubmit={changeEmailForm.handleSubmit(handleEmailChangeSubmit)}>
                                <FormField control={changeEmailForm.control} name="newEmail" render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter new email address" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                                <FormField control={changeEmailForm.control} name="password" render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="Enter password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                                <Button className="mt-3" type="submit" disabled={!isEmailChangeButtonEnabled || !changeEmailForm.formState.isValid || emailChanger.isPending}>Change</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
