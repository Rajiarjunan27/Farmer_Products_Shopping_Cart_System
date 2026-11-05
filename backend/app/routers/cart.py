
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.models import CartItem, Product, Customer
from app.dependencies import get_current_customer

router = APIRouter(prefix="/cart", tags=["Cart"])


class CartAdd(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartUpdate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


@router.post("/add")
def add_to_cart(
    data: CartAdd,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    product = db.query(Product).filter(
        Product.id == data.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(404, "Product not found or inactive")

    item = db.query(CartItem).filter(
        CartItem.product_id == data.product_id,
        CartItem.customer_id == customer.id
    ).first()

    current_quantity = item.quantity if item else 0
    new_quantity = current_quantity + data.quantity

    if new_quantity > product.available_quantity:
        raise HTTPException(400, "Insufficient stock")

    if item:
        item.quantity = new_quantity
    else:
        item = CartItem(
            product_id=data.product_id,
            quantity=data.quantity,
            customer_id=customer.id
        )
        db.add(item)

    db.commit()

    return {"message": "Product added to cart"}


@router.put("/update")
def update_cart(
    data: CartUpdate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    item = db.query(CartItem).filter(
        CartItem.product_id == data.product_id,
        CartItem.customer_id == customer.id
    ).first()

    if not item:
        raise HTTPException(404, "Cart item not found")

    product = db.query(Product).filter(
        Product.id == data.product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(404, "Product not found or inactive")

    if data.quantity > product.available_quantity:
        raise HTTPException(400, "Insufficient stock")

    item.quantity = data.quantity
    db.commit()

    return {"message": "Cart updated successfully"}


@router.delete("/remove/{product_id}")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    item = db.query(CartItem).filter(
        CartItem.product_id == product_id,
        CartItem.customer_id == customer.id
    ).first()

    if not item:
        raise HTTPException(404, "Cart item not found")

    db.delete(item)
    db.commit()

    return {"message": "Cart item removed"}


@router.get("/")
def view_cart(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    items = db.query(CartItem).filter(
        CartItem.customer_id == customer.id
    ).all()

    cart_items = []
    grand_total = 0

    for item in items:
        product = item.product
        subtotal = product.price * item.quantity
        grand_total += subtotal

        cart_items.append({
            "product_id": product.id,
            "product_name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "subtotal": subtotal
        })

    return {
        "items": cart_items,
        "grand_total": grand_total
    }
