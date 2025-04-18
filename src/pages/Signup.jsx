
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, MapPin, Phone, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    city: '',
    pincode: '',
    contact: '',
    role: 'retailer',
    termsAccepted: false
  });
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    try {
      await signup(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Building size={18} />
                </div>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  className="pl-10"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <MapPin size={18} />
                </div>
                <Input
                  type="text"
                  id="pincode"
                  name="pincode"
                  placeholder="Pincode"
                  className="pl-10"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Phone size={18} />
                </div>
                <Input
                  type="tel"
                  id="contact"
                  name="contact"
                  placeholder="Contact Number"
                  className="pl-10"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup 
                defaultValue="retailer" 
                value={formData.role}
                onValueChange={handleRoleChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retailer" id="retailer" />
                  <Label htmlFor="retailer">Retailer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ngo" id="ngo" />
                  <Label htmlFor="ngo">NGO</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                name="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked})}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms and conditions
                </Link>
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
