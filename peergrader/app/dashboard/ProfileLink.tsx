'use client';

import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import { redirect, useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const {
        data: currentUser,
        isLoading,
        isError
    } = useCurrentUserQuery();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error</div>;
    }

    return (
        <button onClick={() => router.push("/dashboard/edit-account")} className="py-2 px-4 font-bold no-underline">
            {`${currentUser?.first_name} ${currentUser?.last_name}`}
        </button>
    );

}