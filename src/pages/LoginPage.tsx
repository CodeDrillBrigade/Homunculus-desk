import {Button, Input, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useLoginMutation} from "../services/auth";
import {setAuthenticationState} from "../store/auth/auth-slice";
import {useAppDispatch} from "../hooks/redux";
import {useNavigate} from "react-router-dom";
import {localStorageJwtKey, localStorageRefreshJwtKey} from "../store/auth/auth-thunk";


export const LoginPage = () => {
    const [username, setUsername] = useState<string|null>(null)
    const [password, setPassword] = useState<string|null>(null)
    const [login, {status,error,data}] = useLoginMutation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

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
            <h1>Login</h1>
            <p>STATUS: {JSON.stringify(status)}</p>
            <p>ERROR: {JSON.stringify(error)}</p>
            <p>DATA: {JSON.stringify(data)}</p>
            <Input placeholder="Username" onChange={onChangeUsername}/>
            <Input type="password" placeholder="Password" onChange={onChangePassword}/>
            <Button onClick={onSubmit}>Login</Button>
        </VStack>
    </>
}

