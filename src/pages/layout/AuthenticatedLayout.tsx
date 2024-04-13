import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {useEffect} from "react";
import {jwtSelector} from "../../store/auth/auth-slice";
import {getToken} from "../../store/auth/auth-thunk";
import TopMenu from "../../components/ui/TopMenu";

export const AuthenticatedLayout = () => {
    const dispatch = useAppDispatch()
    dispatch(getToken())
    const jwt = useAppSelector(jwtSelector);
    const navigate = useNavigate();
    const { pathname } = useLocation()

    useEffect(() => {
        if(!jwt && pathname !== "login") {
            navigate("/login");
        }
    }, [jwt, navigate, pathname]);
    return <>
        <TopMenu />
        <Outlet />
    </>
}