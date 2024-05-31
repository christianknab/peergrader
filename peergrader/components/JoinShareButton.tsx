
interface JoinShareButtonProps {
    joinCode: string;
}

export default function InputFieldForm({ joinCode }: JoinShareButtonProps) {
    return (
        <div>
            {joinCode}
        </div>
        
    );
}