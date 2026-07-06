"use client";
import { useRouter } from "next/navigation";
import { useCurrentWorkspace } from "~/hooks/use-current-workspace";
import { api } from "~/trpc/react";


export default function DocumentsPage() {
  const router = useRouter();
  const {
    currentWorkspace,
    isLoading: workspaceLoading,
  } = useCurrentWorkspace();

  const {
    data: documents,
    isLoading: documentsLoading,
  } = api.document.getByWorkspace.useQuery(
    {
      workspaceId: currentWorkspace?.id ?? "",
    },
    {
      enabled: !!currentWorkspace,
    },
  );

  const createDocument =
  api.document.create.useMutation();

  const utils = api.useUtils();

  const handleCreateDocument = async () => {
  if (!currentWorkspace) return;

  try {
    const document = await createDocument.mutateAsync({
      title: "Untitled Document",
      content: "",
      workspaceId: currentWorkspace.id,
    });

    await utils.document.getByWorkspace.invalidate({
      workspaceId: currentWorkspace.id,
    });

    router.push(`/dashboard/documents/${document.id}`);
  } catch (error) {
    console.error(error);
  }
};

  if (workspaceLoading || documentsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[15px] text-gray-500">
          Loading documents...
        </p>
      </div>
    );
  }

  

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[15px] text-red-500">
          No workspace found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
  <div>
    <h1
      className="text-[28px]"
      style={{
        fontFamily: "'Fraunces', serif",
        fontWeight: 500,
        color: "#1C1B19",
      }}
    >
      Documents
    </h1>

    <p
      className="mt-2 text-[15px]"
      style={{ color: "#6F6A62" }}
    >
      Workspace: <strong>{currentWorkspace.name}</strong>
    </p>
  </div>

  <button
    onClick={handleCreateDocument}
    disabled={createDocument.isPending}
    className="rounded-md px-4 py-2 text-sm text-white"
    style={{ background: "#1B4332" }}
  >
    {createDocument.isPending
      ? "Creating..."
      : "New Document"}
  </button>
</div>

      {/* Empty State */}
      {documents?.length === 0 ? (
        <div
          className="rounded-md border border-dashed p-10 text-center"
          style={{
            borderColor: "#E4DFD4",
            background: "#F3F0E8",
          }}
        >
          <h2
            className="text-xl"
            style={{
              fontFamily: "'Fraunces', serif",
              color: "#1C1B19",
            }}
          >
            No documents yet
          </h2>

          <p
            className="mt-2"
            style={{ color: "#6F6A62" }}
          >
            Create your first document to start collaborating.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents?.map((document) => (
            <div
              key={document.id}
              className="rounded-md border bg-white p-5"
              style={{
                borderColor: "#E4DFD4",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-lg"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      color: "#1C1B19",
                    }}
                  >
                    {document.title}
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{ color: "#6F6A62" }}
                  >
                    {document.isPublished
                      ? "Published"
                      : "Draft"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/documents/${document.id}`,
                    )
                  }
                  className="rounded-md px-4 py-2 text-sm text-white transition-colors"
                  style={{
                    background: "#1B4332",
                  }}
                >
              Open
            </button>
                          </div>

              <p
                className="mt-3 text-sm"
                style={{ color: "#6F6A62" }}
              >
                Created:{" "}
                {new Date(document.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}