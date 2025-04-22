
import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  type: z.string().min(2, { message: "Il tipo di progetto è obbligatorio" }),
  email: z.string().email({ message: "Email non valida" }),
  budget: z.string().min(1, { message: "Seleziona un budget" }),
  message: z.string().min(10, { message: "La descrizione deve essere di almeno 10 caratteri" }),
});

type FormValues = z.infer<typeof formSchema>;

const budgetOptions = [
  { value: "meno di 500€", label: "meno di 500€" },
  { value: "500€ – 2000€", label: "500€ – 2000€" },
  { value: "oltre 2000€", label: "oltre 2000€" },
];

export function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      email: "",
      budget: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error();
      
      toast.success("Richiesta inviata!", {
        description: "Ti contatteremo presto per discutere del tuo progetto.",
      });
      form.reset();
    } catch {
      toast.error("Errore nell'invio", {
        description: "Per favore riprova più tardi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#101216] text-gray-100 px-6 py-24">
      <div className="max-w-xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400"
        >
          Richiedi un preventivo gratuito
        </motion.h2>

        <div className="bg-[#1a1d23] border border-[#2c2f36] rounded-xl p-6 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Tipo di progetto" 
                        {...field}
                        className="w-full px-4 py-2 rounded-md bg-[#0f1115] text-gray-100 placeholder-gray-500 focus:outline-none border-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        {...field}
                        className="w-full px-4 py-2 rounded-md bg-[#0f1115] text-gray-100 placeholder-gray-500 focus:outline-none border-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2 rounded-md bg-[#0f1115] text-gray-100 focus:outline-none border-0">
                          <SelectValue placeholder="Seleziona budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1a1d23] border-[#2c2f36]">
                        {budgetOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-gray-100 focus:bg-cyan-500/20 focus:text-cyan-400"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrizione del progetto" 
                        className="w-full px-4 py-2 rounded-md bg-[#0f1115] text-gray-100 placeholder-gray-500 focus:outline-none border-0 min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-black py-2 px-4 rounded-md font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
