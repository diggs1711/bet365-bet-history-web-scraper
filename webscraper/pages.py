from base import Page
from locators import *
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select
from datetime import date
from dateutil.relativedelta import relativedelta
from selenium.webdriver.common.keys import Keys


class LandingPage(Page):
    def go_to_main_page(self):
        self.driver.find_element(*LandingPageLocators.ENGLISH).click()


class MainPage(Page):
    def enter_username(self, name):
        Page.wait_for_element(self, *MainPageLocators.USERNAME_INPUT)

        self.clear_username()
        self.driver.find_element(
            *MainPageLocators.USERNAME_INPUT).send_keys(name)

    def clear_username(self):
        self.driver.find_element(
            *MainPageLocators.USERNAME_INPUT).clear()

    def enter_password(self, name):
        Page.wait_for_element(self, *MainPageLocators.PASSWORD_INPUT)

        self.driver.execute_script(MainPageLocators.PASSWORD_INPUT_REVEAL)
        self.driver.find_element(*MainPageLocators.PASSWORD_INPUT).click()

    def click_login(self):
        self.driver.find_element(*MainPageLocators.LOGIN_BUTTON).click()

    def click_members_link(self):
        Page.wait_for_element(self, *MainPageLocators.MEMBERS_LINK)
        self.driver.find_element(*MainPageLocators.MEMBERS_LINK).click()

    def login(self):
        self.enter_username("dhiggs45")
        self.enter_password("")
        sleep(1)
        self.click_login()

        Page.wait_for_element(self, *MainPageLocators.MEMBERS_LINK)
        self.click_members_link()


class PopupWindow(Page):

    def create_date_string(self):
        six_months_ago = self.get_date_six_months_ago()
        return str(six_months_ago.day) + "/" + str(six_months_ago.month) + "/" + str(six_months_ago.year)

    def get_date_six_months_ago(self):
        return date.today() + relativedelta(months=-6)

    def enter_from_date(self, date_string):
        self.driver.find_element(
            *PopUpWindowLocators.DATE_FROM_INPUT).send_keys(date_string)

    def get_bet_history(self):
        Page.wait_for_element(self, *PopUpWindowLocators.SHOW_MORE_BTN)
        self.show_more()
        Page.wait_for_element(self, *PopUpWindowLocators.SHOW_MORE_BTN)

        Page.wait_for_element(self, *PopUpWindowLocators.BET_CONFIRMATION)
        bets = self.driver.find_elements(
            *PopUpWindowLocators.BET_CONFIRMATION_LINK)

        return self.get_bet_details(bets)

        '''
        self.switch_driver_to_popup()
        self.select_from_dropdown("Settled Sports Bets")
        self.select_from_radio_button()
        self.enter_from_date(self.create_date_string())
        self.click_search_button()
'''

    def get_bet_details(self, bets):
        self.bets = []

        Page.wait_for_element(self, *PopUpWindowLocators.BET_CONFIRMATION)

        bet_confirmation = self.driver.find_elements(
            *PopUpWindowLocators.BET_CONFIRMATION)

        for index, bet in enumerate(bets):
            self.bet_obj = {}

            Page.wait_for_element(self, *PopUpWindowLocators.BET_RETURN)
            stakes = self.driver.find_elements(*PopUpWindowLocators.BET_STAKE)
            returns = self.driver.find_elements(
                *PopUpWindowLocators.BET_RETURN)

            Page.wait_for_element_invisible(
                self, *PopUpWindowLocators.BET_RESULT)

            Page.wait_for_element(self, *PopUpWindowLocators.BET_STAKE)

            self.bet_obj['bet_stake'] = stakes[index].text
            self.bet_obj['bet_return'] = returns[index].text

            bet.click()

            Page.wait_for_element(self, *PopUpWindowLocators.BET_RESULT)

            self.bet_obj['bet_type'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_TYPE).text

            self.bet_obj['bet_event'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_EVENT).text

            self.bet_obj['bet_date'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_DATE).text

            self.bet_obj['bet_odds'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_ODDS).text

            self.bet_obj['bet_result'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_RESULT).text

            self.bet_obj['bet_id'] = bet_confirmation[index].find_element(
                *PopUpWindowLocators.BET_ID).text

            self.bets.append(self.bet_obj)

            bet.click()

        return self.bets

    def get_list_of_bets(self):
        self.switch_to_bet_history_iframe()
        bets = self.driver.find_elements(*PopUpWindowLocators.BET_ITEMS)

        for bet in bets:
            self.driver.switch_to_window()
            bet.send_keys(Keys.ENTER)
            if(bet.is_displayed and bet.is_enabled):
                bet.click()
                Page.wait_for_element(
                    self, *PopUpWindowLocators.BET_CONFIRMATION)

    def switch_to_bet_history_iframe(self):
        self.driver.switch_to_frame(
            self.driver.find_element(By.ID, "historyV3Iframe"))

    def show_more(self):
        self.driver.find_element(*PopUpWindowLocators.SHOW_MORE_BTN).click()
