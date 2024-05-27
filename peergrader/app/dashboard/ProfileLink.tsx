'use client';

import ProfileImage from "@/components/ProfileImage";
import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";

export default function ProfileLink() {
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
        <div className="flex items-center">
            <ProfileImage src={`${currentUser?.profile_image}?${new Date().getTime()}`} width={30} height={30} />
            <div className="pl-2">{`${currentUser?.first_name} ${currentUser?.last_name}`}</div>
        </div>
    );
}
