import type { UseFormRegisterReturn } from 'react-hook-form';

type AuthInputFieldProps = {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
};

export default function AuthInputField({ type, placeholder, register, error }: AuthInputFieldProps) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        {...register}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}