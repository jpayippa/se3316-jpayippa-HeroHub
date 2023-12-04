import React from "react";
import { Center, Box, Text, Heading, VStack } from "@chakra-ui/react";
import SearchHero from "../searchHeros";
import PublicListView from "../List/PublicListView";
import UserListsView from "../List/UserListsView";
import UserSListView from "./ListUsers";
import PolicyEditor from "./PolicyEditor";
import DMCALogger from "./DCMALogger";

export default function AdminView() {
  const role = localStorage.getItem("role");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const nickname = user ? user.nickname : 'Guest';
  const honerific = role === "GrandAdmin" ? "Grand" : "Admin";

  return (
    <>
      <Center py={6}>
        <Box maxW="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="lg">
          <Text fontSize="xl" fontWeight="bold" mb={2}>Welcome {honerific} {nickname}</Text>
        </Box>
      </Center>
    
      {role === "GrandAdmin" && (
        <VStack spacing={8}>
          
          <PolicyEditor />
          {/* <DMCALogger /> */}
        </VStack>
      )}

      <SearchHero />
      <UserListsView />
      <PublicListView maxDisplay={5} authenticated={true} admin={true}/>
      <UserSListView />
    </>
  );
}
