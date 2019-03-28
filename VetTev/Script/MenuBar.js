//USEUNIT CommonObjects
//USEUNIT CommonReporting
//USEUNIT CommonTextControl

function MenuBar_SelectCustomersTab()
{
  let selectedTab = CommonObjects.CommonObjects_FindObjectByFullName(Objects.MenuBar_Customers);
  selectedTab.Click();
}

function MenuBar_SelectAnimalsTab()
{
  let selectedTab = CommonObjects.CommonObjects_FindObjectByFullName(Objects.MenuBar_Animals);
  selectedTab.Click();
}

function MenuBar_SelectCalendarTab()
{
  let selectedTab = CommonObjects.CommonObjects_FindObjectByFullName(Objects.MenuBar_Calendar);
  selectedTab.Click();
}