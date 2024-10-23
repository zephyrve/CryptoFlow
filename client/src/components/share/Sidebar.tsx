import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {cn} from "@/utils/styles";
import {NavLinks} from "@/components/share/NavLinks";
import {usePathname} from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className="hidden border-r-border bg-secondary-foreground dark:bg-transparent/70 dark:border-white/30 dark:border-[1px] md:block rounded-xl">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b-border px-4 lg:h-[60px] lg:px-6">
                    <Link className={'flex justify-between items-center gap-4'} href={'/'}>
                        <Image
                            alt={"image"}
                            src={`/favicon.webp`}
                            width={30}
                            height={30}
                        />
                        <div className={'font-semibold text-xl text-white'}>
                            CryptoFlow
                        </div>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="px-2 text-sm font-medium lg:px-4 gap-2 flex flex-col w-full">
                        {NavLinks.map(group => (
                            <div
                                className={'p-1 border-muted/20 dark:border-muted shadow-sm border-[1px] rounded-lg flex flex-col w-full gap-1'}
                                key={group.group}>
                                {group.links.map(link => (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        className={cn(
                                            "text-[16px] flex items-center gap-3 rounded-lg px-3 py-2 dark:text-muted-foreground text-white transition-all hover:bg-muted-foreground/20",
                                            {'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-muted-foreground hover:bg-muted': pathname === link.path}
                                        )}
                                    >
                                        {link.icon}
                                        {link.name}{" "}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
