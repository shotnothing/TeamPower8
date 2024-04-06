"""
scrape_data table represents NEW INCOMING data collected.
clean_combined_tables represent EXISTING data collected

Thus, we will be only cleaning the INCOMING data and not PAST data which has already been cleaned.

Future Improvement:
In the future, we should edit this script, to remove data from scrape_data, auto_scraped_attractions, manual_scraped_attractions
that we have already clean and add to clean_combined_tables

"""
def main():
    import pandas as pd
    from supabase import create_client, Client, ClientOptions
    from dotenv import load_dotenv
    import os

    load_dotenv()
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key,options=ClientOptions().replace(schema="data"))
    response_1 = supabase.table("scrape_data").select("*").execute()
    response_2 = supabase.table("cleaned_combined_tables").select("*").execute()

    df_sd = pd.DataFrame(response_1.data)
    df_ccd = pd.DataFrame(response_2.data)

    # Task 1: Remove redundant rows and rename rows
    df_sd.rename(columns={"created_at": "scrape_timestamp",
                          "image":"image_url",
                          "source_link":"source_url"},inplace=True)
    df_sd.drop( ["scrapped_at"],axis=1,inplace=True)

    # Task 2: String manipulation for cleaning
    for col in ["company","product_name","category","subcategory"]:
        df_sd[col] = df_sd[col].str.lower().str.strip()

    #Task 3: Create product_id
    if len(df_ccd) > 0:
        df_ccd["product_company_name"] = df_ccd["company"] + "_____" + df_ccd["product_name"]
        product_info_dict = {row["product_company_name"]: row['product_id'] for _, row in df_ccd.iterrows()} #p_c_name: product_id
        max_existing_id = df_ccd["product_id"].max()
    else:
        product_info_dict = {}  # p_c_name: product_id
        max_existing_id = 0

    df_sd["product_company_name"] = df_sd["company"] + "_____" + df_sd["product_name"]
    for _, row in df_sd.iterrows():
        p_c_name = row["product_company_name"]
        if p_c_name not in product_info_dict:
            new_id = max_existing_id + 1
            max_existing_id = new_id
            product_info_dict[p_c_name] = new_id

    df_sd["product_id"] = df_sd["product_company_name"].map(product_info_dict)
    df_sd.drop(["product_company_name"],axis=1,inplace=True)

    #Task 4: remove redundant rows
        # Remove duplicates
    df_sd = df_sd.drop_duplicates(subset=["scrape_timestamp","product_id"])

    #Inserting cleaned data
    data_collected = df_sd.to_dict('records')
    data, count = supabase.table("cleaned_combined_tables").insert(data_collected).execute()

if __name__ == "__main__":
    main()