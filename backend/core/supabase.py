import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
# Use service role key if backend needs to bypass RLS for admin operations, 
# or use anon key if you want backend to respect user session.
# Typically backend needs service role key to act as admin.
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY must be configured in environment variables.")

supabase_client: Client = create_client(supabase_url, supabase_key)
