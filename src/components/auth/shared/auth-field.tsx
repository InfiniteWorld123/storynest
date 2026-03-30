import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "#/lib/utils";
import { Input } from "#/components/ui/input";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  description?: string;
  error?: string;
}

export function AuthField({
  id,
  label,
  description,
  error,
  className,
  ...inputProps
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  const describedByIds: string[] = [];
  if (description) describedByIds.push(`${id}-description`);
  if (error) describedByIds.push(`${id}-error`);

  return (
    <div className="space-y-1.5">
      {/* Tight-caps label — same pattern as contact form */}
      <label
        htmlFor={id}
        className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
        style={{ color: focused ? 'var(--accent-warm)' : 'var(--foreground)' }}
      >
        {label}
      </label>

      {/* Input with amber focus ring */}
      <Input
        id={id}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full px-4 font-sans text-sm transition-all duration-200",
          className,
        )}
        style={{
          height: '2.75rem',
          backgroundColor: 'var(--secondary)',
          color: 'var(--foreground)',
          border: error
            ? '1.5px solid var(--destructive)'
            : focused
            ? '1.5px solid var(--accent-warm)'
            : '1px solid var(--border)',
        }}
        aria-invalid={!!error || undefined}
        aria-describedby={
          describedByIds.length ? describedByIds.join(" ") : undefined
        }
        {...inputProps}
      />

      {description && (
        <p
          id={`${id}-description`}
          className="font-sans text-xs leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {description}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="font-sans text-xs"
          style={{ color: 'var(--destructive)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
