/*
# Tighten table grants and make admin check run as caller

1. Modified Tables
- `wishes` and `admins`: default broad grants are removed and replaced with the minimum needed.

2. Security
- anon: may insert wishes (status must be pending) and read published wishes only.
- authenticated: may read wishes allowed by policy, delete wishes, and change only the status column. Admin checks decide who may do it.
- authenticated: may read only its own admin row.
- No role can modify the admins table through the API.
- `is_admin()` now runs with the caller's rights. It only reads the caller's own admin row, which the policy already allows, so it no longer needs elevated rights.

3. Notes
- No wish data is changed by this migration.
*/

REVOKE ALL ON wishes FROM anon, authenticated;
REVOKE ALL ON admins FROM anon, authenticated;

GRANT INSERT ON wishes TO anon;
GRANT SELECT ON wishes TO anon;
GRANT SELECT, DELETE ON wishes TO authenticated;
GRANT UPDATE (status) ON wishes TO authenticated;
GRANT INSERT ON wishes TO authenticated;
GRANT SELECT ON admins TO authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
