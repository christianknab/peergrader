interface InputFieldFormProps {
    format?: string;
    label: string;
    value: string;
    name: string;
    type: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired: boolean;
    disabled?: boolean;
}

export default function InputFieldForm({ format, label, value, name, type, onChange, isRequired, disabled = false }: InputFieldFormProps) {
    return (
        <div className={format}>
            <label className="block text-gray-700 mb-2">
                {label}
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={type}
                name={name}
                defaultValue={value}
                onChange={onChange}
                required={isRequired}
                disabled={disabled}
            />
        </div>
    );
}
