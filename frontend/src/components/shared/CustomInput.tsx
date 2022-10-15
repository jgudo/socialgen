import React from "react";
import { Path, UseFormRegister } from "react-hook-form";

type InputProps = {
  label: Path<any>;
  register: UseFormRegister<any>;
  required: boolean;
  error?: any;
  className?: string;
  [prop: string]: any;
};

const CustomInput = ({ label, register, required, error, className, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col justify-start">
      <input {
        ...register(label, { required })}
        {...rest}
        className={`${className} ${error ? '!border-red-300 !focus:border-red-600 !focus:ring-red-500' : ''}`}
      />
      {error && typeof error === 'string' && (
        <span className="text-xs ml-4 text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};

export default CustomInput;
