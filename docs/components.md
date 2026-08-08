# PHOENIXZ Component Library — Storybook Specification

Production-ready, accessible, dark-mode-first component library built for PheonixZ.

---

## 1. Button (`Button.tsx`)
Interactive button supporting primary, secondary, outline, ghost, and danger variants.

### Usage & Examples
```tsx
import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";

<Button variant="primary" size="md">Run Cycle</Button>
<Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
  Sync Data
</Button>
<Button variant="danger" isLoading>Processing...</Button>
```

---

## 2. Input & Textarea (`Input.tsx`, `Textarea.tsx`)
Accessible form controls with explicit labels, helpers, and error states.

### Usage & Examples
```tsx
import { Input, Textarea } from "@/components/ui";

<Input label="CRON Secret" placeholder="Enter secret token…" type="password" />
<Textarea label="Analyst Rationale" placeholder="Enter evaluation rationale…" rows={3} />
```

---

## 3. Card & Metric Card (`Card.tsx`, `MetricCard.tsx`)
Structured containers and high-density metric KPI displays.

### Usage & Examples
```tsx
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from "@/components/ui";
import { Eye } from "lucide-react";

<MetricCard label="Observed" value={482} icon={Eye} subtext="Candidate signals ingested" />
```

---

## 4. Badge & Status Badge (`Badge.tsx`, `StatusBadge.tsx`)
PheonixZ semantic status badges (`LIVE`, `PUBLISH`, `WATCH`, `REJECT`).

### Usage & Examples
```tsx
import { Badge, StatusBadge } from "@/components/ui";

<Badge variant="accent">Pricing</Badge>
<StatusBadge status="publish" />
<StatusBadge status="watch" />
<StatusBadge status="reject" />
```

---

## 5. Tabs & Accordion (`Tabs.tsx`, `Accordion.tsx`)
Accessible keyboard-navigable tabs and expandable rationale drawers.

### Usage & Examples
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, Accordion } from "@/components/ui";

<Tabs defaultValue="feed">
  <TabsList>
    <TabsTrigger value="feed">Feed</TabsTrigger>
    <TabsTrigger value="decisions">Ledger</TabsTrigger>
  </TabsList>
  <TabsContent value="feed">Feed content</TabsContent>
</Tabs>
```

---

## 6. Modal & Drawer (`Modal.tsx`, `Drawer.tsx`)
Overlay dialogue modals and side slide-over drawers with ESC key listeners.

### Usage & Examples
```tsx
import { Modal, Drawer } from "@/components/ui";

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Audit Details">
  Modal Body Content
</Modal>
```

---

## 7. Table & Pagination (`Table.tsx`, `Pagination.tsx`)
Dense tabular data view and pagination controls.

### Usage & Examples
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from "@/components/ui";

<Table>
  <TableHeader>
    <TableRow><TableHead>Company</TableHead><TableHead>Score</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>OpenAI</TableCell><TableCell>92/100</TableCell></TableRow>
  </TableBody>
</Table>
```

---

## 8. Timeline (`Timeline.tsx`)
Multi-step competitive thread timeline displaying inter-company sequences.

### Usage & Examples
```tsx
import { Timeline } from "@/components/ui";

<Timeline steps={[
  { title: "Company A Move", subtitle: "Anthropic releases Artifacts", status: "completed" },
  { title: "Company B Response", subtitle: "OpenAI releases Canvas", status: "active" }
]} />
```

---

## 9. Loading Skeleton, Toast, Empty & Error States (`LoadingSkeleton.tsx`, `Toast.tsx`, `EmptyState.tsx`, `ErrorState.tsx`)
System status and feedback indicators.

### Usage & Examples
```tsx
import { LoadingSkeleton, Toast, EmptyState, ErrorState } from "@/components/ui";

<LoadingSkeleton lines={3} />
<Toast title="Cycle Complete" description="1 candidate published" variant="success" />
<EmptyState title="No Records Found" description="Try clearing filters" />
<ErrorState message="Ingestion timeout on RSS source" onRetry={handleRetry} />
```
