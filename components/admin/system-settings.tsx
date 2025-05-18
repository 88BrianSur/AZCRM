"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSuccess } from "@/components/form-success"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getSystemSettings, updateSystemSettings } from "@/app/actions/admin-actions"
import { useToast } from "@/hooks/use-toast"

export function SystemSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Settings state
  const [settings, setSettings] = useState({
    // Organization settings
    orgName: "AZ House Recovery Center",
    orgEmail: "info@azhouse.org",
    orgPhone: "(555) 123-4567",
    orgWebsite: "https://www.azhouse.org",
    orgAddress: "123 Recovery Lane, Phoenix, AZ 85001",
    timezone: "America/Phoenix",

    // System preferences
    darkMode: false,
    autoLogout: true,
    maintenanceMode: false,
    inactivityTimeout: "30",

    // Security settings
    passwordPolicy: "strong",
    twoFactorAuth: true,
    ipRestriction: false,
    sessionTimeout: true,
    allowedIPs: "",

    // Notification settings
    emailNewClient: true,
    emailAppointment: true,
    emailNote: true,
    emailAlert: true,
    smsAppointment: true,
    smsUrgent: true,
    notificationEmail: "notifications@azhouse.org",

    // Integration settings
    emailIntegration: true,
    smsIntegration: true,
    calendarIntegration: false,
    paymentIntegration: false,
    sendgridKey: "••••••••••••••••••••••••••••••",
    twilioKey: "••••••••••••••••••••••••••••••",
    googleKey: "",
    stripeKey: "",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSystemSettings()

      // Merge the loaded settings with defaults
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...data,
        // Convert string boolean values to actual booleans
        darkMode: data.darkMode === "true",
        autoLogout: data.autoLogout === "true",
        maintenanceMode: data.maintenanceMode === "true",
        twoFactorAuth: data.twoFactorAuth === "true",
        ipRestriction: data.ipRestriction === "true",
        sessionTimeout: data.sessionTimeout === "true",
        emailNewClient: data.emailNewClient === "true",
        emailAppointment: data.emailAppointment === "true",
        emailNote: data.emailNote === "true",
        emailAlert: data.emailAlert === "true",
        smsAppointment: data.smsAppointment === "true",
        smsUrgent: data.smsUrgent === "true",
        emailIntegration: data.emailIntegration === "true",
        smsIntegration: data.smsIntegration === "true",
        calendarIntegration: data.calendarIntegration === "true",
        paymentIntegration: data.paymentIntegration === "true",
      }))
    } catch (err) {
      console.error("Failed to load settings:", err)
      setError("Failed to load settings. Using default values.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (tab: string) => {
    setIsSubmitting(true)
    setSuccess(null)
    setError(null)

    try {
      const formData = new FormData()

      // Add settings based on the current tab
      if (tab === "general") {
        formData.append("setting_orgName", settings.orgName)
        formData.append("setting_orgEmail", settings.orgEmail)
        formData.append("setting_orgPhone", settings.orgPhone)
        formData.append("setting_orgWebsite", settings.orgWebsite)
        formData.append("setting_orgAddress", settings.orgAddress)
        formData.append("setting_timezone", settings.timezone)
        formData.append("setting_darkMode", String(settings.darkMode))
        formData.append("setting_autoLogout", String(settings.autoLogout))
        formData.append("setting_maintenanceMode", String(settings.maintenanceMode))
        formData.append("setting_inactivityTimeout", settings.inactivityTimeout)
      } else if (tab === "security") {
        formData.append("setting_passwordPolicy", settings.passwordPolicy)
        formData.append("setting_twoFactorAuth", String(settings.twoFactorAuth))
        formData.append("setting_ipRestriction", String(settings.ipRestriction))
        formData.append("setting_sessionTimeout", String(settings.sessionTimeout))
        formData.append("setting_allowedIPs", settings.allowedIPs)
      } else if (tab === "notifications") {
        formData.append("setting_emailNewClient", String(settings.emailNewClient))
        formData.append("setting_emailAppointment", String(settings.emailAppointment))
        formData.append("setting_emailNote", String(settings.emailNote))
        formData.append("setting_emailAlert", String(settings.emailAlert))
        formData.append("setting_smsAppointment", String(settings.smsAppointment))
        formData.append("setting_smsUrgent", String(settings.smsUrgent))
        formData.append("setting_notificationEmail", settings.notificationEmail)
      } else if (tab === "integrations") {
        formData.append("setting_emailIntegration", String(settings.emailIntegration))
        formData.append("setting_smsIntegration", String(settings.smsIntegration))
        formData.append("setting_calendarIntegration", String(settings.calendarIntegration))
        formData.append("setting_paymentIntegration", String(settings.paymentIntegration))

        // Only update API keys if they've been changed (not still masked)
        if (!settings.sendgridKey.includes("•")) {
          formData.append("setting_sendgridKey", settings.sendgridKey)
        }
        if (!settings.twilioKey.includes("•")) {
          formData.append("setting_twilioKey", settings.twilioKey)
        }
        if (settings.googleKey) {
          formData.append("setting_googleKey", settings.googleKey)
        }
        if (settings.stripeKey) {
          formData.append("setting_stripeKey", settings.stripeKey)
        }
      }

      await updateSystemSettings(formData)

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })

      setSuccess("Settings saved successfully!")
    } catch (err) {
      console.error("Failed to save settings:", err)
      setError(err.message || "Failed to save settings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>Manage your organization information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={settings.orgName}
                  onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgEmail">Organization Email</Label>
                <Input
                  id="orgEmail"
                  type="email"
                  value={settings.orgEmail}
                  onChange={(e) => setSettings({ ...settings, orgEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgPhone">Organization Phone</Label>
                <Input
                  id="orgPhone"
                  value={settings.orgPhone}
                  onChange={(e) => setSettings({ ...settings, orgPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgWebsite">Website</Label>
                <Input
                  id="orgWebsite"
                  value={settings.orgWebsite}
                  onChange={(e) => setSettings({ ...settings, orgWebsite: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgAddress">Address</Label>
              <Textarea
                id="orgAddress"
                value={settings.orgAddress}
                onChange={(e) => setSettings({ ...settings, orgAddress: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Phoenix">America/Phoenix (MST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</SelectItem>
                  <SelectItem value="America/Denver">America/Denver (MST/MDT)</SelectItem>
                  <SelectItem value="America/Chicago">America/Chicago (CST/CDT)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure system-wide preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark mode for all users</p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoLogout">Auto Logout</Label>
                <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
              </div>
              <Switch
                id="autoLogout"
                checked={settings.autoLogout}
                onCheckedChange={(checked) => setSettings({ ...settings, autoLogout: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="inactivityTimeout">Inactivity Timeout (minutes)</Label>
              <Input
                id="inactivityTimeout"
                type="number"
                value={settings.inactivityTimeout}
                onChange={(e) => setSettings({ ...settings, inactivityTimeout: e.target.value })}
                min="5"
                max="120"
              />
            </div>

            {success && <FormSuccess message={success} />}

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings("general")} disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select
                value={settings.passwordPolicy}
                onValueChange={(value) => setSettings({ ...settings, passwordPolicy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select password policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="medium">Medium (8+ chars, mixed case, numbers)</SelectItem>
                  <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                  <SelectItem value="custom">Custom Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ipRestriction">IP Restriction</Label>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  id="ipRestriction"
                  checked={settings.ipRestriction}
                  onCheckedChange={(checked) => setSettings({ ...settings, ipRestriction: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatically end user sessions after inactivity</p>
                </div>
                <Switch
                  id="sessionTimeout"
                  checked={settings.sessionTimeout}
                  onCheckedChange={(checked) => setSettings({ ...settings, sessionTimeout: checked })}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="allowedIPs">Allowed IP Addresses (one per line)</Label>
              <Textarea
                id="allowedIPs"
                placeholder="192.168.1.1&#10;10.0.0.1"
                className="h-24"
                value={settings.allowedIPs}
                onChange={(e) => setSettings({ ...settings, allowedIPs: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Leave blank to allow all IP addresses</p>
            </div>

            {success && <FormSuccess message={success} />}

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings("security")} disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNewClient">New Client Registration</Label>
                  <Switch
                    id="emailNewClient"
                    checked={settings.emailNewClient}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNewClient: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAppointment">Appointment Reminders</Label>
                  <Switch
                    id="emailAppointment"
                    checked={settings.emailAppointment}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailAppointment: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNote">New Progress Notes</Label>
                  <Switch
                    id="emailNote"
                    checked={settings.emailNote}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNote: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAlert">System Alerts</Label>
                  <Switch
                    id="emailAlert"
                    checked={settings.emailAlert}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailAlert: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-medium">SMS Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsAppointment">Appointment Reminders</Label>
                  <Switch
                    id="smsAppointment"
                    checked={settings.smsAppointment}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsAppointment: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsUrgent">Urgent Alerts</Label>
                  <Switch
                    id="smsUrgent"
                    checked={settings.smsUrgent}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsUrgent: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="notificationEmail">Notification Email Address</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">System notifications will be sent to this email</p>
            </div>

            {success && <FormSuccess message={success} />}

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings("notifications")} disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Integrations</CardTitle>
            <CardDescription>Configure third-party integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Service</h3>
                  <p className="text-sm text-muted-foreground">SendGrid Email API</p>
                </div>
                <Switch
                  id="emailIntegration"
                  checked={settings.emailIntegration}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailIntegration: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">SMS Service</h3>
                  <p className="text-sm text-muted-foreground">Twilio SMS API</p>
                </div>
                <Switch
                  id="smsIntegration"
                  checked={settings.smsIntegration}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsIntegration: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Calendar Integration</h3>
                  <p className="text-sm text-muted-foreground">Google Calendar API</p>
                </div>
                <Switch
                  id="calendarIntegration"
                  checked={settings.calendarIntegration}
                  onCheckedChange={(checked) => setSettings({ ...settings, calendarIntegration: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Payment Processing</h3>
                  <p className="text-sm text-muted-foreground">Stripe Payment API</p>
                </div>
                <Switch
                  id="paymentIntegration"
                  checked={settings.paymentIntegration}
                  onCheckedChange={(checked) => setSettings({ ...settings, paymentIntegration: checked })}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="apiKeys">API Keys</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sendgridKey" className="text-xs">
                    SendGrid API Key
                  </Label>
                  <Input
                    id="sendgridKey"
                    type="password"
                    value={settings.sendgridKey}
                    onChange={(e) => setSettings({ ...settings, sendgridKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twilioKey" className="text-xs">
                    Twilio API Key
                  </Label>
                  <Input
                    id="twilioKey"
                    type="password"
                    value={settings.twilioKey}
                    onChange={(e) => setSettings({ ...settings, twilioKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleKey" className="text-xs">
                    Google Calendar API Key
                  </Label>
                  <Input
                    id="googleKey"
                    type="password"
                    value={settings.googleKey}
                    onChange={(e) => setSettings({ ...settings, googleKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeKey" className="text-xs">
                    Stripe API Key
                  </Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    value={settings.stripeKey}
                    onChange={(e) => setSettings({ ...settings, stripeKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
              </div>
            </div>

            {success && <FormSuccess message={success} />}

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings("integrations")} disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
