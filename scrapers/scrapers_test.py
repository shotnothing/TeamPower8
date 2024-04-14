# Deprecated: This file is no longer used

# import unittest

# from scraper_session import ScraperSession

# class TestScrapers(unittest.TestCase):
#     def setUp(self):
#         self.scraper_session = ScraperSession()

#     def test_mount_faber_leisure_scraper(self):
#         scraper = self.scraper_session.get_scraper("MountFaberLeisure")
#         soup = scraper.soup
#         self.assertIsNotNone(soup, "Failed to fetch Mount Faber Leisure HTML")

#     def test_invalid_scraper(self):
#         with self.assertRaises(ValueError):
#             self.scraper_session.get_scraper("InvalidScraper")

#     def test_iter(self):
#         for type_, scraper in self.scraper_session:
#             self.assertIsNotNone(scraper.soup, f"Failed to fetch {type_} HTML")

# if __name__ == '__main__':
#     unittest.main()


    