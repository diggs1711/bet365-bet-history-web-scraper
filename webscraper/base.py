from selenium.webdriver.support.ui import WebDriverWait


class Page(object):
    def __init__(self, driver, base_url="https://www.bet365.com/?lng=1&cb=10326429708#/HO/"):
        self.base_url = base_url
        self.driver = driver
        self.timeout = 30

    def find_element(self, *locator):
        return self.driver.find_element(*locator)

    def find_elements(self, *locator):
        return self.driver.find_elements(*locator)

    def get_title(self):
        return self.driver.title

    def get_url(self):
        return self.driver.current_url

    def check_element_exists(self, *locator):
        return True if (self.find_element(*locator).is_selected()) else False

    def wait_for_element(self, *locator):
        return WebDriverWait(self.driver, 30).until(lambda self: self.find_element(*locator))
