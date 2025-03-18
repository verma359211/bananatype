import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value; // Check if token exists

	const protectedRoutes = [
		"/profile",
		"/leaderboard",
		"/multiplayer",
		"/logout",
	];
	const authRoutes = ["/login", "/signup"];

	const requestedPath = req.nextUrl.pathname;

	// 🛑 If user is NOT logged in, block access to protected routes
	if (!token && protectedRoutes.includes(requestedPath)) {
		return NextResponse.redirect(new URL("/login", req.url)); // Redirect to signin
	}

	// 🛑 If user IS logged in, block access to auth routes
	if (token && authRoutes.includes(requestedPath)) {
		return NextResponse.redirect(new URL("/", req.url)); // Redirect to home
	}

	return NextResponse.next(); // Allow request to proceed
}

// Apply middleware to specific routes
export const config = {
	matcher: [
		"/profile",
		"/leaderboard",
		"/multiplayer",
		"/logout",
		"/login",
		"/signup",
	],
};
