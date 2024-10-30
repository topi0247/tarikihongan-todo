import { useEffect } from "react";
import { userState } from "status";
import { useRecoilState } from "recoil";
import { useQuery, gql } from "@apollo/client";
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      window.localStorage.setItem("_tarikihongan_token", token);
      navigate(Path.ROOT);
    }
  }, [navigate]);

  useEffect(() => {
    if (data?.CurrentUser && user.id !== data.CurrentUser.id) {
      setUser(data.CurrentUser as User);
    }
  }, [data, user, setUser]);
  return null;
};
