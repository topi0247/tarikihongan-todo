import { useCallback, useEffect } from "react";
import { userState } from "status";
import { useRecoilState } from "recoil";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User } from "types";
import { useNavigate } from "react-router-dom";
import { Path } from "constants/routes";

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
  const navigate = useNavigate();

  const setToken = useCallback(async (token: string) => {
    window.localStorage.setItem("_tarikihongan_token", token);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      setToken(token);
      navigate(Path.ROOT);
    }
  }, []);

  useEffect(() => {
    if (data?.CurrentUser && user.id !== data.CurrentUser.id) {
      setUser(data.CurrentUser as User);
    }
  }, [data, user, setUser]);
  return null;
};
