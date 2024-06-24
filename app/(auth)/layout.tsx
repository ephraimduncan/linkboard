import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col w-full items-center justify-center min-h-screen p-4">{children}</div>;
};

export default AuthLayout;
