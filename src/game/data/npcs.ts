import { getLang } from '../i18n'
import type { PlayerState } from '../types'

export type AffinityStage = 0 | 1 | 2 | 3

export type NpcChoice = {
  en: string
  ko: string
  delta: number
}

export type NpcDialogue = {
  id: string
  minStage: AffinityStage
  npcEn: string
  npcKo: string
  choices: NpcChoice[]
  afterEn: string
  afterKo: string
  afterChoices: NpcChoice[]
}

export type NpcGift = { stage: 1 | 2 | 3; itemId: string; qty: number }

export type NpcDef = {
  id: string
  name: string
  titleEn: string
  titleKo: string
  aliases?: string[]
  dialogues: NpcDialogue[]
  gifts: NpcGift[]
}

export const AFFINITY_STAGE_AT = [15, 35, 60] as const
export const TOWN_PRESENT_MIN = 2
export const TOWN_PRESENT_MAX = 4

export const NPCS: Record<string, NpcDef> = {
  mira: {
    id: 'mira',
    name: 'mira',
    titleEn: 'innkeeper',
    titleKo: '여관 주인',
    aliases: ['미라', '여관'],
    gifts: [
      { stage: 1, itemId: 'hp_potion_m', qty: 2 },
      { stage: 2, itemId: 'mp_potion_m', qty: 1 },
      { stage: 3, itemId: 'amber_necklace', qty: 1 },
    ],
    dialogues: [
      {
        id: 'mira_1',
        minStage: 0,
        npcEn: 'Mira: A little guest cried at dinner — homesick. I sat with her until the hiccups stopped.',
        npcKo: '미라: 저녁에 어린 손님이 울었어요. 집이 그립다더라고요. 딸꾹질 멈출 때까지 옆에 앉아 줬죠.',
        choices: [
          { en: 'You gave her exactly what she needed.', ko: '그 아이에게 딱 필요한 걸 해 주셨네요.', delta: 8 },
          { en: 'Homesickness hits hardest at mealtime.', ko: '밥 먹을 때 집이 제일 그립죠.', delta: 3 },
          { en: 'Kids are brave for traveling at all.', ko: '어린아이가 여행하는 것만으로도 용감한 일이에요.', delta: 1 },
        ],
        afterEn: 'Mira: Her father thanked me with a clumsy bow. I packed them leftover bread for the road.',
        afterKo: '미라: 아버지가 어색하게 허리 숙여 고맙다고 했어요. 남은 빵을 싸서 길 떠나시라고 드렸죠.',
        afterChoices: [
          { en: 'Bread for the road is love in loaf form.', ko: '길에 빵 싸 주는 마음이 참 따뜻하네요.', delta: 7 },
          { en: 'They won\'t forget this inn.', ko: '이 여관을 오래오래 기억할 거예요.', delta: 3 },
          { en: 'I\'d cry less knowing you were nearby.', ko: '미라 씨가 옆에 있으면 덜 울겠어요.', delta: 1 },
        ],
      },
      {
        id: 'mira_2',
        minStage: 0,
        npcEn: 'Mira: I hung the laundry this morning. Sun-dried sheets smell like summer, even in autumn.',
        npcKo: '미라: 아침에 빨래를 널었어요. 가을인데도 햇볕에 말린 이불 냄새는 여름 같아요.',
        choices: [
          { en: 'Nothing beats sun-dried bedding.', ko: '햇볕에 말린 이불만 한 게 없죠.', delta: 7 },
          { en: 'I\'d love to sleep under those tonight.', ko: '오늘 밤엔 그 이불 덮고 자고 싶네요.', delta: 3 },
          { en: 'The line looks tidy from here.', ko: '빨래줄이 가지런해 보이네요.', delta: 1 },
        ],
        afterEn: 'Mira: Guests notice before they say it. Soft sleep is half of healing.',
        afterKo: '미라: 손님들은 말 안 해도 느껴요. 푹 자는 게 회복의 반이거든요.',
        afterChoices: [
          { en: 'You\'re right. Rest is its own medicine.', ko: '맞아요. 쉬는 것도 약이니까요.', delta: 7 },
          { en: 'I\'ll try to sleep properly tonight.', ko: '오늘 밤은 제대로 자 볼게요.', delta: 3 },
          { en: 'Your inn teaches that well.', ko: '미라 씨 여관이 그걸 잘 알려 주네요.', delta: 1 },
        ],
      },
      {
        id: 'mira_3',
        minStage: 0,
        npcEn: 'Mira: I lost the spare key this morning. Found it in the flour tin. Don\'t ask how.',
        npcKo: '미라: 아침에 여분 열쇠를 잃어버렸어요. 밀가루 통에서 찾았죠. 어떻게 들어갔는진 묻지 마세요.',
        choices: [
          { en: 'Flour tin\'s a creative hiding spot.', ko: '밀가루 통이라니, 숨기엔 제격이네요.', delta: 7 },
          { en: 'At least it turned up before night.', ko: '밤 되기 전에 찾아서 다행이에요.', delta: 3 },
          { en: 'I\'d never judge a busy innkeeper\'s system.', ko: '바쁜 여관 주인 사정은 안 따지겠어요.', delta: 1 },
        ],
        afterEn: 'Mira: I tied a ribbon on it so it can\'t hide again. Red — easy to spot in white flour.',
        afterKo: '미라: 다시 못 숨게 리본을 달았어요. 빨간색이라 흰 밀가루 속에선 잘 보여요.',
        afterChoices: [
          { en: 'Clever fix. Red against white always works.', ko: '똑똑하시네요. 흰 배경엔 빨강이 딱이죠.', delta: 7 },
          { en: 'Ribbon keys feel lucky somehow.', ko: '리본 달린 열쇠는 왠지 운이 좋을 것 같아요.', delta: 3 },
          { en: 'I\'ll keep an eye out if it wanders.', ko: '또 사라지면 제가 찾아볼게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_4',
        minStage: 0,
        npcEn: 'Mira: I snipped herbs from the garden — mint and chamomile for evening tea.',
        npcKo: '미라: 마당에서 잎을 잘랐어요. 저녁 차로 박하랑 캐모마일이요.',
        choices: [
          { en: 'Chamomile tea sounds perfect after traveling.', ko: '여행 끝에 캐모마일 차라니, 딱이네요.', delta: 7 },
          { en: 'Mint always wakes the room up nicely.', ko: '박하 향이면 방이 상쾌해지죠.', delta: 3 },
          { en: 'Your garden must be carefully kept.', ko: '정원을 참 정성껏 가꾸시나 봐요.', delta: 1 },
        ],
        afterEn: 'Mira: Sit a moment and I\'ll steep a cup. No rush — tea hates hurry.',
        afterKo: '미라: 잠깐 앉으세요. 우릴 내려 드릴게요. 차는 서두르면 맛이 없어요.',
        afterChoices: [
          { en: 'I\'ll wait patiently. Thank you.', ko: '차분히 기다릴게요. 감사해요.', delta: 7 },
          { en: 'That sounds lovely.', ko: '참 좋겠어요.', delta: 3 },
          { en: 'I\'ll enjoy the scent while it steeps.', ko: '우리는 동안 향기부터 맡을게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_5',
        minStage: 0,
        npcEn: 'Mira: I take the sunrise shift. Dough rises better when the world\'s still half-asleep.',
        npcKo: '미라: 해 뜰 때 일해요. 세상이 반쯤 잘 때 반죽이 더 잘 부풀거든요.',
        choices: [
          { en: 'Baking at dawn sounds sacred somehow.', ko: '새벽에 빵 굽는 일은 왠지 경건한 느낌이네요.', delta: 7 },
          { en: 'Does the smell wake the whole street?', ko: '그 냄새가 골목 전체를 깨우나요?', delta: 3 },
          { en: 'I\'d never manage that schedule. Respect.', ko: '저는 그 시간에 못 일어나요. 존경해요.', delta: 1 },
        ],
        afterEn: 'Mira: If you ever can\'t sleep, come down. Warm bread waits for restless hearts.',
        afterKo: '미라: 잠이 안 오면 내려오세요. 따뜻한 빵이 들뜬 마음을 기다려 주거든요.',
        afterChoices: [
          { en: 'I might take you up on that someday.', ko: '언젠가 부탁드릴지도 몰라요.', delta: 7 },
          { en: 'That\'s a gentle invitation. Thank you.', ko: '다정한 초대네요. 고마워요.', delta: 3 },
          { en: 'I\'ll remember where comfort lives.', ko: '여기가 위로 받는 곳이란 걸 기억할게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_6',
        minStage: 0,
        npcEn: 'Mira: It\'s a regular\'s birthday. I baked a small cake — no candles yet, in case you want to help light them.',
        npcKo: '미라: 단골 손님 생일이에요. 작은 케이크를 구웠어요. 초는 아직이에요. 같이 켜 주실래요?',
        choices: [
          { en: 'I\'d be honored to help light them.', ko: '초 켜는 걸 돕게 되어 영광이에요.', delta: 8 },
          { en: 'What a sweet surprise for them.', ko: '그분께 달콤한 선물이겠네요.', delta: 3 },
          { en: 'Birthdays at inns feel extra special.', ko: '여관에서 맞는 생일은 더 특별하죠.', delta: 1 },
        ],
        afterEn: 'Mira: Three candles — one for years, one for health, one for the road home.',
        afterKo: '미라: 초 세 개요. 나이, 건강, 그리고 집 가는 길.',
        afterChoices: [
          { en: 'That\'s a beautiful wish set.', ko: '소원이 참 예쁘게 나뉘었네요.', delta: 7 },
          { en: 'May all three stay lit in spirit.', ko: '세 가지 모두 오래 빛나길 바랄게요.', delta: 3 },
          { en: 'I\'ll clap quietly so we don\'t startle them.', ko: '놀라지 않게 조용히 박수칠게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_7',
        minStage: 0,
        npcEn: 'Mira: Morning\'s slow today. Just the kettle humming and me polishing cups.',
        npcKo: '미라: 오늘 아침은 한산해요. 주전자만 보글보글 끓고, 저는 잔을 닦고 있네요.',
        choices: [
          { en: 'That quiet suits an inn. Must feel peaceful.', ko: '여관엔 이런 고요함이 잘 어울리죠. 포근하겠어요.', delta: 7 },
          { en: 'Slow days can be nice after a rush.', ko: '바쁜 날 지나고 나면 한산한 것도 좋죠.', delta: 3 },
          { en: 'I might sit by the window a while.', ko: '창가에 잠깐 앉아 있어도 될까요.', delta: 1 },
        ],
        afterEn: 'Mira: If you stay, I\'ll pour you something warm. No charge for a quiet morning.',
        afterKo: '미라: 계시면 따뜻한 거 한 잔 따라 드릴게요. 이런 아침엔 공짜예요.',
        afterChoices: [
          { en: 'I\'d love that. Thank you, Mira.', ko: '그럼 감사히 받을게요, 미라 씨.', delta: 7 },
          { en: 'Just a little, then. You\'re kind.', ko: '조금만요. 참 다정하시네요.', delta: 3 },
          { en: 'Maybe later — but thank you for offering.', ko: '나중에요. 제안만으로도 고마워요.', delta: 1 },
        ],
      },
      {
        id: 'mira_8',
        minStage: 0,
        npcEn: 'Mira: New curtains today — soft blue. The old ones were tired of holding sunlight.',
        npcKo: '미라: 오늘 커튼을 갈았어요. 부드러운 파란색이요. 예전 건 햇빛을 붙잡느라 지쳤더라고요.',
        choices: [
          { en: 'Blue light makes a room feel calm.', ko: '파란빛이 방을 차분하게 해 주죠.', delta: 7 },
          { en: 'They look lovely from the street.', ko: '길에서도 예뻐 보여요.', delta: 3 },
          { en: 'Fresh curtains change the whole mood.', ko: '커튼만 바꿔도 분위기가 달라지죠.', delta: 1 },
        ],
        afterEn: 'Mira: Come stand by the window. See? Afternoon gold through blue cloth.',
        afterKo: '미라: 창가에 서 보세요. 보이죠? 파란 천으로 들어오는 오후 금빛.',
        afterChoices: [
          { en: 'It\'s beautiful. You have an artist\'s eye.', ko: '아름다워요. 보는 눈이 참 좋으세요.', delta: 8 },
          { en: 'I could nap right here.', ko: '여기서 바로 잠들 수 있겠어요.', delta: 3 },
          { en: 'You\'ve made the light feel welcome.', ko: '빛이 반가운 기분이네요.', delta: 1 },
        ],
      },
      {
        id: 'mira_9',
        minStage: 0,
        npcEn: 'Mira: Spilled soup on my apron — third time this week. The laundry basket sighs at me.',
        npcKo: '미라: 앞치마에 국을 쏟았어요. 이번 주만 세 번째. 빨래 바구니가 한숨 쉬는 소리 들려요.',
        choices: [
          { en: 'Busy kitchens wear their badges.', ko: '바쁜 부엌은 그렇게 훈장을 달죠.', delta: 7 },
          { en: 'Need a spare apron? I could fetch one.', ko: '여분 앞치마 가져다드릴까요?', delta: 3 },
          { en: 'Soup stains mean the food\'s loved.', ko: '국물 얼룩은 음식이 사랑받는다는 뜻이죠.', delta: 1 },
        ],
        afterEn: 'Mira: I\'ll change after I serve this round. Pride can wait; hot bowls can\'t.',
        afterKo: '미라: 이 판 나르고 갈아입을게요. 체면은 기다려도, 뜨거운 그릇은 못 기다려요.',
        afterChoices: [
          { en: 'Priorities of a true host.', ko: '진짜 주인의 우선순위네요.', delta: 7 },
          { en: 'I\'ll help carry if you want.', ko: '원하시면 나르는 거 도울게요.', delta: 3 },
          { en: 'Guests will understand a spotted apron.', ko: '얼룩 앞치마쯤은 손님도 이해해요.', delta: 1 },
        ],
      },
      {
        id: 'mira_10',
        minStage: 0,
        npcEn: 'Mira: The neighbor borrowed sugar again. I always keep an extra bag for her.',
        npcKo: '미라: 이웃이 또 설탕을 빌려 갔어요. 그분 몫으로 항상 여분을 남겨 두거든요.',
        choices: [
          { en: 'That\'s how a neighborhood stays close.', ko: '그래서 이웃이 친해지는 거죠.', delta: 7 },
          { en: 'She must appreciate you a lot.', ko: '그분이 미라 씨를 많이 의지하시겠어요.', delta: 3 },
          { en: 'Extra sugar is quiet kindness.', ko: '여분 설탕도 조용한 친절이죠.', delta: 1 },
        ],
        afterEn: 'Mira: She brings jam when she can. We keep each other going in small ways.',
        afterKo: '미라: 그분은 여유 될 때 잼을 가져오시곤 해요. 작은 걸로 서로 버티는 거예요.',
        afterChoices: [
          { en: 'Small trades of care beat big speeches.', ko: '큰말보다 작은 챙김이 더 오래가죠.', delta: 7 },
          { en: 'Jam for sugar — fair and sweet.', ko: '설탕에 잼이라, 달콤하고 공평하네요.', delta: 3 },
          { en: 'I\'d like neighbors like that.', ko: '저런 이웃이 있으면 좋겠어요.', delta: 1 },
        ],
      },
      {
        id: 'mira_11',
        minStage: 0,
        npcEn: 'Mira: The upstairs room at the end is empty again. Sheets are fresh if you need rest.',
        npcKo: '미라: 위층 맨 끝방이 또 비었어요. 이불은 새로 갈았으니, 쉬고 싶으면 말해 주세요.',
        choices: [
          { en: 'That\'s thoughtful of you. I might take you up on it.', ko: '배려 감사해요. 부탁드릴지도 몰라요.', delta: 7 },
          { en: 'Good to know there\'s a safe place here.', ko: '여기엔 안전한 자리가 있군요.', delta: 3 },
          { en: 'I\'ll remember that, thank you.', ko: '기억해 둘게요. 고마워요.', delta: 1 },
        ],
        afterEn: 'Mira: I leave a candle by the door for night arrivals. This town gets dark early.',
        afterKo: '미라: 밤에 오는 손님 위해 문 옆에 초를 켜 둬요. 이 마을은 일찍 어두워지거든요.',
        afterChoices: [
          { en: 'That small kindness keeps people safe.', ko: '그런 작은 친절이 사람을 지켜 주죠.', delta: 8 },
          { en: 'I\'ll knock softly if I come late.', ko: '늦게 오면 살살 문 두드릴게요.', delta: 3 },
          { en: 'Dark roads make inns feel precious.', ko: '어두운 길에선 여관이 더 소중해져요.', delta: 1 },
        ],
      },
      {
        id: 'mira_12',
        minStage: 0,
        npcEn: 'Mira: We were full last night — every bed taken. My feet still ache, but I\'m glad.',
        npcKo: '미라: 어젯밤 만실이었어요. 침대마다 손님이요. 발은 아직 아프지만, 기분은 좋아요.',
        choices: [
          { en: 'A full inn means people trusted you.', ko: '만실은 사람들이 미라 씨를 믿었다는 뜻이죠.', delta: 8 },
          { en: 'You must be exhausted. Sit a moment.', ko: '피곤하시겠어요. 잠깐 앉으세요.', delta: 3 },
          { en: 'Busy nights keep a place alive.', ko: '바쁜 밤이 여관을 살아 있게 하죠.', delta: 1 },
        ],
        afterEn: 'Mira: One traveler said the sheets smelled like his mother\'s house. I nearly cried into the stew.',
        afterKo: '미라: 어떤 여행자가 이불 냄새가 어머니 집 같다고 했어요. 찌개에 눈물 떨어뜨릴 뻔했죠.',
        afterChoices: [
          { en: 'That\'s the highest praise an inn can get.', ko: '여관이 들을 수 있는 최고의 칭찬이네요.', delta: 8 },
          { en: 'You gave him home for a night.', ko: '하룻밤이나마 집을 준 거네요.', delta: 3 },
          { en: 'No wonder you\'re tired — and proud.', ko: '피곤하신 이유, 자랑하셔도 될 일이에요.', delta: 1 },
        ],
      },
      {
        id: 'mira_13',
        minStage: 1,
        npcEn: 'Mira: Breakfast is ready — eggs, toast, and that jam you liked last visit.',
        npcKo: '미라: 아침 준비됐어요. 달걀, 구운 빵, 지난번에 좋아하시던 잼이요.',
        choices: [
          { en: 'You remembered the jam. Incredible.', ko: '잼까지 기억하시다니, 대단해요.', delta: 8 },
          { en: 'This is the best welcome I could ask for.', ko: '바랄 수 있는 최고의 환영이네요.', delta: 3 },
          { en: 'I\'ll eat slowly and appreciate it.', ko: '천천히 먹으며 음미할게요.', delta: 1 },
        ],
        afterEn: 'Mira: Eat before it cools. Conversation tastes better on a full stomach anyway.',
        afterKo: '미라: 식기 전에 드세요. 대화도 배부른 편이 맛이 좋거든요.',
        afterChoices: [
          { en: 'Wise as always. Digging in.', ko: '역시 맞는 말이에요. 먹을게요.', delta: 7 },
          { en: 'Then I\'ll talk between bites.', ko: '그럼 한입 사이에 이야기할게요.', delta: 3 },
          { en: 'Yes — warm food first.', ko: '네, 따뜻한 음식 먼저요.', delta: 1 },
        ],
      },
      {
        id: 'mira_14',
        minStage: 1,
        npcEn: 'Mira: Extra blanket on your bed tonight, {player}. The wind\'s got teeth this week.',
        npcKo: '미라: {player} 씨 침대에 담요 하나 더 올려 뒀어요. 이번 주 바람은 이빨이 있거든요.',
        choices: [
          { en: 'Thank you for protecting my sleep.', ko: '잠을 지켜 주셔서 고마워요.', delta: 7 },
          { en: 'Wind with teeth — vivid and true.', ko: '이빨 달린 바람이라니, 생생하고 맞네요.', delta: 3 },
          { en: 'I\'ll burrow in gratefully.', ko: '감사히 파고들게요.', delta: 1 },
        ],
        afterEn: 'Mira: If it\'s still cold, knock. I keep a hot stone wrap for stubborn drafts.',
        afterKo: '미라: 그래도 추우면 문 두드리세요. 고집 센 외풍용으로 돌찜질을 준비해 뒀어요.',
        afterChoices: [
          { en: 'I might take you up on the stone wrap.', ko: '돌찜질 부탁드릴지도 몰라요.', delta: 7 },
          { en: 'You\'re a walking remedy cabinet.', ko: '걸어 다니는 구급함 같으세요.', delta: 3 },
          { en: 'I\'ll knock softly if needed.', ko: '필요하면 살살 문 두드릴게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_15',
        minStage: 1,
        npcEn: 'Mira: I saved the window seat for you, {player}. Soft light, steady chair — your usual.',
        npcKo: '미라: {player} 씨, 창가 자리 남겨 뒀어요. 부드러운 빛, 흔들리지 않는 의자. 평소처럼요.',
        choices: [
          { en: 'You remembered. That means more than you know.', ko: '기억해 주셨네요. 생각보다 큰일이에요.', delta: 8 },
          { en: 'May I sit? I\'ve been looking forward to this.', ko: '앉아도 될까요? 사실 기대하고 왔어요.', delta: 3 },
          { en: 'You notice the small things. Thank you.', ko: '작은 것까지 챙기시네요. 고마워요.', delta: 1 },
        ],
        afterEn: 'Mira: I even warmed the cushion by the fire for a minute. Don\'t tell the other guests.',
        afterKo: '미라: 방석도 난로 옆에 잠깐 데워 뒀어요. 다른 손님한텐 비밀이에요.',
        afterChoices: [
          { en: 'My lips are sealed — and my seat is grateful.', ko: '입 다물게요. 제 자리는 감사하는 중이에요.', delta: 7 },
          { en: 'You\'re spoiling me rotten.', ko: '저를 너무 버릇없게 만드세요.', delta: 3 },
          { en: 'I\'ll enjoy it quietly.', ko: '조용히 즐길게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_16',
        minStage: 1,
        npcEn: 'Mira: Town gossip reached me, but I only share it with people I trust. Like you, {player}.',
        npcKo: '미라: 마을 소문이 들렸는데, 믿는 사람한테만 말해요. {player} 씨처럼요.',
        choices: [
          { en: 'I\'m honored you trust me with it.', ko: '믿어 주셔서 영광이에요.', delta: 8 },
          { en: 'I\'ll listen carefully and keep it quiet.', ko: '조심히 듣고 입 다물게요.', delta: 3 },
          { en: 'Trust like that is rare. Thank you.', ko: '그런 믿음은 드물죠. 고마워요.', delta: 1 },
        ],
        afterEn: 'Mira: They\'re saying the bridge needs repair before festival. Nothing cruel — just practical worry.',
        afterKo: '미라: 축제 전에 다리가 수리가 필요하대요. 험한 말은 아니고, 현실적인 걱정이에요.',
        afterChoices: [
          { en: 'I\'ll watch my step on that bridge.', ko: '그 다리선 발 조심할게요.', delta: 7 },
          { en: 'Maybe townsfolk can chip in labor.', ko: '마을 사람들이 손을 보탤 수도 있겠네요.', delta: 3 },
          { en: 'Practical gossip is the useful kind.', ko: '실질적인 소문이 쓸모 있는 소문이죠.', delta: 1 },
        ],
      },
      {
        id: 'mira_17',
        minStage: 2,
        npcEn: 'Mira: I almost closed this place once. Numbers looked grim, and my hands shook counting coins.',
        npcKo: '미라: 한 번 문을 닫을 뻔했어요. 장부가 암울했고, 동전 세는 손이 떨렸죠.',
        choices: [
          { en: 'I\'m glad you stayed. This town needs you.', ko: '남아 주셔서 다행이에요. 마을에 필요하세요.', delta: 8 },
          { en: 'Fear of closing must have been heavy.', ko: '문 닫을까 봐 겁이 많이 나셨겠어요.', delta: 3 },
          { en: 'What kept you going?', ko: '무엇이 버티게 해 줬나요?', delta: 1 },
        ],
        afterEn: 'Mira: A regular left wildflowers and a note: \'Open tomorrow.\' So I did.',
        afterKo: '미라: 단골이 들꽃과 쪽지를 남겼어요. \'내일도 열어 주세요.\' 그래서 열었죠.',
        afterChoices: [
          { en: 'Wildflowers can save a business.', ko: '들꽃이 가게를 구하기도 하죠.', delta: 7 },
          { en: 'That regular understood community.', ko: '그 단골은 이웃을 알았네요.', delta: 3 },
          { en: 'I\'ll bring flowers someday too.', ko: '언젠가 저도 꽃을 가져올게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_18',
        minStage: 2,
        npcEn: 'Mira: I promised myself I\'d never turn away a traveler with empty pockets — only empty manners.',
        npcKo: '미라: 빈 주머니 여행자는 안 거른다고 스스로 약속했어요. 빈 예절만 거르죠.',
        choices: [
          { en: 'That\'s a principled kind of generosity.', ko: '원칙 있는 너그러움이네요.', delta: 8 },
          { en: 'Manners feed an inn as much as coin.', ko: '예절도 동전만큼 여관을 먹여 살리죠.', delta: 3 },
          { en: 'I\'ll keep my manners full, then.', ko: '그럼 예절은 가득 채울게요.', delta: 1 },
        ],
        afterEn: 'Mira: Once I fed a mute boy for a week. He washed cups with such care I cried into the rinse water.',
        afterKo: '미라: 말 없는 아이를 일주일 먹인 적 있어요. 잔을 너무 조심히 닦아서, 헹구는 물에 울었죠.',
        afterChoices: [
          { en: 'Care like that is its own thank-you.', ko: '그런 조심스러움이 곧 감사죠.', delta: 8 },
          { en: 'You gave him dignity with the meals.', ko: '식사와 함께 존엄도 주셨네요.', delta: 3 },
          { en: 'I\'d wash cups that carefully too.', ko: '저도 그렇게 조심히 닦을 거예요.', delta: 1 },
        ],
      },
      {
        id: 'mira_19',
        minStage: 2,
        npcEn: 'Mira: My late husband built this inn with his own hands. Sometimes I still hear his hammer in the walls.',
        npcKo: '미라: 돌아가신 남편이 이 여관을 손수 지었어요. 가끔 벽에서 그분 망치 소리가 들리는 것 같아요.',
        choices: [
          { en: 'That must be both comforting and heavy.', ko: '위로가 되면서도 무겁겠어요.', delta: 8 },
          { en: 'He left you something living to care for.', ko: '돌볼 수 있는 살아 있는 걸 남기셨네요.', delta: 3 },
          { en: 'Thank you for trusting me with that.', ko: '그런 이야기를 맡겨 주셔서 고마워요.', delta: 1 },
        ],
        afterEn: 'Mira: When the roof leaked the first winter alone, I fixed it myself. He\'d have laughed, then helped.',
        afterKo: '미라: 혼자 맞은 첫 겨울에 지붕이 샜을 때, 제가 고쳤어요. 그분이면 웃고 나서 도와줬겠죠.',
        afterChoices: [
          { en: 'You became the builder he believed in.', ko: '그분이 믿던 손이 되신 거네요.', delta: 8 },
          { en: 'Laughter and help — a good marriage echo.', ko: '웃음과 도움, 좋은 부부의 메아리네요.', delta: 3 },
          { en: 'The roof holds because you do.', ko: '지붕이 버티는 건 미라 씨가 버티기 때문이죠.', delta: 1 },
        ],
      },
      {
        id: 'mira_20',
        minStage: 2,
        npcEn: 'Mira: My sister left town years ago chasing city lights. We write, but the paper always smells like distance.',
        npcKo: '미라: 언니가 몇 년 전 도시 불빛을 쫓아 떠났어요. 편지는 하지만, 종이에서 늘 거리가 나요.',
        choices: [
          { en: 'Distance on paper still beats silence.', ko: '종이 위 거리라도 침묵보단 낫죠.', delta: 7 },
          { en: 'Do you miss her most on quiet nights?', ko: '조용한 밤에 제일 보고 싶으신가요?', delta: 3 },
          { en: 'Leaving doesn\'t mean love left.', ko: '떠나는 게 사랑이 떠난 건 아니죠.', delta: 1 },
        ],
        afterEn: 'Mira: She sent lace once for my curtains. I used it. Love can be impractical and perfect.',
        afterKo: '미라: 커튼용 망사 장식을 보낸 적 있어요. 썼죠. 사랑은 실용적이지 않아도 완벽할 수 있어요.',
        afterChoices: [
          { en: 'Impractical love is still love.', ko: '실용적이지 않은 사랑도 사랑이죠.', delta: 7 },
          { en: 'Those curtains hold more than light now.', ko: '그 커튼은 이제 빛 이상을 담겠네요.', delta: 3 },
          { en: 'Write her that the lace looks beautiful.', ko: '망사 장식이 예쁘다고 써 보내세요.', delta: 1 },
        ],
      },
      {
        id: 'mira_21',
        minStage: 3,
        npcEn: 'Mira: Festival night — sit with me as family, not as a guest. Please?',
        npcKo: '미라: 축제 밤엔 손님이 아니라 가족으로 옆에 앉아 줘요. 부탁해요.',
        choices: [
          { en: 'I\'d be proud to sit as family.', ko: '가족으로 앉게 되어 자랑스러워요.', delta: 8 },
          { en: 'Nothing would make me happier.', ko: '그보다 기쁜 일은 없을 거예요.', delta: 3 },
          { en: 'I\'ll save you the seat beside mine.', ko: '제 옆자리를 비워 둘게요.', delta: 1 },
        ],
        afterEn: 'Mira: We\'ll clap for the dancers and sneak honey cake before the children notice.',
        afterKo: '미라: 춤추는 사람들한테 박수 치고, 아이들 눈치채기 전에 꿀케이크를 몰래 먹어요.',
        afterChoices: [
          { en: 'Conspiracy of cake. I\'m in.', ko: '케이크 작전, 저도 낄게요.', delta: 7 },
          { en: 'Clapping and cake — perfect plan.', ko: '박수와 케이크, 완벽한 계획이에요.', delta: 3 },
          { en: 'I\'ll distract the kids if needed.', ko: '필요하면 아이들 시선 끌게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_22',
        minStage: 3,
        npcEn: 'Mira: Midnight confession: I regret the nights I stayed angry instead of asking for help.',
        npcKo: '미라: 자정 고백이에요. 도움 대신 화만 품고 넘긴 밤들이 후회돼요.',
        choices: [
          { en: 'Regret means you grew. That matters.', ko: '후회는 성장했다는 뜻이에요. 중요하죠.', delta: 8 },
          { en: 'You\'re asking now. That\'s brave.', ko: '지금은 말하고 계세요. 용감한 일이에요.', delta: 3 },
          { en: 'I\'m here if anger ever returns.', ko: '화가 다시 와도 옆에 있을게요.', delta: 1 },
        ],
        afterEn: 'Mira: If you see me sharpening my voice, remind me of towels and tea. Soft things.',
        afterKo: '미라: 제가 목소리를 날카롭게 하면, 수건이랑 차를 떠올리게 해 줘요. 부드러운 것들이요.',
        afterChoices: [
          { en: 'I\'ll remind you gently.', ko: '살살 상기시켜 드릴게요.', delta: 7 },
          { en: 'Soft reminders for a soft heart.', ko: '부드러운 마음을 위한 부드러운 알림.', delta: 3 },
          { en: 'Tea and towels. Got it.', ko: '차와 수건. 기억했어요.', delta: 1 },
        ],
      },
      {
        id: 'mira_23',
        minStage: 3,
        npcEn: 'Mira: Some nights I fear growing old alone. Saying it out loud to you makes it lighter.',
        npcKo: '미라: 어떤 밤엔 혼자 늙는 게 두려워요. {player} 씨한테 말하면 조금 가벼워져요.',
        choices: [
          { en: 'You\'re not alone while I\'m here.', ko: '제가 있는 한 혼자가 아니에요.', delta: 8 },
          { en: 'Fear shared is fear halved.', ko: '나눈 두려움은 반이 되죠.', delta: 3 },
          { en: 'Thank you for trusting me with that.', ko: '그런 마음을 맡겨 주셔서 고마워요.', delta: 1 },
        ],
        afterEn: 'Mira: Stay for tea when those nights come. I don\'t need solutions — just a second cup.',
        afterKo: '미라: 그런 밤엔 차 마시러 와요. 해결책보다 잔이 하나 더 있으면 돼요.',
        afterChoices: [
          { en: 'I\'ll bring the second cup myself.', ko: '두 번째 잔은 제가 가져올게요.', delta: 8 },
          { en: 'Second cups are my specialty.', ko: '두 번째 잔이 제 특기예요.', delta: 3 },
          { en: 'I\'ll come without needing a reason.', ko: '이유 없이도 올게요.', delta: 1 },
        ],
      },
      {
        id: 'mira_24',
        minStage: 3,
        npcEn: 'Mira: Sometimes we sit without talking and it still feels full. That\'s rare. That\'s us.',
        npcKo: '미라: 가끔 말없이 앉아도 가득 찬 기분이에요. 드문 일이에요. 우리만요.',
        choices: [
          { en: 'I treasure that quiet with you.', ko: '그 고요함을 소중히 여겨요.', delta: 8 },
          { en: 'Full silence is a kind of music.', ko: '가득한 침묵도 음악이죠.', delta: 3 },
          { en: 'I don\'t need words to feel welcome.', ko: '환영받으려면 말이 필요 없어요.', delta: 1 },
        ],
        afterEn: 'Mira: Stay a little longer tonight. The fire still has stories in the coals.',
        afterKo: '미라: 오늘 밤 조금 더 있어요. 난로 숯에 아직 이야기가 남았거든요.',
        afterChoices: [
          { en: 'I\'ll stay until the coals dim.', ko: '숯이 사그라들 때까지 있을게요.', delta: 8 },
          { en: 'Then let\'s listen to the fire together.', ko: '그럼 같이 불을 들어요.', delta: 3 },
          { en: 'A little longer sounds perfect.', ko: '조금만 더, 딱 좋아요.', delta: 1 },
        ],
      },
    ],
  },
  bram: {
    id: 'bram',
    name: 'bram',
    titleEn: 'shopkeep',
    titleKo: '상점 주인',
    aliases: ['브램', '상인'],
    gifts: [
      { stage: 1, itemId: 'hp_potion_s', qty: 3 },
      { stage: 2, itemId: 'copper_ring', qty: 1 },
      { stage: 3, itemId: 'tin_ring', qty: 1 },
    ],
    dialogues: [
      {
        id: 'bram_1',
        minStage: 0,
        npcEn: 'Bram: A child once stole an apple from my basket and cried before I said a word.',
        npcKo: '브램: 어떤 애가 내 바구니서 사과를 훔쳤는데, 내가 한마디도 하기 전에 울더라.',
        choices: [
          { en: 'That makes me see the stolen apple in a different light.', ko: '울기부터 한 애라니, 배고픔이 먼저였구나.', delta: 7 },
          { en: 'I can understand why the stolen apple matters to you.', ko: '배고픈 애를 그렇게 다루는 마음, 이해돼.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the stolen apple.', ko: '혼내기보다 일로 가르친 거, 괜찮은데.', delta: 1 },
        ],
        afterEn: 'Bram: I had them sweep the step and eat it. Hunger isn\'t a lesson, but work can be.',
        afterKo: '브램: 계단 쓸게 하고 사과는 먹였지. 배고픔은 가르침이 아니지만, 일은 될 수 있어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the stolen apple with me.', ko: '일 시키고 밥 먹인 거, 참 괜찮은 처분이야.', delta: 7 },
          { en: 'I\'ll be more mindful of the stolen apple from now on.', ko: '배고픈 애한테 그런 식으로 대할게.', delta: 3 },
          { en: 'That gives the stolen apple a warmer meaning.', ko: '일 시키고 먹인 처분, 마음에 들어.', delta: 1 },
        ],
      },
      {
        id: 'bram_2',
        minStage: 0,
        npcEn: 'Bram: An angry customer wanted a refund for a kettle they dropped themselves.',
        npcKo: '브램: 화난 손님이 자기가 떨어뜨린 주전자로 환불해 달라더라.',
        choices: [
          { en: 'That makes me see the broken kettle refund in a different light.', ko: '자기가 떨어뜨리고 환불 요구라니.', delta: 7 },
          { en: 'I can understand why the broken kettle refund matters to you.', ko: '화난 손님 앞에서도 차분히 대하는구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the broken kettle refund.', ko: '걸레랑 말투로 버티는 장사, 쉽지 않지.', delta: 1 },
        ],
        afterEn: 'Bram: I gave them a cloth and a calm voice. Sometimes that\'s the only stock you need.',
        afterKo: '브램: 걸레랑 차분한 말만 건넸어. 가끔은 그게 필요한 재고 전부야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the broken kettle refund with me.', ko: '걸레랑 차분한 말, 그게 진짜 재고였구나.', delta: 7 },
          { en: 'I\'ll be more mindful of the broken kettle refund from now on.', ko: '화난 손님 앞에서도 그렇게 해 볼게.', delta: 3 },
          { en: 'That gives the broken kettle refund a warmer meaning.', ko: '차분한 말도 재고가 될 수 있구나.', delta: 1 },
        ],
      },
      {
        id: 'bram_3',
        minStage: 0,
        npcEn: 'Bram: Haggling is fine. Pretending my work has no value isn\'t.',
        npcKo: '브램: 흥정은 괜찮아. 내 일이 값어치 없다는 듯 구는 건 아니고.',
        choices: [
          { en: 'That makes me see haggling etiquette in a different light.', ko: '흥정하는 예의, 다시 보게 되네.', delta: 7 },
          { en: 'I can understand why haggling etiquette matters to you.', ko: '흥정은 해도 네 일 값어치는 지켜야지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at haggling etiquette.', ko: '공정하게 시작하자는 거, 마음에 들어.', delta: 1 },
        ],
        afterEn: 'Bram: Start fair, stay cheerful, and we can usually find a number.',
        afterKo: '브램: 공정하게 시작하고 웃으면서 얘기해. 그럼 대개 숫자는 맞춰져.',
        afterChoices: [
          { en: 'I\'ll carry that thought about haggling etiquette with me.', ko: '공정하게 시작하고 웃으면서 할게.', delta: 7 },
          { en: 'I\'ll be more mindful of haggling etiquette from now on.', ko: '흥정할 때 네 일 값어치부터 챙길게.', delta: 3 },
          { en: 'That gives haggling etiquette a warmer meaning.', ko: '웃으면서도 공정하게, 그렇게 할게.', delta: 1 },
        ],
      },
      {
        id: 'bram_4',
        minStage: 0,
        npcEn: 'Bram: My ledger looks dull because it tells the truth every day.',
        npcKo: '브램: 내 장부가 재미없는 건 매일 진실만 적어서야.',
        choices: [
          { en: 'That makes me see the ledger in a different light.', ko: '재미없어도 매일 진실만 적는 장부라…', delta: 7 },
          { en: 'I can understand why the ledger matters to you.', ko: '작은 표시 하나까지 가게를 살리는구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the ledger.', ko: '장부를 진지하게 대하는구나.', delta: 1 },
        ],
        afterEn: 'Bram: A shop survives on the little marks people think don\'t matter.',
        afterKo: '브램: 가게는 다들 별거 아니라고 넘기는 작은 표시들로 버텨.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the ledger with me.', ko: '작은 표시들이 가게를 살리는구나.', delta: 7 },
          { en: 'I\'ll be more mindful of the ledger from now on.', ko: '장부 같은 것도 허투루 안 볼게.', delta: 3 },
          { en: 'That gives the ledger a warmer meaning.', ko: '별거 아닌 표시도 허투루 안 볼게.', delta: 1 },
        ],
      },
      {
        id: 'bram_5',
        minStage: 0,
        npcEn: 'Bram: My old partner skimmed coins from the till. He thought tiny thefts stayed tiny.',
        npcKo: '브램: 옛 동업자가 계산대에서 동전을 빼돌렸어. 작은 도둑질은 작게 남는 줄 알았나 봐.',
        choices: [
          { en: 'That makes me see the dishonest partner in a different light.', ko: '작은 도둑질이 결국 믿음을 무너뜨리는구나.', delta: 7 },
          { en: 'I can understand why the dishonest partner matters to you.', ko: '작은 도둑질이 믿음을 무너뜨린 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the dishonest partner.', ko: '그 상처를 짚는 눈이 날카롭네.', delta: 1 },
        ],
        afterEn: 'Bram: Trust leaves slowly, but it leaves. I check the drawer myself now.',
        afterKo: '브램: 믿음은 천천히 떠나지만 결국 떠나. 이제 계산대는 내가 직접 봐.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the dishonest partner with me.', ko: '믿음은 그렇게 천천히 떠나가는구나.', delta: 7 },
          { en: 'I\'ll be more mindful of the dishonest partner from now on.', ko: '작은 도둑질도 가볍게 안 볼게.', delta: 3 },
          { en: 'That gives the dishonest partner a warmer meaning.', ko: '믿음이 그렇게 떠나는 거, 무겁게 남네.', delta: 1 },
        ],
      },
      {
        id: 'bram_6',
        minStage: 0,
        npcEn: 'Bram: No, I don\'t put my thumb on the scale. I\'d rather lose a sale than my name.',
        npcKo: '브램: 아니, 저울에 엄지 안 올려. 한 건 놓쳐도 내 이름은 안 잃어.',
        choices: [
          { en: 'That makes me see the weighing-thumb joke in a different light.', ko: '이름보다 한 건이 중요하지.', delta: 7 },
          { en: 'I can understand why the weighing-thumb joke matters to you.', ko: '한 건보다 이름을 지키는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the weighing-thumb joke.', ko: '이름 지키는 장사, 단호하네.', delta: 1 },
        ],
        afterEn: 'Bram: Besides, these fingers are too busy counting honestly.',
        afterKo: '브램: 그리고 이 손가락들은 정직하게 세느라 바빠.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the weighing-thumb joke with me.', ko: '이름 지키는 장사라니, 믿음이 가.', delta: 7 },
          { en: 'I\'ll be more mindful of the weighing-thumb joke from now on.', ko: '저울 앞에선 엄지부터 뗄게.', delta: 3 },
          { en: 'That gives the weighing-thumb joke a warmer meaning.', ko: '정직하게 세는 손가락이라니, 믿음 가.', delta: 1 },
        ],
      },
      {
        id: 'bram_7',
        minStage: 0,
        npcEn: 'Bram: On my first shop day, I forgot to unlock the door and wondered where everyone was.',
        npcKo: '브램: 처음 가게 연 날 문을 안 열어 놓고 손님이 왜 없나 했어.',
        choices: [
          { en: 'That makes me see Bram\'s first shop day in a different light.', ko: '첫 개업 날 이야길 들으니 웃프네.', delta: 7 },
          { en: 'I can understand why Bram\'s first shop day matters to you.', ko: '문 안 열고 손님 찾았다니, 그날이 오래 남겠네.', delta: 3 },
          { en: 'You have a thoughtful way of looking at Bram\'s first shop day.', ko: '그날을 오래 간직하는구나.', delta: 1 },
        ],
        afterEn: 'Bram: A neighbor knocked on the window. Best lesson I ever got for free.',
        afterKo: '브램: 이웃이 창문 두드려 줬지. 공짜로 배운 최고의 가르침이야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about Bram\'s first shop day with me.', ko: '이웃 두드림이 최고의 가르침이었네.', delta: 7 },
          { en: 'I\'ll be more mindful of Bram\'s first shop day from now on.', ko: '앞으론 문부터 열었는지 확인할게.', delta: 3 },
          { en: 'That gives Bram\'s first shop day a warmer meaning.', ko: '공짜 가르침치고 꽤 든든하네.', delta: 1 },
        ],
      },
      {
        id: 'bram_8',
        minStage: 0,
        npcEn: 'Bram: Rainy days sell needles, lamp oil, and things people mean to fix.',
        npcKo: '브램: 비 오는 날엔 바늘, 등유, 고치려던 물건들이 잘 나가.',
        choices: [
          { en: 'That makes me see rainy-day repairs in a different light.', ko: '비 오는 날 수리 물건이 잘 나가는구나.', delta: 7 },
          { en: 'I can understand why rainy-day repairs matters to you.', ko: '비가 오면 집을 고치려는 손이 늘어나는구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at rainy-day repairs.', ko: '날씨로 장사 흐름을 읽는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Weather reminds folks that homes need tending too.',
        afterKo: '브램: 날씨가 집도 돌봐야 한다고 알려 주지.',
        afterChoices: [
          { en: 'I\'ll carry that thought about rainy-day repairs with me.', ko: '비 오는 날이 집을 챙기게 하는구나.', delta: 7 },
          { en: 'I\'ll be more mindful of rainy-day repairs from now on.', ko: '앞으론 비 오기 전에 집부터 챙길게.', delta: 3 },
          { en: 'That gives rainy-day repairs a warmer meaning.', ko: '집도 날씨처럼 돌봐야겠구나.', delta: 1 },
        ],
      },
      {
        id: 'bram_9',
        minStage: 0,
        npcEn: 'Bram: Salt came in late this season. I bought it before the road turned to mud.',
        npcKo: '브램: 이번 철엔 소금이 늦게 들어왔어. 길이 진창 되기 전에 미리 샀지.',
        choices: [
          { en: 'That makes me see the salt delivery in a different light.', ko: '길 진창 되기 전에 산 거, 대단하네.', delta: 7 },
          { en: 'I can understand why the salt delivery matters to you.', ko: '길 진창 되기 전에 산 타이밍이 핵심이구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the salt delivery.', ko: '때를 보는 눈이 날카롭네.', delta: 1 },
        ],
        afterEn: 'Bram: Good timing is a kind of profit nobody can put in a crate.',
        afterKo: '브램: 때 잘 잡는 것도 돈이야. 상자에 담을 순 없지만.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the salt delivery with me.', ko: '때 잘 잡는 것도 진짜 장사네.', delta: 7 },
          { en: 'I\'ll be more mindful of the salt delivery from now on.', ko: '길 진창 되기 전에 움직일게.', delta: 3 },
          { en: 'That gives the salt delivery a warmer meaning.', ko: '때 잘 잡는 것도 진짜 장사네.', delta: 1 },
        ],
      },
      {
        id: 'bram_10',
        minStage: 0,
        npcEn: 'Bram: These scales are older than my counter, and more honest than most people.',
        npcKo: '브램: 이 저울은 내 계산대보다 오래됐고, 웬만한 사람보다 정직해.',
        choices: [
          { en: 'That makes me see the old scales in a different light.', ko: '낡은 저울이 사람보다 정직하다니.', delta: 7 },
          { en: 'I can understand why the old scales matters to you.', ko: '사람보다 정직한 저울이라니, 이해돼.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the old scales.', ko: '저울을 진지하게 대하는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Keep them level and they\'ll never flatter you.',
        afterKo: '브램: 수평만 맞추면 절대 아첨 안 해.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the old scales with me.', ko: '정직한 저울이 사람보다 낫다니.', delta: 7 },
          { en: 'I\'ll be more mindful of the old scales from now on.', ko: '저울도 더 소중히 볼게.', delta: 3 },
          { en: 'That gives the old scales a warmer meaning.', ko: '저울처럼 정직하게 거래할게.', delta: 1 },
        ],
      },
      {
        id: 'bram_11',
        minStage: 0,
        npcEn: 'Bram: Those price tags are straight for a reason. A crooked number makes a crooked deal.',
        npcKo: '브램: 가격표는 똑바로 붙여. 숫자가 비뚤면 거래도 비뚤어지지.',
        choices: [
          { en: 'That makes me see the price tags in a different light.', ko: '비뚤어진 숫자면 거래도 비뚤어지는구나.', delta: 7 },
          { en: 'I can understand why the price tags matters to you.', ko: '숫자가 비뚤면 거래도 비뚤어지는구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the price tags.', ko: '숫자를 단정히 다루는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Check the tag before you hand over a coin. Saves us both a sigh.',
        afterKo: '브램: 동전 내기 전에 가격부터 봐. 서로 한숨 덜 쉬잖아.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the price tags with me.', ko: '가격부터 보면 한숨이 줄어드는구나.', delta: 7 },
          { en: 'I\'ll be more mindful of the price tags from now on.', ko: '동전 내기 전에 가격부터 볼게.', delta: 3 },
          { en: 'That gives the price tags a warmer meaning.', ko: '동전 내기 전엔 가격부터 볼게.', delta: 1 },
        ],
      },
      {
        id: 'bram_12',
        minStage: 0,
        npcEn: 'Bram: Trade is a craft. Anyone can hand over a thing; not everyone can make it fair.',
        npcKo: '브램: 장사도 기술이야. 물건 건네는 건 누구나 해도, 공정하게 하는 건 다 못 해.',
        choices: [
          { en: 'That makes me see the craft of trade in a different light.', ko: '공정한 거래가 진짜 기술이구나.', delta: 7 },
          { en: 'I can understand why the craft of trade matters to you.', ko: '공정하게 건네는 게 진짜 기술이구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the craft of trade.', ko: '양쪽 손이 가벼워지는 거래, 그게 목표구나.', delta: 1 },
        ],
        afterEn: 'Bram: When it goes right, both hands are lighter afterward.',
        afterKo: '브램: 잘되면 거래 뒤에 양쪽 손이 다 가벼워져.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the craft of trade with me.', ko: '양쪽 손이 가벼워지는 거래, 좋네.', delta: 7 },
          { en: 'I\'ll be more mindful of the craft of trade from now on.', ko: '공정한 거래에 더 신경 쓸게.', delta: 3 },
          { en: 'That gives the craft of trade a warmer meaning.', ko: '공정한 거래, 나도 그렇게 할게.', delta: 1 },
        ],
      },
      {
        id: 'bram_13',
        minStage: 1,
        npcEn: 'Bram: Morning, {player}. I saved the cleanest basket for the fresh bread.',
        npcKo: '브램: 왔네, {player}. 갓 나온 빵 담으라고 제일 깨끗한 바구니 빼뒀어.',
        choices: [
          { en: 'That makes me see the fresh-bread basket in a different light.', ko: '빵 바구니까지 챙겨 주다니, 고마워.', delta: 7 },
          { en: 'I can understand why the fresh-bread basket matters to you.', ko: '단골이라 깨끗한 바구니까지 빼둔 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the fresh-bread basket.', ko: '단골 챙기는 손이 꼼꼼하네.', delta: 1 },
        ],
        afterEn: 'Bram: Regulars deserve the good basket. That\'s just sense.',
        afterKo: '브램: 단골은 좋은 바구니 써야지. 그게 상식이야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the fresh-bread basket with me.', ko: '단골이라 바구니까지 챙겨 주다니.', delta: 7 },
          { en: 'I\'ll be more mindful of the fresh-bread basket from now on.', ko: '고마워. 잘 받아 갈게.', delta: 3 },
          { en: 'That gives the fresh-bread basket a warmer meaning.', ko: '좋은 바구니에 담아 줘서 고마워.', delta: 1 },
        ],
      },
      {
        id: 'bram_14',
        minStage: 1,
        npcEn: 'Bram: The market\'s quiet today, {player}. Good day to compare things without elbows.',
        npcKo: '브램: 오늘 장터 한가하네, {player}. 팔꿈치 안 부딪치고 물건 비교하기 좋겠어.',
        choices: [
          { en: 'That makes me see a quiet market in a different light.', ko: '한가한 장터가 오히려 좋네.', delta: 7 },
          { en: 'I can understand why a quiet market matters to you.', ko: '한가한 날이 천천히 고르기 좋긴 하지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a quiet market.', ko: '한가함을 장사에 잘 쓰는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Take your time. Rushed choices cost more later.',
        afterKo: '브램: 천천히 골라. 급하게 고르면 나중에 더 나가.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a quiet market with me.', ko: '한가할 때 천천히 고르는 게 이득이네.', delta: 7 },
          { en: 'I\'ll be more mindful of a quiet market from now on.', ko: '급하게 고르지 않을게.', delta: 3 },
          { en: 'That gives a quiet market a warmer meaning.', ko: '오늘은 천천히 둘러볼게.', delta: 1 },
        ],
      },
      {
        id: 'bram_15',
        minStage: 1,
        npcEn: 'Bram: {player}, that scarf color suits you. It won\'t hide from snow, though.',
        npcKo: '브램: {player}, 그 목도리 색 잘 어울려. 눈 속에선 못 숨겨 주겠지만.',
        choices: [
          { en: 'That makes me see a winter scarf in a different light.', ko: '색은 예쁜데 눈엔 안 숨겠구나.', delta: 7 },
          { en: 'I can understand why a winter scarf matters to you.', ko: '예쁜 색이어도 추위엔 두께가 중요하지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a winter scarf.', ko: '차림까지 세심히 봐 주네.', delta: 1 },
        ],
        afterEn: 'Bram: Take the thicker one if you\'re headed uphill.',
        afterKo: '브램: 언덕 갈 거면 더 두꺼운 걸로 챙겨.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a winter scarf with me.', ko: '언덕용이면 두꺼운 게 맞지.', delta: 7 },
          { en: 'I\'ll be more mindful of a winter scarf from now on.', ko: '두꺼운 걸로 갈아입을게.', delta: 3 },
          { en: 'That gives a winter scarf a warmer meaning.', ko: '두꺼운 걸로 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'bram_16',
        minStage: 1,
        npcEn: 'Bram: {player}, try this tea sample. Don\'t make a face until the second sip.',
        npcKo: '브램: {player}, 이 차 한 모금 마셔 봐. 두 번째 마시기 전엔 표정 짓지 말고.',
        choices: [
          { en: 'That makes me see a tea sample in a different light.', ko: '두 번째까지 참으라니, 재미있네.', delta: 7 },
          { en: 'I can understand why a tea sample matters to you.', ko: '두 번째 모금까지 참으라는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a tea sample.', ko: '차를 권하는 방식이 재미있어.', delta: 1 },
        ],
        afterEn: 'Bram: First sip is leaves. Second sip is the reason I stocked it.',
        afterKo: '브램: 첫 모금은 잎이고, 두 번째가 내가 들여온 이유야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a tea sample with me.', ko: '두 번째 모금까지 참아 볼게.', delta: 7 },
          { en: 'I\'ll be more mindful of a tea sample from now on.', ko: '표정 안 짓고 마셔 볼게.', delta: 3 },
          { en: 'That gives a tea sample a warmer meaning.', ko: '두 번째 모금까지 참아 볼게.', delta: 1 },
        ],
      },
      {
        id: 'bram_17',
        minStage: 2,
        npcEn: 'Bram: An old potter taught me to tap a bowl before I bought it. A good bowl answers clear.',
        npcKo: '브램: 늙은 도공이 그릇 사기 전에 두드려 보랬어. 좋은 그릇은 맑게 대답한대.',
        choices: [
          { en: 'That makes me see the potter\'s bowl test in a different light.', ko: '맑게 대답하는 그릇이라… 신기하네.', delta: 7 },
          { en: 'I can understand why the potter\'s bowl test matters to you.', ko: '두드려 보고 사라는 가르침이구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the potter\'s bowl test.', ko: '도공의 가르침을 잘 간직했네.', delta: 1 },
        ],
        afterEn: 'Bram: I still tap things. Makes people think I\'m judging them. I\'m judging the bowl.',
        afterKo: '브램: 아직도 두드려 봐. 사람들이 자기 평가하나 생각하는데, 난 그릇 보는 거야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the potter\'s bowl test with me.', ko: '그릇 두드리는 버릇, 이해됐어.', delta: 7 },
          { en: 'I\'ll be more mindful of the potter\'s bowl test from now on.', ko: '앞으론 그릇도 두드려 볼게.', delta: 3 },
          { en: 'That gives the potter\'s bowl test a warmer meaning.', ko: '그릇도 두드려 보고 고를게.', delta: 1 },
        ],
      },
      {
        id: 'bram_18',
        minStage: 2,
        npcEn: 'Bram: I learned numbers at my aunt\'s kitchen table, counting beans into neat little hills.',
        npcKo: '브램: 이모 부엌 식탁에서 숫자 배웠어. 콩을 작은 산처럼 나눠 세면서.',
        choices: [
          { en: 'That makes me see learning numbers with beans in a different light.', ko: '콩으로 숫자 배운 이야길 들으니 반갑네.', delta: 7 },
          { en: 'I can understand why learning numbers with beans matters to you.', ko: '콩 산으로 숫자 배운 게 아직도 남았구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at learning numbers with beans.', ko: '숫자 배운 방식을 소중히 여기는구나.', delta: 1 },
        ],
        afterEn: 'Bram: She let me eat one for every correct sum. Good schooling.',
        afterKo: '브램: 맞게 더할 때마다 하나 먹게 해줬지. 좋은 공부였어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about learning numbers with beans with me.', ko: '콩으로 숫자 배운 공부가 참 좋네.', delta: 7 },
          { en: 'I\'ll be more mindful of learning numbers with beans from now on.', ko: '숫자도 더 정성껏 볼게.', delta: 3 },
          { en: 'That gives learning numbers with beans a warmer meaning.', ko: '숫자도 손으로 세며 배울게.', delta: 1 },
        ],
      },
      {
        id: 'bram_19',
        minStage: 2,
        npcEn: 'Bram: I once carried a whole crate of oranges three towns on foot. Never again without a cart.',
        npcKo: '브램: 귤 한 상자를 들고 세 마을을 걸은 적 있어. 수레 없인 두 번 안 해.',
        choices: [
          { en: 'That makes me see carrying oranges on foot in a different light.', ko: '귤 들고 세 마을은 진짜 고생이었네.', delta: 7 },
          { en: 'I can understand why carrying oranges on foot matters to you.', ko: '수레 없이 세 마을은 진짜 무리였지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at carrying oranges on foot.', ko: '고생을 담담하게 말하는구나.', delta: 1 },
        ],
        afterEn: 'Bram: My shoulders hurt for a week, but not one orange spoiled.',
        afterKo: '브램: 어깨는 일주일 아팠지만 귤은 하나도 안 상했어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about carrying oranges on foot with me.', ko: '수레 없이 세 마을은 진짜 무리였네.', delta: 7 },
          { en: 'I\'ll be more mindful of carrying oranges on foot from now on.', ko: '앞으론 수레부터 챙길게.', delta: 3 },
          { en: 'That gives carrying oranges on foot a warmer meaning.', ko: '무거운 짐은 수레부터 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'bram_20',
        minStage: 2,
        npcEn: 'Bram: I used to hate the sound of shutters in a storm. Now it means the shop is safe.',
        npcKo: '브램: 예전엔 폭풍에 덧문 덜컹이는 소리가 싫었어. 이젠 가게가 안전하단 뜻이지.',
        choices: [
          { en: 'That makes me see storm shutters in a different light.', ko: '덜컹임이 안전 신호라니, 이상하게 납득돼.', delta: 7 },
          { en: 'I can understand why storm shutters matters to you.', ko: '덜컹임이 이젠 안전 신호가 된 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at storm shutters.', ko: '두려움을 담담하게 말하는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Age changes which sounds you fear.',
        afterKo: '브램: 나이 들면 무서운 소리도 바뀌어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about storm shutters with me.', ko: '덜컹이는 소리가 안전 신호라니.', delta: 7 },
          { en: 'I\'ll be more mindful of storm shutters from now on.', ko: '그런 소리도 다르게 들을게.', delta: 3 },
          { en: 'That gives storm shutters a warmer meaning.', ko: '그런 소리도 든든하게 들을게.', delta: 1 },
        ],
      },
      {
        id: 'bram_21',
        minStage: 3,
        npcEn: 'Bram: When the shop feels too small, {player}, I remember you made it feel like a place.',
        npcKo: '브램: 가게가 너무 좁게 느껴질 때면, {player}, 네가 여길 장소답게 만들어 줬단 걸 생각해.',
        choices: [
          { en: 'That makes me see making the shop feel like home in a different light.', ko: '여길 장소답게 만들어 줬다니… 고마워.', delta: 7 },
          { en: 'I can understand why making the shop feel like home matters to you.', ko: '여길 장소답게 만들어 준 게 너한텐 크구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at making the shop feel like home.', ko: '이곳을 소중히 여기는구나.', delta: 1 },
        ],
        afterEn: 'Bram: Not every good thing fits on a shelf.',
        afterKo: '브램: 좋은 게 다 선반에 올라가진 않아.',
        afterChoices: [
          { en: 'I\'ll carry that thought about making the shop feel like home with me.', ko: '선반에 없는 것도 좋은 거라니.', delta: 7 },
          { en: 'I\'ll be more mindful of making the shop feel like home from now on.', ko: '여기 오는 걸 더 소중히 할게.', delta: 3 },
          { en: 'That gives making the shop feel like home a warmer meaning.', ko: '여기 오는 걸 더 소중히 할게.', delta: 1 },
        ],
      },
      {
        id: 'bram_22',
        minStage: 3,
        npcEn: 'Bram: {player}, I counted the drawer twice because you seemed worried. Everything\'s fine.',
        npcKo: '브램: {player}, 네가 걱정돼 보여서 계산대를 두 번 셌어. 다 괜찮아.',
        choices: [
          { en: 'That makes me see Bram checking the drawer twice in a different light.', ko: '걱정돼서 두 번 세 준 거, 고마워.', delta: 7 },
          { en: 'I can understand why Bram checking the drawer twice matters to you.', ko: '걱정돼서 두 번 세 준 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at Bram checking the drawer twice.', ko: '걱정 덜어 주는 손이 다정하네.', delta: 1 },
        ],
        afterEn: 'Bram: You don\'t have to explain every quiet day to me. Sit a while.',
        afterKo: '브램: 조용한 날마다 내게 설명할 필요 없어. 잠깐 앉아 있어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about Bram checking the drawer twice with me.', ko: '조용한 날도 여기 앉아 있을게.', delta: 7 },
          { en: 'I\'ll be more mindful of Bram checking the drawer twice from now on.', ko: '조용한 날도 덜 숨길게.', delta: 3 },
          { en: 'That gives Bram checking the drawer twice a warmer meaning.', ko: '잠깐 앉아 있을게.', delta: 1 },
        ],
      },
      {
        id: 'bram_23',
        minStage: 3,
        npcEn: 'Bram: {player}, take this spare key only if you\'ll use it when you need shelter.',
        npcKo: '브램: {player}, 정말 쉴 곳 필요할 때 쓸 거면 이 여분 열쇠 가져.',
        choices: [
          { en: 'That makes me see the spare shop key in a different light.', ko: '여분 열쇠라니… 무거운 선물이네.', delta: 7 },
          { en: 'I can understand why the spare shop key matters to you.', ko: '쉴 곳 필요할 때만 쓰라는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the spare shop key.', ko: '열쇠 맡기는 마음이 무겁네.', delta: 1 },
        ],
        afterEn: 'Bram: No speeches. Just lock up after yourself and come back safe.',
        afterKo: '브램: 긴 말은 됐고. 나갈 땐 잠그고 무사히 돌아와.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the spare shop key with me.', ko: '필요할 때만 쓸게. 약속할게.', delta: 7 },
          { en: 'I\'ll be more mindful of the spare shop key from now on.', ko: '나갈 땐 꼭 잠글게.', delta: 3 },
          { en: 'That gives the spare shop key a warmer meaning.', ko: '이 열쇠, 가볍게 안 받을게.', delta: 1 },
        ],
      },
      {
        id: 'bram_24',
        minStage: 3,
        npcEn: 'Bram: {player}, you\'re family by the rules that matter: you show up, and you mean it.',
        npcKo: '브램: {player}, 중요한 기준으로 보면 넌 가족이야. 와 주고, 진심이잖아.',
        choices: [
          { en: 'That makes me see what makes family in a different light.', ko: '와 주고 진심이면 가족이구나.', delta: 7 },
          { en: 'I can understand why what makes family matters to you.', ko: '와 주고 진심이면 가족이라는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at what makes family.', ko: '가족 기준이 솔직하네.', delta: 1 },
        ],
        afterEn: 'Bram: Now stop making me sentimental and help me carry this flour.',
        afterKo: '브램: 이제 감상적인 소리 그만하고 밀가루 좀 들어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about what makes family with me.', ko: '진심이 가족 기준이라니, 마음에 들어.', delta: 7 },
          { en: 'I\'ll be more mindful of what makes family from now on.', ko: '그럼 밀가루부터 들자.', delta: 3 },
          { en: 'That gives what makes family a warmer meaning.', ko: '더 자주 와 줄게.', delta: 1 },
        ],
      },
    ],
  },
  rowan: {
    id: 'rowan',
    name: 'rowan',
    titleEn: 'wanderer',
    titleKo: '떠돌이 모험가',
    aliases: ['로완', '모험가'],
    gifts: [
      { stage: 1, itemId: 'hp_potion_m', qty: 2 },
      { stage: 2, itemId: 'leather_gloves', qty: 1 },
      { stage: 3, itemId: 'hunter_blade', qty: 1 },
    ],
    dialogues: [
      {
        id: 'rowan_1',
        minStage: 0,
        npcEn: 'Rowan: A good rope is never exciting. That\'s why good rope is wonderful.',
        npcKo: '로완: 좋은 밧줄은 절대 흥미롭지 않아. 그래서 훌륭한 거지.',
        choices: [
          { en: 'That makes me see good rope in a different light.', ko: '좋은 밧줄이 오히려 재미없다니.', delta: 7 },
          { en: 'I can understand why good rope matters to you.', ko: '재미없는 밧줄이 제일 믿음직한 거지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at good rope.', ko: '밧줄을 진지하게 대하는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: If it becomes memorable, something went wrong.',
        afterKo: '로완: 기억에 남으면 뭔가 잘못된 거야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about good rope with me.', ko: '기억에 안 남는 밧줄이 최고구나.', delta: 7 },
          { en: 'I\'ll be more mindful of good rope from now on.', ko: '밧줄부터 챙길게.', delta: 3 },
          { en: 'That gives good rope a warmer meaning.', ko: '무난한 밧줄부터 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_2',
        minStage: 0,
        npcEn: 'Rowan: A locked door is a question, not an insult. Sometimes the answer is \'walk around.\'',
        npcKo: '로완: 잠긴 문은 질문이지 모욕은 아니야. 답이 \'돌아가라\'일 때도 있고.',
        choices: [
          { en: 'That makes me see a locked door in a different light.', ko: '잠긴 문이 질문이구나.', delta: 7 },
          { en: 'I can understand why a locked door matters to you.', ko: '잠긴 문 앞에서 굳이 자존심 부릴 일 없지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a locked door.', ko: '돌아가라는 답도 답으로 보는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Pride is heavy. Don\'t carry it into every ruin.',
        afterKo: '로완: 자존심은 무거워. 모든 폐허에 들고 들어가진 마.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a locked door with me.', ko: '자존심 내려놓고 돌아갈게.', delta: 7 },
          { en: 'I\'ll be more mindful of a locked door from now on.', ko: '잠긴 문 앞에선 한 번 더 생각할게.', delta: 3 },
          { en: 'That gives a locked door a warmer meaning.', ko: '자존심은 폐허 문 앞에선 내려놓을게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_3',
        minStage: 0,
        npcEn: 'Rowan: A river crossing looks shallow until your pack catches the current.',
        npcKo: '로완: 강 건너는 건 배낭이 물살 잡히기 전까진 얕아 보여.',
        choices: [
          { en: 'That makes me see crossing a river in a different light.', ko: '얕아 보이는 강이 제일 무섭지.', delta: 7 },
          { en: 'I can understand why crossing a river matters to you.', ko: '배낭이 물살 잡히면 얕은 강도 무섭지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at crossing a river.', ko: '강을 조심스레 다루는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Unbuckle first. Gear can be replaced; lungs are stubborn to restock.',
        afterKo: '로완: 먼저 배낭 잠금쇠부터 풀어. 장비는 다시 구해도, 숨은 다시 못 채워.',
        afterChoices: [
          { en: 'I\'ll carry that thought about crossing a river with me.', ko: '배낭 잠금쇠부터 풀게.', delta: 7 },
          { en: 'I\'ll be more mindful of crossing a river from now on.', ko: '강에선 얕아 보여도 조심할게.', delta: 3 },
          { en: 'That gives crossing a river a warmer meaning.', ko: '강에선 잠금쇠부터 풀게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_4',
        minStage: 0,
        npcEn: 'Rowan: At a campfire, put the green wood beneath the dry. It smokes less and sulks less.',
        npcKo: '로완: 모닥불 땐 젖은 나무를 마른 나무 밑에 둬. 연기도 덜 나고 덜 삐쳐.',
        choices: [
          { en: 'That makes me see a campfire tip in a different light.', ko: '젖은 나무를 밑에 두라니, 실용적이네.', delta: 7 },
          { en: 'I can understand why a campfire tip matters to you.', ko: '젖은 나무 밑에 두는 거, 실용적이네.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a campfire tip.', ko: '불을 다루는 법이 실용적이네.', delta: 1 },
        ],
        afterEn: 'Rowan: Fire is like a party: arrange it well before asking it to behave.',
        afterKo: '로완: 불도 잔치 같아. 잘 배치하고 나서 말 잘 듣길 바라.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a campfire tip with me.', ko: '나무 배치부터 챙길게.', delta: 7 },
          { en: 'I\'ll be more mindful of a campfire tip from now on.', ko: '불도 잔치처럼 준비할게.', delta: 3 },
          { en: 'That gives a campfire tip a warmer meaning.', ko: '불 피울 때 나무 배치부터 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_5',
        minStage: 0,
        npcEn: 'Rowan: Bandits scared us with bells in the dark. We scared them back with cookware.',
        npcKo: '로완: 도적들이 밤에 방울 소리로 겁줬어. 우린 냄비로 되갚아 줬지.',
        choices: [
          { en: 'That makes me see a bandit scare in a different light.', ko: '냄비로 도적을 겁줬다니, 웃기다.', delta: 7 },
          { en: 'I can understand why a bandit scare matters to you.', ko: '방울에 냄비로 맞선 밤이었구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a bandit scare.', ko: '그 싸움을 유쾌하게 말하는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Never underestimate a frightened cook with a ladle.',
        afterKo: '로완: 국자 든 겁먹은 요리사는 절대 얕보지 마.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a bandit scare with me.', ko: '국자 든 요리사, 얕보지 않을게.', delta: 7 },
          { en: 'I\'ll be more mindful of a bandit scare from now on.', ko: '냄비도 무기로 볼게.', delta: 3 },
          { en: 'That gives a bandit scare a warmer meaning.', ko: '냄비도 무기가 될 수 있지.', delta: 1 },
        ],
      },
      {
        id: 'rowan_6',
        minStage: 0,
        npcEn: 'Rowan: Fog made me take the wrong turn for three hours once. I apologized to every tree.',
        npcKo: '로완: 안개 때문에 세 시간이나 길 잘못 든 적 있어. 나무마다 사과했지.',
        choices: [
          { en: 'That makes me see a wrong turn in fog in a different light.', ko: '나무마다 사과했다니, 나도 그럴 듯.', delta: 7 },
          { en: 'I can understand why a wrong turn in fog matters to you.', ko: '안개 속에 세 시간이면 나무에 사과할 만해.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a wrong turn in fog.', ko: '나무에 사과하는 마음이 귀엽네.', delta: 1 },
        ],
        afterEn: 'Rowan: They didn\'t forgive me, but they didn\'t laugh either.',
        afterKo: '로완: 용서도 안 했지만 웃지도 않더라.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a wrong turn in fog with me.', ko: '안개 속에선 더 조심할게.', delta: 7 },
          { en: 'I\'ll be more mindful of a wrong turn in fog from now on.', ko: '나무한테도 예의 차릴게.', delta: 3 },
          { en: 'That gives a wrong turn in fog a warmer meaning.', ko: '안개 속에선 더 천천히 갈게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_7',
        minStage: 0,
        npcEn: 'Rowan: I lost a party once because everyone followed the loudest voice. Quiet maps matter.',
        npcKo: '로완: 시끄러운 목소리만 따라가다 일행을 잃은 적 있어. 조용한 지도도 중요해.',
        choices: [
          { en: 'That makes me see a lost party in a different light.', ko: '시끄러운 목소리만 따라가면 위험하구나.', delta: 7 },
          { en: 'I can understand why a lost party matters to you.', ko: '시끄러운 목소리만 따라가다 일행을 잃었구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a lost party.', ko: '지도를 소중히 여기는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: When plans split, count heads before you count monsters.',
        afterKo: '로완: 계획이 갈리면 괴물 세기 전에 사람부터 세.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a lost party with me.', ko: '사람부터 셀게.', delta: 7 },
          { en: 'I\'ll be more mindful of a lost party from now on.', ko: '시끄러운 목소리만 안 따라갈게.', delta: 3 },
          { en: 'That gives a lost party a warmer meaning.', ko: '계획 갈리면 인원부터 셀게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_8',
        minStage: 0,
        npcEn: 'Rowan: My mentor said, \'Bravery is checking the rope before you need it.\'',
        npcKo: '로완: 스승이 그랬어. \'용기는 필요해지기 전에 줄을 확인하는 거다.\'',
        choices: [
          { en: 'That makes me see the mentor\'s rope advice in a different light.', ko: '줄 확인이 용기라… 이제는 알겠어.', delta: 7 },
          { en: 'I can understand why the mentor\'s rope advice matters to you.', ko: '필요해지기 전에 줄 확인하는 게 용기구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the mentor\'s rope advice.', ko: '스승의 말을 잘 간직했네.', delta: 1 },
        ],
        afterEn: 'Rowan: I thought it was boring then. Now I call it staying alive.',
        afterKo: '로완: 그땐 재미없다 생각했는데, 이젠 살아남기라 불러.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the mentor\'s rope advice with me.', ko: '줄부터 확인할게.', delta: 7 },
          { en: 'I\'ll be more mindful of the mentor\'s rope advice from now on.', ko: '지루해도 그게 용기인 거지.', delta: 3 },
          { en: 'That gives the mentor\'s rope advice a warmer meaning.', ko: '줄부터 확인하는 습관, 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_9',
        minStage: 0,
        npcEn: 'Rowan: Night watch is mostly listening to things that don\'t want to be heard.',
        npcKo: '로완: 밤 경계는 들키기 싫은 것들 소리 듣는 일이 대부분이야.',
        choices: [
          { en: 'That makes me see night watch in a different light.', ko: '듣는 게 밤 경계의 전부구나.', delta: 7 },
          { en: 'I can understand why night watch matters to you.', ko: '듣는 게 밤 경계의 핵심이구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at night watch.', ko: '듣기를 경계의 핵심으로 보는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Don\'t stare at darkness. Let it tell you what changed.',
        afterKo: '로완: 어둠만 노려보지 마. 뭐가 달라졌는지 말하게 둬.',
        afterChoices: [
          { en: 'I\'ll carry that thought about night watch with me.', ko: '더 귀 기울일게.', delta: 7 },
          { en: 'I\'ll be more mindful of night watch from now on.', ko: '어둠만 노려보지 않을게.', delta: 3 },
          { en: 'That gives night watch a warmer meaning.', ko: '뭐가 달라졌는지 귀부터 기울일게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_10',
        minStage: 0,
        npcEn: 'Rowan: Retire? Maybe when my knees stop predicting rain better than a cloud.',
        npcKo: '로완: 은퇴? 내 무릎이 구름보다 비를 못 맞힐 때쯤?',
        choices: [
          { en: 'That makes me see retirement in a different light.', ko: '무릎이 구름보다 낫다니, 은퇴는 아직이네.', delta: 7 },
          { en: 'I can understand why retirement matters to you.', ko: '무릎이 비를 맞히는 한은 아직이구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at retirement.', ko: '은퇴를 유쾌하게 넘기는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Until then, there are roads that need someone careful on them.',
        afterKo: '로완: 그전까진 조심스러운 누군가가 필요한 길이 있어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about retirement with me.', ko: '무릎이 비를 맞히는 한 같이 걷자.', delta: 7 },
          { en: 'I\'ll be more mindful of retirement from now on.', ko: '길 위에서도 더 조심할게.', delta: 3 },
          { en: 'That gives retirement a warmer meaning.', ko: '길 위에서도 더 조심히 걷게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_11',
        minStage: 0,
        npcEn: 'Rowan: That tooth on my cord belonged to a cave lizard. I didn\'t kill it; it shed it.',
        npcKo: '로완: 이 끈의 이빨은 동굴 도마뱀 거야. 내가 잡은 게 아니라 빠진 걸 주웠지.',
        choices: [
          { en: 'That makes me see the trophy tooth in a different light.', ko: '빠진 이빨도 이야기가 되는구나.', delta: 7 },
          { en: 'I can understand why the trophy tooth matters to you.', ko: '잡은 게 아니라 주운 이빨이라도 이야기구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at the trophy tooth.', ko: '전리품을 부드럽게 대하는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: A trophy doesn\'t need blood to carry a story.',
        afterKo: '로완: 기념품에 꼭 피가 묻어야 이야기가 생기는 건 아니야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about the trophy tooth with me.', ko: '피 없는 이야기도 챙길게.', delta: 7 },
          { en: 'I\'ll be more mindful of the trophy tooth from now on.', ko: '피 없는 기념품도 가볍게 안 볼게.', delta: 3 },
          { en: 'That gives the trophy tooth a warmer meaning.', ko: '그 이빨 이야기, 더 잘 기억할게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_12',
        minStage: 0,
        npcEn: 'Rowan: This map has a hole right where the bridge should be. Rude, but not impossible.',
        npcKo: '로완: 이 지도는 하필 다리 있을 자리에 구멍이 났어. 무례하지만 못 갈 건 아니지.',
        choices: [
          { en: 'That makes me see a hole in a map in a different light.', ko: '다리 자리에 구멍이라니, 재수 없네.', delta: 7 },
          { en: 'I can understand why a hole in a map matters to you.', ko: '다리 자리 구멍도 못 갈 이유는 아니지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a hole in a map.', ko: '지도를 유연하게 다루는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Paper fails. Land keeps answering if you look at it.',
        afterKo: '로완: 종이는 망가져도 땅은 보면 계속 답해 줘.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a hole in a map with me.', ko: '땅부터 볼게.', delta: 7 },
          { en: 'I\'ll be more mindful of a hole in a map from now on.', ko: '종이 구멍에 안 갇힐게.', delta: 3 },
          { en: 'That gives a hole in a map a warmer meaning.', ko: '지도가 망가져도 땅부터 볼게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_13',
        minStage: 1,
        npcEn: 'Rowan: I heard you helped a stranger on the road, {player}. Good. Roads remember that.',
        npcKo: '로완: {player}, 길에서 낯선 사람 도왔다며. 잘했어. 길은 그런 걸 기억해.',
        choices: [
          { en: 'That makes me see helping a traveler in a different light.', ko: '길이 친절을 기억한다니, 좋네.', delta: 7 },
          { en: 'I can understand why helping a traveler matters to you.', ko: '길이 친절을 기억한다는 말, 좋네.', delta: 3 },
          { en: 'You have a thoughtful way of looking at helping a traveler.', ko: '길이 친절을 기억한다는 말, 마음에 들어.', delta: 1 },
        ],
        afterEn: 'Rowan: Kindness travels farther than any caravan.',
        afterKo: '로완: 친절은 어떤 마차보다 멀리 가.',
        afterChoices: [
          { en: 'I\'ll carry that thought about helping a traveler with me.', ko: '길 위에서도 더 챙길게.', delta: 7 },
          { en: 'I\'ll be more mindful of helping a traveler from now on.', ko: '친절이 멀리 간다는 말, 마음에 들어.', delta: 3 },
          { en: 'That gives helping a traveler a warmer meaning.', ko: '길 위에서도 더 챙길게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_14',
        minStage: 1,
        npcEn: 'Rowan: I saved you a spot by the fire, {player}. Wind\'s mean on the other side.',
        npcKo: '로완: {player}, 불 옆자리 하나 남겨 뒀어. 반대쪽은 바람이 매섭거든.',
        choices: [
          { en: 'That makes me see a spot by the fire in a different light.', ko: '불 옆자리 남겨 줘서 고마워.', delta: 7 },
          { en: 'I can understand why a spot by the fire matters to you.', ko: '바람 센 쪽 피해서 자리 남긴 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a spot by the fire.', ko: '자리를 남겨 주는 마음이 다정하네.', delta: 1 },
        ],
        afterEn: 'Rowan: Warm up before you tell me where you\'ve been.',
        afterKo: '로완: 어디 갔었는지 말하기 전에 몸부터 녹여.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a spot by the fire with me.', ko: '몸부터 녹일게.', delta: 7 },
          { en: 'I\'ll be more mindful of a spot by the fire from now on.', ko: '불 옆자리, 고마워.', delta: 3 },
          { en: 'That gives a spot by the fire a warmer meaning.', ko: '불 옆자리, 잘 쓸게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_15',
        minStage: 1,
        npcEn: 'Rowan: {player}, don\'t apologize for needing rest. Even wolves sleep after a hunt.',
        npcKo: '로완: {player}, 쉬어야 한다고 미안해하지 마. 늑대도 사냥 뒤엔 자.',
        choices: [
          { en: 'That makes me see needing rest in a different light.', ko: '늑대도 자는데 내가 미안할 건 없지.', delta: 7 },
          { en: 'I can understand why needing rest matters to you.', ko: '늑대도 자는데 미안할 일 아니지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at needing rest.', ko: '휴식을 당연한 일로 보는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Rest is part of the route, not a wrong turn.',
        afterKo: '로완: 쉼도 길의 일부지, 길 잃은 게 아니야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about needing rest with me.', ko: '죄책감 없이 쉴게.', delta: 7 },
          { en: 'I\'ll be more mindful of needing rest from now on.', ko: '쉼도 길의 일부로 볼게.', delta: 3 },
          { en: 'That gives needing rest a warmer meaning.', ko: '죄책감 없이 쉴게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_16',
        minStage: 1,
        npcEn: 'Rowan: {player}, your stride is steadier lately. That\'s how training should look.',
        npcKo: '로완: {player}, 요즘 걸음이 더 단단해졌네. 훈련은 그렇게 보여야지.',
        choices: [
          { en: 'That makes me see steadier strides in a different light.', ko: '걸음이 단단해졌다니, 기분 좋네.', delta: 7 },
          { en: 'I can understand why steadier strides matters to you.', ko: '걸음이 단단해진 게 훈련의 증거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at steadier strides.', ko: '훈련을 발밑으로 재는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Big boasts are loud. Better footing is useful.',
        afterKo: '로완: 큰소린 시끄럽고, 발밑 단단한 건 쓸모 있어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about steadier strides with me.', ko: '발밑부터 챙길게.', delta: 7 },
          { en: 'I\'ll be more mindful of steadier strides from now on.', ko: '큰소리보다 걸음으로 보여 줄게.', delta: 3 },
          { en: 'That gives steadier strides a warmer meaning.', ko: '발밑부터 더 단단히 할게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_17',
        minStage: 2,
        npcEn: 'Rowan: A healer once stitched my shoulder while scolding my posture. I deserved both.',
        npcKo: '로완: 치료사가 내 어깨 꿰매면서 자세도 혼냈어. 둘 다 들을 만했지.',
        choices: [
          { en: 'That makes me see a healer\'s stitching in a different light.', ko: '꿰매면서 혼까지 났다니, 둘 다 들을 만했겠네.', delta: 7 },
          { en: 'I can understand why a healer\'s stitching matters to you.', ko: '꿰매면서 혼까지 들은 거, 둘 다 들을 만했지.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a healer\'s stitching.', ko: '그 가르침을 잘 받아들였네.', delta: 1 },
        ],
        afterEn: 'Rowan: She said pain is no excuse for making the next pain worse.',
        afterKo: '로완: 아프다고 다음 고통을 더 만들 핑계는 안 된댔어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a healer\'s stitching with me.', ko: '자세부터 고칠게.', delta: 7 },
          { en: 'I\'ll be more mindful of a healer\'s stitching from now on.', ko: '아프다고 다음을 망치지 않을게.', delta: 3 },
          { en: 'That gives a healer\'s stitching a warmer meaning.', ko: '자세부터 고치고 다닐게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_18',
        minStage: 2,
        npcEn: 'Rowan: I grew up above a net-maker\'s shop. Every morning smelled like hemp and tide.',
        npcKo: '로완: 난 그물 장수 가게 위에서 자랐어. 아침마다 삼베랑 밀물 냄새가 났지.',
        choices: [
          { en: 'That makes me see growing up by the net-maker in a different light.', ko: '삼베랑 밀물 냄새… 아침이 선하네.', delta: 7 },
          { en: 'I can understand why growing up by the net-maker matters to you.', ko: '삼베랑 밀물 냄새가 아침이었구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at growing up by the net-maker.', ko: '어릴 적 냄새를 소중히 간직했네.', delta: 1 },
        ],
        afterEn: 'Rowan: That smell still tells me work is about to begin.',
        afterKo: '로완: 그 냄새 맡으면 아직도 일이 시작되는 기분이야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about growing up by the net-maker with me.', ko: '그 아침 냄새, 더 상상해볼게.', delta: 7 },
          { en: 'I\'ll be more mindful of growing up by the net-maker from now on.', ko: '그 냄새가 일의 시작이구나.', delta: 3 },
          { en: 'That gives growing up by the net-maker a warmer meaning.', ko: '그 아침 냄새, 더 상상해볼게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_19',
        minStage: 2,
        npcEn: 'Rowan: I left home after a storm took our boat. Standing still felt worse than leaving.',
        npcKo: '로완: 폭풍에 배를 잃고 집을 떠났어. 가만히 있는 게 떠나는 것보다 더 힘들었지.',
        choices: [
          { en: 'That makes me see leaving home after a storm in a different light.', ko: '가만히 있는 게 더 힘들었구나.', delta: 7 },
          { en: 'I can understand why leaving home after a storm matters to you.', ko: '가만히 있는 게 떠나는 것보다 힘들었구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at leaving home after a storm.', ko: '슬픔을 담담하게 말하는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: The road didn\'t fix it, but it gave my grief somewhere to walk.',
        afterKo: '로완: 길이 고쳐 주진 않았지만 슬픔이 걸을 곳은 줬어.',
        afterChoices: [
          { en: 'I\'ll carry that thought about leaving home after a storm with me.', ko: '슬픔도 걸을 곳으로 볼게.', delta: 7 },
          { en: 'I\'ll be more mindful of leaving home after a storm from now on.', ko: '가만히보다 움직이는 게 나을 때도 있지.', delta: 3 },
          { en: 'That gives leaving home after a storm a warmer meaning.', ko: '가만히보다 움직이는 쪽을 택할게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_20',
        minStage: 2,
        npcEn: 'Rowan: The first friend I buried carried a flute, not a sword. I remember that most.',
        npcKo: '로완: 내가 처음 묻은 친구는 검이 아니라 피리를 들고 다녔어. 그게 제일 기억나.',
        choices: [
          { en: 'That makes me see a friend\'s flute in a different light.', ko: '피리 든 친구가 제일 기억난다니.', delta: 7 },
          { en: 'I can understand why a friend\'s flute matters to you.', ko: '피리 든 친구가 제일 남는구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a friend\'s flute.', ko: '용기를 넓게 보는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Courage has more than one sound.',
        afterKo: '로완: 용기엔 소리가 하나만 있는 게 아니야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a friend\'s flute with me.', ko: '다른 용기도 더 챙길게.', delta: 7 },
          { en: 'I\'ll be more mindful of a friend\'s flute from now on.', ko: '피리 든 용기도 기억할게.', delta: 3 },
          { en: 'That gives a friend\'s flute a warmer meaning.', ko: '피리 든 용기도 기억할게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_21',
        minStage: 3,
        npcEn: 'Rowan: I keep an extra blanket rolled for you, {player}. No argument.',
        npcKo: '로완: {player} 몫으로 여분 담요 말아 뒀어. 말다툼은 안 돼.',
        choices: [
          { en: 'That makes me see an extra blanket in a different light.', ko: '담요 말아 두고 말다툼 금지라니.', delta: 7 },
          { en: 'I can understand why an extra blanket matters to you.', ko: '말다툼 없이 담요부터 받으라는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at an extra blanket.', ko: '챙김이 단호하면서도 다정하네.', delta: 1 },
        ],
        afterEn: 'Rowan: Take it before you\'re cold enough to become stubborn.',
        afterKo: '로완: 고집 세질 만큼 추워지기 전에 가져.',
        afterChoices: [
          { en: 'I\'ll carry that thought about an extra blanket with me.', ko: '추워지기 전에 받을게.', delta: 7 },
          { en: 'I\'ll be more mindful of an extra blanket from now on.', ko: '말다툼 안 할게. 고마워.', delta: 3 },
          { en: 'That gives an extra blanket a warmer meaning.', ko: '추워지기 전에 받을게. 고마워.', delta: 1 },
        ],
      },
      {
        id: 'rowan_22',
        minStage: 3,
        npcEn: 'Rowan: When I picture a safe camp now, {player}, you\'re there before the fire is lit.',
        npcKo: '로완: 이젠 안전한 야영지를 떠올리면, {player}, 불 피우기도 전에 네가 있어.',
        choices: [
          { en: 'That makes me see a safe camp in a different light.', ko: '불 피우기 전에 내가 있다니… 고마워.', delta: 7 },
          { en: 'I can understand why a safe camp matters to you.', ko: '불 피우기 전에 내가 떠오른다는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at a safe camp.', ko: '야영지를 소중히 그리는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: Guess that means I\'ve found a place to return to.',
        afterKo: '로완: 그럼 내가 돌아올 곳을 찾은 거겠지.',
        afterChoices: [
          { en: 'I\'ll carry that thought about a safe camp with me.', ko: '더 자주 불 옆에 있을게.', delta: 7 },
          { en: 'I\'ll be more mindful of a safe camp from now on.', ko: '돌아올 곳이 되어 줘서 고마워.', delta: 3 },
          { en: 'That gives a safe camp a warmer meaning.', ko: '더 자주 불 옆에 있을게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_23',
        minStage: 3,
        npcEn: 'Rowan: {player}, if I ever rush ahead, call me back. I don\'t want to leave you behind.',
        npcKo: '로완: {player}, 내가 앞서가면 불러 세워. 널 뒤에 두고 싶지 않아.',
        choices: [
          { en: 'That makes me see not leaving friends behind in a different light.', ko: '앞서가면 불러 세울게.', delta: 7 },
          { en: 'I can understand why not leaving friends behind matters to you.', ko: '앞서가면 불러 세우라는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at not leaving friends behind.', ko: '동행을 진지하게 생각하는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: The best journeys are measured by who arrives together.',
        afterKo: '로완: 제일 좋은 여정은 누가 같이 도착했는지로 재는 거야.',
        afterChoices: [
          { en: 'I\'ll carry that thought about not leaving friends behind with me.', ko: '꼭 불러 세울게.', delta: 7 },
          { en: 'I\'ll be more mindful of not leaving friends behind from now on.', ko: '같이 도착하는 걸로 재자.', delta: 3 },
          { en: 'That gives not leaving friends behind a warmer meaning.', ko: '꼭 불러 세울게. 약속할게.', delta: 1 },
        ],
      },
      {
        id: 'rowan_24',
        minStage: 3,
        npcEn: 'Rowan: {player}, you don\'t have to earn your place beside me every day.',
        npcKo: '로완: {player}, 매일 내 곁에 있을 자리를 증명할 필요 없어.',
        choices: [
          { en: 'That makes me see belonging in a different light.', ko: '매일 증명할 필요 없다니, 마음이 놓이네.', delta: 7 },
          { en: 'I can understand why belonging matters to you.', ko: '매일 자리를 증명할 필요 없다는 거구나.', delta: 3 },
          { en: 'You have a thoughtful way of looking at belonging.', ko: '자리를 편안하게 열어 주는구나.', delta: 1 },
        ],
        afterEn: 'Rowan: You\'re here. That\'s the part I notice.',
        afterKo: '로완: 네가 여기 있잖아. 난 그걸 봐.',
        afterChoices: [
          { en: 'I\'ll carry that thought about belonging with me.', ko: '더 편하게 곁에 있을게.', delta: 7 },
          { en: 'I\'ll be more mindful of belonging from now on.', ko: '매일 증명 안 할게.', delta: 3 },
          { en: 'That gives belonging a warmer meaning.', ko: '여기 있어도 된다는 말, 고마워.', delta: 1 },
        ],
      },
    ],
  },
  lila: {
    id: 'lila',
    name: 'lila',
    titleEn: 'bard',
    titleKo: '음유시인',
    aliases: ['릴라', '시인'],
    gifts: [
      { stage: 1, itemId: 'mp_potion_m', qty: 2 },
      { stage: 2, itemId: 'wood_necklace', qty: 1 },
      { stage: 3, itemId: 'siren_charm', qty: 1 },
    ],
    dialogues: [
      {
        id: 'lila_1',
        minStage: 0,
        npcEn: 'Lila: A sparrow kept repeating my melody. Rude little critic—or fan?',
        npcKo: '릴라: 참새가 제 가락을 자꾸 따라했어요. 건방진 꼬마 평론가일까요, 아니면 애청자일까요?',
        choices: [
          { en: 'Fan. Critics don\'t learn the tune.', ko: '애청자요. 평론가는 곡을 외우지 않거든요.', delta: 8 },
          { en: 'Maybe it\'s joining the chorus.', ko: '합창에 끼려는 걸지도요.', delta: 3 },
          { en: 'Nature reviews live.', ko: '자연이 직접 품평하는 셈이네요.', delta: 1 },
        ],
        afterEn: 'Lila: Then I owe the sparrow a duet credit. Fancy billing: Lila & Beak.',
        afterKo: '릴라: 그럼 참새한테 이중창 이름을 올려 줘야겠네요. 간판은… 「릴라와 부리」.',
        afterChoices: [
          { en: 'I\'ll clap for both of you.', ko: '둘 다에게 박수 보낼게요.', delta: 7 },
          { en: 'Put Beak first for humility.', ko: '겸손하게 부리를 앞에 두세요.', delta: 3 },
          { en: 'Cute band name.', ko: '귀여운 악단 이름이에요.', delta: 1 },
        ],
      },
      {
        id: 'lila_2',
        minStage: 0,
        npcEn: 'Lila: Applause or coins—which feeds a bard longer, do you think?',
        npcKo: '릴라: 박수와 동전—음유시인을 더 오래 먹여 살리는 쪽은 뭘까요?',
        choices: [
          { en: 'Applause fills the night; coins the morning.', ko: '박수는 밤을, 동전은 아침을 채워 줘요.', delta: 7 },
          { en: 'Coins, practically speaking.', ko: '실용적으로는 동전이요.', delta: 2 },
          { en: 'Hard question.', ko: '어려운 질문이네요.', delta: 1 },
        ],
        afterEn: 'Lila: I live on both and starve on neither when the square is kind.',
        afterKo: '릴라: 둘 다로 살아요. 광장이 다정하면 어느 쪽으로도 굶지 않죠.',
        afterChoices: [
          { en: 'Then tonight, take my applause first.', ko: '그럼 오늘 밤, 제 박수부터 받으세요.', delta: 8 },
          { en: 'I\'ll drop a coin after the set.', ko: '노래 끝나면 동전 하나 넣을게요.', delta: 3 },
          { en: 'Kind squares are rare.', ko: '다정한 광장은 드물죠.', delta: 1 },
        ],
      },
      {
        id: 'lila_3',
        minStage: 0,
        npcEn: 'Lila: Be honest—does this love ballad sound sweet, or sticky-sweet?',
        npcKo: '릴라: 솔직히요—이 사랑노래, 달콤한 거예요, 아니면 달달해서 끈적한 거예요?',
        choices: [
          { en: 'Sweet. The last line lands softly.', ko: '달콤해요. 마지막 줄이 부드럽게 남아요.', delta: 7 },
          { en: 'A bit sticky—trim one adjective.', ko: '살짝 끈적해요—형용사 하나만 빼 보세요.', delta: 4 },
          { en: 'I\'m not much of a critic.', ko: '전 평론가가 아니라서요.', delta: 1 },
        ],
        afterEn: 'Lila: Sticky is the enemy of sincere. I\'ll cut the lace. Thank you.',
        afterKo: '릴라: 끈적은 진심의 적이에요. 장식은 잘라 버릴게요. 고마워요.',
        afterChoices: [
          { en: 'Keep the sincerity. That\'s the heart.', ko: '진심만 남기세요. 그게 심장이에요.', delta: 7 },
          { en: 'Can I hear the trimmed version later?', ko: '나중에 다듬은 노래 들을 수 있을까요?', delta: 3 },
          { en: 'You\'re picky in a good way.', ko: '좋은 의미로 까다로우시네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_4',
        minStage: 0,
        npcEn: 'Lila: Humming again. Catch me if you can name the tune before I finish.',
        npcKo: '릴라: 또 콧노래예요. 끝내기 전에 곡 이름 맞혀 봐요.',
        choices: [
          { en: 'Something with rain in it… am I close?', ko: '비 들어가는 곡… 가깝나요?', delta: 7 },
          { en: 'I need a bigger hint.', ko: '힌트가 더 필요해요.', delta: 3 },
          { en: 'I give up—teach me.', ko: '포기해요—알려 주세요.', delta: 1 },
        ],
        afterEn: 'Lila: Rain on the market awnings. Close enough to earn a free verse.',
        afterKo: '릴라: 시장 차양에 떨어지는 비. 무료 한 절을 받을 만큼 가까워요.',
        afterChoices: [
          { en: 'I\'ll take that free verse gladly.', ko: '무료 한 절, 기쁘게 받을게요.', delta: 8 },
          { en: 'Sing it once more, slower.', ko: '한 번 더, 느리게 불러 주세요.', delta: 3 },
          { en: 'Nice little game.', ko: '재밌는 놀이네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_5',
        minStage: 0,
        npcEn: 'Lila: My best audience today was a cat. It didn\'t tip, but it didn\'t leave.',
        npcKo: '릴라: 오늘 최고 관객은 고양이였어요. 동전은 안 넣었지만, 자리도 안 떴죠.',
        choices: [
          { en: 'Loyalty beats coins sometimes.', ko: '가끔은 충성이 동전을 이기고요.', delta: 7 },
          { en: 'What song kept it sitting?', ko: '어떤 노래에 앉아 있었어요?', delta: 3 },
          { en: 'Cats have taste.', ko: '고양이도 귀가 있네요.', delta: 1 },
        ],
        afterEn: 'Lila: A lullaby without words. Just open strings. Even I almost dozed.',
        afterKo: '릴라: 가사 없는 자장가. 열린 현만. 저조차 거의 졸았어요.',
        afterChoices: [
          { en: 'Play a bar? Softly is fine.', ko: '한 마디만? 작게도 괜찮아요.', delta: 7 },
          { en: 'That\'s a rare kind of quiet.', ko: '드문 종류의 고요네요.', delta: 3 },
          { en: 'Lucky cat.', ko: '운 좋은 고양이예요.', delta: 1 },
        ],
      },
      {
        id: 'lila_6',
        minStage: 0,
        npcEn: 'Lila: My tip cap is shy today. It stares at boots instead of singing.',
        npcKo: '릴라: 오늘 동전 모자가 수줍어요. 노래 대신 구두만 바라보죠.',
        choices: [
          { en: 'A shy cap still deserves a soft coin.', ko: '수줍은 모자에도 가벼운 동전은 어울려요.', delta: 7 },
          { en: 'Maybe the song needs a brighter open.', ko: '시작을 더 밝게 해 볼까요?', delta: 3 },
          { en: 'Caps have off days too.', ko: '모자도 쉬는 날이 있죠.', delta: 1 },
        ],
        afterEn: 'Lila: Bright open it is—and if you toss something, I swear I won\'t look greedy.',
        afterKo: '릴라: 밝은 시작으로 갈게요—그리고 뭔가 넣으셔도, 욕심 부리는 표정은 안 지을게요. 맹세해요.',
        afterChoices: [
          { en: 'For the craft, not the greed.', ko: '욕심이 아니라 솜씨를 위해서요.', delta: 8 },
          { en: 'After the brighter verse, then.', ko: '밝은 절 다음에요.', delta: 3 },
          { en: 'I\'ll listen either way.', ko: '어느 쪽이든 들을게요.', delta: 1 },
        ],
      },
      {
        id: 'lila_7',
        minStage: 0,
        npcEn: 'Lila: Practicing a whispered chorus so only the front row hears the secret words.',
        npcKo: '릴라: 앞줄만 비밀 가사를 듣도록, 속삭이는 후렴 연습 중이에요.',
        choices: [
          { en: 'Secrets make people lean in. Brilliant.', ko: '비밀은 사람을 기울이게 해요. 훌륭해요.', delta: 8 },
          { en: 'What if I stand in the front row?', ko: '앞줄에 서면요?', delta: 3 },
          { en: 'Intimate concerts feel special.', ko: '가까운 공연은 특별하죠.', delta: 1 },
        ],
        afterEn: 'Lila: Then you\'ll owe me silence about the twist ending.',
        afterKo: '릴라: 그럼 반전 결말에 대해선 침묵을 빚지는 거예요.',
        afterChoices: [
          { en: 'Lips sealed. Ears open.', ko: '입은 닫고, 귀는 열어요.', delta: 7 },
          { en: 'I\'ll only hum along, not spoil.', ko: '결말 흘리지 않고 흥얼만 할게요.', delta: 3 },
          { en: 'Honor among listeners.', ko: '청중끼리의 예의죠.', delta: 1 },
        ],
      },
      {
        id: 'lila_8',
        minStage: 0,
        npcEn: 'Lila: Rain on the roof is better percussion than half the drummers I know.',
        npcKo: '릴라: 지붕 비 소리는 제가 아는 북치는 사람 절반보다 나은 타악기예요.',
        choices: [
          { en: 'Can you tap that rhythm with me?', ko: '그 리듬, 같이 두드려 볼래요?', delta: 7 },
          { en: 'Nature\'s free band.', ko: '자연의 공짜 악단이네요.', delta: 3 },
          { en: 'It\'s soothing.', ko: '편안하네요.', delta: 1 },
        ],
        afterEn: 'Lila: One-two… pause… one. Soft roof, loud heart. Want to add a clap?',
        afterKo: '릴라: 하나-둘… 쉼… 하나. 지붕은 부드럽고, 심장은 크게. 박수 하나 더할까요?',
        afterChoices: [
          { en: 'Clap on the pause—I\'ll follow.', ko: '쉼에 박수—맞출게요.', delta: 8 },
          { en: 'You lead; I\'ll keep time.', ko: '당신이 이끌고, 전 박자만 맞출게요.', delta: 3 },
          { en: 'Maybe just listen today.', ko: '오늘은 듣기만 할게요.', delta: 1 },
        ],
      },
      {
        id: 'lila_9',
        minStage: 0,
        npcEn: 'Lila: Stage fright still visits. Legs shake; mouth pretends it\'s dancing.',
        npcKo: '릴라: 무대 공포가 아직도 찾아와요. 다리는 떨고, 입은 춤추는 척하죠.',
        choices: [
          { en: 'Shake is energy. Aim it at the song.', ko: '떨림은 기운이에요. 노래로 보내요.', delta: 7 },
          { en: 'Who wouldn\'t be nervous up there?', ko: '무대 위에서 긴장 안 하는 사람이 있을까요?', delta: 3 },
          { en: 'You\'re braver than you feel.', ko: '느끼는 것보다 용감해요.', delta: 1 },
        ],
        afterEn: 'Lila: Say that again when I\'m mid-set and my hands forget the frets.',
        afterKo: '릴라: 연주 중에 손이 줄을 잊을 때, 그 말 다시 해 줘요.',
        afterChoices: [
          { en: 'I\'ll be in the crowd reminding you.', ko: '관중석에서 상기시켜 줄게요.', delta: 8 },
          { en: 'Point at me if you blank.', ko: '막히면 저를 가리키세요.', delta: 3 },
          { en: 'You\'ve got this.', ko: '잘할 수 있어요.', delta: 1 },
        ],
      },
      {
        id: 'lila_10',
        minStage: 0,
        npcEn: 'Lila: Street tip: smile at the second verse, not the first. Builds longing.',
        npcKo: '릴라: 길거리 비법—첫 절이 아니라 두 번째 절에서 웃어요. 그리움을 키우죠.',
        choices: [
          { en: 'That\'s stagecraft. Smart.', ko: '그게 무대 연출이네요. 똑똑해요.', delta: 7 },
          { en: 'Do you practice the smile?', ko: '그 미소도 연습해요?', delta: 3 },
          { en: 'I\'ll watch for it next time.', ko: '다음에 그걸 볼게요.', delta: 1 },
        ],
        afterEn: 'Lila: Of course I practice. Art is half rehearsal, half pretending it isn\'t.',
        afterKo: '릴라: 당연하죠. 예술은 반은 연습, 반은 연습 아닌 척.',
        afterChoices: [
          { en: 'The pretending is part of the magic.', ko: '그 아닌 척이 마법의 일부예요.', delta: 7 },
          { en: 'Show me the second-verse smile.', ko: '두 번째 절 미소 보여 주세요.', delta: 3 },
          { en: 'Hard work behind the fun.', ko: '재미 뒤에 노력이 있네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_11',
        minStage: 0,
        npcEn: 'Lila: Stuck naming a song. "Midnight Something." Something refuses to arrive.',
        npcKo: '릴라: 곡 이름 짓다가 막혔어요. 「자정의 무언가」. 그 무언가가 안 와요.',
        choices: [
          { en: '"Midnight Latch"—doors, secrets, clicks.', ko: '「자정 빗장」—문, 비밀, 찰칵.', delta: 7 },
          { en: '"Midnight Errand"?', ko: '「자정 심부름」?', delta: 3 },
          { en: 'Names are the hardest verse.', ko: '이름이 제일 어려운 절이에요.', delta: 1 },
        ],
        afterEn: 'Lila: Latch… yes. The chorus closes like a careful door. Thank you, collaborator.',
        afterKo: '릴라: 빗장… 좋아요. 후렴이 조심스러운 문처럼 닫히네요. 고마워요, 공동작업자.',
        afterChoices: [
          { en: 'Collaborator accepted. When\'s rehearsal?', ko: '공동작업자 수락. 연습은 언제?', delta: 8 },
          { en: 'Happy to name more orphans.', ko: '이름 없는 곡 더 맡아 줄게요.', delta: 3 },
          { en: 'Glad it clicked.', ko: '잘 맞아서 좋네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_12',
        minStage: 0,
        npcEn: 'Lila: Writing lyrics in the dirt with a stick. Temporary ink, permanent idea.',
        npcKo: '릴라: 막대기로 흙에 가사 쓰는 중이에요. 잉크는 잠깐, 생각은 오래.',
        choices: [
          { en: 'Read the dirt aloud before wind edits it.', ko: '바람이 고치기 전에 흙을 읽어 주세요.', delta: 7 },
          { en: 'Want me to copy it onto paper?', ko: '종이에 옮겨 적을까요?', delta: 3 },
          { en: 'Poetic workspace.', ko: '시적인 작업실이네요.', delta: 1 },
        ],
        afterEn: 'Lila: "Dust remembers what mouths forget…"——oh, accidental profundity.',
        afterKo: '릴라: 「먼지는 입이 잊은 걸 기억한다…」——아, 우연히 심오해졌네요.',
        afterChoices: [
          { en: 'Keep it. Accidents make the best lines.', ko: '남기세요. 우연이 최고의 구절을 만들어요.', delta: 8 },
          { en: 'Profound suits you.', ko: '심오함이 잘 어울려요.', delta: 2 },
          { en: 'Wind\'s coming—hurry.', ko: '바람 와요—서두르세요.', delta: 1 },
        ],
      },
      {
        id: 'lila_13',
        minStage: 1,
        npcEn: 'Lila: People clap for flash. You clap for feeling. I noticed, {player}.',
        npcKo: '릴라: 사람들은 번쩍임에 박수 쳐요. 당신은 마음에 쳐요. 봤어요, {player}.',
        choices: [
          { en: 'Feeling is the point of songs.', ko: '노래는 마음이잖아요.', delta: 8 },
          { en: 'You make it easy to feel.', ko: '느끼기 쉽게 불러 주니까요.', delta: 3 },
          { en: 'I didn\'t realize I was that obvious.', ko: '그렇게 티 났는지 몰랐어요.', delta: 1 },
        ],
        afterEn: 'Lila: Be obvious. Artists starve without honest ears.',
        afterKo: '릴라: 티 내도 돼요. 정직한 귀 없으면 예술가는 굶거든요.',
        afterChoices: [
          { en: 'Then my ears are on payroll.', ko: '그럼 제 귀는 일하러 온 셈이네요.', delta: 7 },
          { en: 'I\'ll keep showing up.', ko: '계속 나타날게요.', delta: 3 },
          { en: 'Honest ears, promised.', ko: '정직한 귀, 약속해요.', delta: 1 },
        ],
      },
      {
        id: 'lila_14',
        minStage: 1,
        npcEn: 'Lila: Someone said my songs are "pretty but light." {player}, do I sound light to you?',
        npcKo: '릴라: 누가 제 노래가 「예쁘지만 가볍다」고 했어요. {player}, 저한테 가볍게 들려요?',
        choices: [
          { en: 'Light can carry far. Don\'t shrink.', ko: '가벼운 것이 멀리 가기도 해요. 움츠리지 마세요.', delta: 8 },
          { en: 'You have heavy songs too—I heard them.', ko: '무거운 노래도 있어요—들었어요.', delta: 3 },
          { en: 'Critics love simple labels.', ko: '평론가는 쉬운 꼬리표를 좋아하죠.', delta: 1 },
        ],
        afterEn: 'Lila: Then I\'ll write a pretty song with iron in its shoes. Watch me.',
        afterKo: '릴라: 그럼 구두에 쇠를 넣은 예쁜 노래를 쓸게요. 두고 봐요.',
        afterChoices: [
          { en: 'I\'ll be front row for the iron.', ko: '그 쇠 구두 노래, 앞줄에서 들을게요.', delta: 7 },
          { en: 'Iron and pretty—that\'s your blend.', ko: '쇠와 예쁨—그게 당신 배합이에요.', delta: 3 },
          { en: 'Excited already.', ko: '벌써 기대돼요.', delta: 1 },
        ],
      },
      {
        id: 'lila_15',
        minStage: 1,
        npcEn: 'Lila: {player}, help me choose: tragic ending or hopeful last line?',
        npcKo: '릴라: {player}, 골라 줘요. 비극으로 끝낼까요, 아니면 희망으로 마지막 줄을 닫을까요?',
        choices: [
          { en: 'Hopeful last line—after earning the dark.', ko: '희망으로 닫아요—어둠을 지나고 나서요.', delta: 7 },
          { en: 'Tragic, if the story truly needs it.', ko: '이야기에 정말 필요하면 비극으로요.', delta: 3 },
          { en: 'What\'s your gut say?', ko: '뱃속은 뭐래요?', delta: 1 },
        ],
        afterEn: 'Lila: Gut says hope with a scar. You push me toward light without lying.',
        afterKo: '릴라: 뱃속은 흉터 남은 희망을 말해요. 당신은 거짓말 없이 저를 빛 쪽으로 밀죠.',
        afterChoices: [
          { en: 'Scarred hope sings louder.', ko: '흉터 남은 희망이 더 크게 울려요.', delta: 8 },
          { en: 'Light that remembers night.', ko: '밤을 기억하는 빛.', delta: 3 },
          { en: 'Trust that gut.', ko: '그 직감을 믿어요.', delta: 1 },
        ],
      },
      {
        id: 'lila_16',
        minStage: 1,
        npcEn: 'Lila: {player}, if the town ever goes quiet, will you still ask me for a song?',
        npcKo: '릴라: {player}, 마을이 조용해져도 저한테 노래를 부탁할 건가요?',
        choices: [
          { en: 'Especially then. Quiet needs music.', ko: '그럴 때일수록요. 고요함엔 음악이 필요해요.', delta: 8 },
          { en: 'I\'d ask even softer.', ko: '더 작게 부탁할 거예요.', delta: 3 },
          { en: 'I hope the town stays lively.', ko: '마을이 활기차길 바라요.', delta: 1 },
        ],
        afterEn: 'Lila: Good. I write better when someone wants the next note.',
        afterKo: '릴라: 좋아요. 다음 음을 바라는 사람이 있을 때 더 잘 써요.',
        afterChoices: [
          { en: 'Then keep wanting—and I\'ll keep asking.', ko: '그럼 계속 바라세요—전 계속 부탁할게요.', delta: 7 },
          { en: 'Consider me your standing request.', ko: '늘 부탁하는 사람으로 생각해요.', delta: 3 },
          { en: 'That\'s sweet.', ko: '다정하네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_17',
        minStage: 2,
        npcEn: 'Lila: Festival judges once told me to "smile more." I smiled less for a month out of spite.',
        npcKo: '릴라: 축제 심사위원이 「더 웃으라」고 했어요. 심술로 한 달간 덜 웃었죠.',
        choices: [
          { en: 'Spite can be a compass. What did it teach you?', ko: '심술도 나침반이 될 수 있어요. 뭘 배웠나요?', delta: 7 },
          { en: 'Their note says more about them.', ko: '그 말은 그들 이야기를 더 해요.', delta: 3 },
          { en: 'Did you go back to smiling your way?', ko: '결국 자기 식대로 다시 웃게 됐나요?', delta: 1 },
        ],
        afterEn: 'Lila: I smile when the song asks—not when a clipboard asks. Lesson learned.',
        afterKo: '릴라: 노래가 원할 때 웃어요—서류판이 원할 때가 아니라. 교훈 얻었죠.',
        afterChoices: [
          { en: 'That\'s authentic stagecraft.', ko: '그게 진짜 무대 연출이에요.', delta: 8 },
          { en: 'Clipboard smiles are the worst kind.', ko: '서류판용 미소가 제일 싫죠.', delta: 3 },
          { en: 'Good lesson.', ko: '좋은 교훈이네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_18',
        minStage: 2,
        npcEn: 'Lila: I keep a notebook of unfinished lines. Most are bad. A few scare me because they\'re good.',
        npcKo: '릴라: 미완성 구절 공책이 있어요. 대부분 형편없죠. 몇몇은 좋아서 오히려 무서워요.',
        choices: [
          { en: 'Good lines deserve finishing—even if they scare.', ko: '좋은 구절은 완성할 가치가 있어요—무서워도.', delta: 8 },
          { en: 'Want to read one scary-good line aloud?', ko: '무섭게 좋은 구절 하나 읽어 볼래요?', delta: 3 },
          { en: 'Bad lines are compost for good ones.', ko: '나쁜 구절은 좋은 구절의 퇴비예요.', delta: 1 },
        ],
        afterEn: 'Lila: All right… "We borrow mornings from people we might leave." Too much?',
        afterKo: '릴라: 좋아요… 「우리는 떠날지도 모르는 사람에게서 아침을 빌린다.」 과한가요?',
        afterChoices: [
          { en: 'Not too much. Keep going from there.', ko: '과하지 않아요. 거기서 이어 가세요.', delta: 7 },
          { en: 'Heavy, but honest. I like it.', ko: '무겁지만 정직해요. 마음에 들어요.', delta: 3 },
          { en: 'It stays with me already.', ko: '벌써 남네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_19',
        minStage: 2,
        npcEn: 'Lila: {player}, I dreamed I lost my voice and had to talk only in rhythms. Woke up tapping the bed.',
        npcKo: '릴라: {player}, 목소리가 사라지고 리듬으로만 말하는 꿈을 꿨어요. 침대 두드리며 깼죠.',
        choices: [
          { en: 'Even then you\'d still be a bard.', ko: '그래도 당신은 음유시인이에요.', delta: 8 },
          { en: 'What rhythm were you tapping?', ko: '어떤 리듬을 두드렸어요?', delta: 3 },
          { en: 'Scary dream for a singer.', ko: '가수에겐 무서운 꿈이네요.', delta: 1 },
        ],
        afterEn: 'Lila: A heartbeat with a syncopated joke in it. Classic me, even asleep.',
        afterKo: '릴라: 농담이 섞인 심장박동. 잠든 척해도 저답네요.',
        afterChoices: [
          { en: 'I\'d clap along to that heartbeat.', ko: '그 심장박동에 박수 맞출게요.', delta: 7 },
          { en: 'Write the dream into a piece.', ko: '그 꿈을 곡으로 쓰세요.', delta: 3 },
          { en: 'Funny even in fear.', ko: '무서워도 웃기네요.', delta: 1 },
        ],
      },
      {
        id: 'lila_20',
        minStage: 2,
        npcEn: 'Lila: {player}, do you think songs can apologize better than spoken words?',
        npcKo: '릴라: {player}, 노래가 말보다 사과를 잘할 수 있다고 생각해요?',
        choices: [
          { en: 'Sometimes. Melody holds what pride won\'t say.', ko: '가끔요. 가락이 자존심이 못 하는 말을 붙잡아요.', delta: 8 },
          { en: 'Depends who you\'re apologizing to.', ko: '누구에게 사과하느냐에 달렸죠.', delta: 3 },
          { en: 'Both matter.', ko: '둘 다 중요해요.', delta: 1 },
        ],
        afterEn: 'Lila: I owe someone a song-apology. Not ready to play it yet—but it\'s written.',
        afterKo: '릴라: 노래로 사과할 사람이 있어요. 아직 칠 준비는 안 됐지만—써 두었어요.',
        afterChoices: [
          { en: 'When you\'re ready, that bravery will show.', ko: '준비되면 그 용기가 드러날 거예요.', delta: 7 },
          { en: 'Writing it already counts for something.', ko: '쓴 것만으로도 의미가 있어요.', delta: 3 },
          { en: 'I\'ll listen if you ever need an ear.', ko: '귀 필요하면 들어 줄게요.', delta: 1 },
        ],
      },
      {
        id: 'lila_21',
        minStage: 3,
        npcEn: 'Lila: Bad nights still happen. On those, will you sit through a wrong note without flinching?',
        npcKo: '릴라: 나쁜 밤은 아직도 와요. 그때 틀린 음을 움찔하지 않고 들어 줄래요?',
        choices: [
          { en: 'Wrong notes included. I\'m not leaving.', ko: '틀린 음 포함. 안 떠나요.', delta: 8 },
          { en: 'I\'ll flinch only if you want company in it.', ko: '같이 움찔하고 싶을 때만 움찔할게요.', delta: 3 },
          { en: 'We\'ll get through the set.', ko: '공연을 같이 넘을게요.', delta: 1 },
        ],
        afterEn: 'Lila: That answer is better than any review I\'ve ever gotten.',
        afterKo: '릴라: 그 답이 제가 받은 어떤 평보다 나아요.',
        afterChoices: [
          { en: 'Then keep collecting my answers.', ko: '그럼 제 답을 계속 모아 두세요.', delta: 7 },
          { en: 'Reviews don\'t know you like I do.', ko: '평은 저만큼 당신을 몰라요.', delta: 4 },
          { en: 'Anytime.', ko: '언제든요.', delta: 1 },
        ],
      },
      {
        id: 'lila_22',
        minStage: 3,
        npcEn: 'Lila: Most people get my jokes. You get the quiet underneath. That\'s rarer, {player}.',
        npcKo: '릴라: 대부분은 제 농담을 알아요. 당신은 그 아래 고요함을 알아요. 그게 더 드물어요, {player}.',
        choices: [
          { en: 'I listen for both on purpose.', ko: '둘 다 일부러 들어요.', delta: 8 },
          { en: 'The quiet is where you live, I think.', ko: '고요함이 당신이 사는 곳 같아요.', delta: 3 },
          { en: 'I try.', ko: '노력해요.', delta: 1 },
        ],
        afterEn: 'Lila: Then let me be quiet with you without filling it. Can we?',
        afterKo: '릴라: 그럼 빈칸을 채우지 않고, 같이 조용해질 수 있을까요?',
        afterChoices: [
          { en: 'We can. Silence is company too.', ko: '가능해요. 침묵도 동행이에요.', delta: 7 },
          { en: 'Only if you promise not to apologize for it.', ko: '침묵에 사과하지 않겠다고 약속하면요.', delta: 4 },
          { en: 'Yes.', ko: '네.', delta: 1 },
        ],
      },
      {
        id: 'lila_23',
        minStage: 3,
        npcEn: 'Lila: {player}, I want to write our years into a long piece—not fame, just a map of nights.',
        npcKo: '릴라: {player}, 우리 세월을 긴 곡으로 쓰고 싶어요—명성이 아니라 밤들의 지도로.',
        choices: [
          { en: 'A map of nights. I\'ll walk every measure.', ko: '밤들의 지도. 모든 마디를 걸을게요.', delta: 8 },
          { en: 'Start with the first night we talked music.', ko: '처음 음악 이야기한 밤부터 시작해요.', delta: 3 },
          { en: 'I\'d love that kind of archive.', ko: '그런 기록이면 좋겠어요.', delta: 1 },
        ],
        afterEn: 'Lila: Then help me remember details I romanticize away. Be my honest footnote.',
        afterKo: '릴라: 그럼 제가 낭만화해서 지우는 세부를 기억해 줘요. 정직한 각주가 되어 줘요.',
        afterChoices: [
          { en: 'Footnote accepted. I\'ll keep the true dates.', ko: '각주 수락. 진짜 날짜 지킬게요.', delta: 7 },
          { en: 'Even the awkward verses.', ko: '어색한 절까지요.', delta: 3 },
          { en: 'I\'m good at details.', ko: '세부에 자신 있어요.', delta: 1 },
        ],
      },
      {
        id: 'lila_24',
        minStage: 3,
        npcEn: 'Lila: {player}, if I ever lose the plot mid-set, you\'re the person I\'d look for in the crowd.',
        npcKo: '릴라: {player}, 공연 중간에 길을 잃으면 관중석에서 찾을 사람이 당신이에요.',
        choices: [
          { en: 'I\'ll be easy to find. Always.', ko: '찾기 쉽게 있을게요. 언제나.', delta: 8 },
          { en: 'Wave once and I\'ll nod you home.', ko: '손 한 번 흔들면 고개로 안내할게요.', delta: 3 },
          { en: 'That means a lot.', ko: '큰 의미네요.', delta: 1 },
        ],
        afterEn: 'Lila: More than a cue—you\'re proof the song still has a listener who cares.',
        afterKo: '릴라: 신호 이상이에요—노래에 신경 쓰는 청자가 있다는 증거.',
        afterChoices: [
          { en: 'I care. Loudly and quietly.', ko: '신경 써요. 크게도, 작게도.', delta: 7 },
          { en: 'Then keep writing for us both.', ko: '우리 둘을 위해 계속 써 주세요.', delta: 3 },
          { en: 'I\'m not going anywhere.', ko: '어디 안 가요.', delta: 1 },
        ],
      },
    ],
  },
  kenji: {
    id: 'kenji',
    name: 'kenji',
    titleEn: 'apprentice smith',
    titleKo: '대장장이 견습',
    aliases: ['켄지', '대장장이'],
    gifts: [
      { stage: 1, itemId: 'hp_potion_s', qty: 2 },
      { stage: 2, itemId: 'leather_boots', qty: 1 },
      { stage: 3, itemId: 'iron_blade', qty: 1 },
    ],
    dialogues: [
      {
        id: 'kenji_1',
        minStage: 0,
        npcEn: 'Kenji: Balancing a throwing knife. Tip-heavy feels brave; center-true hits more.',
        npcKo: '켄지: 투척칼 균형 잡는 중. 칼끝이 무거우면 용감해 보이고, 중심이 맞으면 더 맞혀.',
        choices: [
          { en: 'Center-true. Brave misses don\'t feed anyone.', ko: '중심이 맞아. 용감한 빗나감은 아무도 안 먹여.', delta: 8 },
          { en: 'Who\'s it for?', ko: '누구 거야?', delta: 3 },
          { en: 'Throwing knives are finicky.', ko: '투척칼은 까다롭지.', delta: 1 },
        ],
        afterEn: 'Kenji: Guard\'s cousin. Practice only—I\'d stamp not for showoffs if I could.',
        afterKo: '켄지: 경비 사촌 거야. 연습용—가능하면 허세 금지 각인 찍고 싶어.',
        afterChoices: [
          { en: 'Stamp the balance instead. That\'ll humble showoffs.', ko: '대신 균형을 찍어. 허세를 겸손하게 만들지.', delta: 7 },
          { en: 'Offer a short lesson with delivery?', ko: '건네줄 때 짧은 가르침도?', delta: 3 },
          { en: 'Good customer note.', ko: '손님한테 적을 만한 말이야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_2',
        minStage: 0,
        npcEn: 'Kenji: Coal dust in my teeth again. Glamorous trade, this.',
        npcKo: '켄지: 또 이에 석탄 가루야. 번쩍이는 직업이지, 이거.',
        choices: [
          { en: 'Glamour\'s overrated. Clean welds aren\'t.', ko: '번쩍임은 과대평가야. 깨끗한 용접은 아니지.', delta: 7 },
          { en: 'Rinse with something cold?', ko: '찬걸로 헹굴래?', delta: 3 },
          { en: 'Occupational badge of honor.', ko: '직업 훈장이네.', delta: 1 },
        ],
        afterEn: 'Kenji: Master spit coal for thirty years. I\'m at year two. Teeth still complaining.',
        afterKo: '켄지: 스승님은 삼십 년째 석탄을 뱉으셨대. 난 이 년차. 이는 아직 투덜거려.',
        afterChoices: [
          { en: 'Two years of sticking with it already shows.', ko: '이 년 버틴 게 벌써 보여.', delta: 8 },
          { en: 'Complaints and all, you\'re improving.', ko: '투덜대도 늘고 있어.', delta: 3 },
          { en: 'Respect.', ko: '인정.', delta: 1 },
        ],
      },
      {
        id: 'kenji_3',
        minStage: 0,
        npcEn: 'Kenji: Cool-down rack is full. Patience is part of smithing people forget.',
        npcKo: '켄지: 냉각 선반이 가득이야. 사람들이 잊는 대장장이 일—인내.',
        choices: [
          { en: 'Waiting without poking is a skill. I\'ll wait with you.', ko: '만지작거리지 않고 기다리기, 그것도 기술이야. 같이 기다릴게.', delta: 8 },
          { en: 'Anything we can prep while it cools?', ko: '식는 동안 준비할 거 있어?', delta: 3 },
          { en: 'Hardest part sometimes.', ko: '가끔 제일 어렵지.', delta: 1 },
        ],
        afterEn: 'Kenji: Sweep, oil the vise, breathe. Poking early warps more than it teaches.',
        afterKo: '켄지: 쓸고, 바이스에 기름 치고, 숨쉬기. 일찍 만지면 배우기보다 휨만 늘려.',
        afterChoices: [
          { en: 'Prep work during cool-down—pro habit.', ko: '식히는 동안 준비—숙련의 습관이야.', delta: 7 },
          { en: 'I\'ll take the broom.', ko: '비는 내가 할게.', delta: 3 },
          { en: 'Makes sense.', ko: '타당해.', delta: 1 },
        ],
      },
      {
        id: 'kenji_4',
        minStage: 0,
        npcEn: 'Kenji: Edge is dull again. Customer said they only chopped kindling. Kindling made of rock, maybe.',
        npcKo: '켄지: 날이 또 무뎌졌어. 손님은 장작만 잘랐다고 했지. 돌 장작이었나.',
        choices: [
          { en: 'Show me the wear—rocks leave a mark.', ko: '닳은 데 보여줘—돌은 흔적을 남겨.', delta: 7 },
          { en: 'People underestimate what dulls a blade.', ko: '날을 무디게 하는 걸 얕보는 사람들이 있지.', delta: 3 },
          { en: 'Rough day at the grindstone?', ko: '숫돌 앞에서 힘든 하루야?', delta: 1 },
        ],
        afterEn: 'Kenji: See these chips? That\'s stone. I\'ll rebevel honest and charge honest.',
        afterKo: '켄지: 이 깨진 자리 보여? 돌이야. 날 다시 잡고, 값도 정직하게 받을게.',
        afterChoices: [
          { en: 'Honest work deserves honest pay.', ko: '정직한 일은 정직한 값을 받아 마땅해.', delta: 8 },
          { en: 'Want a hand holding the blade steady?', ko: '칼 잡아 주는 거 도울까?', delta: 3 },
          { en: 'Fair approach.', ko: '그게 공정하지.', delta: 1 },
        ],
      },
      {
        id: 'kenji_5',
        minStage: 0,
        npcEn: 'Kenji: Gloves have a hole. Master would say hands learn faster uncovered. Master likes scars.',
        npcKo: '켄지: 장갑에 구멍이야. 스승님은 맨손이 빨리 배운다실 거야. 흉터를 좋아하시거든.',
        choices: [
          { en: 'Patch the glove. Learning shouldn\'t mean careless burns.', ko: '기워. 배우려고 손을 태울 필요는 없어.', delta: 8 },
          { en: 'Where do you keep the spare leather?', ko: '여분 가죽은 어디 있어?', delta: 3 },
          { en: 'Scars teach, but not all lessons need repeating.', ko: '흉터도 가르치지만, 같은 수업은 한 번이면 돼.', delta: 1 },
        ],
        afterEn: 'Kenji: Yeah. Patching. Pain isn\'t a badge if it\'s just stupidity.',
        afterKo: '켄지: 응. 기운다. 멍청해서 아픈 건 훈장 아니야.',
        afterChoices: [
          { en: 'Smart call. Protect the hands that make the work.', ko: '잘 골랐어. 일하는 손을 지켜.', delta: 7 },
          { en: 'I\'ll hold while you stitch.', ko: '꿰매는 동안 잡아 줄게.', delta: 3 },
          { en: 'Good.', ko: '좋아.', delta: 1 },
        ],
      },
      {
        id: 'kenji_6',
        minStage: 0,
        npcEn: 'Kenji: If you ever bring bent gear, bring the story too. Helps me fix the cause, not just the symptom.',
        npcKo: '켄지: 휘어진 장비를 가져오면 사연도 같이 가져와. 증상만이 아니라 원인을 고치게.',
        choices: [
          { en: 'I\'ll do that. Cause matters as much as metal.', ko: '그럴게. 원인이 금속만큼 중요해.', delta: 8 },
          { en: 'What stories help most?', ko: '어떤 사연이 제일 도움이 돼?', delta: 3 },
          { en: 'Smart way to work.', ko: '그게 제대로 된 일 처리네.', delta: 1 },
        ],
        afterEn: 'Kenji: Hit a rock versus hit a helmet change the whole repair. Truth saves time.',
        afterKo: '켄지: 돌 맞음이랑 투구 맞음은 수리 전체가 달라져. 진실이 시간을 아끼지.',
        afterChoices: [
          { en: 'Truth at the forge counter. I\'ll remember.', ko: '대장간 창구의 진실. 기억할게.', delta: 7 },
          { en: 'I\'ll bring honest dents.', ko: '정직한 찌그러짐을 가져올게.', delta: 3 },
          { en: 'Good policy.', ko: '좋은 방침이야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_7',
        minStage: 0,
        npcEn: 'Kenji: Master says my hammer hand is eager and my tongs hand is shy. He\'s not wrong.',
        npcKo: '켄지: 스승님이 망치 손은 급하고 집게 손은 수줍대. 틀린 말은 아니야.',
        choices: [
          { en: 'Tongs decide the work. Give them patience.', ko: '집게가 일을 정해. 인내를 줘.', delta: 8 },
          { en: 'Eager isn\'t bad if you slow the last blows.', ko: '마지막 타격만 늦추면 급함도 나빠.', delta: 3 },
          { en: 'Masters notice everything.', ko: '스승은 다 보시는구나.', delta: 1 },
        ],
        afterEn: 'Kenji: I\'ll drill tongs drills until the shy hand stops apologizing.',
        afterKo: '켄지: 수줍은 손이 사과 안 할 때까지 집게 연습을 반복할 거야.',
        afterChoices: [
          { en: 'That discipline will show in the steel.', ko: '그 수련이 강철에 나타날 거야.', delta: 7 },
          { en: 'Want a count partner for the drills?', ko: '연습 세는 파트너 필요해?', delta: 3 },
          { en: 'You\'ll get there.', ko: '도착할 거야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_8',
        minStage: 0,
        npcEn: 'Kenji: Rivets look easy until the second one leans. Then the whole story tilts.',
        npcKo: '켄지: 징은 두 번째가 기울기 전엔 쉬워 보여. 그다음 이야기 전체가 기울지.',
        choices: [
          { en: 'Square the first; the rest forgive you.', ko: '첫 번째를 반듯하게; 나머지가 용서해 줘.', delta: 8 },
          { en: 'Want a second set of eyes on alignment?', ko: '정렬에 눈 하나 더 필요해?', delta: 3 },
          { en: 'Riveting teaches patience fast.', ko: '징 박기는 인내를 빨리 가르쳐.', delta: 1 },
        ],
        afterEn: 'Kenji: Watch this—tap, check, tap. No hero swings.',
        afterKo: '켄지: 봐—톡, 확인, 톡. 영웅 한 방은 없어.',
        afterChoices: [
          { en: 'That\'s the right cadence. Clean work.', ko: '그게 맞는 박자야. 깨끗한 일.', delta: 7 },
          { en: 'Hero swings ruin more than they fix.', ko: '영웅 한 방은 고치는 것보다 망가뜨려.', delta: 3 },
          { en: 'Looking straight already.', ko: '벌써 반듯해 보여.', delta: 1 },
        ],
      },
      {
        id: 'kenji_9',
        minStage: 0,
        npcEn: 'Kenji: Scrap pile looks like failure. Master calls it tuition. Still stings.',
        npcKo: '켄지: 고철 더미는 실패처럼 보여. 스승님은 수업료라셔. 그래도 따끔해.',
        choices: [
          { en: 'Tuition you can melt again is rare kindness.', ko: '다시 녹일 수 있는 수업료는 드문 친절이야.', delta: 7 },
          { en: 'Which piece taught you the most?', ko: '어떤 조각이 제일 많이 가르쳤어?', delta: 3 },
          { en: 'Stings mean you care.', ko: '따끔함은 신경을 쓴다는 뜻이야.', delta: 1 },
        ],
        afterEn: 'Kenji: This twisted nail. Rushed the draw. I keep it visible on purpose.',
        afterKo: '켄지: 이 비틀린 못. 뽑기를 서둘렀지. 일부러 눈에 보이게 둬.',
        afterChoices: [
          { en: 'Visible lessons beat forgotten mistakes.', ko: '보이는 교훈이 잊힌 실수보다 나아.', delta: 8 },
          { en: 'Respect for facing it.', ko: '마주하는 거, 존중해.', delta: 3 },
          { en: 'Hard teacher, that nail.', ko: '그 못, 엄한 선생이네.', delta: 1 },
        ],
      },
      {
        id: 'kenji_10',
        minStage: 0,
        npcEn: 'Kenji: Sparks stuck to my sleeve again. Master says I stand too close to romance the work.',
        npcKo: '켄지: 또 소매에 불티야. 스승님은 일에 연애하듯 너무 가까이 선대.',
        choices: [
          { en: 'Respect the heat distance. Romance from a step back.', ko: '열과 거리 둬. 한 걸음 뒤에서 연애해.', delta: 7 },
          { en: 'Leather apron patched?', ko: '가죽 앞치마 기운 거야?', delta: 3 },
          { en: 'Close work is tempting.', ko: '가까이 붙고 싶지.', delta: 1 },
        ],
        afterEn: 'Kenji: Apron\'s fine. My feet need training more than my hands today.',
        afterKo: '켄지: 앞치마는 괜찮아. 오늘은 손보다 발이 연습이 필요해.',
        afterChoices: [
          { en: 'Footwork at the forge—smart focus.', ko: '대장간 발놀림—그게 오늘 숙제야.', delta: 8 },
          { en: 'Want me to call out if you drift in?', ko: '너무 붙으면 불러 줄까?', delta: 3 },
          { en: 'You\'ll adjust.', ko: '곧 익을 거야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_11',
        minStage: 0,
        npcEn: 'Kenji: Straightening a bent poker. Not glorious. Town still needs pokers.',
        npcKo: '켄지: 휘어진 부지깽이 펴는 중. 멋있진 않아. 마을엔 그래도 필요해.',
        choices: [
          { en: 'Useful beats glorious every day of the week.', ko: '쓸모가 멋보다 매일 이겨.', delta: 8 },
          { en: 'Need a second pair of hands on the vise?', ko: '바이스에 손 하나 더 필요해?', delta: 3 },
          { en: 'Honest work.', ko: '정직한 일이야.', delta: 1 },
        ],
        afterEn: 'Kenji: Hold here—steady. There. Straight enough to shame the fire.',
        afterKo: '켄지: 여기 잡아—고정. 됐다. 불이 창피해할 만큼 반듯해.',
        afterChoices: [
          { en: 'Clean save. Practical craft at its best.', ko: '깔끔하게 살렸네. 실용 솜씨의 정수야.', delta: 7 },
          { en: 'Fire should be ashamed.', ko: '불이 창피해해야지.', delta: 3 },
          { en: 'Looks good.', ko: '괜찮아 보여.', delta: 1 },
        ],
      },
      {
        id: 'kenji_12',
        minStage: 0,
        npcEn: 'Kenji: Town kids watch through the doorway. I wave them back from the scale spray.',
        npcKo: '켄지: 마을 아이들이 문간으로 봐. 쇳가루 튀는 데서 손을 흔들어 물러나게 해.',
        choices: [
          { en: 'Protecting them is part of the craft too.', ko: '아이들을 지키는 것도 솜씨의 일부야.', delta: 8 },
          { en: 'Maybe a chalk line on the floor as a border?', ko: '바닥에 분필선으로 경계?', delta: 3 },
          { en: 'Curious kids are future smiths.', ko: '호기심 많은 아이가 미래 장인이지.', delta: 1 },
        ],
        afterEn: 'Kenji: Chalk line\'s smart. Hot side / not side. I\'ll write it big.',
        afterKo: '켄지: 분필선 똑똑하다. 뜨거운 쪽 / 아닌 쪽. 크게 쓸게.',
        afterChoices: [
          { en: 'Clear boundaries teach respect for fire.', ko: '선 긋는 게 불을 존중하는 거지.', delta: 7 },
          { en: 'I can help letter it neat.', ko: '글씨 반듯하게 쓰는 거 도울게.', delta: 3 },
          { en: 'Good plan.', ko: '좋은 계획이야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_13',
        minStage: 1,
        npcEn: 'Kenji: Burned a fingertip yesterday. Didn\'t cry. Did swear. Quietly.',
        npcKo: '켄지: 어제 손끝 데었어. 울진 않았어. 욕은 했어. 작게.',
        choices: [
          { en: 'Quiet swears and cold water. You handled it.', ko: '작은 욕이랑 찬물. 잘 넘겼어.', delta: 7 },
          { en: 'How bad? Need a wrap?', ko: '얼마나 심해? 감싸야 해?', delta: 3 },
          { en: 'Burns teach fast.', ko: '화상은 빨리 가르쳐.', delta: 1 },
        ],
        afterEn: 'Kenji: Blister, small. I\'m keeping gloves on today without shame.',
        afterKo: '켄지: 물집, 작아. 오늘은 부끄러운 거 없이 장갑 낄게.',
        afterChoices: [
          { en: 'No shame in protecting the tools you need.', ko: '필요한 손을 지키는 데 부끄럼은 없어.', delta: 8 },
          { en: 'Smart. Healing is part of the schedule.', ko: '똑똑해. 회복도 일의 일부야.', delta: 3 },
          { en: 'Take it easy on that hand.', ko: '그 손 좀 쉬게 해.', delta: 1 },
        ],
      },
      {
        id: 'kenji_14',
        minStage: 1,
        npcEn: 'Kenji: You listen when I talk shop. Most folks glaze over. Means a lot, {player}.',
        npcKo: '켄지: 난 금속 얘기하면 네가 들어 줘. 대부분은 눈이 흐려져. 그게 커, {player}.',
        choices: [
          { en: 'Shop talk is how craft survives. I like learning.', ko: '공방 얘기가 솜씨를 살려. 배우는 거 좋아해.', delta: 8 },
          { en: 'Your explanations make it click.', ko: '네 설명이 이해가 되게 해.', delta: 3 },
          { en: 'I try.', ko: '노력해.', delta: 1 },
        ],
        afterEn: 'Kenji: Then ask me anything metal. I\'d rather share than show off.',
        afterKo: '켄지: 그럼 금속이면 뭐든 물어. 허세보다 나누는 게 나아.',
        afterChoices: [
          { en: 'What\'s one tip beginners skip too often?', ko: '초보가 너무 자주 건너뛰는 요령 하나?', delta: 7 },
          { en: 'Teach me to read heat color better.', ko: '열 색 읽는 법 더 알려 줘.', delta: 3 },
          { en: 'I\'ll keep asking.', ko: '계속 물을게.', delta: 1 },
        ],
      },
      {
        id: 'kenji_15',
        minStage: 1,
        npcEn: 'Kenji: {player}, Master praised my draw today. I tried not to grin like an idiot.',
        npcKo: '켄지: {player}, 오늘 스승님이 내 뽑기를 칭찬하셨어. 바보처럼 웃지 않으려고 했어.',
        choices: [
          { en: 'Grin. Earnest joy belongs at the forge.', ko: '웃어. 진심 어린 기쁨은 대장간에 어울려.', delta: 8 },
          { en: 'What did he praise exactly?', ko: '정확히 뭘 칭찬하셨어?', delta: 3 },
          { en: 'You earned it.', ko: '네가 쟁취한 거야.', delta: 1 },
        ],
        afterEn: 'Kenji: Said the taper didn\'t fight itself. First time those words landed on me.',
        afterKo: '켄지: 끝이 자기랑 안 싸운대. 그 말이 나한테 처음 닿았어.',
        afterChoices: [
          { en: 'Keep that feeling—and the discipline that made it.', ko: '그 기분 간직해—그리고 그걸 만든 수련도.', delta: 7 },
          { en: 'Write it down before you forget the day.', ko: '하루를 잊기 전에 적어 둬.', delta: 3 },
          { en: 'Proud of you.', ko: '자랑스러워.', delta: 1 },
        ],
      },
      {
        id: 'kenji_16',
        minStage: 1,
        npcEn: 'Kenji: {player}, be honest—does my shop talk sound like bragging?',
        npcKo: '켄지: {player}, 솔직히—내 공방 얘기가 자랑처럼 들리냐?',
        choices: [
          { en: 'Sounds like care. Bragging doesn\'t ask questions after.', ko: '정성처럼 들려. 자랑은 나중에 질문을 안 하거든.', delta: 8 },
          { en: 'A little proud, mostly earnest.', ko: '조금 자랑스럽고, 대부분 진지해.', delta: 3 },
          { en: 'I haven\'t taken it as bragging.', ko: '자랑으로 들은 적 없어.', delta: 1 },
        ],
        afterEn: 'Kenji: Good. Pride without care is slag. I try to skim that off.',
        afterKo: '켄지: 좋아. 정성 없는 자랑은 쇠찌꺼기야. 그걸 걷어 내려고 해.',
        afterChoices: [
          { en: 'You\'re skimming well. Keep going.', ko: '잘 걷어내고 있어. 계속해.', delta: 7 },
          { en: 'That metaphor alone proves you\'re a smith.', ko: '그 비유만으로도 대장장인 게 증명돼.', delta: 3 },
          { en: 'Understood.', ko: '알겠어.', delta: 1 },
        ],
      },
      {
        id: 'kenji_17',
        minStage: 2,
        npcEn: 'Kenji: I broke Master\'s rule once—worked alone past midnight. Fire almost got away from me.',
        npcKo: '켄지: 스승님 규칙을 한 번 깼어—자정 넘어 혼자 일했지. 불이 거의 달아났어.',
        choices: [
          { en: 'You\'re telling me because you learned. That matters.', ko: '배운 뒤에 말하는 거네. 그게 중요해.', delta: 8 },
          { en: 'What stopped it?', ko: '뭐가 막았어?', delta: 3 },
          { en: 'Midnight work is tempting.', ko: '자정 작업은 유혹되지.', delta: 1 },
        ],
        afterEn: 'Kenji: Sand bucket. Muscle memory from drills. I apologized at dawn. He nodded once.',
        afterKo: '켄지: 모래 양동이. 연습으로 생긴 손기억. 새벽에 사과했어. 한 번 끄덕이셨지.',
        afterChoices: [
          { en: 'That nod is trust rebuilt. Don\'t spend it cheap.', ko: '그 끄덕임은 다시 쌓은 신뢰야. 싸게 쓰지 마.', delta: 7 },
          { en: 'Drills save lives. Reminder taken.', ko: '연습이 생명을 구해. 기억할게.', delta: 3 },
          { en: 'Glad you\'re safe.', ko: '무사해서 다행이야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_18',
        minStage: 2,
        npcEn: 'Kenji: Master will retire someday. The thought lands like a cold billet in my gut.',
        npcKo: '켄지: 스승님이 언젠가 은퇴하실 거야. 그 생각이 배에 찬 쇠덩이처럼 떨어져.',
        choices: [
          { en: 'You\'ll be ready because you practice honesty now.', ko: '지금 정직을 연습하니까 그때 준비돼 있을 거야.', delta: 8 },
          { en: 'Has he talked about a timeline?', ko: '일정 얘기를 하셨어?', delta: 3 },
          { en: 'Cold billets wake you up. Sit with it.', ko: '찬 쇠덩이는 정신을 깨워. 그 기분과 앉아 있어.', delta: 1 },
        ],
        afterEn: 'Kenji: No timeline. Just… I\'m writing down his habits so I don\'t lose them.',
        afterKo: '켄지: 일정은 없어. 그냥… 습관을 적고 있어. 잃지 않으려고.',
        afterChoices: [
          { en: 'Writing habits is legacy work. Smart.', ko: '습관을 적는 게 유산 작업이야. 똑똑해.', delta: 7 },
          { en: 'I can help organize the notes.', ko: '노트 정리 도울게.', delta: 3 },
          { en: 'That\'s caring.', ko: '정성이네.', delta: 1 },
        ],
      },
      {
        id: 'kenji_19',
        minStage: 2,
        npcEn: 'Kenji: {player}, ever feel like your best work is still trapped in your hands, not out yet?',
        npcKo: '켄지: {player}, 최고의 작품이 아직 손 안에 갇혀 있고 밖으로 안 나온 느낌 들어 본 적 있어?',
        choices: [
          { en: 'All the time. That\'s the pull that keeps you forging.', ko: '늘. 그게 계속 단조하게 만드는 끌림이야.', delta: 8 },
          { en: 'What does the trapped work look like to you?', ko: '갇힌 작품은 네게 어떻게 보여?', delta: 3 },
          { en: 'Yes. Frustrating and hopeful.', ko: '응. 답답하고 희망차지.', delta: 1 },
        ],
        afterEn: 'Kenji: A balanced short sword that doesn\'t shout. Quiet useful. I chase it nightly.',
        afterKo: '켄지: 소리 지르지 않는 균형 잡힌 짧은 칼. 조용히 유용한. 매일 밤 쫓아.',
        afterChoices: [
          { en: 'Quiet useful is the highest praise. Chase on.', ko: '조용히 유용함이 최고 찬사야. 계속 쫓아.', delta: 7 },
          { en: 'When a blank starts toward that, show me.', ko: '그쪽으로 가는 날밑이 생기면 보여줘.', delta: 3 },
          { en: 'Worthy chase.', ko: '가치 있는 추적이야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_20',
        minStage: 2,
        npcEn: 'Kenji: {player}, when I mess up, don\'t soften it. Tell me straight. I can take straight.',
        npcKo: '켄지: {player}, 내가 실수하면 부드럽게 포장하지 마. 똑바로 말해. 난 바른 말을 견딜 수 있어.',
        choices: [
          { en: 'Straight it is—and I\'ll praise what\'s right too.', ko: '똑바로 할게—그리고 맞는 것도 칭찬할게.', delta: 8 },
          { en: 'Straight with care, not cruelty.', ko: '잔인함이 아니라 정성 있는 직설로.', delta: 3 },
          { en: 'I can do straight.', ko: '똑바로 할 수 있어.', delta: 1 },
        ],
        afterEn: 'Kenji: Care, not cruelty. Yeah. That\'s the alloy I want from you.',
        afterKo: '켄지: 정성, 잔인함 말고. 그래. 네가 줬으면 하는 합금이야.',
        afterChoices: [
          { en: 'Alloy locked in. Careful honesty.', ko: '합금 확정. 조심스러운 정직.', delta: 7 },
          { en: 'We forge feedback like steel then.', ko: '그럼 지적도 강철처럼 단조하자.', delta: 3 },
          { en: 'Deal.', ko: '거래 성사.', delta: 1 },
        ],
      },
      {
        id: 'kenji_21',
        minStage: 3,
        npcEn: 'Kenji: Last for now, {player}: thanks for treating my work like thought, not just noise and heat.',
        npcKo: '켄지: 지금은 이 말만, {player}. 내 일을 소음과 열이 아니라 생각으로 대해 줘서 고마워.',
        choices: [
          { en: 'Because it is thought—your hands translating care.', ko: '생각이니까. 네 손이 정성을 옮기는 거니까.', delta: 8 },
          { en: 'Noise and heat are just the cover art.', ko: '소음과 열은 겉표지일 뿐이야.', delta: 3 },
          { en: 'Always will.', ko: '언제나 그럴게.', delta: 1 },
        ],
        afterEn: 'Kenji: Go on. I\'ll be here shaping quiet useful things. Come back when you need true edges.',
        afterKo: '켄지: 가. 난 여기서 조용히 쓸모 있는 걸 다듬을게. 바른 날이 필요하면 돌아와.',
        afterChoices: [
          { en: 'I\'ll come back for true edges—and for you.', ko: '바른 날 때문에—그리고 너 때문에 돌아올게.', delta: 7 },
          { en: 'Save me a story from the next heat.', ko: '다음 불의 이야기 남겨 둬.', delta: 3 },
          { en: 'See you soon, Kenji.', ko: '또 보자, 켄지.', delta: 1 },
        ],
      },
      {
        id: 'kenji_22',
        minStage: 3,
        npcEn: 'Kenji: Promise me ordinary: if I forget to eat on long forge days, drag me to Mira\'s.',
        npcKo: '켄지: 평범한 약속 하나. 긴 단조 날에 밥 잊으면 미라네로 끌어가.',
        choices: [
          { en: 'Ordinary promise locked. Mira\'s, no debate.', ko: '평범한 약속 확정. 미라네, 말싸움 없이.', delta: 8 },
          { en: 'I\'ll pack you something too, just in case.', ko: '만약을 위해 도시락도 챙길게.', delta: 3 },
          { en: 'I can do that.', ko: '할 수 있어.', delta: 1 },
        ],
        afterEn: 'Kenji: Packing food is cheating in a good way. Allowed.',
        afterKo: '켄지: 미리 챙기는 건 좋은 반칙이야. 허용.',
        afterChoices: [
          { en: 'Cheating to keep the smith standing. Fair.', ko: '쓰러지지 않게 하는 반칙. 공정해.', delta: 7 },
          { en: 'Then expect bread in your apron pocket.', ko: '앞치마 주머니에 빵을 기대해도 돼.', delta: 3 },
          { en: 'Deal.', ko: '거래야.', delta: 1 },
        ],
      },
      {
        id: 'kenji_23',
        minStage: 3,
        npcEn: 'Kenji: {player}, bad forge days I want one person who won\'t say cheer up. Just stand nearby.',
        npcKo: '켄지: {player}, 대장간 나쁜 날엔 기운 내라는 말 안 하는 사람이 필요해. 그냥 옆에 서 주는.',
        choices: [
          { en: 'I\'ll stand nearby. No fake cheer.', ko: '옆에 설게. 가짜 응원 없이.', delta: 8 },
          { en: 'Quiet company, tools cool between us.', ko: '말없이 곁에. 사이엔 식는 공구.', delta: 3 },
          { en: 'I can do that.', ko: '그럴 수 있어.', delta: 1 },
        ],
        afterEn: 'Kenji: Today might be one. Stay for the cool-down rack filling up?',
        afterKo: '켄지: 오늘이 그럴지도. 냉각 선반 찰 때까지 있어 줄래?',
        afterChoices: [
          { en: 'I\'m here until the rack says done.', ko: '선반이 끝낼 때까지 여기 있어.', delta: 7 },
          { en: 'Sweeping while we wait?', ko: '기다리며 쓸까?', delta: 3 },
          { en: 'Not going anywhere.', ko: '어디 안 가.', delta: 1 },
        ],
      },
      {
        id: 'kenji_24',
        minStage: 3,
        npcEn: 'Kenji: {player}, stay after close? Just oiling tools. Quiet. You don\'t have to talk.',
        npcKo: '켄지: {player}, 문 닫고 남을래? 공구에 기름만 칠할 거야. 조용히. 말은 안 해도 돼.',
        choices: [
          { en: 'I\'ll stay. Quiet oiling sounds like home.', ko: '남을게. 조용한 기름칠이 집 같아.', delta: 8 },
          { en: 'Hand me a cloth.', ko: '천 하나 줘.', delta: 3 },
          { en: 'I\'d like that.', ko: '좋겠어.', delta: 1 },
        ],
        afterEn: 'Kenji: Here. Circular motions. Like polishing trust. Corny. True.',
        afterKo: '켄지: 여기. 원을 그리듯. 신뢰를 닦는 것처럼. 촌스러워. 진짜야.',
        afterChoices: [
          { en: 'Corny and true is fine steel.', ko: '촌스럽고 진짜인 게 좋은 강철이야.', delta: 7 },
          { en: 'Then we polish trust together.', ko: '그럼 같이 신뢰를 닦자.', delta: 3 },
          { en: 'I\'m comfortable with corny.', ko: '촌스러운 거 괜찮아.', delta: 1 },
        ],
      },
    ],
  },
  sena: {
    id: 'sena',
    name: 'sena',
    titleEn: 'herbalist',
    titleKo: '약초상',
    aliases: ['세나', '약초'],
    gifts: [
      { stage: 1, itemId: 'hp_potion_l', qty: 1 },
      { stage: 2, itemId: 'mp_potion_l', qty: 1 },
      { stage: 3, itemId: 'forest_cloak', qty: 1 },
    ],
    dialogues: [
      {
        id: 'sena_1',
        minStage: 0,
        npcEn: 'Sena: A bee found my drying rack. I moved slowly so it could leave on its own.',
        npcKo: '세나: 말리는 선반에 벌이 앉았어요. 스스로 떠나가게, 천천히 자리를 비워 줬죠.',
        choices: [
          { en: 'Gentle with bees, gentle with plants—same heart.', ko: '벌에게도 풀에게도, 같은 다정이네요.', delta: 7 },
          { en: 'Did it sting anything?', ko: '뭘 쏘진 않았나요?', delta: 3 },
          { en: 'Brave of you to stay calm.', ko: '그렇게 차분하신 게 대단해요.', delta: 1 },
        ],
        afterEn: 'Sena: Panic makes everything worse—patients, bees, even a boiling pot.',
        afterKo: '세나: 서두르면 다 나빠져요. 환자도, 벌도, 끓는 냄비도요.',
        afterChoices: [
          { en: 'Slow hands, clear head. I\'ll try that.', ko: '손도 천천히, 머리도 맑게. 그렇게 해볼게요.', delta: 7 },
          { en: 'Good philosophy for more than herbs.', ko: '약초뿐 아니라 어디에나 좋은 태도예요.', delta: 3 },
          { en: 'Noted.', ko: '마음에 새길게요.', delta: 1 },
        ],
      },
      {
        id: 'sena_2',
        minStage: 0,
        npcEn: 'Sena: A feverish child came at dawn. I sat with her until the tea cooled enough to sip.',
        npcKo: '세나: 새벽에 열이 난 아이가 왔어요. 차가 마실 만큼 식을 때까지 옆에 앉아 있었죠.',
        choices: [
          { en: 'Patience like that heals as much as herbs.', ko: '그 기다림이 약초만큼 낫게 해요.', delta: 8 },
          { en: 'Is she resting better now?', ko: '지금은 좀 편안한가요?', delta: 3 },
          { en: 'Dawn calls sound exhausting.', ko: '새벽 부름은 고될 것 같아요.', delta: 1 },
        ],
        afterEn: 'Sena: She squeezed my finger when the fever broke. Tiny, but it meant everything.',
        afterKo: '세나: 열이 내리자 제 손가락을 꼭 쥐더라고요. 작은 손인데… 그게 전부였어요.',
        afterChoices: [
          { en: 'You stayed. That mattered.', ko: '곁에 있어 준 게 중요했죠.', delta: 7 },
          { en: 'Kids know who cares for them.', ko: '아이들은 누가 챙겨 주는지 알아요.', delta: 3 },
          { en: 'I\'m glad she\'s okay.', ko: '괜찮아서 다행이에요.', delta: 1 },
        ],
      },
      {
        id: 'sena_3',
        minStage: 0,
        npcEn: 'Sena: An old logger came for joint oil. He apologized for \'wasting my time.\' Healing isn\'t waste.',
        npcKo: '세나: 늙은 벌목꾼이 관절 오일 받으러 왔어요. ‘시간 낭비시켜서’ 미안대죠. 치료는 낭비가 아니에요.',
        choices: [
          { en: 'You\'re right—asking for care isn\'t waste.', ko: '맞아요. 돌봄을 구하는 건 낭비가 아니에요.', delta: 8 },
          { en: 'Did the oil help him before?', ko: '예전에 그 오일이 도움됐나요?', delta: 3 },
          { en: 'Kind of him to worry, though.', ko: '그래도 걱정해 주는 마음은 착하네요.', delta: 1 },
        ],
        afterEn: 'Sena: I told him to sit, drink water, and stop apologizing until the rub soaked in.',
        afterKo: '세나: 앉아서 물 마시고, 오일이 스밀 때까지 사과는 그만하라고 했어요.',
        afterChoices: [
          { en: 'Care first, manners later. Soft and firm.', ko: '돌봄 먼저, 예절은 나중에. 다정하고 단호하네요.', delta: 7 },
          { en: 'He needed permission to rest.', ko: '쉴 허락이 필요했던 거네요.', delta: 3 },
          { en: 'Hope his joints ease.', ko: '관절이 편해지길 바라요.', delta: 1 },
        ],
      },
      {
        id: 'sena_4',
        minStage: 0,
        npcEn: 'Sena: Bruised basil smells wonderful—and means I handled it too hard. Soft wrists.',
        npcKo: '세나: 멍든 바질은 향이 좋은데… 너무 세게 만졌다는 뜻이에요. 손목을 부드럽게.',
        choices: [
          { en: 'Soft wrists. I\'ll handle leaves gently.', ko: '부드러운 손목. 잎 살살 다룰게요.', delta: 7 },
          { en: 'Does bruising ruin the medicine?', ko: '멍들면 약효가 망가져요?', delta: 3 },
          { en: 'I never noticed that trade-off.', ko: '그런 맞바꿈은 몰랐어요.', delta: 1 },
        ],
        afterEn: 'Sena: For tea, bruised is fine. For drying, it molds. Purpose decides the touch.',
        afterKo: '세나: 차로 쓸 땐 멍들어도 괜찮아요. 말릴 땐 곰팡이 나요. 용도가 손길을 정하죠.',
        afterChoices: [
          { en: 'Touch matches purpose. I\'ll ask first.', ko: '손길은 용도에 맞게. 먼저 물어볼게요.', delta: 7 },
          { en: 'Useful distinction.', ko: '유용한 구분이에요.', delta: 3 },
          { en: 'I\'ll remember for drying days.', ko: '말리는 날엔 기억할게요.', delta: 1 },
        ],
      },
      {
        id: 'sena_5',
        minStage: 0,
        npcEn: 'Sena: Grandmother\'s recipe uses river clay. I still walk down to dig it myself.',
        npcKo: '세나: 할머니 비법은 강 진흙을 써요. 지금도 직접 파러 강으로 내려가요.',
        choices: [
          { en: 'Fetching it yourself keeps the care intact.', ko: '직접 떠 오시는 게 정성을 지켜요.', delta: 7 },
          { en: 'What\'s the clay for?', ko: '진흙은 어디에 쓰나요?', delta: 3 },
          { en: 'That\'s a long walk with a bucket.', ko: '양동이 들고 꽤 멀겠어요.', delta: 1 },
        ],
        afterEn: 'Sena: Shop clay is too clean—no memory of water. River clay still smells like stones.',
        afterKo: '세나: 가게 진흙은 너무 깨끗해서… 물의 기억이 없어요. 강 진흙은 아직 돌 냄새가 나죠.',
        afterChoices: [
          { en: 'Memory in the material. I respect that.', ko: '재료에 기억이 있다니… 존중해요.', delta: 7 },
          { en: 'I\'d like to see the digging spot someday.', ko: '언젠가 파시는 곳 보고 싶어요.', delta: 3 },
          { en: 'Smells like stones—nice detail.', ko: '돌 냄새라니, 좋은 말씀이에요.', delta: 1 },
        ],
      },
      {
        id: 'sena_6',
        minStage: 0,
        npcEn: 'Sena: Mint and feverfew look alike when you\'re tired. I triple-check every label.',
        npcKo: '세나: 피곤하면 민트랑 개박하가 헷갈려요. 이름표는 세 번 확인해요.',
        choices: [
          { en: 'Careful labeling protects patients.', ko: '꼼꼼한 이름표가 환자를 지켜요.', delta: 7 },
          { en: 'What happens if they get swapped?', ko: '바꿔 쓰면 어떻게 돼요?', delta: 3 },
          { en: 'Sounds meticulous.', ko: '꼼꼼하시네요.', delta: 1 },
        ],
        afterEn: 'Sena: Wrong herb, wrong night\'s sleep—or worse. I won\'t risk anyone for speed.',
        afterKo: '세나: 잘못된 약초는 잠만 망치는 게 아니에요. 속도 때문에 누구 위험할 수는 없죠.',
        afterChoices: [
          { en: 'I\'d rather wait for the right jar.', ko: '맞는 병을 기다리는 편이 나아요.', delta: 7 },
          { en: 'Your caution is reassuring.', ko: '그 조심스러움이 안심돼요.', delta: 3 },
          { en: 'Understood.', ko: '알겠어요.', delta: 1 },
        ],
      },
      {
        id: 'sena_7',
        minStage: 0,
        npcEn: 'Sena: Moonflower opens only at night. I sit with a lantern turned low and wait.',
        npcKo: '세나: 달꽃은 밤에만 펴요. 등불을 낮추고 앉아서, 그냥 기다려요.',
        choices: [
          { en: 'Waiting with it sounds respectful.', ko: '같이 기다리는 게 존중처럼 들려요.', delta: 7 },
          { en: 'What do you harvest from it?', ko: '무엇을 거두세요?', delta: 3 },
          { en: 'Night gardening is dedication.', ko: '밤 정원 일은 참 정성이네요.', delta: 1 },
        ],
        afterEn: 'Sena: Petals for calm dreams—one flower per person, never a fistful.',
        afterKo: '세나: 꽃잎은 고요한 꿈을 위해. 사람마다 한 송이뿐, 한 움큼은 안 돼요.',
        afterChoices: [
          { en: 'One flower, one person. I\'ll honor that.', ko: '한 송이, 한 사람. 지킬게요.', delta: 7 },
          { en: 'Restraint suits rare blooms.', ko: '귀한 꽃엔 절제가 어울려요.', delta: 3 },
          { en: 'I won\'t pick any without you.', ko: '당신 없이 따진 않을게요.', delta: 1 },
        ],
      },
      {
        id: 'sena_8',
        minStage: 0,
        npcEn: 'Sena: Morning dew is best collected before the path gets muddy. Want to see the jars?',
        npcKo: '세나: 이슬은 길이 진창 되기 전에 받는 게 제일이에요. 병들, 보여드릴까요?',
        choices: [
          { en: 'I\'d love to see how you gather it.', ko: '어떻게 모으시는지 보고 싶어요.', delta: 7 },
          { en: 'What do you use dew for?', ko: '이슬은 어디에 쓰세요?', delta: 3 },
          { en: 'Maybe another time—boots are clean today.', ko: '다음에요. 오늘은 신발이 깨끗해서요.', delta: 1 },
        ],
        afterEn: 'Sena: Cool cloth, soft wipe, never squeeze the leaf. Dew should choose to fall.',
        afterKo: '세나: 차가운 천으로 살살요. 잎을 쥐어짜지 않아요. 이슬이 스스로 떨어지게.',
        afterChoices: [
          { en: 'Respect the plant. I get it.', ko: '풀을 존중하는 거군요. 이해해요.', delta: 8 },
          { en: 'That\'s almost like a ritual.', ko: '거의 의식 같네요.', delta: 3 },
          { en: 'Delicate work.', ko: '섬세한 일이네요.', delta: 1 },
        ],
      },
      {
        id: 'sena_9',
        minStage: 0,
        npcEn: 'Sena: Sleep tea needs quiet steeping. Talking over it makes me forget the count.',
        npcKo: '세나: 수면차는 조용히 우려야 해요. 떠들면 몇 분을 세다 잊어요.',
        choices: [
          { en: 'I\'ll stay quiet until it\'s ready.', ko: '다 될 때까지 조용히 있을게요.', delta: 7 },
          { en: 'How many minutes is the count?', ko: '몇 분 세세요?', delta: 3 },
          { en: 'I can wait outside.', ko: '밖에서 기다릴게요.', delta: 1 },
        ],
        afterEn: 'Sena: Seven soft breaths after the first steam. Then lid on. No peeking.',
        afterKo: '세나: 김이 오르면 숨 일곱 번. 그다음 뚜껑. 엿보면 안 돼요.',
        afterChoices: [
          { en: 'Seven breaths. No peeking. Got it.', ko: '숨 일곱. 엿보기 금지. 알겠어요.', delta: 7 },
          { en: 'That\'s a gentle timer.', ko: '부드러운 셈시계네요.', delta: 3 },
          { en: 'I\'ll trust your rhythm.', ko: '리듬을 믿을게요.', delta: 1 },
        ],
      },
      {
        id: 'sena_10',
        minStage: 0,
        npcEn: 'Sena: Spring water from the north spring only. Well water here tastes of iron—fine for soup, not for tincture.',
        npcKo: '세나: 북쪽 샘물만 써요. 여기 우물물은 쇠맛이 나서… 국엔 괜찮은데, 담근 약엔 안 돼요.',
        choices: [
          { en: 'Right water for the right medicine.', ko: '약에 맞는 물이 따로 있군요.', delta: 7 },
          { en: 'How far is the north spring?', ko: '북쪽 샘은 얼마나 멀어요?', delta: 3 },
          { en: 'I\'ll fetch some if you need.', ko: '필요하면 떠 올게요.', delta: 1 },
        ],
        afterEn: 'Sena: Half a morning\'s walk with full jugs. Worth every step when the tincture clears properly.',
        afterKo: '세나: 물병 가득 들고 반나절 길이에요. 약이 맑게 우러나면 그 걸음이 아깝지 않죠.',
        afterChoices: [
          { en: 'Care shows in the clear bottle.', ko: '맑은 병에 정성이 보여요.', delta: 7 },
          { en: 'I could share the walk sometime.', ko: '언젠가 같이 걸을 수도 있어요.', delta: 3 },
          { en: 'That\'s dedication.', ko: '그 정성, 대단해요.', delta: 1 },
        ],
      },
      {
        id: 'sena_11',
        minStage: 0,
        npcEn: 'Sena: That roadside \'healing weed\' is a lookalike. Swallow it and you\'ll see colors that aren\'t kindness.',
        npcKo: '세나: 길가 ‘만병통치 풀’은 닮은꼴이에요. 삼키면… 다정하지 않은 색깔이 보여요.',
        choices: [
          { en: 'I won\'t forage without asking you first.', ko: '당신한테 묻기 전엔 채집 안 할게요.', delta: 8 },
          { en: 'How do you tell them apart?', ko: '어떻게 구분하세요?', delta: 3 },
          { en: 'Thanks for the warning.', ko: '경고 고마워요.', delta: 1 },
        ],
        afterEn: 'Sena: Real one has soft serration; fake has teeth like a tiny saw. Touch, don\'t taste.',
        afterKo: '세나: 진짜는 가장자리가 부드럽고, 가짜는 작은 톱니 같아요. 만져 보고, 맛보진 마세요.',
        afterChoices: [
          { en: 'Touch, never taste. Clear rule.', ko: '만지고, 맛보지 않기. 명확한 규칙이에요.', delta: 7 },
          { en: 'I\'ll bring samples for you to check.', ko: '확인받으려고 표본 가져올게요.', delta: 3 },
          { en: 'Saw-teeth—got it.', ko: '톱니… 알겠어요.', delta: 1 },
        ],
      },
      {
        id: 'sena_12',
        minStage: 0,
        npcEn: 'Sena: This salve smells sharp. It\'s for scrapes—thin layer only, or it\'ll sting twice.',
        npcKo: '세나: 이 연고는 향이 써요. 긁힌 데 쓰는 건데, 얇게만 바르세요. 두꺼우면 따가움이 두 번 와요.',
        choices: [
          { en: 'Thin layer. I\'ll follow your dose.', ko: '얇게요. 말씀대로 바를게요.', delta: 7 },
          { en: 'Why does extra sting more?', ko: '많이 바르면 왜 더 따가워요?', delta: 3 },
          { en: 'I\'ll keep it for emergencies.', ko: '비상용으로 챙겨둘게요.', delta: 1 },
        ],
        afterEn: 'Sena: Herbs aren\'t louder when you pile them on. They\'re louder when you listen.',
        afterKo: '세나: 약초는 잔뜩 바른다고 더 세지지 않아요. 귀 기울일 때 더 잘 들어요.',
        afterChoices: [
          { en: 'Listening over force. Fair.', ko: '힘으로 누르지 않고 듣기. 맞아요.', delta: 7 },
          { en: 'I\'ll measure carefully.', ko: '양 조심할게요.', delta: 3 },
          { en: 'Thanks for the warning.', ko: '미리 알려 줘서 고마워요.', delta: 1 },
        ],
      },
      {
        id: 'sena_13',
        minStage: 1,
        npcEn: 'Sena: Night round with a sleeping tonic—{player}, walk with me? Soft steps only.',
        npcKo: '세나: 수면 보약 들고 밤 돌봄 가는데… {player}, 같이 걸을래요? 발소리만 작게요.',
        choices: [
          { en: 'Soft steps. I\'ll match your pace.', ko: '작은 발소리로요. 보조 맞출게요.', delta: 7 },
          { en: 'Who are we visiting?', ko: '누구 뵈러 가요?', delta: 3 },
          { en: 'I can carry the bottles.', ko: '병은 제가 들게요.', delta: 1 },
        ],
        afterEn: 'Sena: Old Mara by the mill. She startles easy—knock once, then wait.',
        afterKo: '세나: 방앗간 옆 마라 할머니예요. 잘 놀라세요. 노크는 한 번, 그다음엔 기다리기.',
        afterChoices: [
          { en: 'Knock once, wait. Patience at the door.', ko: '한 번 노크하고 기다림. 문앞의 인내죠.', delta: 8 },
          { en: 'I\'ll stay back until she answers.', ko: '대답하실 때까지 뒤로 물러있을게요.', delta: 3 },
          { en: 'Understood.', ko: '알겠어요.', delta: 1 },
        ],
      },
      {
        id: 'sena_14',
        minStage: 1,
        npcEn: 'Sena: {player}, sit. You\'ve been favoring your left shoulder. Heat wrap or rest first?',
        npcKo: '세나: {player}, 앉아요. 왼쪽 어깨를 아끼며 다니시네요. 온찜질이 먼저일까요, 휴식이 먼저일까요?',
        choices: [
          { en: 'Rest first—then whatever you advise.', ko: '휴식 먼저요. 그다음 말씀대로요.', delta: 7 },
          { en: 'Heat wrap, if it\'s not too much trouble.', ko: '온찜질… 너무 번거롭지 않다면요.', delta: 3 },
          { en: 'I hadn\'t noticed I was favoring it.', ko: '아기고 있는 줄 몰랐어요.', delta: 1 },
        ],
        afterEn: 'Sena: Rest without guilt. Bodies mend faster when no one argues with them.',
        afterKo: '세나: 죄책감 없이 쉬어요. 몸이랑 다투지 않을 때 더 빨리 나아져요.',
        afterChoices: [
          { en: 'No arguing with the body. I\'ll rest.', ko: '몸이랑 안 싸울게요. 쉴게요.', delta: 7 },
          { en: 'You notice what I ignore.', ko: '제가 넘기는 걸 보시네요.', delta: 3 },
          { en: 'Thank you for catching it.', ko: '알아차려 줘서 고마워요.', delta: 1 },
        ],
      },
      {
        id: 'sena_15',
        minStage: 1,
        npcEn: 'Sena: {player}, smell this crushed lemon balm—bright, not sour. Ready for calming bags.',
        npcKo: '세나: {player}, 이 레몬밤 향 맡아 보세요. 밝고, 시지 않아요. 진정 주머니에 넣을 준비됐어요.',
        choices: [
          { en: 'Bright and kind. Perfect for calm.', ko: '밝고 다정해요. 진정에 딱이네요.', delta: 7 },
          { en: 'How many leaves per bag?', ko: '주머니마다 잎은 몇 장이에요?', delta: 3 },
          { en: 'It smells like a clear morning.', ko: '맑은 아침 냄새예요.', delta: 1 },
        ],
        afterEn: 'Sena: Twelve leaves, one dried petal for scent memory, sewn loose so air moves.',
        afterKo: '세나: 잎 열두 장, 향을 기억하게 꽃잎 하나. 바람이 다니게 헐겁게 꿰매요.',
        afterChoices: [
          { en: 'Loose stitches for living scent. Nice.', ko: '숨 쉬는 향을 위한 헐거운 땀. 좋아요.', delta: 7 },
          { en: 'I can sew if you cut.', ko: '자르시면 제가 꿰맬게요.', delta: 3 },
          { en: 'Twelve and one—memorized.', ko: '열둘과 하나, 외웠어요.', delta: 1 },
        ],
      },
      {
        id: 'sena_16',
        minStage: 1,
        npcEn: 'Sena: {player}, the chamomile you helped hang dried evenly. No mold corners.',
        npcKo: '세나: {player}, 같이 널어 준 캐모마일이 고르게 말랐어요. 구석에 곰팡이도 없어요.',
        choices: [
          { en: 'Glad we gave each bundle air.', ko: '다발마다 바람길을 줘서 다행이에요.', delta: 7 },
          { en: 'Any ready for tea yet?', ko: '차로 쓸 만큼 됐어요?', delta: 3 },
          { en: 'Happy to hang more next week.', ko: '다음 주에도 널는 거 도울게요.', delta: 1 },
        ],
        afterEn: 'Sena: I\'ll brew a thank-you cup—mild, so it won\'t tug your sleep midday.',
        afterKo: '세나: 감사 차 한 잔 우리면… 낮에 졸리지 않게 연하게요.',
        afterChoices: [
          { en: 'Mild is perfect. Thank you for thinking of timing.', ko: '연한 게 딱이에요. 시간까지 생각하다니 고마워요.', delta: 7 },
          { en: 'I\'ll sip slowly.', ko: '천천히 마실게요.', delta: 3 },
          { en: 'You didn\'t have to, but thanks.', ko: '안 그러셔도 되는데, 고마워요.', delta: 1 },
        ],
      },
      {
        id: 'sena_17',
        minStage: 2,
        npcEn: 'Sena: I keep a blank book of failures, {player}. Wrong steeps, harsh doses I corrected in time.',
        npcKo: '세나: {player}, 실패만 적는 공책이 있어요. 잘못된 우리기, 제때 고친 거친 용량들.',
        choices: [
          { en: 'A failure book is courage, not shame.', ko: '실패 공책은 부끄러움이 아니라 용기예요.', delta: 8 },
          { en: 'Would you ever share a page to teach?', ko: '가르치려고 한 장 나누기도 하세요?', delta: 3 },
          { en: 'Most people hide those.', ko: '대부분은 숨기죠.', delta: 1 },
        ],
        afterEn: 'Sena: Someday an apprentice will need my mistakes more than my successes.',
        afterKo: '세나: 언젠가 견습생에겐 제 성공보다 그 실수들이 더 필요할 거예요.',
        afterChoices: [
          { en: 'I\'ll treat those pages as sacred if I ever read them.', ko: '읽게 되면 그 장을 소중히 대할게요.', delta: 7 },
          { en: 'You\'re already teaching by keeping them.', ko: '남겨 두는 것만으로도 가르침이에요.', delta: 3 },
          { en: 'Wise archive.', ko: '현명한 기록이에요.', delta: 1 },
        ],
      },
      {
        id: 'sena_18',
        minStage: 2,
        npcEn: 'Sena: The miller\'s wife brings honey every month. I undercharge her for cough syrup. Don\'t tell Bram.',
        npcKo: '세나: 방앗간 집사람이 달마다 꿀을 가져와요. 기침 시럽은 싸게 받아요. 브램한텐… 비밀이에요.',
        choices: [
          { en: 'Kind ledgers keep towns alive. Secret safe.', ko: '다정한 장부가 마을을 살려요. 비밀 지킬게요.', delta: 7 },
          { en: 'Honey for syrup—fair friendship trade.', ko: '꿀과 시럽… 공평한 우정 거래네요.', delta: 3 },
          { en: 'Bram would understand more than you think.', ko: '브램도 생각보다 이해할걸요.', delta: 1 },
        ],
        afterEn: 'Sena: Her youngest wheezes in damp weeks. Numbers shouldn\'t decide a child\'s breath.',
        afterKo: '세나: 막내가 축축한 주에 숨이 차요. 숨은 숫자로 정하면 안 돼요.',
        afterChoices: [
          { en: 'Breath over balance sheets. Always.', ko: '장부보다 숨. 언제나요.', delta: 8 },
          { en: 'I can drop syrup by if you\'re busy.', ko: '바쁘시면 시럽 가져다줄게요.', delta: 3 },
          { en: 'Your priorities are clear.', ko: '우선순위가 분명하네요.', delta: 1 },
        ],
      },
      {
        id: 'sena_19',
        minStage: 2,
        npcEn: 'Sena: {player}, stand here—morning light through thyme. This is why I stay in this town.',
        npcKo: '세나: {player}, 여기 서 봐요. 타임 사이로 아침빛이 들어요. 그래서 이 마을에 남는 거예요.',
        choices: [
          { en: 'Light, herbs, and people worth tending. I see it.', ko: '빛, 약초, 돌볼 사람. 보여요.', delta: 7 },
          { en: 'It smells like a beginning.', ko: '시작 같은 냄새예요.', delta: 3 },
          { en: 'Thank you for sharing the spot.', ko: '이 자리를 나눠 줘서 고마워요.', delta: 1 },
        ],
        afterEn: 'Sena: Adventurers chase horizons. I chase the next careful day. Both valid—mine\'s quieter.',
        afterKo: '세나: 모험가는 지평선을 쫓아요. 전 다음 조심스러운 하루를 쫓죠. 둘 다 옳고, 제 쪽은 더 조용해요.',
        afterChoices: [
          { en: 'Quiet days mend more than they get credit for.', ko: '조용한 하루가 생각보다 많이 고쳐 줘요.', delta: 7 },
          { en: 'I\'ll protect those quiet days when I can.', ko: '할 수 있을 때 그 조용한 하루를 지킬게요.', delta: 3 },
          { en: 'Valid and needed.', ko: '옳고, 필요해요.', delta: 1 },
        ],
      },
      {
        id: 'sena_20',
        minStage: 2,
        npcEn: 'Sena: {player}, tell me truly—do I fuss too much over strangers\' scrapes?',
        npcKo: '세나: {player}, 솔직히요… 낯선 사람 긁힌 상처에도 제가 너무 잔소리인가요?',
        choices: [
          { en: 'You fuss the right amount. Care isn\'t excess.', ko: '딱 맞는 잔소리예요. 돌봄은 과한 게 아니에요.', delta: 8 },
          { en: 'Sometimes a wipe is enough—but your heart\'s right.', ko: '가끔은 닦는 걸로 충분해도, 마음은 맞아요.', delta: 3 },
          { en: 'I like knowing someone notices.', ko: '누가 봐 준다는 게 좋아요.', delta: 1 },
        ],
        afterEn: 'Sena: Then I\'ll keep fussing. Better an extra bandage than an ignored infection.',
        afterKo: '세나: 그럼 계속 잔소리할게요. 지나친 붕대가, 놓친 염증보다 나아요.',
        afterChoices: [
          { en: 'Extra bandage. Always.', ko: '여분 붕대. 언제나요.', delta: 7 },
          { en: 'I\'ll accept your fussing gratefully.', ko: '그 잔소리, 감사히 받을게요.', delta: 3 },
          { en: 'Town\'s luckier for it.', ko: '마을이 운 좋네요.', delta: 1 },
        ],
      },
      {
        id: 'sena_21',
        minStage: 3,
        npcEn: 'Sena: I used to work alone on purpose, {player}. Then you started waiting for steam with me.',
        npcKo: '세나: {player}, 예전엔 일부러 혼자 일했어요. 당신이 김 오르는 걸 같이 기다려 주기 전까지요.',
        choices: [
          { en: 'Waiting with you feels like the right work.', ko: '함께 기다리는 게 바른 일처럼 느껴져요.', delta: 7 },
          { en: 'You can still ask for alone days.', ko: '혼자만의 날을 말해도 돼요.', delta: 3 },
          { en: 'I\'m glad I didn\'t rush you.', ko: '재촉하지 않아서 다행이에요.', delta: 1 },
        ],
        afterEn: 'Sena: Alone was safer. Together is kinder. I\'m learning kinder.',
        afterKo: '세나: 혼자는 더 안전했어요. 함께는 더 다정하고요. 전 그 다정을 배우는 중이에요.',
        afterChoices: [
          { en: 'Kinder is worth the learning.', ko: '다정은 배울 가치가 있어요.', delta: 7 },
          { en: 'We\'ll keep the balance you need.', ko: '필요한 균형을 지킬게요.', delta: 3 },
          { en: 'I\'m learning too.', ko: '저도 배우는 중이에요.', delta: 1 },
        ],
      },
      {
        id: 'sena_22',
        minStage: 3,
        npcEn: 'Sena: If the town ever panics with plague rumors, {player}, help me slow the crowd before the herbs.',
        npcKo: '세나: {player}, 마을이 역병 소문으로 허둥대면… 약초보다 먼저 사람을 진정시키는 거, 도와줘요.',
        choices: [
          { en: 'People first, then medicine. I\'m with you.', ko: '사람 먼저, 그다음 약. 함께할게요.', delta: 8 },
          { en: 'Do you have a calm-speech plan?', ko: '진정시키는 말 계획이 있어요?', delta: 3 },
          { en: 'I\'ll guard the clinic door if needed.', ko: '필요하면 진료실 문 지킬게요.', delta: 1 },
        ],
        afterEn: 'Sena: Panic doses wrong things. Calm lets the right leaf work.',
        afterKo: '세나: 허둥댐은 잘못된 걸 먹여요. 고요해야 바른 잎이 일해요.',
        afterChoices: [
          { en: 'We\'ll make room for the right leaf.', ko: '바른 잎이 일할 자리를 만들게요.', delta: 7 },
          { en: 'I\'ll practice a steady voice.', ko: '고른 목소리를 연습할게요.', delta: 3 },
          { en: 'Understood—sequence matters.', ko: '알겠어요. 순서가 중요하죠.', delta: 1 },
        ],
      },
      {
        id: 'sena_23',
        minStage: 3,
        npcEn: 'Sena: Tonight I show you grandmother\'s sealed recipe, {player}. No copies. Memory only.',
        npcKo: '세나: {player}, 오늘 밤 할머니의 봉인한 비법을 보여 줄게요. 베끼기 없어요. 기억만요.',
        choices: [
          { en: 'Memory only. I won\'t write a word.', ko: '기억만요. 한 글자도 안 적을게요.', delta: 8 },
          { en: 'Why trust me with it?', ko: '왜 저를 믿어요?', delta: 3 },
          { en: 'I\'ll listen with both hands empty.', ko: '손 비우고 귀만 열게요.', delta: 1 },
        ],
        afterEn: 'Sena: Because you never grabbed a leaf without asking what it cost the plant.',
        afterKo: '세나: 풀에게 어떤 값인지 묻지 않고 잎을 집은 적이 없으니까요.',
        afterChoices: [
          { en: 'That cost still matters to me.', ko: '그 값은 여전히 중요해요.', delta: 7 },
          { en: 'I\'ll keep earning that trust.', ko: '그 신뢰를 계속 쌓을게요.', delta: 3 },
          { en: 'Thank you for seeing that.', ko: '그걸 봐 줘서 고마워요.', delta: 1 },
        ],
      },
      {
        id: 'sena_24',
        minStage: 3,
        npcEn: 'Sena: {player}, if I ever fall ill, don\'t let them dose me fast. Slow tea. Your voice. Promise?',
        npcKo: '세나: {player}, 제가 아프면… 약을 급하게 먹이지 말아요. 느린 차. 당신 목소리. 약속해 줄래요?',
        choices: [
          { en: 'Slow tea and my voice. I promise.', ko: '느린 차와 제 목소리. 약속해요.', delta: 8 },
          { en: 'I\'ll find whoever you trust most too.', ko: '당신이 가장 믿는 사람도 부를게요.', delta: 3 },
          { en: 'Let\'s keep you well so we never need it.', ko: '그럴 일 없게, 건강하시길요.', delta: 1 },
        ],
        afterEn: 'Sena: Funny—I give that speech to others. Hearing it back steadies me.',
        afterKo: '세나: 웃기죠. 남에게 하던 말인데, 되들으니 마음이 안정돼요.',
        afterChoices: [
          { en: 'You deserve the same care you give.', ko: '주는 만큼 받을 자격이 있어요.', delta: 7 },
          { en: 'I\'ll write it down so I don\'t forget.', ko: '안 잊게 적어 둘게요.', delta: 3 },
          { en: 'I\'m honored you asked me.', ko: '물어봐 줘서 영광이에요.', delta: 1 },
        ],
      },
    ],
  },
}

export function listNpcs(): NpcDef[] {
  return Object.values(NPCS)
}

export function findNpc(query: string): NpcDef | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return Object.values(NPCS).find(
    (n) =>
      n.id === q ||
      n.name.toLowerCase() === q ||
      n.aliases?.some((a) => a.toLowerCase() === q || a === query.trim()),
  )
}

/** Display / talk argument name for the current language. */
export function npcLabel(n: NpcDef): string {
  if (getLang() === 'ko') {
    const hangul = n.aliases?.find((a) => /[가-힣]/.test(a))
    return hangul ?? n.name
  }
  return n.name
}

export function getAffinityScore(player: PlayerState, npcId: string): number {
  return Math.max(0, player.npcAffinity?.[npcId] ?? 0)
}

export function getAffinityStage(score: number): AffinityStage {
  if (score >= AFFINITY_STAGE_AT[2]) return 3
  if (score >= AFFINITY_STAGE_AT[1]) return 2
  if (score >= AFFINITY_STAGE_AT[0]) return 1
  return 0
}

export function getGiftedStage(player: PlayerState, npcId: string): AffinityStage {
  const n = player.npcGiftStage?.[npcId] ?? 0
  if (n >= 3) return 3
  if (n >= 2) return 2
  if (n >= 1) return 1
  return 0
}

export function pickPresentNpcs(count?: number): string[] {
  const all = Object.keys(NPCS)
  const n =
    count ??
    TOWN_PRESENT_MIN + Math.floor(Math.random() * (TOWN_PRESENT_MAX - TOWN_PRESENT_MIN + 1))
  const copy = [...all]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(n, copy.length))
}

export function pickDialogue(
  npc: NpcDef,
  usedIds: string[],
  affinityStage: AffinityStage,
): NpcDialogue {
  const eligible = npc.dialogues.filter((d) => d.minStage <= affinityStage)
  const preferred = eligible.filter((d) => d.minStage === affinityStage)
  const preferUnused = preferred.filter((d) => !usedIds.includes(d.id))
  const eligUnused = eligible.filter((d) => !usedIds.includes(d.id))
  const pool =
    preferUnused.length > 0
      ? preferUnused
      : preferred.length > 0
        ? preferred
        : eligUnused.length > 0
          ? eligUnused
          : eligible.length > 0
            ? eligible
            : npc.dialogues
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatNpcLine(text: string, playerName: string): string {
  return text.replaceAll('{player}', playerName)
}

export function ensureNpcMaps(player: PlayerState): void {
  if (!player.npcAffinity || typeof player.npcAffinity !== 'object') player.npcAffinity = {}
  if (!player.npcGiftStage || typeof player.npcGiftStage !== 'object') player.npcGiftStage = {}
  if (!player.npcDialogueSeen || typeof player.npcDialogueSeen !== 'object') player.npcDialogueSeen = {}
}

