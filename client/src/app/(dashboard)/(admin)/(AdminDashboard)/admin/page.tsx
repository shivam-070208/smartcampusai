import AdminDashboard from "@/services/admin/dashboard/component/admin-dashboard";
import { Suspense } from "react";
import Loader from "@/components/common/loader";

const page = () =>{
  return (
    <Suspense fallback={<Loader />}>
    <AdminDashboard />
    </Suspense>
  )
}


export default page;

