-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 10
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own credits"
    ON public.user_credits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
    ON public.user_credits
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert credits"
    ON public.user_credits
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can delete credits"
    ON public.user_credits
    FOR DELETE
    USING (true);

-- Create function to handle credit updates
CREATE OR REPLACE FUNCTION public.handle_credit_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.credits < 0 THEN
        RAISE EXCEPTION 'Credits cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for credit validation
CREATE TRIGGER validate_credits
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_credit_update(); 