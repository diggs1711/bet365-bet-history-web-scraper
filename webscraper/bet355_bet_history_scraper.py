from selenium import webdriver
from pages import *


def main():
    driver = webdriver.Firefox(executable_path='./geckodriver')
    driver.get("https://www.bet365.com/?lng=1&cb=10326429708#/HO/")

    landing_page = LandingPage(driver)
    landing_page.go_to_main_page()

    main_page = MainPage(driver)
    main_page.login()

    popup_window = PopupWindow(driver)
    popup_window.get_bet_history()


if __name__ == '__main__':
    main()
