import requests
import warnings

from scraper_interface import ScraperInterface

class MountFaberLeisureScraper(ScraperInterface):
    '''Web scraper for Mount Faber Leisure website.

    NOTE: WIP, https://booking.mountfaberleisure.com/packages/discover/wings-of-time is dynamic
    which is a dooozy, I will need to reverse engineer the API to get the prices (which is a POST request, 
    I won't waste time doing it for this but you can easily see the request called 'options' in DevTools network
    monitor).

    However, this is just an example of how to use the ScraperInterface to create a scraper.
    '''
    MOUNT_FABER_LEISURE_URL = "https://booking.mountfaberleisure.com/"

    def __init__(self, session: requests.Session):
        super().__init__(session, self.MOUNT_FABER_LEISURE_URL)

    def get(self):
        ''' Should return a list of dicts like:
        [
            {
                'product': 'Cable Car Sky Pass',
                'age_group': 'Adult',
                'price': 35.0,
            },
            {
                'product': 'Cable Car Sky Pass',
                'age_group': 'Child (4-12 years)',
                'price': 30.0,
            },
            {
                'product': 'Wings of Fire',
                'age_group': 'Adult',
                'price': 25.0,
            },
            {
                'product': 'Wings of Fire',
                'age_group': 'Child (4-12 years)',
                'price': 10.0,
            }
        ]
        How to get the data is up to you, but in the format above (or something else agreed upon).
        We can hand this over to another component that does the CRUD to the database, perhaps some ORM.
        This segregation of concerns is good for testing and maintainability, as well as side-effect management.
        '''
        return 

    def _extract_links_from_card_container(self, link: str = None):
        ''' Example of how to use GET and bs4 to extract links from a card container for a static site. 
        
        It won't work for dynamic sites, including Mount Faber Leisure's pricing page as they use a form with dynamic pricing. 
        For that, I have to reverse engineer their API and spoof a post request to get the price.
        '''
        if link is not None:
            cards = self.get_soup(link).find_all("div", class_="card-item")
        else:
            cards = self.soup.find_all("div", class_="card-item")
        
        if len(cards) == 0:
            raise ValueError(f'No cards found. Check {self.url} for changes in HTML structure.')
    
        hyperlinks = []
        for card in cards:
            hyperlinks_in_card = card.find_all("a", recursive=False)

            if len(hyperlinks_in_card) == 0:
                raise ValueError(f'No hyperlinks found. Check {self.url} for changes in HTML structure.')
            elif len(hyperlinks_in_card) > 1:
                warnings.warn(f'More than one hyperlink found. Check {self.url} for changes in HTML structure. Found: {len(hyperlinks_in_card)}')

            hyperlinks.append(hyperlinks_in_card[0].get("href"))

        return hyperlinks

    def _extract_product