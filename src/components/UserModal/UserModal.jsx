import { useState, useEffect } from 'react'
import './UserModal.css'

const INITIAL_FORM = {
  firstName: '', lastName: '', email: '', phone: '', age: '',
  gender: '', role: '', image: '',
  address: '', city: '', state: '', country: '',
  company: '', department: '', title: '',
}

const REQUIRED = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'role']

function validate(form) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address'
  if (!form.phone.trim()) errors.phone = 'Phone is required'
  if (!form.age) errors.age = 'Age is required'
  else if (isNaN(form.age) || form.age < 1 || form.age > 120) errors.age = 'Age must be 1–120'
  if (!form.gender) errors.gender = 'Gender is required'
  if (!form.role.trim()) errors.role = 'Role is required'
  return errors
}

const Field = ({ label, name, type = 'text', required, options, value, onChange, onBlur, errors, touched }) => (
  <div className={`form-field ${errors[name] && touched[name] ? 'has-error' : ''}`}>
    <label className="form-label" htmlFor={name}>
      {label}{required && <span className="required-star">*</span>}
    </label>
    {options ? (
      <select id={name} name={name} className="form-control" value={value} onChange={onChange} onBlur={onBlur}>
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        className="form-control"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    )}
    {errors[name] && touched[name] && <span className="form-error">{errors[name]}</span>}
  </div>
)

export default function UserModal({ user, onSubmit, onClose, isLoading }) {
  const isEdit = Boolean(user)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age?.toString() || '',
        gender: user.gender || '',
        role: user.role || '',
        image: user.image || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || '',
        company: user.company?.name || '',
        department: user.company?.department || '',
        title: user.company?.title || '',
      })
    } else {
      setForm(INITIAL_FORM)
    }
    setErrors({})
    setTouched({})
  }, [user])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value })
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const newErrors = validate(form)
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = {}
    REQUIRED.forEach(f => { allTouched[f] = true })
    setTouched(allTouched)
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: parseInt(form.age, 10),
      gender: form.gender,
      role: form.role.trim(),
      image: form.image.trim() || undefined,
      address: { address: form.address.trim(), city: form.city.trim(), state: form.state.trim(), country: form.country.trim() },
      company: { name: form.company.trim(), department: form.department.trim(), title: form.title.trim() },
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="user-modal" onClick={e => e.stopPropagation()}>
        <div className="user-modal-header">
          <h2 id="modal-title" className="user-modal-title">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="user-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="user-modal-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              <div className="form-grid-2">
                <Field label="First Name" name="firstName" required value={form.firstName} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Last Name" name="lastName" required value={form.lastName} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Email" name="email" type="email" required value={form.email} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Age" name="age" type="number" required value={form.age} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Gender" name="gender" required options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} value={form.gender} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Role" name="role" required value={form.role} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Profile Image URL" name="image" type="url" value={form.image} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Address</h3>
              <div className="form-grid-2">
                <div className="form-field-full">
                  <Field label="Address Line" name="address" value={form.address} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                </div>
                <Field label="City" name="city" value={form.city} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Company</h3>
              <div className="form-grid-2">
                <Field label="Company Name" name="company" value={form.company} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Department" name="department" value={form.department} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
                <Field label="Title" name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} errors={errors} touched={touched} />
              </div>
            </div>
          </div>

          <div className="user-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <><span className="btn-spinner"></span>{isEdit ? 'Saving...' : 'Creating...'}</>
              ) : (
                <>{isEdit ? 'Save Changes' : 'Create User'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
