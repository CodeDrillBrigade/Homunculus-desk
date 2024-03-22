import {Center, Grid, GridItem} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import "./home.css"
import NavBar from "../../components/ui/NavBar";

export const HomePage = () =>
{
    const navigate = useNavigate()
    const goto = (page:string) => navigate(`/${page}`)

    const pages = ["material", "storage", "search"]
    const h = 20
    const w= "100%"
    return <>
      <NavBar />
        <Grid templateColumns='repeat(3, 1fr)' gap={6} p={2}>
            <GridItem w={w} h={h} bg='blue.500' onClick={() => {goto(pages[0])}} borderRadius={"md"}>
                <Center>
                <p>
                  {pages[0].substring(0,1).toUpperCase().concat(pages[0].substring(1))}
                </p>
              </Center>
            </GridItem>
            <GridItem w={w} h={h} bg='blue.500' onClick={() => {goto(pages[1])}} borderRadius={"md"}>
              <Center>
                <p>
                  {pages[1].substring(0, 1).toUpperCase().concat(pages[1].substring(1))}
                </p>
              </Center>
            </GridItem>
            <GridItem w={w} h={h} bg='blue.500' onClick={() => {goto(pages[2])}} borderRadius={"md"}>
              <Center>
                <p>
                  {pages[2].substring(0,1).toUpperCase().concat(pages[2].substring(1))}
                </p>
              </Center>
            </GridItem>
        </Grid>
    </>
}