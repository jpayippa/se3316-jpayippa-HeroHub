import React from "react";
import { Center, Box, Text } from "@chakra-ui/react";
import SearchHero from "../searchHeros";
import CreateHeroList from "../List/CreateList";
import PublicListView from "../List/PublicListView";
import UserListsView from "../List/UserListsView";


export default function Dashboard() {
  return (
    <>
    <Center py={6}>
          <Box maxW="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="lg">
            <Text fontSize="xl" fontWeight="bold" mb={2}>Welcome to Hero Hub</Text>
            <Text>
              Discover your favorite superheroes, their powers, and more! 
              Use our search tool to find detailed information about any superhero in our database.
            </Text>
          </Box>
        </Center>
        <SearchHero />
        <UserListsView />
        <PublicListView maxDisplay={5} />
        <CreateHeroList />
    </>
  );
}