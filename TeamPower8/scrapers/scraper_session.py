import requests

from scraper_interface import ScraperInterface
from mount_faber_leisure_scraper import MountFaberLeisureScraper

class ScraperSession:
    '''Session for web scrapers.
    
    Provides a common session for web scrapers to use, and doubles as a factory for them.

    Example usage:
    ```
    session = ScraperSession()
    scraper = session.get_scraper("MountFaberLeisure")
    soup = scraper.soup 
    # From here, you can use the BeautifulSoup object to parse the HTML however you like
    ```
    '''

    SCRAPERS = {
        "MountFaberLeisure": MountFaberLeisureScraper,
    }

    def __init__(self, **kwargs):
        self.session = requests.Session(**kwargs)

    def get_scraper(self, type_: str):
        scraper = self.SCRAPERS.get(type_)
        if scraper is None:
            raise ValueError(f"Invalid scraper type: {type_}")
        return scraper(self.session)

    def __iter__(self):
        for type_, scraper in self.SCRAPERS.items():
            yield type_, scraper(self.session)