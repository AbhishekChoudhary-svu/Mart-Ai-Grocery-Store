import { useState, useEffect, useContext } from "react"
import { AlertCircle, CheckCircle2, Mail } from "lucide-react"
import { postData } from "../../utils/api"
import { useNavigate } from "react-router-dom"
import { MyContext } from "../../App"

const EmailVerification = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("") 
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [resendDisabled, setResendDisabled] = useState(true)

  useEffect(() => {
    let timer

    if (resendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setResendDisabled(false)
    }

    return () => clearInterval(timer)
  }, [resendDisabled, resendTimer])

  const history = useNavigate()
  const context = useContext(MyContext)

  const OTPsubmit = async (e) => {
    e.preventDefault();

    const actionType = localStorage.getItem("actionType");

    if (actionType !== "forget-password") {
      postData("/api/user/verifyEmail", {
        email: localStorage.getItem("userEmail"),
        otp: code,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          localStorage.removeItem("userEmail");
          history("/login");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });

      if (!code || code.length !== 6) {
        context.openAlertBox("error", "Please enter a valid 6-digit code.");
        return false;
      }
    } else {
      postData("/api/user/verify-forget-password-otp", {
        email: localStorage.getItem("userEmail"),
        otp: code,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          localStorage.removeItem("actionType");
          history("/reset-password");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });

      if (!code || code.length !== 6) {
        context.openAlertBox("error", "Please enter a valid 6-digit code.");
        return false;
      }
    }
  };

  const handleResend = async () => {
    setError("")
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setResendTimer(60)
      setResendDisabled(true)
    } catch {
      setError("Failed to resend verification code.")
    }
  }

  return (
    <main className=" py-6 min-h-screen  bg-[#f1f1f1d3] flex items-center justify-center container">
      <div className="w-full max-w-md mx-auto mt-2 p-7 bg-white rounded-lg shadow-lg border border-gray-200">
         <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="bg-green-100 p-3 rounded-full">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Verify Your Email</h3>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to <span className="font-bold">{localStorage.getItem("userEmail")}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 text-sm rounded-md text-red-800">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 text-sm rounded-md text-green-800">
          <CheckCircle2 className="w-4 h-4" />
          <span>Email verified successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={OTPsubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none border-gray-300"
            placeholder="Enter 6-digit code"
            disabled={isLoading || success}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md shadow disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          {resendDisabled ? `Resend code in ${resendTimer}s` : "Resend verification code"}
        </button>
      </div>
    </div>
      </div>
    </main>
  )
}

export default EmailVerification
