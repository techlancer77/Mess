import { useAuth} from "../../context/context_rout"

export const Home =()=>{
    const{isAuthenticated,setIsAuthenticated} = useAuth();
    const onlogClick=()=>{
        setIsAuthenticated(!isAuthenticated);
    }
    return (
        <>This is Home
        <button onClick={onlogClick}>Logout</button>
        </>
    );
}