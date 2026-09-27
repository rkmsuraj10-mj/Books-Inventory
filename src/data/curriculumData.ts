import { CourseModule, Question, LeaderboardEntry } from '../types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    numberStr: 'MODULE 01',
    title: "Early Life, Narendra's Search for Truth & Sri Ramakrishna",
    description: "Covers birth in Calcutta, intellectual agnosticism, Brahmo Samaj contact, pivotal meetings at Dakshineswar, and direct spiritual transmission.",
    estimatedMins: 20,
    level: 'Foundational',
    questionCount: 20,
    status: 'completed',
    scorePercent: 95
  },
  {
    id: 2,
    numberStr: 'MODULE 02',
    title: "The Parivrajaka Days: Wandering Monk Across India",
    description: "Foot pilgrimage across the subcontinent, discovering deep poverty, national soul, encounters with Maharajas, and the Kanyakumari rock meditation.",
    estimatedMins: 25,
    level: 'Intermediate',
    questionCount: 20,
    status: 'completed',
    scorePercent: 88
  },
  {
    id: 3,
    numberStr: 'MODULE 03',
    title: "The 1893 Chicago Parliament of Religions & Western Tours",
    description: "Voyage on SS Peninsular, Harvard connections, the historic address, triumph of Vedantic universality, and lectures across England and America.",
    estimatedMins: 30,
    level: 'Advanced',
    questionCount: 20,
    status: 'in-progress',
    currentQuestionIndex: 3 // Question 4 of 20 (0-indexed 3)
  },
  {
    id: 4,
    numberStr: 'MODULE 04',
    title: "Practical Vedanta, Raja Yoga & Social Philosophy",
    description: "The four paths of yoga, human divinity, education as character development, upliftment of women and masses, and harmony of science with spirituality.",
    estimatedMins: 25,
    level: 'Advanced',
    questionCount: 20,
    status: 'up-next'
  },
  {
    id: 5,
    numberStr: 'MODULE 05',
    title: "Founding the Ramakrishna Math & Mission and Final Days",
    description: "Establishment of Belur Math, motto 'Atmano Mokshartham Jagaddhitaya Cha', second Western visit, and final Mahasamadhi on July 4, 1902.",
    estimatedMins: 20,
    level: 'Intermediate',
    questionCount: 20,
    status: 'locked'
  }
];

export const MODULE_3_QUESTIONS: Question[] = [
  {
    id: 1,
    moduleNumber: 3,
    category: "Maritime Voyage • Historical Preparation",
    topic: "chronology",
    prompt: "On which vessel did Swami Vivekananda set sail from Bombay on May 31, 1893, on his historic journey toward Vancouver and Chicago?",
    options: [
      { id: 'A', text: "SS Peninsular" },
      { id: 'B', text: "SS Oriental" },
      { id: 'C', text: "SS Kaiser-i-Hind" },
      { id: 'D', text: "SS Golconda" }
    ],
    correctOptionId: 'A',
    points: 2,
    explanation: {
      title: "Voyage on the Peninsular & Oriental Steam Navigation",
      scholarlyNote: "Swami Vivekananda boarded the P&O steamship 'SS Peninsular' on May 31, 1893, traveling through Colombo, Penang, Singapore, Hong Kong, Canton, Nagasaki, and Yokohama before boarding the Empress of India to Vancouver.",
      canonicalSource: "Life of Swami Vivekananda by His Eastern and Western Disciples, Vol. 1, Ch. 21.",
      historicalImpact: "Marked the transition from wandering Indian parivrajaka to world teacher of perennial philosophy."
    }
  },
  {
    id: 2,
    moduleNumber: 3,
    category: "Western Patronage • Intellectual Endorsement",
    topic: "chronology",
    prompt: "Which Harvard Greek professor famously remarked: 'To ask you, Swami, for credentials is like asking the sun to state its right to shine'?",
    options: [
      { id: 'A', text: "William James" },
      { id: 'B', text: "John Henry Wright" },
      { id: 'C', text: "Josiah Royce" },
      { id: 'D', text: "Charles William Eliot" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "Professor John Henry Wright's Epistolary Introduction",
      scholarlyNote: "Professor Wright of Harvard University hosted Swami Vivekananda in Annisquam, Massachusetts, and immediately wrote to Dr. J.H. Barrows, Chairman of the General Committee of the Parliament, introducing him as a man more learned than all our learned professors put together.",
      canonicalSource: "Complete Works of Swami Vivekananda, Biographical Introduction & Reminiscences.",
      historicalImpact: "Secured Vivekananda's delegate credentials when bureaucratic rules would have otherwise excluded him."
    }
  },
  {
    id: 3,
    moduleNumber: 3,
    category: "Canonical Speech • Opening Invocation",
    topic: "speeches",
    prompt: "With which revolutionary greeting did Swami Vivekananda commence his maiden address on September 11, 1893?",
    options: [
      { id: 'A', text: "Citizens and Seekers of the New World" },
      { id: 'B', text: "Distinguished Delegates and Honored Guests" },
      { id: 'C', text: "Sisters and Brothers of America" },
      { id: 'D', text: "Children of Immortal Bliss" }
    ],
    correctOptionId: 'C',
    points: 2,
    explanation: {
      title: "The Universal Greeting of Unity",
      scholarlyNote: "Beginning with 'Sisters and Brothers of America', the hall of over 7,000 delegates rose to their feet in a spontaneous standing ovation lasting two full minutes, moved by the instinctive sincerity of spiritual kinship.",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, 'Addresses at the Parliament of Religions'.",
      historicalImpact: "Shattered denominational sectarian boundaries and established a universal Vedantic family of humanity."
    }
  },
  {
    id: 4,
    moduleNumber: 3,
    category: "Canonical History • Primary Date",
    topic: "chronology",
    prompt: "In which year did Swami Vivekananda deliver his historic opening address at the World's Parliament of Religions in Chicago?",
    options: [
      { id: 'A', text: "1890" },
      { id: 'B', text: "1893" },
      { id: 'C', text: "1897" },
      { id: 'D', text: "1902" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "The Pivotal Year 1893",
      scholarlyNote: "Swami Vivekananda delivered his iconic opening address on September 11, 1893, at the Art Institute of Chicago during the inaugural session of the Parliament of Religions. Beginning with the resonant greeting “Sisters and Brothers of America,” he received an impromptu standing ovation of two full minutes from an audience of over 7,000 delegates and spectators.",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, “Addresses at the Parliament of Religions”.",
      historicalImpact: "Introduced Vedanta and classical Yoga to the Western hemisphere, fostering universal tolerance and religious pluralism."
    }
  },
  {
    id: 5,
    moduleNumber: 3,
    category: "Philosophical Text • Vedantic Parable",
    topic: "philosophy",
    prompt: "Which renowned ancient Indian fable did Swami Vivekananda recount at the Parliament to illustrate sectarian insularity and bigotry?",
    options: [
      { id: 'A', text: "The Blind Men and the Elephant" },
      { id: 'B', text: "The Frog in the Well (Kupa Manduka)" },
      { id: 'C', text: "The Lion that Thought It Was a Sheep" },
      { id: 'D', text: "The Churning of the Cosmic Ocean" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "Kupa Manduka: The Frog in the Well",
      scholarlyNote: "On September 15, 1893, in 'Why We Disagree', Swami Vivekananda narrated the tale of the frog that lived in a small well and refused to believe there could be a vast ocean beyond, illustrating how dogmatists imprison their own spiritual vision.",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, 'Why We Disagree'.",
      historicalImpact: "A legendary critique of theological parochialism still quoted across comparative religion circles globally."
    }
  },
  {
    id: 6,
    moduleNumber: 3,
    category: "Doctrinal Exposition • Paper on Hinduism",
    topic: "speeches",
    prompt: "In his major 'Paper on Hinduism' read on September 19, 1893, how did Swami Vivekananda define the human soul in relation to sin?",
    options: [
      { id: 'A', text: "Souls born stained by original sin requiring external salvation" },
      { id: 'B', text: "Children of immortal bliss (Amritasya Putrah), inherently pure and divine" },
      { id: 'C', text: "Tabula rasa beings determined entirely by empirical impressions" },
      { id: 'D', text: "Mortal entities destined to dissolve permanently upon physical demise" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "Amritasya Putrah: Children of Immortal Bliss",
      scholarlyNote: "Vivekananda electrified the audience by stating: 'Children of immortal bliss! What a holy name to address you! Allow me to call you, brethren, by that sweet name... Ye are the children of God, the sharers of immortal bliss, holy and perfect beings.'",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, 'Paper on Hinduism'.",
      historicalImpact: "Repudiated guilt-based theology and replaced it with innate potential divinity."
    }
  },
  {
    id: 7,
    moduleNumber: 3,
    category: "Comparative Theology • Universal Religion",
    topic: "philosophy",
    prompt: "What metaphor from the Shiva Mahimna Stotram did Vivekananda cite to portray the harmony of diverse spiritual disciplines?",
    options: [
      { id: 'A', text: "Many trees drawing nourishment from a singular forest soil" },
      { id: 'B', text: "Different streams having their sources in different places mingling their water in the sea" },
      { id: 'C', text: "Fibers woven into a solitary seamless tapestry" },
      { id: 'D', text: "Different musical notes creating a symphonic harmony" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "Ruchinam Vaichitryat (Different Streams to the Sea)",
      scholarlyNote: "Swami Vivekananda chanted the ancient Sanskrit hymn: 'As the different streams having their sources in different places all mingle their water in the sea, so, O Lord, the different paths which men take through different tendencies, various though they appear, crooked or straight, all lead to Thee.'",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, Address on September 11, 1893.",
      historicalImpact: "Became the defining philosophical motto for 20th-century interfaith dialogue."
    }
  },
  {
    id: 8,
    moduleNumber: 3,
    category: "Western Discourse • Scientific Compatibility",
    topic: "philosophy",
    prompt: "Which eminent American psychologist and philosopher attended Vivekananda's talks and cited him prominently in 'The Varieties of Religious Experience'?",
    options: [
      { id: 'A', text: "William James" },
      { id: 'B', text: "John Dewey" },
      { id: 'C', text: "George Santayana" },
      { id: 'D', text: "Charles Sanders Peirce" }
    ],
    correctOptionId: 'A',
    points: 2,
    explanation: {
      title: "William James and Practical Mysticism",
      scholarlyNote: "William James attended Swami Vivekananda's lectures in Cambridge, addressed him as 'Master', and used Vedantic philosophy to formulate his landmark theories on altered consciousness, mystical states, and religious pragmatism.",
      canonicalSource: "The Varieties of Religious Experience (1902) by William James; Complete Works of Swami Vivekananda.",
      historicalImpact: "Bridged empirical American pragmatism with classical Advaita Vedanta epistemology."
    }
  },
  {
    id: 9,
    moduleNumber: 3,
    category: "London Mission • Western Disciples",
    topic: "chronology",
    prompt: "Which British disciple met Swami Vivekananda in London in November 1895 and was later renamed Sister Nivedita?",
    options: [
      { id: 'A', text: "Josephine MacLeod" },
      { id: 'B', text: "Margaret Elizabeth Noble" },
      { id: 'C', text: "Sara Chapman Bull" },
      { id: 'D', text: "Henrietta Muller" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "Margaret Elizabeth Noble (Sister Nivedita)",
      scholarlyNote: "Margaret Noble, an Irish educationist in London, heard Vivekananda speak at a private drawing room in 1895. Dedicating her life to India and women's education, she was given the vow of Brahmacharya and named 'Nivedita' (The Dedicated One).",
      canonicalSource: "The Master as I Saw Him by Sister Nivedita; Complete Works Vol. 8.",
      historicalImpact: "Pioneered female literacy in Baghbazar, Calcutta, and inspired India's national independence movement."
    }
  },
  {
    id: 10,
    moduleNumber: 3,
    category: "Parliament Final Session • Concluding Vision",
    topic: "speeches",
    prompt: "At the final session of the Parliament on September 27, 1893, what words did Vivekananda proclaim should be written on the banner of every religion?",
    options: [
      { id: 'A', text: "'Conquest and Conversion'" },
      { id: 'B', text: "'Help and not fight', 'Assimilation and not Destruction', 'Harmony and Peace and not Dissension'" },
      { id: 'C', text: "'Uniformity of ritual and solitary creed'" },
      { id: 'D', text: "'Renunciation of the world and silence'" }
    ],
    correctOptionId: 'B',
    points: 2,
    explanation: {
      title: "The Banner of Universalism",
      scholarlyNote: "In his address at the final session, Vivekananda declared: 'If the Parliament of Religions has shown anything to the world, it is this: It has proved to the world that holiness, purity and charity are not the exclusive possessions of any church in the world... upon the banner of every religion will soon be written: Help and not fight, Assimilation and not Destruction, Harmony and Peace and not Dissension.'",
      canonicalSource: "Complete Works of Swami Vivekananda, Vol. 1, 'Address at the Final Session'.",
      historicalImpact: "Articulated the foundational tenets of modern global pluralism and peace initiatives."
    }
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "Ananya Sengupta", institution: "Presidency University, Kolkata", score: 98, badge: "Distinction Honors", completionTime: "18m 42s" },
  { rank: 2, name: "David M. Richardson", institution: "Harvard Divinity School", score: 96, badge: "Distinction Honors", completionTime: "21m 15s" },
  { rank: 3, name: "Priya Venkatesh", institution: "IIT Madras / Department of Humanities", score: 95, badge: "Distinction Honors", completionTime: "19m 50s" },
  { rank: 4, name: "Siddharth Bannerjee", institution: "Ramakrishna Mission Institute of Culture", score: 94, badge: "Honors Scholar", completionTime: "22m 04s" },
  { rank: 5, name: "Elena Rostova", institution: "Oxford Centre for Hindu Studies", score: 92, badge: "Honors Scholar", completionTime: "23m 30s" },
  { rank: 6, name: "Aarav Sharma", institution: "Banaras Hindu University (BHU)", score: 90, badge: "Honors Scholar", completionTime: "24m 12s" }
];
