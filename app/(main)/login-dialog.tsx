"use client";

import { useState } from "react";
import { LoginDialog } from "~/components/login-dialog";
import { Button } from "~/components/primitives/button";

export const Login = () => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
        login
      </Button>

      <LoginDialog open={isOpen} onClose={setIsOpen} />
    </>
  );
};
