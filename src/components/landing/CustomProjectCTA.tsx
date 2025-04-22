
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';

type FormValues = {
  tipoProgetto: string;
  messaggio: string;
  budget: string;
  email: string;
};

export const CustomProjectCTA = () => {
  const [open, setOpen] = useState(false);
  const [budgetRange, setBudgetRange] = useState([5000]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      tipoProgetto: '',
      messaggio: '',
      budget: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, budget: `€${budgetRange[0]}` });
    toast.success('Richiesta inviata!', {
      description: 'Ti contatteremo presto per discutere del tuo progetto.',
    });
    setOpen(false);
    form.reset();
  };

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-background pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-2xl text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Hai bisogno di un'app o sito web AI su misura?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Indica il tuo budget e ricevi una proposta personalizzata
        </p>
        
        <div className="max-w-xl mx-auto mb-8">
          <p className="text-2xl font-bold text-purple-400 mb-4">
            {formatBudget(budgetRange[0])}
          </p>
          <Slider
            value={budgetRange}
            onValueChange={setBudgetRange}
            max={50000}
            min={1000}
            step={1000}
            className="py-4"
          />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6">
              Richiedi ora
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-purple-700/50 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Richiedi la tua soluzione</DialogTitle>
              <DialogDescription>
                Compila il form per ricevere una proposta personalizzata.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="tipoProgetto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo progetto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Es. App web, Sito vetrina, Dashboard..." 
                          {...field} 
                          className="bg-background/40 border-purple-700/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="messaggio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Messaggio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrivi brevemente il tuo progetto..." 
                          {...field} 
                          className="bg-background/40 border-purple-700/30 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input 
                          value={formatBudget(budgetRange[0])}
                          readOnly
                          className="bg-background/40 border-purple-700/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="La tua email" 
                          {...field} 
                          className="bg-background/40 border-purple-700/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Invia richiesta
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </section>
  );
};
