from app.routers import auth
from app.database import Base, engine
from app import models
from app.routers import products
from fastapi import FastAPI
from app.routers import cart
from app.routers import orders
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.staticfiles import StaticFiles



app = FastAPI(
    title="Farmer Products Shopping Cart API",
    description="Backend API for Farmer Products Shopping Cart System",
    version="1.0.0"
)

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)

@app.get("/")
def home():
    return {
        "message": "Farmer Products Shopping Cart API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
