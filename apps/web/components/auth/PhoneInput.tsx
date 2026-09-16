const COUNTRY_CODES = [
  { code: "+91", label: "IN +91" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
];

export function PhoneInput({
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
}: {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <select
        aria-label="Country code"
        value={countryCode}
        onChange={(e) => onCountryCodeChange(e.target.value)}
        className="rounded-lg border border-maroon-500/20 bg-cream-50 px-2 text-sm text-maroon-900 focus:outline-none focus:ring-2 focus:ring-maroon-500/40"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="Phone number"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        maxLength={10}
        className="flex-1 rounded-lg border border-maroon-500/20 bg-cream-50 px-4 py-2.5 text-sm text-maroon-900 placeholder:text-maroon-900/40 focus:outline-none focus:ring-2 focus:ring-maroon-500/40"
      />
    </div>
  );
}
