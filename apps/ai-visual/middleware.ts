import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 根路径直接重定向
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 已登录用户访问 login → 跳到 dashboard
  const token = req.cookies.get("token")?.value;
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
