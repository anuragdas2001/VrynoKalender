import React, { useState } from "react";
import { paramCase } from "change-case";
import { useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export type MultipleEmailInputBoxProps = {
  name: string;
  label: string;
  disabled: boolean;
  items: string[];
  handleAdd: (newEmails: string[]) => void;
  handleDelete: (newEmails: string[]) => void;
  adminsError: string;
};

export const MultipleEmailInputBox = (props: MultipleEmailInputBoxProps) => {
  const { errors: formikErrors, setErrors } = useFormikContext();

  const [state, setState] = useState({
    value: "",
    error: "",
  });

  const isValid = (email: string, bypassAlreadyExist: boolean) => {
    let error = null;

    if (email.length > 256) {
      error = `Email address is too long.`;
    }

    if (!bypassAlreadyExist && isInList(email)) {
      error = `Email has already been added.`;
    }

    if (!isEmail(email)) {
      error = `This is not a valid email address.`;
    }

    if (error) {
      setState({ ...state, error });
      // setErrors({ [props.name]: error });
      return error;
    }
    return null;
  };

  const isInList = (email: string) => {
    return props.items.includes(email);
  };

  // const isEmail = (email: string) => {
  //   // return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  //   return Yup.string()?.email()?.validateSync(email);
  // };

  const isEmail = (email: string) => {
    // return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    const emailSchema = Yup.string().email();
    const result = emailSchema.isValidSync(email);
    return result;
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === "Tab" && props.items.every((item) => isEmail(item))) {
      return;
    }
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      const value = state.value.trim();
      const error = isValid(value, false);

      if (value && error === null) {
        props.handleAdd([...props.items, state.value]);
        setState({
          ...state,
          value: "",
        });
      }
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      value: evt.target.value,
      error: "",
    });
  };

  const handleDelete = (item: string) => {
    const filteredEmails = props.items.filter((i) => i !== item);
    const errors: string[] = [];
    filteredEmails.forEach((email) => {
      const error = isValid(email, true);
      if (error) {
        errors.push(error);
      }
    });
    if (errors.length > 0) {
      setErrors({ [props.name]: errors[0] });
      setState({ ...state, error: errors[0] });
    } else {
      const updatedFormikErrors: { [key: string]: string } = {
        ...formikErrors,
      };
      setState({ ...state, error: "" });
      delete updatedFormikErrors[props.name];
      setErrors(updatedFormikErrors);
    }
    props.handleDelete(filteredEmails);
  };

  const handlePaste = (evt: React.ClipboardEvent<HTMLTextAreaElement>) => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData("text");
    // const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);
    const potentialEmails = paste.split(/\s+/).filter(Boolean); // Split by whitespace to get potential email-like substrings

    if (paste.length > 256) {
      setErrors({ [props.name]: "Email address is too long" });
      setState({ ...state, error: "Email address is too long" });
    }

    // if (emails) {
    //   const toBeAdded = emails.filter((email: string) => !isInList(email));
    //   props.handleAdd([...props.items, ...toBeAdded]);
    // }
    let error = "";
    const validEmails = potentialEmails.filter((email) => {
      const isValidEmail = isEmail(email);
      if (!isValidEmail) {
        error = "Invalid email address found in pasted text";
      }
      return isValidEmail;
    });
    if (error) {
      toast.error(error);
      return;
    }
    if (validEmails.length > 0) {
      const toBeAdded = validEmails.filter((email) => !isInList(email));
      props.handleAdd([...props.items, ...toBeAdded]);
    }
  };

  return (
    <div className="flex flex-col  mt-4 mb-4">
      <label
        className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray`}
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div
        className={`border
            ${state.error ? "border-red-200" : "border-vryno-form-border-gray"}
            relative
            w-full
            rounded-md
            placeholder-gray-500 px-2 py-2 ${
              props.disabled ? "bg-vryno-field-disabled" : ""
            }`}
      >
        <div className="max-h-14 lg:max-h-20 overflow-y-scroll text-sm">
          {props.items.map((item, index) => (
            <span
              className={`bg-vryno-theme-highlighter-blue px-2 rounded-lg mr-2 inline-block my-1`}
              key={index}
            >
              <span className="pl-1 break-all">{`${item}`}</span>

              {!props.disabled ? (
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => handleDelete(item)}
                >
                  x
                </span>
              ) : null}
            </span>
          ))}
        </div>
        {!props.disabled && (
          <textarea
            className={`outline-none block w-full text-sm`}
            id={paramCase(props.name)}
            name={props.name}
            value={state.value}
            placeholder="Type email addresses and press Enter"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onPaste={handlePaste}
            disabled={props.disabled}
            rows={1}
          />
        )}
      </div>
      {state.error && (
        <span className="text-red-600 ml-2 mt-1 text-xs">{state.error}</span>
      )}
      {props.adminsError && (
        <span className="text-red-600 ml-2 mt-1 text-xs">
          {props.adminsError}
        </span>
      )}
    </div>
  );
};
