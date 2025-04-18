# models.py (assumed content)

from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy.orm import relationship
from sqlalchemy import Table, Column, Integer, ForeignKey

db = SQLAlchemy()

roles_users = Table('roles_users',
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

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    users = relationship("User", secondary=roles_users, back_populates="roles")