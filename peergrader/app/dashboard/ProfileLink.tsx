'use client';

import ProfileImage from "@/components/ProfileImage";
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
        <button onClick={() => router.push("/dashboard/edit-account")} className="flex items-center py-2 px-4 font-bold no-underline">
            <ProfileImage src={`${currentUser?.profile_image}?${new Date().getTime()}`} width={30} height={30} />
            <div className="pl-2">{`${currentUser?.first_name} ${currentUser?.last_name}`}</div>
        </button>
    );

}