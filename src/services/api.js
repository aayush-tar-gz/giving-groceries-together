
// Mock API Service
const mockDelay = 500; // Simulate network delay

// Mock User Data
const users = [
  { id: 1, email: 'retailer@example.com', password: 'password', role: 'retailer', city: 'New York', pincode: '10001', contact: '123-456-7890' },
  { id: 2, email: 'ngo@example.com', password: 'password', role: 'ngo', city: 'New York', pincode: '10001', contact: '123-456-7891' }
];

// Mock Food Items
const foodItems = [
  { id: 1, ownerId: 1, name: 'Bread', quantity: 10, addedDate: '2023-04-15', expiryDate: '2023-04-20', status: 'expired' },
  { id: 2, ownerId: 1, name: 'Milk', quantity: 5, addedDate: '2023-04-16', expiryDate: '2023-04-22', status: 'warning' },
  { id: 3, ownerId: 1, name: 'Apples', quantity: 20, addedDate: '2023-04-17', expiryDate: '2023-04-30', status: 'good' },
];

// Mock Food Requests
const foodRequests = [
  { id: 1, ngoId: 2, ngoName: 'Food Bank NYC', foodName: 'Canned Goods', quantity: 15, neededByDate: '2023-04-25', urgency: 'high' },
  { id: 2, ngoId: 2, ngoName: 'Food Bank NYC', foodName: 'Fresh Vegetables', quantity: 10, neededByDate: '2023-04-21', urgency: 'medium' },
];

// Mock API Functions
export const api = {
  // Authentication
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({ 
            success: true, 
            data: { 
              user: userWithoutPassword, 
              token: 'mock-jwt-token' 
            } 
          });
        } else {
          reject({ success: false, error: 'Invalid email or password' });
        }
      }, mockDelay);
    });
  },

  signup: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would validate and store the user
        const newUser = {
          id: users.length + 1,
          ...userData
        };
        users.push(newUser);
        resolve({ success: true, message: 'User created successfully' });
      }, mockDelay);
    });
  },

  // Retailer API
  getRetailerInventory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: foodItems });
      }, mockDelay);
    });
  },

  addInventoryItem: async (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          id: foodItems.length + 1,
          ownerId: 1, // Mock current user id
          ...item,
          status: 'good',
          addedDate: new Date().toISOString().split('T')[0]
        };
        foodItems.push(newItem);
        resolve({ success: true, data: newItem });
      }, mockDelay);
    });
  },

  getFoodRequests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: foodRequests });
      }, mockDelay);
    });
  },

  // NGO API
  getNearbyFoodListings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const availableFood = foodItems.filter(item => item.status !== 'expired');
        resolve({ success: true, data: availableFood });
      }, mockDelay);
    });
  },

  createFoodRequest: async (request) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest = {
          id: foodRequests.length + 1,
          ngoId: 2, // Mock current user id
          ngoName: 'Food Bank NYC',
          ...request
        };
        foodRequests.push(newRequest);
        resolve({ success: true, data: newRequest });
      }, mockDelay);
    });
  },

  getNgoRequests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ngoRequests = foodRequests.filter(req => req.ngoId === 2);
        resolve({ success: true, data: ngoRequests });
      }, mockDelay);
    });
  }
};
