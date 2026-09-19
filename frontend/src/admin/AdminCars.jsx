import { useState, useEffect } from "react";
import { initialCarsData } from "../data/carsData";
import { supabase } from "../lib/supabaseClient";

const defaultCarForm = {
  carModel: "",
  carType: "Sedan",
  ac: "AC",
  seats: 4,
  perKmRate: 15,
  extraHourRate: 200,
  driverAllowance: 500,
  status: "Available",
  image:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
};

function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [carForm, setCarForm] = useState(defaultCarForm);

  // =====================================================
  // LOAD CARS FROM SUPABASE
  // =====================================================

  useEffect(() => {
    loadCars();
  }, []);

  const mapSupabaseCar = (car) => ({
    id: car.id,
    carModel: car.car_model,
    carType: car.car_type,
    ac: car.ac,
    seats: Number(car.seats),
    perKmRate: Number(car.per_km_rate),
    extraHourRate: Number(car.extra_hour_rate),
    driverAllowance: Number(car.driver_allowance),
    status: car.status,
    image: car.image || "",
    createdAt: car.created_at,
  });

  const mapToSupabase = (car) => ({
    car_model: car.carModel,
    car_type: car.carType,
    ac: car.ac,
    seats: Number(car.seats),
    per_km_rate: Number(car.perKmRate),
    extra_hour_rate: Number(car.extraHourRate),
    driver_allowance: Number(car.driverAllowance),
    status: car.status,
    image: car.image || "",
  });

  const loadCars = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase Load Cars Error:", error);
        alert("❌ Unable to load cars from Supabase.");
        setCars([]);
        return;
      }

      // If database is empty, insert initial cars
      if (!data || data.length === 0) {
        console.log("Cars table empty. Adding initial cars...");

        const initialCarsForSupabase = initialCarsData.map((car) =>
          mapToSupabase(car)
        );

        const { data: insertedCars, error: insertError } =
          await supabase
            .from("cars")
            .insert(initialCarsForSupabase)
            .select("*");

        if (insertError) {
          console.error(
            "Initial Cars Insert Error:",
            insertError
          );

          alert(
            "⚠️ Cars table is empty, but default cars could not be added."
          );

          setCars([]);
          return;
        }

        setCars(insertedCars.map(mapSupabaseCar));
        return;
      }

      setCars(data.map(mapSupabaseCar));
    } catch (error) {
      console.error("Error loading cars:", error);
      alert("❌ Something went wrong while loading cars.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCarForm((prev) => ({
      ...prev,
      [name]:
        name === "seats" ||
        name === "perKmRate" ||
        name === "extraHourRate" ||
        name === "driverAllowance"
          ? Number(value)
          : value,
    }));
  };

  // =====================================================
  // SUPABASE IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("❌ Image size should be less than 2 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      // Create a safe unique file name
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeFileName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}-${safeFileName}.${fileExtension}`;

      const filePath = `cars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Image Upload Error:", uploadError);

        alert(
          `❌ Image upload failed.\n\n${uploadError.message}`
        );

        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        alert("❌ Image uploaded, but public URL could not be created.");
        return;
      }

      // Save URL into form
      setCarForm((prev) => ({
        ...prev,
        image: publicUrl,
      }));

      alert("✅ Image uploaded successfully!");
    } catch (error) {
      console.error("Image Upload Error:", error);
      alert("❌ Something went wrong while uploading the image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setCarForm((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // =====================================================
  // ADD CAR
  // =====================================================

  const openAddModal = () => {
    setCarForm({ ...defaultCarForm });
    setShowAddModal(true);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    if (uploadingImage) {
      alert("⏳ Please wait until the image upload is completed.");
      return;
    }

    try {
      const carToInsert = mapToSupabase(carForm);

      const { data, error } = await supabase
        .from("cars")
        .insert([carToInsert])
        .select("*")
        .single();

      if (error) {
        console.error("Add Car Error:", error);
        alert(`❌ Failed to add car.\n\n${error.message}`);
        return;
      }

      setCars((prev) => [mapSupabaseCar(data), ...prev]);

      setShowAddModal(false);
      setCarForm({ ...defaultCarForm });

      alert("✅ New car added successfully!");
    } catch (error) {
      console.error("Add Car Error:", error);
      alert("❌ Something went wrong while adding the car.");
    }
  };

  // =====================================================
  // EDIT CAR
  // =====================================================

  const openEditModal = (car) => {
    setSelectedCar(car);

    setCarForm({
      carModel: car.carModel || "",
      carType: car.carType || "Sedan",
      ac: car.ac || "AC",
      seats: Number(car.seats) || 4,
      perKmRate: Number(car.perKmRate) || 0,
      extraHourRate: Number(car.extraHourRate) || 0,
      driverAllowance: Number(car.driverAllowance) || 0,
      status: car.status || "Available",
      image: car.image || "",
    });

    setShowEditModal(true);
  };

  const handleEditCar = async (e) => {
    e.preventDefault();

    if (!selectedCar) return;

    if (uploadingImage) {
      alert("⏳ Please wait until the image upload is completed.");
      return;
    }

    try {
      const updatedCarData = mapToSupabase(carForm);

      const { data, error } = await supabase
        .from("cars")
        .update(updatedCarData)
        .eq("id", selectedCar.id)
        .select("*")
        .single();

      if (error) {
        console.error("Edit Car Error:", error);
        alert(`❌ Failed to update car.\n\n${error.message}`);
        return;
      }

      setCars((prev) =>
        prev.map((car) =>
          car.id === selectedCar.id
            ? mapSupabaseCar(data)
            : car
        )
      );

      setShowEditModal(false);
      setSelectedCar(null);

      alert("✅ Car details updated successfully!");
    } catch (error) {
      console.error("Edit Car Error:", error);
      alert("❌ Something went wrong while updating the car.");
    }
  };

  // =====================================================
  // DELETE CAR
  // =====================================================

  const openDeleteModal = (car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };

  const handleDeleteCar = async () => {
    if (!selectedCar) return;

    try {
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", selectedCar.id);

      if (error) {
        console.error("Delete Car Error:", error);
        alert(`❌ Failed to delete car.\n\n${error.message}`);
        return;
      }

      setCars((prev) =>
        prev.filter((car) => car.id !== selectedCar.id)
      );

      setShowDeleteModal(false);
      setSelectedCar(null);

      alert("🗑️ Car deleted successfully!");
    } catch (error) {
      console.error("Delete Car Error:", error);
      alert("❌ Something went wrong while deleting the car.");
    }
  };

  // =====================================================
  // STATUS UPDATE
  // =====================================================

  const handleStatusToggle = async (car, newStatus) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .update({
          status: newStatus,
        })
        .eq("id", car.id)
        .select("*")
        .single();

      if (error) {
        console.error("Status Update Error:", error);
        alert(
          `❌ Failed to update status.\n\n${error.message}`
        );
        return;
      }

      setCars((prev) =>
        prev.map((item) =>
          item.id === car.id
            ? mapSupabaseCar(data)
            : item
        )
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("❌ Something went wrong while updating status.");
    }
  };

  // =====================================================
  // RESET DATA
  // =====================================================

  const resetCars = async () => {
    const confirmReset = window.confirm(
      "This will delete all cars and add the original car list again. Continue?"
    );

    if (!confirmReset) return;

    try {
      setLoading(true);

      // Delete all existing cars
      const { error: deleteError } = await supabase
        .from("cars")
        .delete()
        .neq("id", 0);

      if (deleteError) {
        console.error("Reset Delete Error:", deleteError);
        alert(
          `❌ Failed to reset cars.\n\n${deleteError.message}`
        );
        return;
      }

      // Insert initial cars
      const initialCarsForSupabase = initialCarsData.map((car) =>
        mapToSupabase(car)
      );

      const { data, error: insertError } = await supabase
        .from("cars")
        .insert(initialCarsForSupabase)
        .select("*");

      if (insertError) {
        console.error("Reset Insert Error:", insertError);

        alert(
          `❌ Cars deleted but original cars could not be restored.\n\n${insertError.message}`
        );

        setCars([]);
        return;
      }

      setCars(data.map(mapSupabaseCar));

      alert("🔄 Car data reset successfully!");
    } catch (error) {
      console.error("Reset Error:", error);
      alert("❌ Something went wrong while resetting cars.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="admin-section-card">

      {/* HEADER */}
      <div className="section-card-header">
        <div>
          <h2>Car Fleet Management</h2>

          <span className="section-desc">
            Manage car inventory, pricing rates, seat choices,
            images, and availability status.
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={resetCars}
            className="cancel-btn"
          >
            🔄 Reset
          </button>

          <button
            onClick={openAddModal}
            className="add-btn"
          >
            ➕ Add New Car
          </button>
        </div>
      </div>

      {/* CAR TABLE */}

      {loading ? (
        <p>Loading car list...</p>
      ) : cars.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h3>No cars available</h3>

          <button
            onClick={openAddModal}
            className="add-btn"
          >
            ➕ Add Your First Car
          </button>
        </div>
      ) : (
        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Car Image</th>
                <th>Model / Name</th>
                <th>Type</th>
                <th>AC / Non-AC</th>
                <th>Seats</th>
                <th>Per KM Rate</th>
                <th>Extra Hr Rate</th>
                <th>Driver Allowance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {cars.map((car) => (

                <tr key={car.id}>

                  <td>
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.carModel}
                        className="table-car-img"
                      />
                    ) : (
                      <div
                        style={{
                          width: "70px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f3f4f6",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </td>

                  <td>
                    <strong>{car.carModel}</strong>
                  </td>

                  <td>{car.carType}</td>

                  <td>{car.ac}</td>

                  <td>
                    {car.seats} Seater
                  </td>

                  <td>
                    ₹{car.perKmRate}/km
                  </td>

                  <td>
                    ₹{car.extraHourRate}/hr
                  </td>

                  <td>
                    ₹{car.driverAllowance}/day
                  </td>

                  <td>

                    <select
                      value={car.status}
                      onChange={(e) =>
                        handleStatusToggle(
                          car,
                          e.target.value
                        )
                      }
                      className="status-select"
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="On Booking">
                        On Booking
                      </option>

                      <option value="Maintenance">
                        Maintenance
                      </option>
                    </select>

                  </td>

                  <td className="actions-cell">

                    <div className="action-btns">

                      <button
                        onClick={() =>
                          openEditModal(car)
                        }
                        className="edit-icon-btn"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          openDeleteModal(car)
                        }
                        className="delete-icon-btn"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* ================= ADD MODAL ================= */}

      {showAddModal && (

        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <h3>
                Add New Car to Fleet
              </h3>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="close-modal-btn"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleAddCar}
              className="login-form"
            >

              <CarFormFields
                carForm={carForm}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                uploadingImage={uploadingImage}
              />

              <div className="modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={uploadingImage}
                >
                  {uploadingImage
                    ? "Uploading Image..."
                    : "Save New Car"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= EDIT MODAL ================= */}

      {showEditModal && selectedCar && (

        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <div>
                <h3>
                  ✏️ Edit Car Details
                </h3>

                <small>
                  {selectedCar.carModel}
                </small>
              </div>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="close-modal-btn"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleEditCar}
              className="login-form"
            >

              <CarFormFields
                carForm={carForm}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                uploadingImage={uploadingImage}
              />

              <div className="modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={uploadingImage}
                >
                  {uploadingImage
                    ? "Uploading Image..."
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================= DELETE MODAL ================= */}

      {showDeleteModal && selectedCar && (

        <div className="modal-overlay">

          <div
            className="modal-card"
            style={{ maxWidth: "450px" }}
          >

            <div className="modal-header">

              <h3>
                Confirm Deletion
              </h3>

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="close-modal-btn"
              >
                ✕
              </button>

            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedCar.carModel}
              </strong>{" "}
              from your fleet?
            </p>

            <div className="modal-actions">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="cancel-btn"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCar}
                className="save-btn"
                style={{
                  background: "#dc2626",
                }}
              >
                🗑️ Confirm Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =====================================================
   COMMON CAR FORM
===================================================== */

function CarFormFields({
  carForm,
  handleInputChange,
  handleImageUpload,
  removeImage,
  uploadingImage,
}) {
  return (
    <>
      {/* MODEL */}

      <div className="form-group">

        <label>
          Car Model / Name *
        </label>

        <input
          type="text"
          name="carModel"
          value={carForm.carModel}
          onChange={handleInputChange}
          placeholder="e.g. Maruti Suzuki Ertiga"
          required
        />

      </div>

      {/* TYPE + AC */}

      <div className="form-row">

        <div className="form-group">

          <label>
            Car Type
          </label>

          <select
            name="carType"
            value={carForm.carType}
            onChange={handleInputChange}
          >
            <option value="Sedan">Sedan</option>
            <option value="MUV">MUV</option>
            <option value="SUV">SUV</option>
            <option value="Executive / Traveller">
              Executive / Traveller
            </option>
            <option value="Hatchback">
              Hatchback
            </option>
          </select>

        </div>

        <div className="form-group">

          <label>
            AC Preference
          </label>

          <select
            name="ac"
            value={carForm.ac}
            onChange={handleInputChange}
          >
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>

        </div>

      </div>

      {/* SEATS + KM */}

      <div className="form-row">

        <div className="form-group">

          <label>
            Number of Seats
          </label>

          <input
            type="number"
            name="seats"
            min="1"
            max="20"
            value={carForm.seats}
            onChange={handleInputChange}
            required
          />

        </div>

        <div className="form-group">

          <label>
            Per KM Rate (₹)
          </label>

          <input
            type="number"
            name="perKmRate"
            min="1"
            value={carForm.perKmRate}
            onChange={handleInputChange}
            required
          />

        </div>

      </div>

      {/* EXTRA HOUR + DRIVER */}

      <div className="form-row">

        <div className="form-group">

          <label>
            Extra Hour Rate (₹/hr)
          </label>

          <input
            type="number"
            name="extraHourRate"
            value={carForm.extraHourRate}
            onChange={handleInputChange}
            required
          />

        </div>

        <div className="form-group">

          <label>
            Driver Allowance (₹/day)
          </label>

          <input
            type="number"
            name="driverAllowance"
            value={carForm.driverAllowance}
            onChange={handleInputChange}
            required
          />

        </div>

      </div>

      {/* STATUS */}

      <div className="form-group">

        <label>
          Status
        </label>

        <select
          name="status"
          value={carForm.status}
          onChange={handleInputChange}
        >
          <option value="Available">
            Available
          </option>

          <option value="On Booking">
            On Booking
          </option>

          <option value="Maintenance">
            Maintenance
          </option>
        </select>

      </div>

      {/* IMAGE UPLOAD */}

      <div className="form-group">

        <label>
          🖼️ Car Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
        />

        <small
          style={{
            display: "block",
            marginTop: "6px",
            color: "#6b7280",
          }}
        >
          JPG, PNG, WEBP etc. • Maximum 2 MB
        </small>

        {uploadingImage && (
          <small
            style={{
              display: "block",
              marginTop: "8px",
              color: "#d97706",
              fontWeight: "700",
            }}
          >
            ⏳ Uploading image to Supabase...
          </small>
        )}

      </div>

      {/* IMAGE PREVIEW */}

      {carForm.image && (

        <div
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            background: "#f9fafb",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >

            <strong>
              Image Preview
            </strong>

            <button
              type="button"
              onClick={removeImage}
              className="cancel-btn"
              disabled={uploadingImage}
            >
              ✕ Remove Image
            </button>

          </div>

          <img
            src={carForm.image}
            alt="Car Preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "8px",
              display: "block",
            }}
          />

        </div>
      )}

      {/* OPTIONAL IMAGE URL */}

      <div className="form-group">

        <label>
          Or Use Image URL
        </label>

        <input
          type="text"
          name="image"
          value={carForm.image}
          onChange={handleInputChange}
          placeholder="https://example.com/car-image.jpg"
          disabled={uploadingImage}
        />

        <small
          style={{
            color: "#6b7280",
            marginTop: "5px",
          }}
        >
          You can upload an image above or manually enter an image URL.
        </small>

      </div>
    </>
  );
}

export default AdminCars;