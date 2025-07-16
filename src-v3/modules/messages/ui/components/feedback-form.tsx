import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { upsertFeedbackSchema } from "../../schemas";

interface FeedbackFormProps {
  messageId: string;
  vote: "positive" | "negative";
  onSuccess: () => void;
  onCancel: () => void;
}

export const FeedbackForm = ({
  messageId,
  vote,
  onSuccess,
  onCancel,
}: FeedbackFormProps) => {
  const trpc = useTRPC();

  const submitFeedback = useMutation(
    trpc.messages.upsertFeedback.mutationOptions({
      onSuccess: async (data) => {
        onSuccess?.();
        toast.success("Thank you!", {
          description: "Your feedback was noted.",
        });
      },
      onError: (error) => {
        toast.error(`Uh oh! Something went wrong.`, {
          description: error.message,
        });
      },
    })
  );

  const isPending = submitFeedback.isPending;

  const form = useForm<z.infer<typeof upsertFeedbackSchema>>({
    resolver: zodResolver(upsertFeedbackSchema),
    defaultValues: { messageId, vote, comment: "" },
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isDirty },
  } = form;

  const onSubmit = (values: z.infer<typeof upsertFeedbackSchema>) => {
    submitFeedback.mutate(values);
    reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-y-4 space-x-2 space-y-2 gap-2"
      >
        <FormField
          control={control}
          name={"comment"}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Your feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !isValid || !isDirty}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
