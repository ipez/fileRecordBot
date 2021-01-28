// bot token
var token = "";
//
var telegramUrl = "https://api.telegram.org/bot" + token;
// google webapp url
var webAppUrl = ""; 
// google sheet id
var ssId = "";

var groupIdArray = ["-546068282","-1001189742976"];
var fileTypeArray = ["application/epub+zip"];

function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}
function getWebhook(){
  var url = telegramUrl + "/getWebhookinfo";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}
function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("hello world");
}

function doPost(e) {
  try {
    // this is where telegram works
    var data = JSON.parse(e.postData.contents); 
    // sendText(id,JSON.stringify(data));

    var chatId = data.message.chat.id;
    chatId = chatId.toString();  // 转str
    var chatTitle = data.message.chat.title;
    var id = data.message.from.id;  //发信人id
    var name = data.message.from.first_name + " " + (data.message.from.last_name==undefined?"":data.message.from.last_name);  //发信人名字

    var text = data.message.text; //文本消息
    var document = data.message.document; //文件消息

    if(document){
      
      var fileType = document.mime_type;
      var fileName = document.file_name;
      var fileSize = document.file_size;

      // 群内上传，epub，则收录。并发私人消息给上传人，通知是否成功。
      if(groupIdArray.indexOf(chatId)>=0 && fileTypeArray.indexOf(fileType)>=0){
        
        // 按照 chatId 保存到sheet
        var sheet = SpreadsheetApp.openById(ssId).getSheetByName(chatId)
        // 保存 上传日期，书名，文件类型，大小，上传人
        sheet.appendRow([new Date(), fileName, fileType, fileSize, name]);
        
        // 判断是否存在同名文件，并给出提示
        var values = sheet.getDataRange().getValues();
        var searchCount = 0;
        for (var i = 0; i < values.length; i++) {          
          // 第二列是书名
          if (sliceNameType(fileName)[0]==sliceNameType(values[i][1])[0]){
            // sendText(id, searchCount)
            searchCount++;
          }
        }

        if(searchCount==0){
          sendText(id, fileName + " 收录失败，请联系管理员");
        }else if(searchCount==1){
          sendText(id, fileName + " 收录完成");
        }else{
          sendText(id, fileName + " 重复收录，前往查看 https://docs.google.com/spreadsheets/d/xxx/edit#")
        }
        
      }
    }

    if(text){
      //test
      // sendText(id,text)
      if(text=="/get_group_info@FileRecordBot"){
        sendText(id,JSON.stringify(data))
      }
      // 欢迎
    }
     
  } catch(e) {
    sendText(id, JSON.stringify(e,null,4));
  }
}

function sliceNameType(fileName){
  // 返回文件名和后缀名
  // 目前没必要，以后多文件格式可能用到（文件名相同，但是格式不同，可以给出提示）

  var dotPos = fileName.lastIndexOf('.');
  var fileNameText = fileName.substring(0,dotPos);
  var fileTypeText = fileName.substring(dotPos,fileName.length)
  return [fileNameText, fileTypeText]
}

