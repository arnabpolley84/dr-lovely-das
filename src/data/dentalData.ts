/**
 * Data store for Dr. Lovely Das - MDS Endodontist & Root Canal Specialist
 * Mukundapur, Kolkata
 */

import heroRootCanal from "../assets/images/hero_root_canal_clinic_1790432446695.jpg";
import heroPrecision from "../assets/images/hero_precision_endodontics_1790432487052.jpg";
import heroConsultation from "../assets/images/hero_gentle_consultation_1790432465561.jpg";
import clinicReception from "../assets/images/clinic_reception_interior_1790432498629.jpg";
import restoredSmile from "../assets/images/restored_healthy_smile_1790432515036.jpg";

// Reliable bundled image assets
export const LOCAL_HERO_1 = heroRootCanal;
export const LOCAL_HERO_2 = heroPrecision;
export const LOCAL_HERO_3 = heroConsultation;
export const LOCAL_HERO_4 = clinicReception;
export const LOCAL_HERO_5 = restoredSmile;

// Primary specialist portrait and clinic photos
export const IMAGE_A = heroConsultation;
export const IMAGE_B = heroRootCanal;

export const DOCTOR_INFO = {
  name: "Dr. Lovely Das",
  title: "MDS Endodontist & Root Canal Specialist",
  bengaliName: "ডাঃ লাভলি দাস",
  bengaliTitle: "এমডিএস এন্ডোডনটিস্ট & রুট ক্যানেল স্পেশালিস্ট",
  bengaliLocation: "মুকুন্দপুর, কলকাতা",
  phone: "090071 62723",
  phoneRaw: "9007162723",
  phoneTel: "tel:+919007162723",
  whatsappUrl: "https://wa.me/919007162723?text=Hello%20Dr.%20Lovely%20Das,%20I%20would%20like%20to%20inquire%20about%20a%20root%20canal%20consultation.",
  rating: 4.9,
  reviewCount: 39,
  location: "Mukundapur, Kolkata",
  address: "Metro Station - Jyotirindra Nandi, 1/2 Nitai Nagar, Tara Bhavan, Mukundapur, Kalikapur, Beside Metro Cash & Carry, Nearest Kolkata, West Bengal 700099",
  hours: "Open · Closes 9 PM",
  operatingHours: "Monday - Saturday: 10:00 AM – 9:00 PM (Sunday by prior appointment)",
  googleMapsUrl: "https://maps.google.com/?q=Metro+Station+-+Jyotirindra+Nandi,+1/2+Nitai+Nagar,+Tara+Bhavan,+Mukundapur,+Kalikapur,+Beside+Metro+Cash+%26+Carry,+Kolkata,+West+Bengal+700099",
};

export interface HeroSlide {
  id: number;
  eyebrow: string;
  heading: string;
  description: string;
  primaryCtaText: string;
  primaryCtaAction: string;
  secondaryCtaText: string;
  secondaryCtaAction: string;
  image: string;
  imageAlt: string;
  fallbackImage: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "EXPERT ENDODONTIC CARE",
    heading: "Expert Root Canal Care With Comfort & Precision",
    description: "Personalized endodontic care from Dr. Lovely Das, MDS Endodontist & Root Canal Specialist in Mukundapur, Kolkata.",
    primaryCtaText: "Book an Appointment",
    primaryCtaAction: "#appointment",
    secondaryCtaText: "Call 090071 62723",
    secondaryCtaAction: "tel:+919007162723",
    image: IMAGE_A,
    fallbackImage: LOCAL_HERO_1,
    imageAlt: "Dr. Lovely Das specialized root canal operatory Mukundapur Kolkata",
  },
  {
    id: 2,
    eyebrow: "ROOT CANAL SPECIALIST",
    heading: "Specialized Care For Your Natural Teeth",
    description: "Focused endodontic treatment designed around careful diagnosis, patient comfort and preserving your natural smile.",
    primaryCtaText: "Explore Root Canal Care",
    primaryCtaAction: "#root-canal-care",
    secondaryCtaText: "Call 090071 62723",
    secondaryCtaAction: "tel:+919007162723",
    image: LOCAL_HERO_2,
    fallbackImage: LOCAL_HERO_1,
    imageAlt: "High-precision rotary endodontic equipment for gentle tooth restoration",
  },
  {
    id: 3,
    eyebrow: "COMFORT-FIRST DENTAL CARE",
    heading: "A Calm Approach To Dental Treatment",
    description: "Helping patients feel informed, comfortable and confident throughout their treatment journey.",
    primaryCtaText: "Consult Dr. Lovely Das",
    primaryCtaAction: "#about",
    secondaryCtaText: "Call 090071 62723",
    secondaryCtaAction: "tel:+919007162723",
    image: LOCAL_HERO_3,
    fallbackImage: IMAGE_B,
    imageAlt: "Dr. Lovely Das patient consultation in welcoming modern clinic",
  },
  {
    id: 4,
    eyebrow: "MUKUNDAPUR, KOLKATA",
    heading: "Professional Endodontic Care Close To You",
    description: "Conveniently located near Jyotirindra Nandi Metro Station and Mukundapur.",
    primaryCtaText: "Get Directions",
    primaryCtaAction: "#location",
    secondaryCtaText: "Call 090071 62723",
    secondaryCtaAction: "tel:+919007162723",
    image: LOCAL_HERO_4,
    fallbackImage: LOCAL_HERO_1,
    imageAlt: "Modern reception and clinic lounge in Mukundapur Kolkata",
  },
  {
    id: 5,
    eyebrow: "YOUR SMILE MATTERS",
    heading: "Don't Let Tooth Pain Control Your Day",
    description: "Get professional guidance for persistent tooth pain, sensitivity and root canal concerns.",
    primaryCtaText: "Book Consultation",
    primaryCtaAction: "#appointment",
    secondaryCtaText: "Call 090071 62723",
    secondaryCtaAction: "tel:+919007162723",
    image: LOCAL_HERO_5,
    fallbackImage: LOCAL_HERO_3,
    imageAlt: "Healthy, comfortable, preserved natural smile after root canal therapy",
  },
];

export interface PatientReview {
  id: number;
  reviewerName: string;
  reviewerInitials: string;
  verifiedStatus: string;
  locationTag: string;
  rating: number;
  treatmentTag: string;
  reviewText: string;
}

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 1,
    reviewerName: "Pravash Roy",
    reviewerInitials: "PR",
    verifiedStatus: "Verified Google Patient",
    locationTag: "Kolkata",
    rating: 5,
    treatmentTag: "Single-Visit RCT & Crown",
    reviewText: "My wife got her root canal treatment done from Dr. Lovely Das at Global Dental Studio. A single-visit RCT was done and got her crown fixed at next visit. The procedure was quick and also painless.",
  },
  {
    id: 2,
    reviewerName: "Sayan Karmakar",
    reviewerInitials: "SK",
    verifiedStatus: "Verified Google Patient",
    locationTag: "Purbalok, Kolkata",
    rating: 5,
    treatmentTag: "Root Canal Treatment",
    reviewText: "Best root canal specialist in Purbalok. Had an absolute painless treatment. Dr.Das is great, well behaved and empathic.",
  },
  {
    id: 3,
    reviewerName: "Kushal Ghosh",
    reviewerInitials: "KG",
    verifiedStatus: "Verified Google Patient",
    locationTag: "Mukundapur, Kolkata",
    rating: 5,
    treatmentTag: "RCT & Modern Amenities",
    reviewText: "Dr Das is simply excellent. Got my rct and crown done, it was painless, smooth and quick. The best dentist in mukundapur. Her clinic is very neat and clean, with all the modern amenities. Both she and the assistant was very patient with me and really soft spoken.",
  },
];

export interface DentalService {
  id: number;
  title: string;
  category: string;
  description: string;
  indications: string[];
  clinicalFocus: string;
}

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 1,
    title: "Root Canal Treatment",
    category: "Primary Endodontic Therapy",
    description: "Carefully planned treatment for infected or inflamed tooth pulp, aiming to eliminate infection and preserve the natural tooth structure.",
    indications: ["Deep decay reaching pulp", "Prolonged throbbing pain", "Chewing discomfort"],
    clinicalFocus: "Micro-cleaning, thorough disinfection, and three-dimensional biocompatible sealing.",
  },
  {
    id: 2,
    title: "Single-Visit Root Canal Consultation",
    category: "Specialized Clinical Assessment",
    description: "Assessment for cases that may be suitable for efficient endodontic treatment completed in a single session where clinically appropriate.",
    indications: ["Selected vital pulp conditions", "Uncomplicated canal anatomy", "Time-constrained patients"],
    clinicalFocus: "Comprehensive diagnostic imaging to evaluate whether single-visit criteria are met.",
  },
  {
    id: 3,
    title: "Tooth Pain & Sensitivity Consultation",
    category: "Diagnostic & Relief Care",
    description: "Professional evaluation of persistent tooth pain, severe cold/hot sensitivity, or bite tenderness to pinpoint the exact root cause.",
    indications: ["Sharp temperature triggers", "Night-time spontaneous aches", "Unclear source of dental pain"],
    clinicalFocus: "Pulp vitality testing, localized thermal response mapping, and digital radiograph review.",
  },
  {
    id: 4,
    title: "Endodontic Consultation",
    category: "Specialist Assessment",
    description: "Specialist assessment for complex, curved, or recurring dental problems requiring dedicated endodontic expertise.",
    indications: ["Complex root anatomy", "Calcified root canals", "Previously inconclusive diagnosis"],
    clinicalFocus: "Advanced anatomic evaluation and personalized restorative planning.",
  },
  {
    id: 5,
    title: "Root Canal Re-treatment Consultation",
    category: "Secondary Endodontic Care",
    description: "Evaluation of teeth that may require further endodontic assessment after previous treatment, persistent symptoms, or new infection.",
    indications: ["Post-treatment tenderness", "Recurrent apical lesion", "Compromised coronal restoration"],
    clinicalFocus: "Assessment of canal morphology, removal of previous filling materials, and targeted disinfection.",
  },
  {
    id: 6,
    title: "Dental Infection Assessment",
    category: "Infection Management",
    description: "Evaluation of symptoms that may indicate dental infection, localized swelling, or gum tenderness requiring prompt care.",
    indications: ["Gum boil / abscess formation", "Facial fullness or swelling", "Persistent bad taste or drainage"],
    clinicalFocus: "Localized drainage assessment, prescription guidance where required, and root source stabilization.",
  },
];

export const ROOT_CANAL_STEPS = [
  {
    step: "01",
    title: "Diagnostic Imaging & Vitality Testing",
    description: "Detailed digital radiography and pulp assessments identify the exact tooth involved and the extent of pulp inflammation.",
  },
  {
    step: "02",
    title: "Gentle Local Anesthesia & Isolation",
    description: "Modern local anesthetic techniques numb the tooth thoroughly. A protective rubber dam ensures sterile isolation throughout.",
  },
  {
    step: "03",
    title: "Micro-Cleaning & Disinfection",
    description: "Specialized rotary endodontic instruments gently remove inflamed pulp tissue while antibacterial solutions cleanse the canals.",
  },
  {
    step: "04",
    title: "Biocompatible Sealing",
    description: "Cleaned canals are filled with gutta-percha and biocompatible endodontic sealer to prevent bacteria from re-entering.",
  },
  {
    step: "05",
    title: "Permanent Restoration & Crown",
    description: "The tooth is sealed with a durable core build-up and prepared for a protective ceramic crown to restore full chewing function.",
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: "Specialist Endodontic Focus",
    description: "Dedicated to the diagnosis, treatment, and preservation of natural teeth through specialized endodontic training.",
    icon: "ShieldCheck",
  },
  {
    title: "Patient-Centered Communication",
    description: "Clear, transparent explanations at every stage so you feel fully informed and confident about your treatment plan.",
    icon: "MessageSquare",
  },
  {
    title: "Comfort-Focused Approach",
    description: "Gentle techniques and modern anesthesia protocols designed to prioritize your ease and minimize procedural discomfort.",
    icon: "HeartHandshake",
  },
  {
    title: "Careful Diagnosis",
    description: "Methodical clinical and radiographic assessment to ensure the exact underlying issue is accurately identified.",
    icon: "Stethoscope",
  },
  {
    title: "Personalized Treatment Planning",
    description: "Every tooth and individual circumstance is evaluated individually, recommending conservative care where appropriate.",
    icon: "UserCheck",
  },
  {
    title: "Convenient Mukundapur Location",
    description: "Easily accessible near Jyotirindra Nandi Metro Station and EM Bypass for residents across South Kolkata.",
    icon: "MapPin",
  },
];

export const AREAS_SERVED = [
  { name: "Mukundapur", distance: "Clinic Location" },
  { name: "Kalikapur", distance: "Adjacent / 5 mins" },
  { name: "Purbalok", distance: "Immediate Vicinity" },
  { name: "Santoshpur", distance: "10 mins" },
  { name: "Garia", distance: "12 mins" },
  { name: "Jadavpur", distance: "15 mins" },
  { name: "EM Bypass", distance: "Direct Access" },
  { name: "South Kolkata", distance: "Connected via Metro & Road" },
];

export interface GalleryItem {
  id: number;
  category: "all" | "doctor" | "clinic" | "treatments";
  title: string;
  caption: string;
  image: string;
  fallbackImage: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: "doctor",
    title: "Dr. Lovely Das Consulting Patient",
    caption: "MDS Endodontist providing individualized dental evaluation.",
    image: IMAGE_A,
    fallbackImage: LOCAL_HERO_3,
  },
  {
    id: 2,
    category: "clinic",
    title: "Specialist Operatory Suite",
    caption: "Pristine treatment environment with modern ergonomic dental chair.",
    image: LOCAL_HERO_1,
    fallbackImage: IMAGE_B,
  },
  {
    id: 3,
    category: "treatments",
    title: "Precision Rotary Endodontic Instruments",
    caption: "Sterilized high-precision equipment for gentle canal cleaning.",
    image: LOCAL_HERO_2,
    fallbackImage: LOCAL_HERO_1,
  },
  {
    id: 4,
    category: "clinic",
    title: "Welcoming Waiting Lounge",
    caption: "Clean, calming atmosphere designed for patient peace of mind.",
    image: LOCAL_HERO_4,
    fallbackImage: LOCAL_HERO_1,
  },
  {
    id: 5,
    category: "doctor",
    title: "Clinical Attention & Care",
    caption: "Dedicated focus on preserving natural teeth.",
    image: IMAGE_B,
    fallbackImage: LOCAL_HERO_3,
  },
  {
    id: 6,
    category: "treatments",
    title: "Preserved Natural Smile",
    caption: "Long-term tooth preservation and healthy oral aesthetics.",
    image: LOCAL_HERO_5,
    fallbackImage: LOCAL_HERO_1,
  },
];

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "What does an endodontist do?",
    answer: "An endodontist is a dental specialist who has completed rigorous post-graduate Master's (MDS) training dedicated specifically to diagnosing tooth pain, performing root canal treatments, and preserving natural teeth. While general dentists perform routine care, endodontists specialize in complex canal anatomy, persistent infections, and delicate internal tooth therapies.",
  },
  {
    id: 2,
    question: "When might I need a root canal treatment?",
    answer: "Root canal treatment is typically recommended when the inner dental pulp—which contains nerves and blood vessels—becomes inflamed or infected. This can be caused by deep tooth decay, repeated dental procedures on the same tooth, a cracked tooth, or physical dental trauma. Common signs include lingering sensitivity to hot or cold, throbbing pain, pain while chewing, or tenderness in the adjacent gum.",
  },
  {
    id: 3,
    question: "Is root canal treatment painful?",
    answer: "With modern dental techniques and effective local anesthesia, most patients report that root canal treatment is comfortable and relieves the severe pain caused by the infected tooth pulp. While individual sensitivity varies, Dr. Lovely Das emphasizes gentle, patient-focused protocols to keep you at ease throughout every step.",
  },
  {
    id: 4,
    question: "How long does a root canal procedure take?",
    answer: "Many root canal procedures can be completed in one to two appointments, typically lasting between 45 and 90 minutes depending on the tooth's canal complexity, presence of infection, and whether a single-visit procedure is clinically appropriate for your specific case.",
  },
  {
    id: 5,
    question: "Can a root canal save my natural tooth?",
    answer: "Yes, saving the natural tooth is the primary goal of endodontic therapy. Retaining your natural tooth allows for natural biting efficiency, preserves the surrounding jawbone, prevents adjacent teeth from shifting, and avoids the need for more extensive artificial tooth replacements.",
  },
  {
    id: 6,
    question: "What should I do if I have severe tooth pain?",
    answer: "If you experience severe or unremitting tooth pain, avoid applying aspirin directly to the gums. Rinse gently with warm water, avoid chewing on the painful side, and contact our Mukundapur clinic promptly at 090071 62723. Timely professional evaluation helps prevent infection from spreading.",
  },
  {
    id: 7,
    question: "When should I consult an endodontist?",
    answer: "You should consult an endodontist if you have unexplained or recurring tooth pain, sensitivity that lingers long after hot or cold food is removed, a chipped or cracked tooth, swelling near a tooth, or if a previous root canal requires specialist re-evaluation.",
  },
  {
    id: 8,
    question: "Where is Dr. Lovely Das's clinic located?",
    answer: "The clinic is conveniently situated in Mukundapur, Kalikapur, Kolkata—at 1/2 Nitai Nagar, Tara Bhavan, right beside Metro Cash & Carry, near the Jyotirindra Nandi Metro Station. It is easily accessible for patients from Purbalok, Santoshpur, Garia, Jadavpur, and across the EM Bypass corridor.",
  },
];

export interface EducationalArticle {
  id: number;
  title: string;
  readTime: string;
  category: string;
  summary: string;
  keyPoints: string[];
  clinicalNote: string;
}

export const DENTAL_ARTICLES: EducationalArticle[] = [
  {
    id: 1,
    title: "5 Signs You May Need a Root Canal",
    readTime: "3 min read",
    category: "Symptom Guide",
    summary: "Recognizing early pulp inflammation helps protect your natural tooth before infection spreads further.",
    keyPoints: [
      "Lingering sensitivity to hot or cold temperatures lasting more than 15-30 seconds",
      "Persistent dull throbbing or sudden sharp aches when biting down",
      "Swelling, tenderness, or a small pimple-like bump (abscess) on the gum",
      "Darkening or discoloration of a single tooth following trauma or deep decay",
      "Pain that wakes you from sleep or requires pain relievers to manage",
    ],
    clinicalNote: "Early diagnosis allows conservative treatment and preserves more healthy tooth structure.",
  },
  {
    id: 2,
    title: "Root Canal Treatment: What Patients Should Know",
    readTime: "4 min read",
    category: "Treatment Basics",
    summary: "An overview of what happens during endodontic therapy and how modern instruments ensure a calm experience.",
    keyPoints: [
      "The treatment removes infected soft tissue inside the roots, not the tooth itself",
      "Rotary nickel-titanium instruments clean complex canal curves with high precision",
      "Biocompatible sealers ensure lasting bacterial isolation within the root system",
      "A permanent filling or crown follows to restore full bite strength",
    ],
    clinicalNote: "Modern endodontic treatment is comparable in comfort to getting a routine dental filling.",
  },
  {
    id: 3,
    title: "Tooth Sensitivity: When Should You See a Dentist?",
    readTime: "3 min read",
    category: "Dental Health",
    summary: "Differentiating between mild enamel wear sensitivity and deeper nerve involvement requiring specialist care.",
    keyPoints: [
      "Fleeting sensitivity to ice water often indicates enamel wear or exposed dentin",
      "Sensitivity triggered by heat that lingers indicates potential pulp inflammation",
      "Sensitivity localized to one specific tooth warrants radiographic examination",
      "Over-the-counter sensitivity toothpastes should not replace clinical diagnosis if pain persists",
    ],
    clinicalNote: "If sensitivity lingers for minutes after the trigger is gone, schedule a specialist consultation.",
  },
  {
    id: 4,
    title: "Root Canal vs Tooth Extraction",
    readTime: "4 min read",
    category: "Clinical Decision",
    summary: "Why endodontists prioritize saving natural teeth whenever clinically feasible and structurally sound.",
    keyPoints: [
      "Natural teeth have periodontal ligaments that provide sensory feedback during chewing",
      "Extracting a tooth often requires replacement bridges or implants to prevent adjacent teeth from tilting",
      "Preserving your natural root structure maintains natural alveolar bone volume",
      "A successfully treated and crowned tooth can function comfortably for many years",
    ],
    clinicalNote: "Nothing looks, feels, or functions exactly like your natural tooth when it can be saved.",
  },
  {
    id: 5,
    title: "How To Care For Your Tooth After Root Canal Treatment",
    readTime: "3 min read",
    category: "Recovery & Care",
    summary: "Practical post-treatment instructions to ensure smooth healing and long-term restorative longevity.",
    keyPoints: [
      "Avoid chewing hard, sticky foods on the treated side until the permanent crown is placed",
      "Mild tenderness around the gum for 2-3 days is normal and responds well to standard over-the-counter relievers",
      "Maintain normal gentle brushing and flossing around the temporary restoration",
      "Schedule the definitive crown restoration promptly to protect against fracture",
    ],
    clinicalNote: "Prompt crown placement is essential to shield the treated tooth from bite forces.",
  },
  {
    id: 6,
    title: "Common Causes of Persistent Tooth Pain",
    readTime: "4 min read",
    category: "Pain Evaluation",
    summary: "Understanding the subtle sources of recurring dental discomfort from hidden fractures to sinus pressure.",
    keyPoints: [
      "Micro-cracks beneath old restorations that flex under masticatory pressure",
      "Deep decay hidden beneath existing crowns or between adjacent teeth",
      "Referred pain from nighttime grinding (bruxism) or maxillary sinus proximity",
      "Persistent pulpal infection requiring targeted endodontic re-evaluation",
    ],
    clinicalNote: "Accurate differential diagnosis is the cornerstone of effective, lasting pain relief.",
  },
];
