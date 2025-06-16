import { DatabaseStatus } from "../../components/DatabaseStatus";
import { RoleSelector } from "../../components/RoleSelector";

export const FooBar = () => {
  return (
    <>
      <RoleSelector />
      <DatabaseStatus />
    </>
  );
}