import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GeneratedKey {
  key: string;
  expiresAt: number;
  createdAt: number;
}

export default function Success() {
  const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { toast } = useToast();

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-key");
      return response.json();
    },
    onSuccess: (data: GeneratedKey) => {
      setGeneratedKey(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate access key. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Generate key on component mount
    generateKeyMutation.mutate();
  }, []);

  useEffect(() => {
    if (!generatedKey) return;

    const updateTimeRemaining = () => {
      const now = Date.now();
      const remaining = generatedKey.expiresAt - now;
      
      if (remaining <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours} hours, ${minutes} minutes`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [generatedKey]);

  const copyKey = async () => {
    if (!generatedKey) return;
    
    try {
      await navigator.clipboard.writeText(generatedKey.key);
      toast({
        title: "Copied!",
        description: "Access key copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy key to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatExpirationTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (generateKeyMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your access key...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="fas fa-key text-primary-500 text-2xl mr-3"></i>
              <h1 className="text-xl font-semibold text-gray-900">SecureKey System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <i className="fas fa-shield-alt mr-1"></i>
                24-Hour Access Keys
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full font-medium">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  {index < 2 && <div className="w-20 h-1 bg-green-500 mx-2"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-key text-green-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Key Generated!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your 24-hour access key has been successfully generated. Copy it now and use it in your Roblox script.
            </p>
            
            {generatedKey && (
              <>
                {/* Key Display */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Access Key:</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={generatedKey.key} 
                      readOnly 
                      className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-center font-mono text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button 
                      onClick={copyKey}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>

                {/* Expiration Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <i className="fas fa-clock text-blue-500 mt-0.5 mr-2"></i>
                    <div className="text-sm text-blue-700">
                      <strong>Expires:</strong> {formatExpirationTime(generatedKey.expiresAt)}<br />
                      <strong>Time Remaining:</strong> {timeRemaining}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={copyKey}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy Access Key
                  </button>
                  <p className="text-sm text-gray-500">Keep this key secure and use it in your Roblox script within 24 hours.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* API Documentation Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* API Verification */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-code text-primary-500 text-xl mr-3"></i>
              <h3 className="text-lg font-semibold text-gray-900">API Verification</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Test key verification endpoint</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Key:</label>
                <input 
                  type="text" 
                  placeholder="Enter key to verify" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
                Verify Key
              </button>
              
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">API Response:</div>
                <code className="text-xs text-gray-700">{`{ "status": "valid" }`}</code>
              </div>
            </div>
          </div>

          {/* Roblox Integration */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-gamepad text-primary-500 text-xl mr-3"></i>
              <h3 className="text-lg font-semibold text-gray-900">Roblox Integration</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Key validation status in-game</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  <span className="text-sm text-green-700 font-medium">Key Valid</span>
                </div>
                <span className="text-xs text-green-600">Connected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <i className="fas fa-times-circle text-red-500 mr-2"></i>
                  <span className="text-sm text-red-700 font-medium">Key Expired</span>
                </div>
                <span className="text-xs text-red-600">Disconnected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  <span className="text-sm text-yellow-700 font-medium">Key Invalid</span>
                </div>
                <span className="text-xs text-yellow-600">Error</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <i className="fas fa-server text-primary-500 text-xl mr-3"></i>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-database text-blue-600"></i>
              </div>
              <h4 className="font-medium text-gray-900">Database</h4>
              <p className="text-sm text-green-600">Online</p>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-cloud text-green-600"></i>
              </div>
              <h4 className="font-medium text-gray-900">API Server</h4>
              <p className="text-sm text-green-600">Online</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-shield-alt text-purple-600"></i>
              </div>
              <h4 className="font-medium text-gray-900">Security</h4>
              <p className="text-sm text-green-600">Protected</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <i className="fas fa-key text-primary-500 text-xl mr-2"></i>
              <span className="text-gray-600 text-sm">SecureKey System - 24-Hour Access Management</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <i className="fas fa-code mr-1"></i>
                <span>API Ready</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-gamepad mr-1"></i>
                <span>Roblox Compatible</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock mr-1"></i>
                <span>24h Expiration</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
