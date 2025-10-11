-- ===============================================
-- FIX ADMIN RLS POLICY
-- Add policy to allow super_admin to read any profile
-- ===============================================

-- Create a policy for super_admin users to read all profiles
CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Also ensure super_admin can read their own profile regardless
CREATE POLICY "Super admins can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    AND role = 'super_admin'
  );

-- Verify the policies were created
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND policyname LIKE '%admin%';
