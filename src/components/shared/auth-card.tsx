import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-[480px] border border-border/80 bg-card/95 backdrop-blur-md shadow-xl shadow-foreground/5 rounded-2xl transition-all duration-300",
        className
      )}
    >
      <CardHeader className="space-y-1.5 pb-3 pt-6 px-6 sm:px-8 text-left">
        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground font-normal">
          {description}
        </CardDescription>
      </CardHeader>

      <div className="px-6 sm:px-8 pb-4">
        <Separator className="bg-border/60" />
      </div>

      <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 space-y-4">
        {children}

        {footerText && footerLinkText && footerLinkHref && (
          <div className="pt-2 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
