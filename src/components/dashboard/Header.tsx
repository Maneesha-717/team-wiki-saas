type HeaderProps = {
  /** Falls back to "Dashboard" so existing call sites keep working,
   *  but every other route should pass its own title — otherwise
   *  a wiki page will render this header still saying "Dashboard". */
  title?: string;
  userName?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

export default function Header({ title = "Dashboard", userName }: HeaderProps) {
  const displayName = userName?.trim() || "Signed in";

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6"
      style={{ borderColor: "#E4DFD4" }}
    >
      <h2 className="text-[16px] font-semibold" style={{ color: "#1C1B19" }}>
        {title}
      </h2>

      <button
        type="button"
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#F3F0E8]"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium text-white"
          style={{ background: "#1B4332" }}
        >
          {userName ? getInitials(userName) : "?"}
        </span>
        <span className="text-[13px] font-medium" style={{ color: "#1C1B19" }}>
          {displayName}
        </span>
      </button>
    </header>
  );
}