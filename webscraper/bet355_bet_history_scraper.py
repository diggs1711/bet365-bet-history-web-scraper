from selenium import webdriver
from pages import *
import json
import io

def main():
    bets = []

    driver = webdriver.Firefox(executable_path='./geckodriver')
    driver.get("https://www.bet365.com/?lng=1&cb=10326429708#/HO/")

    landing_page = LandingPage(driver)
    landing_page.go_to_main_page()

    main_page = MainPage(driver)
    main_page.login()

    driver.get("https://members.bet365.com/MEMBERS/History/SportsHistory/HistorySearch/?BetStatus=0&SearchScope=2&platform=Desktop")

    popup_window = PopupWindow(driver)

    bets_last_two_days = popup_window.get_bet_history()

    bets_last_six_months = popup_window.get_bets_from_last_six_months()

    all_bets_from_last_six_months = bets_last_two_days + bets_last_six_months

    with io.open('bets.json', 'w', encoding="utf-8") as f:
        f.write(unicode(json.dumps(all_bets_from_last_six_months, ensure_ascii=False)))

    with io.open('bets.json', encoding="utf-8") as f:
        data = json.load(f)
        for ind, b in enumerate(data):
            print("bet #" + str(ind + 1) + " :  " + b['bet_result'])


if __name__ == '__main__':
    main()
