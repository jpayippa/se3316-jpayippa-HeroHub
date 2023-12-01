import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/Navbar';


export default function Layout(){
    return (
        <>
        <NavBar loggedin = {true}/>
        <Outlet />
        </>
     );
}