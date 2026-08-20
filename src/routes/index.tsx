import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase, getActiveSubscription } from "../lib/supabase";

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
  { id:1,  image:GCS+"Adventure_icon.webp",  labels:{en:"Adventure",es:"Aventura",de:"Abenteuer",fr:"Aventure",it:"Avventura",pt:"Aventura",ru:"Приключения",uk:"Пригоди",bg:"Приключение",zh:"冒险",cs:"Dobrodružství",fi:"Seikkailu",el:"Περιπέτεια",id:"Petualangan",ja:"冒険",ko:"모험",pl:"Przygoda",sv:"Äventyr",tr:"Macera"} },
  { id:2,  image:GCS+"Art.webp",             labels:{en:"Art",es:"Arte",de:"Kunst",fr:"Art",it:"Arte",pt:"Arte",ru:"Искусство",uk:"Мистецтво",bg:"Изкуство",zh:"艺术",cs:"Umění",fi:"Taide",el:"Τέχνη",id:"Seni",ja:"芸術",ko:"예술",pl:"Sztuka",sv:"Konst",tr:"Sanat"} },
  { id:3,  image:GCS+"Beauty.webp",          labels:{en:"Beauty",es:"Belleza",de:"Schönheit",fr:"Beauté",it:"Bellezza",pt:"Beleza",ru:"Красота",uk:"Краса",bg:"Красота",zh:"美容",cs:"Krása",fi:"Kauneus",el:"Ομορφιά",id:"Kecantikan",ja:"美容",ko:"미용",pl:"Uroda",sv:"Skönhet",tr:"Güzellik"} },
  { id:4,  image:GCS+"Business.webp",        labels:{en:"Business",es:"Negocios",de:"Business",fr:"Affaires",it:"Affari",pt:"Negócios",ru:"Бизнес",uk:"Бізнес",bg:"Бизнес",zh:"商业",cs:"Byznys",fi:"Bisnes",el:"Επιχείρηση",id:"Bisnis",ja:"ビジネス",ko:"비즈니스",pl:"Biznes",sv:"Affärer",tr:"İş"} },
  { id:5,  image:GCS+"Career_icon.webp",     labels:{en:"Career",es:"Carrera",de:"Karriere",fr:"Carrière",it:"Carriera",pt:"Carreira",ru:"Карьера",uk:"Кар'єра",bg:"Кариера",zh:"职业",cs:"Kariéra",fi:"Ura",el:"Καριέρα",id:"Karier",ja:"キャリア",ko:"커리어",pl:"Kariera",sv:"Karriär",tr:"Kariyer"} },
  { id:7,  image:GCS+"Daily.webp",           labels:{en:"Daily Life",es:"Vida diaria",de:"Alltag",fr:"Vie quotidienne",it:"Vita quotidiana",pt:"Vida diária",ru:"Повседневная жизнь",uk:"Повсякденне життя",bg:"Ежедневие",zh:"日常生活",cs:"Každodenní život",fi:"Arki",el:"Καθημερινή ζωή",id:"Kehidupan sehari-hari",ja:"日常生活",ko:"일상생활",pl:"Życie codzienne",sv:"Vardagsliv",tr:"Günlük hayat"} },
  { id:8,  image:GCS+"Doctor.webp",          labels:{en:"Doctor",es:"Médico",de:"Arzt",fr:"Médecin",it:"Dottore",pt:"Médico",ru:"Врач",uk:"Лікар",bg:"Лекар",zh:"医生",cs:"Doktor",fi:"Lääkäri",el:"Γιατρός",id:"Dokter",ja:"医者",ko:"의사",pl:"Lekarz",sv:"Läkare",tr:"Doktor"} },
  { id:10, image:GCS+"Embassy.webp",         labels:{en:"Embassy",es:"Embajada",de:"Botschaft",fr:"Ambassade",it:"Ambasciata",pt:"Embaixada",ru:"Посольство",uk:"Посольство",bg:"Посолство",zh:"大使馆",cs:"Velvyslanectví",fi:"Suurlähetystö",el:"Πρεσβεία",id:"Kedutaan",ja:"大使館",ko:"대사관",pl:"Ambasada",sv:"Ambassad",tr:"Büyükelçilik"} },
  { id:11, image:GCS+"Food.webp",            labels:{en:"Food",es:"Comida",de:"Essen",fr:"Nourriture",it:"Cibo",pt:"Comida",ru:"Еда",uk:"Їжа",bg:"Храна",zh:"食物",cs:"Jídlo",fi:"Ruoka",el:"Φαγητό",id:"Makanan",ja:"食べ物",ko:"음식",pl:"Jedzenie",sv:"Mat",tr:"Yemek"} },
  { id:12, image:GCS+"Gym.webp",             labels:{en:"Gym",es:"Gimnasio",de:"Fitnessstudio",fr:"Salle de sport",it:"Palestra",pt:"Academia",ru:"Спортзал",uk:"Спортзал",bg:"Фитнес",zh:"健身房",cs:"Posilovna",fi:"Kuntosali",el:"Γυμναστήριο",id:"Gym",ja:"ジム",ko:"헬스장",pl:"Siłownia",sv:"Gym",tr:"Spor salonu"} },
  { id:13, image:GCS+"Party.webp",           labels:{en:"Party",es:"Fiesta",de:"Party",fr:"Fête",it:"Festa",pt:"Festa",ru:"Вечеринка",uk:"Вечірка",bg:"Парти",zh:"派对",cs:"Párty",fi:"Juhlat",el:"Πάρτι",id:"Pesta",ja:"パーティー",ko:"파티",pl:"Impreza",sv:"Fest",tr:"Parti"} },
  { id:14, image:GCS+"Politics.webp",        labels:{en:"Politics",es:"Política",de:"Politik",fr:"Politique",it:"Politica",pt:"Política",ru:"Политика",uk:"Політика",bg:"Политика",zh:"政治",cs:"Politika",fi:"Politiikka",el:"Πολιτική",id:"Politik",ja:"政治",ko:"정치",pl:"Polityka",sv:"Politik",tr:"Siyaset"} },
  { id:15, image:GCS+"Restaurant.webp",      labels:{en:"Restaurant",es:"Restaurante",de:"Restaurant",fr:"Restaurant",it:"Ristorante",pt:"Restaurante",ru:"Ресторан",uk:"Ресторан",bg:"Ресторант",zh:"餐厅",cs:"Restaurace",fi:"Ravintola",el:"Εστιατόριο",id:"Restoran",ja:"レストラン",ko:"레스토랑",pl:"Restauracja",sv:"Restaurang",tr:"Restoran"} },
  { id:16, image:GCS+"Romance_romance.webp", labels:{en:"Romance",es:"Romance",de:"Romantik",fr:"Romance",it:"Romanticismo",pt:"Romance",ru:"Романтика",uk:"Романтика",bg:"Романтика",zh:"浪漫",cs:"Romantika",fi:"Romantiikka",el:"Ρομάντζο",id:"Romansa",ja:"ロマンス",ko:"로맨스",pl:"Romans",sv:"Romans",tr:"Romantizm"} },
  { id:17, image:GCS+"Shopping.webp",        labels:{en:"Shopping",es:"Compras",de:"Einkaufen",fr:"Shopping",it:"Shopping",pt:"Compras",ru:"Шопинг",uk:"Шопінг",bg:"Пазаруване",zh:"购物",cs:"Nakupování",fi:"Ostokset",el:"Ψώνια",id:"Belanja",ja:"ショッピング",ko:"쇼핑",pl:"Zakupy",sv:"Shopping",tr:"Alışveriş"} },
  { id:18, image:GCS+"Tech.webp",            labels:{en:"Tech",es:"Tecnología",de:"Technik",fr:"Technologie",it:"Tecnologia",pt:"Tecnologia",ru:"Технологии",uk:"Технології",bg:"Технологии",zh:"科技",cs:"Technologie",fi:"Teknologia",el:"Τεχνολογία",id:"Teknologi",ja:"テクノロジー",ko:"기술",pl:"Technologia",sv:"Teknik",tr:"Teknoloji"} },
  { id:19, image:GCS+"Travel_icon.webp",     labels:{en:"Travel",es:"Viajes",de:"Reisen",fr:"Voyage",it:"Viaggi",pt:"Viagens",ru:"Путешествия",uk:"Подорожі",bg:"Пътуване",zh:"旅行",cs:"Cestování",fi:"Matkailu",el:"Ταξίδι",id:"Perjalanan",ja:"旅行",ko:"여행",pl:"Podróże",sv:"Resor",tr:"Seyahat"} },
];

const PLANS = [
  { id:"week",    label:"1 semana", save:"AHORRE 47%", orig:"$2.14",  sale:"$1.14", perDay:"Por día", fullOrig:"$14.99", fullSale:"$7.99",  popular:false },
  { id:"month",   label:"1 mes",    save:"AHORRE 57%", orig:"$1.00",  sale:"$0.43", perDay:"Por día", fullOrig:"$29.99", fullSale:"$12.99", popular:true  },
  { id:"quarter", label:"3 meses",  save:"AHORRE 56%", orig:"$0.78",  sale:"$0.33", perDay:"Por día", fullOrig:"$69.99", fullSale:"$29.99", popular:false },
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
const BASE: React.CSSProperties = { height:"100dvh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", color:"#fff", fontFamily:"'Inter',-apple-system,sans-serif", overflow:"hidden" };
const SCROLL: React.CSSProperties = { ...BASE, overflowY:"auto", overflowX:"hidden", height:"100dvh" };

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

function TestProgressBar({ current, total }: { current:number; total:number }) {
  return (
    <div style={{ width:"100%", maxWidth:480, padding:"16px 20px 0", display:"flex", alignItems:"center", gap:0 }}>
      {Array.from({length:total},(_,i)=>{
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{
              width:22, height:22, borderRadius:"50%", flexShrink:0,
              background: done ? "#4C9FFF" : active ? "#4C9FFF" : "rgba(255,255,255,0.12)",
              border: active ? "2px solid #4C9FFF" : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.3s",
            }}>
              {done && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
              {active && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
            </div>
            {i < total-1 && (
              <div style={{ flex:1, height:3, background: done ? "#4C9FFF" : "rgba(255,255,255,0.12)", transition:"background 0.3s" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
    <div style={{ ...BASE, justifyContent:"flex-start", paddingBottom:88 }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      {/* Logo */}
      <div style={{ padding:"20px 0 0", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <img src={CDN+"lola.png"} alt="" style={{ width:36, height:36, borderRadius:"50%" }} />
        <span style={{ fontWeight:800, fontSize:17, letterSpacing:-0.5 }}>iola Speak</span>
      </div>
      {/* Text */}
      <div style={{ padding:"16px 28px 0", textAlign:"center", flexShrink:0 }}>
        <h1 style={{ fontSize:26, fontWeight:900, margin:"0 0 10px", lineHeight:1.25 }}>{tr(iso,"unlock")}</h1>
        <p style={{ color:"#8899aa", fontSize:15, margin:"0 0 8px", lineHeight:1.5, maxWidth:360 }}>{tr(iso,"plan")}</p>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#556677", margin:0 }}>{tr(iso,"quiz3").toUpperCase()}</p>
      </div>
      {/* Hero image — fills remaining space without overflowing */}
      <div style={{ flex:1, minHeight:0, display:"flex", alignItems:"flex-end", justifyContent:"center", overflow:"hidden", width:"100%" }}>
        <img src={CDN+"hero.webp"} alt="" style={{ height:"100%", maxWidth:"100%", objectFit:"contain", objectPosition:"bottom", animation:"float 4s ease-in-out infinite" }} />
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SLanguage({ next, langId, setLangId }: { next:()=>void; langId:number; setLangId:(n:number)=>void }) {
  const iso = LANGUAGES.find(l=>l.id===langId)?.iso ?? "es";
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
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
          <input value={name} onChange={e=>setName(e.target.value)} placeholder=""
            style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:17, fontWeight:500 }} autoFocus />
        </div>
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
    <div style={{ ...SCROLL, paddingBottom:100 }}>
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
    <div style={{ ...BASE, justifyContent:"space-between", padding:"0 20px 100px" }}>
      <ProgressBar screen="how"/>
      <h2 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"16px 0 0", lineHeight:1.3 }}>Aprender idiomas ejercita el cerebro</h2>
      {/* Image left + stats right */}
      <div style={{ flex:1, display:"flex", alignItems:"center", gap:16, width:"100%", maxWidth:460 }}>
        <img src="https://ai.lolaspeak.com/Images/Brains.webp" alt="" style={{ width:"45%", maxWidth:180, objectFit:"contain", flexShrink:0 }}/>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>
          {[["Enfoque y\nflexibilidad","+35%"],["Memoria","+50%"]].map(([l,v])=>(
            <div key={l}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", whiteSpace:"pre-line", lineHeight:1.3, marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:42, fontWeight:900, color:G, lineHeight:1 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ color:"#444", fontSize:11, lineHeight:1.7, textAlign:"center", margin:0 }}>{tr(iso,"source")}<br/>Linck et al., 2014 · Bialystock & Martin, 2014</p>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SWhy({ next, sel, setSel, iso, langId }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string; langId:number }) {
  const pick = (id:number) => { setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); setTimeout(next,300); };
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
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
    <div style={{ ...BASE, justifyContent:"space-between", padding:"32px 24px 100px", textAlign:"center" }}>
      <h1 style={{ fontSize:24, fontWeight:800, margin:0 }}>{tr(iso,"goodHands")}</h1>
      <div style={{ position:"relative", width:"100%", maxWidth:420, margin:"0 auto", aspectRatio:"520/418" }}>
        <div style={{ width:"100%", height:"100%", backgroundImage:`url(https://cdn-eu.lolaenglish.com/web-images%2Fhands.webp)`, backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition:"center" }}/>
        {/* Claude spark logo */}
        <div style={{ position:"absolute", left:"22%", top:"68%", transform:"translate(-50%,-50%)", width:"10%", aspectRatio:"1", borderRadius:"50%", background:"#E8622A", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.5)" }}>
          <svg viewBox="0 0 100 100" style={{ width:"65%", height:"65%", fill:"none", stroke:"#fff", strokeWidth:7, strokeLinecap:"round" }} xmlns="http://www.w3.org/2000/svg">
            {Array.from({length:12},(_,i)=>{const a=(i*30-90)*Math.PI/180;const x1=50+18*Math.cos(a);const y1=50+18*Math.sin(a);const x2=50+44*Math.cos(a);const y2=50+44*Math.sin(a);return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>;})}
          </svg>
        </div>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SStruggles({ next, sel, setSel, iso, langId }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string; langId:number }) {
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
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
    <div style={{ ...BASE, justifyContent:"space-between", padding:"0 24px 100px", textAlign:"center" }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:32 }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:64, opacity:0.35, filter:"grayscale(0.6)" }}>💡</div>
          <span style={{ fontSize:13, color:"#8899aa", fontWeight:600, maxWidth:80, lineHeight:1.3 }}>Estudio regular</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:110, filter:"drop-shadow(0 0 24px rgba(255,200,0,0.7)) drop-shadow(0 0 48px rgba(255,160,0,0.4))", animation:"glowPulse 2.5s ease-in-out infinite" }}>💡</div>
          <span style={{ fontSize:13, color:"#fff", fontWeight:700, maxWidth:90, lineHeight:1.3 }}>Repetición espaciada</span>
        </div>
      </div>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ fontSize:36, fontWeight:900, color:G, marginBottom:4 }}>2x</div>
        <h2 style={{ fontSize:20, fontWeight:800, margin:"0 0 8px" }}>Retención a largo plazo</h2>
        <p style={{ color:"#8899aa", lineHeight:1.6, margin:"0 0 20px", maxWidth:340, marginInline:"auto", fontSize:14 }}>Practicar incluso 5 minutos al día puede acelerar tu aprendizaje de manera significativa</p>
        <div style={{ display:"flex", gap:14, width:"100%" }}>
          {[["Retención","3x más"],["Confianza","+60%"]].map(([l,v])=>(
            <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"22px 12px" }}>
              <div style={{ fontSize:32, fontWeight:900, color:G }}>{v}</div>
              <div style={{ fontSize:13, color:"#8899aa", marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function STopics({ next, sel, setSel, iso }: { next:()=>void; sel:number[]; setSel:(fn:(p:number[])=>number[])=>void; iso:string }) {
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
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
              <img src={tp.image} alt={(tp.labels as Record<string,string>)[iso] ?? tp.labels.en} style={{ width:44, height:44, objectFit:"contain" }}/>
              <span style={{ fontSize:11, textAlign:"center", color:on?G:"#bbb", fontWeight:on?700:400 }}>{(tp.labels as Record<string,string>)[iso] ?? tp.labels.en}</span>
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

function SGender({ next, iso }: { next:()=>void; iso:string }) {
  const GENDER_LABELS: Record<string,{m:string;f:string}> = {
    es:{m:"Soy hombre",f:"Soy mujer"},en:{m:"I'm male",f:"I'm female"},de:{m:"Ich bin männlich",f:"Ich bin weiblich"},
    fr:{m:"Je suis un homme",f:"Je suis une femme"},it:{m:"Sono un uomo",f:"Sono una donna"},pt:{m:"Sou homem",f:"Sou mulher"},
    ru:{m:"Я мужчина",f:"Я женщина"},uk:{m:"Я чоловік",f:"Я жінка"},bg:{m:"Аз съм мъж",f:"Аз съм жена"},
    zh:{m:"我是男性",f:"我是女性"},cs:{m:"Jsem muž",f:"Jsem žena"},fi:{m:"Olen mies",f:"Olen nainen"},
    el:{m:"Είμαι άντρας",f:"Είμαι γυναίκα"},id:{m:"Saya laki-laki",f:"Saya perempuan"},ja:{m:"男性です",f:"女性です"},
    ko:{m:"남성입니다",f:"여성입니다"},pl:{m:"Jestem mężczyzną",f:"Jestem kobietą"},sv:{m:"Jag är man",f:"Jag är kvinna"},tr:{m:"Erkek",f:"Kadın"},
  };
  const labels = GENDER_LABELS[iso] ?? GENDER_LABELS.es;
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"32px 20px 100px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:0 }}>{tr(iso,"unlock")}</h1>
      <p style={{ color:"#8899aa", textAlign:"center", fontSize:14, margin:"8px 0 0" }}>{tr(iso,"plan")}</p>
      <div style={{ display:"flex", gap:16, width:"100%", maxWidth:400 }}>
        {[{key:"m",label:labels.m,img:CDN+"Male25-34.webp"},{key:"f",label:labels.f,img:CDN+"Female25-34.webp"}].map(g=>(
          <div key={g.key} onClick={()=>next()} style={{
            flex:1, borderRadius:20, overflow:"hidden", cursor:"pointer", position:"relative",
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)",
          }}>
            <div style={{ width:"100%", aspectRatio:"2/3", backgroundImage:`url(${g.img})`, backgroundSize:"cover", backgroundPosition:"center top" }}/>
            <div style={{ padding:"12px 8px", textAlign:"center", fontSize:14, fontWeight:700 }}>{g.label}</div>
          </div>
        ))}
      </div>
      <p style={{ color:"#334", fontSize:11, textAlign:"center", margin:0 }}>
        <a href="https://lolaspeak.com/terms" target="_blank" style={{ color:"#556677" }}>Terms</a>
        {" & "}
        <a href="https://lolaspeak.com/privacy" target="_blank" style={{ color:"#556677" }}>Privacy</a>
      </p>
    </div>
  );
}

function SAgeRange({ next, iso }: { next:()=>void; iso:string }) {
  const AGE_LABELS: Record<string,string[]> = {
    es:["18 - 24","25 - 34","35 - 44","45+"],en:["18 - 24","25 - 34","35 - 44","45+"],
    de:["18 - 24","25 - 34","35 - 44","45+"],fr:["18 - 24","25 - 34","35 - 44","45+"],
  };
  const ages = [
    { label:"18 - 24", img:CDN+"18_24.webp" },
    { label:"25 - 34", img:CDN+"25_34.webp" },
    { label:"35 - 44", img:CDN+"35_44.webp" },
    { label:"45+",     img:CDN+"45.webp"    },
  ];
  const AGE_Q: Record<string,string> = {
    es:"¿Cuántos años tienes?",en:"How old are you?",de:"Wie alt bist du?",fr:"Quel âge as-tu?",
    it:"Quanti anni hai?",pt:"Quantos anos tens?",ru:"Сколько вам лет?",uk:"Скільки вам років?",
    bg:"На колко години си?",zh:"你多大了？",cs:"Kolik ti je let?",fi:"Kuinka vanha olet?",
    el:"Πόσο χρονών είσαι;",id:"Berapa umurmu?",ja:"何歳ですか？",ko:"나이가 어떻게 되세요?",
    pl:"Ile masz lat?",sv:"Hur gammal är du?",tr:"Kaç yaşındasın?",
  };
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"32px 20px 100px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:0 }}>{AGE_Q[iso] ?? AGE_Q.es}</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, width:"100%", maxWidth:400 }}>
        {ages.map(a=>(
          <div key={a.label} onClick={()=>next()} style={{
            borderRadius:20, overflow:"hidden", cursor:"pointer",
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)",
          }}>
            <div style={{ width:"100%", aspectRatio:"1", backgroundImage:`url(${a.img})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
            <div style={{ padding:"10px 8px", textAlign:"center", fontSize:14, fontWeight:700 }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SAppBenefits({ next, iso }: { next:()=>void; iso:string }) {
  const BENEFITS = [
    { img:CDN+"situations.webp", key:"situations" },
    { img:CDN+"ai.webp",         key:"ai" },
    { img:CDN+"watch.webp",      key:"watch" },
    { img:CDN+"pickUp.webp",     key:"pickUp" },
    { img:CDN+"remember.webp",   key:"remember" },
    { img:CDN+"fluency.webp",    key:"fluency" },
  ];
  const LABELS: Record<string,Record<string,string>> = {
    situations:{ es:"Practica situaciones reales", en:"Practice real situations", de:"Echte Situationen üben", fr:"Pratiquer des situations réelles", it:"Pratica situazioni reali", pt:"Pratica situações reais", ru:"Практикуй реальные ситуации", uk:"Практикуй реальні ситуації", bg:"Практикувай реални ситуации", zh:"练习真实场景", cs:"Procvičuj reálné situace", fi:"Harjoittele todellisia tilanteita", el:"Εξάσκηση σε πραγματικές καταστάσεις", id:"Latihan situasi nyata", ja:"実際の状況を練習する", ko:"실제 상황 연습", pl:"Ćwicz realne sytuacje", sv:"Öva verkliga situationer", tr:"Gerçek durumları pratik yap" },
    ai:{ es:"IA que te corrige en tiempo real", en:"AI that corrects you in real time", de:"KI korrigiert dich in Echtzeit", fr:"IA qui te corrige en temps réel", it:"IA che ti corregge in tempo reale", pt:"IA que te corrige em tempo real", ru:"ИИ исправляет тебя в реальном времени", uk:"ШІ виправляє тебе в реальному часі", bg:"ИИ, който те коригира в реално време", zh:"AI实时纠正你", cs:"AI tě opravuje v reálném čase", fi:"Tekoäly korjaa sinut reaaliajassa", el:"ΑΙ που σε διορθώνει σε πραγματικό χρόνο", id:"AI yang mengoreksimu secara real-time", ja:"AIがリアルタイムで修正", ko:"실시간으로 교정하는 AI", pl:"AI koryguje cię w czasie rzeczywistym", sv:"AI som rättar dig i realtid", tr:"Sizi gerçek zamanlı düzelten yapay zeka" },
    watch:{ es:"Aprende con video lecciones", en:"Learn with video lessons", de:"Lerne mit Video-Lektionen", fr:"Apprends avec des leçons vidéo", it:"Impara con video lezioni", pt:"Aprende com lições em vídeo", ru:"Учись с видео-уроками", uk:"Вчись з відеоуроками", bg:"Учи с видео уроци", zh:"通过视频课程学习", cs:"Uč se s video lekcemi", fi:"Opi videoopetuksin", el:"Μάθε με μαθήματα βίντεο", id:"Belajar dengan pelajaran video", ja:"ビデオレッスンで学ぶ", ko:"비디오 레슨으로 배우기", pl:"Ucz się z lekcjami wideo", sv:"Lär med videolektioner", tr:"Video derslerle öğren" },
    pickUp:{ es:"Aprende palabras nuevas en contexto", en:"Pick up new words in context", de:"Neue Wörter im Kontext lernen", fr:"Apprendre de nouveaux mots en contexte", it:"Impara nuove parole nel contesto", pt:"Aprende novas palavras em contexto", ru:"Учи новые слова в контексте", uk:"Вивчай нові слова в контексті", bg:"Научавай нови думи в контекст", zh:"在情境中学习新词", cs:"Učit se nová slova v kontextu", fi:"Opi uusia sanoja asiayhteydessä", el:"Μάθε νέες λέξεις στο πλαίσιο", id:"Pelajari kata-kata baru dalam konteks", ja:"文脈の中で新しい単語を学ぶ", ko:"맥락 속에서 새로운 단어 습득", pl:"Ucz się nowych słów w kontekście", sv:"Plocka upp nya ord i sammanhang", tr:"Bağlamda yeni kelimeler öğren" },
    remember:{ es:"Recuerda palabras para siempre", en:"Remember words forever", de:"Wörter für immer merken", fr:"Retenir les mots pour toujours", it:"Ricorda le parole per sempre", pt:"Lembra-te das palavras para sempre", ru:"Запоминай слова навсегда", uk:"Запам'ятовуй слова назавжди", bg:"Запомни думи завинаги", zh:"永久记住单词", cs:"Pamatuj si slova navždy", fi:"Muista sanat ikuisesti", el:"Θυμάσαι λέξεις για πάντα", id:"Ingat kata-kata selamanya", ja:"言葉を永遠に覚える", ko:"단어를 영원히 기억하세요", pl:"Zapamiętuj słowa na zawsze", sv:"Kom ihåg ord för alltid", tr:"Kelimeleri sonsuza kadar hatırla" },
    fluency:{ es:"Habla con fluidez y confianza", en:"Speak fluently and confidently", de:"Fließend und selbstbewusst sprechen", fr:"Parler couramment et avec confiance", it:"Parlare con fluidità e sicurezza", pt:"Falar com fluência e confiança", ru:"Говори бегло и уверенно", uk:"Говори вільно і впевнено", bg:"Говори свободно и уверено", zh:"流利自信地表达", cs:"Mluv plynně a sebejistě", fi:"Puhu sujuvasti ja itsevarmasti", el:"Μίλα άπταιστα και με αυτοπεποίθηση", id:"Berbicara dengan fasih dan percaya diri", ja:"流暢に自信を持って話す", ko:"유창하고 자신감 있게 말하기", pl:"Mów płynnie i pewnie", sv:"Tala flytande och självförtroende", tr:"Akıcı ve güvenle konuş" },
  };
  const TITLE: Record<string,string> = {
    es:"Lo que conseguirás",en:"What you'll achieve",de:"Was du erreichen wirst",fr:"Ce que tu réaliseras",it:"Cosa raggiungerai",pt:"O que vais conseguir",ru:"Чего ты достигнешь",uk:"Чого ти досягнеш",bg:"Какво ще постигнеш",zh:"你将获得什么",cs:"Čeho dosáhneš",fi:"Mitä saavutat",el:"Τι θα πετύχεις",id:"Apa yang akan kamu capai",ja:"何を達成するか",ko:"무엇을 이룰 수 있는지",pl:"Co osiągniesz",sv:"Vad du kommer att uppnå",tr:"Ne elde edeceksin",
  };
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px" }}>{TITLE[iso] ?? TITLE.es}</h1>
        {BENEFITS.map(b=>(
          <div key={b.key} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 14px" }}>
            <img src={b.img} alt="" style={{ width:44, height:44, objectFit:"contain", borderRadius:10, flexShrink:0 }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{LABELS[b.key]?.[iso] ?? LABELS[b.key]?.en}</span>
            <span style={{ marginLeft:"auto", color:G, fontSize:16 }}>✓</span>
          </div>
        ))}
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SProgram({ next, iso }: { next:()=>void; iso:string }) {
  const FEATURES = [
    { img:CDN+"select.svg",   key:"select" },
    { img:CDN+"level.svg",    key:"level" },
    { img:CDN+"finding.svg",  key:"finding" },
    { img:CDN+"video.svg",    key:"video" },
    { img:CDN+"creating.svg", key:"creating" },
  ];
  const LABELS: Record<string,Record<string,string>> = {
    select:  { es:"Selecciona lecciones por interés",en:"Select lessons by interest",de:"Lektionen nach Interesse auswählen",fr:"Sélectionner des leçons par intérêt",it:"Seleziona lezioni per interesse",pt:"Seleciona lições por interesse",ru:"Выбирай уроки по интересам",uk:"Вибирай уроки за інтересами",bg:"Избирай уроци по интерес",zh:"按兴趣选择课程",cs:"Vybírej lekce podle zájmů",fi:"Valitse oppitunteja kiinnostuksen mukaan",el:"Επιλέξτε μαθήματα βάσει ενδιαφέροντος",id:"Pilih pelajaran berdasarkan minat",ja:"興味に合わせてレッスンを選ぶ",ko:"관심사별 레슨 선택",pl:"Wybieraj lekcje wg zainteresowań",sv:"Välj lektioner efter intresse",tr:"İlgiye göre ders seç" },
    level:   { es:"Ajusta el nivel de dificultad",en:"Adjust difficulty level",de:"Schwierigkeitslevel anpassen",fr:"Ajuster le niveau de difficulté",it:"Regola il livello di difficoltà",pt:"Ajusta o nível de dificuldade",ru:"Регулируй уровень сложности",uk:"Регулюй рівень складності",bg:"Регулирай нивото на трудност",zh:"调整难度等级",cs:"Nastav úroveň obtížnosti",fi:"Säädä vaikeustasoa",el:"Ρύθμιση επιπέδου δυσκολίας",id:"Sesuaikan tingkat kesulitan",ja:"難易度レベルを調整する",ko:"난이도 레벨 조정",pl:"Dostosuj poziom trudności",sv:"Justera svårighetsgrad",tr:"Zorluk seviyesini ayarla" },
    finding: { es:"Encuentra palabras relevantes",en:"Find relevant words",de:"Relevante Wörter finden",fr:"Trouver des mots pertinents",it:"Trova parole rilevanti",pt:"Encontra palavras relevantes",ru:"Находи нужные слова",uk:"Знаходь потрібні слова",bg:"Намирай релевантни думи",zh:"找到相关词汇",cs:"Najdi relevantní slova",fi:"Löydä relevantteja sanoja",el:"Βρείτε σχετικές λέξεις",id:"Temukan kata-kata yang relevan",ja:"関連する単語を見つける",ko:"관련 단어 찾기",pl:"Znajdź odpowiednie słowa",sv:"Hitta relevanta ord",tr:"İlgili kelimeleri bul" },
    video:   { es:"Videoclips con explicaciones",en:"Video clips with explanations",de:"Videoclips mit Erklärungen",fr:"Clips vidéo avec explications",it:"Videoclip con spiegazioni",pt:"Videoclips com explicações",ru:"Видеоклипы с объяснениями",uk:"Відеокліпи з поясненнями",bg:"Видеоклипове с обяснения",zh:"带解说的视频片段",cs:"Videoklipy s vysvětlením",fi:"Videoleikkeet selityksineen",el:"Βίντεο κλιπ με εξηγήσεις",id:"Klip video dengan penjelasan",ja:"解説付きビデオクリップ",ko:"설명이 있는 비디오 클립",pl:"Klipy wideo z wyjaśnieniami",sv:"Videoklipp med förklaringar",tr:"Açıklamalı video klipleri" },
    creating:{ es:"Chats de IA para practicar",en:"AI chats to practice",de:"KI-Chats zum Üben",fr:"Chats IA pour pratiquer",it:"Chat IA per praticare",pt:"Chats de IA para praticar",ru:"Чаты с ИИ для практики",uk:"Чати з ШІ для практики",bg:"Чатове с ИИ за практика",zh:"AI对话练习",cs:"Chaty s AI pro procvičování",fi:"Tekoälychattia harjoitteluun",el:"Συνομιλίες ΑΙ για εξάσκηση",id:"Chat AI untuk berlatih",ja:"AIチャットで練習",ko:"AI 채팅으로 연습",pl:"Czaty AI do ćwiczeń",sv:"AI-chattar att öva med",tr:"Pratik yapmak için AI sohbetleri" },
  };
  const TITLE: Record<string,string> = {
    es:"Tu programa incluye",en:"Your program includes",de:"Dein Programm beinhaltet",fr:"Ton programme comprend",it:"Il tuo programma include",pt:"O teu programa inclui",ru:"Твоя программа включает",uk:"Твоя програма включає",bg:"Програмата ти включва",zh:"你的课程包含",cs:"Tvůj program zahrnuje",fi:"Ohjelmaasi kuuluu",el:"Το πρόγραμμά σου περιλαμβάνει",id:"Programmu mencakup",ja:"プログラムに含まれるもの",ko:"프로그램에 포함된 것",pl:"Twój program obejmuje",sv:"Ditt program inkluderar",tr:"Programın şunları içerir",
  };
  return (
    <div style={{ ...SCROLL, paddingBottom:100 }}>
      <div style={{ width:"100%", maxWidth:480, padding:"28px 20px 0" }}>
        <h1 style={{ fontSize:22, fontWeight:800, textAlign:"center", margin:"0 0 24px" }}>{TITLE[iso] ?? TITLE.es}</h1>
        {FEATURES.map(f=>(
          <div key={f.key} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 14px" }}>
            <img src={f.img} alt="" style={{ width:40, height:40, objectFit:"contain", flexShrink:0 }}/>
            <span style={{ fontSize:15, fontWeight:500 }}>{LABELS[f.key]?.[iso] ?? LABELS[f.key]?.en}</span>
            <span style={{ marginLeft:"auto", color:G, fontSize:16 }}>✓</span>
          </div>
        ))}
      </div>
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
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!ok) return;
    setLoading(true);
    try {
      await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    } catch (_) {}
    setLoading(false);
    next();
  }

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
      <NextBtn onClick={handleNext} disabled={!ok || loading}>{loading ? "..." : tr(iso,"next")}</NextBtn>
    </div>
  );
}

function SBuilding({ next, iso }: { next:()=>void; iso:string }) {
  const PROG_STEPS = [
    { img:CDN+"prog_step_1.webp",   pct:16 },
    { img:CDN+"prog_step_2.webp",   pct:32 },
    { img:CDN+"prog_step_3.webp",   pct:48 },
    { img:CDN+"prog_step_4.webp",   pct:64 },
    { img:CDN+"prog_step_5.webp",   pct:80 },
    { img:CDN+"prog_step_6.webp",   pct:100 },
  ];
  const STEP_LABELS: Record<string,string[]> = {
    es:["Analizando tu nivel...","Creando diálogos...","Añadiendo práctica de IA...","Seleccionando vocabulario...","Configurando pronunciación...","Trazando tu camino..."],
    en:["Analyzing your level...","Creating dialogues...","Adding AI speaking practice...","Selecting vocabulary level...","Pronunciation training setup...","Mapping your learning path..."],
    de:["Dein Level analysieren...","Dialoge erstellen...","KI-Sprachpraxis hinzufügen...","Vokabellevel auswählen...","Aussprachetraining einrichten...","Lernpfad kartieren..."],
    fr:["Analyser votre niveau...","Créer des dialogues...","Ajouter la pratique IA...","Sélectionner le vocabulaire...","Configurer la prononciation...","Tracer votre parcours..."],
    it:["Analizzando il tuo livello...","Creando dialoghi...","Aggiungendo pratica IA...","Selezionando vocabolario...","Configurando pronuncia...","Mappando il tuo percorso..."],
    pt:["A analisar o teu nível...","A criar diálogos...","A adicionar prática com IA...","A selecionar vocabulário...","A configurar pronúncia...","A traçar o teu caminho..."],
    ru:["Анализируем уровень...","Создаём диалоги...","Добавляем практику ИИ...","Подбираем словарный запас...","Настраиваем произношение...","Строим путь обучения..."],
    uk:["Аналізуємо рівень...","Створюємо діалоги...","Додаємо практику ШІ...","Вибираємо словниковий запас...","Налаштовуємо вимову...","Будуємо шлях навчання..."],
  };
  const labels = STEP_LABELS[iso] ?? STEP_LABELS.es;
  const [si, setSi] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(()=>{
    const timers = PROG_STEPS.map((_,i)=>setTimeout(()=>{ setSi(i); setPct(PROG_STEPS[i].pct); }, i*800));
    const done = setTimeout(()=>next(), PROG_STEPS.length*800+400);
    return()=>{ timers.forEach(clearTimeout); clearTimeout(done); };
  },[]);
  const cur = PROG_STEPS[si];
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"32px 28px 48px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{tr(iso,"building")}</h1>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", width:"100%" }}>
        <img src={cur.img} alt="" style={{ width:"70%", maxWidth:260, objectFit:"contain", transition:"opacity 0.4s" }} key={cur.img}/>
      </div>
      <div style={{ width:"100%", maxWidth:360 }}>
        <p style={{ fontSize:14, color:"#8899aa", marginBottom:16, minHeight:22 }}>{labels[si]}</p>
        <div style={{ width:"100%", height:6, background:"rgba(255,255,255,0.1)", borderRadius:999 }}>
          <div style={{ width:`${pct}%`, height:"100%", background:G, borderRadius:999, transition:"width 0.6s ease" }}/>
        </div>
        <div style={{ marginTop:8, fontSize:13, color:G, fontWeight:700 }}>{pct}%</div>
      </div>
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
    <div style={{ ...BASE, padding:0, justifyContent:"flex-start" }}>
      {/* Hero image — full width, tall, no side margins */}
      <div style={{ width:"100%", maxWidth:480, height:340, overflow:"hidden", flexShrink:0 }}>
        <img src={D.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}/>
      </div>
      <div style={{ width:"100%", maxWidth:480, padding:"24px 20px 120px", flex:1 }}>
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

function PlanCard({ p, sel, onSel }: { p:typeof PLANS[0]; sel:boolean; onSel:()=>void }) {
  return (
    <div onClick={onSel} style={{
      position:"relative", borderRadius:16, marginBottom:10, cursor:"pointer",
      border: sel ? `2px solid ${G}` : "1.5px solid rgba(255,255,255,0.12)",
      background: sel ? "#0d1a00" : "#111",
      overflow:"visible",
    }}>
      {p.popular && (
        <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
          background:G, color:"#000", fontSize:11, fontWeight:900, padding:"3px 18px", borderRadius:999, whiteSpace:"nowrap" }}>
          EL MÁS POPULAR
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 16px" }}>
        {/* Radio */}
        <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${sel?G:"#444"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {sel && <div style={{ width:10, height:10, borderRadius:"50%", background:G }}/>}
        </div>
        {/* Label + discount badge */}
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:16, fontWeight:700 }}>{p.label}</span>
            <span style={{ fontSize:11, fontWeight:800, color:sel?G:"#888", background:sel?"rgba(174,234,0,0.12)":"rgba(255,255,255,0.07)", padding:"2px 8px", borderRadius:999 }}>{p.save}</span>
          </div>
          <div style={{ fontSize:12, color:"#666" }}>{p.fullOrig} <span style={{ textDecoration:"line-through" }}>{p.fullOrig}</span> {p.fullSale}</div>
        </div>
        {/* Price per day */}
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontSize:12, color:"#666", textDecoration:"line-through" }}>{p.orig}</div>
          <div style={{ fontSize:26, fontWeight:900, color:sel?G:"#fff", lineHeight:1 }}>
            <span style={{ fontSize:16, fontWeight:700 }}>$</span>{p.sale.replace("$","")}
          </div>
          <div style={{ fontSize:11, color:"#888" }}>{p.perDay}</div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  "Hable en lecciones de video interactivas",
  "Reciba retroalimentación de la IA",
  "Mejore su pronunciación",
  "Amplíe su vocabulario (más de 8.500 palabras)",
  "Mire videos con hablantes nativos",
  "Siga su plan personalizado",
  "Conviértase en un hablante seguro",
];

const REVIEWS = [
  { name:"Antonina", text:"Aplicación para practicar las conversaciones necesarias para vivir en EE. UU. 🙂 Es una pena que no existiera cuando me acababa de mudar." },
  { name:"Ekaterina", text:"Gran aplicación para practicar conversaciones. Puedes trabajar a tu ritmo sin limitaciones." },
  { name:"Lubov",    text:"Una app que te hace hablar de una forma muy suave, sin estrés." },
];

const COMPARE_ROWS = [
  { feat:"Retroalimentación instantánea", lola:true, tutor:true  },
  { feat:"Practique en cualquier momento, incluso por 5 minutos", lola:true, tutor:false },
  { feat:"Aprenda a entender diferentes voces y acentos", lola:true, tutor:false },
  { feat:"Sin estrés", lola:true, tutor:false },
  { feat:"50 veces más barato", lola:true, tutor:false },
];

const FAQS = [
  { q:"¿Por qué necesito la app?",   a:"Lola Speak te ayuda a practicar inglés real a tu ritmo, con IA que corrige tu pronunciación y gramática al instante." },
  { q:"¿Cómo accedo a la app?",      a:"Después del pago recibirás un enlace para descargar la app en App Store o Google Play." },
  { q:"¿Cómo cancelo mi suscripción?", a:"Puedes cancelar en cualquier momento desde la configuración de tu cuenta en la tienda de apps." },
];

function SChoosePlan({ iso }: { iso:string }) {
  const [selPlan, setSelPlan] = useState("month");
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  return (
    <div style={{ ...BASE, overflowY:"auto", padding:0, justifyContent:"flex-start" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .cp-section{animation:fadeIn 0.4s ease both}
      `}</style>

      {/* ── Pink discount banner ── */}
      <div style={{ width:"100%", background:"#d63384", padding:"12px 20px", display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
        <span style={{ fontSize:22 }}>🎁</span>
        <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Descuento único de 57% aplicado</span>
      </div>

      <div style={{ padding:"0 20px", width:"100%", maxWidth:480, alignSelf:"center" }}>

        {/* ── Headline ── */}
        <h1 style={{ fontSize:22, fontWeight:900, textAlign:"center", margin:"24px 0 20px", lineHeight:1.3 }}>
          ¡Obtenga su plan personal antes de que desaparezca!
        </h1>

        {/* ── Plan cards ── */}
        {PLANS.map(p=>(
          <PlanCard key={p.id} p={p} sel={selPlan===p.id} onSel={()=>setSelPlan(p.id)}/>
        ))}

        {/* ── CTA ── */}
        <div style={{ margin:"16px 0 8px", textAlign:"center" }}>
          <div style={{ fontSize:12, color:"#888", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <span>🔒</span> Your payment is secured
          </div>
          <button onClick={()=>{
            const urls:Record<string,string>={
              week:"https://buy.stripe.com/9B63cxge99YZdyg2Zf4AU0J",
              month:"https://buy.stripe.com/5kQ3cx1jf4EFcuc0R74AU0K",
              quarter:"https://buy.stripe.com/bJe14p7HD7QRdygczP4AU0L"
            };
            window.location.href=urls[selPlan]||urls.month;
          }} style={{
            width:"100%", height:56, background:G, border:"none", borderRadius:14,
            fontSize:18, fontWeight:800, color:"#000", cursor:"pointer",
          }}>Obtenga mi plan</button>
          <p style={{ fontSize:11, color:"#556", marginTop:10, lineHeight:1.6 }}>
            ¡Descuento aplicado! La suscripción se renovará automáticamente a $29.99 a menos que se cancele 24 horas antes de que finalice el período elegido.
          </p>
          <p style={{ fontSize:11, color:"#557", marginTop:4 }}>
            <span style={{ color:"#4af", textDecoration:"underline", cursor:"pointer" }}>Terms of Use</span>
            {" & "}
            <span style={{ color:"#4af", textDecoration:"underline", cursor:"pointer" }}>Privacy Policy</span>
          </p>
        </div>

        {/* ── Qué obtiene ── */}
        <div style={{ marginTop:32 }}>
          <h2 style={{ fontSize:20, fontWeight:800, textAlign:"center", marginBottom:16 }}>
            <span style={{ color:"#00d4ff" }}>Qué obtiene con{"\n"}Lola Speak</span>
          </h2>
          {FEATURES.map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14 }}>
              <span style={{ color:"#00d4ff", fontSize:16, flexShrink:0 }}>•</span>
              <span style={{ fontSize:15, fontWeight:600 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* ── Hasta 50 veces más barato ── */}
        <div style={{ marginTop:32, textAlign:"center" }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#00d4ff", lineHeight:1.3, marginBottom:4 }}>
            Hasta 50 veces<br/>más barato que un tutor
          </h2>
        </div>

        {/* ── Comparison table ── */}
        <div style={{ marginTop:20, borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
          {/* Header */}
          <div style={{ display:"flex", background:"rgba(255,255,255,0.05)" }}>
            <div style={{ flex:1, padding:"12px 16px", fontSize:13, fontWeight:700, color:"#00d4ff" }}>Lola Speak</div>
            <div style={{ width:1, background:"rgba(255,255,255,0.1)" }}/>
            <div style={{ flex:1, padding:"12px 16px", fontSize:13, fontWeight:700, color:"#888" }}>Tutor</div>
          </div>
          {COMPARE_ROWS.map((r,i)=>(
            <div key={i} style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ flex:1, padding:"12px 16px", fontSize:13, display:"flex", alignItems:"flex-start", gap:8 }}>
                <span style={{ color:G, flexShrink:0 }}>✓</span>{r.feat}
              </div>
              <div style={{ width:1, background:"rgba(255,255,255,0.07)" }}/>
              <div style={{ flex:1, padding:"12px 16px", fontSize:13, display:"flex", alignItems:"flex-start", gap:8 }}>
                {r.tutor
                  ? <><span style={{ color:G, flexShrink:0 }}>✓</span>{r.feat}</>
                  : <span style={{ color:"#e55", fontSize:16 }}>✕</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* ── Social proof ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:32, margin:"28px 0", textAlign:"center" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900 }}>2m+</div>
            <div style={{ fontSize:12, color:"#888" }}>Students</div>
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:900 }}>125 000+</div>
            <div style={{ fontSize:12, color:"#888" }}>⭐⭐⭐⭐⭐</div>
          </div>
        </div>

        {/* ── App store badges ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:32 }}>
          {["Google Play","App Store"].map(s=>(
            <div key={s} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"10px 20px", fontSize:13, fontWeight:600, textAlign:"center" }}>
              {s==="Google Play"?"▶ ":"🍎 "}{s}
            </div>
          ))}
        </div>

        {/* ── Reviews ── */}
        <h2 style={{ fontSize:18, fontWeight:800, textAlign:"center", marginBottom:16 }}>Únase a la comunidad</h2>
        {REVIEWS.map(r=>(
          <div key={r.name} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px", marginBottom:12 }}>
            <p style={{ fontSize:14, lineHeight:1.6, margin:"0 0 12px" }}>{r.text}</p>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"#334", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>{r.name[0]}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>{r.name}</div>
                <div style={{ color:"#f90", fontSize:12 }}>★★★★★</div>
              </div>
            </div>
          </div>
        ))}

        {/* ── Guarantee ── */}
        <div style={{ marginTop:28, textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", border:"4px solid #f90", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:10, fontWeight:800, color:"#f90", lineHeight:1.2 }}>
            <div style={{ fontSize:18 }}>14</div>
            <div>DAYS</div>
            <div>GUARANTEE</div>
          </div>
          <h3 style={{ color:"#00d4ff", fontSize:18, fontWeight:800, marginBottom:10 }}>Garantía de devolución del dinero</h3>
          <p style={{ fontSize:14, color:"#aaa", lineHeight:1.7 }}>
            Siga el programa y logre un progreso increíble en su inglés – o le devolvemos el dinero, sin preguntas.{" "}
            <strong style={{ color:"#fff" }}>Solo avísenos dentro de los 14 días si el programa no era lo que esperaba para obtener un reembolso completo.</strong>{" "}
            Con los excelentes comentarios que recibimos, ¡confiamos en que mejorará su inglés!
          </p>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop:32 }}>
          <h2 style={{ color:"#00d4ff", fontSize:20, fontWeight:800, textAlign:"center", marginBottom:16 }}>Preguntas frecuentes</h2>
          {FAQS.map((f,i)=>(
            <div key={i} onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"16px 0", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:15, fontWeight:600 }}>{f.q}</span>
                <span style={{ fontSize:20, color:"#888", transform:openFaq===i?"rotate(180deg)":"none", transition:"transform 0.2s" }}>⌄</span>
              </div>
              {openFaq===i && <p style={{ fontSize:14, color:"#aaa", margin:"10px 0 0", lineHeight:1.6 }}>{f.a}</p>}
            </div>
          ))}
        </div>

        {/* ── Bottom repeat headline + plans ── */}
        <div style={{ marginTop:36, marginBottom:8 }}>
          <h2 style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:20 }}>¡Obtenga su plan personal antes de que desaparezca!</h2>
          {PLANS.map(p=>(
            <PlanCard key={p.id} p={p} sel={selPlan===p.id} onSel={()=>setSelPlan(p.id)}/>
          ))}
          <div style={{ marginTop:12, textAlign:"center", fontSize:12, color:"#888", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:12 }}>
            <span>🔒</span> Your payment is secured
          </div>
          <button onClick={()=>{
            const urls:Record<string,string>={
              week:"https://buy.stripe.com/9B63cxge99YZdyg2Zf4AU0J",
              month:"https://buy.stripe.com/5kQ3cx1jf4EFcuc0R74AU0K",
              quarter:"https://buy.stripe.com/bJe14p7HD7QRdygczP4AU0L"
            };
            window.location.href=urls[selPlan]||urls.month;
          }} style={{
            width:"100%", height:56, background:G, border:"none", borderRadius:14,
            fontSize:18, fontWeight:800, color:"#000", cursor:"pointer", marginBottom:8,
          }}>Obtenga mi plan</button>
          <p style={{ fontSize:11, color:"#556", textAlign:"center", lineHeight:1.6 }}>
            ¡Descuento aplicado! La suscripción se renovará automáticamente a $29.99 a menos que se cancele 24 horas antes de que finalice el período elegido.
          </p>
          <p style={{ fontSize:11, color:"#557", textAlign:"center", marginTop:4, marginBottom:32 }}>
            <span style={{ color:"#4af", textDecoration:"underline", cursor:"pointer" }}>Terms of Use</span>
            {" & "}
            <span style={{ color:"#4af", textDecoration:"underline", cursor:"pointer" }}>Privacy Policy</span>
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Mini S-curve shared by test result screens ────────────────────────────────
function MiniCurve({ label1, val1, label2, val2, iso="es" }: { label1:string; val1:string; label2:string; val2:string; iso?:string }) {
  const nextMonth = (() => {
    const d = new Date(); d.setMonth(d.getMonth()+1);
    const day = d.getDate();
    const month = d.toLocaleDateString(iso==="zh"?"zh-CN":iso==="uk"?"uk":iso, {month:"long"});
    return { day, month };
  })();
  const [phase, setPhase] = useState<"p1"|"pause"|"p2">("p1");
  const [prog, setProg] = useState(0);
  const STOP1 = 0.45, STOP2 = 0.60;
  const W=320, H=185, N=100;
  const fullPts = Array.from({length:N+1},(_,i)=>{ const f=i/N,x=W*.05+f*W*.9,e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2; return {x,y:H*.92-e*H*.78}; });

  useEffect(()=>{
    // Phase 1: animate 0 → STOP1 in 1600ms
    let t0: number|null = null;
    const dur1 = 1600;
    function frame1(ts:number){
      if(!t0) t0=ts;
      const p = Math.min((ts-t0)/dur1, 1);
      setProg(p * STOP1);
      if(p < 1) requestAnimationFrame(frame1);
      else {
        setPhase("pause");
        // Pause 1 second then animate phase 2
        setTimeout(()=>{
          setPhase("p2");
          let t1: number|null = null;
          const dur2 = 900;
          function frame2(ts2:number){
            if(!t1) t1=ts2;
            const p2 = Math.min((ts2-t1)/dur2, 1);
            setProg(STOP1 + p2*(STOP2-STOP1));
            if(p2 < 1) requestAnimationFrame(frame2);
          }
          requestAnimationFrame(frame2);
        }, 1000);
      }
    }
    requestAnimationFrame(frame1);
  },[]);

  const endIdx = Math.floor(prog * N);
  const greenPts = fullPts.slice(0, Math.min(endIdx+1, N+1));
  const cur = greenPts[greenPts.length-1];
  const stop1Pt = fullPts[Math.floor(STOP1*N)];
  const stop2Pt = fullPts[Math.floor(STOP2*N)];
  const dFull = fullPts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const dGreen = greenPts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const atStop1 = prog >= STOP1 - 0.01;
  const atStop2 = prog >= STOP2 - 0.01;
  return (
    <div style={{ width:"100%", maxWidth:420, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-around", marginBottom:8 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#8899aa" }}>{label1}</div>
          <div style={{ fontSize:28, fontWeight:900 }}>{val1}</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#8899aa" }}>{label2}</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#556677" }}>{val2}</div>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+30}`} style={{ display:"block" }}>
        <path d={dFull} fill="none" stroke="rgba(180,180,180,0.2)" strokeWidth={2} strokeLinecap="round"/>
        {greenPts.length>1 && <path d={dGreen} fill="none" stroke={G} strokeWidth={3} strokeLinecap="round"/>}
        {/* Stop 1 dot — green when reached */}
        {atStop1 && <circle cx={stop1Pt.x} cy={stop1Pt.y} r={9} fill={G}/>}
        {atStop1 && <text x={stop1Pt.x} y={stop1Pt.y+4} fill="#000" fontSize={10} fontWeight="900" textAnchor="middle">✓</text>}
        {/* Animated dot when between stops */}
        {cur && prog > 0.01 && !atStop1 && <circle cx={cur.x} cy={cur.y} r={8} fill={G}/>}
        {cur && phase==="p2" && !atStop2 && <circle cx={cur.x} cy={cur.y} r={8} fill={G}/>}
        {/* Stop 2 dot — outline until reached, green when reached */}
        {!atStop2 && <circle cx={stop2Pt.x} cy={stop2Pt.y} r={7} fill="none" stroke="rgba(180,180,180,0.5)" strokeWidth={2}/>}
        {atStop2 && <circle cx={stop2Pt.x} cy={stop2Pt.y} r={9} fill={G}/>}
        {atStop2 && <text x={stop2Pt.x} y={stop2Pt.y+4} fill="#000" fontSize={10} fontWeight="900" textAnchor="middle">✓</text>}
        <text x={W*.05} y={H} fill="#556677" fontSize={10} textAnchor="middle">Hoy</text>
        <text x={stop2Pt.x} y={H} fill="#aeea00" fontSize={12} fontWeight="700" textAnchor="middle">{nextMonth.day}</text>
        <text x={stop2Pt.x} y={H+13} fill="#8899aa" fontSize={10} textAnchor="middle">{nextMonth.month}</text>
      </svg>
    </div>
  );
}

// ─── Goal chart screen (animated 3-line chart) ─────────────────────────────────
function SGoalChart({ next, iso }: { next:()=>void; iso:string }) {
  const [prog, setProg] = useState(0);
  useEffect(()=>{
    let t0: number|null = null;
    function frame(ts:number){ if(!t0)t0=ts; const p=Math.min((ts-t0)/2200,1); setProg(p); if(p<1)requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  },[]);
  const W=340, H=200, N=100;
  const LINES = [
    { color:G,         speed:1.0, height:0.85 },
    { color:"#00bcd4", speed:0.7, height:0.55 },
    { color:"#9c27b0", speed:0.45, height:0.32 },
  ];
  const makePts = (maxH:number) => Array.from({length:N+1},(_,i)=>{
    const f=i/N, x=W*.04+f*W*.92, e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    return {x, y:H*.95-e*H*maxH};
  });
  const GOAL_Q: Record<string,string> = {
    es:"¿Cuál es su objetivo de práctica oral?",en:"What is your oral practice goal?",de:"Was ist dein Übungsziel?",
    fr:"Quel est ton objectif de pratique orale?",it:"Qual è il tuo obiettivo di pratica orale?",
    pt:"Qual é o teu objetivo de prática oral?",ru:"Какова твоя цель практики?",uk:"Яка твоя мета практики?",
    bg:"Каква е целта ти за практика?",zh:"你的口语练习目标是什么？",cs:"Jaký je tvůj cíl praxe?",
    fi:"Mikä on harjoitustavoitteesi?",el:"Ποιος είναι ο στόχος εξάσκησής σου;",id:"Apa tujuan latihan oralmu?",
    ja:"口頭練習の目標は何ですか？",ko:"구어 연습 목표는 무엇인가요?",pl:"Jaki jest twój cel ćwiczeń?",
    sv:"Vad är ditt övningsmål?",tr:"Sözlü pratik hedefiniz ne?",
  };
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px" }}>
      <h1 style={{ fontSize:20, fontWeight:800, textAlign:"center", margin:0, lineHeight:1.3 }}>{GOAL_Q[iso]??GOAL_Q.es}</h1>
      <div style={{ position:"relative", width:"100%", maxWidth:380 }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{ display:"block" }}>
          {[1,2,3].map(i=><line key={i} x1={W*.04} x2={W*.96} y1={H*i/4} y2={H*i/4} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>)}
          {LINES.map((line,li)=>{
            const allPts = makePts(line.height);
            const visible = allPts.slice(0, Math.floor(prog * line.speed * N) + 1);
            if(visible.length < 2) return null;
            const d = visible.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
            const last = visible[visible.length-1];
            return (
              <g key={li}>
                <path d={d} fill="none" stroke={line.color} strokeWidth={li===0?3:2} strokeLinecap="round" opacity={li===0?1:0.7}/>
                {prog>.3 && <circle cx={last.x} cy={last.y} r={5} fill={line.color} opacity={li===0?1:0.6}/>}
              </g>
            );
          })}
          <text x={W*.04} y={H+14} fill="#556677" fontSize={10}>Hoy</text>
          <text x={W*.96} y={H+14} fill="#556677" fontSize={10} textAnchor="end">1 mes</text>
        </svg>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── Ask test intro ─────────────────────────────────────────────────────────────
function SAskTest({ next, iso }: { next:()=>void; iso:string }) {
  const TITLE: Record<string,string> = {
    es:"¿Listo para una prueba de 2 minutos?",en:"Ready for a 2-minute test?",de:"Bereit für einen 2-Minuten-Test?",
    fr:"Prêt pour un test de 2 minutes?",it:"Pronto per un test di 2 minuti?",pt:"Pronto para um teste de 2 minutos?",
    ru:"Готов к 2-минутному тесту?",uk:"Готовий до 2-хвилинного тесту?",bg:"Готов за 2-минутен тест?",
    zh:"准备好接受2分钟测试了吗？",cs:"Připraven na 2minutový test?",fi:"Valmis 2 minuutin testiin?",
    el:"Έτοιμος για δοκιμασία 2 λεπτών;",id:"Siap untuk tes 2 menit?",ja:"2分間のテストの準備はできていますか？",
    ko:"2분 테스트 준비됐나요?",pl:"Gotowy na 2-minutowy test?",sv:"Redo för ett 2-minuters test?",tr:"2 dakikalık teste hazır mısın?",
  };
  const SUB: Record<string,string> = {
    es:"Obtenga una estimación de su nivel de vocabulario y gramática",en:"Get an estimate of your vocabulary and grammar level",
    de:"Schätz dein Vokabular- und Grammatiklevel ein",fr:"Obtenez une estimation de votre niveau de vocabulaire et de grammaire",
    it:"Ottieni una stima del tuo livello di vocabolario e grammatica",pt:"Obtenha uma estimativa do teu nível de vocabulário e gramática",
    ru:"Оцени уровень своего словарного запаса и грамматики",uk:"Оціни свій рівень словникового запасу та граматики",
    bg:"Получи оценка на нивото на речника и граматиката си",zh:"获取您的词汇和语法水平估计",
    cs:"Získejte odhad svého slovního a gramatického úrovně",fi:"Arvioi sanasto- ja kieliopitasosi",
    el:"Αποκτήστε μια εκτίμηση του επιπέδου λεξιλογίου και γραμματικής σας",id:"Dapatkan perkiraan tingkat kosakata dan tata bahasa Anda",
    ja:"語彙と文法レベルの推定を取得する",ko:"어휘와 문법 수준 추정값 얻기",pl:"Uzyskaj szacunkowy poziom słownictwa i gramatyki",
    sv:"Få en uppskattning av din vokabulär och grammatiknivå",tr:"Kelime ve dilbilgisi seviyenizin tahminini alın",
  };
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"32px 24px 100px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:0, lineHeight:1.3 }}>{TITLE[iso]??TITLE.es}</h1>
      <img src="https://ai.lolaspeak.com/Images/Brains.webp" alt="" style={{ width:"70%", maxWidth:260, objectFit:"contain" }}/>
      <p style={{ color:"#8899aa", fontSize:15, lineHeight:1.6, margin:0, maxWidth:320 }}>{SUB[iso]??SUB.es}</p>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── Vocabulary test (3 levels) ─────────────────────────────────────────────────
const VOCAB_LEVELS = [
  {
    level:"A1-A2", label:"Nivel principiante",
    words:["because","booking","excellent","pay","strawberry","usual","wife","yesterday"],
  },
  {
    level:"B1-B2", label:"Nivel intermedio",
    words:["avoid","charisma","emphasize","excitement","impact","maintain","stunning","trustworthy"],
  },
  {
    level:"C1-C2", label:"Nivel avanzado",
    words:["ascertain","frolic","opaque","opulent","proprietary","scrutinize","tranquility","viability"],
  },
];

function SVocabTest({ next, iso }: { next:()=>void; iso:string }) {
  const [lvl, setLvl] = useState(0);
  const [sel, setSel] = useState<Record<number,string[]>>({0:[],1:[],2:[]});
  const TITLE: Record<string,string> = {
    es:"Seleccione todas las palabras que conozca",en:"Select all the words you know",
    de:"Wähle alle Wörter, die du kennst",fr:"Sélectionnez tous les mots que vous connaissez",
    it:"Seleziona tutte le parole che conosci",pt:"Selecione todas as palavras que conhece",
    ru:"Выберите все слова, которые знаете",uk:"Виберіть усі слова, які знаєте",
    bg:"Изберете всички думи, които познавате",zh:"选择您认识的所有单词",cs:"Vyberte všechna slova, která znáte",
    fi:"Valitse kaikki sanat, jotka tunnet",el:"Επιλέξτε όλες τις λέξεις που γνωρίζετε",
    id:"Pilih semua kata yang Anda ketahui",ja:"知っている単語をすべて選択してください",
    ko:"알고 있는 모든 단어를 선택하세요",pl:"Wybierz wszystkie słowa, które znasz",
    sv:"Välj alla ord du känner till",tr:"Bildiğiniz tüm kelimeleri seçin",
  };
  const LVL_LABEL: Record<string,string[]> = {
    es:["A1-A2 Nivel principiante","B1-B2 Nivel intermedio","C1-C2 Nivel avanzado"],
    en:["A1-A2 Beginner level","B1-B2 Intermediate level","C1-C2 Advanced level"],
    de:["A1-A2 Anfängerniveau","B1-B2 Mittelstufe","C1-C2 Fortgeschrittenes Niveau"],
    fr:["A1-A2 Niveau débutant","B1-B2 Niveau intermédiaire","C1-C2 Niveau avancé"],
  };
  const cur = VOCAB_LEVELS[lvl];
  const curSel = sel[lvl];
  const toggle = (w:string) => setSel(s=>({ ...s, [lvl]: curSel.includes(w) ? curSel.filter(x=>x!==w) : [...curSel,w] }));
  const advance = () => { if(lvl < VOCAB_LEVELS.length-1) setLvl(l=>l+1); else next(); };
  const lvlLabels = LVL_LABEL[iso] ?? LVL_LABEL.es;
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px" }}>
      <TestProgressBar current={lvl} total={VOCAB_LEVELS.length}/>
      <div style={{ width:"100%", maxWidth:480, flex:1, display:"flex", flexDirection:"column" }}>
        <h1 style={{ fontSize:20, fontWeight:800, textAlign:"center", margin:"12px 0 6px", lineHeight:1.3 }}>{TITLE[iso]??TITLE.es}</h1>
        <p style={{ color:"#8899aa", textAlign:"center", fontSize:13, margin:"0 0 16px" }}>{lvlLabels[lvl]}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 4px" }}>
          {cur.words.map(w=>{
            const on = curSel.includes(w);
            return (
              <div key={w} onClick={()=>toggle(w)} style={{
                padding:"14px 12px", borderRadius:30, cursor:"pointer",
                background: on ? "rgba(174,234,0,0.12)" : "rgba(255,255,255,0.06)",
                border: on ? `1.5px solid ${G}` : "1px solid rgba(255,255,255,0.1)",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                fontSize:15, fontWeight:500, transition:"all 0.15s",
              }}>
                <span>{w}</span>
                {on && <span style={{ color:G, fontSize:13, fontWeight:900 }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <NextBtn onClick={advance}>{tr(iso,"next")}</NextBtn>
      <button onClick={advance} style={{ background:"none", border:"none", color:"#556677", fontSize:14, cursor:"pointer", padding:"8px 0" }}>{tr(iso,"skip")}</button>
    </div>
  );
}

// ─── Vocabulary results ─────────────────────────────────────────────────────────
function SVocabResults({ next, iso }: { next:()=>void; iso:string }) {
  const TITLE: Record<string,string> = {
    es:"¡Selección de palabras completada!",en:"Word selection completed!",de:"Wortauswahl abgeschlossen!",
    fr:"Sélection de mots terminée!",it:"Selezione di parole completata!",pt:"Seleção de palavras concluída!",
    ru:"Выбор слов завершён!",uk:"Вибір слів завершено!",bg:"Изборът на думи е завършен!",
    zh:"词汇选择完成！",cs:"Výběr slov dokončen!",fi:"Sanojen valinta valmis!",
    el:"Ολοκληρώθηκε η επιλογή λέξεων!",id:"Pemilihan kata selesai!",ja:"単語選択が完了しました！",
    ko:"단어 선택이 완료되었습니다!",pl:"Wybór słów zakończony!",sv:"Ordval slutfört!",tr:"Kelime seçimi tamamlandı!",
  };
  const EST: Record<string,string> = { es:"Su vocabulario estimado",en:"Your estimated vocabulary",de:"Ihr geschätzter Wortschatz",fr:"Votre vocabulaire estimé",it:"Il tuo vocabolario stimato",pt:"O teu vocabulário estimado",ru:"Ваш примерный словарный запас",uk:"Ваш орієнтовний словниковий запас",bg:"Вашият приблизителен речник",zh:"您的估计词汇量",cs:"Váš odhadovaný slovník",fi:"Arvioitu sanastosi",el:"Εκτιμώμενο λεξιλόγιό σας",id:"Perkiraan kosakata Anda",ja:"推定語彙",ko:"추정 어휘",pl:"Szacowane słownictwo",sv:"Ditt uppskattade ordförråd",tr:"Tahmini kelime dağarcığınız" };
  const NEXT_HIT: Record<string,string> = { es:"Próximo hito",en:"Next milestone",de:"Nächster Meilenstein",fr:"Prochain jalon",it:"Prossimo traguardo",pt:"Próximo marco",ru:"Следующий рубеж",uk:"Наступний рубіж",bg:"Следваща цел",zh:"下一个里程碑",cs:"Další milník",fi:"Seuraava virstanpylväs",el:"Επόμενο ορόσημο",id:"Tonggak berikutnya",ja:"次のマイルストーン",ko:"다음 이정표",pl:"Kolejny kamień milowy",sv:"Nästa milstolpe",tr:"Sonraki dönüm noktası" };
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{TITLE[iso]??TITLE.es}</h1>
      <MiniCurve label1={EST[iso]??EST.es} val1="3500 palabras" label2={NEXT_HIT[iso]??NEXT_HIT.es} val2="3750 palabras" iso={iso}/>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── Grammar test ───────────────────────────────────────────────────────────────
type GrammarQ = { type:"text"; sentence:string; blank:string; options:string[]; answer:string } | { type:"image"; question:string; options:{emoji:string;word:string}[]; answer:string };

const GRAMMAR_QS: GrammarQ[] = [
  { type:"image", question:'¿Qué sustantivo suele llevar "an" (en lugar de "a")?', options:[{emoji:"🍎",word:"apple"},{emoji:"🐱",word:"cat"},{emoji:"🎩",word:"hat"},{emoji:"🚗",word:"car"}], answer:"apple" },
  { type:"text",  sentence:"My brother ___ eleven years old.", blank:"___", options:["are","is","be","am"], answer:"is" },
  { type:"text",  sentence:"We ___ to school every morning.", blank:"___", options:["go","goes","is going","gone"], answer:"go" },
  { type:"text",  sentence:"Look! The children ___ football in the yard.", blank:"___", options:["played","have played","play","are playing"], answer:"are playing" },
  { type:"image", question:"¿Qué sustantivo es siempre plural en inglés?", options:[{emoji:"✂️",word:"scissors"},{emoji:"🏠",word:"house"},{emoji:"📚",word:"books"},{emoji:"🔑",word:"key"}], answer:"scissors" },
  { type:"text",  sentence:"I can't talk now; I ___ dinner.", blank:"___", options:["cook","am cooking","cooked","have cooked"], answer:"am cooking" },
  { type:"text",  sentence:"It was the ___ movie I had ever seen.", blank:"___", options:["scary","scariest","more scary","most scary"], answer:"scariest" },
  { type:"text",  sentence:"The report ___ by Friday, so please hurry.", blank:"___", options:["must finish","must be finished","has finished","was finishing"], answer:"must be finished" },
  { type:"text",  sentence:"That's the author ___ book won the prize last year.", blank:"___", options:["who","whose","which","whom"], answer:"whose" },
  { type:"text",  sentence:"If I ___ you, I wouldn't ignore that email.", blank:"___", options:["am","were","had been","will be"], answer:"were" },
  { type:"image", question:'¿Qué sustantivo se usa con "much" en vez de "many"?', options:[{emoji:"💰",word:"money"},{emoji:"📚",word:"books"},{emoji:"🪑",word:"chair"},{emoji:"🍎",word:"apple"}], answer:"money" },
  { type:"text",  sentence:"Hardly ___ left the house when the storm broke.", blank:"___", options:["I had","had I","I have","have I"], answer:"had I" },
];

function SGrammarTest({ next, iso, setScore }: { next:()=>void; iso:string; setScore:(n:number)=>void }) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const q = GRAMMAR_QS[qi];
  const TITLE: Record<string,string> = {
    es:"Seleccione la opción correcta",en:"Choose the correct option",de:"Wähle die richtige Option",
    fr:"Choisissez la bonne option",it:"Scegli l'opzione corretta",pt:"Escolha a opção correta",
    ru:"Выберите правильный вариант",uk:"Виберіть правильний варіант",
  };

  const [correct, setCorrect] = useState(0);

  const choose = (opt:string) => {
    const hit = opt === q.answer ? 1 : 0;
    const newCorrect = correct + hit;
    setPicked(opt);
    setCorrect(newCorrect);
    setTimeout(()=>{
      if(qi < GRAMMAR_QS.length-1){ setQi(i=>i+1); setPicked(null); }
      else { setScore(newCorrect); next(); }
    }, 700);
  };

  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px" }}>
      <TestProgressBar current={qi} total={GRAMMAR_QS.length}/>
      <div style={{ width:"100%", maxWidth:480, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {q.type==="image" ? (
          <>
            <h2 style={{ fontSize:18, fontWeight:700, textAlign:"center", margin:"0 0 24px", lineHeight:1.4 }}>{q.question}</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, width:"100%" }}>
              {q.options.map(o=>{
                const isP = picked===o.word;
                return (
                  <div key={o.word} onClick={()=>!picked&&choose(o.word)} style={{
                    borderRadius:16, background: isP ? "rgba(174,234,0,0.15)" : "rgba(255,255,255,0.06)",
                    border: isP ? `2px solid ${G}` : "1px solid rgba(255,255,255,0.1)",
                    padding:"20px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                    cursor:"pointer", transition:"all 0.2s",
                  }}>
                    <span style={{ fontSize:44 }}>{o.emoji}</span>
                    <span style={{ fontSize:13, color:"#aaa" }}>{o.word}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize:18, fontWeight:500, textAlign:"center", lineHeight:1.8, margin:"0 0 24px", padding:"0 8px" }}>
              {q.sentence.split("___").map((part,i,arr)=>(
                <span key={i}>
                  {part}
                  {i<arr.length-1 && (
                    picked
                      ? <span style={{ display:"inline-block", padding:"2px 12px", background:"rgba(174,234,0,0.18)", border:`1.5px solid ${G}`, borderRadius:6, verticalAlign:"middle", margin:"0 4px", color:G, fontWeight:700, fontSize:17, transition:"all 0.2s" }}>{picked}</span>
                      : <span style={{ display:"inline-block", width:100, height:22, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:4, verticalAlign:"middle", margin:"0 4px" }}/>
                  )}
                </span>
              ))}
            </p>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
              {q.options.map(o=>{
                const isP = picked===o;
                return (
                  <div key={o} onClick={()=>!picked&&choose(o)} style={{
                    padding:"16px", borderRadius:14, textAlign:"center", fontSize:16, fontWeight:500,
                    background: isP ? "rgba(174,234,0,0.15)" : "rgba(255,255,255,0.06)",
                    border: isP ? `2px solid ${G}` : "1px solid rgba(255,255,255,0.1)",
                    cursor:"pointer", transition:"all 0.2s",
                  }}>{o}</div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <button onClick={next} style={{ background:"none", border:"none", color:"#556677", fontSize:14, cursor:"pointer" }}>Saltar</button>
    </div>
  );
}

// ─── Grammar results ────────────────────────────────────────────────────────────
function SGrammarResults({ next, iso, score }: { next:()=>void; iso:string; score:number }) {
  const curLevel = score >= 8 ? "B1" : score >= 5 ? "A2" : "A1";
  const TITLE: Record<string,string> = {
    es:"¡Prueba de gramática completada!",en:"Grammar test completed!",de:"Grammatiktest abgeschlossen!",
    fr:"Test de grammaire terminé!",it:"Test di grammatica completato!",pt:"Teste de gramática concluído!",
    ru:"Тест по грамматике завершён!",uk:"Тест з граматики завершено!",bg:"Граматическият тест е завършен!",
    zh:"语法测试完成！",cs:"Gramatický test dokončen!",fi:"Kieliopitesti valmis!",
    el:"Δοκιμή γραμματικής ολοκληρώθηκε!",id:"Tes tata bahasa selesai!",ja:"文法テストが完了しました！",
    ko:"문법 테스트가 완료되었습니다!",pl:"Test gramatyczny ukończony!",sv:"Grammatiktest slutfört!",tr:"Gramer testi tamamlandı!",
  };
  const LVL: Record<string,string> = { es:"Su nivel estimado",en:"Your estimated level",de:"Ihr geschätztes Niveau",fr:"Votre niveau estimé",it:"Il tuo livello stimato",pt:"O teu nível estimado",ru:"Ваш расчётный уровень",uk:"Ваш розрахунковий рівень",bg:"Вашето приблизително ниво",zh:"您的估计水平",cs:"Vaše odhadovaná úroveň",fi:"Arvioitu tasosi",el:"Εκτιμώμενο επίπεδό σας",id:"Tingkat perkiraan Anda",ja:"推定レベル",ko:"추정 수준",pl:"Twój szacunkowy poziom",sv:"Din uppskattade nivå",tr:"Tahmini seviyeniz" };
  const NEXT_HIT: Record<string,string> = { es:"Próximo hito",en:"Next milestone",de:"Nächster Meilenstein",fr:"Prochain jalon",it:"Prossimo traguardo",pt:"Próximo marco",ru:"Следующий рубеж",uk:"Наступний рубіж",bg:"Следваща цел",zh:"下一个里程碑",cs:"Další milník",fi:"Seuraava virstanpylväs",el:"Επόμενο ορόσημο",id:"Tonggak berikutnya",ja:"次のマイルストーン",ko:"다음 이정표",pl:"Kolejny kamień milowy",sv:"Nästa milstolpe",tr:"Sonraki dönüm noktası" };
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{TITLE[iso]??TITLE.es}</h1>
      <MiniCurve label1={LVL[iso]??LVL.es} val1={curLevel} label2={NEXT_HIT[iso]??NEXT_HIT.es} val2="B2" iso={iso}/>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── LexTest ───────────────────────────────────────────────────────────────────
// Images use large emoji in photo-card style to simulate real photos
// Real Lola lexTest question types (from data.json)
type LexQ =
  | { type:"word_by_image";     prompt:string; img:string; opts:{word:string;correct:boolean}[] }
  | { type:"combine_by_images"; prompt:string; imgs:string[]; word:string; opts:{word:string;correct:boolean}[] }
  | { type:"combine_by_word";   prompt:string; word:string; opts:{img:string;pos:number|null}[] }
  | { type:"synonym";           prompt:string; img:string; word:string; opts:{word:string;correct:boolean}[] }
  | { type:"pos_neg";           prompt:string; word:string; isPositive:boolean };

const LEXT = "https://cdn-eu.lolaenglish.com/lextTest%2F";
const LEX_QS: LexQ[] = [
  // 1 — word_by_image: image of meat → choose meat vs meet
  { type:"word_by_image", prompt:"Elija la opción correcta",
    img: LEXT+"Meat_.webp?alt=media&token=462e7a23-b7bc-4200-9c0a-a10d5409f437",
    opts:[{word:"meet",correct:false},{word:"meat",correct:true}] },

  // 2 — combine_by_images: images of key + board → choose compound word
  { type:"combine_by_images", prompt:"Elija las imágenes correctas", word:"keyboard",
    imgs:[
      LEXT+"Key.webp?alt=media&token=9acc1a68-66be-4e53-b5a0-86c5445e2de2",
      LEXT+"board.webp?alt=media&token=abb0698d-ec6d-43ed-84b5-31d6af3d9c61",
    ],
    opts:[{word:"keystone",correct:false},{word:"skateboard",correct:false},{word:"keyboard",correct:true},{word:"snowboard",correct:false}] },

  // 3 — word_by_image: image of record → choose stress: REcord vs reCORD
  { type:"word_by_image", prompt:"Elija la pronunciación correcta",
    img: LEXT+"Record.webp?alt=media&token=e825eaaf-4139-41a5-8c82-0f2189181898",
    opts:[{word:"REcord",correct:true},{word:"reCORD",correct:false}] },

  // 4 — combine_by_word: word "teacher" → pick Tea (pos=0) + Chair (pos=1) from 4 images
  { type:"combine_by_word", prompt:"Elija las imágenes correctas", word:"teacher",
    opts:[
      {img: LEXT+"Tea.webp?alt=media&token=fb50da19-2a15-4724-abfd-e8c400ac3e0d",    pos:0},
      {img: LEXT+"ball.webp?alt=media&token=c9eb6d37-8cf2-4b0b-be70-bbdb7e04088d",   pos:null},
      {img: LEXT+"Icecube.webp?alt=media&token=04fd06e9-db99-4dc3-8e7c-9ebdda996dd2",pos:null},
      {img: LEXT+"Chair.webp?alt=media&token=adfc4187-4d21-4b64-957e-ddbdeddec7d8",  pos:1},
    ] },

  // 5 — word_by_image: image of couple → makeup vs make up
  { type:"word_by_image", prompt:"Elija la opción correcta",
    img: LEXT+"Couple.webp?alt=media&token=c351eae6-fc76-42aa-a3a6-6731b97a576e",
    opts:[{word:"makeup",correct:false},{word:"make up",correct:true}] },

  // 6 — synonym: image of happy + word → choose joyful
  { type:"synonym", prompt:"Elija el sinónimo",
    img: LEXT+"happy.webp?alt=media&token=89c5be98-4c6c-4fd9-ae53-5dfc3e5ed6b9",
    word:"happy",
    opts:[{word:"sad",correct:false},{word:"curious",correct:false},{word:"angry",correct:false},{word:"joyful",correct:true}] },

  // 7 — pos_neg: lazy
  { type:"pos_neg", prompt:"¿El significado es positivo o negativo?", word:"lazy", isPositive:false },

  // 8 — combine_by_word: word "honeymoon" → pick Honey (pos=0) + Moon (pos=1)
  { type:"combine_by_word", prompt:"Elija las imágenes correctas", word:"honeymoon",
    opts:[
      {img: LEXT+"Moon.webp?alt=media&token=0bada52f-fd5c-4a03-967e-34da0702fa54",   pos:1},
      {img: LEXT+"apple.webp?alt=media&token=8d893dca-2f00-47f3-b1f8-93336f630e1f",  pos:null},
      {img: LEXT+"Chicken.webp?alt=media&token=275e78cb-9fe5-4b9f-9035-44665ce9ee0f",pos:null},
      {img: LEXT+"Honey.webp?alt=media&token=561eb75c-fc21-4aee-a293-0e55d10ed57b",  pos:0},
    ] },

  // 9 — word_by_image: produce → PROduce vs proDUCE
  { type:"word_by_image", prompt:"Elija la pronunciación correcta",
    img: LEXT+"produce.webp?alt=media&token=87314efb-964c-444b-9c3f-4e9956c2adb0",
    opts:[{word:"PROduce",correct:true},{word:"proDUCE",correct:false}] },

  // 10 — pos_neg: ambitious
  { type:"pos_neg", prompt:"¿El significado es positivo o negativo?", word:"ambitious", isPositive:true },
];

// ── Image card used by word_by_image / combine_by_word ───────────────────────
function ImgCard({ src, label, selected, correct, wrong, onClick }: {
  src?:string; label?:string; selected:boolean; correct?:boolean; wrong?:boolean; onClick:()=>void
}) {
  const bg  = wrong ? "rgba(239,68,68,0.18)" : selected||correct ? "rgba(174,234,0,0.18)" : "rgba(255,255,255,0.07)";
  const bdr = wrong ? "2px solid #ef4444"    : selected||correct ? `2px solid ${G}`       : "1.5px solid rgba(255,255,255,0.12)";
  return (
    <div onClick={onClick} style={{
      borderRadius:20, background:bg, border:bdr, cursor:"pointer",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:8, padding:"10px 8px", transition:"all 0.15s", overflow:"hidden",
    }}>
      {src && <img src={src} alt="" style={{ width:"100%", maxWidth:120, height:100, objectFit:"contain", borderRadius:12 }}/>}
      {label && <span style={{ fontSize:15, fontWeight:700, color:"#fff", textAlign:"center" }}
        dangerouslySetInnerHTML={{__html: label.replace(/([A-Z]{2,})/g, m=>`<span style="color:${G};font-size:18px;font-weight:900">${m}</span>`)}}/>}
    </div>
  );
}

function SLexTest({ next, iso }: { next:()=>void; iso:string }) {
  const [qi,       setQi]       = useState(0);
  const [picked,   setPicked]   = useState<string|null>(null);
  // combine_by_word: track which images selected (by index)
  const [selA,     setSelA]     = useState<number|null>(null);   // first picked img index
  const [selB,     setSelB]     = useState<number|null>(null);   // second picked img index
  const [feedback, setFeedback] = useState<"ok"|"err"|null>(null);
  const [secs,     setSecs]     = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const q     = LEX_QS[qi];
  const total = LEX_QS.length;
  const mm    = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss    = String(secs % 60).padStart(2, "0");

  function advance() {
    if (qi < total - 1) { setQi(i=>i+1); setPicked(null); setSelA(null); setSelB(null); setFeedback(null); }
    else next();
  }

  function choose(val: string, isCorrect: boolean) {
    if (picked !== null || feedback !== null) return;
    setPicked(val);
    setFeedback(isCorrect ? "ok" : "err");
    setTimeout(advance, 700);
  }

  // combine_by_word: tap image A, then image B
  function pickImg(idx: number) {
    if (feedback) return;
    const qc = q as Extract<LexQ,{type:"combine_by_word"}>;
    if (selA === null) { setSelA(idx); return; }
    if (selB !== null) return;
    setSelB(idx);
    // correct if both have pos values and picked in order (pos=0 first, pos=1 second)
    const a = qc.opts[selA], b = qc.opts[idx];
    const ok = a.pos === 0 && b.pos === 1;
    setFeedback(ok ? "ok" : "err");
    setTimeout(advance, 900);
  }

  const CARD: React.CSSProperties = {
    padding:"16px", borderRadius:14, fontSize:17, fontWeight:700,
    background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)",
    color:"#fff", cursor:"pointer", textAlign:"center", width:"100%",
  };
  const CARD_OK:  React.CSSProperties = { ...CARD, background:`rgba(174,234,0,0.18)`, border:`2px solid ${G}` };
  const CARD_ERR: React.CSSProperties = { ...CARD, background:"rgba(239,68,68,0.18)", border:"2px solid #ef4444" };

  return (
    <div style={{ ...BASE, justifyContent:"flex-start", paddingBottom:80 }}>

      <TestProgressBar current={qi} total={total}/>

      {/* Timer + prompt */}
      <div style={{ textAlign:"center", padding:"20px 20px 0" }}>
        <div style={{ fontSize:36, fontWeight:700, fontFamily:"monospace", letterSpacing:3 }}>{mm}:{ss}</div>
        <div style={{ fontSize:15, color:"#ccc", marginTop:8, lineHeight:1.4 }}>{q.prompt}</div>
      </div>

      {/* ─── Question body ─── */}
      <div style={{ width:"100%", maxWidth:480, padding:"20px 20px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>

        {/* WORD_BY_IMAGE — big image + 2 word buttons */}
        {q.type==="word_by_image" && (
          <>
            <img src={q.img} alt="" style={{ width:"100%", maxWidth:280, height:200, objectFit:"contain", borderRadius:20 }}/>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map(o => {
                const isP = picked===o.word;
                const ok  = feedback==="ok" && isP;
                const err = feedback==="err" && isP;
                return (
                  <div key={o.word} onClick={()=>!picked&&choose(o.word, o.correct)}
                    style={ok ? CARD_OK : err ? CARD_ERR : CARD}
                    dangerouslySetInnerHTML={{__html: o.word.replace(/([A-Z]{2,})/g, m=>`<span style="color:${G};font-size:22px;font-weight:900">${m}</span>`)}}/>
                );
              })}
            </div>
          </>
        )}

        {/* COMBINE_BY_IMAGES — show 2 images → pick compound word from 4 options */}
        {q.type==="combine_by_images" && (
          <>
            <div style={{ display:"flex", gap:12, marginBottom:4 }}>
              {q.imgs.map((src,i) => (
                <img key={i} src={src} alt="" style={{ width:130, height:110, objectFit:"contain", borderRadius:16, background:"rgba(255,255,255,0.06)" }}/>
              ))}
            </div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map(o => {
                const isP = picked===o.word;
                const ok  = feedback==="ok" && isP;
                const err = feedback==="err" && isP;
                return <div key={o.word} onClick={()=>!picked&&choose(o.word, o.correct)} style={ok?CARD_OK:err?CARD_ERR:CARD}>{o.word}</div>;
              })}
            </div>
          </>
        )}

        {/* COMBINE_BY_WORD — show word → tap image A then image B */}
        {q.type==="combine_by_word" && (() => {
          const qc = q as Extract<LexQ,{type:"combine_by_word"}>;
          const aImg = selA !== null ? qc.opts[selA].img : null;
          const bImg = selB !== null ? qc.opts[selB].img : null;
          return (
            <>
              <div style={{ fontSize:30, fontWeight:900, letterSpacing:1 }}>{qc.word}</div>
              {/* Slots */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
                <div style={{
                  width:90, height:80, borderRadius:16, overflow:"hidden",
                  background: aImg ? "rgba(174,234,0,0.12)" : "rgba(255,255,255,0.08)",
                  border: aImg ? `2px solid ${G}` : "1.5px dashed rgba(255,255,255,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {aImg && <img src={aImg} alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>}
                </div>
                <span style={{ fontSize:22, color:"#888" }}>+</span>
                <div style={{
                  width:90, height:80, borderRadius:16, overflow:"hidden",
                  background: bImg ? (feedback==="ok"?"rgba(174,234,0,0.12)":"rgba(239,68,68,0.12)") : "rgba(255,255,255,0.08)",
                  border: bImg ? (feedback==="ok"?`2px solid ${G}`:"2px solid #ef4444") : "1.5px dashed rgba(255,255,255,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {bImg && <img src={bImg} alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>}
                </div>
              </div>
              <div style={{ fontSize:12, color:"#666", marginBottom:4 }}>
                {selA === null ? "Toca la primera imagen:" : selB === null ? "Ahora la segunda:" : ""}
              </div>
              {/* 2×2 image grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, width:"100%" }}>
                {qc.opts.map((o,i) => {
                  const isA = selA === i, isB = selB === i;
                  const bgc = isA||isB ? "rgba(174,234,0,0.12)" : "rgba(255,255,255,0.07)";
                  const bdc = isA||isB ? `2px solid ${G}` : "1.5px solid rgba(255,255,255,0.12)";
                  return (
                    <div key={i} onClick={()=>pickImg(i)} style={{ borderRadius:16, background:bgc, border:bdc, cursor:"pointer", overflow:"hidden", padding:8 }}>
                      <img src={o.img} alt="" style={{ width:"100%", height:90, objectFit:"contain" }}/>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* SYNONYM — image + word + 4 text options */}
        {q.type==="synonym" && (
          <>
            <img src={q.img} alt="" style={{ width:160, height:140, objectFit:"contain", borderRadius:16 }}/>
            <div style={{ fontSize:28, fontWeight:900, letterSpacing:1 }}>{q.word}</div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map(o => {
                const isP = picked===o.word;
                const ok  = feedback==="ok" && isP;
                const err = feedback==="err" && isP;
                return <div key={o.word} onClick={()=>!picked&&choose(o.word, o.correct)} style={ok?CARD_OK:err?CARD_ERR:CARD}>{o.word}</div>;
              })}
            </div>
          </>
        )}

        {/* POS_NEG — word + thumbs up/down */}
        {q.type==="pos_neg" && (
          <>
            <div style={{ fontSize:44, fontWeight:900, letterSpacing:2, marginBottom:8 }}>{q.word}</div>
            <div style={{ width:"100%", display:"flex", gap:12 }}>
              {(["pos","neg"] as const).map(v => {
                const isP = picked===v;
                const ok  = feedback==="ok" && isP;
                const err = feedback==="err" && isP;
                const isPos = v==="pos";
                return (
                  <div key={v} onClick={()=>!picked&&choose(v, isPos===(q as Extract<LexQ,{type:"pos_neg"}>).isPositive)} style={{
                    flex:1, borderRadius:20, padding:"28px 12px",
                    background: (ok||err) ? (ok?"rgba(174,234,0,0.18)":"rgba(239,68,68,0.18)") : "rgba(255,255,255,0.07)",
                    border: (ok||err) ? `2px solid ${ok?G:"#ef4444"}` : "1.5px solid rgba(255,255,255,0.12)",
                    cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:52 }}>{isPos?"👍":"👎"}</span>
                    <span style={{ fontSize:16, fontWeight:700, color:isPos?G:"#ef4444" }}>{isPos?"Positivo":"Negativo"}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      <button onClick={advance} style={{ background:"none", border:"none", color:"#556677", fontSize:14, cursor:"pointer", padding:"12px 0" }}>
        {tr(iso,"skip")}
      </button>
    </div>
  );
}

// ─── LexTest Results ───────────────────────────────────────────────────────────
function CircleGauge({ pct, label, sub, color=G }: { pct:number; label:string; sub:string; color?:string }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setAnim(p * pct);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [pct]);
  const r = 80, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  return (
    <div style={{ position:"relative", width:200, height:200 }}>
      <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%", transform:"rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={18}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray={`${(anim/100)*circ} ${circ}`}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:34, fontWeight:800 }}>{label}</div>
        <div style={{ fontSize:13, color:"#aaa" }}>{sub}</div>
      </div>
    </div>
  );
}

function SLexTestResults({ next, iso }: { next:()=>void; iso:string }) {
  const [timeSecs] = useState(206);
  const mm = String(Math.floor(timeSecs/60)).padStart(2,"0");
  const ss2 = String(timeSecs%60).padStart(2,"0");
  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"28px 20px 100px", textAlign:"center" }}>
      <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Puntuación de acceso léxico</h1>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
        <CircleGauge pct={30} label="30%" sub="correcto"/>
        <div style={{ width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:28, fontWeight:800 }}>{mm}:{ss2}</div>
          <div style={{ fontSize:13, color:"#aaa" }}>segundos</div>
        </div>
      </div>
      <NextBtn onClick={next}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── CreatProgram ──────────────────────────────────────────────────────────────
type CpStep = {
  headerImg: string;
  pct: number;
  questionImg?: string;
  question?: string;
};

const CP_STEPS: CpStep[] = [
  { headerImg: CDN+"prog_step_1.webp", pct:16 },
  { headerImg: CDN+"prog_step_2.webp", pct:32,  questionImg: CDN+"prog_step_2_q.webp", question:"Puedo leer y escribir mejor de lo que hablo" },
  { headerImg: CDN+"prog_step_3.webp", pct:48,  questionImg: CDN+"prog_step_3_q.webp", question:"Entiendo a los demás, pero me quedo en blanco cuando hablo" },
  { headerImg: CDN+"prog_step_4.webp", pct:64,  questionImg: CDN+"prog_step_4_q.webp", question:"A veces no recuerdo palabras que ya había aprendido" },
  { headerImg: CDN+"prog_step_5.webp", pct:80,  questionImg: CDN+"prog_step_5_q.webp", question:"Quiero sonar más natural cuando hablo" },
  { headerImg: CDN+"prog_step_6.webp", pct:100, questionImg: CDN+"prog_step_6_q.webp", question:"A veces siento que no avanzo, aunque lo intento" },
];

// Each step has an info phase (header image) then optional yesno phase (question image)
// Internal slide: { stepIdx, phase: "info"|"yesno" }
type CpPhase = { stepIdx:number; phase:"info"|"yesno" };

function buildCpSlides(): CpPhase[] {
  const slides: CpPhase[] = [];
  CP_STEPS.forEach((s, i) => {
    slides.push({ stepIdx:i, phase:"info" });
    if (s.questionImg) slides.push({ stepIdx:i, phase:"yesno" });
  });
  return slides;
}
const CP_SLIDES_V2 = buildCpSlides();

function SCreatProgram({ next, iso }: { next:()=>void; iso:string }) {
  const [si,      setSi]      = useState(0);
  const [dispPct, setDispPct] = useState(0);
  const [btnOk,   setBtnOk]   = useState(false);

  const { stepIdx, phase } = CP_SLIDES_V2[si];
  const step    = CP_STEPS[stepIdx];
  const isLast  = si === CP_SLIDES_V2.length - 1;
  const imgSrc  = phase === "yesno" ? step.questionImg! : step.headerImg;
  const targetPct = step.pct;

  // Animate percentage toward target
  useEffect(() => {
    let frame: number;
    function tick() {
      setDispPct(p => {
        if (Math.abs(p - targetPct) < 0.5) return targetPct;
        return p + (targetPct - p) * 0.06;
      });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [si]);

  // Info slides: auto-enable Siguiente after 2.8s
  useEffect(() => {
    setBtnOk(false);
    if (phase !== "info") return;
    const id = setTimeout(() => setBtnOk(true), 2800);
    return () => clearTimeout(id);
  }, [si]);

  function advance() {
    if (isLast) next();
    else setSi(i => i + 1);
  }

  // Titles for each step
  const INFO_TITLES: Record<number,string> = {
    0:"Analizando su nivel",
    1:"Creando diálogos de la vida real",
    2:"Añadiendo práctica de conversación con IA",
    3:"Seleccionando vocabulario para su nivel",
    4:"Configurando entrenamiento de pronunciación",
    5:"Trazando su ruta de aprendizaje",
  };
  const title = phase==="info" ? INFO_TITLES[stepIdx] : (step.question ?? "");

  return (
    <div style={{ ...BASE, justifyContent:"space-between", padding:"0 20px 24px", background:"#010101" }}>

      {/* Title — always at top, bold, white */}
      <h2 style={{ fontSize:22, fontWeight:800, textAlign:"center", lineHeight:1.35, margin:"28px 0 0", color:"#fff", width:"100%" }}>
        {title}
      </h2>

      {/* Image with animated bars (step 0) or shimmer border (other steps) */}
      <style>{`
        @keyframes bar{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
      `}</style>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", padding:"16px 0", gap:12 }}>
        {/* Audio bars (only step 0 — "Analizando") */}
        {stepIdx === 0 && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:36, marginBottom:4 }}>
            {[0.4,0.7,1,0.6,0.9,0.5,0.8,0.45,0.75,0.55,1,0.65].map((h,i)=>(
              <div key={i} style={{
                width:5, height:36, borderRadius:3,
                background:`linear-gradient(to top,#4C9FFF,#aef)`,
                transformOrigin:"bottom",
                animation:`bar ${0.5+i*0.07}s ease-in-out ${i*0.06}s infinite`,
              }}/>
            ))}
          </div>
        )}
        {/* Image with shimmer border */}
        <div style={{ position:"relative", borderRadius:20, overflow:"hidden",
          boxShadow: stepIdx===0 ? "none" : "0 0 0 2px rgba(180,200,255,0.25)",
          maxWidth: stepIdx===0 ? 200 : "85%",
        }}>
          <img key={imgSrc} src={imgSrc} alt="" style={{
            maxHeight:240, maxWidth:"100%", objectFit:"contain",
            borderRadius:16, display:"block",
          }}/>
          {/* Shimmer sweep on non-first steps */}
          {stepIdx !== 0 && (
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              background:"linear-gradient(105deg,transparent 40%,rgba(200,220,255,0.35) 50%,transparent 60%)",
              animation:"shimmer 2.2s linear infinite",
            }}/>
          )}
        </div>
        {/* Audio bars bottom (last step) */}
        {stepIdx === 5 && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:28 }}>
            {[0.6,1,0.5,0.8,0.4,0.9,0.55,0.75,0.65,1].map((h,i)=>(
              <div key={i} style={{
                width:5, height:28, borderRadius:3,
                background:"#4C9FFF", transformOrigin:"bottom",
                animation:`bar ${0.45+i*0.07}s ease-in-out ${i*0.08}s infinite`,
              }}/>
            ))}
          </div>
        )}
      </div>

      {/* Percentage */}
      <div style={{ textAlign:"center", fontSize:16, color:G, fontWeight:700, marginBottom:20 }}>
        {Math.round(dispPct)}%
      </div>

      {/* Buttons */}
      {phase === "info" ? (
        <button onClick={advance} disabled={!btnOk} style={{
          width:"100%", maxWidth:480, height:56, borderRadius:999, border:"none",
          background: btnOk ? G : "rgba(255,255,255,0.1)",
          color: btnOk ? "#000" : "#555", fontSize:17, fontWeight:700,
          cursor: btnOk ? "pointer" : "default", transition:"all 0.3s",
        }}>{tr(iso,"next")}</button>
      ) : (
        <div style={{ width:"100%", maxWidth:480, display:"flex", gap:12 }}>
          {["Sí","No"].map(v=>(
            <button key={v} onClick={advance} style={{
              flex:1, height:56, borderRadius:999,
              border:"1.5px solid rgba(255,255,255,0.18)",
              background:"rgba(255,255,255,0.06)", color:"#fff",
              fontSize:18, fontWeight:700, cursor:"pointer",
            }}>{v}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Summary (chat con Lola AI) ────────────────────────────────────────────────
const SUMMARY_MSGS = [
  { bold:"",                           text:"Según sus respuestas, tiene un nivel principiante de inglés." },
  { bold:"Vocabulario personalizado.",  text:" Aprende palabras clave para su nivel y mejore su fluidez." },
  { bold:"Práctica de pronunciación.", text:" Un análisis a nivel de sonido detecta fonemas difíciles, y videos breves entrenan su articulación y su oído. Tras cada sesión oirá cómo se acerca a un acento natural." },
  { bold:"Conversación con IA.",        text:" Practica diálogos reales con nuestra IA y gana confianza para hablar en cualquier situación." },
];

function TypingMsg({ bold, text }: { bold:string; text:string }) {
  const full = (bold ? bold + text : text);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= full.length) return;
    const id = setTimeout(() => setShown(s => s + 1), 18);
    return () => clearTimeout(id);
  }, [shown, full.length]);
  const rendered = full.slice(0, shown);
  const boldEnd = bold.length;
  return (
    <span>
      {bold && <span style={{ color:G, fontWeight:700 }}>{rendered.slice(0, Math.min(boldEnd, shown))}</span>}
      {shown > boldEnd && rendered.slice(boldEnd)}
    </span>
  );
}

function SSummary({ next, iso }: { next:()=>void; iso:string }) {
  const [visible, setVisible] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= SUMMARY_MSGS.length) return;
    const full = SUMMARY_MSGS[visible - 1].bold + SUMMARY_MSGS[visible - 1].text;
    const typingTime = full.length * 18 + 400;
    setLoading(true);
    const t1 = setTimeout(() => setLoading(false), typingTime + 800);
    const t2 = setTimeout(() => setVisible(v => v + 1), typingTime + 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visible, loading]);

  const done = visible >= SUMMARY_MSGS.length && !loading;

  return (
    <div style={{ ...BASE, justifyContent:"flex-start", paddingBottom:100 }}>
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
      {/* Progress dots */}
      <div style={{ width:"100%", maxWidth:480, padding:"16px 20px 0", display:"flex", gap:6, alignItems:"center" }}>
        {["language","level","how","summary"].map((s,i,arr) => (
          <div key={s} style={{ flex:1, height:4, borderRadius:999, position:"relative",
            background: i < arr.length-1 ? G : "rgba(255,255,255,0.12)" }}>
            {i < arr.length-1 && (
              <div style={{ position:"absolute", top:"50%", right:-6, transform:"translateY(-50%)", width:14, height:14, borderRadius:"50%", background:G, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#000", fontWeight:900 }}>✓</div>
            )}
            {i === arr.length-1 && (
              <div style={{ position:"absolute", top:"50%", right:-6, transform:"translateY(-50%)", width:14, height:14, borderRadius:"50%", border:`2px solid ${G}`, background:"transparent" }}/>
            )}
          </div>
        ))}
      </div>

      <h1 style={{ fontSize:24, fontWeight:800, margin:"24px 20px 16px", width:"100%", maxWidth:480 }}>Toques finales</h1>

      {/* Chat messages */}
      <div ref={scrollRef} style={{ width:"100%", maxWidth:480, padding:"0 20px", display:"flex", flexDirection:"column", gap:16, overflowY:"auto", flex:1 }}>
        {SUMMARY_MSGS.slice(0, visible).map((msg, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <img src={CDN+"lola.png"} alt="" style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", border:`1.5px solid ${G}` }}/>
              <span style={{ fontSize:13, fontWeight:600, color:"#aaa" }}>Lola AI</span>
            </div>
            <div style={{
              background:"linear-gradient(135deg,#0d2d2a 0%,#0a1f2e 100%)",
              border:"1px solid rgba(174,234,0,0.12)", borderRadius:"4px 16px 16px 16px",
              padding:"12px 14px", fontSize:15, lineHeight:1.55, color:"#e8f0e8",
              marginLeft:40,
            }}>
              {i === visible - 1
                ? <TypingMsg bold={msg.bold} text={msg.text}/>
                : <><span style={{ color:G, fontWeight:700 }}>{msg.bold}</span>{msg.text}</>
              }
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <img src={CDN+"lola.png"} alt="" style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", border:`1.5px solid ${G}` }}/>
              <span style={{ fontSize:13, fontWeight:600, color:"#aaa" }}>Lola AI</span>
            </div>
            <div style={{
              background:"linear-gradient(135deg,#0d2d2a 0%,#0a1f2e 100%)",
              border:"1px solid rgba(174,234,0,0.12)", borderRadius:"4px 16px 16px 16px",
              padding:"14px 20px", marginLeft:40, display:"flex", gap:5, alignItems:"center",
            }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#aaa", animation:`dotBounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      <NextBtn onClick={next} disabled={!done}>{tr(iso,"next")}</NextBtn>
    </div>
  );
}

// ─── Route + Main ──────────────────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Test de Nivel de Idiomas — Lola Speak" },
      { name: "description", content: "Descubre tu nivel real y recibe un plan personalizado para hablar con fluidez en pocas semanas." },
      { property: "og:title", content: "Test de Nivel de Idiomas — Lola Speak" },
      { property: "og:description", content: "Haz el test y recibe tu plan de aprendizaje personalizado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IolaQuiz,
});

type Screen = "start"|"gender"|"ageRange"|"language"|"video"|"name"|"personalPlan"|"level"|"how"|"brainFocus"|"why"|"goodHands1"|"struggles"|"brainStudy"|"topics"|"appBenefits"|"program"|"goodHands2"|"goalChart"|"goal"|"askTest"|"vocabTest"|"vocabResults"|"grammarTest"|"grammarResults"|"lexTest"|"lexTestResults"|"creatProgram"|"email"|"summary"|"building"|"expect1"|"expect4"|"expect12"|"expect12m"|"levelUp"|"choosePlan";

const FLOW: Screen[] = ["start","gender","ageRange","language","name","personalPlan","level","how","brainFocus","why","goodHands1","struggles","brainStudy","topics","appBenefits","program","goodHands2","goalChart","goal","askTest","vocabTest","vocabResults","grammarTest","grammarResults","lexTest","lexTestResults","creatProgram","email","summary","building","expect1","expect4","expect12","expect12m","levelUp","video","choosePlan"];

function SAccess() {
  return (
    <div style={{ ...BASE, justifyContent:"center", alignItems:"center", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:24 }}>🎉</div>
      <h1 style={{ fontSize:26, fontWeight:900, marginBottom:12 }}>¡Acceso activado!</h1>
      <p style={{ color:"#8899aa", fontSize:16, marginBottom:32 }}>Tu suscripción está activa. El acceso completo a la app está disponible.</p>
      <div style={{ width:"100%", maxWidth:360, background:"rgba(174,234,0,0.08)", border:`1.5px solid ${G}`, borderRadius:20, padding:24 }}>
        <p style={{ color:G, fontWeight:700, fontSize:15 }}>✓ Acceso completo activo</p>
        <p style={{ color:"#8899aa", fontSize:13, marginTop:8 }}>La app de práctica estará disponible en la próxima actualización.</p>
      </div>
    </div>
  );
}

function IolaQuiz() {
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
  const [grammarScore, setGrammarScore] = useState(0);
  const [hasAccess, setHasAccess] = useState<boolean|null>(null);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const subscription = data.user
          ? await getActiveSubscription(data.user.id)
          : null;
        if (active) setHasAccess(Boolean(subscription));
      } catch (error) {
        console.warn("No se pudo comprobar la suscripción; mostrando el quiz.", error);
        if (active) setHasAccess(false);
      }
    };

    void checkAccess();
    return () => {
      active = false;
    };
  }, []);

  if (hasAccess === null) {
    return <div style={{ ...BASE, justifyContent:"center", alignItems:"center" }}>
      <div style={{ width:40, height:40, borderRadius:"50%", border:`3px solid ${G}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>;
  }

  if (hasAccess) return <SAccess />;

  const next = () => setStep(s=>Math.min(s+1,FLOW.length-1));
  const iso  = LANGUAGES.find(l=>l.id===langId)?.iso ?? "es";
  const sc   = FLOW[step];

  return (
    <>
      {sc==="start"        && <SStart        next={next} iso={iso} />}
      {sc==="gender"       && <SGender      next={next} iso={iso} />}
      {sc==="ageRange"     && <SAgeRange    next={next} iso={iso} />}
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
      {sc==="topics"       && <STopics       next={next} sel={topics} setSel={setTopics} iso={iso} />}
      {sc==="appBenefits"  && <SAppBenefits next={next} iso={iso} />}
      {sc==="program"      && <SProgram     next={next} iso={iso} />}
      {sc==="goodHands2"   && <SGoodHands2    next={next} iso={iso} />}
      {sc==="goalChart"    && <SGoalChart    next={next} iso={iso} />}
      {sc==="goal"         && <SGoal         next={next} sel={goal} setSel={setGoal} iso={iso} />}
      {sc==="askTest"      && <SAskTest      next={next} iso={iso} />}
      {sc==="vocabTest"    && <SVocabTest    next={next} iso={iso} />}
      {sc==="vocabResults" && <SVocabResults next={next} iso={iso} />}
      {sc==="grammarTest"  && <SGrammarTest  next={next} iso={iso} setScore={setGrammarScore} />}
      {sc==="grammarResults" && <SGrammarResults next={next} iso={iso} score={grammarScore} />}
      {sc==="lexTest"       && <SLexTest       next={next} iso={iso} />}
      {sc==="lexTestResults"&& <SLexTestResults next={next} iso={iso} />}
      {sc==="creatProgram"  && <SCreatProgram  next={next} iso={iso} />}
      {sc==="email"        && <SEmail        next={next} email={email} setEmail={setEmail} iso={iso} />}
      {sc==="summary"       && <SSummary       next={next} iso={iso} />}
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
