type GuestForm = {
  name: string;
  email: string;
  phone: string;
};

type BookingDetailsFieldsProps = {
  guests: number;
  rooms: number;
  form: GuestForm;
  onGuestsChange: (value: number) => void;
  onRoomsChange: (value: number) => void;
  onFormChange: (key: keyof GuestForm, value: string) => void;
};

export function BookingDetailsFields({
  guests,
  rooms,
  form,
  onGuestsChange,
  onRoomsChange,
  onFormChange,
}: BookingDetailsFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-muted-foreground">Guests</span>
          <input
            required
            type="number"
            min={1}
            max={12}
            value={guests}
            onChange={(e) =>
              onGuestsChange(Math.min(12, Math.max(1, Number(e.target.value) || 1)))
            }
            className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-muted-foreground">Rooms</span>
          <input
            required
            type="number"
            min={1}
            max={6}
            value={rooms}
            onChange={(e) =>
              onRoomsChange(Math.min(6, Math.max(1, Number(e.target.value) || 1)))
            }
            className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {(
          [
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block sm:col-span-1">
            <span className="eyebrow text-muted-foreground">{label}</span>
            <input
              required
              type={type}
              value={form[key]}
              onChange={(e) => onFormChange(key, e.target.value)}
              className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
        ))}
      </div>
    </>
  );
}

export function BookingStepBar({ step }: { step: "dates" | "details" }) {
  const steps = [
    { id: "dates" as const, label: "Dates" },
    { id: "details" as const, label: "Your details" },
  ];

  return (
    <ol className="flex items-center gap-3 sm:gap-6">
      {steps.map((item, index) => {
        const active = step === item.id;
        const done = item.id === "dates" && step === "details";

        return (
          <li key={item.id} className="flex items-center gap-3 sm:gap-6">
            <span className="flex items-center gap-2">
              <span
                className={
                  active || done
                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-medium text-ivory"
                    : "flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-muted-foreground"
                }
              >
                {index + 1}
              </span>
              <span
                className={
                  active ? "eyebrow text-foreground" : "eyebrow text-muted-foreground"
                }
              >
                {item.label}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
