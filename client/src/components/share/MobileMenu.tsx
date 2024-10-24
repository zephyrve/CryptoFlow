import React from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {NavLinks} from "@/components/share/NavLinks";
import {cn} from "@/utils/styles";
import {usePathname} from "next/navigation";
import {ModeToggle} from "@/components/share/ModeToggle";

const MobileMenu = () => {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-full">
                <nav className="grid gap-2 text-lg font-medium">
                    <div className="flex h-14 items-center border-b-border px-0 lg:h-[60px] lg:px-6">
                        <Link className={'flex justify-between items-center gap-4'} href={'/'}>
                            <Image
                                alt={"image"}
                                src={`/favicon.webp`}
                                width={30}
                                height={30}
                            />
                            <div className={'font-semibold'}>
                                CryptoFlow
                            </div>
                        </Link>
                    </div>

                    {NavLinks.map(group => (
                        <div key={group.group}
                             className="mt-4 border-muted-foreground- dark:border-muted shadow-sm border-[1px] rounded-lg">
                            {group.links.map(link => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground pl-5 mx-2",
                                        {'flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground': pathname === link.path}
                                    )}
                                >
                                    {link.icon}
                                    {link.name}{" "}
                                </Link>
                            ))}
                        </div>
                    ))}
                <div className={'flex justify-center w-full items-center mt-2'}>
                    <ModeToggle/>
                </div>
                </nav>

            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
