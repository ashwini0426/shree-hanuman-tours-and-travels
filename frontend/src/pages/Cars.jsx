import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BUSINESS_CONFIG } from "../data/carsData";
import { supabase } from "../lib/supabaseClient";

function Cars() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSeats, setSelectedSeats] = useState("All");
  const [selectedAc, setSelectedAc] = useState("All");

  // ================= LOAD CARS FROM SUPABASE =================

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error("Error loading cars from Supabase:", error);
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
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // ================= FILTER LOGIC =================

  const filteredCars = cars.filter((car) => {
    const carModel = String(car.carModel || "").toLowerCase();
    const carType = String(car.carType || "").toLowerCase();
    const carAc = String(car.ac || "").toLowerCase();

    const matchesSearch =
      carModel.includes(searchTerm.toLowerCase()) ||
      carType.includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "All" ||
      carType.includes(selectedType.toLowerCase());

    const matchesSeats =
      selectedSeats === "All" ||
      Number(car.seats) === parseInt(selectedSeats, 10);

    const matchesAc =
      selectedAc === "All" ||
      carAc === selectedAc.toLowerCase();

    return (
      matchesSearch &&
      matchesType &&
      matchesSeats &&
      matchesAc
    );
  });

  // ================= WHATSAPP =================

  const getWhatsAppLink = (car) => {
    const text = `Hello ${BUSINESS_CONFIG.name}, I would like to inquire about booking a car with the following details:
• Car Model: ${car.carModel}
• Car Type: ${car.carType}
• AC / Non-AC: ${car.ac}
• Seating Capacity: ${car.seats} Seater
• Per KM Rate: ₹${car.perKmRate}/km
• Extra Hour Rate: ₹${car.extraHourRate}/hr
• Driver Allowance: ₹${car.driverAllowance}/day

Please check car availability and reply.`;

    return `https://wa.me/${BUSINESS_CONFIG.primaryWhatsapp}?text=${encodeURIComponent(
      text
    )}`;
  };

  // ================= RESET FILTERS =================

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedSeats("All");
    setSelectedAc("All");
  };

  return (
    <section className="cars-section" id="cars">
      <div className="cars-container-outer">

        {/* ================= HEADING ================= */}

        <div className="cars-heading">
          <p className="sub-title">OUR FLEET IN AIROLI</p>

          <h2>Choose Your Perfect Ride</h2>

          <span>
            Comfortable, clean, and reliable AC / Non-AC cars for
            outstation tours, local travel, and airport pick & drop.
          </span>
        </div>

        {/* ================= FILTER BAR ================= */}

        <div className="cars-filter-bar">

          {/* SEARCH */}

          <div className="filter-group search-group">
            <label>🔍 Search Car</label>

            <input
              type="text"
              placeholder="Search by car name or model..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* TYPE */}

          <div className="filter-group">
            <label>Car Type</label>

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
            >
              <option value="All">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="MUV">MUV</option>
              <option value="SUV">SUV</option>
              <option value="Traveller">
                Executive / Traveller
              </option>
              <option value="Hatchback">
                Hatchback
              </option>
            </select>
          </div>

          {/* SEATS */}

          <div className="filter-group">
            <label>Seating Option</label>

            <select
              value={selectedSeats}
              onChange={(e) =>
                setSelectedSeats(e.target.value)
              }
            >
              <option value="All">
                All Seats (1-7+ Seats)
              </option>

              <option value="1">1 Seater</option>
              <option value="2">2 Seater</option>
              <option value="3">3 Seater</option>
              <option value="4">4 Seater</option>
              <option value="5">5 Seater</option>
              <option value="6">6 Seater</option>
              <option value="7">7 Seater</option>
            </select>
          </div>

          {/* AC */}

          <div className="filter-group">
            <label>AC Preference</label>

            <select
              value={selectedAc}
              onChange={(e) =>
                setSelectedAc(e.target.value)
              }
            >
              <option value="All">
                All (AC & Non-AC)
              </option>

              <option value="AC">AC</option>

              <option value="Non-AC">
                Non-AC
              </option>
            </select>
          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <p className="loading-text">
            Loading car fleet...
          </p>
        )}

        {/* ================= NO CARS ================= */}

        {!loading && filteredCars.length === 0 ? (
          <div className="no-cars-found">

            <p>
              No cars found matching your search
              filter criteria.
            </p>

            <button
              onClick={resetFilters}
              className="reset-filter-btn"
            >
              Reset Filters
            </button>

          </div>
        ) : (

          /* ================= CAR GRID ================= */

          <div className="cars-container">

            {filteredCars.map((car) => (

              <div
                className="car-card"
                key={car.id || car.carModel}
              >

                {/* CAR IMAGE */}

                <div className="car-img-wrapper">

                  <img
                    src={
                      car.image ||
                      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={car.carModel}
                    loading="lazy"
                  />

                  <span
                    className={`status-tag ${
                      car.status === "Available"
                        ? "status-available"
                        : "status-booked"
                    }`}
                  >
                    {car.status}
                  </span>

                </div>

                {/* CAR INFORMATION */}

                <div className="car-info">

                  <h3>{car.carModel}</h3>

                  <p className="car-type">
                    Car Type:{" "}
                    <strong>{car.carType}</strong>
                  </p>

                  {/* BADGES */}

                  <div className="car-badges">

                    <span className="badge ac-badge">
                      ❄️ {car.ac}
                    </span>

                    <span className="badge seat-badge">
                      👥 {car.seats} Seater
                    </span>

                  </div>

                  {/* RATES */}

                  <div className="car-details">

                    <div className="rate-row">
                      <span>Per KM Rate:</span>

                      <strong>
                        ₹{car.perKmRate} / km
                      </strong>
                    </div>

                    <div className="rate-row">
                      <span>Extra Hour Rate:</span>

                      <strong>
                        ₹{car.extraHourRate} / hr
                      </strong>
                    </div>

                    <div className="rate-row">
                      <span>Driver Allowance:</span>

                      <strong>
                        ₹{car.driverAllowance} / day
                      </strong>
                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="car-bottom">

                    <a
                      href={getWhatsAppLink(car)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wa-inquiry-btn"
                      title="Inquire via WhatsApp"
                    >
                      💬 WhatsApp
                    </a>

                    <button
                      disabled={
                        car.status !== "Available"
                      }
                      onClick={() =>
                        navigate("/booking", {
                          state: {
                            carModel: car.carModel,
                          },
                        })
                      }
                      className="book-now-btn"
                    >
                      Book Now
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Cars;