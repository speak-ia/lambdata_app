"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { TaskShell } from "@/components/tasks/task-shell";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IMAGE_CATEGORIES } from "@/lib/constants";
import {
  isFirebaseStorageConfigured,
  uploadCulturalImage,
} from "@/lib/firebase/storage";
import { recordAndSyncContribution } from "@/lib/record-contribution";
import { queueUpload } from "@/offline/db";
import { defaultSourceLanguage, getLanguageLabel } from "@/lib/languages";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import Link from "next/link";

const SLOT_COUNT = 6;

type SlotState = {
  id: string;
  preview?: string;
  uploading?: boolean;
  done?: boolean;
  storagePath?: string;
};

export default function ImageTaskPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const appLanguage = useAppStore((s) => s.appLanguage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState(0);
  const [category, setCategory] = useState("food");
  const [slots, setSlots] = useState<SlotState[]>(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => ({ id: `slot-${i}` })),
  );

  const contributionLang = defaultSourceLanguage(
    appLanguage,
    user?.languages ?? ["fr"],
  );
  const storageReady = isFirebaseStorageConfigured();
  const canUpload = !!user && !user.isGuest && !!token;

  const updateSlot = (index: number, patch: Partial<SlotState>) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  };

  const uploadFile = useCallback(
    async (file: File, slotIndex: number) => {
      if (!user || user.isGuest) {
        toast.error("Connectez-vous pour envoyer des images");
        return;
      }
      if (!token) {
        toast.error("Session expirée");
        return;
      }
      const preview = URL.createObjectURL(file);
      updateSlot(slotIndex, { preview, uploading: true, done: false });

      try {
        if (!storageReady) {
          await queueUpload({
            module: "image",
            payload: {
              category,
              language: contributionLang,
              fileName: file.name,
              size: file.size,
              pendingCloud: true,
              token: token ?? undefined,
            },
          });
          await recordAndSyncContribution("image", token, {
            category,
            language: contributionLang,
            pendingCloud: true,
            localPreview: true,
          });
          updateSlot(slotIndex, {
            uploading: false,
            done: true,
            preview,
          });
          toast.success(
            "+50 XP · Image enregistrée localement (upload cloud après activation Storage)",
          );
          return;
        }

        const { downloadUrl, storagePath } = await uploadCulturalImage(
          file,
          user.id,
          category,
        );

        await recordAndSyncContribution("image", token, {
          storagePath,
          downloadUrl,
          category,
          language: contributionLang,
        });

        URL.revokeObjectURL(preview);
        updateSlot(slotIndex, {
          uploading: false,
          done: true,
          storagePath,
          preview: downloadUrl,
        });
        toast.success("+50 XP · Image sur Google Cloud Storage");
      } catch (err) {
        updateSlot(slotIndex, { uploading: false, preview: undefined });
        URL.revokeObjectURL(preview);
        toast.error(
          err instanceof Error ? err.message : "Échec de l'envoi de l'image",
        );
      }
    },
    [user, token, storageReady, category, contributionLang],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez une image");
      return;
    }
    void uploadFile(file, activeSlot);
  };

  const openPicker = (slotIndex: number, capture?: boolean) => {
    setActiveSlot(slotIndex);
    const input = inputRef.current;
    if (!input) return;
    if (capture) {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.click();
  };

  const clearSlot = (index: number) => {
    const preview = slots[index]?.preview;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    updateSlot(index, {
      preview: undefined,
      uploading: false,
      done: false,
      storagePath: undefined,
    });
  };

  const selectClass =
    "h-11 w-full rounded-xl border border-input bg-background px-3 text-base";

  return (
    <TaskShell title="Images culturelles">
      <p className="mb-4 text-center text-sm text-muted-foreground">
        {storageReady
          ? "Vos photos sont envoyées vers Google Cloud Storage (Firebase)."
          : "Mode local : vos photos sont enregistrées et comptent en XP. L’upload cloud s’activera avec Firebase Storage (Blaze)."}
      </p>

      {user?.isGuest && (
        <p className="mb-4 text-center text-sm text-muted-foreground">
          <Link href="/register" className="font-medium text-primary">
            Créez un compte
          </Link>{" "}
          pour publier des images.
        </p>
      )}

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          className={selectClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {IMAGE_CATEGORIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Langue des métadonnées : {getLanguageLabel(contributionLang)}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFileChange}
        disabled={!canUpload}
      />

      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot, i) => {
          const isCamera = i === 0;
          if (slot.preview) {
            return (
              <div
                key={slot.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={slot.preview}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={slot.preview.startsWith("blob:")}
                />
                {slot.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="size-8 animate-spin text-primary" />
                  </div>
                )}
                {slot.done && (
                  <span className="absolute bottom-1 left-1 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {storageReady ? "GCS ✓" : "Local ✓"}
                  </span>
                )}
                {!slot.uploading && (
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
                    onClick={() => clearSlot(i)}
                    aria-label="Retirer"
                  >
                    <X className="size-4 text-white" />
                  </button>
                )}
              </div>
            );
          }

          return (
            <button
              key={slot.id}
              type="button"
              disabled={!canUpload}
              onClick={() => openPicker(i, isCamera)}
              className={
                isCamera
                  ? "col-span-1 flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                  : "flex aspect-square items-center justify-center rounded-xl bg-muted disabled:opacity-50"
              }
            >
              {isCamera ? (
                <>
                  <Camera className="size-8" />
                  <span className="text-sm font-semibold">Caméra</span>
                </>
              ) : (
                <ImageIcon className="size-8 text-muted-foreground/50" />
              )}
            </button>
          );
        })}
      </div>

      <Button
        className="mt-6 h-12 w-full"
        variant="outline"
        disabled={!canUpload}
        onClick={() => openPicker(activeSlot, false)}
      >
        Ajouter depuis la galerie
      </Button>
    </TaskShell>
  );
}
