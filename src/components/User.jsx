import styles from "./User.module.css";
import {useAuth} from "../context/fakeAuthContext"
import {useNavigate} from "react-router-dom";

function User() 
{
  const{ user, Logout } = useAuth();
  const navigate = useNavigate();

  function handleClick() 
  {
    Logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;