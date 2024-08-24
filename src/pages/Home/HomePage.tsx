import {Center, Grid, GridItem} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import "./home.css"
import Search from "../Search";
import CameraComponent from "../../components/ui/CameraComponent";

export const HomePage = () =>
{
    const navigate = useNavigate()
    const goto = (page:string) => navigate(`/${page}`)

    const pages = ["material", "storage", "box", "role"]
    const h = 20
    const w= "100%"
    const br = "lg";
    return <>
        <Grid templateColumns='repeat(3, 2fr)' gap={6} p={2}>
            {pages.map(page =>
                <GridItem ml={2} w={w} h={h} bg='blue.500' onClick={() => {goto(page)}} borderRadius={br}>
                    <Center h={h}>
                        <p>
                            {page.substring(0,1).toUpperCase().concat(page.substring(1))}
                        </p>
                    </Center>
                </GridItem>
            )}

            <GridItem mr={2} w={w} h={h} bg='blue.500' borderRadius={br}>
              <Center h={h}>
                <Search />
              </Center>
            </GridItem>
        </Grid>

    </>
}