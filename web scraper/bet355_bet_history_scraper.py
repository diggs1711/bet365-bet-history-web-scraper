from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select
import time
from datetime import date
from dateutil.relativedelta import relativedelta

driver = webdriver.Firefox(executable_path='/home/david/Documents/geckodriver')
driver.get("https://www.bet365.com/?lng=1&cb=10326429708#/HO/")

elem = driver.find_element_by_link_text("English")

elem.click()

driver.implicitly_wait(10)

inputLogin = driver.find_elements_by_xpath("//div[contains(@class, 'hm-Login_UserNameWrapper')]/input")

username = inputLogin[0]
username.clear()

username.send_keys("dhiggs45")

driver.execute_script("document.getElementsByClassName('hm-Login_InputField')[2].value = '3miix0pcjUN6AbCxlLza';")

inputLogin = driver.find_elements_by_xpath("//div[contains(@class, 'hm-Login_PasswordWrapper')]/input")
p = inputLogin[0]
p.click()

driver.implicitly_wait(15)

inputClick = driver.find_element_by_class_name("hm-Login_LoginBtn")
inputClick.click()

driver.implicitly_wait(10)
membersLink = driver.find_element_by_class_name("hm-MembersInfo_UserLink")

membersLink.click()

driver.implicitly_wait(3)
historyLink = None

old_driver = driver

while(not historyLink):
    for handle in driver.window_handles:
        driver.switch_to_window(handle)
        try:
            historyLink = driver.find_element_by_id("TopMenuNew_lnk15")
        except NoSuchElementException as e:
            print("None")
        else:
            if historyLink is None:
                print("Not in this window")
            else:
                historyLink.click()
        finally:
            pass

dropdownlist = Select(driver.find_element_by_id('ctl00_main_SportsHistorySearchControl_ddlHistType'))
dropdownlist.select_by_visible_text("Settled Sports Bets")

fromRadioBtn = driver.find_element_by_id('ctl00_main_SportsHistorySearchControl_dateSearchControl_rdbFrom')
fromRadioBtn.click()

todayDateString = time.strftime("%d/%m/%Y")


six_months = date.today() + relativedelta(months=-6)
fromDateString = str(six_months.day) + "/" + str(six_months.month) + "/" + str(six_months.year)

fromDate = driver.find_element_by_id('ctl00_main_SportsHistorySearchControl_dateSearchControl_txtFromDate')
fromDate.send_keys(fromDateString)

searchBetHistoryBtn = driver.find_element_by_id('ctl00_main_SportsHistorySearchControl_dateSearchControl_lkGo')
searchBetHistoryBtn.click()
