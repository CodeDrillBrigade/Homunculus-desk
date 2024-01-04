import {Button, Heading, Input, Spinner, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useLoginMutation} from "../services/auth";
import {jwtSelector, setAuthenticationState} from "../store/auth/auth-slice";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {useNavigate} from "react-router-dom";
import {getToken, localStorageJwtKey, localStorageRefreshJwtKey} from "../store/auth/auth-thunk";
import {QueryStatus} from "@reduxjs/toolkit/query";


export const LoginPage = () => {
    const [username, setUsername] = useState<string|null>(null)
    const [password, setPassword] = useState<string|null>(null)
    const [login, {status,error,data}] = useLoginMutation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    dispatch(getToken())
    const jwt = useAppSelector(jwtSelector);

    const onChangeUsername = (event:React.FormEvent<HTMLInputElement>) =>
    {
        setUsername(event.currentTarget.value)
        // console.log(event.currentTarget.value)
    }
    const onChangePassword = (event:React.FormEvent<HTMLInputElement>) =>
    {
        setPassword(event.currentTarget.value)
    }

    const onSubmit = () =>
    {
        if (!!username && !!password)
        {
            const data = {username, password}
            login(data)
        }
    }

    useEffect(() => {
        if(!!jwt) {
            navigate("/")
        }
    }, [jwt, navigate]);

    useEffect(()=>
    {
        if (!!data)
        {
            dispatch(setAuthenticationState(data))
            localStorage.setItem(localStorageJwtKey, data.jwt)
            localStorage.setItem(localStorageRefreshJwtKey, data.refreshJwt)
            navigate("/")
        }
    },[data, dispatch,navigate])

    return <>
        <VStack padding={"0 25vw"}>
            <Heading size="lg">Login</Heading>
            <Input placeholder="Username" onChange={onChangeUsername}/>
            <Input type="password" placeholder="Password" onChange={onChangePassword}/>
            <Button
                onClick={onSubmit}
                isLoading={status === QueryStatus.pending}
                loadingText='Login'
            >Login</Button>
        </VStack>
    </>
}

