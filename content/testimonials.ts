/**
 * Kind words from Yulia's clients and followers — as published on the original
 * witchyportal.com. Real messages only: add new ones exactly as received.
 * `about` groups them on the Testimonials page.
 */
export interface Testimonial {
  quote: string;
  name: string;
  about: "Readings" | "Spells" | "Workshops" | "Guidance" | "Community";
  /** Shown on the homepage and Services page */
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  { quote: "From one Queen to another — I love you and thank you!!! Your readings are just something else… It all resonated with me and you brought so much clarity and guidance and peace of mind. I feel so much ease and calmness… I can't thank you enough Yulia for going above and beyond. I definitely look forward to working with you again.", name: "Y.D.", about: "Readings", featured: true },
  { quote: "I just want to say how amazing you are! As a person and as a witch. Very caring and professional, and always have helpful tips along the way! You always walk me through every step. And I already feel your spell working! I cannot wait to see the final result!!", name: "C.N.", about: "Spells", featured: true },
  { quote: "That workshop was unreal! Learned so much once again, and I cannot wait for the next one. You have such great energy and make learning this craft so much fun!", name: "Megan", about: "Workshops", featured: true },
  { quote: "Morning Yulia! I can't thank you enough. You didn't just help me in my 'needs' and 'wants' but really listened to me too and cared. Thank you for being a friend too :)", name: "J.L.", about: "Guidance" },
  { quote: "You inspire me Yulia! You've helped me not only with spells, but with your genuine concern and women empowerment!", name: "S.L.", about: "Spells" },
  { quote: "Yulia, thank you so much!!!!!! Your spell helped me to start new life and my depression was gone after talking and working with you.", name: "Anonymous", about: "Spells" },
  { quote: "Just a lil thank you for all you do for me and everyone of your followers. I don't think you quite know how eternally grateful I am for you and your knowledge. And actually giving a sh*t about me :)", name: "M.G.", about: "Community" },
  { quote: "Hi Yulia, thank you so much! I finally had a great night of sleep and woke up without any pain! Thank you!!", name: "C.R.", about: "Spells" },
  { quote: "Hello, you inspire me every day and put a smile on my face, thank you for being somehow in my life. Love from Poland", name: "IG follower", about: "Community" },
];
