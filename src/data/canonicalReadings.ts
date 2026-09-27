export interface CanonicalReading {
  id: string;
  volume: string;
  title: string;
  subtitle: string;
  dateOrEpoch: string;
  excerpt: string;
  audioDuration?: string;
  tags: string[];
}

export const CANONICAL_READINGS: CanonicalReading[] = [
  {
    id: "chicago-1893-opening",
    volume: "Complete Works, Vol. 1",
    title: "Response to Welcome (Opening Address)",
    subtitle: "Art Institute of Chicago, First Session",
    dateOrEpoch: "September 11, 1893",
    tags: ["Chicago Parliament", "Universal Tolerance", "Pluralism"],
    audioDuration: "4 min 12s",
    excerpt: `Sisters and Brothers of America,

It fills my heart with joy unspeakable to rise in response to the warm and cordial welcome which you have given us. I thank you in the name of the most ancient order of monks in the world; I thank you in the name of the mother of religions, and I thank you in the name of millions and millions of Hindu people of all classes and sects.

My thanks, also, to some of the speakers on this platform who, referring to the delegates from the Orient, have told you that these men from far-off nations may well claim the honor of bearing to different lands the idea of toleration. I am proud to belong to a religion which has taught the world both tolerance and universal acceptance. We believe not only in universal toleration, but we accept all religions as true.

I am proud to belong to a nation which has sheltered the persecuted and the refugees of all religions and all nations of the earth. I am proud to tell you that we have gathered in our bosom the purest remnant of the Israelites, who came to Southern India and took refuge with us in the very year in which their holy temple was shattered to pieces by Roman tyranny.

As the different streams having their sources in different places all mingle their water in the sea, so, O Lord, the different paths which men take through different tendencies, various though they appear, crooked or straight, all lead to Thee.`
  },
  {
    id: "chicago-1893-paper-hinduism",
    volume: "Complete Works, Vol. 1",
    title: "Paper on Hinduism",
    subtitle: "Exposition of Vedanta & the Immortality of the Soul",
    dateOrEpoch: "September 19, 1893",
    tags: ["Vedanta", "Atman", "Universal Soul"],
    audioDuration: "14 min 30s",
    excerpt: `Three religions now stand in the world which have come down to us from prehistoric times: Hinduism, Zoroastrianism and Judaism. They have all received tremendous shocks and all of them prove by their survival their internal strength.

The Hindu religion does not consist in struggles and attempts to believe a certain doctrine or dogma, but in realizing—not in believing, but in being and becoming. Thus the whole object of their system is by constant struggle to become perfect, to become divine, to reach God and see God.

Children of immortal bliss—what a sweet, what a hopeful name! Allow me to call you, brethren, by that sweet name—heirs of immortal bliss—yea, the Hindu refuses to call you sinners. Ye are the Children of God, the sharers of immortal bliss, holy and perfect beings. Ye divinities on earth—sinners! It is a sin to call a man so; it is a standing libel on human nature. Come up, O lions, and shake off the delusion that you are sheep; you are souls immortal, spirits free, blest and eternal; ye are not matter, ye are not bodies; matter is your servant, not you the servant of matter.`
  },
  {
    id: "raja-yoga-intro",
    volume: "Complete Works, Vol. 1",
    title: "Raja Yoga: The Path of Mental Discipline",
    subtitle: "Control of the Internal Organs and Concentration",
    dateOrEpoch: "New York, 1896",
    tags: ["Raja Yoga", "Psychology", "Meditation"],
    audioDuration: "11 min 45s",
    excerpt: `All our knowledge is based upon experience. What we call inferential knowledge, in which we go from the less general to the more general, or from the general to the particular, has examination as its basis. The science of Raja-Yoga, in the first place, proposes to give us such a means of observing the internal states. The instrument is the mind itself.

The power of attention, when properly guided, and directed towards the internal world, will analyse the mind, and illumine facts for us. The powers of the mind are like rays of dissipated light; when they are concentrated, they illumine everything.

Each soul is potentially divine. The goal is to manifest this Divinity within by controlling nature, external and internal. Do this either by work, or worship, or psychic control, or philosophy—by one, or more, or all of these—and be free.`
  },
  {
    id: "practical-vedanta",
    volume: "Complete Works, Vol. 2",
    title: "Practical Vedanta",
    subtitle: "London Lectures on Living the Transcendent Principle",
    dateOrEpoch: "London, November 1896",
    tags: ["Practical Vedanta", "Service", "Daridra Narayana"],
    audioDuration: "9 min 20s",
    excerpt: `You must remember that the religion of the Upanishads is not meant only for the recluse in the forest; it is meant for everyone in every station of life. The Vedantic ideals are to be realized by the person at the desk, in the marketplace, and in the council chamber.

The Vedanta means that those ideals which are so lofty are not merely to be admired from afar, but they can be carried out into everyday life. This is the great message of Advaita: Oneness of all beings. When you hurt another, you are hurting yourself. When you serve another with love, you are worshiping the Divine within yourself.`
  }
];
