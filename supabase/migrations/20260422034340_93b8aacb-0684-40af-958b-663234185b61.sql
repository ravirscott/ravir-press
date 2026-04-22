DROP POLICY "Anyone can submit editor request" ON public.editor_requests;

CREATE POLICY "Anyone can submit editor request"
  ON public.editor_requests FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (message IS NULL OR char_length(message) <= 2000)
    AND status = 'pending'
  );