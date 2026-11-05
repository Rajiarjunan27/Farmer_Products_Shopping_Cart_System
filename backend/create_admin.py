
from app.database import SessionLocal
from app.models import Admin
from app.security import hash_password

db = SessionLocal()

try:
    admin = db.query(Admin).filter(
        Admin.email == "admin@example.com"
    ).first()

    if admin:
        admin.hashed_password = hash_password("ChangeThis@123")
        print("Admin password reset successfully!")
    else:
        admin = Admin(
            name="Admin",
            email="admin@example.com",
            hashed_password=hash_password("ChangeThis@123")
        )
        db.add(admin)
        print("Admin created successfully!")

    db.commit()

except Exception as e:
    db.rollback()
    print("Error:", e)

finally:
    db.close()
