import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // Load Inquiries from Supabase
  // =========================
  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Error loading inquiries from Supabase:",
          error
        );

        setInquiries([]);
        return;
      }

      const formattedInquiries = (data || []).map(
        (inquiry) => ({
          id: inquiry.id,
          name: inquiry.name,
          mobile: inquiry.mobile,
          email: inquiry.email,
          message: inquiry.message,
          status: inquiry.status,
          createdAt: inquiry.created_at,
        })
      );

      setInquiries(formattedInquiries);
    } catch (error) {
      console.error(
        "Error loading inquiries:",
        error
      );

      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Update Status
  // =========================
  const handleStatusChange = async (
    inquiryId,
    newStatus
  ) => {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({
          status: newStatus,
        })
        .eq("id", inquiryId);

      if (error) {
        console.error(
          "Error updating inquiry status:",
          error
        );

        alert(
          "❌ Could not update inquiry status. Please try again."
        );

        return;
      }

      setInquiries((currentInquiries) =>
        currentInquiries.map((inquiry) =>
          inquiry.id === inquiryId
            ? {
                ...inquiry,
                status: newStatus,
              }
            : inquiry
        )
      );

      alert(
        "✅ Inquiry status updated successfully!"
      );
    } catch (error) {
      console.error(
        "Inquiry status update error:",
        error
      );

      alert(
        "❌ Something went wrong while updating the inquiry."
      );
    }
  };

  // =========================
  // Delete Inquiry
  // =========================
  const handleDelete = async (inquiryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", inquiryId);

      if (error) {
        console.error(
          "Error deleting inquiry:",
          error
        );

        alert(
          "❌ Could not delete inquiry. Please try again."
        );

        return;
      }

      setInquiries((currentInquiries) =>
        currentInquiries.filter(
          (inquiry) => inquiry.id !== inquiryId
        )
      );

      alert(
        "🗑️ Inquiry deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Inquiry delete error:",
        error
      );

      alert(
        "❌ Something went wrong while deleting the inquiry."
      );
    }
  };

  // =========================
  // Search
  // =========================
  const filteredInquiries = inquiries.filter(
    (inquiry) => {
      const searchText = search.toLowerCase();

      return (
        String(inquiry.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(inquiry.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(inquiry.mobile || "")
          .toLowerCase()
          .includes(searchText) ||
        String(inquiry.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(inquiry.message || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <div className="admin-section-card">

      {/* Header */}
      <div className="section-card-header">

        <div>
          <h2>Contact Inquiries Management</h2>

          <span className="section-desc">
            View and manage customer messages
            submitted through the website.
          </span>
        </div>

        <button
          onClick={loadInquiries}
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
          placeholder="🔍 Search name, mobile, email or message..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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
          <h3>Loading inquiries...</h3>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            background: "#f9fafb",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "45px" }}>
            💬
          </div>

          <h3>No customer inquiries found</h3>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Customer messages will appear here
            automatically.
          </p>
        </div>
      ) : (
        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Inquiry ID</th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Message / Requirement</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredInquiries.map(
                (inquiry) => (

                  <tr key={inquiry.id}>

                    {/* Inquiry ID */}
                    <td>
                      <code>
                        {inquiry.id}
                      </code>
                    </td>

                    {/* Name */}
                    <td>
                      <strong>
                        {inquiry.name || "-"}
                      </strong>
                    </td>

                    {/* Contact */}
                    <td>
                      <div>
                        <strong>
                          Mobile:
                        </strong>{" "}
                        <a
                          href={`tel:${inquiry.mobile}`}
                        >
                          {inquiry.mobile || "-"}
                        </a>
                      </div>

                      {inquiry.email && (
                        <div>
                          <small>
                            {inquiry.email}
                          </small>
                        </div>
                      )}
                    </td>

                    {/* Message */}
                    <td>
                      {inquiry.message || "-"}
                    </td>

                    {/* Date */}
                    <td>
                      {inquiry.createdAt
                        ? new Date(
                            inquiry.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>

                    {/* Status */}
                    <td>
                      <select
                        value={
                          inquiry.status || "New"
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            inquiry.id,
                            e.target.value
                          )
                        }
                        className="status-select"
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Replied">
                          Replied
                        </option>

                        <option value="Archived">
                          Archived
                        </option>
                      </select>
                    </td>

                    {/* Delete */}
                    <td>
                      <button
                        onClick={() =>
                          handleDelete(
                            inquiry.id
                          )
                        }
                        className="delete-icon-btn"
                      >
                        🗑️ Delete
                      </button>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AdminInquiries;