"use client";
import Link from "next/link";
import {
	Users,
	Crown,
	ArrowLeft,
    UserCircle,
    Banana,
	Keyboard,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
// import jwt from "jsonwebtoken";
import {jwtDecode} from "jwt-decode";
import  { useRouter } from "next/navigation";

type NavbarProps = {
	showBackButton?: boolean;
};
interface DecodedToken {
	id: string;
	exp: number;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
    const pathname = usePathname();
	const [isLoggedin, setIsLoggedin] = useState<boolean>();
	const router = useRouter();
    
    useEffect(() => {
        const fetchUser = async () => {
			const token = getCookie("token");
			if (token && !(token instanceof Promise)) {
				try {
					const decoded: DecodedToken = jwtDecode(token);
					console.log("TOKEN",decoded)
					// const decodeToken:unknown = jwt.verify(token,process.env.TOKEN_SECRET!);

					if (decoded.exp * 1000 < Date.now()) {
						// If token is expired
						deleteCookie("token"); // Remove expired token
						setIsLoggedin(false); // Redirect to sign-in
					} else {
						setIsLoggedin(true);
					}
				} catch (error) {
					console.error("Invalid token:", error);
					deleteCookie("token"); // Remove invalid token
					setIsLoggedin(false);
				}
			} else {
				setIsLoggedin(false);
			}

            // try {
            //     await axios.get("/api/profile");
            //     setIsLoggedin(true);
            // } catch (error) {
            //     console.error("Failed to fetch profile data:", error);
            // }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/api/logout");
			setIsLoggedin(false);
			router.push("/");
        } catch (error) {
            console.error("Error Logging Out", error);
        }
    }

	return (
		<header className="p-4 flex items-center justify-between">
			<Link href="/">
				<div className="flex items-center gap-2">
					<Banana className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
					<div className="text-lg sm:text-xl font-medium text-zinc-200">
						bananatype
					</div>
				</div>
			</Link>

			{/* Desktop Navigation */}
			<div className="hidden md:flex items-center gap-6">
				<Link
					href="/"
					className={`${
						pathname === "/"
							? "text-yellow-500"
							: "text-zinc-500 hover:text-zinc-300"
					} flex items-center gap-1`}
				>
					<Keyboard className="h-5 w-5" />
				</Link>
				{showBackButton ? (
					<Link href="/" className="text-zinc-500 hover:text-zinc-300">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				) : (
					<>
						<Link
							href="/leaderboard"
							className={`${
								pathname === "/leaderboard"
									? "text-yellow-500"
									: "text-zinc-500 hover:text-zinc-300"
							} flex items-center gap-1`}
						>
							<Crown className="h-5 w-5" />
						</Link>
						<Link
							href="/multiplayer"
							className={`${
								pathname === "/multiplayer"
									? "text-yellow-500"
									: "text-zinc-500 hover:text-zinc-300"
							} flex items-center gap-1 px-2 py-1 rounded ${
								pathname === "/multiplayer" ? "bg-yellow-500/10" : ""
							}`}
						>
							<Users className="h-5 w-5" />
							<span className="text-sm">multiplayer</span>
						</Link>
						{/* <Link href="#" className="text-zinc-500 hover:text-zinc-300">
							<Info className="h-5 w-5" />
						</Link> */}
						<Link
							href="/profile"
							className={`${
								pathname === "/profile"
									? "text-yellow-500"
									: "text-zinc-500 hover:text-zinc-300"
							} flex items-center gap-1`}
						>
							<UserCircle className="h-5 w-5 " />
						</Link>
						{isLoggedin ? (
							<button
								className="bg-zinc-800 px-3 py-1 rounded text-sm flex items-center gap-2 hover:bg-zinc-700"
								onClick={handleLogout}
							>
								<span>Log Out</span>
							</button>
						) : (
							<Link
								className="bg-zinc-800 px-3 py-1 rounded text-sm flex items-center gap-2 hover:bg-zinc-700"
								href="/login"
							>
								<span>Sign In</span>
							</Link>
						)}
					</>
				)}
			</div>

			{/* Mobile Navigation */}
			<div className="md:hidden flex items-center gap-3">
				{showBackButton ? (
					<Link href="/" className="text-zinc-500 hover:text-zinc-300 p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				) : (
					<>
						<Link
							href="/leaderboard"
							className="text-zinc-500 hover:text-zinc-300 p-2"
						>
							<Crown className="h-5 w-5" />
						</Link>
						<Link
							href="/multiplayer"
							className={`${
								pathname === "/multiplayer"
									? "text-yellow-500 bg-yellow-500/10"
									: "text-zinc-500"
							} p-2 rounded-md flex items-center`}
						>
							<Users className="h-5 w-5" />
						</Link>
						<Link
							href="/profile"
							className="text-zinc-500 hover:text-zinc-300 p-2"
						>
							<UserCircle className="h-5 w-5" />
						</Link>
					</>
				)}
			</div>
		</header>
	);
}

