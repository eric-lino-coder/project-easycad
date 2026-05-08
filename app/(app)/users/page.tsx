import UserListHeader from "../../components/users/UserListHeader";
import UsersContent from "./UsersContent";

export default function Page() {
  return <UsersContent header={<UserListHeader />} />;
}
