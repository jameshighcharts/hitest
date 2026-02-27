import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTestForm } from "@/components/CreateTestForm";

export default function NewTestPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tests">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to tests</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Test</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new HiTest assessment
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTestForm />
        </CardContent>
      </Card>
    </div>
  );
}
