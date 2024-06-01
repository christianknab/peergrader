
interface JoinShareButtonProps {
    joinCode: string;
}

export default function JoinShareButton({ joinCode }: JoinShareButtonProps) {
    return (
        <div>
            {joinCode}
        </div>
        
    );
}