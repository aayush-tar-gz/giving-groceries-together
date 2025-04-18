
import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const RetailerDashboard = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, requestsRes] = await Promise.all([
          api.getRetailerInventory(),
          api.getFoodRequests()
        ]);
        
        setInventory(inventoryRes.data);
        setFoodRequests(requestsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.addInventoryItem({
        name: newItem.name,
        quantity: parseInt(newItem.quantity, 10),
        expiryDate: newItem.expiryDate
      });
      
      setInventory([...inventory, response.data]);
      toast.success('Item added to inventory');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      quantity: '',
      expiryDate: ''
    });
  };

  const handleFulfill = (requestId) => {
    // In a real app, would call API
    toast.success('Request fulfilled! Contact information has been shared.');
    // Remove the request from the list
    setFoodRequests(foodRequests.filter(req => req.id !== requestId));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'good': return 'bg-status-good';
      case 'warning': return 'bg-status-warning';
      case 'expired': return 'bg-status-expired';
      default: return 'bg-status-good';
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-status-expired';
      case 'medium': return 'bg-status-warning';
      case 'low': return 'bg-status-good';
      default: return 'bg-status-good';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Retailer Dashboard</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Food Item</DialogTitle>
              <DialogDescription>
                Enter details about the food item you want to add to your inventory.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddItem}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Food Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Calendar size={16} />
                    </div>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      className="pl-10"
                      value={newItem.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby NGO Food Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby NGO Food Requests</CardTitle>
            <CardDescription>Food requests from NGOs in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {foodRequests.length === 0 ? (
              <p className="text-muted-foreground">No food requests at this time.</p>
            ) : (
              <div className="space-y-4">
                {foodRequests.map((request) => (
                  <div key={request.id} className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{request.ngoName}</h3>
                        <p className="text-sm text-muted-foreground">Needs by: {request.neededByDate}</p>
                      </div>
                      <Badge className={getUrgencyClass(request.urgency)}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </Badge>
                    </div>
                    <p className="mb-3">
                      <span className="font-medium">{request.foodName}</span>{' '}
                      <span className="text-muted-foreground">({request.quantity} units)</span>
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleFulfill(request.id)}
                    >
                      Fulfill Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Your current food inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <p className="text-muted-foreground">No items in inventory.</p>
            ) : (
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge className={getStatusClass(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Added: {item.addedDate}</p>
                    <p className="text-sm text-muted-foreground mb-3">Expires: {item.expiryDate}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        List for Donation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetailerDashboard;
