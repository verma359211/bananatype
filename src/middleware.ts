// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authRoutes = ["/login", "/signup"];

export default withAuth(
	// ① annotate req as NextRequestWithAuth so `req.nextauth` is available
	(req: NextRequestWithAuth) => {
		const { pathname } = req.nextUrl;

		// 🚧 already signed in → block /login & /signup
		if (req.nextauth.token && authRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// ✅ otherwise, let NextAuth handle it
		return NextResponse.next();
	},
	{
		// ② only allow through if token exists
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		// ③ redirect to this page when not authenticated
		pages: {
			signIn: "/login",
		},
	}
);

// ④ apply only to these routes
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
