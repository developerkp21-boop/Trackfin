import { Children, isValidElement } from 'react'
import ReactSelect from 'react-select'

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '42px',
    borderRadius: '0.75rem',
    backgroundColor: 'var(--bg-card)',
    borderColor: state.isFocused ? 'var(--brand-strong)' : 'var(--border-subtle)',
    boxShadow: state.isFocused ? '0 0 0 2px color-mix(in srgb, var(--brand-primary) 45%, transparent)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--brand-strong)' : 'var(--border-strong)'
    }
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 0.75rem'
  }),
  input: (base) => ({
    ...base,
    color: 'var(--text-primary)'
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--text-primary)'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--text-muted)'
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
    zIndex: 20
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'color-mix(in srgb, var(--brand-primary) 45%, var(--bg-card))'
      : state.isFocused
        ? 'color-mix(in srgb, var(--brand-soft) 60%, var(--bg-card))'
        : 'var(--bg-card)',
    color: 'var(--text-primary)'
  })
}

const Select = ({
  label,
  helper,
  error,
  className = '',
  wrapperClassName = 'mb-3',
  children,
  name,
  value,
  onChange,
  placeholder = 'Select...',
  isSearchable = true,
  isClearable = false,
  ...props
}) => {
  const options = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === 'option')
    .map((child) => ({
      value: String(child.props.value ?? ''),
      label: child.props.children
    }))

  const selectedOption = options.find((option) => option.value === String(value ?? '')) || null

  return (
    <div className={wrapperClassName}>
      {label && <label className="form-label fw-medium text-secondary small">{label}</label>}
      <ReactSelect
        className={className}
        classNamePrefix="trackfin-select"
        options={options}
        value={selectedOption}
        onChange={(option) => onChange?.({ target: { name, value: option?.value ?? '' } })}
        styles={selectStyles}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        noOptionsMessage={() => 'No options'}
        {...props}
      />
      {helper && !error && <div className="form-text text-muted small">{helper}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

export default Select
