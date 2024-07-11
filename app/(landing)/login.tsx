"use client";

import { useState } from "react";
import { LoginDialog } from "~/components/login-dialog";

export const Login = () => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
        login
      </div>
      <LoginDialog open={isOpen} onClose={setIsOpen} />
    </>
  );
};
