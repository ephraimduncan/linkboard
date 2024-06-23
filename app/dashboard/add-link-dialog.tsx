"use client";

import { Button } from "~/components/primitives/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "~/components/primitives/dialog";
import { Input } from "~/components/primitives/input";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";

export const AddLinkDialog = () => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add link
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>add link</DialogTitle>

        <DialogBody>
          <Input name="link" placeholder="https://duncan.land" />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Add link</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
