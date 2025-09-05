import { Github } from "lucide-react";
import { Button } from "./ui/button";

const GitHubLink = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="shrink-0 h-8 px-2 flex items-center gap-1"
    >
      <a
        href="https://github.com/kuba-04/bitcoin-tales"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        <Github className="h-4 w-4" />
        <span className="text-xs">This is Open Source</span>
      </a>
    </Button>
  );
};

export default GitHubLink;
