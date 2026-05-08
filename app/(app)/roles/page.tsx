import RoleListHeader from "@/app/components/roles/RoleListHeader";
import RolesContent from "./RolesContent";

export default function Page() {
  return <RolesContent header={<RoleListHeader />} />;
}
