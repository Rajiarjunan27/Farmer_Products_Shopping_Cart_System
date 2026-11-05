
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CartItem, Product, Order, OrderItem, Customer
from app.schemas import OrderResponse
from app.dependencies import get_current_customer

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/checkout", response_model=OrderResponse)
def checkout(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    cart_items = db.query(CartItem).filter(
        CartItem.customer_id == customer.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    order_items = []

    try:
        for cart_item in cart_items:
            product = db.query(Product).filter(
                Product.id == cart_item.product_id
            ).with_for_update().first()

            if not product or not product.is_active:
                raise HTTPException(
                    status_code=400,
                    detail="Product is unavailable"
                )

            if product.available_quantity < cart_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

            subtotal = product.price * cart_item.quantity
            total_amount += subtotal

            order_items.append({
                "product_id": product.id,
                "product_name": product.name,
                "price": product.price,
                "quantity": cart_item.quantity,
                "subtotal": subtotal
            })

        order = Order(
            customer_id=customer.id,
            total_amount=total_amount,
            status="placed"
        )

        db.add(order)
        db.flush()

        for item in order_items:
            db.add(OrderItem(
                order_id=order.id,
                product_id=item["product_id"],
                product_name=item["product_name"],
                price=item["price"],
                quantity=item["quantity"],
                subtotal=item["subtotal"]
            ))

            product = db.query(Product).filter(
                Product.id == item["product_id"]
            ).first()

            product.available_quantity -= item["quantity"]

        db.query(CartItem).filter(
            CartItem.customer_id == customer.id
        ).delete(synchronize_session=False)

        db.commit()
        db.refresh(order)

        return order

    except Exception:
        db.rollback()
        raise


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    orders = db.query(Order).filter(
        Order.customer_id == customer.id
    ).order_by(Order.id.desc()).all()

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == customer.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order
