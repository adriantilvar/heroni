"use client";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Temporal } from "temporal-polyfill";
import z from "zod/v4";

const JournalEntrySchema = z.object({
  date: z.iso.date().transform((date) => Temporal.PlainDate.from(date)),
  description: z.string().min(1, "Description is required"),
  accounts: z.array(
    z.object({
      name: z.string().nonempty("You need to provide an account name"),
      debit: z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number),
      credit: z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number),
    })
  ),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export default function JournalEntryForm({
  className,
  submitHandler,
}: {
  className?: string;
  submitHandler: (data: JournalEntry) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      date: Temporal.Now.plainDateISO().toString(),
      description: "",
      accounts: [
        { name: "", debit: "0", credit: "0" },
        { name: "", debit: "0", credit: "0" },
      ],
    },
    validators: {
      onSubmit: JournalEntrySchema,
    },
    onSubmit: ({ value }) => submitHandler(JournalEntrySchema.parse(value)),
  });

  return (
    <form
      className={cn("space-y-4 py-3", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* <div>J/E number - create it automatically?</div> */}
      {/* add voucher number for the attachement too */}

      <form.AppField name="date">
        {(field) => (
          <div className="w-fit space-y-2">
            <field.Label>Date</field.Label>
            <field.Text type="date" />
          </div>
        )}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <div className="space-y-2">
            <field.Label>Description</field.Label>
            <field.Text placeholder="Give a solid explanation" />
          </div>
        )}
      </form.AppField>

      <form.AppField name="accounts" mode="array">
        {(accountsField) => {
          return (
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-5">
                <accountsField.Label className="col-span-3">
                  Accounts
                </accountsField.Label>
                <p>Debit</p>
                <p>Credit</p>
              </div>

              {accountsField.state.value.map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Recommended key usage
                <div className="relative grid grid-cols-5" key={i}>
                  <form.AppField name={`accounts[${i}].name`}>
                    {(field) => <field.Text className="col-span-3" />}
                  </form.AppField>

                  <form.AppField name={`accounts[${i}].debit`}>
                    {(field) => <field.Text />}
                  </form.AppField>

                  <form.AppField name={`accounts[${i}].credit`}>
                    {(field) => <field.Text />}
                  </form.AppField>

                  <Button
                    variant="ghost"
                    className={cn(
                      "-right-7 absolute top-1.5 hidden size-6 rounded-none bg-zinc-100 hover:bg-red-50 hover:text-red-600",
                      {
                        flex: accountsField.state.value.length > 2,
                      }
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      accountsField.removeValue(i);
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              <Button
                variant="ghost"
                className="w-fit rounded-none"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  accountsField.pushValue({
                    name: "",
                    debit: "0",
                    credit: "0",
                  });
                }}
              >
                <Plus className="size-4" /> Add Account
              </Button>
            </div>
          );
        }}
      </form.AppField>

      <form.AppForm>
        <form.Submit>Submit Me!</form.Submit>
      </form.AppForm>
    </form>
  );
}
