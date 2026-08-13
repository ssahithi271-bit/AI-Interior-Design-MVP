from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RoomRequest(BaseModel):
    roomType: str
    length: float
    width: float
    budget: float
    style: str


def create_furniture_plan(room_type, budget, style):

    if room_type == "Bedroom":

        items = [
            {
                "name": "Bed",
                "percentage": 0.35,
                "description": f"Modern {style.lower()} bed suitable for the room."
            },
            {
                "name": "Wardrobe",
                "percentage": 0.25,
                "description": "Space-efficient wardrobe for clothes and storage."
            },
            {
                "name": "Study Table",
                "percentage": 0.10,
                "description": "Compact study/work table."
            },
            {
                "name": "Chair",
                "percentage": 0.06,
                "description": "Comfortable chair for study or work."
            },
            {
                "name": "Lighting",
                "percentage": 0.08,
                "description": "Ceiling and ambient lighting."
            },
            {
                "name": "Curtains",
                "percentage": 0.06,
                "description": "Curtains matching the selected interior style."
            },
            {
                "name": "Decor",
                "percentage": 0.05,
                "description": "Wall decor and accessories."
            }
        ]

    elif room_type == "Living Room":

        items = [
            {
                "name": "Sofa",
                "percentage": 0.40,
                "description": f"{style} style sofa for comfortable seating."
            },
            {
                "name": "TV Unit",
                "percentage": 0.18,
                "description": "Functional TV and storage unit."
            },
            {
                "name": "Coffee Table",
                "percentage": 0.10,
                "description": "Compact centre coffee table."
            },
            {
                "name": "Lighting",
                "percentage": 0.10,
                "description": "Ambient and ceiling lighting."
            },
            {
                "name": "Curtains",
                "percentage": 0.07,
                "description": "Decorative curtains."
            },
            {
                "name": "Decor",
                "percentage": 0.08,
                "description": "Wall art and decorative accessories."
            }
        ]

    elif room_type == "Study Room":

        items = [
            {
                "name": "Study Table",
                "percentage": 0.25,
                "description": "Large functional study desk."
            },
            {
                "name": "Office Chair",
                "percentage": 0.18,
                "description": "Ergonomic chair for comfortable working."
            },
            {
                "name": "Bookshelf",
                "percentage": 0.18,
                "description": "Vertical storage for books and supplies."
            },
            {
                "name": "Storage Cabinet",
                "percentage": 0.12,
                "description": "Additional storage."
            },
            {
                "name": "Lighting",
                "percentage": 0.10,
                "description": "Task and ambient lighting."
            },
            {
                "name": "Curtains",
                "percentage": 0.07,
                "description": "Window curtains."
            },
            {
                "name": "Decor",
                "percentage": 0.05,
                "description": "Minimal study-room decoration."
            }
        ]

    elif room_type == "Gaming Room":

        items = [
            {
                "name": "Gaming Desk",
                "percentage": 0.25,
                "description": "Large desk for gaming equipment."
            },
            {
                "name": "Gaming Chair",
                "percentage": 0.20,
                "description": "Ergonomic gaming chair."
            },
            {
                "name": "Storage Unit",
                "percentage": 0.12,
                "description": "Storage for gaming accessories."
            },
            {
                "name": "RGB Lighting",
                "percentage": 0.12,
                "description": "Ambient gaming lighting."
            },
            {
                "name": "Wall Decor",
                "percentage": 0.10,
                "description": "Gaming-themed wall decoration."
            },
            {
                "name": "Curtains",
                "percentage": 0.06,
                "description": "Blackout curtains."
            }
        ]

    else:

        items = [
            {
                "name": "Work Desk",
                "percentage": 0.25,
                "description": "Functional office desk."
            },
            {
                "name": "Office Chair",
                "percentage": 0.20,
                "description": "Ergonomic office chair."
            },
            {
                "name": "Storage Cabinet",
                "percentage": 0.18,
                "description": "Office storage solution."
            },
            {
                "name": "Lighting",
                "percentage": 0.12,
                "description": "Professional office lighting."
            },
            {
                "name": "Curtains",
                "percentage": 0.07,
                "description": "Window curtains."
            },
            {
                "name": "Decor",
                "percentage": 0.08,
                "description": "Professional office decoration."
            }
        ]

    furniture = []

    for item in items:

        cost = round(budget * item["percentage"])

        furniture.append({
            "name": item["name"],
            "estimatedCost": cost,
            "description": item["description"]
        })

    return furniture


@app.get("/")
def home():

    return {
        "message": "AI Smart Room Planner Backend is running!"
    }


@app.get("/test")
def test():

    return {
        "status": "success",
        "message": "Backend connection is working!"
    }


@app.post("/generate-layout")
def generate_layout(room: RoomRequest):

    area = room.length * room.width

    furniture = create_furniture_plan(
        room.roomType,
        room.budget,
        room.style
    )

    total_cost = sum(
        item["estimatedCost"]
        for item in furniture
    )

    remaining_budget = room.budget - total_cost

    return {

        "message": "Room analysis completed!",

        "roomType": room.roomType,

        "dimensions": f"{room.length} ft × {room.width} ft",

        "area": area,

        "budget": room.budget,

        "style": room.style,

        "furniture": furniture,

        "totalEstimatedCost": total_cost,

        "remainingBudget": remaining_budget,

        "layouts": [

            {
                "name": "Space Saving",
                "description":
                    "Furniture is arranged around the walls to maximize open walking space."
            },

            {
                "name": "Comfort Focused",
                "description":
                    "Furniture is positioned to create a comfortable and balanced environment."
            },

            {
                "name": "Budget Focused",
                "description":
                    "Furniture selection prioritizes essential items while staying within budget."
            }

        ]

    }