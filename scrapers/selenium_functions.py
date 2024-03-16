from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
def click_element_with_retry(driver, locator, max_attempts=3):
    """
    Clicks an element specified by the locator, handling Stale Element Reference exceptions by retrying.

    :param driver: The Selenium WebDriver instance.
    :param locator: A tuple specifying the strategy and locator (By.<METHOD>, 'locator').
    :param max_attempts: Maximum number of attempts to click the element.
    """
    attempts = 0
    while attempts < max_attempts:
        try:
            # Wait for the element to be clickable
            element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(locator)
            )
            # Attempt to click the element
            element.click()
            return  # If successful, exit the function
        except StaleElementReferenceException:
            # If a Stale Element exception was caught, increment the attempt counter and try again
            attempts += 1
            if attempts == max_attempts:
                raise  # If max attempts reached, re-raise the exception

# Example usage:
# driver = webdriver.Chrome()  # or any other driver
# click_element_with_retry(driver, (By.ID, "my_element_id"))
def start_driver(URL,headless=False,implict_wait_time = 0):
    service = Service(executable_path=ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument('--headless')
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(implict_wait_time)
    driver.get(URL)
    return driver