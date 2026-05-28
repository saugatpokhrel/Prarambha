import Image from "next/image";

interface CategoryAvatarProps {
  className?: string;
}

export function MrAvatar({ className }: CategoryAvatarProps) {
  return (
    <Image
      src="/male-avatar.svg"
      alt="Mr. Fresher"
      fill
      className={className}
      style={{ objectFit: "contain" }}
      unoptimized
    />
  );
}

export function MissAvatar({ className }: CategoryAvatarProps) {
  return (
    <Image
      src="/female-avatar.svg"
      alt="Miss Fresher"
      fill
      className={className}
      style={{ objectFit: "contain" }}
      unoptimized
    />
  );
}
