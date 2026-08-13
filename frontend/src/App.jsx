import { useState } from "react";
import "./App.css";

function App() {
  const [roomType, setRoomType] = useState("Bedroom");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("Modern");

  const [roomImage, setRoomImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [result, setResult] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageFile(file);
      setRoomImage(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    setError("");

    if (!length || !width || !budget) {
      setError("Please enter room length, width and budget.");
      return;
    }

    if (Number(length) <= 0 || Number(width) <= 0) {
      setError("Room dimensions must be greater than zero.");
      return;
    }

    if (Number(budget) <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("room_type", roomType);
      formData.append("length", length);
      formData.append("width", width);
      formData.append("budget", budget);
      formData.append("style", style);

      if (imageFile) {
        formData.append("room_image", imageFile);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/generate-design",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      const data = await response.json();

      setResult(data);
      setSelectedLayout(1);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedLayoutData =
    result?.layouts?.find(
      (layout) => layout.id === selectedLayout
    ) || result?.layouts?.[0];

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="logo">
          🏠 AI Smart Room Planner
        </div>

        <p>
          Design your room intelligently with personalized recommendations
        </p>
      </header>


      {/* MAIN */}

      <main className="container">

        {/* HERO */}

        <section className="hero">

          <h1>
            Transform Your Room with AI
          </h1>

          <p>
            Enter your room details, budget and preferred style
            to receive personalized interior recommendations.
          </p>

        </section>


        {/* PLANNER */}

        <section className="planner-card">

          <h2>Room Details</h2>

          <div className="form-grid">

            {/* ROOM TYPE */}

            <div className="form-group">

              <label>Room Type</label>

              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >

                <option>Bedroom</option>
                <option>Living Room</option>
                <option>Study Room</option>
                <option>Gaming Room</option>
                <option>Office</option>

              </select>

            </div>


            {/* LENGTH */}

            <div className="form-group">

              <label>Room Length (ft)</label>

              <input
                type="number"
                placeholder="Example: 12"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />

            </div>


            {/* WIDTH */}

            <div className="form-group">

              <label>Room Width (ft)</label>

              <input
                type="number"
                placeholder="Example: 10"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />

            </div>


            {/* BUDGET */}

            <div className="form-group">

              <label>Budget (₹)</label>

              <input
                type="number"
                placeholder="Example: 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

            </div>


            {/* STYLE */}

            <div className="form-group">

              <label>Interior Style</label>

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >

                <option>Modern</option>
                <option>Minimalist</option>
                <option>Traditional</option>
                <option>Luxury</option>
                <option>Scandinavian</option>
                <option>Industrial</option>

              </select>

            </div>

          </div>


          {/* IMAGE UPLOAD */}

          <div className="upload-section">

            <h2>Upload Your Room</h2>

            <label className="upload-box">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {!roomImage ? (
                <>
                  <span className="upload-icon">
                    📷
                  </span>

                  <strong>
                    Upload a photo of your room
                  </strong>

                  <small>
                    JPG, PNG or other image formats
                  </small>
                </>
              ) : (
                <img
                  src={roomImage}
                  alt="Uploaded room"
                  className="room-preview"
                />
              )}

            </label>

          </div>


          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ⚠️ {error}
            </div>
          )}


          {/* GENERATE */}

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >

            {loading
              ? "🔄 Generating Personalized Design..."
              : "✨ Generate AI Design"}

          </button>

        </section>


        {/* RESULTS */}

        {result && (

          <section
            className="result-card"
            id="results"
          >

            <h2>
              🎉 Personalized Room Analysis
            </h2>


            {/* SUMMARY */}

            <div className="summary-grid">

              <div className="summary-item">
                <span>Room</span>
                <strong>{result.room}</strong>
              </div>

              <div className="summary-item">
                <span>Dimensions</span>
                <strong>
                  {result.length} ft × {result.width} ft
                </strong>
              </div>

              <div className="summary-item">
                <span>Area</span>
                <strong>
                  {result.area.toFixed(0)} sq.ft
                </strong>
              </div>

              <div className="summary-item">
                <span>Budget</span>
                <strong>
                  ₹{result.budget.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="summary-item">
                <span>Style</span>
                <strong>{result.style}</strong>
              </div>

            </div>


            {/* PERSONALIZED EXPLANATION */}

            <div className="layout-explanation">

              <h3>
                🤖 AI Recommendation
              </h3>

              <p>
                Your room is classified as a{" "}
                <strong>{result.room_size}</strong>{" "}
                with a{" "}
                <strong>{result.budget_level}</strong>{" "}
                budget.
              </p>

              <p>
                The selected{" "}
                <strong>{result.style}</strong>{" "}
                style focuses on{" "}
                {result.style_description}.
              </p>

              {result.image_uploaded && (
                <p>
                  📷 Your room image has also been included
                  in the design request.
                </p>
              )}

            </div>


            {/* FURNITURE */}

            <h2>
              🛋️ Personalized Furniture Recommendations
            </h2>

            <div className="furniture-grid">

              {result.furniture.map((item, index) => (

                <div
                  className="furniture-card"
                  key={index}
                >

                  <div className="furniture-icon">
                    🪑
                  </div>

                  <div className="furniture-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <strong>
                      Estimated Cost: ₹
                      {item.cost.toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>

              ))}

            </div>


            {/* BUDGET */}

            <div className="budget-summary">

              <h2>
                💰 Budget Summary
              </h2>

              <div className="budget-row">

                <span>
                  Total Budget
                </span>

                <strong>
                  ₹{result.budget.toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="budget-row">

                <span>
                  Estimated Cost
                </span>

                <strong>
                  ₹{result.estimated_cost.toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="budget-row remaining">

                <span>
                  Remaining Budget
                </span>

                <strong>
                  ₹{result.remaining_budget.toLocaleString("en-IN")}
                </strong>

              </div>

            </div>


            {/* LAYOUTS */}

            <h2>
              🤖 Recommended Layouts
            </h2>

            <div className="layout-grid">

              {result.layouts.map((layout) => (

                <div
                  className="layout-card"
                  key={layout.id}
                >

                  <div className="layout-number">
                    {layout.id}
                  </div>

                  <h3>
                    {layout.name}
                  </h3>

                  <p>
                    {layout.description}
                  </p>

                  <button
                    onClick={() =>
                      setSelectedLayout(layout.id)
                    }
                  >
                    {selectedLayout === layout.id
                      ? "✓ Selected"
                      : "Select Layout"}
                  </button>

                </div>

              ))}

            </div>


            {/* FLOOR PLAN */}

            <section className="floor-plan-section">

              <h2>
                📐 {selectedLayoutData.name} Floor Plan
              </h2>

              <p className="floor-plan-info">

                {result.room} —{" "}
                {result.length} ft ×{" "}
                {result.width} ft

              </p>

              <div className="room-size-badge">
                🏠 {result.room_size}
              </div>


              <div className="room-layout">

                <div className="room-wall">

                  <div className="room-label">
                    Window
                  </div>


                  {/* BED */}

                  <div
                    className="furniture furniture-bed"
                    style={
                      selectedLayout === 1
                        ? {
                            left: "8%",
                            top: "12%",
                          }
                        : selectedLayout === 2
                        ? {
                            left: "35%",
                            top: "38%",
                          }
                        : {
                            left: "45%",
                            top: "15%",
                          }
                    }
                  >

                    🛏️

                    <span>
                      Bed
                    </span>

                  </div>


                  {/* WARDROBE */}

                  <div
                    className="furniture furniture-wardrobe"
                    style={
                      selectedLayout === 1
                        ? {
                            right: "3%",
                            top: "10%",
                          }
                        : selectedLayout === 2
                        ? {
                            right: "3%",
                            top: "30%",
                          }
                        : {
                            left: "5%",
                            top: "10%",
                          }
                    }
                  >

                    🚪

                    <span>
                      Wardrobe
                    </span>

                  </div>


                  {/* TABLE */}

                  <div
                    className="furniture furniture-table"
                    style={
                      selectedLayout === 1
                        ? {
                            left: "5%",
                            bottom: "20%",
                          }
                        : selectedLayout === 2
                        ? {
                            right: "20%",
                            bottom: "10%",
                          }
                        : {
                            left: "35%",
                            bottom: "8%",
                          }
                    }
                  >

                    🖥️

                    <span>
                      Study Table
                    </span>

                  </div>


                  {/* CHAIR */}

                  <div
                    className="furniture furniture-chair"
                    style={
                      selectedLayout === 1
                        ? {
                            left: "20%",
                            bottom: "5%",
                          }
                        : selectedLayout === 2
                        ? {
                            right: "10%",
                            bottom: "5%",
                          }
                        : {
                            left: "50%",
                            bottom: "5%",
                          }
                    }
                  >

                    🪑

                    <span>
                      Chair
                    </span>

                  </div>


                  {/* DOOR */}

                  <div className="furniture furniture-door">

                    🚪

                    <span>
                      Door
                    </span>

                  </div>


                  {/* WINDOW */}

                  <div className="furniture furniture-window">

                    🪟

                  </div>

                </div>

              </div>


              {/* EXPLANATION */}

              <div className="layout-explanation">

                <h3>
                  💡 Why this layout?
                </h3>

                <p>
                  {selectedLayoutData.reason}
                </p>

              </div>

            </section>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;