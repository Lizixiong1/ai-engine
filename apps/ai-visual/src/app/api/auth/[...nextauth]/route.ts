// NextAuth.js 路由占位文件，仅用于展示目录结构
// 在实际项目中，这里配置 providers、callbacks 等。

import NextAuth from "next-auth";

const handler = NextAuth({
  providers: []
});

export { handler as GET, handler as POST };


