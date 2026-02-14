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
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        className="px-4 py-2 h-10 rounded-lg text-sm bg-white border border-pink-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-pink-300 focus:border-pink-300 duration-300"
      />
    </div>
  )
}