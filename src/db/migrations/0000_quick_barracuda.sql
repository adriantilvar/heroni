CREATE TABLE "journal" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"category" text,
	"attachments" text
);
--> statement-breakpoint
CREATE TABLE "sub_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"debit" numeric NOT NULL,
	"credit" numeric NOT NULL,
	"journal_entry" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sub_ledger" ADD CONSTRAINT "sub_ledger_journal_entry_journal_id_fk" FOREIGN KEY ("journal_entry") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;