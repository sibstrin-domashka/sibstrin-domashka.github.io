/* =====================================================================
   Домашка — языки интерфейса.
   Русский (по умолчанию), English, 中文, हिन्दी, Kiswahili.
   Переводятся кнопки, меню, настройки и подписи. Названия частых предметов
   и виды занятий тоже переводятся; ФИО и тексты заданий остаются как есть.
   Чтобы добавить фразу: новая строка [русский, en, zh, hi, sw].
   ===================================================================== */
(function(){
  "use strict";
  var LANGS = [
    { code:"ru", name:"Русский" },
    { code:"en", name:"English" },
    { code:"zh", name:"中文" },
    { code:"hi", name:"हिन्दी" },
    { code:"sw", name:"Kiswahili" }
  ];
  var COL = { en:1, zh:2, hi:3, sw:4 };

  var ROWS = [
    // ---- навигация ----
    ["День","Day","日程","दिन","Siku"],
    ["2 недели","2 weeks","两周","2 सप्ताह","Wiki 2"],
    ["Отметиться","Check in","签到","हाज़िरी","Jisajili"],
    ["Оценки","Grades","成绩","अंक","Alama"],
    ["Ещё","More","更多","और","Zaidi"],
    ["Журнал","Journal","成绩册","रजिस्टर","Daftari"],
    ["QR-отметка","QR check-in","二维码签到","QR हाज़िरी","Usajili wa QR"],
    ["Навигация","Navigation","导航","नेविगेशन","Urambazaji"],
    ["Настройки","Settings","设置","सेटिंग्स","Mipangilio"],
    ["⚙️ Настройки","⚙️ Settings","⚙️ 设置","⚙️ सेटिंग्स","⚙️ Mipangilio"],
    ["Литература","Literature","参考书","पुस्तकें","Vitabu"],
    ["📚 Литература","📚 Literature","📚 参考书","📚 पुस्तकें","📚 Vitabu"],
    ["Расписание сессий","Exam schedule","考试安排","परीक्षा कार्यक्रम","Ratiba ya mitihani"],
    ["🗓️ Расписание сессий","🗓️ Exam schedule","🗓️ 考试安排","🗓️ परीक्षा कार्यक्रम","🗓️ Ratiba ya mitihani"],
    ["🗓️ Расписание сессии","🗓️ Exam schedule","🗓️ 考试安排","🗓️ परीक्षा कार्यक्रम","🗓️ Ratiba ya mitihani"],
    ["Зачёты и экзамены","Credits and exams","考查与考试","क्रेडिट और परीक्षाएँ","Majaribio na mitihani"],
    ["Отзывы о преподавателях","Teacher reviews","教师评价","शिक्षक समीक्षाएँ","Maoni kuhusu walimu"],
    ["Оценки и отзывы студентов","Student ratings and reviews","学生评分和评价","छात्रों की रेटिंग और समीक्षाएँ","Ukadiriaji na maoni ya wanafunzi"],
    ["Пригласить в группу","Invite to group","邀请加入小组","समूह में आमंत्रित करें","Alika kwenye kikundi"],
    ["Пригласить","Invite","邀请","आमंत्रित करें","Alika"],
    ["Ссылка и QR для одногруппников и преподавателей, заявки","Link and QR for classmates and teachers, requests","同学和老师的链接与二维码、申请","सहपाठियों और शिक्षकों के लिए लिंक और QR, अनुरोध","Kiungo na QR kwa wanafunzi wenzako na walimu, maombi"],
    ["Ссылка и QR для студентов и преподавателей","Link and QR for students and teachers","学生和老师的链接与二维码","छात्रों और शिक्षकों के लिए लिंक और QR","Kiungo na QR kwa wanafunzi na walimu"],
    ["Книги и пособия по предметам","Books and guides by subject","按科目分类的书籍和教材","विषय अनुसार पुस्तकें और गाइड","Vitabu na miongozo kwa somo"],
    ["Предложить идею","Suggest an idea","提出建议","सुझाव दें","Pendekeza wazo"],
    ["Что добавить или улучшить","What to add or improve","需要添加或改进什么","क्या जोड़ें या सुधारें","Nini cha kuongeza au kuboresha"],
    ["Сообщить о проблеме","Report a problem","报告问题","समस्या बताएं","Ripoti tatizo"],
    ["Мои обращения","My requests","我的反馈","मेरे अनुरोध","Maombi yangu"],
    ["Ответы владельца","Owner's replies","管理员回复","मालिक के उत्तर","Majibu ya mmiliki"],
    ["Обращения пользователей","User requests","用户反馈","उपयोगकर्ता अनुरोध","Maombi ya watumiaji"],
    ["Проблемы, идеи и жалобы","Problems, ideas and reports","问题、建议和举报","समस्याएँ, सुझाव और शिकायतें","Matatizo, mawazo na malalamiko"],
    ["План курса","Course plan","课程计划","पाठ्यक्रम योजना","Mpango wa kozi"],
    ["Задания по порядку на семестр","Assignments in order for the semester","本学期按顺序的作业","सेमेस्टर के लिए क्रम से असाइनमेंट","Kazi kwa mpangilio wa muhula"],
    ["Книги и пособия для групп","Books and guides for groups","小组书籍和教材","समूहों के लिए पुस्तकें और गाइड","Vitabu na miongozo kwa vikundi"],
    ["Меня не будет","I'll be absent","我将缺席","मैं अनुपस्थित रहूँगा","Sitakuwepo"],
    ["🤒 Меня не будет","🤒 I'll be absent","🤒 我将缺席","🤒 मैं अनुपस्थित रहूँगा","🤒 Sitakuwepo"],
    ["Отмена, замена или онлайн","Cancelled, substitute or online","取消、代课或线上","रद्द, स्थानापन्न या ऑनलाइन","Kufutwa, mbadala au mtandaoni"],
    ["Выйти","Log out","退出","लॉग आउट","Toka"],
    ["План","Plan","计划","योजना","Mpango"],

    // ---- главный экран ----
    ["Следующая пара","Next class","下一节课","अगली कक्षा","Kipindi kijacho"],
    ["Сейчас","Now","现在","अभी","Sasa"],
    ["До сессии","Until exams","距离考试","परीक्षा तक","Hadi mitihani"],
    ["дней","days","天","दिन","siku"],
    ["Пригласи в «Домашку»","Invite to Domashka","邀请加入 Domashka","Domashka में आमंत्रित करें","Alika kwenye Domashka"],
    ["Семестр бесплатно для всей группы","A free semester for your whole group","全组免费一学期","पूरे समूह के लिए एक सेमेस्टर मुफ़्त","Muhula bure kwa kikundi chote"],
    ["Позовите 9 других групп или 6 преподавателей","Invite 9 other groups or 6 teachers","邀请 9 个其他小组或 6 位老师","9 अन्य समूहों या 6 शिक्षकों को आमंत्रित करें","Alika vikundi 9 vingine au walimu 6"],
    ["Спасибо, что зовёте других!","Thanks for inviting others!","感谢您邀请他人！","दूसरों को आमंत्रित करने के लिए धन्यवाद!","Asante kwa kuwaalika wengine!"],
    ["Группы","Groups","小组","समूह","Vikundi"],
    ["Преподаватели","Teachers","老师","शिक्षक","Walimu"],
    ["Показать на 2 недели","Show 2 weeks","显示两周","2 सप्ताह दिखाएँ","Onyesha wiki 2"],
    ["Пар не найдено.","No classes.","没有课程。","कोई कक्षा नहीं।","Hakuna vipindi."],
    ["Расписание пока пустое","The schedule is empty for now","课表暂时为空","समय-सारणी अभी खाली है","Ratiba bado ni tupu"],
    ["ДЗ","HW","作业","गृहकार्य","Kazi"],
    ["ЗАМЕНА","SUBSTITUTE","代课","स्थानापन्न","MBADALA"],
    ["Гость","Guest","访客","अतिथि","Mgeni"],
    ["изм.","edit","编辑","बदलें","hariri"],
    ["Группа","Group","小组","समूह","Kikundi"],
    ["Пн","Mon","周一","सोम","Jtt"],["Вт","Tue","周二","मंगल","Jnn"],["Ср","Wed","周三","बुध","Jtn"],
    ["Чт","Thu","周四","गुरु","Alh"],["Пт","Fri","周五","शुक्र","Ijm"],["Сб","Sat","周六","शनि","Jms"],["Вс","Sun","周日","रवि","Jpl"],
    ["Понедельник","Monday","星期一","सोमवार","Jumatatu"],["Вторник","Tuesday","星期二","मंगलवार","Jumanne"],["Среда","Wednesday","星期三","बुधवार","Jumatano"],
    ["Четверг","Thursday","星期四","गुरुवार","Alhamisi"],["Пятница","Friday","星期五","शुक्रवार","Ijumaa"],["Суббота","Saturday","星期六","शनिवार","Jumamosi"],["Воскресенье","Sunday","星期日","रविवार","Jumapili"],
    ["← Сегодня","← Today","← 今天","← आज","← Leo"],
    ["← Расписание","← Schedule","← 课表","← समय-सारणी","← Ratiba"],

    // ---- пара / задание ----
    ["Когда","When","时间","कब","Lini"],
    ["Предмет","Subject","科目","विषय","Somo"],
    ["Преподаватель","Teacher","老师","शिक्षक","Mwalimu"],
    ["Аудитория","Room","教室","कक्ष","Chumba"],
    ["Изменение","Change","变更","बदलाव","Mabadiliko"],
    ["Сдать до","Due","截止日期","जमा करने की तिथि","Mwisho wa kuwasilisha"],
    ["Домашнее задание","Homework","家庭作业","गृहकार्य","Kazi ya nyumbani"],
    ["Не задано","Not assigned","未布置","नहीं दिया गया","Haijatolewa"],
    ["Темы","Topics","题目","विषय","Mada"],
    ["Темы докладов","Report topics","报告题目","रिपोर्ट के विषय","Mada za ripoti"],
    ["✋ Забрать тему","✋ Take a topic","✋ 选择题目","✋ विषय लें","✋ Chukua mada"],
    ["Забрать","Take","选择","लें","Chukua"],
    ["Отказаться","Give up","放弃","छोड़ें","Acha"],
    ["Пока никто не забрал тему.","Nobody has taken a topic yet.","还没有人选择题目。","अभी तक किसी ने विषय नहीं लिया।","Bado hakuna aliyechukua mada."],
    ["Сдать работу","Submit work","提交作业","काम जमा करें","Wasilisha kazi"],
    ["📎 Прикрепить файлы","📎 Attach files","📎 附加文件","📎 फ़ाइलें जोड़ें","📎 Ambatisha faili"],
    ["Отправить преподавателю","Send to teacher","发送给老师","शिक्षक को भेजें","Tuma kwa mwalimu"],
    ["Комментарий преподавателю (необязательно)","Comment for the teacher (optional)","给老师的留言（可选）","शिक्षक के लिए टिप्पणी (वैकल्पिक)","Maoni kwa mwalimu (si lazima)"],
    ["Отметить выполненным","Mark as done","标记为已完成","पूर्ण चिह्नित करें","Weka kama imekamilika"],
    ["✓ Выполнено","✓ Done","✓ 已完成","✓ पूर्ण","✓ Imekamilika"],
    ["⚑ Пожаловаться на задание","⚑ Report this assignment","⚑ 举报此作业","⚑ इस कार्य की शिकायत करें","⚑ Ripoti kazi hii"],
    ["Номер темы или название","Topic number or title","题目编号或名称","विषय संख्या या नाम","Namba au jina la mada"],

    // ---- оценки, QR ----
    ["📊 Мои оценки","📊 My grades","📊 我的成绩","📊 मेरे अंक","📊 Alama zangu"],
    ["📷 Отметиться на паре","📷 Check in to class","📷 课堂签到","📷 कक्षा में हाज़िरी","📷 Jisajili darasani"],
    ["Наведи камеру на QR-код преподавателя.","Point the camera at the teacher's QR code.","将相机对准老师的二维码。","कैमरा शिक्षक के QR कोड की ओर करें।","Elekeza kamera kwenye QR ya mwalimu."],
    ["пропусков: 1","absences: 1","缺勤：1","अनुपस्थिति: 1","kutokuwepo: 1"],

    // ---- группа и приглашения ----
    ["Пригласить одногруппников","Invite classmates","邀请同学","सहपाठियों को आमंत्रित करें","Alika wanafunzi wenzako"],
    ["Пригласить преподавателя","Invite a teacher","邀请老师","शिक्षक को आमंत्रित करें","Alika mwalimu"],
    ["Пригласить студентов","Invite students","邀请学生","छात्रों को आमंत्रित करें","Alika wanafunzi"],
    ["Отправь ссылку в беседу или канал группы. Новеньких нужно будет подтвердить ниже.","Send the link to your group chat or channel. New members must be approved below.","把链接发到小组群聊或频道。新成员需要在下方确认。","लिंक को समूह चैट या चैनल में भेजें। नए सदस्यों को नीचे स्वीकृत करना होगा।","Tuma kiungo kwenye gumzo au chaneli ya kikundi. Wanachama wapya wanahitaji kuthibitishwa hapa chini."],
    ["Ждут подтверждения","Waiting for approval","等待确认","स्वीकृति की प्रतीक्षा","Wanasubiri kuthibitishwa"],
    ["Заявок нет.","No requests.","没有申请。","कोई अनुरोध नहीं।","Hakuna maombi."],
    ["Поделиться","Share","分享","साझा करें","Shiriki"],
    ["Копировать","Copy","复制","कॉपी करें","Nakili"],
    ["Скопировано!","Copied!","已复制！","कॉपी हो गया!","Imenakiliwa!"],
    ["Скопировать ссылку","Copy link","复制链接","लिंक कॉपी करें","Nakili kiungo"],
    ["зарегистрировался","registered","已注册","पंजीकृत","amesajiliwa"],
    ["ещё не завершил регистрацию","hasn't finished signing up","尚未完成注册","पंजीकरण पूरा नहीं किया","hajakamilisha usajili"],

    // ---- настройки ----
    ["Аккаунт","Account","账户","खाता","Akaunti"],
    ["Имя и фото","Name and photo","姓名和照片","नाम और फ़ोटो","Jina na picha"],
    ["Сменить пароль","Change password","修改密码","पासवर्ड बदलें","Badilisha nenosiri"],
    ["Выйти из аккаунта","Log out","退出账户","खाते से लॉग आउट करें","Toka kwenye akaunti"],
    ["Оформление","Appearance","外观","रूप-रंग","Mwonekano"],
    ["Язык","Language","语言","भाषा","Lugha"],
    ["Фон","Background","背景","पृष्ठभूमि","Mandhari"],
    ["Анимация фона","Background animation","背景动画","पृष्ठभूमि एनिमेशन","Uhuishaji wa mandhari"],
    ["Снег, листья, салют","Snow, leaves, fireworks","雪花、落叶、烟花","बर्फ़, पत्ते, आतिशबाज़ी","Theluji, majani, fataki"],
    ["Размер текста","Text size","文字大小","टेक्स्ट का आकार","Ukubwa wa maandishi"],
    ["Обычный","Normal","正常","सामान्य","Kawaida"],
    ["Крупный","Large","大","बड़ा","Kubwa"],
    ["Очень крупный","Extra large","特大","बहुत बड़ा","Kubwa sana"],
    ["Уведомления","Notifications","通知","सूचनाएँ","Arifa"],
    ["Напоминать о сроках сдачи","Remind me about deadlines","提醒截止日期","समय-सीमा की याद दिलाएँ","Nikumbushe kuhusu muda wa mwisho"],
    ["Плашка «сдать сегодня / завтра» на главном экране","“Due today / tomorrow” banner on the home screen","主屏幕上的“今天/明天截止”提示","होम स्क्रीन पर «आज / कल जमा करें» पट्टी","Bango la «wasilisha leo / kesho» kwenye skrini kuu"],
    ["Данные","Data","数据","डेटा","Data"],
    ["Скачать мои данные","Download my data","下载我的数据","मेरा डेटा डाउनलोड करें","Pakua data yangu"],
    ["Файл со всем, что приложение хранит о тебе","A file with everything the app stores about you","包含应用存储的所有个人信息的文件","ऐप आपके बारे में जो कुछ रखता है, उसकी फ़ाइल","Faili yenye kila kitu programu inachohifadhi kukuhusu"],
    ["Очистить кэш","Clear cache","清除缓存","कैश साफ़ करें","Futa akiba"],
    ["Если что-то отображается неправильно","If something looks wrong","如果显示不正常","अगर कुछ गलत दिख रहा है","Ikiwa kitu kinaonekana vibaya"],
    ["Помощь и документы","Help and documents","帮助与文件","सहायता और दस्तावेज़","Msaada na nyaraka"],
    ["Поддержка","Support","支持","सहायता","Msaada"],
    ["Политика конфиденциальности","Privacy policy","隐私政策","गोपनीयता नीति","Sera ya faragha"],
    ["Пользовательское соглашение","Terms of use","用户协议","उपयोग की शर्तें","Masharti ya matumizi"],
    ["Удалить аккаунт","Delete account","删除账户","खाता हटाएँ","Futa akaunti"],
    ["Владелец","Owner","管理员","मालिक","Mmiliki"],
    ["Студент","Student","学生","छात्र","Mwanafunzi"],
    ["Классический","Classic","经典","क्लासिक","Kawaida"],
    ["Авто — по сезону и праздникам","Auto — by season and holidays","自动 — 按季节和节日","स्वचालित — मौसम और त्योहारों के अनुसार","Otomatiki — kwa msimu na sikukuu"],
    ["❄️ Зима","❄️ Winter","❄️ 冬季","❄️ सर्दी","❄️ Majira ya baridi"],
    ["🌸 Весна","🌸 Spring","🌸 春季","🌸 वसंत","🌸 Majira ya kuchipua"],
    ["☀️ Лето","☀️ Summer","☀️ 夏季","☀️ गर्मी","☀️ Kiangazi"],
    ["🍂 Осень","🍂 Autumn","🍂 秋季","🍂 शरद","🍂 Majira ya kupukutika"],
    ["🎄 Новый год","🎄 New Year","🎄 新年","🎄 नया साल","🎄 Mwaka Mpya"],
    ["⭐ 23 февраля","⭐ Defender of the Fatherland Day","⭐ 祖国保卫者日","⭐ 23 फ़रवरी","⭐ Februari 23"],
    ["🌷 8 марта","🌷 Women's Day","🌷 妇女节","🌷 महिला दिवस","🌷 Siku ya Wanawake"],
    ["🎖️ День Победы","🎖️ Victory Day","🎖️ 胜利日","🎖️ विजय दिवस","🎖️ Siku ya Ushindi"],
    ["📚 1 сентября","📚 Knowledge Day","📚 知识日","📚 ज्ञान दिवस","📚 Siku ya Maarifa"],
    ["🎃 Хэллоуин","🎃 Halloween","🎃 万圣节","🎃 हैलोवीन","🎃 Halloween"],
    ["Новый пароль","New password","新密码","नया पासवर्ड","Nenosiri jipya"],
    ["Повтори","Repeat","重复","दोहराएँ","Rudia"],
    ["Сохранить","Save","保存","सहेजें","Hifadhi"],
    ["Отправить","Send","发送","भेजें","Tuma"],
    ["Пожаловаться","Report","举报","शिकायत करें","Ripoti"],
    ["Твоя идея","Your idea","你的建议","आपका सुझाव","Wazo lako"],
    ["Опиши проблему","Describe the problem","描述问题","समस्या बताएं","Eleza tatizo"],
    ["Удалить навсегда","Delete forever","永久删除","हमेशा के लिए हटाएँ","Futa kabisa"],
    ["Отмена","Cancel","取消","रद्द करें","Ghairi"],
    ["Закрыть","Close","关闭","बंद करें","Funga"],

    // ---- вход ----
    ["Я студент","I'm a student","我是学生","मैं छात्र हूँ","Mimi ni mwanafunzi"],
    ["Я преподаватель","I'm a teacher","我是老师","मैं शिक्षक हूँ","Mimi ni mwalimu"],
    ["Расписание и домашка твоей группы","Your group's schedule and homework","你所在小组的课表和作业","आपके समूह की समय-सारणी और गृहकार्य","Ratiba na kazi za nyumbani za kikundi chako"],
    ["Задания, журнал и посещаемость ваших групп","Assignments, grades and attendance for your groups","您各小组的作业、成绩和考勤","आपके समूहों के कार्य, रजिस्टर और उपस्थिति","Kazi, daftari na mahudhurio ya vikundi vyako"],
    ["Фамилия Имя Отчество","Full name","姓名（姓 名 父称）","पूरा नाम","Jina kamili"],
    ["Далее","Next","下一步","आगे","Endelea"],
    ["Войти","Log in","登录","लॉग इन","Ingia"],
    ["Пароль","Password","密码","पासवर्ड","Nenosiri"],
    ["Придумай пароль","Create a password","设置密码","पासवर्ड बनाएँ","Tengeneza nenosiri"],
    ["Повтори пароль","Repeat password","重复密码","पासवर्ड दोहराएँ","Rudia nenosiri"],
    ["Минимум 6 символов","At least 6 characters","至少 6 个字符","कम से कम 6 अक्षर","Angalau herufi 6"],
    ["Ещё раз","Once more","再输入一次","फिर से","Tena"],
    ["Код доступа","Access code","访问码","एक्सेस कोड","Msimbo wa kuingia"],
    ["Введите ФИО и код доступа из письма.","Enter your full name and the access code from the email.","请输入姓名和邮件中的访问码。","अपना पूरा नाम और ईमेल से एक्सेस कोड दर्ज करें।","Weka jina kamili na msimbo kutoka kwenye barua pepe."],
    ["Нет кода? Оставить заявку на доступ","No code? Request access","没有访问码？申请访问","कोड नहीं है? एक्सेस का अनुरोध करें","Huna msimbo? Omba ufikiaji"],
    ["У меня уже есть код → войти","I already have a code → log in","我已有访问码 → 登录","मेरे पास कोड है → लॉग इन","Nina msimbo tayari → ingia"],
    ["Рабочая почта","Work email","工作邮箱","कार्य ईमेल","Barua pepe ya kazini"],
    ["Предметы (необязательно)","Subjects (optional)","科目（可选）","विषय (वैकल्पिक)","Masomo (si lazima)"],
    ["Отправить заявку","Send request","提交申请","अनुरोध भेजें","Tuma ombi"],
    ["Оставьте заявку — код входа придёт на указанную почту, обычно в течение дня.","Leave a request — the access code will arrive by email, usually within a day.","提交申请后，访问码会发到您的邮箱，通常在一天内。","अनुरोध भेजें — एक्सेस कोड आमतौर पर एक दिन में ईमेल पर आ जाएगा।","Tuma ombi — msimbo utafika kwa barua pepe, kwa kawaida ndani ya siku moja."],
    ["Этот пароль понадобится, чтобы зайти с другого устройства — не забудь его.","You'll need this password to log in on another device — don't forget it.","在其他设备登录时需要此密码，请记住它。","दूसरे डिवाइस पर लॉग इन के लिए यह पासवर्ड चाहिए — इसे न भूलें।","Utahitaji nenosiri hili kuingia kwenye kifaa kingine — usilisahau."],
    ["Я принимаю","I accept the","我接受","मैं स्वीकार करता/करती हूँ","Ninakubali"],
    ["и даю согласие на обработку персональных данных по","and consent to the processing of personal data under the","并同意根据以下政策处理个人数据：","और व्यक्तिगत डेटा के प्रसंस्करण के लिए सहमति देता/देती हूँ:","na ninakubali uchakataji wa data binafsi kwa mujibu wa"],
    ["Политике конфиденциальности","Privacy policy","隐私政策","गोपनीयता नीति","Sera ya faragha"],
    ["Конфиденциальность","Privacy","隐私","गोपनीयता","Faragha"],
    ["Соглашение","Terms","协议","शर्तें","Masharti"],
    ["Независимый студенческий проект, не официальный сервис НГАСУ","An independent student project, not an official NGASU service","独立学生项目，非 NGASU 官方服务","एक स्वतंत्र छात्र परियोजना, NGASU की आधिकारिक सेवा नहीं","Mradi huru wa wanafunzi, si huduma rasmi ya NGASU"],
    ["← Назад, я не тот человек / не та группа","← Back, wrong person / wrong group","← 返回，不是我/不是这个小组","← वापस, गलत व्यक्ति / गलत समूह","← Rudi, si mimi / si kikundi hiki"],
    ["Перейти к расписанию","Go to schedule","前往课表","समय-सारणी पर जाएँ","Nenda kwenye ratiba"],
    ["Ты первый в этой группе!","You're the first in this group!","你是这个小组的第一位成员！","आप इस समूह में पहले हैं!","Wewe ni wa kwanza katika kikundi hiki!"],
    ["Готово! Ты в группе","Done! You're in group","完成！你已加入小组","हो गया! आप समूह में हैं","Imekamilika! Uko kwenye kikundi"],
    ["Заявка отправлена","Request sent","申请已发送","अनुरोध भेजा गया","Ombi limetumwa"],
    ["Проверить ещё раз","Check again","再次检查","फिर से जाँचें","Angalia tena"],
    ["Загрузка...","Loading...","加载中...","लोड हो रहा है...","Inapakia..."],

    // ---- преподаватель ----
    ["Задание","Assignment","作业","कार्य","Kazi"],
    ["Отметки и оценки","Attendance and grades","考勤和成绩","उपस्थिति और अंक","Mahudhurio na alama"],
    ["Сдачи","Submissions","提交","जमा किए गए","Kazi zilizowasilishwa"],
    ["Отмена / замена","Cancel / substitute","取消 / 代课","रद्द / स्थानापन्न","Futa / mbadala"],
    ["Задание не добавлено","No assignment yet","尚未布置作业","कार्य नहीं जोड़ा गया","Hakuna kazi bado"],
    ["✓ Задание добавлено","✓ Assignment added","✓ 已布置作业","✓ कार्य जोड़ा गया","✓ Kazi imeongezwa"],
    ["Фото и файлы","Photos and files","照片和文件","फ़ोटो और फ़ाइलें","Picha na faili"],
    ["📷 Добавить фото","📷 Add photo","📷 添加照片","📷 फ़ोटो जोड़ें","📷 Ongeza picha"],
    ["📎 Добавить файл","📎 Add file","📎 添加文件","📎 फ़ाइल जोड़ें","📎 Ongeza faili"],
    ["К след. паре","For next class","下节课前","अगली कक्षा तक","Kwa kipindi kijacho"],
    ["Сохранить для группы","Save for group","为小组保存","समूह के लिए सहेजें","Hifadhi kwa kikundi"],
    ["Сохранить для потока","Save for all groups","为所有班级保存","सभी समूहों के लिए सहेजें","Hifadhi kwa vikundi vyote"],
    ["Дата пары","Class date","上课日期","कक्षा की तिथि","Tarehe ya kipindi"],
    ["Показать QR-код для отметки","Show QR code for check-in","显示签到二维码","हाज़िरी के लिए QR कोड दिखाएँ","Onyesha QR ya kujisajili"],
    ["Все были","Everyone present","全部出勤","सभी उपस्थित","Wote walikuwepo"],
    ["Был","Present","出勤","उपस्थित","Yupo"],
    ["Нет","Absent","缺勤","अनुपस्थित","Hayupo"],
    ["Опоздал","Late","迟到","देर से","Amechelewa"],
    ["Уваж.","Excused","请假","अनुमति","Ruhusa"],
    ["Свернуть","Minimize","收起","छोटा करें","Punguza"],
    ["Завершить: остальных — «Нет»","Finish: mark the rest absent","结束：其余记为缺勤","समाप्त करें: बाकी अनुपस्थित","Maliza: wengine hawapo"],
    ["По алфавиту","Alphabetical","按字母顺序","वर्णानुक्रम","Kwa alfabeti"],
    ["По среднему баллу ↓","By average ↓","按平均分 ↓","औसत अंक के अनुसार ↓","Kwa wastani ↓"],
    ["По пропускам ↓","By absences ↓","按缺勤 ↓","अनुपस्थिति के अनुसार ↓","Kwa kutokuwepo ↓"],
    ["+ Итоговая колонка","+ Summary column","+ 总评列","+ सारांश कॉलम","+ Safu ya muhtasari"],
    ["🎓 Зачёт / экзамен","🎓 Credit / exam","🎓 考查 / 考试","🎓 क्रेडिट / परीक्षा","🎓 Jaribio / mtihani"],
    ["⬇ Журнал (Excel)","⬇ Journal (Excel)","⬇ 成绩册（Excel）","⬇ रजिस्टर (Excel)","⬇ Daftari (Excel)"],
    ["Пропуски","Absences","缺勤","अनुपस्थिति","Kutokuwepo"],
    ["+ Добавить в план","+ Add to plan","+ 添加到计划","+ योजना में जोड़ें","+ Ongeza kwenye mpango"],
    ["+ Добавить литературу","+ Add literature","+ 添加参考书","+ पुस्तक जोड़ें","+ Ongeza kitabu"],
    ["Что будет с парами","What happens to the classes","课程如何安排","कक्षाओं का क्या होगा","Nini kitatokea kwa vipindi"],
    ["Пары отменяются","Classes are cancelled","课程取消","कक्षाएँ रद्द","Vipindi vimefutwa"],
    ["Будет замена","A substitute will teach","有代课老师","स्थानापन्न शिक्षक होगा","Kutakuwa na mbadala"],
    ["Пары онлайн","Classes online","线上上课","कक्षाएँ ऑनलाइन","Vipindi mtandaoni"],
    ["Отметить пары","Mark classes","标记课程","कक्षाएँ चिह्नित करें","Weka alama kwenye vipindi"],
    ["Кто заменяет","Substitute teacher","代课老师","स्थानापन्न कौन","Mbadala ni nani"],
    ["Пары не будет","No class","没有课","कक्षा नहीं होगी","Hakuna kipindi"],
    ["Пара онлайн","Online class","线上课","ऑनलाइन कक्षा","Kipindi mtandaoni"],
    ["Изменение пары","Class change","课程变更","कक्षा में बदलाव","Mabadiliko ya kipindi"],
    ["В этот день занятий нет.","No classes on this day.","这一天没有课。","इस दिन कोई कक्षा नहीं।","Hakuna vipindi siku hii."],
    ["Отметка по QR","QR check-in","二维码签到","QR हाज़िरी","Usajili wa QR"],
    ["↺ Вставить из прошлых заданий…","↺ Insert from past assignments…","↺ 从以往作业插入…","↺ पिछले कार्यों से डालें…","↺ Weka kutoka kazi za zamani…"],
    ["Что нужно сделать к следующему занятию...","What to do for the next class...","下节课前需要完成什么...","अगली कक्षा के लिए क्या करना है...","Nini kifanyike kwa kipindi kijacho..."],
    ["Завтра","Tomorrow","明天","कल","Kesho"],
    ["Сегодня","Today","今天","आज","Leo"],
    ["Сейчас: Осень","Now: Autumn","当前：秋季","अभी: शरद","Sasa: Majira ya kupukutika"]
  ];


  // ---- предметы (названия с сайта вуза; неизвестные остаются по-русски) ----
  var SUBJECTS = [
    ["Высшая математика","Higher Mathematics","高等数学","उच्च गणित","Hisabati ya Juu"],
    ["Математика","Mathematics","数学","गणित","Hisabati"],
    ["Математический анализ","Calculus","数学分析","गणितीय विश्लेषण","Kalkulasi"],
    ["Линейная алгебра","Linear Algebra","线性代数","रैखिक बीजगणित","Aljebra Mstari"],
    ["Теория вероятностей и математическая статистика","Probability Theory and Statistics","概率论与数理统计","प्रायिकता सिद्धांत और गणितीय सांख्यिकी","Nadharia ya Uwezekano na Takwimu"],
    ["Физика","Physics","物理","भौतिकी","Fizikia"],
    ["Химия","Chemistry","化学","रसायन विज्ञान","Kemia"],
    ["Информатика","Computer Science","计算机科学","कंप्यूटर विज्ञान","Sayansi ya Kompyuta"],
    ["Программирование","Programming","程序设计","प्रोग्रामिंग","Upangaji Programu"],
    ["Компьютерная графика","Computer Graphics","计算机图形学","कंप्यूटर ग्राफ़िक्स","Michoro ya Kompyuta"],
    ["История России","History of Russia","俄罗斯历史","रूस का इतिहास","Historia ya Urusi"],
    ["История","History","历史","इतिहास","Historia"],
    ["Основы российской государственности","Foundations of Russian Statehood","俄罗斯国家制度基础","रूसी राज्यव्यवस्था की नींव","Misingi ya Utaifa wa Urusi"],
    ["Философия","Philosophy","哲学","दर्शनशास्त्र","Falsafa"],
    ["Культурология","Cultural Studies","文化学","संस्कृति अध्ययन","Masomo ya Utamaduni"],
    ["Политология","Political Science","政治学","राजनीति विज्ञान","Sayansi ya Siasa"],
    ["Социология","Sociology","社会学","समाजशास्त्र","Sosholojia"],
    ["Психология","Psychology","心理学","मनोविज्ञान","Saikolojia"],
    ["Правоведение","Law","法学","विधि","Sheria"],
    ["Экономика","Economics","经济学","अर्थशास्त्र","Uchumi"],
    ["Менеджмент","Management","管理学","प्रबंधन","Usimamizi"],
    ["Маркетинг","Marketing","市场营销","विपणन","Masoko"],
    ["Бухгалтерский учёт","Accounting","会计","लेखांकन","Uhasibu"],
    ["Иностранный язык","Foreign Language","外语","विदेशी भाषा","Lugha ya Kigeni"],
    ["Английский язык","English","英语","अंग्रेज़ी","Kiingereza"],
    ["Русский язык и культура речи","Russian Language and Speech Culture","俄语与言语文化","रूसी भाषा और वाक् संस्कृति","Kirusi na Utamaduni wa Usemi"],
    ["Русский язык как иностранный","Russian as a Foreign Language","对外俄语","विदेशी भाषा के रूप में रूसी","Kirusi kama Lugha ya Kigeni"],
    ["Физическая культура и спорт","Physical Education and Sport","体育与运动","शारीरिक शिक्षा और खेल","Elimu ya Viungo na Michezo"],
    ["Физическая культура","Physical Education","体育","शारीरिक शिक्षा","Elimu ya Viungo"],
    ["Элективные дисциплины по физической культуре и спорту","Elective Physical Education","体育选修课","शारीरिक शिक्षा (वैकल्पिक)","Elimu ya Viungo (Hiari)"],
    ["Безопасность жизнедеятельности","Life Safety","生命安全","जीवन सुरक्षा","Usalama wa Maisha"],
    ["Экология","Ecology","生态学","पारिस्थितिकी","Ikolojia"],
    ["Начертательная геометрия","Descriptive Geometry","画法几何","वर्णनात्मक ज्यामिति","Jiometri Elekezi"],
    ["Инженерная графика","Engineering Graphics","工程制图","अभियांत्रिकी ग्राफ़िक्स","Michoro ya Uhandisi"],
    ["Начертательная геометрия и инженерная графика","Descriptive Geometry and Engineering Graphics","画法几何与工程制图","वर्णनात्मक ज्यामिति और अभियांत्रिकी ग्राफ़िक्स","Jiometri Elekezi na Michoro ya Uhandisi"],
    ["Черчение","Technical Drawing","制图","तकनीकी आरेखण","Uchoraji wa Kiufundi"],
    ["Рисунок","Drawing","素描","रेखांकन","Kuchora"],
    ["Живопись","Painting","绘画","चित्रकला","Uchoraji"],
    ["Теоретическая механика","Theoretical Mechanics","理论力学","सैद्धांतिक यांत्रिकी","Mekaniki ya Nadharia"],
    ["Техническая механика","Technical Mechanics","工程力学","तकनीकी यांत्रिकी","Mekaniki ya Kiufundi"],
    ["Сопротивление материалов","Strength of Materials","材料力学","पदार्थों की सामर्थ्य","Uimara wa Vifaa"],
    ["Строительная механика","Structural Mechanics","结构力学","संरचनात्मक यांत्रिकी","Mekaniki ya Miundo"],
    ["Механика грунтов","Soil Mechanics","土力学","मृदा यांत्रिकी","Mekaniki ya Udongo"],
    ["Механика жидкости и газа","Fluid Mechanics","流体力学","द्रव यांत्रिकी","Mekaniki ya Vimiminika"],
    ["Гидравлика","Hydraulics","水力学","जलगतिकी","Haidroliki"],
    ["Строительные материалы","Building Materials","建筑材料","निर्माण सामग्री","Vifaa vya Ujenzi"],
    ["Материаловедение","Materials Science","材料科学","पदार्थ विज्ञान","Sayansi ya Vifaa"],
    ["Строительная физика","Building Physics","建筑物理","भवन भौतिकी","Fizikia ya Majengo"],
    ["Инженерная геодезия","Engineering Geodesy","工程测量","अभियांत्रिकी भूगणित","Upimaji wa Uhandisi"],
    ["Геодезия","Geodesy","测量学","भूगणित","Upimaji Ardhi"],
    ["Инженерная геология","Engineering Geology","工程地质","अभियांत्रिकी भूविज्ञान","Jiolojia ya Uhandisi"],
    ["Основания и фундаменты","Bases and Foundations","地基与基础","आधार और नींव","Misingi na Nguzo"],
    ["Архитектура","Architecture","建筑学","वास्तुकला","Usanifu Majengo"],
    ["Архитектура зданий","Building Architecture","房屋建筑学","भवन वास्तुकला","Usanifu wa Majengo"],
    ["Архитектурное проектирование","Architectural Design","建筑设计","वास्तु डिज़ाइन","Usanifu wa Kubuni"],
    ["Градостроительство","Urban Planning","城市规划","नगर नियोजन","Mipango Miji"],
    ["Строительные конструкции","Building Structures","建筑结构","भवन संरचनाएँ","Miundo ya Majengo"],
    ["Железобетонные конструкции","Reinforced Concrete Structures","钢筋混凝土结构","प्रबलित कंक्रीट संरचनाएँ","Miundo ya Zege Iliyoimarishwa"],
    ["Железобетонные и каменные конструкции","Reinforced Concrete and Masonry Structures","钢筋混凝土与砌体结构","प्रबलित कंक्रीट और चिनाई संरचनाएँ","Miundo ya Zege na Mawe"],
    ["Металлические конструкции","Steel Structures","钢结构","इस्पात संरचनाएँ","Miundo ya Chuma"],
    ["Конструкции из дерева и пластмасс","Timber and Plastic Structures","木结构与塑料结构","लकड़ी और प्लास्टिक संरचनाएँ","Miundo ya Mbao na Plastiki"],
    ["Основы архитектуры и строительных конструкций","Fundamentals of Architecture and Building Structures","建筑与结构基础","वास्तुकला और भवन संरचनाओं के मूल सिद्धांत","Misingi ya Usanifu na Miundo ya Majengo"],
    ["Технология строительного производства","Construction Technology","建筑施工技术","निर्माण प्रौद्योगिकी","Teknolojia ya Ujenzi"],
    ["Технологические процессы в строительстве","Construction Processes","建筑工艺过程","निर्माण में तकनीकी प्रक्रियाएँ","Michakato ya Ujenzi"],
    ["Организация строительного производства","Construction Management","建筑施工组织","निर्माण प्रबंधन","Usimamizi wa Ujenzi"],
    ["Экономика строительства","Construction Economics","建筑经济","निर्माण अर्थशास्त्र","Uchumi wa Ujenzi"],
    ["Строительные машины","Construction Machinery","建筑机械","निर्माण मशीनें","Mitambo ya Ujenzi"],
    ["Теплогазоснабжение и вентиляция","Heating, Gas Supply and Ventilation","供热供气与通风","ताप, गैस आपूर्ति और वेंटिलेशन","Joto, Gesi na Uingizaji Hewa"],
    ["Водоснабжение и водоотведение","Water Supply and Sewerage","给水排水","जल आपूर्ति और जल निकासी","Usambazaji Maji na Majitaka"],
    ["Электротехника","Electrical Engineering","电工学","विद्युत अभियांत्रिकी","Uhandisi wa Umeme"],
    ["Электроснабжение","Power Supply","供电","विद्युत आपूर्ति","Usambazaji wa Umeme"],
    ["Метрология, стандартизация и сертификация","Metrology, Standardization and Certification","计量、标准化与认证","मापिकी, मानकीकरण और प्रमाणन","Metrolojia, Usanifishaji na Uthibitishaji"],
    ["Обследование и испытание зданий и сооружений","Inspection and Testing of Buildings","建筑物检测与试验","भवनों का निरीक्षण और परीक्षण","Ukaguzi na Upimaji wa Majengo"],
    ["Введение в профессию","Introduction to the Profession","专业导论","पेशे का परिचय","Utangulizi wa Taaluma"],
    ["Введение в специальность","Introduction to the Specialty","专业导论","विशेषज्ञता का परिचय","Utangulizi wa Utaalamu"],
    ["Учебная практика","Training Practice","教学实习","प्रशिक्षण अभ्यास","Mafunzo kwa Vitendo"],
    ["Производственная практика","Industrial Placement","生产实习","औद्योगिक प्रशिक्षण","Mafunzo Kazini"],
    // ---- вид занятия ----
    ["Лекция","Lecture","讲座","व्याख्यान","Mhadhara"],
    ["Практика","Practice","实践课","अभ्यास","Mazoezi"],
    ["Лабораторная","Lab","实验课","प्रयोगशाला","Maabara"],
    ["Семинар","Seminar","研讨课","संगोष्ठी","Semina"],
    ["Лек.","Lec.","讲","व्या.","Mhad."],
    ["Пр.","Prac.","练","अभ्या.","Maz."],
    ["Лаб.","Lab","实验","प्रयो.","Maab."],
    ["Сем.","Sem.","研","संगो.","Sem."]
  ];
  var TYPE_IN = { "лекция":"Лекция", "лек.":"Лекция", "практика":"Практика", "пр.":"Практика", "лаб.":"Лабораторная", "лабораторная":"Лабораторная", "семинар":"Семинар", "сем.":"Семинар" };
  var MAP = {}, SUBJ = {};
  function lang(){ try{ return localStorage.getItem("domashka_lang") || "ru"; }catch(e){ return "ru"; } }
  var L = lang();
  if(L !== "ru" && COL[L]){
    ROWS.forEach(function(r){ if(r[COL[L]]) MAP[r[0]] = r[COL[L]]; });
    SUBJECTS.forEach(function(r){ if(r[COL[L]]){ MAP[r[0]] = r[COL[L]]; SUBJ[r[0].toLowerCase().replace(/ё/g, "е")] = r[COL[L]]; } });
  }
  // Составные фразы: «Пара 2», «2 пара», «1 неделя», «Пятница · 1 нед.»
  var WORD = {};
  ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"].forEach(function(d){ if(MAP[d]) WORD[d] = MAP[d]; });
  var PATTERNS = {
    en: [[/^(\d+) пара$/, "Class $1"], [/^Пара (\d+)$/, "Class $1"], [/^(\d+) неделя$/, "Week $1"], [/^Неделя (\d+)$/, "Week $1"], [/^Сейчас: (.+)$/, "Now: $1"], [/^Студент · группа (.+)$/, "Student · group $1"]],
    zh: [[/^(\d+) пара$/, "第$1节"], [/^Пара (\d+)$/, "第$1节"], [/^(\d+) неделя$/, "第$1周"], [/^Неделя (\d+)$/, "第$1周"], [/^Сейчас: (.+)$/, "当前：$1"], [/^Студент · группа (.+)$/, "学生 · $1 组"]],
    hi: [[/^(\d+) пара$/, "कक्षा $1"], [/^Пара (\d+)$/, "कक्षा $1"], [/^(\d+) неделя$/, "सप्ताह $1"], [/^Неделя (\d+)$/, "सप्ताह $1"], [/^Сейчас: (.+)$/, "अभी: $1"], [/^Студент · группа (.+)$/, "छात्र · समूह $1"]],
    sw: [[/^(\d+) пара$/, "Kipindi $1"], [/^Пара (\d+)$/, "Kipindi $1"], [/^(\d+) неделя$/, "Wiki $1"], [/^Неделя (\d+)$/, "Wiki $1"], [/^Сейчас: (.+)$/, "Sasa: $1"], [/^Студент · группа (.+)$/, "Mwanafunzi · kikundi $1"]]
  };
  var WEEK_SHORT = { en:"wk", zh:"周", hi:"सप्ताह", sw:"wiki" };

  var AUD = { en:"room", zh:"室", hi:"कक्ष", sw:"chumba" };
  var GR = { en:"gr.", zh:"组", hi:"समूह", sw:"kikundi" };
  var DUE = { en:"due:", zh:"截止：", hi:"जमा करें:", sw:"wasilisha:" };
  function tr(v){
    var t = v.trim();
    if(!t || !/[А-Яа-яЁё]/.test(t)) return null;
    if(/^сдать: /.test(t) && DUE[L]) return v.replace("сдать:", DUE[L]);
    if(MAP[t]) return v.replace(t, MAP[t]);
    var lk = t.toLowerCase().replace(/ё/g, "е");
    if(SUBJ[lk]) return v.replace(t, SUBJ[lk]);
    var sm = /^(.+?)\s*\((лекция|практика|лаб\.|лабораторная|семинар|сем\.)\)$/i.exec(t);
    if(sm){
      var base = SUBJ[sm[1].toLowerCase().replace(/ё/g, "е")] || sm[1], ty = TYPE_IN[sm[2].toLowerCase()];
      return v.replace(t, base + " (" + ((ty && MAP[ty]) || sm[2]) + ")");
    }
    if(/(Лек\.|Пр\.|Лаб\.|Сем\.)\s*\/|ауд\.|\sгр\./.test(t)){
      var o2 = t.replace(/(^|[\s(,·])(Лек\.|Пр\.|Лаб\.|Сем\.)\s*\//g, function(_, a, b){ return a + (MAP[b] || b) + " /"; })
                .replace(/ ауд\.?/g, AUD[L] ? " " + AUD[L] : " ауд.")
                .replace(/ гр\./g, GR[L] ? " " + GR[L] : " гр.");
      if(o2 !== t) return v.replace(t, o2);
    }
    var m = /^(Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье) · (\d) нед\.$/.exec(t);
    if(m && WORD[m[1]]) return v.replace(t, WORD[m[1]] + " · " + m[2] + " " + (WEEK_SHORT[L] || ""));
    var ps = PATTERNS[L] || [];
    for(var i = 0; i < ps.length; i++){
      if(ps[i][0].test(t)){
        var out = t.replace(ps[i][0], ps[i][1]);
        if(/^Сейчас: /.test(t)){ var rest = t.slice(8); out = out.replace(rest, MAP[rest] || rest); }
        return v.replace(t, out);
      }
    }
    return null;
  }
  var ATTRS = ["placeholder", "aria-label", "title"];
  function walk(root){
    if(!root) return;
    if(root.nodeType === 3){ var x = tr(root.nodeValue); if(x !== null && x !== root.nodeValue) root.nodeValue = x; return; }
    if(root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.tagName)) return;
    ATTRS.forEach(function(a){ var v = root.getAttribute && root.getAttribute(a); if(v){ var y = tr(v); if(y !== null && y !== v) root.setAttribute(a, y); } });
    if(root.tagName === "TEXTAREA" || root.tagName === "INPUT") return;
    if(root.tagName === "OPTION"){ var o = tr(root.textContent); if(o !== null) root.textContent = o; return; }
    for(var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }
  function start(){
    document.documentElement.setAttribute("lang", L);
    if(L === "ru" || !COL[L]) return;
    walk(document.body);
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        if(m.type === "characterData") walk(m.target);
        else m.addedNodes.forEach(function(n){ walk(n); });
      });
    }).observe(document.body, { childList:true, subtree:true, characterData:true });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  window.DomashkaI18n = {
    langs: LANGS,
    current: function(){ return L; },
    set: function(code){ try{ localStorage.setItem("domashka_lang", code); }catch(e){} location.reload(); },
    t: function(ru){ return MAP[ru] || ru; }
  };
})();
