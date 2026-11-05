
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from decimal import Decimal
from datetime import datetime


# Authentication schemas
class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Product schemas
class ProductCreate(BaseModel):
    name: str
    category: str
    farmer_name: str
    description: Optional[str] = None
    price: Decimal
    available_quantity: int
    image_url: Optional[str] = None
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    farmer_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    available_quantity: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)



class OrderItemResponse(BaseModel):
    product_id: int
    product_name: str
    price: Decimal
    quantity: int
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    customer_id: Optional[int] = None
    total_amount: Decimal
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
