from bs4 import BeautifulSoup
import requests

class ScraperInterface:
    '''Interface for a web scraper.
    
    Not meant to be used directly, but to be inherited by a scraper class.
    '''
    def __init__(self, session: requests.Session, url: str):
        self.session = session
        self.url = url
        self._soup = None

    def _fetch(self, url: str, **kwargs):
        '''Fetches the HTML from the class-specified URL and stores it as a BeautifulSoup object.
        '''
        response = self.session.get(url, **kwargs)
        self._soup = BeautifulSoup(response.text, "html.parser")
        return self._soup

    @property
    def soup(self):
        '''
        Cached BeautifulSoup object of the HTML of the scraper URL. Not using 
        functools.cached_property for backwards compatibility with python <= 3.8. 
        The URL is fixed to what is defined by the subclass constructor. 
        Use get_soup for a generic URL.
        '''
        if self._soup is None:
            self._fetch(url=self.url)
        return self._soup

    def get_soup(self, url: str):
        '''Fetches the HTML from the specified URL and returns it as a BeautifulSoup object.
        '''
        return self._fetch(url=url)

    def get(self, url: str = None, **kwargs):
        '''Sends a user-specified GET request to the specified URL and returns the response. Defaults to the class-specified URL.
        '''
        return self.session.get(url or self.url, **kwargs)

    def post(self, url: str, **kwargs):
        '''Sends a user-specified POST request to the specified URL and returns the response.
        '''
        return self.session.post(url, **kwargs)