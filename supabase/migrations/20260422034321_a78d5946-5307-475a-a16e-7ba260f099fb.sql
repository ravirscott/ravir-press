CREATE TYPE public.editor_request_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE public.editor_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text,
  status public.editor_request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE public.editor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit editor request"
  ON public.editor_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view editor requests"
  ON public.editor_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update editor requests"
  ON public.editor_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete editor requests"
  ON public.editor_requests FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_editor_requests_status ON public.editor_requests(status, created_at DESC);