import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/cafes")({
    component: CafesRoute,
});

function CafesRoute() {
    return (
        <div className='mx-auto w-full max-w-md py-10'>
            Hello
        </div>
    );
};