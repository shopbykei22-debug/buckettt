/*
# Create wishes table with moderation and admin access

1. New Tables
- `wishes`: each submitted wish.
  - `id` (uuid, primary key)
  - `name` (text, nullable): optional sender name, empty means "Anonim" in the UI
  - `message` (text, required): the wish itself, 1 to 500 characters
  - `created_at` (timestamptz): submission time
  - `status` (text): `pending`, `published`, or `rejected`; new wishes start as `pending`
- `admins`: user ids allowed to moderate wishes. Only managed directly in the database.

2. Helper
- `is_admin()`: returns true when the signed-in user is listed in `admins`.

3. Security
- Row level security enabled on both tables.
- Visitors (anon) can insert pending wishes only and read published wishes only.
- Signed-in admins can read all wishes, change status, and delete wishes.
- Only the `status` column can be updated, and only by admins.
- `admins` can be read only by the user themselves; nobody can write to it through the API.
- `is_admin()` is callable by signed-in users only.

4. Notes
- Length and emptiness checks are enforced in the table itself, not just in the browser.
- Wishes are never deleted automatically.
*/

CREATE TABLE IF NOT EXISTS wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text CHECK (name IS NULL OR char_length(name) <= 60),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected'))
);

CREATE INDEX IF NOT EXISTS wishes_status_created_at_idx ON wishes (status, created_at DESC);

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

GRANT SELECT, INSERT ON wishes TO anon;
GRANT SELECT, INSERT, DELETE ON wishes TO authenticated;
GRANT UPDATE (status) ON wishes TO authenticated;
GRANT SELECT ON admins TO authenticated;

DROP POLICY IF EXISTS "anon_insert_pending_wishes" ON wishes;
CREATE POLICY "anon_insert_pending_wishes" ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "public_select_published_wishes" ON wishes;
CREATE POLICY "public_select_published_wishes" ON wishes FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "admin_update_wishes" ON wishes;
CREATE POLICY "admin_update_wishes" ON wishes FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_wishes" ON wishes;
CREATE POLICY "admin_delete_wishes" ON wishes FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_read_own_membership" ON admins;
CREATE POLICY "admin_read_own_membership" ON admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
