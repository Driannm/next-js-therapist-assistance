"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Facial = {
  id: number;
  name: string;
};

type Option = {
  value: string;
  label: string;
};

const inputStyle =
  "h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-200 transition-all";

const customerTypeOptions: Option[] = [
  { value: "External Client", label: "External Client" },
  { value: "ZEP", label: "ZEP" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
    >
      {pending ? "Saving..." : "Save Treatment"}
    </Button>
  );
}

function SearchableSelect({
  label,
  name,
  value,
  setValue,
  options,
  optional,
  placeholder = "Select option",
}: {
  label: string;
  name: string;
  value: string;
  setValue: (v: string) => void;
  options: Option[];
  optional?: boolean;
  placeholder?: string;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {optional && <span className="text-gray-400">(optional)</span>}
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 px-3 justify-start border-gray-300 text-sm font-normal"
          >
            {selected ? selected.label : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[350px]">
          <Command>
            <CommandInput placeholder="Search..." />

            <CommandEmpty>No result found.</CommandEmpty>

            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => setValue(opt.value)}
                >
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}

export function FormEntry({
  action,
  facials,
}: {
  action: (data: FormData) => Promise<void>;
  facials: Facial[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [customerType, setCustomerType] = useState("");
  const [facialType, setFacialType] = useState("");
  const [nextTreatment, setNextTreatment] = useState("");

  const facialOptions: Option[] = facials.map((f) => ({
    value: String(f.id),
    label: f.name,
  }));

  async function handleSubmit(formData: FormData) {
    try {
      await action(formData);

      toast.success("Treatment recorded");

      formRef.current?.reset();
      setCustomerType("");
      setFacialType("");
      setNextTreatment("");
    } catch {
      toast.error("Failed to save treatment");
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Customer Treatment Form
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Record a new customer treatment
        </p>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-6 max-w-xl">
        {/* Order Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Order number
          </label>

          <Input
            name="orderNo"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="10293"
            required
            className={inputStyle}
            autoFocus
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Customer name
          </label>

          <Input
            name="customerName"
            placeholder="Full name"
            required
            className={inputStyle}
          />
        </div>

        {/* Customer Type */}
        <SearchableSelect
          label="Customer Type"
          name="customerType"
          value={customerType}
          setValue={setCustomerType}
          options={customerTypeOptions}
          placeholder="Select customer type"
        />

        {/* Treatment */}
        <SearchableSelect
          label="Treatment"
          name="facialTypeId"
          value={facialType}
          setValue={setFacialType}
          options={facialOptions}
          placeholder="Select treatment"
        />

        {/* Next Treatment */}
        <SearchableSelect
          label="Next Treatment"
          name="nextTreatmentId"
          value={nextTreatment}
          setValue={setNextTreatment}
          options={facialOptions}
          optional
          placeholder="Select next treatment"
        />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <SubmitButton />

          <Link href="/recap">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6 border-gray-300"
            >
              View Records
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}