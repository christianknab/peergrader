import React from 'react';

const SingleLineInputField = (props: { type: string, name: string, placeholder?: string, label: string, required?: boolean }) => {
    return (
        <fieldset className="relative">
            <input type={props.type} name={props.name} className="peer p-3 block w-full border mb-1 rounded-lg text-base placeholder:text-transparent disabled:opacity-50 disabled:pointer-events-none
  focus:pt-5
  focus:pb-1
  [&:not(:placeholder-shown)]:pt-5
  [&:not(:placeholder-shown)]:pb-1
  autofill:pt-5
  autofill:pb-1" placeholder={props.placeholder ?? ""} required={props.required} />
            <label htmlFor={props.name} className="absolute top-0 start-0 p-3 h-full text-base truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-sm
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500
    peer-[:not(:placeholder-shown)]:text-sm
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500">{props.label}</label>
        </fieldset>
    );
};

export default SingleLineInputField;