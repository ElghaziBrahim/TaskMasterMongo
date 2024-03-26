"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react'
import { signOut } from 'next-auth/react';
import Image from "next/image"
import { useRouter } from "next/navigation"

import { SafeUser } from '@/types';

interface NavbarProps {
    currentUser: SafeUser | null;
}
const Navbar = ({ currentUser }: NavbarProps) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };
    const router = useRouter()
    return (
        <nav className="flex justify-between items-center bg-white shadow-md p-4">
            <Image
                onClick={() => router.push("/")}
                className="navbar-logo"
                alt="logo image"
                width="50"
                height="50"
                src="/logo.png"
            />
            <div className="navbar-profile relative">
                <img
                    src={`${currentUser ? currentUser.image : "/picture.png"}`}
                    alt="Profile"
                    className="h-10 rounded-full cursor-pointer"
                    onClick={() => toggleDropdown()}
                />
                {showDropdown && (
                    <div className="absolute top-full right-0 bg-white shadow-md rounded-md mt-1" onClick={() => closeDropdown()}>
                        <ul className="py-1">
                            {
                                currentUser ? (
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer " onClick={() => signOut()}>Sign Out</li>
                                ) : (
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => signIn("github")}>Login</li>
                                )
                            }

                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
