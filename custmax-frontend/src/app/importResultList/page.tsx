'use client';
import styles from './page.module.scss';
import Link from "next/link";
import {Activity, ArrowUpRight, CircleUser, CreditCard, DollarSign, Menu, Package2, Search, Users} from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

import {Input} from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import EnteredHeader from "@/component/EnteredHeader";
import SideBar from "@/component/SideBar";
import React, {useEffect, useState} from 'react';
import {batchImportResult} from "@/server/contact";
import {ScrollArea} from "@/components/ui/scroll-area";

const {} = styles;

interface Contact {
    userId: number;
    companyId: number;
    groupId: number;
    valid: number;
    isAvailable: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    phone: string;
    country: string;
    company: string;
    dept: string;
    title: string;
    avatar: string;
    birthdate: string;
    note: string;
    subscriptionType: string;
}


// 定义 ContactImportVo 类型
interface ContactImportVo {
    userId: number; // Long 在 TypeScript 中通常用 number 表示
    successImport: number;
    failImport: number;
    repeatImport: number;
    exceptionStrings: string[];
    successImportList: Contact[]; // 如果你确定列表中只有特定类型，可以指定类型
    repeatImportList: any[];
    unavailableImportList: any[];
    finalImportList: Contact[]; // 假设你已经有了 Contact 类型的定义
}

const ImportFile = () => {
    let [data, setData] = useState<ContactImportVo>({
        userId: 0,
        successImport: 0,
        failImport: 0,
        repeatImport: 0,
        exceptionStrings: [],
        successImportList: [],
        repeatImportList: [],
        unavailableImportList: [],
        finalImportList: [],
    })
    useEffect(() => {
        initResult()

    }, [])
    const initResult = async () => {
        const res = await batchImportResult();
        const resData = res.data;
        setData(resData)
        console.log(resData)
    }


    return <div className="w-full h-ful bg-violet-50">
        <EnteredHeader/>
        <SideBar/>
        <div className="flex min-h-screen pl-32 pt-24 w-full flex-col ">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6" >
                <nav
                    className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                        href="/importResult"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/importResultList"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Results
                    </Link>
                    <Link
                        href="/importWay"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Import
                    </Link>
                    <Link
                        href="/contactList"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        ContactList
                    </Link>
                    {/*<Link*/}
                    {/*    href="#"*/}
                    {/*    className="text-muted-foreground transition-colors hover:text-foreground"*/}
                    {/*>*/}
                    {/*    Analytics*/}
                    {/*</Link>*/}
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6"/>
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link href="#" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Orders
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card
                        className="xl:col-span-3 " x-chunk="dashboard-01-chunk-4"
                    >
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Successfully resolved List</CardTitle>
                                <CardDescription>
                                    Contacts that were successfully resolved from the file
                                </CardDescription>
                            </div>

                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-96 w-full rounded-md border p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Contact</TableHead>
                                        <TableHead className="">
                                            Status
                                        </TableHead>
                                        <TableHead className="">
                                            Company
                                        </TableHead>
                                        <TableHead className="">
                                            Country
                                        </TableHead>
                                        <TableHead className="text-right">Phone</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="">

                                    {data.successImportList ? data.successImportList.map((item, index) => <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-medium">{item.firstName + " " + item.lastName}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {item.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                <Badge className="text-xs" variant="outline">
                                                    {item.isAvailable == 1 ? "available" : "unavailable"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="">
                                                {item.company}
                                            </TableCell>
                                            <TableCell className="">
                                                {item.country}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.phone}
                                            </TableCell>
                                        </TableRow>)
                                        : ''
                                    }

                                </TableBody>

                            </Table>
                        </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card
                        className="xl:col-span-3 " x-chunk="dashboard-01-chunk-4"
                    >
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Repeat import List</CardTitle>
                                <CardDescription>
                                    The existing contacts in the system do not need to be imported, and the contact emails
                                    cannot be imported again if they are grouped in the same group
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact</TableHead>
                                            <TableHead className="">
                                                Status
                                            </TableHead>
                                            <TableHead className="">
                                                Company
                                            </TableHead>
                                            <TableHead className="">
                                                Country
                                            </TableHead>
                                            <TableHead className="text-right">Phone</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="">

                                        {data.repeatImportList ? data.repeatImportList.map((item, index) => <TableRow key={index}>
                                                <TableCell>
                                                    <div className="font-medium">{item.firstName + " " + item.lastName}</div>
                                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                                        {item.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="">
                                                    <Badge className="text-xs" variant="outline">
                                                        {item.isAvailable == 1 ? "available" : "unavailable"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.company}
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.country}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.phone}
                                                </TableCell>
                                            </TableRow>)
                                            : ''
                                        }
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card
                        className="xl:col-span-3 " x-chunk="dashboard-01-chunk-4"
                    >
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Invalid contact List</CardTitle>
                                <CardDescription>
                                    The contact email address verification failed
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact</TableHead>
                                            <TableHead className="">
                                                Status
                                            </TableHead>
                                            <TableHead className="">
                                                Company
                                            </TableHead>
                                            <TableHead className="">
                                                Country
                                            </TableHead>
                                            <TableHead className="text-right">Phone</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="">
                                        {data.unavailableImportList ? data.unavailableImportList.map((item, index) => <TableRow key={index}>
                                                <TableCell>
                                                    <div className="font-medium">{item.firstName + " " + item.lastName}</div>
                                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                                        {item.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="">
                                                    <Badge className="text-xs" variant="outline">
                                                        {item.isAvailable == 1 ? "available" : "unavailable"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.company}
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.country}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.phone}
                                                </TableCell>
                                            </TableRow>)
                                            : ''
                                        }
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card
                        className="xl:col-span-3 " x-chunk="dashboard-01-chunk-4"
                    >
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Final Import contact List</CardTitle>
                                <CardDescription>
                                    Available contacts that were successfully imported from the file
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact</TableHead>
                                            <TableHead className="">
                                                Status
                                            </TableHead>
                                            <TableHead className="">
                                                Company
                                            </TableHead>
                                            <TableHead className="">
                                                Country
                                            </TableHead>
                                            <TableHead className="text-right">Phone</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="">
                                        {data.finalImportList ? data.finalImportList.map((item, index) => <TableRow key={index}>
                                                <TableCell>
                                                    <div className="font-medium">{item.firstName + " " + item.lastName}</div>
                                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                                        {item.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="">
                                                    <Badge className="text-xs" variant="outline">
                                                        {item.isAvailable == 1 ? "available" : "unavailable"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.company}
                                                </TableCell>
                                                <TableCell className="">
                                                    {item.country}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.phone}
                                                </TableCell>
                                            </TableRow>)
                                            : ''
                                        }
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>


                </div>
            </main>
        </div>
    </div>
};

export default ImportFile;