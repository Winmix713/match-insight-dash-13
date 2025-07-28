import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings as SettingsIcon, 
  Key, 
  Mail, 
  Database, 
  Copy, 
  RefreshCw,
  Upload,
  Download,
  Save
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function Settings() {
  const [autotrainInterval, setAutotrainInterval] = useState(24)
  const [confidenceThreshold, setConfidenceThreshold] = useState([75])
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [apiKey, setApiKey] = useState("sk-1234567890abcdef...")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    
    toast({
      title: "Settings saved successfully",
      description: "Your configuration has been updated.",
    })
  }

  const generateNewApiKey = () => {
    const newKey = "sk-" + Math.random().toString(36).substring(2, 18) + "..."
    setApiKey(newKey)
    toast({
      title: "New API key generated",
      description: "Your previous API key has been invalidated.",
    })
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system behavior and preferences
          </p>
        </div>
        
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Configuration */}
        <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="autotrain">Auto-train Interval (hours)</Label>
              <Input
                id="autotrain"
                type="number"
                value={autotrainInterval}
                onChange={(e) => setAutotrainInterval(Number(e.target.value))}
                min={1}
                max={168}
              />
              <p className="text-xs text-muted-foreground">
                How often the model should automatically retrain with new data
              </p>
            </div>

            <div className="space-y-3">
              <Label>Minimum Prediction Confidence: {confidenceThreshold[0]}%</Label>
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                max={100}
                min={50}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                Predictions below this threshold will be marked as low confidence
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <Select defaultValue="random-forest">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random-forest">Random Forest</SelectItem>
                  <SelectItem value="neural-network">Neural Network</SelectItem>
                  <SelectItem value="ensemble">Ensemble</SelectItem>
                  <SelectItem value="logistic">Logistic Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* API & Security */}
        <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  value={apiKey}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={copyApiKey}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateNewApiKey}
                  className="text-destructive hover:text-destructive"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch id="2fa" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="api-logs">API Request Logging</Label>
                  <p className="text-xs text-muted-foreground">
                    Log all API requests for debugging
                  </p>
                </div>
                <Switch id="api-logs" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="training-alerts">Training Completion Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when training finishes
                  </p>
                </div>
                <Switch id="training-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="accuracy-alerts">Low Accuracy Warnings</Label>
                  <p className="text-xs text-muted-foreground">
                    Alert when accuracy drops below threshold
                  </p>
                </div>
                <Switch id="accuracy-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">
                    Summary of performance and insights
                  </p>
                </div>
                <Switch id="weekly-reports" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                disabled={!emailNotifications}
                className={cn(!emailNotifications && "opacity-50")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Export Data</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Download your data in various formats
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Excel
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Import Data</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload historical match data
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-3 h-3 mr-1" />
                  Choose File
                </Button>
              </div>

              <Separator />

              <div>
                <Label>Data Retention</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  How long to keep historical data
                </p>
                <Select defaultValue="1-year">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}