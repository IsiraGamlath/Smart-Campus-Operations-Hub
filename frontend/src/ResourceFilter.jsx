function ResourceFilter({
  filterData,
  filtering,
  onFilterInputChange,
  onSearch,
  onReset,
  typeOptions,
  locationOptions,
  statusOptions,
}) {
  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-slate-900">Search &amp; Filter Resources</h2>

      <form className="mt-4" onSubmit={onSearch}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="filterName" className="text-sm font-medium text-slate-700">Search by Name</label>
            <input
              id="filterName"
              name="name"
              type="text"
              value={filterData.name}
              onChange={onFilterInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., Computer Lab"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filterType" className="text-sm font-medium text-slate-700">Filter by Type</label>
            <select
              id="filterType"
              name="type"
              value={filterData.type}
              onChange={onFilterInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All types</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filterLocation" className="text-sm font-medium text-slate-700">Filter by Location</label>
            <select
              id="filterLocation"
              name="location"
              value={filterData.location}
              onChange={onFilterInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All locations</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filterStatus" className="text-sm font-medium text-slate-700">Filter by Status</label>
            <select
              id="filterStatus"
              name="status"
              value={filterData.status}
              onChange={onFilterInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filterMinCapacity" className="text-sm font-medium text-slate-700">Minimum Capacity</label>
            <input
              id="filterMinCapacity"
              name="minCapacity"
              type="number"
              min="0"
              value={filterData.minCapacity}
              onChange={onFilterInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., 40"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className={
              filtering
                ? 'inline-flex items-center rounded-xl bg-blue-300 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                : 'inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
            }
            disabled={filtering}
          >
            {filtering ? 'Searching...' : 'Search'}
          </button>

          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onReset}
            disabled={filtering}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default ResourceFilter;
