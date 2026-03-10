import { useState } from 'react'

function validate(fields) {
  const errors = {}
  if (!fields.name.trim())
    errors.name = 'Name is required'
  else if (fields.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters'

  if (!fields.email.trim())
    errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Enter a valid email address'

  if (!fields.password.trim())
    errors.password = 'Password is required'
  else if (fields.password.length < 8)
    errors.password = 'Password must be at least 8 characters'

  if (!fields.age.trim())
    errors.age = 'Age is required'
  else if (isNaN(fields.age) || Number(fields.age) < 18)
    errors.age = 'You must be at least 18 years old'

  return errors
}

// ── Bad Form — no accessibility ──────────────────────────────────────────────
function BadForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="comparison-card bad">
      <div className="comparison-label bad">✗ Wrong — inaccessible form</div>
      <p className="comparison-desc">
        No labels, no error messages, no required indicators.
        Screen readers have no idea what each field is for.
      </p>

      <div className="form-demo-area">
        <input
          type="text"
          placeholder="Name"
          className="form-input"
          aria-label="none"
        />
        <input
          type="text"
          placeholder="Email"
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
        />
        <input
          type="text"
          placeholder="Age"
          className="form-input"
        />
        <button
          className="focus-item with-focus"
          onClick={() => setSubmitted(true)}
        >
          Submit
        </button>

        {submitted && (
          <div style={{ color: '#f87171', fontSize: '0.82rem' }}>
            Something went wrong.
          </div>
        )}
      </div>

      <div className="code-block">
        <span className="code-red">{'// no <label>, no aria-describedby,'}</span>{'\n'}
        <span className="code-red">{'// no role="alert", placeholder only'}</span>
      </div>
    </div>
  )
}

// ── Good Form — fully accessible ─────────────────────────────────────────────
function GoodForm() {
  const [fields, setFields]     = useState({ name: '', email: '', password: '', age: '' })
  const [errors, setErrors]     = useState({})
  const [touched, setTouched]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess]   = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // validate on change if field already touched
    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: value })
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const newErrors = validate({ ...fields, [name]: fields[name] })
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const allTouched = { name: true, email: true, password: true, age: true }
    setTouched(allTouched)
    const newErrors = validate(fields)
    setErrors(newErrors)
    setSubmitted(true)

    if (Object.keys(newErrors).length === 0) {
      setSuccess(true)
    }
  }

  const fields_config = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      hint: 'Enter your first and last name',
      autocomplete: 'name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      hint: 'We will never share your email',
      autocomplete: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      hint: 'Minimum 8 characters',
      autocomplete: 'new-password',
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      hint: 'Must be 18 or older',
      autocomplete: 'off',
    },
  ]

  return (
    <div className="comparison-card good">
      <div className="comparison-label good">✓ Correct — accessible form</div>
      <p className="comparison-desc">
        Proper labels, live validation, clear error messages,
        ARIA descriptions. Screen readers announce everything correctly.
      </p>

      {success ? (
        <div
          role="alert"
          aria-live="assertive"
          className="form-success"
        >
          ✓ Form submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="form-demo-area">
          {fields_config.map(field => (
            <div key={field.name} className="form-group">

              {/* label linked to input via htmlFor */}
              <label
                htmlFor={`good-${field.name}`}
                className="form-label"
              >
                {field.label}
                {field.required && <span className="required" aria-hidden="true"> *</span>}
              </label>

              {/* input with full ARIA wiring */}
              <input
                id={`good-${field.name}`}
                name={field.name}
                type={field.type}
                value={fields[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete={field.autocomplete}
                required={field.required}
                aria-required={field.required}
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name]
                    ? `${field.name}-error`
                    : `${field.name}-hint`
                }
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
              />

              {/* hint — shown before error */}
              {!errors[field.name] && (
                <span
                  id={`${field.name}-hint`}
                  className="form-hint"
                >
                  {field.hint}
                </span>
              )}

              {/* error — role=alert announces immediately */}
              {errors[field.name] && (
                <span
                  id={`${field.name}-error`}
                  role="alert"
                  className="form-error"
                >
                  ⚠ {errors[field.name]}
                </span>
              )}

            </div>
          ))}

          {/* required fields note */}
          <p style={{ fontSize: '0.75rem', color: '#555' }}>
            <span style={{ color: '#f87171' }}>*</span> Required fields
          </p>

          <button
            type="submit"
            className="focus-item with-focus active-green"
            aria-describedby={submitted && Object.keys(errors).length > 0 ? 'form-error-summary' : undefined}
          >
            Submit Form
          </button>

          {/* error summary — announced after failed submit */}
          {submitted && Object.keys(errors).length > 0 && (
            <div
              id="form-error-summary"
              role="alert"
              aria-live="assertive"
              className="form-error-summary"
            >
              ⚠ {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} found — please fix them above
            </div>
          )}
        </form>
      )}

      <div className="code-block" style={{ marginTop: '1rem' }}>
        <span className="code-green">{'<label htmlFor="email">Email</label>'}</span>{'\n'}
        <span className="code-green">{'<input'}</span>{'\n'}
        {'  '}<span className="code-blue">{'id="email"'}</span>{'\n'}
        {'  '}<span className="code-blue">{'aria-invalid={!!error}'}</span>{'\n'}
        {'  '}<span className="code-blue">{'aria-describedby="email-error"'}</span>{'\n'}
        <span className="code-green">{'/>'}</span>{'\n'}
        <span className="code-green">{'<span id="email-error" role="alert">'}</span>{'\n'}
        {'  '}<span className="code-amber">{'Error message here'}</span>{'\n'}
        <span className="code-green">{'</span>'}</span>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
function FormDemo() {
  return (
    <div>
      <div className="demo-header">
        <h2>Form Accessibility — WCAG 1.3.1, 3.3.1, 3.3.2</h2>
        <p>
          Forms are the most common accessibility failure on the web.
          Missing labels, unclear errors, and no ARIA wiring makes forms
          completely unusable for screen reader and keyboard users.
        </p>
      </div>

      {/* side by side forms */}
      <div className="comparison-grid">
        <BadForm />
        <GoodForm />
      </div>

      {/* checklist */}
      <div className="card">
        <div className="card-title">Accessible Form Checklist</div>
        <div className="checklist">
          {[
            { item: 'Every input has a <label> linked via htmlFor/id',           done: true  },
            { item: 'Required fields marked with aria-required="true"',           done: true  },
            { item: 'Errors use role="alert" so screen readers announce them',    done: true  },
            { item: 'aria-invalid="true" set on inputs with errors',              done: true  },
            { item: 'aria-describedby links input to its error or hint',          done: true  },
            { item: 'Error summary shown after failed submit attempt',            done: true  },
            { item: 'Placeholder text used as label only (without visible label)',done: false },
            { item: 'Color alone used to indicate errors (no icon or text)',      done: false },
            { item: 'No autocomplete attribute on common fields',                 done: false },
          ].map((c, i) => (
            <div key={i} className={`checklist-item ${c.done ? 'pass' : 'fail'}`}>
              <span className="checklist-icon">{c.done ? '✓' : '✗'}</span>
              <span className="checklist-text">{c.item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default FormDemo