"use client";

import { auth } from "@/lib/firebase-config";


const page = ()=>{
    return(
      <div>
        Create Other page in dashboard for use
        <button onClick={async ()=>{
        await  auth.signOut()
        }}>
          SignOut</button>
      </div>
    )
}

export default page;