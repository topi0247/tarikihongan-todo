import { useEffect } from "react";
import { userState } from "status";
import { useRecoilState } from "recoil";
import { useQuery, gql } from "@apollo/client";
import { User } from "types";

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
  const { data } = useQuery(GET_USER);

  useEffect(() => {
    if (data?.CurrentUser && user.id !== data.CurrentUser.id) {
      setUser(data.CurrentUser as User);
    }
  }, [data]);
  return null;
};
