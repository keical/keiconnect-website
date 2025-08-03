import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState, forwardRef } from "react";

interface PasswordInputProps {
  id?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  id = "custom-password-input",
  placeholder = "Password",
  name,
  value,
  onChange,
  className,
}, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={className}
          ref={ref}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls={id}
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;