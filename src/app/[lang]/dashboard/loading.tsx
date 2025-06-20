import { Loader } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <Loader className="size-6 animate-spin" />
    </div>
  );
}
