import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';

const REGIONS = [
  {
    id: 1,
    name: 'الداخلة - وادي الذهب',
    tifinagh: 'ⴷⴷⴰⵅⵍⴰ - ⴰⵙⵉⴼ ⵏ ⵡⵓⵔⵖ',
    questions: [
      {
        q: 'ما اسم شبه الجزيرة التي تحتضن مدينة الداخلة وتشتهر برياضات الألواح الطائرة؟',
        options: ['شبه جزيرة وادي الذهب', 'شبه جزيرة طنجيس', 'رأس سبارطيل', 'رأس بوجدور'],
        answer: 0,
      },
      {
        q: 'في أي سنة استرجع المغرب إقليم وادي الذهب وبايعت قبائله الملك الحسن الثاني؟',
        options: ['1975', '1979', '1956', '1969'],
        answer: 1,
      },
      {
        q: 'ما الاسم التاريخي لخليج الداخلة عند البحارة الموريين والبرتغاليين؟',
        options: ['ريو دي أورو (وادي الذهب)', 'رأس غير', 'رأس نون', 'ساقية الحمراء'],
        answer: 0,
      },
    ],
  },
  {
    id: 2,
    name: 'العيون - الساقية الحمراء',
    tifinagh: 'ⵍⵄⵢⵓⵏ - ⵜⴰⵔⴳⴰ ⵜⴰⵣⴳⴳⵯⴰⵖⵜ',
    questions: [
      {
        q: 'ما هي المدينة الساحلية في هذه الجهة الملقبة بـ "منارة الصحراء" والتي شهدت معارك ضد الاستعمار؟',
        options: ['بوجدور', 'طرفاية', 'السمارة', 'العيون'],
        answer: 0,
      },
      {
        q: 'من هو الشيخ المجاهد الذي أسس مدينة السمارة وجعلها حاضرة علمية وجهادية؟',
        options: ['الشيخ ماء العينين', 'يوسف بن تاشفين', 'أحمد المنصور الذهبي', 'أبو بكر بن عمر'],
        answer: 0,
      },
      {
        q: 'ما اسم الملحمة السلمية التي حررت الساقية الحمراء سنة 1975؟',
        options: ['المسيرة الخضراء', 'ثورة الملك والشعب', 'معركة أنوال', 'معركة وادي المخازن'],
        answer: 0,
      },
    ],
  },
  {
    id: 3,
    name: 'كلميم - واد نون',
    tifinagh: 'ⴳⵓⵍⵎⵉⵎ - ⴰⵙⵉⴼ ⵏ ⵏⵓⵏ',
    questions: [
      {
        q: 'بماذا تلقب مدينة كلميم تاريخياً لكونها نقطة انطلاق القوافل التجارية نحو الصحراء؟',
        options: ['باب الصحراء', 'عروس الشمال', 'جوهرة الأطلس', 'العاصمة العلمية'],
        answer: 0,
      },
      {
        q: 'ما اسم الموسم التراثي العالمي الشهير المصنف ضمن تراث اليونسكو بهذه الجهة؟',
        options: ['موسم طانطان التراثي', 'موسم مولاي عبد الله', 'موسم حب الملوك', 'موسم الورود'],
        answer: 0,
      },
      {
        q: 'ما اسم الإقليم الجبلي بالجهة المعروف بنقوشه الصخرية المورية القديمة؟',
        options: ['آسا - الزاك', 'إفران', 'وزان', 'تاونات'],
        answer: 0,
      },
    ],
  },
  {
    id: 4,
    name: 'سوس - ماسة',
    tifinagh: 'ⵙⵓⵙ - ⵎⴰⵙⵙⵜ',
    questions: [
      {
        q: 'ما اسم المدينة العتيقة بالجهة المعروفة بأسوارها الطينية وصناعة الفضة؟',
        options: ['تيزنيت', 'أكادير', 'تارودانت', 'إنزكان'],
        answer: 0,
      },
      {
        q: 'أي مدينة سوسية تلقب بـ "مراكش الصغيرة" لأسوارها التاريخية العظيمة؟',
        options: ['تارودانت', 'طاطا', 'شتوكة', 'تافراوت'],
        answer: 0,
      },
      {
        q: 'في أي سنة ضرب الزلزال الشهير مدينة أكادير وأعيد بناؤها بالكامل؟',
        options: ['1960', '1956', '1975', '1980'],
        answer: 0,
      },
    ],
  },
  {
    id: 5,
    name: 'درعة - تافيلالت',
    tifinagh: 'ⴷⵔⵄⴰ - ⵜⴰⴼⵉⵍⴰⵍⵜ',
    questions: [
      {
        q: 'ما اسم المدينة التجارية المورية العظمى بتافيلالت التي كانت بوابة الذهب نحو السودان الغربي؟',
        options: ['سجلماسة', 'وليلي', 'ليكسوس', 'تامودا'],
        answer: 0,
      },
      {
        q: 'ما اسم القصر الطيني المصنف تراثاً عالمياً قرب ورزازات؟',
        options: ['قصر آيت بن حدو', 'قصر البديع', 'قصر الباهية', 'قصر المشور'],
        answer: 0,
      },
      {
        q: 'ما اسم الواحة الكبرى بالجهة التي تشتهر بإنتاج أجود أنواع التمور (المجهول)؟',
        options: ['واحة تافيلالت وزاكورة', 'واحة فكيك', 'واحة طاطا', 'واحة أقا'],
        answer: 0,
      },
    ],
  },
  {
    id: 6,
    name: 'مراكش - آسفي',
    tifinagh: 'ⵎⵕⵕⴰⴽⵛ - ⴰⵙⴼⵉ',
    questions: [
      {
        q: 'من هي السيدة الأمازيغية الحكيمة التي ساهمت في بناء عاصمة المرابطين مراكش؟',
        options: ['زينب النفزاوية', 'فاطمة الفهرية', 'السيدة الحرة', 'كنزة الأوربية'],
        answer: 0,
      },
      {
        q: 'ما اسم القصر الأسطوري الذي بناه السلطان أحمد المنصور الذهبي بمراكش؟',
        options: ['قصر البديع', 'قصر الحمراء', 'قصر الكتبية', 'قصر المنارة'],
        answer: 0,
      },
      {
        q: 'بأي صناعة تقليدية عالمية تشتهر مدينة آسفي المطلة على المحيط الأطلسي؟',
        options: ['الخزف والفخار', 'الزليج الفاسي', 'الجلد المراكشي', 'الزربية الرباطية'],
        answer: 0,
      },
    ],
  },
  {
    id: 7,
    name: 'بني ملال - خنيفرة',
    tifinagh: 'ⴰⵢⵜ ⵎⵍⵍⴰⵍ - ⵅⵏⵉⴼⵔⴰ',
    questions: [
      {
        q: 'من هو البطل الأمازيغي الأطلسي الذي قاد معركة الهري التاريخية ضد الاستعمار سنة 1914؟',
        options: ['موحا أوحمو الزياني', 'عبد الكريم الخطابي', 'عسو أوبسلام', 'أحمد الهيبة'],
        answer: 0,
      },
      {
        q: 'ما اسم العين المائية الشهيرة التي تتدفق من جبل تاصميت ببني ملال؟',
        options: ['عين أسردون', 'عين الفوارة', 'عين السبع', 'عين السلطان'],
        answer: 0,
      },
      {
        q: 'ما اسم الشلالات الأعلى في شمال إفريقيا الواقعة بإقليم أزيلال؟',
        options: ['شلالات أوزود', 'شلالات أقشور', 'شلالات إفران', 'شلالات ستي فاطمة'],
        answer: 0,
      },
    ],
  },
  {
    id: 8,
    name: 'الدار البيضاء - سطات',
    tifinagh: 'ⵜⴰⴷⴷⴰⵔⵜ ⵜⴰⵎⵍⵍⴰⵍⵜ - ⵙⵟⵟⴰⵜ',
    questions: [
      {
        q: 'ما هو الاسم الموري الأمازيغي القديم لمدينة الدار البيضاء قبل تسميتها الحالية؟',
        options: ['أنفا', 'شالة', 'تاموسيدا', 'بناصا'],
        answer: 0,
      },
      {
        q: 'ما اسم الإمارة المورية المستقلة التي حكمت سهل تامسنا والشاوية لقرون؟',
        options: ['إمارة بورغواطة', 'إمارة نكور', 'إمارة بني مدرار', 'إمارة سبتة'],
        answer: 0,
      },
      {
        q: 'ما اسم المدينة الساحلية بالجهة المعروفة بقلعتها البرتغالية "مازاغان"؟',
        options: ['الجديدة', 'المحمدية', 'أزمور', 'برشيد'],
        answer: 0,
      },
    ],
  },
  {
    id: 9,
    name: 'الرباط - سلا - القنيطرة',
    tifinagh: 'ⵕⵕⴱⴰⵟ - ⵙⵍⴰ - ⵍⵇⵏⵉⵟⵕⴰ',
    questions: [
      {
        q: 'ما اسم الموقع الأثري الموري العريق المطل على نهر أبي رقراق بالرباط؟',
        options: ['شالة', 'وليلي', 'ليكسوس', 'قصر الصغير'],
        answer: 0,
      },
      {
        q: 'من هو السلطان الموحدي الذي شيد صومعة حسان وأسوار الرباط؟',
        options: ['يعقوب المنصور الموحدي', 'عبد المؤمن بن علي', 'يوسف بن تاشفين', 'إدريس الأول'],
        answer: 0,
      },
      {
        q: 'بماذا اشتهر أسطول قراصنة أبي رقراق بسلا والرباط في القرن السابع عشر؟',
        options: ['حماية السواحل المغربية والسيادة البحرية', 'الصيد النهري فقط', 'نقل الحجاج براً', 'بناء القناطر'],
        answer: 0,
      },
    ],
  },
  {
    id: 10,
    name: 'فاس - مكناس',
    tifinagh: 'ⴼⴰⵙ - ⵎⴽⵏⴰⵙ',
    questions: [
      {
        q: 'من هي المؤسسة التاريخية لجامعة القرويين بفاس، أقدم جامعة في العالم؟',
        options: ['فاطمة الفهرية', 'زينب النفزاوية', 'السيدة الحرة', 'خناثة بنت بكار'],
        answer: 0,
      },
      {
        q: 'من هو السلطان العلوي العظيم الذي جعل مكناس عاصمة إمبراطوريته وشيد باب المنصور؟',
        options: ['المولى إسماعيل', 'المولى رشيد', 'سيدي محمد بن عبد الله', 'المولى سليمان'],
        answer: 0,
      },
      {
        q: 'ما اسم العاصمة الملكية المورية القديمة الواقعة قرب مولاي إدريس زرهون؟',
        options: ['وليلي (Volubilis)', 'ليكسوس', 'سبتة', 'تازة'],
        answer: 0,
      },
    ],
  },
  {
    id: 11,
    name: 'الجهة الشرقية',
    tifinagh: 'ⵜⴰⴳⵎⵓⴹⴰⵏⵜ',
    questions: [
      {
        q: 'ما اسم الكهف التاريخي قرب بركان الذي عُثر فيه على أقدم أثر للإنسان العاقل في العالم (300 ألف سنة في المغرب)؟',
        options: ['مغارة تافوغالت (الحمام)', 'مغارة هرقل', 'مغارة إفري ن عمار', 'كهف فريواطو'],
        answer: 0,
      },
      {
        q: 'بماذا تلقب مدينة وجدة التاريخية الواقعة على الحدود الشرقية للمملكة؟',
        options: ['مدينة الألفية', 'المدينة الحمراء', 'المدينة الزرقاء', 'عاصمة الفضة'],
        answer: 0,
      },
      {
        q: 'ما اسم الواحة الشرقية العريقة المعروفة بقصورها السبعة ونخيلها الباسق؟',
        options: ['واحة فكيك', 'واحة تافيلالت', 'واحة درعة', 'واحة طاطا'],
        answer: 0,
      },
    ],
  },
  {
    id: 12,
    name: 'طنجة - تطوان - الحسيمة',
    tifinagh: 'ⵟⴰⵏⵊⴰ - ⵜⵉⵟⵟⴰⵡⵉⵏ - ⵍⵃⵓⵙⵉⵎⴰ',
    questions: [
      {
        q: 'من هو الرحالة الطنجي المغربي الذي جاب العالم القديم ولقب بأمير الرحالة؟',
        options: ['ابن بطوطة', 'الإدريسي', 'ليون الإفريقي', 'ابن خلدون'],
        answer: 0,
      },
      {
        q: 'من هو القائد المغربي الريفي الذي حقق انتصار أنوال التاريخي سنة 1921؟',
        options: ['محمد بن عبد الكريم الخطابي', 'الشريف محمد أمزيان', 'أحمد الريسوني', 'موحا أوحمو'],
        answer: 0,
      },
      {
        q: 'من هي الحاكمة المغربية التي قادت الجهاد البحري وحكمت تطوان في القرن السادس عشر؟',
        options: ['السيدة الحرة', 'زينب النفزاوية', 'فاطمة الفهرية', 'تيهيا'],
        answer: 0,
      },
    ],
  },
];

// روابط صوتية هادئة ومؤثرات مدمجة
const SOUNDS = {
  bgm: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3', // موسيقى شرقية/أندلسية هادئة
  correct: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3', // رنين عملات ذهبية
  wrong: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // تنبيه خطأ
  victory: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3', // نغمة فتح الكنز
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [unlockedRegion, setUnlockedRegion] = useState(1);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hearts, setHearts] = useState(2);
  const [score, setScore] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [usedLifelines, setUsedLifelines] = useState({
    nafzaouia: false,
    tachfine: false,
    mansour: false,
  });

  const bgmRef = useRef(null);

  useEffect(() => {
    setupAudio();
    return () => {
      if (bgmRef.current) {
        bgmRef.current.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS.bgm },
        { isLooping: true, volume: 0.35 }
      );
      bgmRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      // في حالة عدم توفر اتصال إنترنت تستمر اللعبة بسلاسة دون توقف
    }
  };

  const toggleSound = async () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    try {
      if (bgmRef.current) {
        if (nextState) {
          await bgmRef.current.playAsync();
        } else {
          await bgmRef.current.pauseAsync();
        }
      }
    } catch (e) {}
  };

  const playSfx = async (type) => {
    if (!soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUNDS[type] },
        { shouldPlay: true, volume: 0.8 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {}
  };

  const startRegion = (region) => {
    if (region.id > unlockedRegion) {
      playSfx('wrong');
      Alert.alert('جهة مغلقة 🔒', 'أكمل الجهات الجنوبية أولاً لفتح هذا المسار!');
      return;
    }
    setCurrentRegion(region);
    setQuestionIndex(0);
    setHearts(2);
    setHiddenOptions([]);
    setScreen('quiz');
  };

  const handleAnswer = (selectedIndex) => {
    const currentQ = currentRegion.questions[questionIndex];
    if (selectedIndex === currentQ.answer) {
      playSfx('correct');
      setScore(score + 100);
      setHiddenOptions([]);
      if (questionIndex + 1 < currentRegion.questions.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        playSfx('victory');
        if (currentRegion.id === unlockedRegion && unlockedRegion < 12) {
          setUnlockedRegion(unlockedRegion + 1);
        }
        setScreen('victory');
      }
    } else {
      playSfx('wrong');
      Vibration.vibrate(200);
      const remaining = hearts - 1;
      setHearts(remaining);
      if (remaining <= 0) {
        setScreen('gameover');
      } else {
        Alert.alert('إجابة خاطئة! 💔', 'بقي لك قلب واحد، ركز جيداً يا بطل المغرب!');
      }
    }
  };

  const useNafzaouia = () => {
    if (usedLifelines.nafzaouia) return;
    playSfx('correct');
    const currentQ = currentRegion.questions[questionIndex];
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.answer);
    setHiddenOptions([wrongIndices[0], wrongIndices[1]]);
    setUsedLifelines({ ...usedLifelines, nafzaouia: true });
  };

  const useTachfine = () => {
    if (usedLifelines.tachfine) return;
    playSfx('correct');
    setUsedLifelines({ ...usedLifelines, tachfine: true });
    Alert.alert('🐎 مسار ابن تاشفين', 'تم تجاوز هذا السؤال بنجاح ومواصلة الزحف!');
    setHiddenOptions([]);
    if (questionIndex + 1 < currentRegion.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      playSfx('victory');
      if (currentRegion.id === unlockedRegion && unlockedRegion < 12) {
        setUnlockedRegion(unlockedRegion + 1);
      }
      setScreen('victory');
    }
  };

  const useMansour = () => {
    if (usedLifelines.mansour) return;
    playSfx('victory');
    setHearts(hearts + 1);
    setScore(score + 200);
    setUsedLifelines({ ...usedLifelines, mansour: true });
    Alert.alert('👑 سلطان الذهب أحمد المنصور', 'تم منحك قلباً إضافياً + 200 قطعة ذهبية!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      {screen === 'home' && (
        <View style={styles.centerBox}>
          <TouchableOpacity style={styles.floatingSoundBtn} onPress={toggleSound}>
            <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
          <Image source={require('./1794491844204.jpg')} style={styles.logo} />
          <Text style={styles.title}>الكنز الموري</Text>
          <Text style={styles.tifinaghTitle}>ⴰⴳⵍⴰ ⴰⵎⵓⵔⵉ</Text>
          <Text style={styles.subtitle}>
            رحلة سيادية عبر 33 قرناً من التاريخ والحضارة المغربية من الصحراء إلى البوغاز
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>ابدأ الرحلة • ⴱⴷⵓ</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === 'map' && (
        <View style={styles.fullBox}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSound} style={styles.soundBtnSmall}>
              <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>خريطة الجهات الـ 12</Text>
            <Text style={styles.goldBadge}>🪙 {score}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.mapList}>
            {REGIONS.map((region) => {
              const isUnlocked = region.id <= unlockedRegion;
              const isCompleted = region.id < unlockedRegion;
              return (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.regionCard,
                    !isUnlocked && styles.lockedCard,
                    isCompleted && styles.completedCard,
                  ]}
                  onPress={() => startRegion(region)}
                >
                  <View>
                    <Text style={styles.regionName}>
                      {region.id}. {region.name}
                    </Text>
                    <Text style={styles.regionTifinagh}>{region.tifinagh}</Text>
                  </View>
                  <Text style={styles.statusIcon}>
                    {isCompleted ? '👑' : isUnlocked ? '⚔️' : '🔒'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {screen === 'quiz' && currentRegion && (
        <View style={styles.fullBox}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('map')}>
              <Text style={styles.backText}>← الخريطة</Text>
            </TouchableOpacity>
            <Text style={styles.heartsText}>{'❤️'.repeat(hearts)}</Text>
            <TouchableOpacity onPress={toggleSound} style={styles.soundBtnSmall}>
              <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>
            <Text style={styles.goldBadge}>🪙 {score}</Text>
          </View>

          <View style={styles.quizBox}>
            <Text style={styles.regionBadge}>{currentRegion.name}</Text>
            <Text style={styles.progressText}>
              السؤال {questionIndex + 1} من {currentRegion.questions.length}
            </Text>

            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                {currentRegion.questions[questionIndex].q}
              </Text>
            </View>

            {currentRegion.questions[questionIndex].options.map((opt, idx) => {
              if (hiddenOptions.includes(idx)) return null;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(idx)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.lifelinesRow}>
              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.nafzaouia && styles.usedBtn]}
                onPress={useNafzaouia}
              >
                <Text style={styles.lifelineIcon}>🧕</Text>
                <Text style={styles.lifelineLabel}>النفزاوية</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.tachfine && styles.usedBtn]}
                onPress={useTachfine}
              >
                <Text style={styles.lifelineIcon}>🐎</Text>
                <Text style={styles.lifelineLabel}>ابن تاشفين</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.mansour && styles.usedBtn]}
                onPress={useMansour}
              >
                <Text style={styles.lifelineIcon}>👑</Text>
                <Text style={styles.lifelineLabel}>المنصور</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {screen === 'victory' && (
        <View style={styles.centerBox}>
          <Text style={styles.bigEmoji}>👑</Text>
          <Text style={styles.title}>تم فتح الكنز الجهوي!</Text>
          <Text style={styles.subtitle}>
            أحسنت يا حامي الذاكرة المورية! أتممت جهة {currentRegion?.name} بنجاح.
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>مواصلة المسار • ⵎⵓⵏ</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === 'gameover' && (
        <View style={styles.centerBox}>
          <Text style={styles.bigEmoji}>🛡️</Text>
          <Text style={styles.title}>استراحة محارب</Text>
          <Text style={styles.subtitle}>
            نفدت قلوبك في هذه الجولة، لكن العزيمة المغربية لا تنكسر. أعد المحاولة!
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>العودة للخريطة</Text>
          </TouchableOpacity>
        </View>
    f (currentRegion.id === unlockedRegion && unlockedRegion < 12) {
          setUnlockedRegion(unlockedRegion + 1);
        }
        setScreen('victory');
      }
    } else {
      Vibration.vibrate(200);
      const remaining = hearts - 1;
      setHearts(remaining);
      if (remaining <= 0) {
        setScreen('gameover');
      } else {
        Alert.alert('إجابة خاطئة! 💔', 'بقي لك قلب واحد، ركز جيداً يا بطل المغرب!');
      }
    }
  };

  const useNafzaouia = () => {
    if (usedLifelines.nafzaouia) return;
    const currentQ = currentRegion.questions[questionIndex];
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.answer);
    setHiddenOptions([wrongIndices[0], wrongIndices[1]]);
    setUsedLifelines({ ...usedLifelines, nafzaouia: true });
  };

  const useTachfine = () => {
    if (usedLifelines.tachfine) return;
    setUsedLifelines({ ...usedLifelines, tachfine: true });
    Alert.alert('🐎 مسار ابن تاشفين', 'تم تجاوز هذا السؤال بنجاح ومواصلة الزحف!');
    setHiddenOptions([]);
    if (questionIndex + 1 < currentRegion.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (currentRegion.id === unlockedRegion && unlockedRegion < 12) {
        setUnlockedRegion(unlockedRegion + 1);
      }
      setScreen('victory');
    }
  };

  const useMansour = () => {
    if (usedLifelines.mansour) return;
    setHearts(hearts + 1);
    setScore(score + 200);
    setUsedLifelines({ ...usedLifelines, mansour: true });
    Alert.alert('👑 سلطان الذهب أحمد المنصور', 'تم منحك قلباً إضافياً + 200 قطعة ذهبية!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      {screen === 'home' && (
        <View style={styles.centerBox}>
          <Image source={require('./1794491844204.jpg')} style={styles.logo} />
          <Text style={styles.title}>الكنز الموري</Text>
          <Text style={styles.tifinaghTitle}>ⴰⴳⵍⴰ ⴰⵎⵓⵔⵉ</Text>
          <Text style={styles.subtitle}>
            رحلة سيادية عبر 33 قرناً من التاريخ والحضارة المغربية من الصحراء إلى البوغاز
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>ابدأ الرحلة • ⴱⴷⵓ</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === 'map' && (
        <View style={styles.fullBox}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>خريطة الجهات الـ 12</Text>
            <Text style={styles.goldBadge}>🪙 {score}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.mapList}>
            {REGIONS.map((region) => {
              const isUnlocked = region.id <= unlockedRegion;
              const isCompleted = region.id < unlockedRegion;
              return (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.regionCard,
                    !isUnlocked && styles.lockedCard,
                    isCompleted && styles.completedCard,
                  ]}
                  onPress={() => startRegion(region)}
                >
                  <View>
                    <Text style={styles.regionName}>
                      {region.id}. {region.name}
                    </Text>
                    <Text style={styles.regionTifinagh}>{region.tifinagh}</Text>
                  </View>
                  <Text style={styles.statusIcon}>
                    {isCompleted ? '👑' : isUnlocked ? '⚔️' : '🔒'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {screen === 'quiz' && currentRegion && (
        <View style={styles.fullBox}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('map')}>
              <Text style={styles.backText}>← الخريطة</Text>
            </TouchableOpacity>
            <Text style={styles.heartsText}>{'❤️'.repeat(hearts)}</Text>
            <Text style={styles.goldBadge}>🪙 {score}</Text>
          </View>

          <View style={styles.quizBox}>
            <Text style={styles.regionBadge}>{currentRegion.name}</Text>
            <Text style={styles.progressText}>
              السؤال {questionIndex + 1} من {currentRegion.questions.length}
            </Text>

            <View style={styles.questionCard}>
              <Text style={styles.questionText}>
                {currentRegion.questions[questionIndex].q}
              </Text>
            </View>

            {currentRegion.questions[questionIndex].options.map((opt, idx) => {
              if (hiddenOptions.includes(idx)) return null;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(idx)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.lifelinesRow}>
              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.nafzaouia && styles.usedBtn]}
                onPress={useNafzaouia}
              >
                <Text style={styles.lifelineIcon}>🧕</Text>
                <Text style={styles.lifelineLabel}>النفزاوية</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.tachfine && styles.usedBtn]}
                onPress={useTachfine}
              >
                <Text style={styles.lifelineIcon}>🐎</Text>
                <Text style={styles.lifelineLabel}>ابن تاشفين</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.lifelineBtn, usedLifelines.mansour && styles.usedBtn]}
                onPress={useMansour}
              >
                <Text style={styles.lifelineIcon}>👑</Text>
                <Text style={styles.lifelineLabel}>المنصور</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {screen === 'victory' && (
        <View style={styles.centerBox}>
          <Text style={styles.bigEmoji}>👑</Text>
          <Text style={styles.title}>تم فتح الكنز الجهوي!</Text>
          <Text style={styles.subtitle}>
            أحسنت يا حامي الذاكرة المورية! أتممت جهة {currentRegion?.name} بنجاح.
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>مواصلة المسار • ⵎⵓⵏ</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === 'gameover' && (
        <View style={styles.centerBox}>
          <Text style={styles.bigEmoji}>🛡️</Text>
          <Text style={styles.title}>استراحة محارب</Text>
          <Text style={styles.subtitle}>
            نفدت قلوبك في هذه الجولة، لكن العزيمة المغربية لا تنكسر. أعد المحاولة!
          </Text>
          <TouchableOpacity style={styles.goldButton} onPress={() => setScreen('map')}>
            <Text style={styles.goldButtonText}>العودة للخريطة</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070b14' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fullBox: { flex: 1, padding: 16 },
  logo: { width: 160, height: 160, borderRadius: 32, marginBottom: 20, borderWidth: 2, borderColor: '#d4af37' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#d4af37', textAlign: 'center' },
  tifinaghTitle: { fontSize: 22, color: '#e5c158', marginTop: 4, marginBottom: 14 },
  subtitle: { fontSize: 15, color: '#cbd5e1', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  goldButton: { backgroundColor: '#8b1e24', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 14, borderWidth: 1.5, borderColor: '#d4af37' },
  goldButtonText: { color: '#fef08a', fontSize: 18, fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#d4af37' },
  goldBadge: { backgroundColor: '#1e293b', color: '#fde047', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: 'bold' },
  mapList: { paddingBottom: 30 },
  regionCard: { backgroundColor: '#111827', borderWidth: 1.5, borderColor: '#d4af37', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lockedCard: { borderColor: '#334155', opacity: 0.6 },
  completedCard: { backgroundColor: '#1f1216', borderColor: '#eab308' },
  regionName: { color: '#f8fafc', fontSize: 17, fontWeight: 'bold', textAlign: 'right' },
  regionTifinagh: { color: '#d4af37', fontSize: 13, marginTop: 4, textAlign: 'right' },
  statusIcon: { fontSize: 24 },
  backText: { color: '#d4af37', fontSize: 16, fontWeight: 'bold' },
  heartsText: { fontSize: 20 },
  quizBox: { flex: 1, justifyContent: 'center' },
  regionBadge: { color: '#fde047', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  progressText: { color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  questionCard: { backgroundColor: '#111827', padding: 20, borderRadius: 16, borderWidth: 1.5, borderColor: '#8b1e24', marginBottom: 20 },
  questionText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: 28 },
  optionButton: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#475569' },
  optionText: { color: '#f1f5f9', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  lifelinesRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
  lifelineBtn: { backgroun
