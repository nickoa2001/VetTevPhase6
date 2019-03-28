//USEUNIT CommonApplication
/*
  Declare constants used for reporting
*/
var templateFailed = "FAILEDONLY"
var statusPass = "Pass"
var statusWarning = "Warning"
var statusFail = "Fail"


/**
  * This function sets the reportPath value to the path value in parameter and adds to the folder path the current project name and the current date
  * The path will be as such path\project name\today's date
  */
function InitReportPath(path)
{
    SetReportPath(path + "\\" + aqFileSystem.GetFolderInfo(aqFileSystem.GetCurrentFolder()).Name + "\\" + aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%Y"));
}

function SetCurrentTestCaseId(testCaseId)
{
  if (!Project.Variables.VariableExists("currentTestCaseId"))
    Project.Variables.AddVariable("currentTestCaseId", "String");    

  Project.Variables.currentTestCaseId = testCaseId;
}

function GetCurrentTestCaseId()
{
  return Project.Variables.currentTestCaseId;
}

function SetCurrentTestCaseXmlFile(testCaseId)
{
  if (!Project.Variables.VariableExists("currentTestCaseXmlFile"))
    Project.Variables.AddVariable("currentTestCaseXmlFile", "String");    
  
  Project.Variables.currentTestCaseXmlFile = testCaseId + ".xml";
}

function GetCurrentTestCaseXmlFile()
{
  return Project.Variables.currentTestXmlFile;
}

function SetCurrentTestCaseDescription(testCaseDesc)
{
  if (!Project.Variables.VariableExists("currentTestCaseDescription"))
    Project.Variables.AddVariable("currentTestCaseDescription", "String");    
  
  Project.Variables.currentTestCaseDescription = testCaseDesc;
}

function GetCurrentTestCaseDescription()
{
  return Project.Variables.currentTestCaseDescription;
}

function SetCurrentTestCaseStatus(testCaseStatus)
{
  if (!Project.Variables.VariableExists("currentTestCaseStatus"))
    Project.Variables.AddVariable("currentTestCaseStatus", "String");    

  Project.Variables.currentTestCaseStatus = testCaseStatus;
}

function GetCurrentTestCaseStatus()
{
  return Project.Variables.testCaseStatus;
}


/**
  * This method initialises the id, description, status, error description and the report path for the current test case running
  * @param testCaseId     - Id of the test case
  * @param testCaseDesc   - Description of the test case
  */
function Log_InitTestCase(testCaseId, testCaseDesc)
{
  SetCurrentTestCaseId(testCaseId);
  SetCurrentTestCaseXmlFile(testCaseId);
  SetCurrentTestCaseDescription(testCaseDesc);
  SetCurrentTestCaseStatus(null);
  let testRunStartTime = aqDateTime.Now();  
  Log.Message("Starting test case " + GetCurrentTestCaseId() + " - " + GetCurrentTestCaseDescription()+ " at: " + testRunStartTime);
}

/**
  * This method logs the current step description in the test result.
  */
function Log_CurrentStep(stepDesc)
{
   Log.Message("Starting step - " + stepDesc);
}

/**
  * This method logs an error in the test result and will stop the test execution.
  */
function Log_StepError(errorMessage)
{
  Log.Error(errorMessage);
  SetCurrentTestCaseStatus(statusFail);
  Runner.Stop(true);
}

/**
  * This method logs an message in the test result. The status of the step is "warning" but the test case execution is continued.
  */
function Log_StepWarningContinueExecution(warningMessage)
{
  warningMessage = aqString.Replace(warningMessage, "<", "&lt;");
  SetCurrentTestCaseStatus(statusFail);
  Log.Warning(aqString.Replace(warningMessage, ">", "&gt;"));
}

/**
  * This method allows to log the status "Pass" for a test case in the test result
  */
function Log_CurrentTestCaseStatusPass()
{
   Log.Message("Marking current test case status to Pass");
   SetCurrentTestCaseStatus(statusPass);
   //CommonApplication_StopProcess();
   Runner.Stop(true);   
}


function GetStack()
{
  var text, fname, parent;
  text = "";
  parent = GetStack().caller;
  do
  {
    fname = parent.toString().match(/function (\w*)/)[1];
    text += fname + "\r\n";
    parent = parent.caller;
  } while (parent);

  return aqString.Trim(text);
}

/**
  * This function sends a mail with the specified data to the mail addresses specified in the config file (EmailToMailAddress XML tag).
  * The mail is used with the mail account builder@ullink.com
  * @param emailSubject      - String  email subject
  * @param emailBody         - String  email body content
  * @param emailAttachment   - array of the attachment files(fullpath)
  * Logs an error if the mail sending fails
  */
function Log_SendEmail(emailSubject, emailBody, emailAttachment)
{
  var smtpServer = "smtp.ullink.lan";
  var smtpPort = 25;
  var userLogin = "builder@ullink.com";
  var userPassword = "builder";
  var useSSL = false;
  var messageFrom = "QAReport@ullink.com";
  var messageTo = GetEmailToMailAddress();
  var messageSubject = emailSubject;
  var messageBody = emailBody;
  var messageAttachment = emailAttachment;

  try
  {
    var schema = "http://schemas.microsoft.com/cdo/configuration/";
    var mConfig = Sys.OleObject("CDO.Configuration");
    mConfig.Fields.$set("Item", schema + "sendusing", 2);
    mConfig.Fields.$set("Item", schema + "smtpserver", smtpServer);
    mConfig.Fields.$set("Item", schema + "smtpserverport", smtpPort);
    mConfig.Fields.$set("Item", schema + "sendusername", userLogin);
    mConfig.Fields.$set("Item", schema + "sendpassword", userPassword);
    mConfig.Fields.$set("Item", schema + "smtpusessl", useSSL);
    mConfig.Fields.$set("Item", schema + "smtpconnectiontimeout", 30);
    mConfig.Fields.Update();

    var mMessage = Sys.OleObject("CDO.Message");
    mMessage.Configuration = mConfig;
    mMessage.From = messageFrom;
    mMessage.To = messageTo;
    mMessage.Subject = messageSubject;
    mMessage.HTMLBody = messageBody;

    if(emailAttachment != null && emailAttachment.length>0)
    {
      for (i=0;i<emailAttachment.length;i++)
      {
        Log.Message("CommonReporting(attachment):" + emailAttachment[i]);
        mMessage.AddAttachment(emailAttachment[i]);
      }
    }

    Log_Trace("CommonReporting(Log_SendEmail): Pararameters configured -> sending the message");
    mMessage.Send();
  }
  catch(e)
  {
    Log_Error("CommonReporting(Log_SendEmail)", e);
  }

  Log_Trace("CommonReporting(Log_SendEmail): The message was successfully sent");
}

/**
  * This function initialises the mail report if the emailMode is true.
  * Default columns are Test Case, Status, Error Description and Execution Logs Path
  * The Log_InitTemplateColumns function is called to initialise the specific columns in the mail report.
  */
function Log_InitEmailFormat()
{
  if (IsEmailMode())
  {
    Log_Trace("CommonReporting(Log_InitEmailFormat): Initialising Email data");

    SetTestSet({});
    SetMailAttachments(new Array());
    SetPictureAttachments(new Array());
    SetMailColumns(_GetEmailColumns());
    _SavePersistedVariables();
  }
}

/**
  * This function gets email columns for the mail report according to the template specified in the config file
  * Template available : PERF -> addition of the log analyzer column in the mail report
  * The default template is used if no template is defined or template doesn't exist
  */
function _GetEmailColumns()
{
  var columns = ["Test Case", "Status", "Error Description"];

  switch (GetEmailTemplate())
  {
    case "PERF":
      columns.push("Log Analyzer");
      break;
    default:
      Log_Trace("CommonReporting(Log_InitTemplateColumns): Default template used (Default columns are Test Case, Status, Error Description and Execution Logs Path)");
  }

  columns.push("User Name");
  columns.push("Execution Logs");

  return columns;
}

/**
  * This function adds the default test case results to the test set mail report.
  * If the test case status is fail or warning, the screenshot of the test case is renamed with the test case Id and added to the report.
  */
function Log_AddTestCaseResult()
{
  var mailTableValues;
  var path;
  var aFile;//the name of the picture found in the folder
  var pictureFile;// path where the picture is located
  var foundFiles;// list with all pictures stored

  if (GetCurrentTestCaseId() != "SendEmail" && GetCurrentTestCaseId() != "InitMailReport")
  {
    _testSet = GetTestSet();
    _mailAttachments = GetMailAttachments();
    _pictureAttachments = GetPictureAttachments();

    if (_testSet == null || _mailAttachments == null)
      Log_InitEmailFormat();

    if (GetCurrentTestCaseStatus() == statusFail)
    {
      path = Log.Path;
      // pictures done when the error occurs have the name Picture1.png, Picture2.png etc. I need to rename only the screenshots that are starting with Picture
      foundFiles = aqFileSystem.FindFiles(path, "Picture*.png", false);

      if (foundFiles)
      {
         while (foundFiles.HasNext())
         {
            aFile = foundFiles.Next();
            pictureFile = path + aFile.Name;
            if (!__Array_CheckElement(pictureFile, GetPictureAttachments()))
            {
              var renamedPictureFile = path + GetCurrentTestCaseId() + "_" + aFile.Name;
              var wasPictureCopied = aqFileSystem.CopyFile(pictureFile, renamedPictureFile);
              if (!wasPictureCopied)
              {
                Log_Trace("[CommonReporting: Log_AddTestCaseResult] Error while renaming the test case screenshot");
                _mailAttachments[_mailAttachments.length] = pictureFile;
              }
              else
                _mailAttachments[_mailAttachments.length] = renamedPictureFile;

              // add the picture to the array in order to ignore the picture when another screenshot will be done
              _pictureAttachments[_pictureAttachments.length] = pictureFile;
          }
        }
      }
    }
    mailTableValues = GetCurrentTestCaseStatus() + "||" + GetCurrentTestCaseDescription() + "||" + GetCurrentTestCaseError() + "||" + GetCurrentTestCaseUserName() + "||" + aqFileSystem.ExpandFileName(GetReportPath());
    _testSet[GetCurrentTestCaseId()] = mailTableValues;
  SetTestSet(_testSet);
  SetMailAttachments(_mailAttachments);
  SetPictureAttachments(_pictureAttachments);
    _SavePersistedVariables();
  }
}

function __Array_CheckElement(searchElement, arrayList)
{
  var length = arrayList.length;

  if (length <= 0)
    return false;

  for(var i = 0; i < length; i++)
    if (arrayList[i] == searchElement)
      return true;

  return false;
}

/**
  * This function adds the specific test case results to the mail report.
  * @columnValues : list of column values must be separated by a comma
  */
function Log_AddSpecificTestCaseResult(columnValues)
{
  if (IsEmailMode() && _testSet.hasOwnProperty(GetCurrentTestCaseId()))
  {
    Log_Trace("CommonReporting(Log_AddTestCaseResult): Adding specific test case result for mail report " + GetCurrentTestCaseId());

      aqString.ListSeparator = "||";
    var defaultTCValues = _testSet[GetCurrentTestCaseId()];
    var listCount = aqString.GetListLength(defaultTCValues) - 1;

    if (columnValues != null)
    {
      //The last value is the reporting path (reportPath)
      defaultTCValues = aqString.AddListItem(defaultTCValues, columnValues, listCount)
    }
    _testSet[GetCurrentTestCaseId()] = defaultTCValues;
    _SavePersistedVariables();
  }
}

/**
  * This function sends the test set results by mail. The mail content consists of a header part followed by a table containing the
  * list of test cases in the test set and a footer section. the screenshots of the failed test cases are also attached to the mail
  * @param emailSubject      - String  email subject
  * @param emailBodyHeader   - String  email body header content
  * @param emailBodyFooter   - String  email body footer content
  */
function Log_SendTestSetResultByEmail(emailSubject, emailBodyHeader, emailBodyFooter)
{
  aqString.ListSeparator="||";
  var columnHeaders;
  var content;
  var testcaseContent="";

  if (!IsEmailMode())
  {
    Log_Error("CommonReporting(Log_SendTestSetResultByEmail): Email mode is not activated");
    return;
  }

  if (_testSet != null)
  {
    var passed = 0;
    var failed = 0;
    var warning = 0;
    _mailColumns = GetMailColumns();
    content = emailBodyHeader + "<p>Please find below the test set report with the status of the test cases.\n  Please note that this email is automatically sent, after test cases run.</p>\n\n <h4>Test cases results</h4> \n";
    columnHeaders = "<table border=\"1\">\n";

    columnHeaders += "<tr> \n";
    for (var i = 0; i < _mailColumns.length; i++)
      columnHeaders += "<th>" + _mailColumns[i] + "</th> \n"

    columnHeaders +="</tr> \n"

    var sortedTestNames = _SortByStatus(_testSet);
    for (var i = 0; i < sortedTestNames.length; i++)
    {
      var test = sortedTestNames[i];
      var testContents = _testSet[test];
      var testStatus =  aqString.GetListItem(testContents, 0);

      if (GetEmailTemplate() != templateFailed ||
          GetEmailTemplate() == templateFailed && testStatus == statusFail ||
          GetEmailTemplate() == templateFailed && testStatus == statusWarning)
      {
        if (test != "CleanReportFiles" && test != "SendEmail")
        {
          testcaseContent += "\n<tr>\n";
          testcaseContent += "<td><center>" + test + "<br><i>" + aqString.GetListItem(testContents,1) + "</i></center></td>\n";
          if (testStatus == statusPass)
          {
            testcaseContent += "<td><font color = \"green\"><center>" + statusPass + "</font></center></td>\n";
            passed++;
          }
          else
          if (testStatus == statusWarning)
          {
            testcaseContent += "<td><font color = \"orange\"><center>" + statusWarning + "</font></center></td>\n";
            warning++
          }
          else
          {
            testcaseContent += "<td><font color = \"red\"><center>" + statusFail + "</font></center></td>\n";
            failed++;
          }

          for (var j = 2; j < aqString.GetListLength(testContents); j++)
          {
            testcaseContent += "<td><center>" + aqString.GetListItem(testContents, j) + "</center></td>\n";
          }
          testcaseContent += "</tr>";
        }
      }
    }

    if (testcaseContent != "")
    {
      content += "\n<h4><td><font color = \"green\">PASSED: " + passed + " </h4> \n<h4> <td><font color = \"red\">FAILED: "+ failed + "</h4>\n<h4><td><font color = \"orange\">WARNING: " + warning + "</h4>";
      content += columnHeaders + testcaseContent + "\n</table>";
    }
    else
      content += "<p>All test cases passed</p>\n";

    content += emailBodyFooter;

  }
  else
    content = emailBodyHeader + "<p>Test set empty, no test cases found.\n  Please note that this email is automatically sent, after test cases run.</p>\n" + emailBodyFooter;

  var emailSubjectWithStatus = (failed === 0 ? warning === 0 ? "[All passed] " /*Success message*/ : "[Passed with warnings] " /*Warning message*/ : "" /*Fail message*/) + emailSubject; // Can add Warning and Failed status later.
  Log_SendEmail(emailSubjectWithStatus, content, _mailAttachments);
}

function Log_Error(message, e)
{
  if (e === null || e === undefined)
    Log_StepError(message);
  else
    Log_StepError(`${message}: Exception raised <${e.message}; stacktrace: ${e.stack}>`);
}