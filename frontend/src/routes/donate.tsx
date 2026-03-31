import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/donate")({
  beforeLoad: () => {
    throw redirect({
      href: "https://secure.winred.com/craft4commissioner/donate-today",
      code: 301,
    });
  },
  component: () => null,
});
