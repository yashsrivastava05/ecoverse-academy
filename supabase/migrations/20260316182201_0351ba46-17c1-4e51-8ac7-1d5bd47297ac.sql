
CREATE OR REPLACE FUNCTION public.get_non_student_user_ids()
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(array_agg(DISTINCT user_id), '{}'::uuid[])
  FROM public.user_roles
  WHERE role IN ('teacher', 'school_admin')
$$;
