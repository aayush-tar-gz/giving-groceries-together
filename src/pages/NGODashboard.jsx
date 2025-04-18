
import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Phone } from 'lucide-react';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const NGODashboard = () => {
  const [foodListings, setFoodListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    foodName: '',
    quantity: '',
    neededByDate: '',
    urgency: 'medium'
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, requestsRes] = await Promise.all([
          api.getNearbyFoodListings(),
          api.getNgoRequests()
        ]);
        
        setFoodListings(listingsRes.data);
        setMyRequests(requestsRes.data);
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
    setNewRequest({
      ...newRequest,
      [name]: value
    });
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.createFoodRequest(newRequest);
      setMyRequests([...myRequests, response.data]);
      toast.success('Food request created successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request');
    }
  };

  const resetForm = () => {
    setNewRequest({
      foodName: '',
      quantity: '',
      neededByDate: '',
      urgency: 'medium'
    });
  };

  const handleContactRetailer = (itemId) => {
    // In a real app, would show contact info or facilitate communication
    toast.success('Contact information shared. You can now coordinate with the retailer.');
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
        <h1 className="text-2xl font-bold">NGO Dashboard</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Request Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Food Request</DialogTitle>
              <DialogDescription>
                Enter details about the food you need.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateRequest}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="foodName">Food Name</Label>
                  <Input
                    id="foodName"
                    name="foodName"
                    value={newRequest.foodName}
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
                    value={newRequest.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="neededByDate">Needed By Date</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Calendar size={16} />
                    </div>
                    <Input
                      id="neededByDate"
                      name="neededByDate"
                      type="date"
                      className="pl-10"
                      value={newRequest.neededByDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="urgency">Urgency</Label>
                  <select
                    id="urgency"
                    name="urgency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newRequest.urgency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Retailer Food Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Available Food</CardTitle>
            <CardDescription>Food items available from nearby retailers</CardDescription>
          </CardHeader>
          <CardContent>
            {foodListings.length === 0 ? (
              <p className="text-muted-foreground">No food listings available at this time.</p>
            ) : (
              <div className="space-y-4">
                {foodListings.map((item) => (
                  <div key={item.id} className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge className={getStatusClass(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Quantity: {item.quantity} units</p>
                    <p className="text-sm text-muted-foreground mb-3">Expires: {item.expiryDate}</p>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleContactRetailer(item.id)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Retailer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Food Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Food Requests</CardTitle>
            <CardDescription>Food requests you've created</CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <p className="text-muted-foreground">You haven't created any food requests yet.</p>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{request.foodName}</h3>
                      <Badge className={getUrgencyClass(request.urgency)}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Quantity: {request.quantity} units</p>
                    <p className="text-sm text-muted-foreground mb-3">Needed by: {request.neededByDate}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit Request
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        Cancel Request
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

export default NGODashboard;
