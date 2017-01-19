from selenium.webdriver.common.by import By


class LandingPageLocators(object):
    ENGLISH = (By.LINK_TEXT, "English")


class MainPageLocators(object):
    USERNAME_INPUT = (
        By.XPATH, "//div[contains(@class, 'hm-Login_UserNameWrapper')]/input")
    PASSWORD_INPUT = (
        By.XPATH, "//div[contains(@class, 'hm-Login_PasswordWrapper')]/input")
    LOGIN_BUTTON = (By.CLASS_NAME, "hm-Login_LoginBtn")
    PASSWORD_INPUT_REVEAL = "document.getElementsByClassName('hm-Login_InputField')[2].value = '3miix0pcjUN6AbCxlLza';"
    MEMBERS_LINK = (By.CLASS_NAME, "hm-MembersInfo_UserLink")


class PopUpWindowLocators(object):
    HISTORY = (By.ID, "TopMenuNew_lnk15")
    BETTYPE_DROPDOWN = (
        By.ID, 'ctl00_main_SportsHistorySearchControl_ddlHistType')
    SETTLED_BETS = "Settled Sports Bets"
    FROM_RADIOBUTTON = (
        By.ID, 'ctl00_main_SportsHistorySearchControl_dateSearchControl_rdbFrom')
    DATE_FROM_INPUT = (
        By.ID, 'ctl00_main_SportsHistorySearchControl_dateSearchControl_txtFromDate')
    SEARCH_HISTORY_BUTTON = (
        By.ID, 'ctl00_main_SportsHistorySearchControl_dateSearchControl_lkGo')
