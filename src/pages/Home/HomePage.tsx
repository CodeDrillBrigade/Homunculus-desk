import {Center, Grid, GridItem, Spacer, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import "./home.css"
import Header from "../../components/ui/Header";
import Search from "../Search";

export const HomePage = () =>
{
    const navigate = useNavigate()
    const goto = (page:string) => navigate(`/${page}`)

    const pages = ["material", "storage", "search"]
    const h = 20
    const w= "100%"
    const br = "lg";
    return <>
      <Header />
        <Grid templateColumns='repeat(3, 1fr)' gap={6} p={2}>
            <GridItem ml={2} w={w} h={h} bg='blue.500' onClick={() => {goto(pages[0])}} borderRadius={br}>
                <Center h={h}>
                <p>
                  {pages[0].substring(0,1).toUpperCase().concat(pages[0].substring(1))}
                </p>
              </Center>
            </GridItem>

            <GridItem w={w} h={h} bg='blue.500' onClick={() => {goto(pages[1])}} borderRadius={br}>
              <Center h={h}>
                <p>
                  {pages[1].substring(0, 1).toUpperCase().concat(pages[1].substring(1))}
                </p>
              </Center>
            </GridItem>

            <GridItem mr={2} w={w} h={h} bg='blue.500' borderRadius={br}>
              <Center h={h}>
                <Search />
              </Center>
            </GridItem>
        </Grid>
    </>
}