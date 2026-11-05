
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.dependencies import get_current_admin
from fastapi import APIRouter, Depends, HTTPException, Body

from app.models import Admin





router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# Create product - Admin only
@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


# Get all products

@router.get("/")
def get_products(
    search: str = None,
    category: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    return query.all()



# Get product by ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product
#status
@router.get("/admin/all")
def get_all_products(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return db.query(Product).order_by(Product.id.desc()).all()

# Update product - Admin only
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Delete product - Admin only
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}




from fastapi import Body

@router.patch("/{product_id}/stock")
def update_stock(
    product_id: int,
    quantity: int = Body(..., embed=True, ge=0),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.available_quantity = quantity

    db.commit()
    db.refresh(product)

    return {
        "message": "Stock updated successfully",
        "product_id": product.id,
        "available_quantity": product.available_quantity
    }

@router.patch("/{product_id}/status")
def update_product_status(
    product_id: int,
    is_active: bool = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = is_active

    db.commit()
    db.refresh(product)

    return {
        "message": "Product status updated successfully",
        "product_id": product.id,
        "is_active": product.is_active
    }

