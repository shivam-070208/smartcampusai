import { UserDashBoard } from "@/services/user/dashboard/component/user-dashboard";
import { Suspense } from "react";
import Loader from "@/components/common/loader";

const page = () =>{
  return (
    <Suspense fallback={<Loader />}>
    <UserDashBoard />
    </Suspense>
  )
}


export default page;