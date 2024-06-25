import * as React from "react";
import * as Headless from "@headlessui/react";
import { clsx } from "clsx";
import { X } from "../icons/x";

export const MultiInput = React.forwardRef(function MultiInput(
  {
    className,
    onChange,
    value = [],
    ...props
  }: {
    className?: string;
    onChange: (value: string[]) => void;
    value?: string[];
  } & Omit<React.ComponentPropsWithoutRef<typeof Headless.Input>, "className" | "onChange" | "value">,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [inputValue, setInputValue] = React.useState("");
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTags = [...value, inputValue.trim()];
      onChange(newTags);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (wrapperRef.current && e.target === wrapperRef.current) {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleWrapperClick}
      className={clsx([
        className,
        "relative block w-full items-center",
        "rounded-lg border border-zinc-950/10 dark:border-white/10",
        "focus-within:ring-2 focus-within:ring-blue-500",
        "p-1",
      ])}
    >
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <span
            key={index}
            className={clsx(
              "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
              "bg-zinc-50 text-zinc-700 ring-1 ring-inset ring-zinc-900/10",
              "dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-400/20"
            )}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <Headless.Input
          ref={inputRef}
          {...props}
          //   value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className={clsx([
            "flex-grow min-w-[80px]",
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-xs/5 dark:text-white",
            "border-0",
            "bg-transparent dark:bg-transparent",
            "focus:outline-none",
          ])}
        />
      </div>
    </div>
  );
});
