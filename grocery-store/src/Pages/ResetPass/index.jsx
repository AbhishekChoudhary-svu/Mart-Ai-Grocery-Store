import { useContext, useState } from "react"
import { AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MyContext } from "../../App"
import { postData } from "../../utils/api"
import CircularProgress from "@mui/material/CircularProgress";

const ResetPass = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

   const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    email:localStorage.getItem("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
  const validateValue = Object.values(formFields).every((el) => el);


  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8
    const hasLetter = /[a-zA-Z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)

    return {
      minLength,
      hasLetter,
      hasNumber,
      isValid: minLength && hasLetter && hasNumber,
    }
  }

  const passwordValidation = validatePassword(formFields.newPassword)

  const resetPassWordSubmit = async (e) => {
    e.preventDefault()
      setIsLoading(true);
    

    if (!formFields.newPassword || !formFields.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formFields.newPassword !== formFields.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements")
      return
    }
     postData("/api/user/reset-password", formFields).then(
          (res) => {
            if (res?.error === false) {
              setIsLoading(false);
              context.openAlertBox("success", res?.message);
              setFormFields({
                email: localStorage.removeItem("userEmail"),
                newPassword: "",
                confirmPassword: "",
              });
              history("/login");  
            } else {
              context.openAlertBox("error", res?.message);
              setIsLoading(false);
            }
          }
        );
   
  }

  return (
     <main className="min-h-screen py-10  bg-[#f1f1f1d3] flex items-center justify-center container">
       <div className="w-full max-w-md mx-auto mt-2 p-7 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="bg-green-50 p-3 rounded-full">
          <Lock className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Create new password</h3>
        <p className="text-sm text-gray-600">Enter your new password below</p>
      </div>

      <form onSubmit={resetPassWordSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">Password reset successfully! Redirecting to login...</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              name="newPassword"
              value={formFields.newPassword}
              onChange={onChangeInput}
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              name="confirmPassword"
              value={formFields.confirmPassword}
              onChange={onChangeInput}
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {formFields.newPassword && (
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-700">Password requirements:</p>
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${passwordValidation.minLength ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidation.hasLetter ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>Contains letters</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>Contains numbers</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!validateValue}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
         {isLoading === true ? (
                         <CircularProgress color="inherit" />
                       ) : (
                         "Reset Password"
                       )}
        </button>
      </form>
    </div>
       </div>
    </main>
  )
}

export default ResetPass
