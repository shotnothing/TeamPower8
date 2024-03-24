"""
This script is temporary. We only need it whenever we are still manually scrapping data.
"""

from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
import os

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
as_data = supabase.table('auto_scraped_attractions').select("*").execute()
ms_data = supabase.table('manual_scraped_attractions').select("*").execute()

total_data = as_data.data + ms_data.data
data, count = supabase.table("scrape_data").insert(total_data).execute()