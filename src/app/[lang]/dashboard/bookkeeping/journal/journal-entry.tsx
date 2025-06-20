"use client";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";
import z from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useAppForm } from "@/components/ui/form";
import type { Account } from "@/i18n/get-dictionary.ts";
import { cn } from "@/lib/utils";
import { insertJournalEntry } from "./actions.ts";
import { OptimisticContext } from "./context.tsx";

const JournalEntrySchema = z.object({
  date: z.iso.date(),
  description: z.string().min(1, "Description is required"),
  accounts: z.array(
    z.object({
      code: z.string().length(4),
      name: z.string().nonempty("You need to provide an account name"),
      debit: z.string().regex(/^\d*\.?\d*$/),
      credit: z.string().regex(/^\d*\.?\d*$/),
    })
  ),
});

export default function JournalEntry({
  className,
  accounts,
}: {
  className?: string;
  accounts: Account[];
}) {
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { setIsPending } = use(OptimisticContext);

  const form = useAppForm({
    defaultValues: {
      date: Temporal.Now.plainDateISO().toString(),
      description: "",
      accounts: [
        { code: "0000", name: "", debit: "0", credit: "0" },
        { code: "0000", name: "", debit: "0", credit: "0" },
      ],
    },
    validators: {
      onSubmit: JournalEntrySchema,
    },
    onSubmit: async ({ value }) => {
      setIsFormVisible(false);
      form.reset();

      setIsPending(true);
      const { success } = await insertJournalEntry({
        info: {
          createdAt: value.date,
          description: value.description,
        },
        accounts: value.accounts,
      });
      setIsPending(false);

      if (!success) {
        toast("Oops an error has occured");
      } else router.refresh();
    },
  });

  return (
    <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
      <DialogTrigger asChild>
        <Button className="rounded-none">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-none xl:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
          <DialogDescription className="sr-only">
            Form for entering transaction into the journal
          </DialogDescription>
        </DialogHeader>

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
                        {(field) => {
                          return (
                            <field.Combo
                              className="col-span-3"
                              placeholder="Select account"
                            >
                              <field.ComboList>
                                {accounts.map((account) => (
                                  <field.ComboItem
                                    key={`${account.code}-${account.name}`}
                                    onSelect={(value) => {
                                      form.replaceFieldValue("accounts", i, {
                                        ...form.getFieldValue(`accounts[${i}]`),
                                        code: account.code,
                                      });
                                      field.setValue(value);
                                    }}
                                  >
                                    <span className="font-medium">
                                      {account.code}
                                    </span>{" "}
                                    <span>{account.name}</span>
                                  </field.ComboItem>
                                ))}
                              </field.ComboList>

                              <field.ComboEmpty>
                                No account matching
                              </field.ComboEmpty>
                            </field.Combo>
                          );
                        }}
                      </form.AppField>

                      <form.AppField name={`accounts[${i}].debit`}>
                        {(field) => <field.Text className="z-10" />}
                      </form.AppField>

                      <form.AppField name={`accounts[${i}].credit`}>
                        {(field) => <field.Text className="z-10" />}
                      </form.AppField>

                      <Button
                        variant="ghost"
                        className={cn(
                          "-right-7 absolute top-1.5 hidden size-6 rounded-none bg-zinc-100 hover:bg-red-50 hover:text-red-600",
                          {
                            flex: accountsField.state.value.length > 2,
                          }
                        )}
                        disabled={accountsField.state.value.length < 2}
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
                        code: "0000",
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
            <form.Submit>Submit Me</form.Submit>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
}
