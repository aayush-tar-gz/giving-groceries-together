
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy.orm import relationship
from sqlalchemy import Table, Column, Integer, ForeignKey
from datetime import datetime

db = SQLAlchemy()

# Create metadata object
metadata = db.metadata

roles_users = Table('roles_users',
    metadata,
    db.Column('user_id', Integer(), ForeignKey('user.id')),
    db.Column('role_id', Integer(), ForeignKey('role.id')))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    active = db.Column(db.Boolean)
    city = db.Column(db.String)
    pincode = db.Column(db.String)
    contact = db.Column(db.String)
    roles = relationship("Role", secondary=roles_users, back_populates="users")
    inventory_items = relationship("InventoryItem", backref="user")
    food_requests = relationship("FoodRequest", backref="user")

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    users = relationship("User", secondary=roles_users, back_populates="roles")

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class FoodRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_item_id = db.Column(db.Integer, db.ForeignKey('inventory_item.id'), nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String, default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    inventory_item = relationship("InventoryItem")
