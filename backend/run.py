
from foodloop_app import create_app, db
from foodloop_app.models import Role

app = create_app()

def init_roles():
    with app.app_context():
        db.create_all()
        # Create roles if they don't exist
        roles = ['Retailer', 'NGO', 'Farmer', 'Admin']
        for role_name in roles:
            if not Role.query.filter_by(name=role_name).first():
                role = Role(name=role_name)
                db.session.add(role)
        db.session.commit()

if __name__ == "__main__":
    init_roles()
    app.run(debug=True, port=3000)
