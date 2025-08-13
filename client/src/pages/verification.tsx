import { useRoute } from "wouter";

interface ProgressIndicatorProps {
  currentStep: number;
}

function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
              step < currentStep 
                ? 'bg-green-500 text-white' 
                : step === currentStep 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? (
                <i className="fas fa-check text-sm"></i>
              ) : (
                step
              )}
            </div>
            {index < 2 && (
              <div className={`w-20 h-1 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Verification() {
  const [match] = useRoute("/step/:stepNumber");
  const stepNumber = parseInt((match as any)?.stepNumber || "1");

  const handleLinkvertiseClick = () => {
    // In a real implementation, this would redirect to actual Linkvertise URLs
    // For demo purposes, we'll simulate the completion
    const currentDomain = window.location.origin;
    
    switch (stepNumber) {
      case 1:
        setTimeout(() => {
          window.location.href = `${currentDomain}/?step=1done`;
        }, 2000);
        break;
      case 2:
        setTimeout(() => {
          window.location.href = `${currentDomain}/?step=2done`;
        }, 2000);
        break;
      case 3:
        setTimeout(() => {
          window.location.href = `${currentDomain}/?step=3done`;
        }, 2000);
        break;
    }
  };

  const getStepContent = () => {
    switch (stepNumber) {
      case 1:
        return {
          icon: "fas fa-link",
          iconColor: "text-primary-500",
          title: "Step 1 of 3: Initial Verification",
          description: "Complete the first verification step to proceed. This helps us ensure secure access to the key generation system.",
          alertType: "blue",
          alertIcon: "fas fa-info-circle",
          alertText: "Complete all verification steps to generate your 24-hour access key. The process is quick and secure.",
          buttonText: "Continue to Linkvertise Step 1"
        };
      case 2:
        return {
          icon: "fas fa-check-circle",
          iconColor: "text-green-500",
          title: "Step 2 of 3: Intermediate Verification",
          description: "Great progress! Complete the second verification step to move closer to your access key.",
          alertType: "green",
          alertIcon: "fas fa-check-circle",
          alertText: "Step 1 Completed! You're doing great. Two more steps to go.",
          buttonText: "Continue to Linkvertise Step 2"
        };
      case 3:
        return {
          icon: "fas fa-key",
          iconColor: "text-amber-500",
          title: "Step 3 of 3: Final Verification",
          description: "Almost there! Complete this final step and your 24-hour access key will be generated automatically.",
          alertType: "amber",
          alertIcon: "fas fa-star",
          alertText: "Final Step! Your access key will be generated immediately after completion.",
          buttonText: "Complete Final Step & Generate Key"
        };
      default:
        return {
          icon: "fas fa-link",
          iconColor: "text-primary-500",
          title: "Step 1 of 3: Initial Verification",
          description: "Complete the first verification step to proceed.",
          alertType: "blue",
          alertIcon: "fas fa-info-circle",
          alertText: "Complete all verification steps to generate your access key.",
          buttonText: "Continue to Linkvertise Step 1"
        };
    }
  };

  const content = getStepContent();

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
          <ProgressIndicator currentStep={stepNumber} />

          <div className="text-center">
            <i className={`${content.icon} ${content.iconColor} text-4xl mb-4`}></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {content.description}
            </p>
            
            <div className={`bg-${content.alertType}-50 border border-${content.alertType}-200 rounded-lg p-4 mb-6`}>
              <div className="flex items-start">
                <i className={`${content.alertIcon} text-${content.alertType}-500 mt-0.5 mr-2`}></i>
                <div className={`text-sm text-${content.alertType}-700`}>
                  <strong>{stepNumber === 1 ? "Important:" : stepNumber === 2 ? "Step 1 Completed!" : "Final Step!"}</strong> {content.alertText}
                </div>
              </div>
            </div>

            <button 
              onClick={handleLinkvertiseClick}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
            >
              <i className="fas fa-external-link-alt mr-2"></i>
              {content.buttonText}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
