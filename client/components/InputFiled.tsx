interface Props {
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  required?: boolean
}

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  required = false
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring focus:ring-indigo-500 duration-300"
      />
    </div>
  )
}