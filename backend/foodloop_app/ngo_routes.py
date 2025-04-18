
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, InventoryItem, FoodRequest
from sqlalchemy import and_

ngo_bp = Blueprint('ngo', __name__, url_prefix='/ngo')

@ngo_bp.route('/filtered_food', methods=['GET'])
@jwt_required()
def get_nearby_food():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Filter items by the same pincode
    nearby_items = InventoryItem.query.join(User).filter(User.pincode == user.pincode).all()
    
    return jsonify([{
        'id': item.id,
        'name': item.name,
        'quantity': item.quantity,
        'expiry_date': item.expiry_date.isoformat(),
        'retailer': {
            'id': item.user.id,
            'contact': item.user.contact,
            'city': item.user.city
        }
    } for item in nearby_items])

@ngo_bp.route('/request', methods=['POST'])
@jwt_required()
def create_food_request():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.get_json()
    
    try:
        new_request = FoodRequest(
            inventory_item_id=data['inventory_item_id'],
            requester_id=user.id,
            status='pending'
        )
        db.session.add(new_request)
        db.session.commit()
        
        return jsonify({
            'id': new_request.id,
            'status': new_request.status,
            'created_at': new_request.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@ngo_bp.route('/my_requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    requests = FoodRequest.query.filter_by(requester_id=user.id).all()
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
