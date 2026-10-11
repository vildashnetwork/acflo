import hero from "../assets/acflo-hero.jpg";
import community from "../assets/acflo-community.jpg";
import summit from "../assets/acflo-summit.jpg";
import field from "../assets/acflo-field.jpg";

import heroShare from "../assets/acflo-hero-share.jpg.asset.json";
import communityShare from "../assets/acflo-community-share.jpg.asset.json";
import summitShare from "../assets/acflo-summit-share.jpg.asset.json";
import fieldShare from "../assets/acflo-field-share.jpg.asset.json";
import partner0 from "../assets/partner-0.png.asset.json";
import partner1 from "../assets/partner-1.png.asset.json";
import partner2 from "../assets/partner-2.png.asset.json";
import partner3 from "../assets/partner-3.png.asset.json";
import partner4 from "../assets/partner-4.png.asset.json";
import partner5 from "../assets/partner-5.png.asset.json";

export const images = { hero, community, summit, field };
export const communityLocation = {
  name: "ZOZAC Community",
  area: "Likomba, Tiko · South West Region, Cameroon",
  mapQuery: "ZOZAC Community, Likomba, Tiko, Cameroon",
};
export const heroSlides = [
  {image: hero, alt: "Community leaders collaborating around a table"},
  {image: community, alt: "Community members working together outdoors"},
  {image: summit, alt: "Delegates at an African leadership gathering"},
  {image: field, alt: "Community members sharing ideas in the field"},
];
// Hosted 1200×630 renditions for link previews; these match the photography shown on the pages.
export const shareImages = {hero: heroShare, community: communityShare, summit: summitShare, field: fieldShare};
export const shareImageUrl = (asset: {url: string}) => `https://id-preview--6e97e86b-9184-4be8-856b-7c92096cfae3.lovable.app${asset.url}`;
const partnerLogos = [partner0, partner1, partner2, partner3, partner4, partner5];
export const countries = [
  { name: "Cameroon", flag: "🇨🇲", count: 18, activities: 7 }, { name: "Uganda", flag: "🇺🇬", count: 12, activities: 4 },
  { name: "Nigeria", flag: "🇳🇬", count: 22, activities: 9 }, { name: "Ghana", flag: "🇬🇭", count: 14, activities: 5 },
  { name: "Kenya", flag: "🇰🇪", count: 17, activities: 6 }, { name: "Tanzania", flag: "🇹🇿", count: 11, activities: 4 },
  { name: "Rwanda", flag: "🇷🇼", count: 9, activities: 3 }, { name: "Senegal", flag: "🇸🇳", count: 10, activities: 4 },
];
export const work = [
  { title: "Capacity Building", description: "Equipping local leaders with practical skills, tools and opportunities to grow their impact.", image: community, activities: "Workshops, mentorship and learning circles", impact: "Stronger local leadership" },
  { title: "Networking & Collaboration", description: "Creating meaningful connections between community organizations across borders.", image: hero, activities: "Convenings and peer exchanges", impact: "More connected organizations" },
  { title: "Knowledge Sharing", description: "Making lessons from the field accessible to the people doing the work.", image: field, activities: "Resources and community stories", impact: "Shared local knowledge" },
  { title: "Community Development", description: "Supporting locally led ideas that address real needs in communities.", image: community, activities: "Community projects and field action", impact: "Locally driven solutions" },
  { title: "Advocacy & Engagement", description: "Amplifying local voices in conversations that shape development.", image: summit, activities: "Dialogue and representation", impact: "Stronger community voices" },
  { title: "Regional Connections", description: "Bridging geographies and sectors to build a more collaborative Africa.", image: field, activities: "Cross-country exchanges", impact: "Continental solidarity" },
];
const orgBases = [
  ["Africa Community Development Initiative", "Cameroon", "Douala", "Community Development", "NGO"],
  ["Youth Action Collective", "Uganda", "Kampala", "Youth Empowerment", "Youth Organization"],
  ["Green Futures Network", "Nigeria", "Lagos", "Climate Action", "CSO"],
  ["Women Lead Ghana", "Ghana", "Accra", "Women’s Leadership", "NGO"],
  ["Community Health Connect", "Kenya", "Nairobi", "Health", "Community-Based Organization"],
  ["Tanzania Local Impact Forum", "Tanzania", "Dar es Salaam", "Education", "Development Organization"],
  ["Rwanda Social Innovation Lab", "Rwanda", "Kigali", "Social Innovation", "Social Enterprise"],
  ["Senegal Community Alliance", "Senegal", "Dakar", "Community Development", "CSO"],
  ["Cameroon Women in Action", "Cameroon", "Yaoundé", "Women’s Leadership", "Community-Based Organization"],
  ["African Youth Development Hub", "Nigeria", "Abuja", "Youth Empowerment", "NGO"],
  ["East Africa Learning Circle", "Kenya", "Mombasa", "Education", "Development Organization"],
  ["Ghana Community Enterprise", "Ghana", "Kumasi", "Livelihoods", "Social Enterprise"],
];
export const slugify = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const organizations = orgBases.map(([name,country,city,sector,type],i) => ({ id: slugify(name), name, country, city, sector, type, initials: name.split(" ").map(x=>x[0]).slice(0,3).join(""), description: `A locally rooted ${type.toLowerCase()} advancing ${sector.toLowerCase()} through community-led collaboration in ${city}, ${country}.`, website: `https://example.org/${slugify(name)}`, image: [community,field,hero][i%3] }));
export const partners = ["ZOZAC Community", "Community Development Africa", "African Youth Network", "Global Local Action Initiative", "Community Impact Partners", "Africa Capacity Hub"].map((name,i)=>({ name, country: countries[i%countries.length].name, category: ["Strategic Partners","Implementing Partners","Community Partners","Institutional Partners","Knowledge Partners"][i%5], description: `A demonstration partner profile focused on locally led collaboration and community impact.`, website: "https://example.org", logo: partnerLogos[i].url }));
export const events = [
  { id:"acflo-executive-summit-2026", title:"ACFLO Executive Summit 2026", date:"November 18, 2026", country:"Cameroon", location:"Douala, Cameroon", type:"Summit", image:summit, description:"A gathering to connect local leaders, share perspectives and imagine stronger collaboration across Africa." },
  { id:"community-leadership-forum", title:"Community Leadership Forum", date:"December 04, 2026", country:"Ghana", location:"Accra, Ghana", type:"Forum", image:hero, description:"A space for community voices and practical leadership exchange." },
  { id:"regional-learning-exchange", title:"Regional Learning Exchange", date:"January 22, 2027", country:"Kenya", location:"Nairobi, Kenya", type:"Workshop", image:community, description:"Peer learning across sectors and geographies." },
  { id:"local-action-dialogue", title:"Local Action Dialogue", date:"June 12, 2026", country:"Uganda", location:"Kampala, Uganda", type:"Dialogue", image:field, description:"A demonstration event for local organization collaboration." },
];
const headlines = [
  "Why locally led change matters now more than ever", "Building bridges between community organizations", "Women leaders shaping stronger communities", "A new chapter for African civil society", "Lessons from the field: collaboration in action", "Youth voices at the heart of local action", "Community-driven solutions in Cameroon", "The power of regional partnerships", "Learning together across borders", "Five ideas for resilient local organizations", "Inside a community leadership workshop", "From conversation to collective action", "Creating space for emerging leaders", "How local networks share knowledge", "Looking ahead: a connected African network"
];
export const news = headlines.map((title,i)=>({ id:slugify(title), title, category:["News","Articles","Announcements","Events","Photo Stories"][i%5], country:countries[i%countries.length].name, date:["September 12, 2026","August 28, 2026","July 19, 2026"][i%3], author:"ACFLO Editorial", readTime:`${4+i%4} min read`, excerpt:"Exploring the people, ideas and connections driving locally led change across African communities.", image:[community,hero,field,summit][i%4] }));
export const videos = ["Building Local Networks Across Africa", "ACFLO Executive Summit 2026", "Stories From Our Community", "Women Leading Local Change", "A Conversation on Collaboration", "Learning From the Field"].map((title,i)=>({ title, category:["Community Stories","Events","Interviews","Training","Advocacy","Organization Stories"][i], country:countries[i%8].name, duration:["04:28","12:16","06:34","08:11","05:42","03:57"][i], image:[field,summit,community,hero][i%4] }));
export const gallery = ["A community conversation", "Leaders gathered for dialogue", "Planning local action", "Sharing knowledge together", "An afternoon in the field", "Connections across communities", "Learning in practice", "A new generation of leaders"].map((caption,i)=>({ caption, category:["Community","Events","Field Activities","Training","Partnerships"][i%5], location:countries[i%8].name, date:"2026", image:[community,summit,field,hero][i%4] }));
export const resources = ["Local Leadership Toolkit", "Community Collaboration Guide", "African Civil Society Insights", "Summit Briefing Notes", "Facilitator Training Materials", "Statement on Locally Led Action", "Regional Learning Report", "Network Development Framework"].map((title,i)=>({ title, type:["Toolkits","Publications","Research","Summit Reports","Training Materials","Statements","Reports"][i%7], date:"2026", description:"A demonstration resource for organizations building community-led impact.", country:countries[i%8].name }));
export const leadership = ["Secretariat", "Executive / Steering Committee", "Country / Chapter Coordinators", "Advisory Board"].map((name,i)=>({ name, description:["Coordinates operations and network support.","Guides shared priorities and accountability.","Connects locally rooted work across geographies.","Offers strategic perspectives and expertise."][i] }));
export const agenda = ["0–10 min — Opening & Welcome","10–25 min — ACFLO: The Journey So Far","25–40 min — Reality Check: Where Are We Now?","40–60 min — Re-imagining the ACFLO Vision","60–70 min — Energize the Space","70–95 min — The ACFLO Strategic Pillars","95–110 min — 90-Day Activation Plan","110–118 min — Governance & Coordination","118–120 min — Commitments & Closing"];
