import { toast } from "sonner";
import { Button } from "./ui/button";

interface ErrorScheduleProps {
  onRefetch: () => Promise<unknown[]>;
}

export const ErrorSchedule = ({ onRefetch }: ErrorScheduleProps) => {
  return (
    <div className="w-[1350px] h-[300px] flex flex-col items-center justify-center gap-4">
      <p>Error loading schedule.</p>
      <Button
        onClick={() => {
          toast.promise(onRefetch(), {
            loading: "Refetching schedule data...",
            error: "Failed to refetch schedule data"
          });
        }}
      >
        Refetch
      </Button>
    </div>
  );
};

export default ErrorSchedule; 