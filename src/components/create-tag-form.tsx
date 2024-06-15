import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useTags from "../hooks/use-tags";
import { getSlugFromString } from "../utils/get-slug-from-string";
import { CreateTagSchema, createTagSchema } from "../validation/tag";
import { Button, buttonVariants } from "./ui/button";

export function CreateTagForm() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { createTag: createNewTag } = useTags();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema),
  });

  const slug = watch("title") ? getSlugFromString(watch("title")) : "";

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title }: CreateTagSchema) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await createNewTag({ title, slug, amountOfVideos: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-tags"],
      });

      setOpen(false);
    },
  });

  async function createTag({ title }: CreateTagSchema) {
    await mutateAsync({ title });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={buttonVariants({ variant: "primary" })}>
        <Plus className="size-3" />
        Create new
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed space-y-10 p-10 right-0 top-0 bottom-0 h-screen min-w-[320px] z-10 bg-zinc-950 border-l border-zinc-900">
          <div className="space-y-3">
            <Dialog.Title className="text-xl font-bold">
              Create tag
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-500">
              Tags can be used to group videos about similar concepts.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block" htmlFor="title">
                Tag name
              </label>
              <input
                {...register("title")}
                id="name"
                type="text"
                className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
              />
              {errors?.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                readOnly
                value={slug}
                className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 w-full text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Dialog.Close asChild>
                <Button>
                  <X className="size-3" />
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                disabled={isSubmitting}
                className="bg-teal-400 text-teal-950"
                type="submit"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Check className="size-3" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
