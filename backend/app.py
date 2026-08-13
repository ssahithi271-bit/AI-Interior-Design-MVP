from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Interior Design MVP")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Basic test
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI Interior Design Backend is running!"
    }


@app.get("/test")
def test():
    return {
        "status": "success",
        "message": "Backend connection is working!"
    }


# --------------------------------------------------
# Personalized Room Recommendation
# --------------------------------------------------

@app.post("/generate-design")
async def generate_design(
    room_type: str = Form(...),
    length: float = Form(...),
    width: float = Form(...),
    budget: float = Form(...),
    style: str = Form(...),
    room_image: UploadFile | None = File(None)
):

    # Calculate room area
    area = length * width

    # --------------------------------------------------
    # Determine room size
    # --------------------------------------------------

    if area < 80:
        room_size = "Small Room"
    elif area <= 150:
        room_size = "Medium Room"
    else:
        room_size = "Large Room"

    # --------------------------------------------------
    # Determine budget level
    # --------------------------------------------------

    if budget < 30000:
        budget_level = "Budget"
    elif budget < 75000:
        budget_level = "Standard"
    elif budget < 150000:
        budget_level = "Premium"
    else:
        budget_level = "Luxury"

    # --------------------------------------------------
    # Style-based descriptions
    # --------------------------------------------------

    style_descriptions = {
        "Modern": "clean lines, practical furniture and a contemporary appearance",
        "Minimalist": "simple furniture, open space and a clutter-free environment",
        "Traditional": "classic furniture, warm colors and a comfortable traditional atmosphere",
        "Luxury": "premium furniture, elegant finishes and sophisticated decoration",
        "Scandinavian": "light colors, natural materials and simple functional furniture",
        "Industrial": "metal accents, practical furniture and an urban industrial appearance"
    }

    style_description = style_descriptions.get(
        style,
        "a balanced and functional interior style"
    )

    # --------------------------------------------------
    # Furniture recommendations
    # --------------------------------------------------

    furniture = []

    if room_type == "Bedroom":

        if budget < 40000:
            furniture = [
                {
                    "name": "Compact Bed",
                    "description": f"Space-efficient bed designed for a {room_size.lower()}.",
                    "cost": 14000
                },
                {
                    "name": "Compact Wardrobe",
                    "description": "Affordable wardrobe with efficient storage.",
                    "cost": 9000
                },
                {
                    "name": "Study Table",
                    "description": "Compact table suitable for study or work.",
                    "cost": 4500
                },
                {
                    "name": "Chair",
                    "description": "Simple comfortable chair.",
                    "cost": 2500
                },
                {
                    "name": "Lighting",
                    "description": "Basic ceiling and ambient lighting.",
                    "cost": 3000
                },
                {
                    "name": "Curtains",
                    "description": f"Curtains matching the {style.lower()} style.",
                    "cost": 2500
                }
            ]

        elif budget < 75000:
            furniture = [
                {
                    "name": "Modern Bed",
                    "description": f"Comfortable bed suitable for a {room_size.lower()}.",
                    "cost": 18000
                },
                {
                    "name": "Wardrobe",
                    "description": "Space-efficient wardrobe with multiple storage sections.",
                    "cost": 14000
                },
                {
                    "name": "Study Table",
                    "description": "Functional study/work table.",
                    "cost": 5500
                },
                {
                    "name": "Comfort Chair",
                    "description": "Ergonomic chair suitable for study or work.",
                    "cost": 3500
                },
                {
                    "name": "Lighting",
                    "description": "Ceiling and ambient lighting combination.",
                    "cost": 4500
                },
                {
                    "name": "Curtains",
                    "description": f"Curtains designed for the {style.lower()} interior.",
                    "cost": 3500
                },
                {
                    "name": "Wall Decor",
                    "description": "Decorative elements matching the selected style.",
                    "cost": 3000
                }
            ]

        else:
            furniture = [
                {
                    "name": "Premium Bed",
                    "description": f"Premium bed with a {style.lower()} design.",
                    "cost": 30000
                },
                {
                    "name": "Premium Wardrobe",
                    "description": "Large wardrobe with organized storage.",
                    "cost": 25000
                },
                {
                    "name": "Designer Study Table",
                    "description": "Premium work and study table.",
                    "cost": 10000
                },
                {
                    "name": "Premium Chair",
                    "description": "Comfortable ergonomic premium chair.",
                    "cost": 7000
                },
                {
                    "name": "Designer Lighting",
                    "description": "Layered ambient and decorative lighting.",
                    "cost": 8000
                },
                {
                    "name": "Premium Curtains",
                    "description": "High-quality curtains matching the selected style.",
                    "cost": 6000
                },
                {
                    "name": "Decor",
                    "description": f"Decorative elements creating a {style.lower()} atmosphere.",
                    "cost": 7000
                }
            ]

    elif room_type == "Living Room":

        furniture = [
            {
                "name": "Sofa",
                "description": f"{style} sofa suitable for the available room space.",
                "cost": 22000 if budget < 75000 else 35000
            },
            {
                "name": "TV Unit",
                "description": "Functional TV and storage unit.",
                "cost": 10000
            },
            {
                "name": "Center Table",
                "description": "Compact center table for the seating area.",
                "cost": 5000
            },
            {
                "name": "Lighting",
                "description": "Ambient lighting for a comfortable living space.",
                "cost": 4000
            },
            {
                "name": "Curtains",
                "description": f"Curtains matching the {style.lower()} style.",
                "cost": 3500
            },
            {
                "name": "Decor",
                "description": "Wall decor and accessories.",
                "cost": 3000
            }
        ]

    elif room_type == "Study Room":

        furniture = [
            {
                "name": "Study Desk",
                "description": f"Functional desk designed for a {style.lower()} workspace.",
                "cost": 8000
            },
            {
                "name": "Office Chair",
                "description": "Comfortable ergonomic chair.",
                "cost": 6000
            },
            {
                "name": "Bookshelf",
                "description": "Storage for books and study materials.",
                "cost": 7000
            },
            {
                "name": "Lighting",
                "description": "Focused study and ambient lighting.",
                "cost": 3500
            },
            {
                "name": "Curtains",
                "description": "Simple curtains matching the room style.",
                "cost": 2500
            }
        ]

    elif room_type == "Gaming Room":

        furniture = [
            {
                "name": "Gaming Desk",
                "description": "Large desk for gaming equipment.",
                "cost": 10000
            },
            {
                "name": "Gaming Chair",
                "description": "Ergonomic gaming chair.",
                "cost": 12000
            },
            {
                "name": "Storage Unit",
                "description": "Storage for gaming accessories.",
                "cost": 7000
            },
            {
                "name": "RGB Lighting",
                "description": "Decorative gaming atmosphere lighting.",
                "cost": 5000
            },
            {
                "name": "Wall Decor",
                "description": "Gaming-themed wall decoration.",
                "cost": 3000
            }
        ]

    else:

        furniture = [
            {
                "name": "Work Desk",
                "description": f"Functional {style.lower()} work desk.",
                "cost": 9000
            },
            {
                "name": "Office Chair",
                "description": "Comfortable ergonomic office chair.",
                "cost": 6500
            },
            {
                "name": "Storage Cabinet",
                "description": "Storage for office documents and accessories.",
                "cost": 7000
            },
            {
                "name": "Lighting",
                "description": "Focused and ambient office lighting.",
                "cost": 3500
            },
            {
                "name": "Curtains",
                "description": "Professional curtains matching the interior.",
                "cost": 2500
            }
        ]

    # --------------------------------------------------
    # Calculate estimated cost
    # --------------------------------------------------

    estimated_cost = sum(item["cost"] for item in furniture)

    remaining_budget = budget - estimated_cost

    # --------------------------------------------------
    # Personalized layout descriptions
    # --------------------------------------------------

    layouts = [
        {
            "id": 1,
            "name": "Space Saving",
            "description": (
                f"Furniture is positioned close to the walls to maximize "
                f"walking space in this {room_size.lower()}."
            ),
            "reason": (
                "This layout prioritizes open floor space and efficient "
                "movement around the room."
            )
        },
        {
            "id": 2,
            "name": "Comfort Focused",
            "description": (
                f"Furniture is arranged to create a comfortable and balanced "
                f"{style.lower()} environment."
            ),
            "reason": (
                "This layout provides better separation between functional "
                "areas and creates a comfortable atmosphere."
            )
        },
        {
            "id": 3,
            "name": "Budget Focused",
            "description": (
                f"Essential furniture is prioritized to stay within the "
                f"₹{budget:,.0f} budget."
            ),
            "reason": (
                "This layout focuses on essential furniture while avoiding "
                "unnecessary spending."
            )
        }
    ]

    # --------------------------------------------------
    # Image information
    # --------------------------------------------------

    image_uploaded = room_image is not None

    return {
        "status": "success",
        "room": room_type,
        "length": length,
        "width": width,
        "area": area,
        "room_size": room_size,
        "budget": budget,
        "budget_level": budget_level,
        "style": style,
        "style_description": style_description,
        "image_uploaded": image_uploaded,
        "furniture": furniture,
        "estimated_cost": estimated_cost,
        "remaining_budget": remaining_budget,
        "layouts": layouts
    }