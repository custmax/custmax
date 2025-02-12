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
import {SUCCESS_CODE} from "@/constant/common";

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

const ImportResultFile = () => {
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
        initResult();
    }, [])

    const initResult = async () => {
        const res = await batchImportResult();
        if (res.code === SUCCESS_CODE) {
            const resData = res.data;
            if (resData.userId!=0){
                setData(resData)
                console.log(resData)
            }
        }
    }


    return <div className="w-full h-ful bg-violet-50">
        <EnteredHeader/>
        <SideBar/>
        <div className="flex min-h-screen pl-32 pt-24 w-full flex-col ">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                {/*<Sheet>*/}
                {/*    <SheetTrigger asChild>*/}
                {/*        <Button*/}
                {/*            variant="outline"*/}
                {/*            size="icon"*/}
                {/*            className="shrink-0 md:hidden"*/}
                {/*        >*/}
                {/*            <Menu className="h-5 w-5"/>*/}
                {/*            <span className="sr-only">Toggle navigation menu</span>*/}
                {/*        </Button>*/}
                {/*    </SheetTrigger>*/}
                {/*    <SheetContent side="left">*/}
                {/*        <nav className="grid gap-6 text-lg font-medium">*/}
                {/*            <Link*/}
                {/*                href="#"*/}
                {/*                className="flex items-center gap-2 text-lg font-semibold"*/}
                {/*            >*/}
                {/*                <Package2 className="h-6 w-6"/>*/}
                {/*                <span className="sr-only">Acme Inc</span>*/}
                {/*            </Link>*/}
                {/*            <Link href="#" className="hover:text-foreground">*/}
                {/*                Dashboard*/}
                {/*            </Link>*/}
                {/*            <Link*/}
                {/*                href="#"*/}
                {/*                className="text-muted-foreground hover:text-foreground"*/}
                {/*            >*/}
                {/*                Orders*/}
                {/*            </Link>*/}
                {/*            <Link*/}
                {/*                href="#"*/}
                {/*                className="text-muted-foreground hover:text-foreground"*/}
                {/*            >*/}
                {/*                Products*/}
                {/*            </Link>*/}
                {/*            <Link*/}
                {/*                href="#"*/}
                {/*                className="text-muted-foreground hover:text-foreground"*/}
                {/*            >*/}
                {/*                Customers*/}
                {/*            </Link>*/}
                {/*            <Link*/}
                {/*                href="#"*/}
                {/*                className="text-muted-foreground hover:text-foreground"*/}
                {/*            >*/}
                {/*                Analytics*/}
                {/*            </Link>*/}
                {/*        </nav>*/}
                {/*    </SheetContent>*/}
                {/*</Sheet>*/}
                {/*<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">*/}
                {/*    <form className="ml-auto flex-1 sm:flex-initial">*/}
                {/*        <div className="relative">*/}
                {/*            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>*/}
                {/*            <Input*/}
                {/*                type="search"*/}
                {/*                placeholder="Search products..."*/}
                {/*                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </form>*/}
                {/*    <DropdownMenu>*/}
                {/*        <DropdownMenuTrigger asChild>*/}
                {/*            <Button variant="secondary" size="icon" className="rounded-full">*/}
                {/*                <CircleUser className="h-5 w-5"/>*/}
                {/*                <span className="sr-only">Toggle user menu</span>*/}
                {/*            </Button>*/}
                {/*        </DropdownMenuTrigger>*/}
                {/*        <DropdownMenuContent align="end">*/}
                {/*            <DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
                {/*            <DropdownMenuSeparator/>*/}
                {/*            <DropdownMenuItem>Settings</DropdownMenuItem>*/}
                {/*            <DropdownMenuItem>Support</DropdownMenuItem>*/}
                {/*            <DropdownMenuSeparator/>*/}
                {/*            <DropdownMenuItem>Logout</DropdownMenuItem>*/}
                {/*        </DropdownMenuContent>*/}
                {/*    </DropdownMenu>*/}
                {/*</div>*/}
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card x-chunk="dashboard-01-chunk-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Successfully resolved
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <div>{data.successImport}</div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Contacts that were successfully resolved from a file
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Failed import
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.failImport}</div>
                            <p className="text-xs text-muted-foreground">
                                Contacts that cannot be resolved from a file
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Repeat imports</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.repeatImport}</div>
                            <p className="text-xs text-muted-foreground">
                                The existing contacts in the system do not need to be imported, and the contact emails
                                cannot be imported again if they are grouped in the same group
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Invalid contact</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-2xl font-bold">{data.unavailableImportList ? data.unavailableImportList.length : null}</div>
                            <p className="text-xs text-muted-foreground">
                                The contact email address verification failed
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card
                        className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                    >
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Final Import contact List</CardTitle>
                                <CardDescription>
                                    Available contacts that were successfully imported from the file
                                </CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href="/importResultList">
                                    View All
                                    <ArrowUpRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
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
                                <TableBody>
                                    {data.finalImportList ? data.finalImportList.slice(0, 10).map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div
                                                    className="font-medium">{item.firstName + " " + item.lastName}</div>
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
                                        </TableRow>) : null}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-5">
                        <CardHeader>
                            <CardTitle>Exception</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-8">
                            {data.exceptionStrings ? data.exceptionStrings.slice(0, 10).map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar"/>
                                        <AvatarFallback>OM</AvatarFallback>
                                    </Avatar>
                                    {/*<div className="grid gap-1">*/}
                                    {/*    <p className="ml-auto text-sm font-medium leading-none">*/}
                                    {/*        {item}*/}
                                    {/*    </p>*/}
                                    {/*    <p className="text-sm text-muted-foreground">*/}
                                    {/*        olivia.martin@email.com*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}
                                    <div className="ml-auto font-medium">{item}</div>
                                </div>)) : null}

                            {/*<div className="flex items-center gap-4">*/}
                            {/*    <Avatar className="hidden h-9 w-9 sm:flex">*/}
                            {/*        <AvatarImage src="/avatars/02.png" alt="Avatar"/>*/}
                            {/*        <AvatarFallback>JL</AvatarFallback>*/}
                            {/*    </Avatar>*/}
                            {/*    <div className="grid gap-1">*/}
                            {/*        <p className="text-sm font-medium leading-none">*/}
                            {/*            Jackson Lee*/}
                            {/*        </p>*/}
                            {/*        <p className="text-sm text-muted-foreground">*/}
                            {/*            jackson.lee@email.com*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*    <div className="ml-auto font-medium">+$39.00</div>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center gap-4">*/}
                            {/*    <Avatar className="hidden h-9 w-9 sm:flex">*/}
                            {/*        <AvatarImage src="/avatars/03.png" alt="Avatar"/>*/}
                            {/*        <AvatarFallback>IN</AvatarFallback>*/}
                            {/*    </Avatar>*/}
                            {/*    <div className="grid gap-1">*/}
                            {/*        <p className="text-sm font-medium leading-none">*/}
                            {/*            Isabella Nguyen*/}
                            {/*        </p>*/}
                            {/*        <p className="text-sm text-muted-foreground">*/}
                            {/*            isabella.nguyen@email.com*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*    <div className="ml-auto font-medium">+$299.00</div>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center gap-4">*/}
                            {/*    <Avatar className="hidden h-9 w-9 sm:flex">*/}
                            {/*        <AvatarImage src="/avatars/04.png" alt="Avatar"/>*/}
                            {/*        <AvatarFallback>WK</AvatarFallback>*/}
                            {/*    </Avatar>*/}
                            {/*    <div className="grid gap-1">*/}
                            {/*        <p className="text-sm font-medium leading-none">*/}
                            {/*            William Kim*/}
                            {/*        </p>*/}
                            {/*        <p className="text-sm text-muted-foreground">*/}
                            {/*            will@email.com*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*    <div className="ml-auto font-medium">+$99.00</div>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center gap-4">*/}
                            {/*    <Avatar className="hidden h-9 w-9 sm:flex">*/}
                            {/*        <AvatarImage src="/avatars/05.png" alt="Avatar"/>*/}
                            {/*        <AvatarFallback>SD</AvatarFallback>*/}
                            {/*    </Avatar>*/}
                            {/*    <div className="grid gap-1">*/}
                            {/*        <p className="text-sm font-medium leading-none">*/}
                            {/*            Sofia Davis*/}
                            {/*        </p>*/}
                            {/*        <p className="text-sm text-muted-foreground">*/}
                            {/*            sofia.davis@email.com*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*    <div className="ml-auto font-medium">+$39.00</div>*/}
                            {/*</div>*/}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    </div>
};

export default ImportResultFile;