import { Progress } from "@/components/ui/progress";

type ProgressProps = {
  isPending?: boolean;
  isSuccess?: boolean;
};

function ProgressSection({
  isPending,
  isSuccess,
}: ProgressProps) {
  let status = 0;
  let label = "";

  if (isPending) {
    status = 50;
    label = "Sending payment";
  } else if (isSuccess) {
    status = 100;
    label = "Success!";
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Progress value={status} />
      <p>{label}</p>
    </div>
  );
}

export default ProgressSection;