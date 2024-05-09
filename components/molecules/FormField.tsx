import { GeistSans } from "geist/font";
import { TextInput } from "../atoms/TextInput";

type FormFieldProps = {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  handleChange?: (e: any) => void;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  placeholder,
  handleChange,
}) => {
  return (
    <>
      <label className={GeistSans.className + " block"}>
        <span className="text-gray-900 font-light bg-white">{label}</span>
      </label>
      <TextInput
        id={id}
        type={type}
        placeholder={placeholder}
        handleChange={handleChange}
      />
    </>
  );
};
