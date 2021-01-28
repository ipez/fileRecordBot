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
    chatId = chatId.toString();  // תstr
    var chatTitle = data.message.chat.title;
    var id = data.message.from.id;  //������id
    var name = data.message.from.first_name + " " + (data.message.from.last_name==undefined?"":data.message.from.last_name);  //����������

    var text = data.message.text; //�ı���Ϣ
    var document = data.message.document; //�ļ���Ϣ

    if(document){
      
      var fileType = document.mime_type;
      var fileName = document.file_name;
      var fileSize = document.file_size;

      // Ⱥ���ϴ���epub������¼������˽����Ϣ���ϴ��ˣ�֪ͨ�Ƿ�ɹ���
      if(groupIdArray.indexOf(chatId)>=0 && fileTypeArray.indexOf(fileType)>=0){
        
        // ���� chatId ���浽sheet
        var sheet = SpreadsheetApp.openById(ssId).getSheetByName(chatId)
        // ���� �ϴ����ڣ��������ļ����ͣ���С���ϴ���
        sheet.appendRow([new Date(), fileName, fileType, fileSize, name]);
        
        // �ж��Ƿ����ͬ���ļ�����������ʾ
        var values = sheet.getDataRange().getValues();
        var searchCount = 0;
        for (var i = 0; i < values.length; i++) {          
          // �ڶ���������
          if (sliceNameType(fileName)[0]==sliceNameType(values[i][1])[0]){
            // sendText(id, searchCount)
            searchCount++;
          }
        }

        if(searchCount==0){
          sendText(id, fileName + " ��¼ʧ�ܣ�����ϵ����Ա");
        }else if(searchCount==1){
          sendText(id, fileName + " ��¼���");
        }else{
          sendText(id, fileName + " �ظ���¼��ǰ���鿴 https://docs.google.com/spreadsheets/d/xxx/edit#")
        }
        
      }
    }

    if(text){
      //test
      // sendText(id,text)
      if(text=="/get_group_info@FileRecordBot"){
        sendText(id,JSON.stringify(data))
      }
      // ��ӭ
    }
     
  } catch(e) {
    sendText(id, JSON.stringify(e,null,4));
  }
}

function sliceNameType(fileName){
  // �����ļ����ͺ�׺��
  // Ŀǰû��Ҫ���Ժ���ļ���ʽ�����õ����ļ�����ͬ�����Ǹ�ʽ��ͬ�����Ը�����ʾ��

  var dotPos = fileName.lastIndexOf('.');
  var fileNameText = fileName.substring(0,dotPos);
  var fileTypeText = fileName.substring(dotPos,fileName.length)
  return [fileNameText, fileTypeText]
}

