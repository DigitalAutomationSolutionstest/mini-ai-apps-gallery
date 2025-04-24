declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): any;
}

declare module "npm:openai" {
  export class OpenAI {
    constructor(options: { apiKey: string });
    chat: {
      completions: {
        create(options: any): Promise<any>;
      };
    };
  }
}

declare module "npm:resend" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: any): Promise<any>;
    };
  }
} 