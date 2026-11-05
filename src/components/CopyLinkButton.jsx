import { useCopyLink } from "../hooks/useCopyLink.js";
import ActionButton from "./ActionButton.jsx";

const LABELS = {
  idle: "Copiar link",
  copied: "Copiado",
  failed: "Copie da barra"
};

export default function CopyLinkButton({ getUrl = () => window.location.href }) {
  const { status, copy } = useCopyLink();

  return (
    <ActionButton icon={status === "copied" ? "check" : "link"} onClick={() => copy(getUrl())} aria-live="polite">
      {LABELS[status]}
    </ActionButton>
  );
}
