
import React from 'react';
import { Mail, Lock, Building, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SignupForm = ({ formData, handleChange, handleSubmit, handleRoleChange, loading }) => {
  return (
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
            <RadioGroupItem value="Retailer" id="retailer" />
            <Label htmlFor="retailer">Retailer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NGO" id="ngo" />
            <Label htmlFor="ngo">NGO</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          name="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleChange({ target: { name: 'termsAccepted', value: checked }})}
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
  );
};

export default SignupForm;
