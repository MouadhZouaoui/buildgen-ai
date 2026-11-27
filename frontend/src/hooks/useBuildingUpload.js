import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUILDING_BUCKET,
  supabase,
  supabaseConfigError,
  toViewerBuilding,
} from "../services/supabase";

export function useBuildingUpload() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const channelRef = useRef(null);

  const removeChannel = useCallback(() => {
    if (channelRef.current && supabase) {
      void supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => removeChannel, [removeChannel]);

  const uploadPdf = useCallback(async (file, onBuildingReady) => {
    if (!supabase) {
      setError(supabaseConfigError);
      setStatus("error");
      return;
    }
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Sélectionnez un fichier PDF.");
      setStatus("error");
      return;
    }

    removeChannel();
    setError(null);
    setProjectId(null);
    setStatus("uploading");

    const id = crypto.randomUUID();
    const storagePath = `pdfs/${id}.pdf`;
    const buildingName = file.name.replace(/\.pdf$/i, "");
    let fileUploaded = false;

    try {
      const channel = supabase
        .channel(`building-${id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "buildings",
            filter: `id=eq.${id}`,
          },
          (payload) => {
            const row = payload.new;
            if (row.status === "processing") {
              setStatus("processing");
            } else if (row.status === "completed") {
              try {
                const viewerBuilding = toViewerBuilding(row.building_json, buildingName);
                setProjectId(id);
                setStatus("completed");
                onBuildingReady(
                  viewerBuilding,
                  row.building_json?.summary || null,
                  row.building_json?.estimates?.currency || "",
                );
              } catch (conversionError) {
                setError(conversionError.message);
                setStatus("error");
              }
              removeChannel();
            } else if (row.status === "error") {
              setError(row.building_json?.error || "Le traitement du document a échoué.");
              setStatus("error");
              removeChannel();
            }
          },
        );

      channelRef.current = channel;
      await new Promise((resolve, reject) => {
        channel.subscribe((subscriptionStatus) => {
          if (subscriptionStatus === "SUBSCRIBED") resolve();
          if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(subscriptionStatus)) {
            reject(new Error(`Impossible de démarrer le suivi temps réel (${subscriptionStatus}).`));
          }
        });
      });

      const { error: uploadError } = await supabase.storage
        .from(BUILDING_BUCKET)
        .upload(storagePath, file, { contentType: "application/pdf", upsert: false });
      if (uploadError) throw uploadError;
      fileUploaded = true;

      const { error: insertError } = await supabase.from("buildings").insert({
        id,
        name: buildingName,
        pdf_path: storagePath,
        status: "uploaded",
      });
      if (insertError) throw insertError;

      setProjectId(id);
      setStatus((current) => current === "uploading" ? "uploaded" : current);
    } catch (uploadError) {
      let message = uploadError.message || "Impossible d’envoyer le document.";
      if (fileUploaded) {
        const { error: cleanupError } = await supabase.storage
          .from(BUILDING_BUCKET)
          .remove([storagePath]);
        if (cleanupError) {
          message += ` Le fichier est resté dans le stockage : ${cleanupError.message}`;
        }
      }
      setError(message);
      setStatus("error");
      removeChannel();
    }
  }, [removeChannel]);

  return {
    status,
    error,
    projectId,
    isConfigured: Boolean(supabase),
    uploadPdf,
  };
}
