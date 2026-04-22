"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Shield, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  Save,
  AlertTriangle
} from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  investmentUpdates: boolean;
  newOpportunities: boolean;
  portfolioAlerts: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
}

export default function InvestorSettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    investmentUpdates: true,
    newOpportunities: false,
    portfolioAlerts: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSecurityChange = (setting: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsSaving(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success toast
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <Card className="p-4 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === "notifications" && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">General Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Button
                        variant={notifications.emailNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('emailNotifications')}
                      >
                        {notifications.emailNotifications ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Button
                        variant={notifications.pushNotifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('pushNotifications')}
                      >
                        {notifications.pushNotifications ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">Summary of your portfolio performance</p>
                      </div>
                      <Button
                        variant={notifications.weeklyDigest ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('weeklyDigest')}
                      >
                        {notifications.weeklyDigest ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Investment Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Investment Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates from your portfolio companies</p>
                      </div>
                      <Button
                        variant={notifications.investmentUpdates ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('investmentUpdates')}
                      >
                        {notifications.investmentUpdates ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">New Opportunities</Label>
                        <p className="text-sm text-muted-foreground">Notifications about new investment opportunities</p>
                      </div>
                      <Button
                        variant={notifications.newOpportunities ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('newOpportunities')}
                      >
                        {notifications.newOpportunities ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Portfolio Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important alerts about your investments</p>
                      </div>
                      <Button
                        variant={notifications.portfolioAlerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange('portfolioAlerts')}
                      >
                        {notifications.portfolioAlerts ? <Check className="h-4 w-4" /> : "Off"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Security Settings */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {security.twoFactorEnabled && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Enabled
                        </Badge>
                      )}
                      <Button
                        variant={security.twoFactorEnabled ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleSecurityChange('twoFactorEnabled', !security.twoFactorEnabled)}
                      >
                        {security.twoFactorEnabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Button
                      variant={security.loginAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSecurityChange('loginAlerts', !security.loginAlerts)}
                    >
                      {security.loginAlerts ? <Check className="h-4 w-4" /> : "Off"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Session Timeout (minutes)</Label>
                    <Select 
                      value={security.sessionTimeout.toString()} 
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', Number(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Change Password */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword || isSaving}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "privacy" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Profile Visibility</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Public Profile</Label>
                      <p className="text-sm text-muted-foreground mb-2">Make your profile visible to other users</p>
                      <Select defaultValue="public">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="investors-only">Investors Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-medium">Investment Activity</Label>
                      <p className="text-sm text-muted-foreground mb-2">Show your investment activity to other users</p>
                      <Select defaultValue="limited">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Data & Analytics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">Receive marketing emails and updates</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Off
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Billing & Subscription</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-accent/30 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Current Plan: Free</h3>
                  <p className="text-sm text-muted-foreground">
                    You're currently on our free plan with basic investment tracking features.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Upgrade Options</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Pro Plan</h4>
                      <p className="text-2xl font-bold text-foreground mb-2">$29<span className="text-sm text-muted-foreground">/month</span></p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Advanced analytics</li>
                        <li>• Priority support</li>
                        <li>• Custom reports</li>
                        <li>• Early access to features</li>
                      </ul>
                      <Button className="w-full">Upgrade to Pro</Button>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Enterprise Plan</h4>
                      <p className="text-2xl font-bold text-foreground mb-2">$99<span className="text-sm text-muted-foreground">/month</span></p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Everything in Pro</li>
                        <li>• API access</li>
                        <li>• White-label options</li>
                        <li>• Dedicated support</li>
                      </ul>
                      <Button className="w-full" variant="outline">Contact Sales</Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-start space-x-3 p-4 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h3 className="font-medium text-destructive mb-1">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete your account and all associated data.
                      </p>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}