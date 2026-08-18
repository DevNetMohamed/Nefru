import { useState, useId } from "react";

import style from "./Inputs.module.css";

// import { IoSearchOutline } from "react-icons/io5";

// import { MdOutlineTune } from "react-icons/md";

import Icons from "../../../assets/icons";

export default function Input({
  id,

  name,

  title,

  placeholder,

  icon,

  type = "text",

  value,

  setValue,

  onFocus,

  onBlur,
  className,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const generatedId = useId();

  const inputId = id || generatedId;

  const inputName = name || id || generatedId;

  return (
    <div className={`${className} ${style.input_icon_container}`}>
      <label htmlFor={inputId} style={{ cursor: "pointer" }}>
        {title}
      </label>

      <div
        className={`${style.input_container} ${isFocused ? style.focused : ""}`}
      >
        <div className={`${style.icon} ${isFocused ? style.focused : ""}`}>
          {icon}
        </div>

        <input
          id={inputId}
          name={inputName}
          placeholder={placeholder}
          value={value}
          type={
            type === "password" ? (showPassword ? "text" : "password") : "text"
          }
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => {
            setIsFocused(true);

            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);

            onBlur?.(e);
          }}
        />

        {type === "password" && (
          <div
            type="button"
            className={style.showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Icons.EyeSlash /> : <Icons.Eye />}
          </div>
        )}
      </div>
    </div>
  );
}

// function InputIconFilter({ placeholder, value, setValue, icon }) {

//   return (

//     <div className="container">

//         <div className="input-container">

//         <IoSearchOutline className="icon" style={{fontSize: "27px" }}/>

//         <input

//             placeholder={placeholder}

//             value={value}

//             onChange={(e) => setValue(e.target.value)}

//         />

//         </div>

//         <div className="filter">

//             <MdOutlineTune className="filter-btn" style={{fontSize: "27px" }}/>

//         </div>

//     </div>

//   )

// }

export { Input };
