# 🔍 Admin Login Diagnostic Guide

## 🎯 Let's Debug Your Admin Login Step by Step

### **Step 1: Check Environment Variables**

Open browser console at: `http://localhost:3001/adminlogin` and check:

```javascript
// Check if Supabase is configured
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### **Step 2: Test Admin Login with Browser Console**

1. Go to: `http://localhost:3001/adminlogin`
2. Open Developer Tools (F12)
3. Enter credentials: `admin@pulsebridge.ai` / `PulseBridge2025!`
4. Click Sign In
5. Watch console logs for detailed error messages

**Look for these specific logs:**
- `🔐 Starting admin login process...`
- `✅ Supabase client initialized`
- `🔍 Auth response:` 
- `🔍 Profile response:`

### **Step 3: Database Verification Required**

You need to run these SQL scripts in Supabase SQL Editor:

**A. Check if admin user exists:**
```sql
-- Run CHECK_ADMIN_USER.sql
SELECT * FROM auth.users WHERE email = 'admin@pulsebridge.ai';
SELECT * FROM public.profiles WHERE email = 'admin@pulsebridge.ai';
```

**B. Create admin user if missing:**
```sql
-- If user doesn't exist, create in Supabase Dashboard:
-- Authentication > Users > Add User
-- Email: admin@pulsebridge.ai
-- Password: PulseBridge2025!
-- Auto-confirm: YES
```

### **Step 4: Most Likely Issues & Solutions**

#### **Issue 1: Admin User Not Created in Supabase**
**Symptom:** "Authentication failed: Invalid login credentials"
**Solution:** 
1. Go to Supabase Dashboard
2. Authentication > Users
3. Add User manually
4. Email: `admin@pulsebridge.ai`
5. Password: `PulseBridge2025!`
6. Check "Auto Confirm User"

#### **Issue 2: Profile Missing**
**Symptom:** "Unable to verify admin status. Profile not found."
**Solution:** After creating auth user, run this SQL:
```sql
INSERT INTO public.profiles (
  id, email, role, account_status, display_name
) VALUES (
  'AUTH_USER_ID_HERE', 
  'admin@pulsebridge.ai', 
  'super_admin', 
  'active', 
  'System Administrator'
);
```

#### **Issue 3: Wrong Role**
**Symptom:** "Access denied. Admin privileges required."
**Solution:** Update user role:
```sql
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'admin@pulsebridge.ai';
```

#### **Issue 4: Supabase Not Configured**
**Symptom:** "Authentication service not available"
**Solution:** Check .env.local has correct values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **Step 5: Quick Test Script**

Create this file: `test-admin.js` and run with `node test-admin.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials from .env.local
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdmin() {
  console.log('Testing admin login...');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@pulsebridge.ai',
    password: 'PulseBridge2025!'
  });
  
  if (error) {
    console.error('❌ Auth Error:', error.message);
    return;
  }
  
  console.log('✅ Auth Success!');
  console.log('User ID:', data.user.id);
  
  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) {
    console.error('❌ Profile Error:', profileError.message);
    return;
  }
  
  console.log('✅ Profile found:', profile);
}

testAdmin();
```

### **Step 6: Browser Network Tab Check**

1. Open browser at `http://localhost:3001/adminlogin`
2. Open Developer Tools > Network tab
3. Try to login
4. Look for failed requests to Supabase
5. Check response messages

### **Expected Flow:**

```
1. User enters credentials ✓
2. Supabase auth request ✓
3. User authenticated ✓
4. Profile lookup ✓
5. Role verification ✓
6. localStorage set ✓
7. Redirect to /admin ✓
```

### **Immediate Next Steps:**

1. **Go to:** `http://localhost:3001/adminlogin`
2. **Open:** Browser Developer Tools (F12)
3. **Enter:** `admin@pulsebridge.ai` / `PulseBridge2025!`
4. **Click:** Sign In
5. **Copy:** All console log messages
6. **Share:** The exact error messages you see

This will tell us exactly where the login process is failing!

---

**Most Common Fix:** The admin user probably doesn't exist in Supabase auth.users table and needs to be created manually in the Supabase Dashboard.