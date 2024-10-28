import { User } from "types";
import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    id: "",
    name: "",
  } as User,
});
