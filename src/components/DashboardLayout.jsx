
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

const DashboardLayout = ({ children }) => {
  const { user, logout, isRetailer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userType = isRetailer ? 'Retailer' : 'NGO';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-2">Menu</h2>
                  <nav className="flex flex-col space-y-1">
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </Button>
                    {isRetailer ? (
                      <>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/inventory')}>
                          Inventory
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/requests')}>
                          Food Requests
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/listings')}>
                          Food Listings
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/my-requests')}>
                          My Requests
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>
                      Profile
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold ml-2">Food Share</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-muted-foreground">
                {user?.email} ({userType})
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden lg:block w-[250px] shrink-0">
            <div className="sticky top-24 bg-card rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                {isRetailer ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/inventory')}>
                      Inventory
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/requests')}>
                      Food Requests
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/listings')}>
                      Food Listings
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/my-requests')}>
                      My Requests
                    </Button>
                  </>
                )}
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>
                  Profile
                </Button>
              </nav>
            </div>
          </aside>
          
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
