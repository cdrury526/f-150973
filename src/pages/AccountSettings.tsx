
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Define type for builder profile
interface BuilderProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

const AccountSettings = () => {
  const { user, profile, loading, userRole } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [builderProfile, setBuilderProfile] = useState<BuilderProfile | null>(null);
  const { toast } = useToast();

  // Redirect if user is not logged in
  if (!loading && !user) {
    return <Navigate to="/auth/login" />;
  }

  // Fetch builder profile if user is a builder or admin
  useEffect(() => {
    if (user && (userRole === 'builder' || userRole === 'admin')) {
      fetchBuilderProfile();
    }
  }, [user, userRole]);

  const fetchBuilderProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('builder_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned
        console.error('Error fetching builder profile:', error);
        return;
      }
      
      if (data) {
        setBuilderProfile(data);
        setCompanyName(data.company_name || '');
        setCompanyDescription(data.description || '');
        setLogoUrl(data.logo_url);
      }
    } catch (err) {
      console.error('Error fetching builder profile:', err);
    }
  };

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;
      
      // If builder or admin, update builder profile too
      if (userRole === 'builder' || userRole === 'admin') {
        // Upload logo if a new one is selected
        let logoUrlToUpdate = logoUrl;
        
        if (logoFile) {
          setIsUploadingLogo(true);
          const fileExt = logoFile.name.split('.').pop();
          const filePath = `${user?.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('company-logos')
            .upload(filePath, logoFile);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);
          
          logoUrlToUpdate = publicUrlData.publicUrl;
          setLogoUrl(logoUrlToUpdate);
          setIsUploadingLogo(false);
        }
        
        // Check if builder profile exists
        if (builderProfile) {
          // Update existing profile
          const { error: builderError } = await supabase
            .from('builder_profiles')
            .update({
              company_name: companyName,
              description: companyDescription,
              logo_url: logoUrlToUpdate,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user?.id);
            
          if (builderError) throw builderError;
        } else {
          // Create new profile
          const { error: builderError } = await supabase
            .from('builder_profiles')
            .insert({
              user_id: user?.id,
              company_name: companyName, 
              description: companyDescription,
              logo_url: logoUrlToUpdate,
            });
            
          if (builderError) throw builderError;
        }
      }
      
      setSuccess(true);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast({
        title: "Update failed",
        description: err.message || 'Failed to update profile',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is an image
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Check if file size is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setLogoFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setLogoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Tabs defaultValue="profile" className="mx-auto max-w-2xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {(userRole === 'builder' || userRole === 'admin') && (
            <TabsTrigger value="company">Company Info</TabsTrigger>
          )}
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>Profile updated successfully</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input 
                    id="role" 
                    value={profile?.role || 'customer'}
                    disabled
                    className="bg-gray-50 capitalize"
                  />
                  <p className="text-sm text-muted-foreground">Your account type cannot be changed</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="ml-auto"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {(userRole === 'builder' || userRole === 'admin') && (
          <TabsContent value="company">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Company Information</CardTitle>
                <CardDescription>Manage your company details</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      placeholder="Your Company Name" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Description</Label>
                    <Textarea 
                      id="companyDescription" 
                      placeholder="Tell us about your company..." 
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyLogo">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      {logoUrl && (
                        <div className="h-16 w-16 overflow-hidden rounded border">
                          <img 
                            src={logoUrl} 
                            alt="Company logo" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Label
                          htmlFor="logo-upload"
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <Upload className="h-4 w-4" />
                          {logoUrl ? 'Change Logo' : 'Upload Logo'}
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Recommended size: 400x400px (Max: 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isUpdating || isUploadingLogo}
                    className="ml-auto"
                  >
                    {isUpdating || isUploadingLogo ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Account Preferences</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground py-8">
                Preference settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
