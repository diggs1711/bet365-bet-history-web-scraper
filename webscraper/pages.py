from base import Page
from locators import *
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select
from datetime import date
from dateutil.relativedelta import relativedelta


class LandingPage(Page):
    def go_to_main_page(self):
        self.driver.find_element(*LandingPageLocators.ENGLISH).click()
        self.driver.implicitly_wait(10)


class MainPage(Page):

    def enter_username(self, name):
        self.clear_username()
        self.driver.find_element(
            *MainPageLocators.USERNAME_INPUT).send_keys(name)

    def clear_username(self):
        self.driver.find_element(
            *MainPageLocators.USERNAME_INPUT).clear()

    def enter_password(self, name):
        self.driver.execute_script(MainPageLocators.PASSWORD_INPUT_REVEAL)
        self.driver.find_element(*MainPageLocators.PASSWORD_INPUT).click()

    def click_login(self):
        self.driver.find_element(*MainPageLocators.LOGIN_BUTTON).click()

    def click_members_link(self):
        self.driver.find_element(*MainPageLocators.MEMBERS_LINK).click()

    def login(self):
        self.enter_username("dhiggs45")
        self.enter_password("")
        sleep(1)
        self.click_login()
        self.driver.implicitly_wait(10)
        self.click_members_link()
        self.driver.implicitly_wait(3)


class PopupWindow(Page):
    def switch_driver_to_popup(self):
        self.historyLink = None
        while(not self.historyLink):
            for handle in self.driver.window_handles:
                self.driver.switch_to_window(handle)
                try:
                    self.historyLink = self.driver.find_element(*PopUpWindowLocators.HISTORY)
                except NoSuchElementException as e:
                    print(e)
                else:
                    if self.historyLink is None:
                        print("Not in this window")
                    else:
                        self.historyLink.click()
                finally:
                    pass

    def select_from_dropdown(self, name):
        select = Select(self.driver.find_element(
            *PopUpWindowLocators.BETTYPE_DROPDOWN))
        select.select_by_visible_text(name)

    def create_date_string(self):
        six_months_ago = self.get_date_six_months_ago()
        return str(six_months_ago.day) + "/" + str(six_months_ago.month) + "/" + str(six_months_ago.year)

    def select_from_radio_button(self):
        self.driver.find_element(*PopUpWindowLocators.FROM_RADIOBUTTON).click()

    def get_date_six_months_ago(self):
        return date.today() + relativedelta(months=-6)

    def enter_from_date(self, date_string):
        self.driver.find_element(
            *PopUpWindowLocators.DATE_FROM_INPUT).send_keys(date_string)

    def click_search_button(self):
        self.driver.find_element(
            *PopUpWindowLocators.SEARCH_HISTORY_BUTTON).click()

    def get_bet_history(self):
        self.switch_driver_to_popup()
        self.select_from_dropdown("Settled Sports Bets")
        self.select_from_radio_button()
        self.enter_from_date(self.create_date_string())
        self.click_search_button()
