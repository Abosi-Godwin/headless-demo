import { getCustomer } from "../../lib/CustomerAccount";
import ProfileClient from "./components/ProfileClient";

const ProfilePage = async () => {
    const customer = await getCustomer();

    return <ProfileClient customer={customer} />;
};

export default ProfilePage;
