
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.models import Admin, Customer
from app.security import (
    verify_password,
    create_access_token,
    hash_password
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# Customer Registration Schema
class CustomerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


# ADMIN LOGIN
@router.post("/login")
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.email == form_data.username
    ).first()

    if not admin or not verify_password(
        form_data.password,
        admin.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": str(admin.id),
            "role": "admin"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email
        }
    }


# CUSTOMER REGISTRATION
@router.post("/register", status_code=status.HTTP_201_CREATED)
def customer_register(
    data: CustomerRegister,
    db: Session = Depends(get_db)
):
    existing_customer = db.query(Customer).filter(
        Customer.email == data.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    customer = Customer(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_active=True
    )

    db.add(customer)

    try:
        db.commit()
        db.refresh(customer)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Customer registration failed"
        )

    return {
        "message": "Customer registered successfully",
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "role": "customer"
        }
    }


# CUSTOMER LOGIN
@router.post("/customer/login")
def customer_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.email == form_data.username
    ).first()

    if not customer or not verify_password(
        form_data.password,
        customer.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": str(customer.id),
            "role": "customer"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "role": "customer"
        }
    }
