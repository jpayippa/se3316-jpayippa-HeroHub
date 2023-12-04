import React from "react";
import { Center, Box, Text } from "@chakra-ui/react";
import SearchHero from "../searchHeros";
import PublicListView from "../List/PublicListView";
import UserListsView from "../List/UserListsView";
import UserSListView from "./ListUsers";


export default function AdminView() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;  
  // Now you can access user.nickname
  const nickname = user ? user.nickname : 'Guest';

  return (
    <>
    <Center py={6}>
          <Box maxW="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="lg">
            <Text fontSize="xl" fontWeight="bold" mb={2}>Welcome Admin {nickname}</Text>
          </Box>
        </Center>
        <SearchHero />
        <UserListsView />
        <PublicListView maxDisplay={5} authenticated ={true} admin={true}/>
    </>
  );
}