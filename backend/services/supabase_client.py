import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase_client = None

try:
    if SUPABASE_URL and SUPABASE_KEY:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    pass


class MockSupabaseTable:
    """Mock table for when Supabase is not configured"""
    def select(self, *args, **kwargs):
        return self
    def insert(self, *args, **kwargs):
        return self
    def delete(self, *args, **kwargs):
        return self
    def update(self, *args, **kwargs):
        return self
    def eq(self, *args, **kwargs):
        return self
    def order(self, *args, **kwargs):
        return self
    def range(self, *args, **kwargs):
        return self
    def execute(self):
        class Result:
            data = []
            count = 0
        return Result()


class MockSupabase:
    """Mock Supabase client for development"""
    def table(self, name: str):
        return MockSupabaseTable()


if supabase_client is None:
    supabase_client = MockSupabase()
