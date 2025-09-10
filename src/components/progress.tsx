import { Progress } from "@/components/ui/progress";

type ProgressProps = {
  isPending?: boolean;
  isSuccess?: boolean;
  isEasPending?: boolean;
  isEasSuccess?: boolean;
};

function ProgressSection({
  isPending,
  isSuccess,
  isEasPending,
  isEasSuccess,
}: ProgressProps) {
  let status = 0;
  let label = "";

  if (isPending) {
    status = 25;
    label = "Sending payment";
  } else if (isSuccess) {
    status = 50;
    label = "Waiting for use to confirm receipt";
  } else if (isEasPending) {
    status = 75;
    label = "Generating receipt";
  } else if (isEasSuccess) {
    status = 100;
    label = "Receipt created";
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Progress value={status} />
      <p>{label}</p>
    </div>
  );
}

export default ProgressSection;