import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AI_NAME } from "@/lib/config";
import { FeedbackForm } from "./feedback-form";

interface Props {
  messageId: string;
  vote: "positive" | "negative";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog = ({
  messageId,
  vote,
  open,
  onOpenChange,
}: Props) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Provide additional feedback"
      description={`Thank you for taking the time to help us improve ${AI_NAME}.`}
    >
      <div className="mt-4">
        <FeedbackForm
          messageId={messageId}
          vote={vote}
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
      </div>
    </ResponsiveDialog>
  );
};
