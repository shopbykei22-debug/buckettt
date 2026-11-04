/*
# Split public read policy so visitors never evaluate the admin check

1. Modified Tables
- `wishes`: the public read policy is split by role.

2. Security
- Visitors (anon) read only rows with status `published`; they never call the admin helper.
- Signed-in users read published rows, and admins also read pending and rejected rows.
- Permissive policies combine, so the result matches the previous behavior for each role.

3. Notes
- No data is changed by this migration.
*/

DROP POLICY IF EXISTS "public_select_published_wishes" ON wishes;

DROP POLICY IF EXISTS "anon_select_published_wishes" ON wishes;
CREATE POLICY "anon_select_published_wishes" ON wishes FOR SELECT
  TO anon
  USING (status = 'published');

DROP POLICY IF EXISTS "authenticated_select_wishes" ON wishes;
CREATE POLICY "authenticated_select_wishes" ON wishes FOR SELECT
  TO authenticated
  USING (status = 'published' OR public.is_admin());
