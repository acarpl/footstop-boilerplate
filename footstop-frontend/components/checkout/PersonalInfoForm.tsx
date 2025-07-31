export default function PersonalInfoForm() {
  return (
    <div className="border p-4 rounded-md">
      <h2 className="font-semibold mb-3">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input placeholder="Name" className="border p-2 rounded" />
        <input placeholder="Email" className="border p-2 rounded" />
        <input placeholder="Phone number" className="border p-2 rounded" />
      </div>
      <label className="text-sm mt-2 flex items-center gap-2">
        <input type="checkbox" /> Use profile as personal information
      </label>
    </div>
  );
}
