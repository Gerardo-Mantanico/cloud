/* eslint-disable react/prop-types */
import classNames from "classnames";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from 'react-select/async';
import CodeMirror from '@uiw/react-codemirror';
// import { loadLanguage, langs } from '@uiw/codemirror-extensions-langs';

export const InputFieldCode = ({
  input,
  meta: { touched, error },

  placeholder = "...",
  label = "",
  labelClassNames = "",
  readOnly = false,
  // lang = "txt"
}) => (
  <div className="form-group">
    <label
      className={classNames("form-label", {
        [labelClassNames]: labelClassNames,
      })}
    >
      {label}
    </label>
    <CodeMirror
      placeholder={placeholder}
      className={classNames("form-control", { "is-invalid": touched && error })}
      readOnly={readOnly}
      height="400px"
      // extensions={[langs.html()]}
      {...input}
    />
    {error && touched && <span className="invalid-feedback">{error}</span>}
  </div>
);


export const InputField = ({
  input,
  meta: { touched, error },
  type = "text",
  placeholder = "...",
  label = "",
  labelClassNames = "",
  readOnly = false,
}) => (
  <div className="form-group">
    <label
      className={classNames("form-label", {
        [labelClassNames]: labelClassNames,
      })}
    >
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className={classNames("form-control", { "is-invalid": touched && error })}
      readOnly={readOnly}
      {...input}
    />
    {error && touched && <span className="invalid-feedback">{error}</span>}
  </div>
);

export const InputNumberField = ({
  input,
  decimalScale,
  placeholder,
  meta: { touched, error },
  prefix = "",
  suffix = "",
  numberFormat,
  readOnly = false,
  labelClassNames = "",
  label,
  thousandSeparator = "",
  allowNegative = true,
  allowLeadingZeros = false,
}) => {
  const invalid = touched && error;

  return (
    <div className="form-group">
      <label
        className={classNames("form-label", {
          [labelClassNames]: labelClassNames,
        })}
      >
        {label}
      </label>
      <NumericFormat
        value={input.value}
        placeholder={placeholder}
        className={classNames("form-control", { "is-invalid": invalid })}
        decimalScale={decimalScale || 0}
        format={numberFormat}
        fixedDecimalScale
        thousandSeparator={thousandSeparator}
        prefix={prefix}
        suffix={suffix}
        onValueChange={(values) => {
          input.onChange(values.value);
        }}
        readOnly={readOnly}
        allowNegative={allowNegative}
        allowLeadingZeros={allowLeadingZeros}
      />
      {invalid && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export const InputSelect = ({
  input,
  disabled,
  isClearable,
  isMulti,
  isSearchable,
  options = [],
  extraChange = null,
  select_style = {},
  placeholder,
  labelKey = "label",
  valueKey = "value",
  meta: { touched, error },
  label = "",
  labelClassNames = "",
}) => {
  const invalid = touched && error;

  const _options = options.map((option) => ({
    ...option,
    label: option[labelKey],
    value: option[valueKey],
  }));

  let value = input.value;
  if (value !== null && value !== undefined) {
    value = _options.find((opt) => opt.value === value);
  }

  return (
    <div className="form-group">
      <label
        className={classNames("form-label", {
          [labelClassNames]: labelClassNames,
        })}
      >
        {label}
      </label>
      <Select
        styles={select_style}
        isClearable={isClearable}
        className={classNames({ "is-invalid": invalid })}
        backspaceRemovesValue={false}
        isMulti={isMulti}
        isSearchable={isSearchable}
        options={_options}
        placeholder={placeholder}
        onChange={(e) => {
          if (extraChange) {
            extraChange(e[valueKey]);
          }
          input.onChange(e ? e[valueKey] : null);
        }}
        value={value || ""}
        isDisabled={disabled}
        menuPlacement="auto"
      />
      {invalid && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export const InputAsyncCreatable = ({
  input,
  disabled,
  labelKey = "label",
  valueKey = "value",
  meta: { touched, error },
  label = "",
  labelClassNames = "",
  allowCreateWhileLoading = false,
  createText = "Create option",
  searchText = "Write to search",
  loadOptions,
  extraChange = null,
  onCreateOption = null,
}) => {
  const extraProps = {};
  if (onCreateOption) extraProps.onCreateOption = onCreateOption;

  const invalid = touched && error;

  return (
    <div className="form-group">
      <label
        className={classNames("form-label", {
          [labelClassNames]: labelClassNames,
        })}
      >
        {label}
      </label>
      <AsyncCreatableSelect
        disabled={disabled}
        value={input.value}
        defaultOptions
        className={classNames({
          "is-invalid": invalid,
        })}
        onChange={(e) => {
          input.onChange(e);
          if (extraChange) extraChange(e);
        }}
        searchPromptText={searchText}
        valueKey={valueKey}
        labelKey={labelKey}
        loadOptions={loadOptions}
        promptTextCreator={(label) => {
          return `${createText} ${label}`;
        }}
        allowCreateWhileLoading={allowCreateWhileLoading}
        {...extraProps}
      />
      {invalid && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};


export const InputAsyncSelect = ({
  input,
  disabled,
  meta: { touched, error },
  label = "",
  labelClassNames = "",
  searchText = "Buscar email",
  loadOptions,
  extraChange = null,
  labelKey = "label",
  valueKey = "value",
}) => {


  const invalid = touched && error;

  return (
    <div className="form-group">
      <label
        className={classNames("form-label", {
          [labelClassNames]: labelClassNames,
        })}
      >
        {label}
      </label>
      <AsyncSelect
        disabled={disabled}
        value={input.value}
        valueKey={valueKey}
        labelKey={labelKey}
        defaultOptions
        className={classNames({
          "is-invalid": invalid,
        })}
        onChange={(e) => {
          input.onChange(e);
          if (extraChange) extraChange(e);
        }}
        searchPromptText={searchText}
        loadOptions={loadOptions}
      />
      {invalid && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};