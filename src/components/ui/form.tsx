import { cn } from "@/lib/utils.ts";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { Button, type ButtonProps } from "./button.tsx";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command.tsx";
import { Input } from "./input.tsx";
import { Label as StyledLabel } from "./label.tsx";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Label,
    Text,
    Combo,
    ComboItem,
    ComboEmpty,
  },
  formComponents: {
    Submit,
  },
});

type TextProps = Omit<
  ComponentProps<"input">,
  "id" | "name" | "value" | "onBlur" | "onChange"
>;

function Label({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  const field = useFieldContext();

  return (
    <StyledLabel className={className} htmlFor={field.name}>
      {children}
    </StyledLabel>
  );
}

function Text({ className, ...props }: TextProps) {
  const field = useFieldContext<string>();

  return (
    <Input
      className={cn("rounded-none", className)}
      id={field.name}
      name={field.name}
      aria-invalid={!field.state.meta.isValid}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      {...props}
    />
  );
}

function Combo({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandInput> & { options?: string[] }) {
  const field = useFieldContext<string>();

  return (
    <Command
      className={cn(
        "relative h-9 overflow-visible rounded-none border",
        className
      )}
    >
      <CommandInput
        id={field.name}
        name={field.name}
        aria-invalid={!field.state.meta.isValid}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={field.handleChange}
        className="peer"
        {...props}
      />

      <CommandList className="-mx-px invisible absolute inset-x-0 top-9 z-50 border bg-background peer-focus:visible">
        {children}
      </CommandList>
    </Command>
  );
}

function ComboItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandItem>) {
  const field = useFieldContext<string>();

  return (
    <CommandItem
      className="items-baseline rounded-none"
      onMouseDown={(e) => e.preventDefault()}
      onSelect={(currentValue) => field.setValue(currentValue)}
      {...props}
    />
  );
}

function ComboEmpty(props: React.ComponentProps<typeof CommandEmpty>) {
  return (
    <CommandEmpty
      className="px-2 py-3 text-muted-foreground text-sm"
      {...props}
    />
  );
}

function Submit({ children, className, type, ...props }: ButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          className={cn("w-full select-none rounded-none", className)}
          disabled={!canSubmit}
          {...props}
        >
          {isSubmitting ? "Submitting..." : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
