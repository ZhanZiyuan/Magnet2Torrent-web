"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateTorrent } from "./actions";

// Schema for magnet link validation
const formSchema = z.object({
  magnet: z.string()
    .min(1, { message: "Please paste a magnet link." })
    .refine((val) => val.startsWith("magnet:?xt=urn:btih:"), {
      message: "This does not appear to be a valid magnet link.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      magnet: "",
    },
    mode: 'onChange',
  });

  // Main submission handler
  const onSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await generateTorrent(values.magnet);

      if (result.success && result.data) {
        // Decode Base64 and create a Blob
        const byteCharacters = atob(result.data.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/x-bittorrent" });
        
        // Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const fileName = (result.data.name || 'torrent').replace(/[/\\?%*:|"<>]/g, '-') + '.torrent';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({
          title: "Download Started",
          description: `Your .torrent file "${fileName}" is downloading.`,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error || "An unknown error occurred. The link might be invalid or have no peers.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected client-side error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // This handler triggers submission automatically when a valid magnet is pasted
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('magnet', value, { shouldValidate: true });
    
    // Check if the input is valid and submit
    const isValid = formSchema.shape.magnet.safeParse(value).success;
    if (isValid) {
      // Trigger submission, but give a small delay for UI to update.
      setTimeout(() => form.handleSubmit(onSubmit)(), 100);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-4 right-4">
        <Link href="https://github.com/example/magnet2torrent-web" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
          <Button variant="ghost" size="icon">
            <Github className="h-6 w-6" />
          </Button>
        </Link>
      </header>
      
      <main className="w-full max-w-xl">
        <Card className="bg-card/90 backdrop-blur-sm border-primary/10 shadow-lg">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Torrent Generator
            </CardTitle>
            <CardDescription className="pt-1 text-muted-foreground">
              Paste a magnet link to instantly generate a .torrent file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="magnet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="magnet:?xt=urn:btih:..."
                          {...field}
                          onChange={handleInputChange}
                          className="h-12 text-center text-base disabled:opacity-80"
                          autoFocus
                          disabled={isSubmitting}
                          aria-label="Magnet link input"
                        />
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                 {isSubmitting && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground pt-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching metadata... this can take up to 30 seconds.
                    </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
