
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, InventoryItem, FoodRequest
from datetime import datetime

retailer_bp = Blueprint('retailer', __name__, url_prefix='/retailers')

@retailer_bp.route('/inventory', methods=['GET'])
@jwt_required()
def get_inventory():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    inventory = InventoryItem.query.filter_by(user_id=user.id).all()
    return jsonify([{
        'id': item.id,
        'name': item.name,
        'quantity': item.quantity,
        'expiry_date': item.expiry_date.isoformat(),
        'created_at': item.created_at.isoformat()
    } for item in inventory])

@retailer_bp.route('/add_item', methods=['POST'])
@jwt_required()
def add_inventory_item():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    
    try:
        new_item = InventoryItem(
            name=data['name'],
            quantity=float(data['quantity']),
            expiry_date=datetime.fromisoformat(data['expiry_date'].replace('Z', '+00:00')),
            user_id=user.id
        )
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({
            'id': new_item.id,
            'name': new_item.name,
            'quantity': new_item.quantity,
            'expiry_date': new_item.expiry_date.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@retailer_bp.route('/requested_food', methods=['GET'])
@jwt_required()
def get_food_requests():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    requests = FoodRequest.query.join(InventoryItem).filter(InventoryItem.user_id == user.id).all()
    return jsonify([{
        'id': req.id,
        'inventory_item': {
            'id': req.inventory_item.id,
            'name': req.inventory_item.name,
            'quantity': req.inventory_item.quantity
        },
        'status': req.status,
        'created_at': req.created_at.isoformat()
    } for req in requests])
