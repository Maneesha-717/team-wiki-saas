"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function DocumentPage() {
  const params = useParams();

  const router = useRouter();

  const documentId = params.documentId as string;

    const {
    data: document,
    isLoading,
    } = api.document.getById.useQuery({
    id: documentId,
    });

    const updateDocument = api.document.update.useMutation();
    const deleteDocument = api.document.delete.useMutation();

    const utils = api.useUtils();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
  if (document) {
    setTitle(document.title);
    setContent(document.content ?? "");
  }
}, [document]);

    const handleSave = async () => {
  if (!document) return;

  try {
    await updateDocument.mutateAsync({
      id: document.id,
      title,
      content,
    });

    await utils.document.getById.invalidate({
      id: document.id,
    });

    alert("Document saved!");
  } catch (error) {
    console.error(error);
    alert("Failed to save document.");
  }
};
    const handleDelete = async () => {
  if (!document) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete this document?"
  );

  if (!confirmed) return;

  try {
    await deleteDocument.mutateAsync({
      id: document.id,
    });

    router.push("/dashboard/documents");
  } catch (error) {
    console.error(error);
    alert("Failed to delete document.");
  }
};
    if (isLoading) {
  return (
    <div className="flex items-center justify-center py-20">
      Loading document...
    </div>
  );
}

if (!document) {
  return (
    <div className="flex items-center justify-center py-20">
      Document not found.
    </div>
  );
}

  return (
  <div className="space-y-8">
  <div className="flex items-start justify-between gap-6">
  <div className="flex-1">
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full rounded-md border px-4 py-3 text-[30px] outline-none"
      style={{
        borderColor: "#E4DFD4",
        fontFamily: "'Fraunces', serif",
        fontWeight: 500,
        color: "#1C1B19",
      }}
    />

    <p
      className="mt-2 text-[15px]"
      style={{ color: "#6F6A62" }}
    >
      Status: {document.isPublished ? "Published" : "Draft"}
    </p>
  </div>

  <div className="flex gap-3">
  <button
    onClick={handleSave}
    disabled={updateDocument.isPending}
    className="rounded-md px-4 py-2 text-sm text-white"
    style={{ background: "#1B4332" }}
  >
    {updateDocument.isPending ? "Saving..." : "Save"}
  </button>

  <button
    onClick={handleDelete}
    disabled={deleteDocument.isPending}
    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
  >
    {deleteDocument.isPending ? "Deleting..." : "Delete"}
  </button>
</div>
</div>

    <div
      className="rounded-md border bg-white p-6"
      style={{
        borderColor: "#E4DFD4",
      }}
    >
      <textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={18}
  className="w-full resize-none outline-none"
  style={{
    color: "#1C1B19",
  }}
/>
    </div>
  </div>
);

}