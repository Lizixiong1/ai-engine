export const enUS = {
  // 导航栏
  nav: {
    home: "portal",
    login: "login",
    register: "register",
  },
  // 首页
  home: {
    title: "Welcome to AI Visual",
    subtitle: "Innovative AI driven visualization platform makes data vivid and interesting",
    getStarted: "Get started",
    login: "login",
    features: {
      title: "core functionality",
      visualization: {
        title: "intelligent visualization",
        desc: "using advanced AI technology to transform complex data into intuitive visual charts and graphs",
      },
      fast: {
        title: "quick processing",
        desc: "powerful processing capability, supporting large-scale data analysis and real-time visualization rendering",
      },
      secure: {
        title: "Secure and Reliable",
        desc: "Enterprise-grade security to protect your data privacy and sensitive information",
      },
    },
    cta: {
      title: "Ready to get started?",
      subtitle: "Sign up now to experience the AI-powered visualization platform",
      button: "Sign up for free",
    },
  },
  // 登录页
  login: {
    title: "Sign in to your account",
    noAccount: "Don't have an account?",
    registerLink: "Register now",
    email: "Email address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submit: "Sign in",
  },
  // 注册页
  register: {
    title: "Create a new account",
    hasAccount: "Already have an account?",
    loginLink: "Sign in now",
    name: "Name",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    agreeTerms: "I agree to",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    submit: "Register",
    passwordMismatch: "Passwords do not match",
  },
  // 页脚
  footer: {
    about: {
      title: "About Us",
      desc: "AI Visual is an innovative visualization platform offering powerful AI-driven features.",
    },
    links: {
      title: "Quick Links",
      home: "Portal",
      login: "Login",
      register: "Register",
    },
    resources: {
      title: "Resources",
      docs: "Docs",
      api: "API",
      help: "Help Center",
    },
    contact: {
      title: "Contact Us",
      email: "email",
      phone: "phone",
    },
    copyright: "All rights reserved.",
  },
  // 通用
  common: {
    close: "Close",
    menu: "Menu",
  },
} as const;

export type Translations = typeof enUS;
