import { useEffect, useState } from "react";

const initialFormState = {
  userId: "",
  resourceId: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  attendees: "",
};

function BookingForm({ onBookingCreated, onUnauthorized, preselectedResourceId = "" }) {
  const [formData, setFormData] = useState(initialFormState);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const selectedResource = resources.find((resource) => resource.id === formData.resourceId) || null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData(initialFormState);
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadResources = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/resources", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          if (typeof onUnauthorized === "function") {
            onUnauthorized();
          }
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();
        setResources(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResources([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setResourcesLoading(false);
        }
      }
    };

    loadResources();

    return () => {
      controller.abort();
    };
  }, [onUnauthorized]);

  useEffect(() => {
    if (!preselectedResourceId) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resourceId: preselectedResourceId,
    }));
  }, [preselectedResourceId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        attendees: Number(formData.attendees),
      };

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        if (typeof onUnauthorized === "function") {
          onUnauthorized();
        }
        return;
      }

      if (!response.ok) {
        let backendMessage = "Unable to create booking. Please try again.";
        try {
          const errorBody = await response.json();
          if (errorBody && typeof errorBody.message === "string" && errorBody.message.trim()) {
            backendMessage = errorBody.message;
          }
        } catch {
          // Ignore parse errors and fall back to default message.
        }
        throw new Error(backendMessage);
      }

      setSuccessMessage("Booking created successfully.");
      clearForm();

      if (typeof onBookingCreated === "function") {
        onBookingCreated();
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Create Booking</h2>

      {successMessage && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      )}

      <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="userId">
            User ID
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            value={formData.userId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="resourceId">
            Resource ID
          </label>
          <select
            id="resourceId"
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
            disabled={resourcesLoading || resources.length === 0}
          >
            <option value="">
              {resourcesLoading ? "Loading resources..." : "Select a resource"}
            </option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.id})
              </option>
            ))}
          </select>
          {!resourcesLoading && resources.length === 0 && (
            <p className="mt-1 text-xs text-rose-700">No resources available. Create resources first.</p>
          )}
        </div>

        <div className="md:col-span-2">
          {selectedResource ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Selected Resource Details</p>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-800 md:grid-cols-2">
                <p><span className="font-semibold">Venue:</span> {selectedResource.name || "-"}</p>
                <p><span className="font-semibold">Location:</span> {selectedResource.location || "-"}</p>
                <p><span className="font-semibold">Date:</span> {selectedResource.bookingDate || "-"}</p>
                <p><span className="font-semibold">Type:</span> {selectedResource.type || "-"}</p>
                <p><span className="font-semibold">Capacity:</span> {selectedResource.capacity ?? "-"}</p>
                <p>
                  <span className="font-semibold">Available Time:</span>{" "}
                  {selectedResource.availabilityStart || "-"} - {selectedResource.availabilityEnd || "-"}
                </p>
                <p><span className="font-semibold">Status:</span> {selectedResource.status || "-"}</p>
              </div>
              {selectedResource.description && (
                <p className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">Description:</span> {selectedResource.description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select a resource to view venue, availability, and capacity details.</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            min={minDate}
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="attendees">
            Attendees
          </label>
          <input
            id="attendees"
            name="attendees"
            type="number"
            min="1"
            value={formData.attendees}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="startTime">
            Start Time
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="endTime">
            End Time
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            min={formData.startTime || undefined}
            value={formData.endTime}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="purpose">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 focus:border-slate-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
