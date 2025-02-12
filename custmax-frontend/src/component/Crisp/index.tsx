"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("73882c96-dd2b-4a25-b663-2f95f89b7988");
    });

    return null;
}

export default CrispChat;