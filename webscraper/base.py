from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class Page(object):
    def __init__(self, driver, base_url="https://www.bet365.com/?lng=1&cb=10326429708#/HO/"):
        self.base_url = base_url
        self.driver = driver
        self.timeout = 30

    def find_element(self, *locator):
        return self.driver.find_element(*locator)

    def find_elements(self, *locator):
        return self.driver.find_elements(*locator)

    def staleness_of(self, *locator):
        return EC.staleness_of(locator[1])

    def presence_of(self, *locator):
        return EC.presence_of_element_located(*locator)

    def get_title(self):
        return self.driver.title

    def get_url(self):
        return self.driver.current_url

    def check_element_exists(self, *locator):
        return True if (self.find_element(*locator).is_selected()) else False

    def wait_for_element(self, *locator):
        return WebDriverWait(self.driver, 30).until(
            lambda self: self.find_element(*locator))

    def wait_for_element_clickable(self, *locator):
        return WebDriverWait(self.driver, 30).until(
            EC.element_to_be_clickable(*locator))

    def wait_for_element_invisible(self, *locator):
        return WebDriverWait(self.driver, 30).until(
            EC.invisibility_of_element_located((locator)))

    def wait_for_staleness(self, *locator):
        return WebDriverWait(self.driver, 30).until(
            self.staleness_of(*locator))

    def presence_of_element_located(self, *locator):
        return WebDriverWait(self.driver, 30).until(
            self.presence_of(*locator))
