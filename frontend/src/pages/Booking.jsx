import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";
import { supabase } from "../lib/supabaseClient";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedCarModel = location.state?.carModel || "";

  const [cars, setCars] = useState([]);

  const [selectedCarModel, setSelectedCarModel] =
    useState(preselectedCarModel);

  const [estimatedKm, setEstimatedKm] = useState(100);
  const [passengers, setPassengers] = useState("4");
  const [tripType, setTripType] =
    useState("Outstation Trip");

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // ================= LOAD CARS FROM SUPABASE =================

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error(
            "Error loading cars from Supabase:",
            error
          );
          setCars([]);
          return;
        }

        const formattedCars = (data || []).map((car) => ({
          id: car.id,
          carType: car.car_type,
          carModel: car.car_model,
          ac: car.ac,
          seats: car.seats,
          perKmRate: car.per_km_rate,
          extraHourRate: car.extra_hour_rate,
          driverAllowance: car.driver_allowance,
          status: car.status,
          image: car.image,
        }));

        setCars(formattedCars);
      } catch (error) {
        console.error("Error loading cars:", error);
        setCars([]);
      }
    };

    loadCars();
  }, []);

  // ================= CURRENT CAR =================

  const currentCar =
    cars.find(
      (c) =>
        String(c.carModel).toLowerCase() ===
        String(selectedCarModel).toLowerCase()
    ) || cars[0];

  // ================= FARE CALCULATION =================

  const perKmRate = currentCar
    ? Number(currentCar.perKmRate) || 15
    : 15;

  const driverAllowance = currentCar
    ? Number(currentCar.driverAllowance) || 500
    : 500;

  const estimatedTotalFare =
    estimatedKm * perKmRate + driverAllowance;

  // ================= SUBMIT BOOKING =================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);

    const form = event.target;

    const bookingData = {
      id: `SHTT-${Date.now()}`,

      customerName: form.customerName.value.trim(),

      mobileNumber: form.mobileNumber.value.trim(),

      car: form.car.value,

      passengers: form.passengers.value,

      tripType: form.tripType.value,

      travelDate: form.travelDate.value,

      pickupLocation:
        form.pickupLocation.value.trim(),

      destination:
        form.destination.value.trim(),

      estimatedDistanceKm: estimatedKm,

      estimatedFare: estimatedTotalFare,

      additionalMessage:
        form.additionalMessage.value.trim(),

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

    try {
      // ================= SAVE TO SUPABASE =================

      const { error: supabaseError } = await supabase
        .from("bookings")
        .insert([
          {
            id: bookingData.id,

            customer_name:
              bookingData.customerName,

            mobile_number:
              bookingData.mobileNumber,

            car: bookingData.car,

            passengers:
              Number(bookingData.passengers),

            trip_type:
              bookingData.tripType,

            travel_date:
              bookingData.travelDate,

            pickup_location:
              bookingData.pickupLocation,

            destination:
              bookingData.destination,

            estimated_distance_km:
              bookingData.estimatedDistanceKm,

            estimated_fare:
              bookingData.estimatedFare,

            additional_message:
              bookingData.additionalMessage,

            status:
              bookingData.status,

            created_at:
              bookingData.createdAt,
          },
        ]);

      if (supabaseError) {
        console.error(
          "Supabase booking error:",
          supabaseError
        );

        throw supabaseError;
      }

      console.log(
        "Booking saved successfully to Supabase:",
        bookingData
      );

      // ================= SUCCESS =================

      setBookingSuccess(bookingData);

    } catch (error) {
      console.error(
        "Booking submission error:",
        error
      );

      alert(
        "Something went wrong while saving your booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= WHATSAPP =================

  const generateWhatsAppMessage = () => {
    if (!bookingSuccess) return "#";

    const text = `CAR BOOKING REQUEST - ${BUSINESS_CONFIG.name}

Booking ID:
${bookingSuccess.id}

Customer Details:
• Name: ${bookingSuccess.customerName}
• Mobile Number: ${bookingSuccess.mobileNumber}
• Selected Car: ${bookingSuccess.car}
• Travel Date: ${bookingSuccess.travelDate}
• Trip Type: ${bookingSuccess.tripType}
• Pickup Location: ${bookingSuccess.pickupLocation}
• Destination: ${bookingSuccess.destination}
• Number of Passengers: ${bookingSuccess.passengers}
• Estimated Fare: ₹${bookingSuccess.estimatedFare}
• Estimated Distance: ${bookingSuccess.estimatedDistanceKm} km
• Additional Notes: ${bookingSuccess.additionalMessage || "None"}

Please review and confirm this booking request.`;

    return `https://wa.me/${BUSINESS_CONFIG.primaryWhatsapp}?text=${encodeURIComponent(
      text
    )}`;
  };

  // ================= RETURN =================

  return (
    <div className="booking-page">

      {/* ================= HEADER ================= */}

      <div className="booking-header-bar">

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Main Website
        </Link>

        <span className="location-tag">
          📍 Airoli, Maharashtra
        </span>

      </div>

      {/* ================= HEADING ================= */}

      <div className="booking-heading">

        <p className="sub-title">
          BOOK YOUR RIDE
        </p>

        <h1>
          Car Rental & Tour Booking Request
        </h1>

        <span>
          Fill in your trip details below to send
          your booking request directly to the
          business owner for confirmation.
        </span>

      </div>

      {/* ================= BOOKING CONTAINER ================= */}

      <div className="booking-container">

        {/* ================= SUCCESS ================= */}

        {bookingSuccess ? (

          <div className="booking-confirmation-card">

            <div className="conf-icon">
              📝
            </div>

            <h2>
              Booking Request Submitted!
            </h2>

            <p>
              Thank you{" "}
              <strong>
                {bookingSuccess.customerName}
              </strong>
              ! Your car booking request for{" "}
              <strong>
                {bookingSuccess.car}
              </strong>{" "}
              on{" "}
              <strong>
                {bookingSuccess.travelDate}
              </strong>{" "}
              has been created.
            </p>

            <div className="conf-details-box">

              <p>
                <strong>Booking ID:</strong>{" "}
                {bookingSuccess.id}
              </p>

              <p>
                <strong>Mobile Number:</strong>{" "}
                {bookingSuccess.mobileNumber}
              </p>

              <p>
                <strong>Trip Type:</strong>{" "}
                {bookingSuccess.tripType}
              </p>

              <p>
                <strong>Pickup Location:</strong>{" "}
                {bookingSuccess.pickupLocation}
              </p>

              <p>
                <strong>Destination:</strong>{" "}
                {bookingSuccess.destination}
              </p>

              <p>
                <strong>Passengers:</strong>{" "}
                {bookingSuccess.passengers}
              </p>

              <p>
                <strong>Estimated Base Cost:</strong>{" "}
                ~₹{bookingSuccess.estimatedFare}
              </p>

            </div>

            <p className="request-note">
              Click below to send your pre-filled
              booking request directly to the owner
              via WhatsApp to confirm availability.
            </p>

            <div className="conf-actions">

              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-confirm-btn"
              >
                💬 Send Request via WhatsApp
              </a>

              <button
                onClick={() => {
                  setBookingSuccess(null);
                  navigate("/");
                }}
                className="home-return-btn"
              >
                Return to Home
              </button>

            </div>

          </div>

        ) : (

          /* ================= BOOKING FORM ================= */

          <form
            className="booking-form"
            onSubmit={handleSubmit}
          >

            {/* CUSTOMER */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Customer Name *
                </label>

                <input
                  type="text"
                  name="customerName"
                  placeholder="Enter your full name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />

              </div>

            </div>

            {/* CAR + PASSENGERS */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Select Car Model *
                </label>

                <select
                  name="car"
                  value={selectedCarModel}
                  onChange={(e) =>
                    setSelectedCarModel(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Car Model
                  </option>

                  {cars.map((car) => (

                    <option
                      key={car.id}
                      value={car.carModel}
                    >
                      {car.carModel} (
                      {car.carType} •{" "}
                      {car.ac} •{" "}
                      {car.seats} Seater)
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Number of Passengers *
                </label>

                <select
                  name="passengers"
                  value={passengers}
                  onChange={(e) =>
                    setPassengers(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="1">
                    1 Passenger
                  </option>

                  <option value="2">
                    2 Passengers
                  </option>

                  <option value="3">
                    3 Passengers
                  </option>

                  <option value="4">
                    4 Passengers
                  </option>

                  <option value="5">
                    5 Passengers
                  </option>

                  <option value="6">
                    6 Passengers
                  </option>

                  <option value="7">
                    7 Passengers
                  </option>

                </select>

              </div>

            </div>

            {/* TRIP + DATE */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Trip Type *
                </label>

                <select
                  name="tripType"
                  value={tripType}
                  onChange={(e) =>
                    setTripType(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="Outstation Trip">
                    Outstation Trip
                  </option>

                  <option value="Local Hourly Rental">
                    Local Hourly Rental (8hr / 80km)
                  </option>

                  <option value="Airport Pickup & Drop">
                    Airport Pickup & Drop
                  </option>

                  <option value="Corporate Car Hire">
                    Corporate Car Hire
                  </option>

                  <option value="Tour Package Ride">
                    Tour Package Ride
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Travel Date *
                </label>

                <input
                  type="date"
                  name="travelDate"
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />

              </div>

            </div>

            {/* LOCATIONS */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Pickup Location *
                </label>

                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="e.g. Sector 3, Airoli, Navi Mumbai"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Destination *
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="e.g. Pune / Mahabaleshwar / Mumbai Airport"
                  required
                />

              </div>

            </div>

            {/* DISTANCE */}

            <div className="form-group">

              <label>
                Estimated Distance (Km) for Cost Calculator
              </label>

              <input
                type="number"
                name="distanceKm"
                min="10"
                max="2000"
                value={estimatedKm}
                onChange={(e) =>
                  setEstimatedKm(
                    Number(e.target.value) || 0
                  )
                }
                placeholder="Estimated trip Kms"
              />

            </div>

            {/* FARE */}

            {selectedCarModel &&
              currentCar && (

                <div className="fare-estimate-box">

                  <div className="est-title">
                    💡 Estimated Fare Preview (
                    {currentCar.carModel})
                  </div>

                  <div className="est-grid">

                    <div>
                      <span>
                        Rate:
                      </span>{" "}
                      ₹{perKmRate}/km
                    </div>

                    <div>
                      <span>
                        Est. Distance:
                      </span>{" "}
                      {estimatedKm} km
                    </div>

                    <div>
                      <span>
                        Driver Allowance:
                      </span>{" "}
                      ₹{driverAllowance}/day
                    </div>

                    <div className="est-total">
                      <span>
                        Est. Base Total:
                      </span>{" "}
                      ₹{estimatedTotalFare}
                    </div>

                  </div>

                  <small className="est-note">
                    *Toll, parking, and state tax
                    extra if applicable.
                  </small>

                </div>
              )}

            {/* NOTES */}

            <div className="form-group">

              <label>
                Additional Requirements / Notes
              </label>

              <textarea
                name="additionalMessage"
                rows="3"
                placeholder="Mention specific time, AC preference, luggage details, or special requests..."
              ></textarea>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="booking-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting Booking Request..."
                : "Submit Booking Request"}
            </button>

          </form>

        )}

      </div>
    </div>
  );
}

export default Booking;