import {AbsoluteCenter, Grid, GridItem} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import "./home.css"
import {DarkMode} from "../../components/ui/DarkMode";

export const HomePage = () =>
{
    const navigate = useNavigate()
    const goto = (page:string) => navigate(`/${page}`)

    const pages = ["search", "material", "storage"]
    const h = 20
    return <>
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem w='100%' h={h} bg='blue.500' onClick={() => {goto(pages[0])}}>
                <AbsoluteCenter>
                    <p>
                        {pages[0].substring(0,1).toUpperCase().concat(pages[0].substring(1))}
                    </p>
                </AbsoluteCenter>
            </GridItem>
            <GridItem w='100%' h={h} bg='blue.500' onClick={() => {goto(pages[1])}}>
                <p>
                    {pages[1].substring(0, 1).toUpperCase().concat(pages[1].substring(1))}
                </p>
            </GridItem>
            <GridItem w='100%' h={h} bg='blue.500' onClick={() => {goto(pages[2])}}>
                <p>
                    {pages[2].substring(0,1).toUpperCase().concat(pages[2].substring(1))}
                </p>
            </GridItem>
        </Grid>
        <DarkMode/>
    </>
}