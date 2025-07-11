import { useContext, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ShoppingBasket,ArrowLeft } from "lucide-react";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate,Link } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";


const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

const Register = () => {  

  const context = useContext(MyContext);
  const history = useNavigate()

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });
const onChangeInput =(e)=>{
  const {name,value}= e.target;
  setFormFields(()=>{
   return {
    ...formFields,
    [name]: value
   }

  })
}

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validateValue =Object.values(formFields).every(el=> el)

  const handleSubmit = (e) => {
  
    e.preventDefault()
    setIsLoading(true);
    // Validation
    if (formFields.name==="" || formFields.email==="" || formFields.password==="") {
      
     context.openAlertBox( "error","All fields are required");
      //setError("All fields are required");
      return false;
    }

    if (formFields.password.length < 8) {
      //setError("Password must be at least 8 characters");
      context.openAlertBox( "error","Password must be at least 8 characters");
      return false;
    }

    if (!/[A-Za-z]/.test(formFields.password) || !/[0-9]/.test(formFields.password)) {
     // setError("Password must contain both letters and numbers");
      context.openAlertBox( "error","Password must contain both letters and numbers");

      return false;
    }

     postData("/api/user/register",formFields).then((res)=>{

      if(res?.error!==true){
        setIsLoading(false);
        context.openAlertBox("success", res?.message)
        localStorage.setItem("userEmail",formFields.email)
      setFormFields({
        name:"",
        email:"",
        password:""
      })
      history("/email-verify")
      }else{
        context.openAlertBox("error", res?.message)
        setIsLoading(false);
      }

      
     }
    )
    
  };

  const handleGoogleSignUp = () => {
   signInWithPopup(auth, googleProvider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    const field ={
      name: user.providerData[0].displayName,
      email: user.providerData[0].email,
      password: null,
      avatar: user.providerData[0].photoURL,
      mobile: user.providerData[0].phoneNumber,
      role:"user"
    }
      postData("/api/user/authWithGoogle",field).then((res)=>{

      if(res?.error!==true){
        setIsLoading(false);
        context.openAlertBox("success", res?.message)
       localStorage.setItem("accessToken", res?.data?.accessToken);
          localStorage.setItem("refreshToken", res?.data?.refreshToken);

          context.setIsLogin(true);
      history("/")
      }else{
        context.openAlertBox("error", res?.message)
        setIsLoading(false);
      }

      
     }
    )
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  };

  return (
    <main className="  min-h-screen bg-[#f1f1f1d3] flex items-center justify-center container">
      <div className="w-full max-w-md mx-auto p-10 pt-8  bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 pt-0  text-center border-b border-gray-100">
          <div className=" p-3 pt-0 w-fit mx-auto ">
            <img src="./logo-transparent.png" alt="" className="" />
          </div>
        </div>
        <div className="space-y-4">
          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium">Sign up with Google</span>
          </button>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              id="name"
              name="name"
              type="text"
              value={formFields.name}
            

              placeholder="John Doe"
              onChange={onChangeInput}
            />
            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              onChange={onChangeInput}
              value={formFields.email}
            
              
           
              placeholder="you@example.com"
            />
            <InputField
              label="Password"
              id="password"
              name="password"
              value={formFields.password}
              type="password"
              placeholder="••••••••"
              onChange={onChangeInput}
        
              

            />

            <div className="space-y-1 text-sm">
              <PasswordHint text="At least 8 characters" />
              <PasswordHint text="Contains letters and numbers" />
            </div>

            <button
              type="submit"
              disabled={!validateValue}
              className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading=== true ?  <CircularProgress color="inherit" /> : "Create account"}
            </button>
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="flex justify-center items-center text-sm text-gray-600 hover:text-gray-900 hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
function InputField({ label, id, type,name,value,onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
    </div>
  );
}

// Password hint item
function PasswordHint({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}

export default Register;
