import { paramCase } from "change-case";

export type LoadingProps = {
  color?: "White" | "Black" | "Blue" | "Red";
  height?: number;
  width?: number;
};

const loaderColor = {
  White: "#fff",
  Black: "#000",
  Blue: "#0080FE",
  Red: "#F8719D",
};

export const Loading = ({
  color = "Blue",
  height = 5,
  width = 5,
}: LoadingProps) => (
  <svg
    className={`animate-spin h-${height} w-${width}`}
    style={{ color: loaderColor[color] }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    data-testid={paramCase(`search-loading`)}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
