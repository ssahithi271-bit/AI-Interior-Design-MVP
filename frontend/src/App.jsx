import { useState } from "react";
import "./App.css";

const layoutPositions = {
  "Space Saving": {
    bed: {
      left: "8%",
      top: "32%",
      width: "30%",
      height: "25%",
    },
    wardrobe: {
      right: "5%",
      top: "18%",
      width: "15%",
      height: "42%",
    },
    table: {
      left: "6%",
      bottom: "15%",
      width: "20%",
      height: "14%",
    },
    chair: {
      left: "20%",
      bottom: "5%",
      width: "10%",
      height: "12%",
    },
  },

  "Comfort Focused": {
    bed: {
      left: "35%",
      top: "30%",
      width: "32%",
      height: "27%",
    },
    wardrobe: {
      right: "5%",
      top: "20%",
      width: "15%",
      height: "40%",
    },
    table: {
      left: "7%",
      top: "20%",
      width: "20%",
      height: "14%",
    },
    chair: {
      left: "15%",
      top: "38%",
      width: "10%",
      height: "12%",
    },
  },

  "Budget Focused": {
    bed: {
      left: "40%",
      top: "48%",
      width: "28%",
      height: "24%",
    },
    wardrobe: {
      left: "7%",
      top: "18%",
      width: "14%",
      height: "38%",
    },
    table: {
      right: "7%",
      bottom: "15%",
      width: "20%",
      height: "14%",
    },
    chair: {
      right: "22%",
      bottom: "5%",
      width: "10%",
      height: "12%",
    },
  },
};

function App() {
  const [roomType, setRoomType] = useState("Bedroom");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("Modern");
  const [roomImage, setRoomImage] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setRoomImage(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!length || !width || !budget) {
      alert("Please enter room length, width and budget.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-layout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomType: roomType,
            length: Number(length),
            width: Number(width),
            budget: Number(budget),
            style: style,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult({
        ...data,
        selectedLayout:
          data.layouts && data.layouts.length > 0
            ? data.layouts[0].name
            : null,
      });
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLayout = (layoutName) => {
    setResult((previousResult) => ({
      ...previousResult,
      selectedLayout: layoutName,
    }));
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="logo">
          🏠 AI Smart Room Planner
        </div>

        <p>
          Design your room intelligently with AI
        </p>
      </header>

      {/* ================= MAIN ================= */}

      <main className="container">

        {/* ================= HERO ================= */}

        <section className="hero">

          <h1>
            Transform Your Room with AI
          </h1>

          <p>
            Scan your room, set your budget, choose your style,
            and let AI plan the rest.
          </p>

        </section>

        {/* ================= PLANNER CARD ================= */}

        <section className="planner-card">

          <h2>
            Room Details
          </h2>

          {/* ================= ROOM FORM ================= */}

          <div className="form-grid">

            {/* ROOM TYPE */}

            <div className="form-group">

              <label>
                Room Type
              </label>

              <select
                value={roomType}
                onChange={(e) =>
                  setRoomType(e.target.value)
                }
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

              <label>
                Room Length (ft)
              </label>

              <input
                type="number"
                placeholder="Example: 12"
                value={length}
                onChange={(e) =>
                  setLength(e.target.value)
                }
              />

            </div>

            {/* WIDTH */}

            <div className="form-group">

              <label>
                Room Width (ft)
              </label>

              <input
                type="number"
                placeholder="Example: 10"
                value={width}
                onChange={(e) =>
                  setWidth(e.target.value)
                }
              />

            </div>

            {/* BUDGET */}

            <div className="form-group">

              <label>
                Budget (₹)
              </label>

              <input
                type="number"
                placeholder="Example: 50000"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
              />

            </div>

            {/* STYLE */}

            <div className="form-group">

              <label>
                Interior Style
              </label>

              <select
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value)
                }
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

          {/* ================= IMAGE UPLOAD ================= */}

          <div className="upload-section">

            <h2>
              Upload Your Room
            </h2>

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

          {/* ================= GENERATE BUTTON ================= */}

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >

            {loading
              ? "🤖 Analyzing Room..."
              : "✨ Generate AI Design"}

          </button>

          {/* ================= LOADING ================= */}

          {loading && (

            <div className="result-card">

              <h2>
                🤖 AI is analyzing your room...
              </h2>

              <p>
                Please wait.
              </p>

            </div>

          )}

          {/* ================= RESULT ================= */}

          {result && (

            <div className="result-card">

              {/* ================= ROOM SUMMARY ================= */}

              <h2>
                🎉 Room Analysis Complete
              </h2>

              <div className="summary-grid">

                <div className="summary-item">

                  <span>
                    Room
                  </span>

                  <strong>
                    {result.roomType}
                  </strong>

                </div>

                <div className="summary-item">

                  <span>
                    Dimensions
                  </span>

                  <strong>
                    {result.dimensions}
                  </strong>

                </div>

                <div className="summary-item">

                  <span>
                    Area
                  </span>

                  <strong>
                    {result.area} sq.ft
                  </strong>

                </div>

                <div className="summary-item">

                  <span>
                    Budget
                  </span>

                  <strong>
                    ₹{result.budget}
                  </strong>

                </div>

                <div className="summary-item">

                  <span>
                    Style
                  </span>

                  <strong>
                    {result.style}
                  </strong>

                </div>

              </div>

              {/* ================= FURNITURE ================= */}

              <h2>
                🛋️ Recommended Furniture
              </h2>

              <div className="furniture-grid">

                {result.furniture.map((item, index) => (

                  <div
                    className="furniture-card"
                    key={index}
                  >

                    <div className="furniture-icon">

                      {item.name === "Bed" && "🛏️"}
                      {item.name === "Wardrobe" && "🚪"}
                      {item.name === "Study Table" && "🖥️"}
                      {item.name === "Chair" && "🪑"}
                      {item.name === "Office Chair" && "🪑"}
                      {item.name === "Lighting" && "💡"}
                      {item.name === "RGB Lighting" && "💡"}
                      {item.name === "Curtains" && "🪟"}
                      {item.name === "Decor" && "🖼️"}
                      {item.name === "Wall Decor" && "🖼️"}
                      {item.name === "Sofa" && "🛋️"}
                      {item.name === "TV Unit" && "📺"}
                      {item.name === "Coffee Table" && "🪑"}
                      {item.name === "Bookshelf" && "📚"}
                      {item.name === "Storage Cabinet" && "🗄️"}
                      {item.name === "Gaming Desk" && "🖥️"}
                      {item.name === "Gaming Chair" && "🪑"}
                      {item.name === "Storage Unit" && "🗄️"}
                      {item.name === "Work Desk" && "🖥️"}

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
                        {item.estimatedCost}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>

              {/* ================= BUDGET ================= */}

              <div className="budget-summary">

                <h2>
                  💰 Budget Summary
                </h2>

                <div className="budget-row">

                  <span>
                    Total Budget
                  </span>

                  <strong>
                    ₹{result.budget}
                  </strong>

                </div>

                <div className="budget-row">

                  <span>
                    Estimated Cost
                  </span>

                  <strong>
                    ₹{result.totalEstimatedCost}
                  </strong>

                </div>

                <div className="budget-row remaining">

                  <span>
                    Remaining Budget
                  </span>

                  <strong>
                    ₹{result.remainingBudget}
                  </strong>

                </div>

              </div>

              {/* ================= LAYOUTS ================= */}

              <h2>
                🏠 Recommended Room Layouts
              </h2>

              <div className="layout-grid">

                {result.layouts.map((layout, index) => (

                  <div
                    className="layout-card"
                    key={index}
                  >

                    <div className="layout-number">
                      {index + 1}
                    </div>

                    <h3>
                      {layout.name}
                    </h3>

                    <p>
                      {layout.description}
                    </p>

                    <button
                      onClick={() =>
                        handleSelectLayout(layout.name)
                      }
                    >
                      Select Layout
                    </button>

                  </div>

                ))}

              </div>

              {/* ================= FLOOR PLAN ================= */}

              {result.selectedLayout && (

                <div className="floor-plan-section">

                  <h2>
                    📐 {result.selectedLayout} Floor Plan
                  </h2>

                  <p className="floor-plan-info">
                    {result.roomType} — {result.dimensions}
                  </p>

                  <div className="room-size-badge">

                    {Number(result.area) < 80
                      ? "📦 Compact Room"
                      : Number(result.area) < 150
                      ? "🏠 Medium Room"
                      : "🏡 Spacious Room"}

                  </div>

                  <div className="room-layout">

                    <div className="room-wall">

                      {/* ROOM DIMENSIONS */}

                      <div className="room-label">
                        {result.length} ft × {result.width} ft
                      </div>

                      {/* WINDOW */}

                      <div
                        className="furniture furniture-window"
                        style={{
                          left: "40%",
                          top: "0%",
                          width: "20%",
                          height: "8%",
                        }}
                      >
                        🪟
                        <span>
                          Window
                        </span>
                      </div>

                      {/* BED */}

                      <div
                        className="furniture furniture-bed"
                        style={
                          layoutPositions[
                            result.selectedLayout
                          ]?.bed
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
                          layoutPositions[
                            result.selectedLayout
                          ]?.wardrobe
                        }
                      >
                        🚪
                        <span>
                          Wardrobe
                        </span>
                      </div>

                      {/* STUDY TABLE */}

                      <div
                        className="furniture furniture-table"
                        style={
                          layoutPositions[
                            result.selectedLayout
                          ]?.table
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
                          layoutPositions[
                            result.selectedLayout
                          ]?.chair
                        }
                      >
                        🪑
                        <span>
                          Chair
                        </span>
                      </div>

                      {/* DOOR */}

                      <div
                        className="furniture furniture-door"
                        style={{
                          left: "0%",
                          bottom: "0%",
                          width: "14%",
                          height: "8%",
                        }}
                      >
                        🚪
                        <span>
                          Door
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* ================= LAYOUT EXPLANATION ================= */}

                  <div className="layout-explanation">

                    <h3>
                      💡 Why this layout?
                    </h3>

                    {result.selectedLayout ===
                      "Space Saving" && (

                      <p>
                        The furniture is positioned close
                        to the walls to maximize the
                        available walking area. The bed
                        occupies one side of the room while
                        the wardrobe and study area remain
                        compact.
                      </p>

                    )}

                    {result.selectedLayout ===
                      "Comfort Focused" && (

                      <p>
                        The bed is placed toward the center
                        of the room to create a balanced and
                        comfortable environment. The study
                        area is separated from the sleeping
                        area for better functionality.
                      </p>

                    )}

                    {result.selectedLayout ===
                      "Budget Focused" && (

                      <p>
                        Essential furniture is arranged in
                        a compact configuration. The
                        wardrobe is placed near the wall and
                        the study table is positioned
                        separately to keep the arrangement
                        practical while maintaining open
                        floor space.
                      </p>

                    )}

                  </div>

                </div>

              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;