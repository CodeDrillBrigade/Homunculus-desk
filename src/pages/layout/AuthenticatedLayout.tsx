import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {useEffect} from "react";
import {jwtSelector} from "../../store/auth/auth-slice";
import {getToken} from "../../store/auth/auth-thunk";
import {DarkMode} from "../../components/ui/DarkMode";
import {Box} from "@chakra-ui/react";

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
        <Box marginTop={2} marginBottom={10}>
          <DarkMode/>
        </Box>
        <Outlet />
    </>
}