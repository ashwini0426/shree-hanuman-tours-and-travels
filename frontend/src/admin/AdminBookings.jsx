import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  // Load bookings from Supabase
  const loadBookings = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading bookings from Supabase:", error);
        setBookings([]);
        return;
      }

      const formattedBookings = (data || []).map((booking) => ({
        id: booking.id,
        customerName: booking.customer_name,
        mobileNumber: booking.mobile_number,
        car: booking.car,
        passengers: booking.passengers,
        tripType: booking.trip_type,
        travelDate: booking.travel_date,
        pickupLocation: booking.pickup_location,
        destination: booking.destination,
        estimatedDistanceKm: booking.estimated_distance_km,
        estimatedFare: booking.estimated_fare,
        additionalMessage: booking.additional_message,
        status: booking.status,
        createdAt: booking.created_at,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status in Supabase
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: newStatus,
        })
        .eq("id", bookingId);

      if (error) {
        console.error(
          "Error updating booking status:",
          error
        );

        alert(
          "❌ Could not update booking status. Please try again."
        );

        return;
      }

      // Update UI immediately
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
              }
            : booking
        )
      );

      alert("✅ Booking status updated successfully!");
    } catch (error) {
      console.error(
        "Booking status update error:",
        error
      );

      alert(
        "❌ Something went wrong while updating booking."
      );
    }
  };

  // Delete booking from Supabase
  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        console.error(
          "Error deleting booking:",
          error
        );

        alert(
          "❌ Could not delete booking. Please try again."
        );

        return;
      }

      // Remove from UI
      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking.id !== bookingId
        )
      );

      alert("🗑️ Booking deleted successfully!");
    } catch (error) {
      console.error(
        "Booking delete error:",
        error
      );

      alert(
        "❌ Something went wrong while deleting booking."
      );
    }
  };

  // Search
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    return (
      String(booking.id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.customerName || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.mobileNumber || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.car || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "status-confirmed";

      case "Completed":
        return "status-completed";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  return (
    <div className="admin-section-card">

      {/* Header */}
      <div className="section-card-header">
        <div>
          <h2>Booking Management</h2>

          <span className="section-desc">
            View and manage customer booking requests.
          </span>
        </div>

        <button
          onClick={loadBookings}
          className="cancel-btn"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search booking, customer, mobile or car..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1",
            minWidth: "250px",
            padding: "12px 15px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h3>Loading bookings...</h3>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            background: "#f9fafb",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "45px" }}>
            📋
          </div>

          <h3>No bookings found</h3>

          <p style={{ color: "#6b7280" }}>
            Customer bookings will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Car</th>
                <th>Travel Date</th>
                <th>Pickup</th>
                <th>Destination</th>
                <th>Passengers</th>
                <th>Estimated Fare</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredBookings.map((booking) => (

                <tr key={booking.id}>

                  {/* Booking ID */}
                  <td>
                    <strong>
                      {booking.id}
                    </strong>
                  </td>

                  {/* Customer */}
                  <td>
                    {booking.customerName || "-"}
                  </td>

                  {/* Mobile */}
                  <td>
                    {booking.mobileNumber || "-"}
                  </td>

                  {/* Car */}
                  <td>
                    {booking.car || "-"}
                  </td>

                  {/* Travel Date */}
                  <td>
                    {booking.travelDate || "-"}
                  </td>

                  {/* Pickup */}
                  <td>
                    {booking.pickupLocation || "-"}
                  </td>

                  {/* Destination */}
                  <td>
                    {booking.destination || "-"}
                  </td>

                  {/* Passengers */}
                  <td>
                    {booking.passengers || "-"}
                  </td>

                  {/* Fare */}
                  <td>
                    ₹
                    {Number(
                      booking.estimatedFare || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  {/* Status */}
                  <td>

                    <select
                      value={
                        booking.status || "Pending"
                      }
                      onChange={(e) =>
                        updateBookingStatus(
                          booking.id,
                          e.target.value
                        )
                      }
                      className={`status-select ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                  </td>

                  {/* Action */}
                  <td>

                    <button
                      onClick={() =>
                        deleteBooking(booking.id)
                      }
                      className="delete-icon-btn"
                    >
                      🗑️ Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AdminBookings;