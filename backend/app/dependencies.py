
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Admin, Customer
from app.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/customer/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")
        role = payload.get("role")

        if user_id is None or role not in ["admin", "customer"]:
            raise credentials_exception

        return {
            "id": int(user_id),
            "role": role
        }

    except (JWTError, ValueError):
        raise credentials_exception


def get_current_admin(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    admin = db.query(Admin).filter(
        Admin.id == user["id"],
        Admin.is_active == True
    ).first()

    if not admin:
        raise HTTPException(
            status_code=403,
            detail="Admin account inactive or not found"
        )

    return admin


def get_current_customer(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "customer":
        raise HTTPException(
            status_code=403,
            detail="Customer access required"
        )

    customer = db.query(Customer).filter(
        Customer.id == user["id"],
        Customer.is_active == True
    ).first()

    if not customer:
        raise HTTPException(
            status_code=403,
            detail="Customer account inactive or not found"
        )

    return customer
