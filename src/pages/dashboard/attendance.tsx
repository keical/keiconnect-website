import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Head } from "@unhead/react";

export default function AttendancePage() {
    const { VITE_APP_SITENAME } = import.meta.env;

    return (
        <main className="flex flex-col min-h-screen p-7">
            <Head>
                <title>Attendance - {VITE_APP_SITENAME}</title>
            </Head>
            <div className="heading mb-10">
                <h1 className="text-3xl font-bold">Your Attendance</h1>
                <p className="text-muted-foreground mt-2">Monitor your attendance records with ease</p>
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
                        <BreadcrumbPage>Attendance</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
        </main>
    );
}