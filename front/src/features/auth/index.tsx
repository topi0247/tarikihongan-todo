import { useEffect } from "react";
import { userState } from "status";
import { useRecoilState } from "recoil";
import { useQuery, gql } from "@apollo/client";

const GET_USER = gql`
  query {
    CurrentUser {
      id
      name
    }
  }
`;

export const Auth = () => {
  const [user, setUser] = useRecoilState(userState);
  const { loading, error, data } = useQuery(GET_USER);

  if (user.id) return null;
  if (loading) return null;
  if (error) return null;

  if (data.CurrentUser) {
    setUser(data.CurrentUser);
  }
  return null;
};
