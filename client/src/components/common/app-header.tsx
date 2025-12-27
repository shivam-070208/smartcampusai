"use client";

import { IconMenu } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import Container from "./container";

const AppHeader = () =>{
    const {setOpen} = useSidebar();
    return (
        <Container className="flex justify-between shadow-xs " size="full" padding="small">
            <Button variant="outline" onClick={() => setOpen((prev)=>!prev)}>
                <IconMenu size={10} />
            </Button>
        </Container>
    )
}

export {
    AppHeader
}