"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <NextStudio config={config} />
    </div>
  );
}
