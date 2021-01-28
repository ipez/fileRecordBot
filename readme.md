### fileRecordBot

一个简单的 telegram bot 用于记录 telegram group 内上传的 epub 信息。


#### 1. 通过@BotFather 创建bot，并记下token；
	例如： 123456789:ABCdefGHIjKlmNOPQRSTuv_WXYZabcDEfijk

#### 2. 新建一个google sheet，并记下sheet id；
	例如： https://docs.google.com/spreadsheets/d/ **HERE IS SHEET ID** /edit#

#### 3. 新建一个google script，并部署为网络应用，记下web app url；
	例如： https://script.google.com/macros/s/adfdjfaldfjlakfj/exec

#### 4. 运行脚本时，先在编辑器内运行 setWebhook()函数 将webapp url绑定到bot。
