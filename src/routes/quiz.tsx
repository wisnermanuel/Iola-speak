import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const CDN = "https://cdn-eu.lolaenglish.com/web-images%2F";
const GCS = "https://storage.googleapis.com/cdn-eu.lolaenglish.com/";
const CF  = "75b2bc08bf7b942ba7c1d5582f937ab0";
const G   = "#AEEA00";

const LANGUAGES = [
  { id:71, iso:"es", name:"Español",    icon:GCS+"spain_J6q4m4B.png" },
  { id:67, iso:"bg", name:"Български",  icon:GCS+"bulgaria_UnvHOUX.png" },
  { id:96, iso:"zh", name:"中文",        icon:GCS+"china_R8GnlTm.png" },
  { id:68, iso:"cs", name:"Čeština",    icon:GCS+"czech_republic_O4ayRIR.png" },
  { id:69, iso:"de", name:"Deutsch",    icon:GCS+"germany_H56jXL4.png" },
  { id:97, iso:"en", name:"English",    icon:GCS+"Globe_Showing_Americas_sfMQFno.png" },
  { id:94, iso:"uk", name:"Українська", icon:GCS+"ukraine_FQtX9TE.png" },
  { id:72, iso:"fi", name:"Suomi",      icon:GCS+"finland_Gxthusg.png" },
  { id:73, iso:"fr", name:"Français",   icon:GCS+"france_lwYfTCr.png" },
  { id:70, iso:"el", name:"Ελληνικά",   icon:GCS+"greece_NvBUlwu.png" },
  { id:76, iso:"id", name:"Indonesia",  icon:GCS+"indonesia_xfhfHrh.png" },
  { id:77, iso:"it", name:"Italiano",   icon:GCS+"italy_tTy3Oxj.png" },
  { id:79, iso:"ja", name:"日本語",      icon:GCS+"japan_f90mLqQ.png" },
  { id:82, iso:"ko", name:"한국어",      icon:GCS+"south_korea_0uTBFCK.png" },
  { id:86, iso:"pl", name:"Polski",     icon:GCS+"poland_ibRsVmf.png" },
  { id:87, iso:"pt", name:"Português",  icon:GCS+"portugal_RlfmN9d.png" },
  { id:89, iso:"ru", name:"Русский",    icon:GCS+"russia_3vg3oKY.png" },
  { id:90, iso:"sv", name:"Svenska",    icon:GCS+"sweden_2jwEXlz.png" },
  { id:93, iso:"tr", name:"Türkçe",     icon:GCS+"turkey_SiNtSwZ.png" },
  { id:98, iso:"en", name:"Other",      icon:GCS+"Globe_Showing_Americas_sfMQFno.png" },
];

type Item = { id:number; title:string; image:string; localized:Record<string,string> };

const HOWS: Item[] = [
  { id:1, title:"At school",       image:GCS+"school_copy_Mu7o281.webp",     localized:{"71":"En la escuela","69":"In der Schule","73":"À l'école","77":"A scuola","87":"Na escola","97":"At school","94":"У школі","89":"В школе","82":"학교에서","79":"学校で"} },
  { id:2, title:"At university",   image:GCS+"university_copy_X4gz91q.webp", localized:{"71":"En la universidad","69":"An der Universität","73":"À l'université","77":"All'università","87":"Na universidade","97":"At university","94":"В університеті","89":"В университете","82":"대학에서","79":"大学で"} },
  { id:3, title:"Studying abroad", image:GCS+"abroad_copy_4es3Fkm.webp",     localized:{"71":"Estudiar en el extranjero","69":"Studieren im Ausland","73":"Étudier à l'étranger","77":"Studiare all'estero","87":"Estudar no estrangeiro","97":"Studying abroad","94":"Навчання за кордоном","89":"Учёба за границей","82":"해외 유학","79":"海外留学"} },
  { id:4, title:"With a tutor",    image:GCS+"tutor_copy_mPRvNvc.webp",      localized:{"71":"Con un tutor","69":"Mit einem Privatlehrer","73":"Avec un prof particulier","77":"Con un tutor","87":"Com um explicador","97":"With a tutor","94":"З репетитором","89":"С репетитором","82":"과외 선생님과","79":"家庭教師と"} },
  { id:5, title:"With apps",       image:GCS+"apps_copy_J7EtGTR.webp",       localized:{"71":"Con aplicaciones","69":"Mit Apps","73":"Avec des applications","77":"Con le applicazioni","87":"Com aplicações","97":"With apps","94":"З додатками","89":"С приложениями","82":"앱 사용","79":"アプリ"} },
  { id:6, title:"With textbooks",  image:GCS+"textbooks_copy_sjujkin.webp",  localized:{"71":"Con libros de texto","69":"Mit Lehrbüchern","73":"Avec des manuels","77":"Con i libri di testo","87":"Com manuais","97":"With textbooks","94":"З підручниками","89":"С учебниками","82":"교과서 사용","79":"教科書で"} },
];

const WHYS: Item[] = [
  { id:1, title:"Vacation",         image:GCS+"Vacation_copy_6kuRxes.webp",     localized:{"71":"Vacaciones","69":"Urlaub","73":"Vacances","77":"Vacanza","87":"Férias","97":"Vacation","94":"Відпустка","89":"Отпуск","82":"휴가","79":"バケーション"} },
  { id:2, title:"Work",             image:GCS+"Work_copy_HjgTKvd.webp",         localized:{"71":"Trabajo","69":"Arbeit","73":"Travail","77":"Lavoro","87":"Trabalho","97":"Work","94":"Робота","89":"Работа","82":"업무","79":"仕事"} },
  { id:3, title:"Plan to live abroad",image:GCS+"live_abroad_copy_8exzQTX.webp",localized:{"71":"Vivir en el extranjero","69":"Im Ausland leben","73":"Vivre à l'étranger","77":"Trasferirsi all'estero","87":"Viver no estrangeiro","97":"Plan to live abroad","94":"Жити за кордоном","89":"Жить за границей","82":"해외 거주 계획","79":"海外での生活計画"} },
  { id:4, title:"To make friends",  image:GCS+"friends_copy_g1EALjz.webp",      localized:{"71":"Hacer amigos","69":"Freunde finden","73":"Se faire des amis","77":"Fare amicizia","87":"Fazer amigos","97":"Make friends","94":"Завести друзів","89":"Завести друзей","82":"친구 사귀기","79":"友人を作る"} },
  { id:5, title:"Fun",              image:GCS+"fun_copy_SqyBBhd.webp",          localized:{"71":"Diversión","69":"Spaß","73":"S'amuser","77":"Divertimento","87":"Diversão","97":"Fun","94":"Розваги","89":"Веселье","82":"재미","79":"楽しみのため"} },
  { id:6, title:"Pass an exam",     image:GCS+"exam_copy_DqThQhY.webp",         localized:{"71":"Aprobar un examen","69":"Prüfung bestehen","73":"Réussir un examen","77":"Superare un esame","87":"Passar num exame","97":"Pass an exam","94":"Скласти іспит","89":"Сдать экзамен","82":"시험 합격","79":"試験に合格する"} },
];

const STRUGGLES: Item[] = [
  { id:3, title:"Lack of Practice",         image:GCS+"Frame_296483448.webp",           localized:{"71":"Falta de práctica","69":"Fehlende Übung","73":"Manque de pratique","77":"Mancanza di pratica","87":"Falta de prática","97":"Lack of Practice","94":"Брак практики","89":"Недостаток практики","82":"연습 부족","79":"練習不足"} },
  { id:1, title:"Fear of Speaking",         image:GCS+"Speaking_copy_Gjmop4g.webp",     localized:{"71":"Miedo a hablar","69":"Sprechangst","73":"Peur de parler","77":"Paura di parlare","87":"Medo de falar","97":"Fear of Speaking","94":"Страх говорити","89":"Страх говорить","82":"말하기 두려움","79":"スピーキングへの恐怖"} },
  { id:5, title:"Pronunciation",            image:GCS+"Pronunciation_copy_O3xcdsY.webp", localized:{"71":"Pronunciación","69":"Aussprache","73":"Prononciation","77":"Pronuncia","87":"Pronúncia","97":"Pronunciation","94":"Вимова","89":"Произношение","82":"발음","79":"発音"} },
  { id:4, title:"Listening & Understanding",image:GCS+"Listening_copy_4ycnelw.webp",    localized:{"71":"Escucha y comprensión","69":"Hören & Verstehen","73":"Écoute & compréhension","77":"Ascolto e comprensione","87":"Escuta e compreensão","97":"Listening & Understanding","94":"Слухання","89":"Слух и понимание","82":"듣기 및 이해","79":"リスニング"} },
  { id:6, title:"Vocabulary",               image:GCS+"Vocabulary_copy_XpPc5CJ.webp",   localized:{"71":"Vocabulario","69":"Wortschatz","73":"Vocabulaire","77":"Vocabolario","87":"Vocabulário","97":"Vocabulary","94":"Словниковий запас","89":"Словарный запас","82":"어휘","79":"語彙"} },
];

const TOPICS = [
  { id:1,  title:"Adventure",  image:GCS+"Adventure_icon.webp" },
  { id:2,  title:"Art",        image:GCS+"Art.webp" },
  { id:3,  title:"Beauty",     image:GCS+"Beauty.webp" },
  { id:4,  title:"Business",   image:GCS+"Business.webp" },
  { id:5,  title:"Career",     image:GCS+"Career_icon.webp" },
  { id:7,  title:"Daily Life", image:GCS+"Daily.webp" },
  { id:8,  title:"Doctor",     image:GCS+"Doctor.webp" },
  { id:10, title:"Embassy",    image:GCS+"Embassy.webp" },
  { id:11, title:"Food",       image:GCS+"Food.webp" },
  { id:12, title:"Gym",        image:GCS+"Gym.webp" },
  { id:13, title:"Party",      image:GCS+"Party.webp" },
  { id:14, title:"Politics",   image:GCS+"Politics.webp" },
  { id:15, title:"Restaurant", image:GCS+"Restaurant.webp" },
  { id:16, title:"Romance",    image:GCS+"Romance_romance.webp" },
  { id:17, title:"Shopping",   image:GCS+"Shopping.webp" },
  { id:18, title:"Tech",       image:GCS+"Tech.webp" },
  { id:19, title:"Travel",     image:GCS+"Travel_icon.webp" },
];

const PLANS = [
  { id:"week",    label:"1 semana", save:"AHORRA 40%", orig:"$14.99", sale:"$8.99",  per:"$1.28 / día", popular:false },
  { id:"month",   label:"1 mes",    save:"AHORRA 50%", orig:"$29.99", sale:"$14.99", per:"$0.50 / día", popular:true  },
  { id:"quarter", label:"3 meses",  save:"AHORRA 49%", orig:"$69.99", sale:"$34.99", per:"$0.39 / día", popular:false },
];

// ─── i18n ──────────────────────────────────────────────────────────────────────
const S: Record<string,Record<string,string>> = {
  es:{ next:"Siguiente", skip:"Saltar", unlock:"Desbloquea tu potencial en inglés", plan:"Obtén un plan de aprendizaje personalizado adaptado a tus objetivos", quiz3:"Cuestionario de 3 minutos", nativeLang:"¿Cuál es tu idioma nativo?", nameQ:"¿Cómo te llamas?", welcome:"¡Bienvenido a bordo", pp1:"Vamos a crear tu", pp2:"plan personal", levelQ:"¿Qué tan bien dominas el inglés?", beg:"Sé un poco", mid:"Puedo tener una conversación sencilla", adv:"Hablo con confianza", howQ:"¿Cómo has estudiado inglés?", whyQ:"¿Por qué quieres aprender inglés?", strugQ:"Dificultades", topicQ:"¿Qué temas te interesan?", goalQ:"¿Cuánto tiempo practicas al día?", emailQ:"Ingresa tu email para guardar tu plan", emailSub:"Recibirás tu plan personalizado gratis", building:"Construyendo tu plan...", choosePlan:"Elige tu plan", goodHands:"Estás en buenas manos", source:"FUENTE", startNow:"Comenzar ahora", planSub:"Acceso completo · Cancela cuando quieras" },
  en:{ next:"Next", skip:"Skip", unlock:"Unlock your English potential", plan:"Get a personalized learning plan tailored to your goals", quiz3:"3 minute quiz", nativeLang:"What is your native language?", nameQ:"What's your name?", welcome:"Welcome aboard", pp1:"Let's create your", pp2:"personal plan", levelQ:"How well do you know English?", beg:"I know a little", mid:"I can have simple conversations", adv:"I speak confidently", howQ:"How have you studied English?", whyQ:"Why do you want to learn English?", strugQ:"Difficulties", topicQ:"What topics interest you?", goalQ:"How much do you practice per day?", emailQ:"Enter your email to save your plan", emailSub:"You'll receive your personalized plan for free", building:"Building your plan...", choosePlan:"Choose your plan", goodHands:"You're in good hands", source:"SOURCE", startNow:"Start now", planSub:"Full access · Cancel anytime" },
  de:{ next:"Weiter", skip:"Überspringen", unlock:"Entfalte dein Englischpotenzial", plan:"Erhalte einen personalisierten Lernplan, der auf deine Ziele zugeschnitten ist", quiz3:"3-Minuten-Quiz", nativeLang:"Was ist deine Muttersprache?", nameQ:"Wie heißt du?", welcome:"Willkommen an Bord", pp1:"Lass uns deinen", pp2:"persönlichen Plan erstellen", levelQ:"Wie gut sprichst du Englisch?", beg:"Ich kenne ein bisschen", mid:"Ich kann einfache Gespräche führen", adv:"Ich spreche selbstbewusst", howQ:"Wie hast du Englisch gelernt?", whyQ:"Warum möchtest du Englisch lernen?", strugQ:"Schwierigkeiten", topicQ:"Welche Themen interessieren dich?", goalQ:"Wie viel übst du pro Tag?", emailQ:"Gib deine E-Mail ein, um deinen Plan zu speichern", emailSub:"Du erhältst deinen personalisierten Plan kostenlos", building:"Plan wird erstellt...", choosePlan:"Wähle deinen Plan", goodHands:"Du bist in guten Händen", source:"QUELLE", startNow:"Jetzt beginnen", planSub:"Voller Zugang · Jederzeit kündbar" },
  fr:{ next:"Suivant", skip:"Passer", unlock:"Libérez votre potentiel en anglais", plan:"Obtenez un plan d'apprentissage personnalisé adapté à vos objectifs", quiz3:"Quiz de 3 minutes", nativeLang:"Quelle est votre langue natale ?", nameQ:"Comment vous appelez-vous ?", welcome:"Bienvenue à bord", pp1:"Créons votre", pp2:"plan personnel", levelQ:"Quel est votre niveau d'anglais ?", beg:"Je sais un peu", mid:"Je peux avoir de simples conversations", adv:"Je parle avec confiance", howQ:"Comment avez-vous étudié l'anglais ?", whyQ:"Pourquoi voulez-vous apprendre l'anglais ?", strugQ:"Difficultés", topicQ:"Quels sujets vous intéressent ?", goalQ:"Combien de temps pratiquez-vous par jour ?", emailQ:"Entrez votre email pour sauvegarder votre plan", emailSub:"Vous recevrez votre plan personnalisé gratuitement", building:"Construction de votre plan...", choosePlan:"Choisissez votre plan", goodHands:"Vous êtes entre de bonnes mains", source:"SOURCE", startNow:"Commencer maintenant", planSub:"Accès complet · Annulez quand vous voulez" },
  it:{ next:"Avanti", skip:"Salta", unlock:"Sblocca il tuo potenziale in inglese", plan:"Ottieni un piano di apprendimento personalizzato in base ai tuoi obiettivi", quiz3:"Quiz di 3 minuti", nativeLang:"Qual è la tua lingua madre?", nameQ:"Come ti chiami?", welcome:"Benvenuto a bordo", pp1:"Creiamo il tuo", pp2:"piano personale", levelQ:"Quanto bene conosci l'inglese?", beg:"So un po'", mid:"Posso avere conversazioni semplici", adv:"Parlo con sicurezza", howQ:"Come hai studiato l'inglese?", whyQ:"Perché vuoi imparare l'inglese?", strugQ:"Difficoltà", topicQ:"Quali argomenti ti interessano?", goalQ:"Quanta pratica fai al giorno?", emailQ:"Inserisci la tua email per salvare il piano", emailSub:"Riceverai il tuo piano personalizzato gratuitamente", building:"Creazione del piano...", choosePlan:"Scegli il tuo piano", goodHands:"Sei in buone mani", source:"FONTE", startNow:"Inizia ora", planSub:"Accesso completo · Annulla quando vuoi" },
  pt:{ next:"Próximo", skip:"Pular", unlock:"Desbloqueia o teu potencial em inglês", plan:"Obtém um plano de aprendizagem personalizado adaptado aos teus objetivos", quiz3:"Questionário de 3 minutos", nativeLang:"Qual é o teu idioma nativo?", nameQ:"Como te chamas?", welcome:"Bem-vindo a bordo", pp1:"Vamos criar o teu", pp2:"plano pessoal", levelQ:"Qual é o teu nível de inglês?", beg:"Sei um pouco", mid:"Consigo ter conversas simples", adv:"Falo com confiança", howQ:"Como estudaste inglês?", whyQ:"Por que queres aprender inglês?", strugQ:"Dificuldades", topicQ:"Que tópicos te interessam?", goalQ:"Quanto praticas por dia?", emailQ:"Introduz o teu email para guardar o plano", emailSub:"Receberás o teu plano personalizado gratuitamente", building:"Construindo o teu plano...", choosePlan:"Escolhe o teu plano", goodHands:"Estás em boas mãos", source:"FONTE", startNow:"Começar agora", planSub:"Acesso completo · Cancela quando quiseres" },
  ru:{ next:"Далее", skip:"Пропустить", unlock:"Раскройте свой потенциал в английском", plan:"Получите персонализированный план обучения, разработанный с учётом ваших целей", quiz3:"Тест на 3 минуты", nativeLang:"Какой у вас родной язык?", nameQ:"Как вас зовут?", welcome:"Добро пожаловать", pp1:"Давайте создадим ваш", pp2:"персональный план", levelQ:"Как хорошо вы знаете английский?", beg:"Знаю немного", mid:"Могу вести простые разговоры", adv:"Говорю уверенно", howQ:"Как вы изучали английский?", whyQ:"Зачем вы хотите выучить английский?", strugQ:"Трудности", topicQ:"Какие темы вас интересуют?", goalQ:"Сколько времени вы практикуете в день?", emailQ:"Введите email для сохранения плана", emailSub:"Вы получите персонализированный план бесплатно", building:"Создаём ваш план...", choosePlan:"Выберите план", goodHands:"Вы в надёжных руках", source:"ИСТОЧНИК", startNow:"Начать сейчас", planSub:"Полный доступ · Отмена в любое время" },
  uk:{ next:"Далі", skip:"Пропустити", unlock:"Розкрийте свій потенціал в англійській", plan:"Отримай персоналізований план навчання відповідно до своїх цілей", quiz3:"3-хвилинний тест", nativeLang:"Яка ваша рідна мова?", nameQ:"Як вас звати?", welcome:"Ласкаво просимо", pp1:"Давайте створимо ваш", pp2:"персональний план", levelQ:"Як добре ви знаєте англійську?", beg:"Знаю трохи", mid:"Можу вести прості розмови", adv:"Говорю впевнено", howQ:"Як ви вивчали англійську?", whyQ:"Навіщо ви хочете вивчити англійську?", strugQ:"Труднощі", topicQ:"Які теми вас цікавлять?", goalQ:"Скільки часу ви практикуєте щодня?", emailQ:"Введіть email для збереження плану", emailSub:"Ви отримаєте персоналізований план безкоштовно", building:"Будуємо ваш план...", choosePlan:"Оберіть план", goodHands:"Ви в надійних руках", source:"ДЖЕРЕЛО", startNow:"Почати зараз", planSub:"Повний доступ · Скасуйте будь-коли" },
  bg:{ next:"Напред", skip:"Пропусни", unlock:"Отключи потенциала си по английски", plan:"Получи персонализиран план за учене, съобразен с целите ти", quiz3:"3-минутен тест", nativeLang:"Кой е твоят роден език?", nameQ:"Как се казваш?", welcome:"Добре дошъл на борда", pp1:"Нека създадем твоя", pp2:"личен план", levelQ:"Колко добре знаеш английски?", beg:"Знам малко", mid:"Мога да водя прости разговори", adv:"Говоря уверено", howQ:"Как си учил английски?", whyQ:"Защо искаш да учиш английски?", strugQ:"Затруднения", topicQ:"Какви теми те интересуват?", goalQ:"Колко практикуваш на ден?", emailQ:"Въведи имейл, за да запазиш плана си", emailSub:"Ще получиш персонализирания си план безплатно", building:"Изграждаме твоя план...", choosePlan:"Избери своя план", goodHands:"В добри ръце си", source:"ИЗТОЧНИК", startNow:"Започни сега", planSub:"Пълен достъп · Анулирай по всяко време" },
  zh:{ next:"下一步", skip:"跳过", unlock:"释放你的英语潜能", plan:"获取专为你目标定制的个性化学习计划", quiz3:"3分钟测验", nativeLang:"你的母语是什么？", nameQ:"你叫什么名字？", welcome:"欢迎加入", pp1:"让我们制定你的", pp2:"个人计划", levelQ:"你的英语水平如何？", beg:"略知一二", mid:"能进行简单对话", adv:"能自信地交流", howQ:"你是怎么学英语的？", whyQ:"你为什么想学英语？", strugQ:"困难", topicQ:"你对哪些话题感兴趣？", goalQ:"你每天练习多长时间？", emailQ:"输入邮箱以保存你的计划", emailSub:"你将免费获得个性化计划", building:"正在制定你的计划...", choosePlan:"选择你的计划", goodHands:"你放心交给我们", source:"来源", startNow:"立即开始", planSub:"完整访问 · 随时取消" },
  cs:{ next:"Další", skip:"Přeskočit", unlock:"Odemkni svůj potenciál v angličtině", plan:"Získej personalizovaný plán učení přizpůsobený tvým cílům", quiz3:"3minutový kvíz", nativeLang:"Jaký je tvůj rodný jazyk?", nameQ:"Jak se jmenuješ?", welcome:"Vítej na palubě", pp1:"Pojďme vytvořit tvůj", pp2:"osobní plán", levelQ:"Jak dobře ovládáš angličtinu?", beg:"Vím trochu", mid:"Zvládnu jednoduché rozhovory", adv:"Mluvím sebejistě", howQ:"Jak jsi studoval angličtinu?", whyQ:"Proč se chceš učit anglicky?", strugQ:"Obtíže", topicQ:"Jaká témata tě zajímají?", goalQ:"Kolik hodin denně procvičuješ?", emailQ:"Zadej e-mail pro uložení plánu", emailSub:"Obdržíš svůj personalizovaný plán zdarma", building:"Sestavujeme tvůj plán...", choosePlan:"Vyber si plán", goodHands:"Jsi v dobrých rukou", source:"ZDROJ", startNow:"Začít teď", planSub:"Plný přístup · Kdykoli zrušíš" },
  fi:{ next:"Seuraava", skip:"Ohita", unlock:"Vapauta englannin potentiaalisi", plan:"Hanki tavoitteidesi mukainen henkilökohtainen oppimissuunnitelma", quiz3:"3 minuutin testi", nativeLang:"Mikä on äidinkielesi?", nameQ:"Mikä sinun nimesi on?", welcome:"Tervetuloa mukaan", pp1:"Luodaan sinulle", pp2:"henkilökohtainen suunnitelma", levelQ:"Kuinka hyvin osaat englantia?", beg:"Osaan vähän", mid:"Pystyn yksinkertaisiin keskusteluihin", adv:"Puhun sujuvasti", howQ:"Miten olet opiskellut englantia?", whyQ:"Miksi haluat oppia englantia?", strugQ:"Vaikeudet", topicQ:"Mitkä aiheet kiinnostavat sinua?", goalQ:"Kuinka paljon harjoittelet päivässä?", emailQ:"Anna sähköpostiosoitteesi suunnitelman tallentamiseksi", emailSub:"Saat henkilökohtaisen suunnitelmasi ilmaiseksi", building:"Rakennetaan suunnitelmaasi...", choosePlan:"Valitse suunnitelmasi", goodHands:"Olet hyvissä käsissä", source:"LÄHDE", startNow:"Aloita nyt", planSub:"Täysi pääsy · Peru milloin tahansa" },
  el:{ next:"Επόμενο", skip:"Παράλειψη", unlock:"Ξεκλείδωσε το δυναμικό σου στα αγγλικά", plan:"Αποκτήστε ένα εξατομικευμένο πρόγραμμα μάθησης προσαρμοσμένο στους στόχους σας", quiz3:"Κουίζ 3 λεπτών", nativeLang:"Ποια είναι η μητρική σας γλώσσα;", nameQ:"Πώς σε λένε;", welcome:"Καλώς ήρθες", pp1:"Ας δημιουργήσουμε το", pp2:"προσωπικό σου πλάνο", levelQ:"Πόσο καλά γνωρίζεις τα αγγλικά;", beg:"Ξέρω λίγα", mid:"Μπορώ να κάνω απλές συνομιλίες", adv:"Μιλώ με αυτοπεποίθηση", howQ:"Πώς έχεις μελετήσει αγγλικά;", whyQ:"Γιατί θέλεις να μάθεις αγγλικά;", strugQ:"Δυσκολίες", topicQ:"Ποια θέματα σε ενδιαφέρουν;", goalQ:"Πόσο εξασκείσαι την ημέρα;", emailQ:"Εισάγετε το email σας για να αποθηκεύσετε το πλάνο", emailSub:"Θα λάβεις το εξατομικευμένο σου πλάνο δωρεάν", building:"Δημιουργούμε το πλάνο σου...", choosePlan:"Επίλεξε το πλάνο σου", goodHands:"Είσαι σε καλά χέρια", source:"ΠΗΓΗ", startNow:"Ξεκίνα τώρα", planSub:"Πλήρης πρόσβαση · Ακύρωση οποτεδήποτε" },
  id:{ next:"Berikutnya", skip:"Lewati", unlock:"Buka potensi bahasa Inggrismu", plan:"Dapatkan rencana belajar yang dipersonalisasi sesuai tujuanmu", quiz3:"Kuis 3 menit", nativeLang:"Apa bahasa ibu Anda?", nameQ:"Siapa namamu?", welcome:"Selamat datang", pp1:"Mari buat", pp2:"rencana pribadimu", levelQ:"Seberapa baik kamu tahu bahasa Inggris?", beg:"Saya tahu sedikit", mid:"Saya bisa percakapan sederhana", adv:"Saya berbicara dengan percaya diri", howQ:"Bagaimana kamu belajar bahasa Inggris?", whyQ:"Mengapa kamu ingin belajar bahasa Inggris?", strugQ:"Kesulitan", topicQ:"Topik apa yang menarik minatmu?", goalQ:"Berapa lama kamu berlatih per hari?", emailQ:"Masukkan email untuk menyimpan rencanamu", emailSub:"Kamu akan menerima rencana yang dipersonalisasi secara gratis", building:"Membangun rencanamu...", choosePlan:"Pilih rencanamu", goodHands:"Kamu berada di tangan yang tepat", source:"SUMBER", startNow:"Mulai sekarang", planSub:"Akses penuh · Batalkan kapan saja" },
  ja:{ next:"次へ", skip:"スキップ", unlock:"英語の可能性を解き放て", plan:"目標に合わせた個別学習プランを取得しよう", quiz3:"3分間クイズ", nativeLang:"あなたの母語は何ですか？", nameQ:"お名前は？", welcome:"ようこそ", pp1:"あなたの", pp2:"個人プランを作りましょう", levelQ:"英語はどのくらいわかりますか？", beg:"少し知っています", mid:"簡単な会話ができます", adv:"自信を持って話せます", howQ:"英語をどのように学んできましたか？", whyQ:"なぜ英語を学びたいですか？", strugQ:"苦手なこと", topicQ:"どんな話題に興味がありますか？", goalQ:"1日どのくらい練習しますか？", emailQ:"プランを保存するためにメールを入力", emailSub:"個別プランを無料で受け取れます", building:"プランを作成中...", choosePlan:"プランを選ぶ", goodHands:"安心してお任せください", source:"出典", startNow:"今すぐ始める", planSub:"フルアクセス・いつでもキャンセル可" },
  ko:{ next:"다음", skip:"건너뛰기", unlock:"영어 잠재력을 깨워라", plan:"목표에 맞는 맞춤 학습 계획을 받아보세요", quiz3:"3분 퀴즈", nativeLang:"모국어가 무엇인가요?", nameQ:"이름이 뭐예요?", welcome:"어서 오세요", pp1:"나만의", pp2:"개인 플랜을 만들어봐요", levelQ:"영어를 얼마나 잘 아세요?", beg:"조금 알아요", mid:"간단한 대화를 할 수 있어요", adv:"자신 있게 말해요", howQ:"영어를 어떻게 공부했나요?", whyQ:"영어를 배우려는 이유는?", strugQ:"어려운 점", topicQ:"어떤 주제에 관심 있으세요?", goalQ:"하루에 얼마나 연습하세요?", emailQ:"플랜 저장을 위해 이메일을 입력하세요", emailSub:"개인 맞춤 플랜을 무료로 받을 수 있어요", building:"플랜을 만드는 중...", choosePlan:"플랜 선택", goodHands:"믿고 맡기세요", source:"출처", startNow:"지금 시작하기", planSub:"전체 이용 · 언제든지 취소 가능" },
  pl:{ next:"Dalej", skip:"Pomiń", unlock:"Odblokuj swój potencjał w angielskim", plan:"Uzyskaj spersonalizowany plan nauki dostosowany do Twoich celów", quiz3:"3-minutowy quiz", nativeLang:"Jaki jest Twój język ojczysty?", nameQ:"Jak masz na imię?", welcome:"Witaj na pokładzie", pp1:"Stwórzmy Twój", pp2:"osobisty plan", levelQ:"Jak dobrze znasz angielski?", beg:"Znam trochę", mid:"Mogę prowadzić proste rozmowy", adv:"Mówię pewnie", howQ:"Jak uczyłeś się angielskiego?", whyQ:"Dlaczego chcesz uczyć się angielskiego?", strugQ:"Trudności", topicQ:"Jakie tematy Cię interesują?", goalQ:"Ile ćwiczysz dziennie?", emailQ:"Wpisz email, aby zapisać plan", emailSub:"Otrzymasz spersonalizowany plan za darmo", building:"Tworzymy Twój plan...", choosePlan:"Wybierz plan", goodHands:"Jesteś w dobrych rękach", source:"ŹRÓDŁO", startNow:"Zacznij teraz", planSub:"Pełny dostęp · Anuluj kiedy chcesz" },
  sv:{ next:"Nästa", skip:"Hoppa över", unlock:"Frigör din engelska potential", plan:"Få en personlig inlärningsplan anpassad till dina mål", quiz3:"3 minuters quiz", nativeLang:"Vad är ditt modersmål?", nameQ:"Vad heter du?", welcome:"Välkommen ombord", pp1:"Låt oss skapa din", pp2:"personliga plan", levelQ:"Hur bra kan du engelska?", beg:"Jag kan lite", mid:"Jag kan ha enkla samtal", adv:"Jag talar med självförtroende", howQ:"Hur har du studerat engelska?", whyQ:"Varför vill du lära dig engelska?", strugQ:"Svårigheter", topicQ:"Vilka ämnen intresserar dig?", goalQ:"Hur mycket övar du per dag?", emailQ:"Ange din e-post för att spara planen", emailSub:"Du får din personliga plan gratis", building:"Bygger din plan...", choosePlan:"Välj din plan", goodHands:"Du är i goda händer", source:"KÄLLA", startNow:"Börja nu", planSub:"Full tillgång · Avbryt när som helst" },
  tr:{ next:"İleri", skip:"Atla", unlock:"İngilizce potansiyelini ortaya çıkar", plan:"Hedeflerine özel kişiselleştirilmiş bir öğrenme planı al", quiz3:"3 dakikalık test", nativeLang:"Ana diliniz nedir?", nameQ:"Adın ne?", welcome:"Hoş geldin", pp1:"Kişisel planını", pp2:"oluşturalım", levelQ:"İngilizceni ne kadar iyi biliyorsun?", beg:"Biraz biliyorum", mid:"Basit konuşmalar yapabiliyorum", adv:"Güvenle konuşuyorum", howQ:"İngilizceyi nasıl çalıştın?", whyQ:"Neden İngilizce öğrenmek istiyorsun?", strugQ:"Zorluklar", topicQ:"Hangi konular ilgini çekiyor?", goalQ:"Günde ne kadar pratik yapıyorsun?", emailQ:"Planını kaydetmek için e-posta gir", emailSub:"Kişiselleştirilmiş planını ücretsiz alacaksın", building:"Planın oluşturuluyor...", choosePlan:"Planını seç", goodHands:"Emin ellerde", source:"KAYNAK", startNow:"Şimdi başla", planSub:"Tam erişim · İstediğin zaman iptal et" },
};

function tr(iso:string, k:string): string {
  return S[iso]?.[k] ?? S.es[k] ?? k;
}

function lbl(item: Item, langId: number): string {
  return item.localized[String(langId)] || item.title;
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────
const BG = "linear-gradient(180deg,#09090F 0%,#0b1a2e 100%)";
const BASE: React.CSSProperties = { minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", color:"#fff", fontFamily:"'Inter',-apple-system,sans-serif" };

function NextBtn({ onClick, disabled, children }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      width:"calc(100% - 40px)", maxWidth:480, height:56,
      background: disabled ? "#222" : G,
      border:"none", borderRadius:999, fontSize:17, fontWeight:700,
      color: disabled ? "#555" : "#000", cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : `0 0 32px ${G}55`, zIndex:100, transition:"all 0.2s",
    }}>{children}</button>
  );
}

function Radio({ on }: { on:boolean }) {
  return (
    <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, marginLeft:"auto",
      border: on ? "none" : "2px solid rgba(255,255,255,0.2)", background: on ? G : "transparent",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      {on && <span style={{ fontSize:11, color:"#000", fontWeight:900 }}>✓</span>}
    </div>
  );
}

function Card({ on, onClick, children }: { on:boolean; onClick:()=>void; children:React.ReactNode }) {
  return (
    <div onClick={onClick} style={{
      background: on ? "rgba(174,234,0,0.08)" : "rgba(255,255,255,0.05)",
      border: on ? `1.5px solid ${G}` : "1px solid rgba(255,255,255,0.08)",
      borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12,
      cursor:"pointer", transition:"all 0.2s", width:"100%", marginBottom:10,
    }}>{children}</div>
  );
}

const PROG = ["language","name","level","how","why","struggles","topics","goal","email"];

function ProgressBar({ screen }: { screen:string }) {
  const idx = PROG.indexOf(screen);
  if (idx < 0) return null;
  return (
    <div style={{ width:"100%", maxWidth:480, padding:"16px 20px 0", display:"flex", gap:4 }}>
      {PROG.map((_,i) => (
        <div key={i} style={{ flex:1, height:4, borderRadius:999, background: i <= idx ? G : "rgba(255,255,255,0.1)", position:"relative" }}>
          {i === idx && (
            <div style={{ position:"absolute", top:"50%", right:-5, transform:"translateY(-50%)", width:12, height:12, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, color:"#000", fontWeight:900 }}>✓</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Screen components ─────────────────────────────────────────────────────────

function SStart({ next, iso }: { next:()=>void; iso:string }) {
  return (
    <div style={{ ...BASE, justifyContent:"flex-start" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      <div style={{ padding:"22px 0 0", display:"flex", alignItems:"center", gap:10 }}>
        <img src={CDN+"lola.png"} alt="" style={{ width:38, height:38, borderRadius:"50%" }} />
        <span style={{ fontWeight:800, fontSize:18, letterSpacing:-0.5 }}>iola Speak</span>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
        <h1 style={{ fontSize:30, fontWeight:900, margin:"0 0 12px", lineHeight:1.25 }}>{tr(iso,"unlock")}</h1>
        <p style={{ color:"#8899aa", fontSize:16, margin:"0 0 10px", lineHeight:1.6, maxWidth:380 }}>{tr(iso,"plan")}</p>
        <p style={{ fontSize:12, fontWeight:700, letterSpacing:2, color:"#556677", margin:"0 0 28px" }}>{tr(iso,"quiz3").toUpperCase()}</p>
        <img src={CDN+"hero.webp"} alt="" style={{ width:"min(280px,80%)", animation:"float 4s ease-in-out infinite" }} />
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SLanguage({ next, langId, setLangId }: { next:()=>void; langId:number; setLangId:(n:number)=>void }) {
  const iso = LANGUAGES.find(l=>l.id===langId)?.iso ?? "es";
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <style>{`
        .lang-card { transition: transform 0.15s, background 0.15s; }
        .lang-card:active { transform: scale(0.94); }
      `}</style>
      <h1 style={{ fontSize:20, fontWeight:800, margin:"28px 20px 18px", textAlign:"center" }}>{tr(iso,"nativeLang")}</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, padding:"0 10px", width:"100%", maxWidth:500 }}>
        {LANGUAGES.map(lang => {
          const sel = lang.id === langId;
          return (
            <div key={lang.id} className="lang-card" onClick={()=>setLangId(lang.id)} style={{
              background: sel ? "rgba(70,90,60,0.85)" : "rgba(30,32,38,0.9)",
              borderRadius:16,
              padding:"14px 4px 10px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:7,
              cursor:"pointer", position:"relative",
              boxShadow: sel ? `0 0 0 2px ${G}` : "0 0 0 1px rgba(255,255,255,0.06)",
            }}>
              {sel && (
                <div style={{
                  position:"absolute", top:6, right:6, width:16, height:16,
                  borderRadius:"50%", background:G,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, color:"#000", fontWeight:900, lineHeight:1,
                }}>✓</div>
              )}
              <img src={lang.icon} alt={lang.name} style={{
                width:44, height:44, borderRadius:"50%", objectFit:"cover",
                boxShadow:"0 2px 8px rgba(0,0,0,0.5)",
              }} />
              <span style={{
                fontSize:9.5, textAlign:"center", lineHeight:1.25, fontWeight: sel ? 700 : 500,
                color: sel ? G : "rgba(255,255,255,0.85)", padding:"0 2px",
              }}>{lang.name}</span>
            </div>
          );
        })}
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SVideo({ next, iso }: { next:()=>void; iso:string }) {
  const [ready, setReady] = useState(false);
  useEffect(()=>{ const id=setTimeout(()=>setReady(true),4000); return()=>clearTimeout(id); },[]);
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"20px 20px 100px" }}>
      <div style={{ width:"100%", maxWidth:340, aspectRatio:"9/16", borderRadius:20, overflow:"hidden", background:"#000", boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}>
        <iframe src={`https://iframe.cloudflarestream.com/${CF}?autoplay=true&muted=false`}
          allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
          style={{ width:"100%", height:"100%", border:"none" }} />
      </div>
      {ready && <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>}
    </div>
  );
}

function SName({ next, name, setName, iso }: { next:()=>void; name:string; setName:(s:string)=>void; iso:string }) {
  return (
    <div style={BASE}>
      <ProgressBar screen="name" />
      <div style={{ flex:1, width:"100%", maxWidth:480, padding:"32px 20px 0", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img src={CDN+"choose.svg"} alt="" style={{ width:80, height:80, marginBottom:24 }} />
        <h1 style={{ fontSize:24, fontWeight:800, textAlign:"center", margin:"0 0 28px" }}>{tr(iso,"nameQ")}</h1>
        <div style={{ width:"100%", display:"flex", alignItems:"center", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 16px", gap:12 }}>
          <span style={{ fontSize:18, opacity:0.5 }}>👤</span>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="María"
            style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:17, fontWeight:500 }} autoFocus />
        </div>
        <button onClick={next} style={{ marginTop:28, background:"none", border:"none", color:"#556677", fontSize:15, cursor:"pointer" }}>{tr(iso,"skip")}</button>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SPersonalPlan({ next, name, iso }: { next:()=>void; name:string; iso:string }) {
  const [prog, setProg] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(()=>{
    let t0: number|null = null;
    const dur = 2600;
    function frame(ts:number){ if(!t0)t0=ts; const p=Math.min((ts-t0)/dur,1); setProg(p); if(p<1)requestAnimationFrame(frame); else setDone(true); }
    requestAnimationFrame(frame);
  },[]);
  const W=340, H=380, N=100;
  // Full curve (gray) — goes all the way
  const fullPts: {x:number,y:number}[] = [];
  for(let i=0;i<=N;i++){
    const f=i/N, x=W*.05+f*W*.9, e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    fullPts.push({x, y:H*.95-e*H*.88});
  }
  // Green line — animates and stops at midpoint (~50%)
  const greenStop = 0.5;
  const greenPts: {x:number,y:number}[] = [];
  for(let i=0;i<=Math.floor(prog*greenStop*N);i++){
    const f=i/N, x=W*.05+f*W*.9, e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    greenPts.push({x, y:H*.95-e*H*.88});
  }
  const cur = greenPts[greenPts.length-1];
  const dFull = fullPts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const dGreen = greenPts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <div style={{ ...BASE, justifyContent:"flex-start", padding:0, overflow:"hidden" }}>
      <div style={{ padding:"28px 20px 0", textAlign:"center", width:"100%" }}>
        <p style={{ color:"#8899aa", fontSize:16, margin:"0 0 4px" }}>
          {tr(iso,"welcome")} <strong style={{ color:"#fff" }}>{name||"amigo"}!</strong>
        </p>
        <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>
          {tr(iso,"pp1")} <span style={{ color:G }}>{tr(iso,"pp2")}</span>
        </h1>
      </div>
      <div style={{ position:"relative", width:"100%", flex:1, minHeight:0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ position:"absolute", inset:0 }}>
          <defs>
            <radialGradient id="bg-glow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="rgba(0,120,200,0.16)"/>
              <stop offset="100%" stopColor="rgba(0,120,200,0)"/>
            </radialGradient>
          </defs>
          <ellipse cx={W*.5} cy={H*.38} rx={W*.48} ry={H*.38} fill="url(#bg-glow)"/>
          {[1,2,3,4,5].map(i=><line key={i} x1={W*.04} x2={W*.96} y1={H*i/6} y2={H*i/6} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,6"/>)}
          {[1,2,3,4].map(i=><line key={i} x1={W*i/5} x2={W*i/5} y1={H*.02} y2={H*.98} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,6"/>)}
          {/* Gray full curve */}
          <path d={dFull} fill="none" stroke="rgba(180,180,180,0.25)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
          {/* Green animated curve — stops at midpoint */}
          {greenPts.length>1 && <path d={dGreen} fill="none" stroke={G} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/>}
          {cur && prog>.01 && <circle cx={cur.x} cy={cur.y} r={9} fill={G} opacity={0.95}/>}
          {done && cur && <text x={cur.x-5} y={cur.y+5} fill="#000" fontSize={11} fontWeight="900">✓</text>}
        </svg>
      </div>
      {done && <div style={{ padding:"0 20px 20px", width:"100%" }}><NextBtn onClick={next}>{tr(iso,"next")}</NextBtn></div>}
    </div>
  );
}

function SLevel({ next, sel, setSel, iso }: { next:()=>void; sel:number|null; setSel:(n:number)=>void; iso:string }) {
  const opts=[{id:1,img:CDN+"Beginner.svg",lbl:tr(iso,"beg")},{id:2,img:CDN+"Intermediate.svg",lbl:tr(iso,"mid")},{id:3,img:CDN+"Advansed.svg",lbl:tr(iso,"adv")}];
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="level"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px", lineHeight:1.3 }}>{tr(iso,"levelQ")}</h1>
        {opts.map(o=>(
          <Card key={o.id} on={sel===o.id} onClick={()=>{ setSel(o.id); setTimeout(next,280); }}>
            <img src={o.img} alt={o.lbl} style={{ width:44, height:44, objectFit:"contain" }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{o.lbl}</span>
            <Radio on={sel===o.id}/>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SHow({ next, sel, setSel, iso, langId }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string; langId:number }) {
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="how"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px" }}>{tr(iso,"howQ")}</h1>
        {HOWS.map(h=>{ const on=sel.includes(h.id); return (
          <Card key={h.id} on={on} onClick={()=>setSel(p=>on?p.filter(x=>x!==h.id):[...p,h.id])}>
            <img src={h.image} alt={h.title} style={{ width:38, height:38, borderRadius:10, objectFit:"cover" }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{lbl(h,langId)}</span>
            <Radio on={on}/>
          </Card>
        );})}
      </div>
      <NextBtn onClick={next} disabled={sel.length===0}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SBrainFocus({ next, iso }: { next:()=>void; iso:string }) {
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <img src={CDN+"hero.webp"} alt="" style={{ width:140, marginBottom:28, animation:"float 3s ease-in-out infinite" }}/>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 10px" }}>Aprender idiomas ejercita el cerebro</h2>
      <p style={{ color:"#8899aa", lineHeight:1.6, marginBottom:36, maxWidth:360 }}>La ciencia confirma los beneficios cognitivos de aprender un nuevo idioma</p>
      <div style={{ display:"flex", gap:14, width:"100%", maxWidth:360 }}>
        {[["Enfoque y\nflexibilidad","+35%"],["Memoria","+50%"]].map(([l,v])=>(
          <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 12px" }}>
            <div style={{ fontSize:36, fontWeight:900, color:G }}>{v}</div>
            <div style={{ fontSize:13, color:"#8899aa", marginTop:6, whiteSpace:"pre-line", lineHeight:1.3 }}>{l}</div>
          </div>
        ))}
      </div>
      <p style={{ color:"#444", fontSize:11, marginTop:18, lineHeight:1.7 }}>{tr(iso,"source")}<br/>Linck et al., 2014 · Bialystock & Martin, 2014</p>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SWhy({ next, sel, setSel, iso, langId }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string; langId:number }) {
  const pick = (id:number) => { setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); setTimeout(next,300); };
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="why"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px" }}>{tr(iso,"whyQ")}</h1>
        {WHYS.map(w=>{ const on=sel.includes(w.id); return (
          <Card key={w.id} on={on} onClick={()=>pick(w.id)}>
            <img src={w.image} alt={w.title} style={{ width:38, height:38, borderRadius:10, objectFit:"cover" }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{lbl(w,langId)}</span>
            <Radio on={on}/>
          </Card>
        );})}
      </div>
    </div>
  );
}

function SGoodHands1({ next, iso }: { next:()=>void; iso:string }) {
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <h1 style={{ fontSize:24, fontWeight:800, margin:"0 0 44px" }}>{tr(iso,"goodHands")}</h1>
      <div style={{ position:"relative", width:280, height:260, margin:"0 auto 36px" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:130, height:130, borderRadius:"50%", background:"rgba(0,180,210,0.12)", border:"1px solid rgba(0,180,210,0.3)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:14 }}>
          <span style={{ fontSize:28 }}>🎬</span>
          <span style={{ fontSize:10, color:"#aaa", marginTop:4, lineHeight:1.3, padding:"0 10px" }}>Interactive video lessons</span>
        </div>
        <div style={{ position:"absolute", bottom:0, left:12, width:130, height:130, borderRadius:"50%", background:"rgba(90,90,220,0.12)", border:"1px solid rgba(90,90,220,0.3)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:14 }}>
          <span style={{ fontSize:28 }}>🤖</span>
          <span style={{ fontSize:10, color:"#aaa", lineHeight:1.3, padding:"0 10px", textAlign:"center" }}>Artificial Intelligence</span>
        </div>
        <div style={{ position:"absolute", bottom:0, right:12, width:130, height:130, borderRadius:"50%", background:"rgba(160,30,120,0.12)", border:"1px solid rgba(160,30,120,0.3)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:14 }}>
          <span style={{ fontSize:28 }}>🎓</span>
          <span style={{ fontSize:10, color:"#aaa", lineHeight:1.3, padding:"0 10px", textAlign:"center" }}>Harvard Research</span>
        </div>
        <div style={{ position:"absolute", top:"46%", left:"50%", transform:"translate(-50%,-30%)", fontSize:22, fontWeight:900, color:G, textShadow:`0 0 20px ${G}80` }}>iola</div>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SStruggles({ next, sel, setSel, iso, langId }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string; langId:number }) {
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="struggles"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px" }}>{tr(iso,"strugQ")}</h1>
        {STRUGGLES.map(s=>{ const on=sel.includes(s.id); return (
          <Card key={s.id} on={on} onClick={()=>setSel(p=>on?p.filter(x=>x!==s.id):[...p,s.id])}>
            <img src={s.image} alt={s.title} style={{ width:38, height:38, borderRadius:10, objectFit:"cover" }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{lbl(s,langId)}</span>
            <Radio on={on}/>
          </Card>
        );})}
      </div>
      <NextBtn onClick={next} disabled={sel.length===0}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SBrainStudy({ next, iso }: { next:()=>void; iso:string }) {
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <img src={CDN+"watch.webp"} alt="" style={{ width:130, height:130, objectFit:"contain", marginBottom:24 }}/>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 10px" }}>El estudio regular es la clave</h2>
      <p style={{ color:"#8899aa", lineHeight:1.6, marginBottom:36, maxWidth:360 }}>Practicar incluso 5 minutos al día puede acelerar tu aprendizaje de manera significativa</p>
      <div style={{ display:"flex", gap:14, width:"100%", maxWidth:360 }}>
        {[["Retención","3x más"],["Confianza","+60%"]].map(([l,v])=>(
          <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 12px" }}>
            <div style={{ fontSize:32, fontWeight:900, color:G }}>{v}</div>
            <div style={{ fontSize:13, color:"#8899aa", marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function STopics({ next, sel, setSel, iso }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string }) {
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="topics"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 16px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 20px" }}>{tr(iso,"topicQ")}</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {TOPICS.map(tp=>{ const on=sel.includes(tp.id); return (
            <div key={tp.id} onClick={()=>setSel(p=>on?p.filter(x=>x!==tp.id):[...p,tp.id])} style={{
              background: on ? "rgba(174,234,0,0.1)" : "rgba(255,255,255,0.05)",
              border: on ? `1.5px solid ${G}` : "1px solid rgba(255,255,255,0.08)",
              borderRadius:14, padding:"14px 8px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              cursor:"pointer", transition:"all 0.2s",
            }}>
              <img src={tp.image} alt={tp.title} style={{ width:44, height:44, objectFit:"contain" }}/>
              <span style={{ fontSize:11, textAlign:"center", color:on?G:"#bbb", fontWeight:on?700:400 }}>{tp.title}</span>
            </div>
          );})}
        </div>
      </div>
      <NextBtn onClick={next} disabled={sel.length===0}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SGoodHands2({ next, iso }: { next:()=>void; iso:string }) {
  const reviews=[
    { name:"María G.", stars:5, text:"En 3 semanas ya puedo hablar con confianza en reuniones. ¡Increíble!" },
    { name:"Carlos R.", stars:5, text:"Las lecciones en video son únicas. Nunca aprender inglés había sido tan natural." },
    { name:"Ana L.",    stars:5, text:"El AI me corrige en tiempo real. Perfecta para nivel intermedio." },
  ];
  return (
    <div style={{ ...BASE, padding:"0 20px 100px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:"32px 0 4px", textAlign:"center" }}>Más de 500K usuarios</h1>
      <p style={{ color:"#8899aa", marginBottom:28, textAlign:"center" }}>confían en iola Speak para mejorar su inglés</p>
      {reviews.map(r=>(
        <div key={r.name} style={{ width:"100%", maxWidth:480, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontWeight:700 }}>{r.name}</span>
            <span style={{ color:G }}>{"★".repeat(r.stars)}</span>
          </div>
          <p style={{ color:"#aaa", fontSize:13, margin:0, lineHeight:1.5 }}>{r.text}</p>
        </div>
      ))}
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SGoal({ next, sel, setSel, iso }: { next:()=>void; sel:number|null; setSel:(n:number)=>void; iso:string }) {
  const opts=[{id:3,img:CDN+"30.webp",lbl:"30 min",sub:"Máximo progreso"},{id:2,img:CDN+"15.webp",lbl:"15 min",sub:"Buen avance"},{id:1,img:CDN+"5.webp",lbl:"5 min",sub:"Para empezar"}];
  return (
    <div style={{ ...BASE, paddingBottom:100 }}>
      <ProgressBar screen="goal"/>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px", lineHeight:1.3 }}>{tr(iso,"goalQ")}</h1>
        {opts.map(o=>(
          <Card key={o.id} on={sel===o.id} onClick={()=>{ setSel(o.id); setTimeout(next,280); }}>
            <img src={o.img} alt={o.lbl} style={{ width:44, height:44, objectFit:"contain" }}/>
            <div><div style={{ fontSize:16, fontWeight:700 }}>{o.lbl}</div><div style={{ fontSize:12, color:"#8899aa" }}>{o.sub}</div></div>
            <Radio on={sel===o.id}/>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SEmail({ next, email, setEmail, iso }: { next:()=>void; email:string; setEmail:(s:string)=>void; iso:string }) {
  const ok = /^[^@]+@[^@]+\.[^@]+$/.test(email);
  return (
    <div style={BASE}>
      <ProgressBar screen="email"/>
      <div style={{ flex:1, width:"100%", maxWidth:480, padding:"32px 20px 0", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img src={CDN+"ai.webp"} alt="" style={{ width:110, height:110, objectFit:"contain", marginBottom:20 }}/>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 8px" }}>{tr(iso,"emailQ")}</h1>
        <p style={{ color:"#8899aa", textAlign:"center", marginBottom:24, fontSize:14 }}>{tr(iso,"emailSub")}</p>
        <div style={{ width:"100%", display:"flex", alignItems:"center", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 16px", gap:12 }}>
          <span style={{ fontSize:18, opacity:0.6 }}>✉️</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" type="email"
            style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:16 }} autoFocus/>
        </div>
      </div>
      <NextBtn onClick={next} disabled={!ok}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SBuilding({ next, iso }: { next:()=>void; iso:string }) {
  const steps=["Analizando tu nivel...","Personalizando contenido...","Generando tu plan..."];
  const [si, setSi] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setSi(1),1100);
    const t2=setTimeout(()=>setSi(2),2300);
    const t3=setTimeout(()=>{ setPct(100); setTimeout(next,500); },3400);
    let p=0; const iv=setInterval(()=>{ p=Math.min(p+1.6,100); setPct(Math.round(p)); if(p>=100)clearInterval(iv); },55);
    return()=>{ clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearInterval(iv); };
  },[]);
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:48 }}>{tr(iso,"building")}</h1>
      {steps.map((s,i)=>(
        <div key={s} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, opacity:i<=si?1:0.2, transition:"opacity 0.5s", width:"100%", maxWidth:340, textAlign:"left" }}>
          <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, background:i<=si?G:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#000", fontWeight:900 }}>
            {i<si?"✓":i===si?"·":""}
          </div>
          <span style={{ fontSize:15, color:i<=si?"#fff":"#444" }}>{s}</span>
        </div>
      ))}
      <div style={{ width:"100%", maxWidth:340, height:6, background:"rgba(255,255,255,0.1)", borderRadius:999, marginTop:28 }}>
        <div style={{ width:`${pct}%`, height:"100%", background:G, borderRadius:999, transition:"width 0.1s" }}/>
      </div>
      <div style={{ marginTop:8, fontSize:13, color:G, fontWeight:700 }}>{pct}%</div>
    </div>
  );
}

function SExpect({ next, week, iso }: { next:()=>void; week:1|4|12|"12m"; iso:string }) {
  const D={
    1:   { img:CDN+"week1.webp",   title:"Semana 1",  sub:"Primeras palabras y frases básicas",      bullets:["100+ palabras nuevas","Comprensión básica","Pronunciación mejorada"] },
    4:   { img:CDN+"week4.webp",   title:"Semana 4",  sub:"Conversaciones simples con confianza",    bullets:["500+ palabras activas","Gramática sólida","Escucha real mejorada"] },
    12:  { img:CDN+"week12.webp",  title:"Semana 12", sub:"Fluidez en situaciones cotidianas",       bullets:["1200+ palabras","Hablas sin traducir mentalmente","Confianza real"] },
    "12m":{ img:CDN+"month12.webp",title:"12 meses",  sub:"Dominio avanzado del inglés",            bullets:["Nivel B2-C1 sólido","Inglés fluido y natural","Listo para el mundo"] },
  }[week];
  return (
    <div style={{ ...BASE, padding:"0 20px 100px" }}>
      <div style={{ width:"100%", maxWidth:480, paddingTop:28 }}>
        <img src={D.img} alt="" style={{ width:"100%", borderRadius:20, marginBottom:24, objectFit:"cover", maxHeight:220 }}/>
        <h2 style={{ fontSize:24, fontWeight:800, margin:"0 0 6px" }}>{D.title}</h2>
        <p style={{ color:"#8899aa", marginBottom:24, fontSize:15 }}>{D.sub}</p>
        {D.bullets.map(b=>(
          <div key={b} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(174,234,0,0.1)", border:`1px solid ${G}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:G, flexShrink:0 }}>✓</div>
            <span style={{ fontSize:15 }}>{b}</span>
          </div>
        ))}
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SLevelUp({ next, iso }: { next:()=>void; iso:string }) {
  return (
    <div style={{ ...BASE, justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <div style={{ fontSize:60, marginBottom:16 }}>🚀</div>
      <h1 style={{ fontSize:28, fontWeight:900, margin:"0 0 14px", background:`linear-gradient(135deg,${G},#00e5ff)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>¡Tu plan está listo!</h1>
      <p style={{ color:"#8899aa", fontSize:16, lineHeight:1.7, marginBottom:36, maxWidth:340 }}>Hemos creado un plan personalizado basado en tus respuestas para llevarte al siguiente nivel en inglés.</p>
      {[[CDN+"fluency.webp","Fluidez garantizada"],[CDN+"pronunciation.webp","Pronunciación perfecta"],[CDN+"vocab.webp","Vocabulario amplio"]].map(([img,l])=>(
        <div key={l} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14, width:"100%", maxWidth:340 }}>
          <img src={img} alt="" style={{ width:36, height:36, objectFit:"contain" }}/>
          <span style={{ fontSize:15, fontWeight:500 }}>{l}</span>
          <span style={{ marginLeft:"auto", color:G, fontSize:18 }}>✓</span>
        </div>
      ))}
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SChoosePlan({ iso }: { iso:string }) {
  const [selPlan, setSelPlan] = useState("month");
  const cur = PLANS.find(p=>p.id===selPlan)!;
  return (
    <div style={{ ...BASE, padding:"0 20px 40px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:"32px 0 6px", textAlign:"center" }}>{tr(iso,"choosePlan")}</h1>
      <p style={{ color:"#8899aa", marginBottom:24, textAlign:"center", fontSize:14 }}>{tr(iso,"planSub")}</p>
      <div style={{ width:"100%", maxWidth:480 }}>
        {PLANS.map(p=>(
          <div key={p.id} onClick={()=>setSelPlan(p.id)} style={{
            background: p.id===selPlan ? "rgba(174,234,0,0.08)" : "rgba(255,255,255,0.05)",
            border: p.id===selPlan ? `1.5px solid ${G}` : "1px solid rgba(255,255,255,0.08)",
            borderRadius:16, padding:"18px 16px", marginBottom:12,
            cursor:"pointer", transition:"all 0.2s", position:"relative",
            display:"flex", alignItems:"center", gap:14,
          }}>
            {p.popular && <div style={{ position:"absolute", top:-10, right:16, background:G, color:"#000", fontSize:10, fontWeight:900, padding:"2px 12px", borderRadius:999 }}>MÁS POPULAR</div>}
            <Radio on={p.id===selPlan}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <span style={{ fontSize:17, fontWeight:700 }}>{p.label}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, color:"#555", textDecoration:"line-through" }}>{p.orig}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:p.id===selPlan?G:"#fff" }}>{p.sale}</div>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <span style={{ fontSize:12, color:"#8899aa" }}>{p.per}</span>
                <span style={{ fontSize:11, color:G, fontWeight:700 }}>{p.save}</span>
              </div>
            </div>
          </div>
        ))}
        <button onClick={()=>alert("Redirigiendo al pago...")}
          style={{ width:"100%", height:56, background:G, border:"none", borderRadius:999, fontSize:17, fontWeight:700, color:"#000", cursor:"pointer", boxShadow:`0 0 32px ${G}55`, marginTop:8 }}>
          {tr(iso,"startNow")} · {cur.sale}
        </button>
        <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:16, color:"#556677", fontSize:12 }}>
          <span>🔒 Pago seguro</span><span>↩ Garantía 7 días</span><span>✕ Sin compromiso</span>
        </div>
      </div>
    </div>
  );
}

// ─── Route + Main ──────────────────────────────────────────────────────────────
export const Route = createFileRoute("/quiz")({
  component: IolaQuiz,
});

type Screen = "start"|"language"|"video"|"name"|"personalPlan"|"level"|"how"|"brainFocus"|"why"|"goodHands1"|"struggles"|"brainStudy"|"topics"|"goodHands2"|"goal"|"email"|"building"|"expect1"|"expect4"|"expect12"|"expect12m"|"levelUp"|"choosePlan";

const FLOW: Screen[] = ["start","language","name","personalPlan","level","how","brainFocus","why","goodHands1","struggles","brainStudy","topics","goodHands2","goal","email","building","expect1","expect4","expect12","expect12m","levelUp","video","choosePlan"];

export default function IolaQuiz() {
  const [step,   setStep]   = useState(0);
  const [langId, setLangId] = useState(71);
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [level,  setLevel]  = useState<number|null>(null);
  const [hows,   setHows]   = useState<number[]>([]);
  const [whys,   setWhys]   = useState<number[]>([]);
  const [strugs, setStrugs] = useState<number[]>([]);
  const [topics, setTopics] = useState<number[]>([]);
  const [goal,   setGoal]   = useState<number|null>(null);

  const next = () => setStep(s=>Math.min(s+1,FLOW.length-1));
  const iso  = LANGUAGES.find(l=>l.id===langId)?.iso ?? "es";
  const sc   = FLOW[step];

  return (
    <>
      {sc==="start"        && <SStart       next={next} iso={iso} />}
      {sc==="language"     && <SLanguage    next={next} langId={langId} setLangId={setLangId} />}
      {sc==="video"        && <SVideo       next={next} iso={iso} />}
      {sc==="name"         && <SName        next={next} name={name} setName={setName} iso={iso} />}
      {sc==="personalPlan" && <SPersonalPlan next={next} name={name} iso={iso} />}
      {sc==="level"        && <SLevel       next={next} sel={level} setSel={setLevel} iso={iso} />}
      {sc==="how"          && <SHow         next={next} sel={hows}  setSel={setHows}  iso={iso} langId={langId} />}
      {sc==="brainFocus"   && <SBrainFocus  next={next} iso={iso} />}
      {sc==="why"          && <SWhy         next={next} sel={whys}  setSel={setWhys}  iso={iso} langId={langId} />}
      {sc==="goodHands1"   && <SGoodHands1  next={next} iso={iso} />}
      {sc==="struggles"    && <SStruggles   next={next} sel={strugs} setSel={setStrugs} iso={iso} langId={langId} />}
      {sc==="brainStudy"   && <SBrainStudy  next={next} iso={iso} />}
      {sc==="topics"       && <STopics      next={next} sel={topics} setSel={setTopics} iso={iso} />}
      {sc==="goodHands2"   && <SGoodHands2  next={next} iso={iso} />}
      {sc==="goal"         && <SGoal        next={next} sel={goal} setSel={setGoal} iso={iso} />}
      {sc==="email"        && <SEmail       next={next} email={email} setEmail={setEmail} iso={iso} />}
      {sc==="building"     && <SBuilding    next={next} iso={iso} />}
      {sc==="expect1"      && <SExpect      next={next} week={1}     iso={iso} />}
      {sc==="expect4"      && <SExpect      next={next} week={4}     iso={iso} />}
      {sc==="expect12"     && <SExpect      next={next} week={12}    iso={iso} />}
      {sc==="expect12m"    && <SExpect      next={next} week={"12m"} iso={iso} />}
      {sc==="levelUp"      && <SLevelUp     next={next} iso={iso} />}
      {sc==="choosePlan"   && <SChoosePlan  iso={iso} />}
    </>
  );
}
