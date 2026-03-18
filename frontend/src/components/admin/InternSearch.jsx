import { Search } from "lucide-react";

export default function InternSearch({ search, onSearch }) {
  return (
    <div className="relative mb-4">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}