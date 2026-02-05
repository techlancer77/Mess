import "./login.css";
import loginBg from "../../assets/login-bg.jpg";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import { useAuth} from "../../context/context_rout"
import { useNavigate } from "react-router-dom";   


const Login = () => {
  const{isAuthenticated,setIsAuthenticated} = useAuth();
    const onlogClick=()=>{
        setIsAuthenticated(!isAuthenticated);
    }
    
  const navigate = useNavigate();
  return (
    <div className="login-wrapper">
      {/* LEFT IMAGE SECTION */}
      <div
  className="login-left"
  style={{ backgroundImage: `url(${loginBg})` }}
>

        <div className="welcome-box">
          <h1>
            WELCOME <span>TO</span>
          </h1>
          <p>
            Your daily meals, made simpler.
            <br />
            Discover verified messes, view menus,
            <br />
            read real reviews, and choose
            <br />
            convenience.
          </p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="login-right">
        <div className="login-card">
          <h2>
            LOG IN TO YOUR MESS
            
        
          </h2>

          <p className="sub-text">
            Access saved messes, reviews, and
            <br />
            personalized recommendations
          </p>

          <div className="input-box">
  <FaUser className="input-icon" />
  <input type="email" placeholder="ENTER EMAIL" />
</div>


          <div className="input-box">
  <FaLock className="input-icon" />
  <input type="password" placeholder="********" />
  <FaEye className="eye-icon" />
</div>


          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button className="login-btn" onClick={onlogClick} >LOGIN</button>

<p
            className="bottom-text"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/owner")}
          >
            DON'T HAVE ANY ACCOUNT?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
