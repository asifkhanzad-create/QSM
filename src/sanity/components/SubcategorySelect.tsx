"use client";

import { useEffect, useState } from "react";
import { useFormValue, useClient, set, unset } from "sanity";
import { Select, Stack, Text } from "@sanity/ui";

export function SubcategorySelect(props: any) {
  const { value, onChange } = props;
  const categoryRef = useFormValue(["category"]) as { _ref?: string };
  const client = useClient({ apiVersion: "2024-06-19" });
  const [subs, setSubs] = useState<Array<{ name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryRef?._ref) {
      setSubs([]);
      return;
    }
    setLoading(true);
    client
      .fetch(`*[_id == $id][0].subcategories[]{name, "slug": slug.current}`, {
        id: categoryRef._ref,
      })
      .then((result) => {
        setSubs(result || []);
        setLoading(false);
      })
      .catch(() => {
        setSubs([]);
        setLoading(false);
      });
  }, [categoryRef?._ref]);

  if (!categoryRef?._ref) {
    return (
      <Stack space={2}>
        <Text size={1} muted>Select a category first</Text>
      </Stack>
    );
  }

  if (loading) {
    return (
      <Stack space={2}>
        <Text size={1} muted>Loading subcategories...</Text>
      </Stack>
    );
  }

  if (subs.length === 0) {
    return (
      <Stack space={2}>
        <Text size={1} muted>No subcategories found for this category</Text>
      </Stack>
    );
  }

  return (
    <Stack space={2}>
      <Select
        value={value || ""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value;
          onChange(val ? set(val) : unset());
        }}
      >
        <option value="">— Select subcategory (optional) —</option>
        {subs.map((sub) => (
          <option key={sub.slug} value={sub.slug}>
            {sub.name}
          </option>
        ))}
      </Select>
    </Stack>
  );
}