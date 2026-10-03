// This script UPDATES existing places by name - it does NOT delete
// or duplicate anything. Safe to run independently of the other update files.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

// BATCH 22: Tamil Nadu (all 7 places)
const updates = [
  {
    name: "Meenakshi Temple",
    details: {
      description: "A historic temple dedicated to Goddess Meenakshi (a form of Parvati) and her consort Sundareswarar (Shiva), famous for its 14 towering, intricately carved gopurams (gateway towers) and the Hall of a Thousand Pillars.",
      timings: "Approximately 5:00 AM to 12:30 PM, then 4:00 PM to 9:30-10:00 PM daily (closes midday for a break).",
      entryFee: "Free general darshan. Special/faster darshan tickets available: approx. ₹50 for one shrine, ₹100 for both. Art Museum entry: approx. ₹5 for Indians, ₹50 for foreigners.",
      bestTime: "October to March",
      famousFood: "Tamil Nadu thali, Madurai's famous Jigarthanda (cold dessert drink), Kari Dosa",
      nearby: "Thirumalai Nayakkar Mahal, Vandiyur Mariamman Teppakulam, Gandhi Memorial Museum",
      transport: "Nearest airport: Madurai Airport (~12 km). Nearest railway station: Madurai Junction (~2 km)."
    }
  },
  {
    name: "Ooty Hills",
    details: {
      description: "A hill station in the Nilgiri Mountains, known as the 'Queen of Hill Stations', famous for tea gardens, botanical gardens, Ooty Lake, and the UNESCO-listed Nilgiri Mountain Railway toy train.",
      timings: "Open all day; individual attractions like the Botanical Garden and boathouse typically 7:00 AM/8:00 AM to 6:00 PM.",
      entryFee: "Free to explore the town; Botanical Garden entry approx. ₹30-50, boating at Ooty Lake approx. ₹100-300.",
      bestTime: "October to June (avoid heaviest monsoon months)",
      famousFood: "Ooty homemade chocolates, Nilgiri tea, South Indian thali",
      nearby: "Doddabetta Peak, Ooty Lake, Botanical Garden",
      transport: "Nearest airport: Coimbatore Airport (~90 km). Nearest railway station: Ooty (Udhagamandalam) Railway Station, connected via the Nilgiri Mountain Railway from Mettupalayam."
    }
  },
  {
    name: "Shore Temple",
    details: {
      description: "A UNESCO World Heritage Site built in the 8th century by the Pallava dynasty, one of the oldest structural stone temples in South India, dedicated to Lord Shiva, standing dramatically at the edge of the Bay of Bengal.",
      timings: "Approximately 6:00 AM to 6:00 PM daily.",
      entryFee: "Indian nationals: approx. ₹40. Foreign nationals: approx. ₹600. Children under 15: free.",
      bestTime: "November to February",
      famousFood: "Tamil Nadu coastal seafood, South Indian thali, Mahabalipuram's famous fresh fish fry",
      nearby: "Five Rathas (Pancha Rathas), Arjuna's Penance, Mahabalipuram Beach",
      transport: "Nearest airport: Chennai International Airport (~55 km). Nearest railway station: Chengalpattu (~29 km)."
    }
  },
  {
    name: "Kodaikanal",
    details: {
      description: "A hill station in the Palani Hills known as the 'Princess of Hill Stations', famous for Kodaikanal Lake (a star-shaped artificial lake), pine forests, and cool climate, popular for boating and scenic viewpoints.",
      timings: "Open all day; Kodaikanal Lake boating typically 9:00 AM to 5:30 PM.",
      entryFee: "Free to explore the town; boating at the lake approx. ₹100-300, individual viewpoints/gardens have nominal fees.",
      bestTime: "September to May",
      famousFood: "Kodaikanal homemade chocolates and plum cakes, South Indian thali, fresh Nilgiri-region produce",
      nearby: "Coaker's Walk, Bryant Park, Pillar Rocks",
      transport: "Nearest airport: Madurai Airport (~120 km). Nearest railway station: Kodai Road Railway Station (~80 km)."
    }
  },
  {
    name: "Brihadeeswarar Temple",
    details: {
      description: "A UNESCO World Heritage Site built in 1010 CE by Raja Raja Chola I, a masterpiece of Chola-era Dravidian architecture, famous for its massive vimana (tower) topped by a single 80-tonne granite block.",
      timings: "Approximately 6:00 AM to 12:30 PM, then 4:00 PM to 8:30 PM daily.",
      entryFee: "Free general entry (ASI ticket may apply for certain areas, typically nominal for Indians).",
      bestTime: "October to March",
      famousFood: "Tamil Nadu thali, Thanjavur's traditional South Indian sweets, filter coffee",
      nearby: "Thanjavur Palace, Saraswathi Mahal Library, Thanjavur Art Gallery",
      transport: "Nearest airport: Tiruchirappalli (Trichy) Airport (~60 km). Nearest railway station: Thanjavur Junction (~3 km)."
    }
  },
  {
    name: "Marina Beach",
    details: {
      description: "One of the longest urban beaches in the world at about 13 km, stretching along Chennai's coastline. A popular spot for evening walks, street food, and gatherings, lined with statues and monuments.",
      timings: "Open 24 hours; most lively in the early morning and evening (swimming is discouraged due to strong currents).",
      entryFee: "Free entry.",
      bestTime: "November to February",
      famousFood: "Chennai street food (sundal, bhel puri, sugarcane juice), South Indian filter coffee",
      nearby: "Kapaleeshwarar Temple, Fort St. George, Vivekananda House",
      transport: "Nearest airport: Chennai International Airport (~20 km). Nearest railway station: Chennai Central (~4 km)."
    }
  },
  {
    name: "Kanyakumari",
    details: {
      description: "The southernmost tip of mainland India, where the Arabian Sea, Bay of Bengal, and Indian Ocean meet. Famous for sunrise and sunset views, the Vivekananda Rock Memorial, and the towering Thiruvalluvar Statue.",
      timings: "Open all day; Vivekananda Rock Memorial ferry service typically runs 8:00 AM to 4:00 PM.",
      entryFee: "Free to visit the shoreline. Vivekananda Rock Memorial: ferry ticket approx. ₹50-100 plus a small memorial entry fee.",
      bestTime: "October to March",
      famousFood: "Tamil Nadu coastal seafood, South Indian thali, fresh coconut water",
      nearby: "Vivekananda Rock Memorial, Thiruvalluvar Statue, Kanyakumari Beach",
      transport: "Nearest airport: Thiruvananthapuram International Airport, Kerala (~85 km). Nearest railway station: Kanyakumari Railway Station (~1 km)."
    }
  },

  // BATCH 23: Telangana (all 5 places)
  {
    name: "Charminar",
    details: {
      description: "An iconic 16th-century monument and mosque built in 1591 by Sultan Muhammad Quli Qutb Shah, marking the center of the old city of Hyderabad. Its four grand arches and minarets have made it a global symbol of the city.",
      timings: "9:30 AM to 5:30 PM daily, open all days of the week. Best viewed illuminated in the evening between 7:00-9:00 PM.",
      entryFee: "Indian nationals: approx. ₹20-25. SAARC/BIMSTEC nationals: approx. ₹35. Foreign nationals: approx. ₹250-300. Children under 15: free.",
      bestTime: "October to February",
      famousFood: "Hyderabadi Biryani, Irani Chai, Osmania Biscuits at nearby Laad Bazaar",
      nearby: "Laad Bazaar, Mecca Masjid, Chowmahalla Palace",
      transport: "Nearest airport: Rajiv Gandhi International Airport (~25 km). Nearest railway station: Hyderabad Deccan (Nampally) (~5 km)."
    }
  },
  {
    name: "Golconda Fort",
    details: {
      description: "A massive fortress complex that was the capital of the Qutb Shahi dynasty, famous for its acoustic engineering (a clap at the entrance can be heard at the highest point), and historically associated with the mining of famous diamonds including the Koh-i-Noor.",
      timings: "Approximately 9:00 AM to 5:30 PM daily. Light and sound show held in the evening (around 6:30-7:30 PM, seasonal, in English and other languages on select days).",
      entryFee: "Indian nationals: approx. ₹25-30. Foreign nationals: approx. ₹300-350. Light and sound show ticketed separately (approx. ₹140-170).",
      bestTime: "October to February",
      famousFood: "Hyderabadi Biryani, Lukhmi (a Hyderabadi savory pastry), Irani Chai",
      nearby: "Qutb Shahi Tombs, Taramati Baradari, Golconda's night bazaar",
      transport: "Nearest airport: Rajiv Gandhi International Airport (~35 km). Nearest railway station: Hyderabad Deccan (Nampally) (~12 km)."
    }
  },
  {
    name: "Ramoji Film City",
    details: {
      description: "The world's largest integrated film studio complex (Guinness World Record holder), spanning over 1,600 acres with film sets, gardens, and theme-park style attractions, offering a mix of movie-making insight and family entertainment.",
      timings: "Approximately 9:00 AM to 5:30 PM daily (full-day visit recommended; internal shuttle tours run on a schedule).",
      entryFee: "General entry package: approx. ₹1,150-1,700 per person depending on ticket type (includes access to gardens, select shows, and shuttle tour); premium packages with more rides/shows cost more.",
      bestTime: "October to February",
      famousFood: "Multi-cuisine food courts within the complex, Hyderabadi Biryani",
      nearby: "Hyderabad city attractions, Shamshabad (day-trip distance)",
      transport: "Nearest airport: Rajiv Gandhi International Airport (~25 km). Nearest railway station: Hyderabad Deccan (~30 km)."
    }
  },
  {
    name: "Warangal Fort",
    details: {
      description: "A 13th-century fort built by the Kakatiya dynasty, known for its four ornately carved stone gateways (Kakatiya Kala Thoranam) that have become a symbol of Telangana, featured in the state's official emblem.",
      timings: "Approximately 9:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹25 for Indian visitors).",
      bestTime: "October to February",
      famousFood: "Hyderabadi Biryani, Telangana-style Sarva Pindi, Warangal's local sweets",
      nearby: "Thousand Pillar Temple, Bhadrakali Temple, Warangal Fort Museum",
      transport: "Nearest airport: Rajiv Gandhi International Airport, Hyderabad (~145 km). Nearest railway station: Warangal Railway Station (~5 km)."
    }
  },
  {
    name: "Bhadrakali Temple",
    details: {
      description: "One of the oldest Kali temples in South India, built in 950 CE by Kakatiya king Pratapa Rudra I, overlooking the scenic Bhadrakali Lake near Warangal.",
      timings: "Approximately 5:30 AM to 8:30 PM daily.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to February",
      famousFood: "Hyderabadi Biryani, Telangana-style Sarva Pindi, local Warangal snacks",
      nearby: "Warangal Fort, Thousand Pillar Temple, Bhadrakali Lake",
      transport: "Nearest airport: Rajiv Gandhi International Airport, Hyderabad (~140 km). Nearest railway station: Warangal Railway Station (~6 km)."
    }
  },

  // BATCH 24: Tripura (all 4 places)
  {
    name: "Ujjayanta Palace",
    details: {
      description: "A grand former royal palace in Agartala built in 1901 by Maharaja Radha Kishore Manikya, blending Mughal, colonial, and traditional Tripuri architectural styles. Now houses the Tripura State Museum with artifacts from the region's royal and tribal history.",
      timings: "Approximately 10:00 AM to 5:00 PM, closed Mondays.",
      entryFee: "Nominal entry fee (typically under ₹40 for Indian visitors; camera fees may apply separately).",
      bestTime: "October to March",
      famousFood: "Tripuri cuisine (Mui Borok, Berma-based dishes), Bengali-influenced sweets common in Agartala",
      nearby: "Jagannath Temple (Agartala), Agartala city center, Laxmi Narayan Temple",
      transport: "Nearest airport: Maharaja Bir Bikram Airport, Agartala (~12 km). Nearest railway station: Agartala Railway Station (~6 km)."
    }
  },
  {
    name: "Neermahal",
    details: {
      description: "A stunning water palace built in the 1930s by King Bir Bikram Kishore Manikya in the middle of Rudrasagar Lake, one of only two lake palaces in India (the other being Jal Mahal in Rajasthan). Blends Hindu and Mughal architectural styles.",
      timings: "Approximately 8:00 AM to 4:00-5:00 PM daily. Access is only by boat.",
      entryFee: "Palace entry: nominal fee (typically under ₹20). Boat ride (mandatory to reach the palace): approx. ₹20-30 per person for a shared boat (waits until filled), or approx. ₹450-600 to reserve a private boat. Visit duration on the island is typically limited to 45 minutes.",
      bestTime: "October to May",
      famousFood: "Tripuri cuisine, local snacks at the Melaghar boat jetty area",
      nearby: "Sepahijala Wildlife Sanctuary (day-trip), Melaghar town, Rudrasagar Lake",
      transport: "Nearest airport: Maharaja Bir Bikram Airport, Agartala (~53 km). Reached by road from Agartala to Melaghar, then boat to the palace."
    }
  },
  {
    name: "Unakoti Rock Carvings",
    details: {
      description: "An ancient site featuring massive rock-cut sculptures and carvings of Hindu deities, primarily Shiva, dating back over a thousand years. The name 'Unakoti' means 'one less than a crore' (referring to the legend of nearly a crore of carved figures).",
      timings: "Approximately 8:00 AM to 5:00 PM daily.",
      entryFee: "Free or nominal entry fee (typically under ₹25).",
      bestTime: "October to March; the Ashokastami Mela festival (around April) draws large crowds and cultural activity",
      famousFood: "Tripuri cuisine, local snacks in nearby Kailashahar town",
      nearby: "Kailashahar town, Jampui Hills (further day-trip), local tribal villages",
      transport: "Nearest airport: Maharaja Bir Bikram Airport, Agartala (~180 km). Nearest railway station: Kumarghat Railway Station (~28 km)."
    }
  },
  {
    name: "Tripura Sundari Temple",
    details: {
      description: "One of the 51 Shakti Peethas of Hinduism, located in Udaipur town, dedicated to Goddess Tripura Sundari. Built in 1501 in the shape of a tortoise's back (Kurma Peeth), it is one of Tripura's most significant pilgrimage sites.",
      timings: "Approximately 5:00 AM to 1:00 PM, then 4:00 PM to 8:00 PM daily.",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to March; Diwali period draws especially large crowds of devotees",
      famousFood: "Tripuri cuisine, Bengali-influenced sweets and prasad near the temple",
      nearby: "Kalyansagar Lake, Neermahal (day-trip distance), Udaipur town",
      transport: "Nearest airport: Maharaja Bir Bikram Airport, Agartala (~55 km). Nearest railway station: Udaipur Railway Station (Tripura) (~2 km)."
    }
  },

  // BATCH 25: Uttar Pradesh (7 remaining places - Taj Mahal already done)
  {
    name: "Varanasi Ghats",
    details: {
      description: "A series of riverfront steps along the Ganges in one of the world's oldest continuously inhabited cities, central to Hindu pilgrimage and cremation rituals. Famous for the daily Ganga Aarti ceremony at Dashashwamedh Ghat.",
      timings: "Ghats accessible 24 hours; Ganga Aarti held every evening around sunset (approximately 6:45-7:15 PM, seasonal). Boat rides best at sunrise, roughly 5:30-6:30 AM.",
      entryFee: "Free access to the ghats. Sunrise or sunset boat rides cost approx. ₹200-600 per person depending on boat type and duration (negotiable with boatmen, or fixed rates via official tourism boats).",
      bestTime: "October to March",
      famousFood: "Kachori Sabzi, Banarasi Paan, Lassi (especially the famous Blue Lassi shop), Malaiyo (winter specialty)",
      nearby: "Kashi Vishwanath Temple, Sarnath (~13 km), Ramnagar Fort",
      transport: "Nearest airport: Lal Bahadur Shastri Airport, Varanasi (~25 km). Nearest railway station: Varanasi Junction (Varanasi Cantt) (~6 km)."
    }
  },
  {
    name: "Fatehpur Sikri",
    details: {
      description: "A UNESCO World Heritage Site and the short-lived Mughal capital built by Emperor Akbar in the 1570s-80s, famous for the towering Buland Darwaza gate, the Tomb of Salim Chishti, and finely preserved red sandstone palace complexes.",
      timings: "Open daily from sunrise to sunset, approximately 6:00 AM to 6:00 PM. The Jama Masjid and Tomb of Salim Chishti (a functioning mosque/shrine) have no fixed closing time.",
      entryFee: "Royal palace complex (ASI-ticketed): approx. ₹40 for Indian/SAARC nationals, ₹550-610 for foreign nationals; children under 15 free. Jama Masjid and Tomb of Salim Chishti: free entry (donations expected). A composite ADA ticket covering Taj Mahal, Agra Fort, and Fatehpur Sikri is available for good value if visiting multiple sites.",
      bestTime: "October to March",
      famousFood: "Agra Petha, Mughlai cuisine, Bedai with jalebi",
      nearby: "Buland Darwaza, Jama Masjid, Panch Mahal (all within the same complex)",
      transport: "Nearest airport: Agra Airport (~40 km). Nearest railway station: Fatehpur Sikri Railway Station (~1 km) or Agra Cantt (~40 km)."
    }
  },
  {
    name: "Ayodhya",
    details: {
      description: "One of Hinduism's seven most sacred cities, revered as the birthplace of Lord Rama. Home to the newly built Ram Mandir (Ram Janmbhoomi Temple), consecrated in January 2024, which has become a major pilgrimage destination.",
      timings: "Ram Mandir darshan: approximately 6:00 AM to 9:30-10:00 PM daily (with a brief midday break for rituals; timings can shift on festival days).",
      entryFee: "Free general darshan. VIP/faster darshan passes may be available seasonally through official booking channels.",
      bestTime: "October to March; Ram Navami (around March-April) for a major festival experience, though extremely crowded",
      famousFood: "Uttar Pradesh thali, Ayodhya's famous Khurchan (milk sweet), Thandai",
      nearby: "Hanuman Garhi, Kanak Bhawan, Saryu River Ghats",
      transport: "Nearest airport: Maharishi Valmiki International Airport, Ayodhya (~10 km). Nearest railway station: Ayodhya Dham Junction (~6 km)."
    }
  },
  {
    name: "Agra Fort",
    details: {
      description: "A UNESCO World Heritage Site and the primary residence of Mughal emperors until 1638, built mainly by Akbar with later additions by Shah Jahan, who was later imprisoned here by his son with views of the Taj Mahal across the river.",
      timings: "6:00 AM to 6:00 PM daily (last entry 5:30 PM), open all seven days.",
      entryFee: "Indian citizens: ₹50 (₹40 on Fridays). SAARC/BIMSTEC nationals: ₹90 (₹40 on Fridays). Foreign tourists: ₹650 (₹600 on Fridays). Children under 15: free. A combo/composite ticket covering Agra Fort and other ASI monuments is available for around ₹100 for Indians.",
      bestTime: "October to March",
      famousFood: "Agra Petha, Mughlai cuisine, Bedai with jalebi",
      nearby: "Taj Mahal (~2.5 km), Jama Masjid Agra, Itmad-ud-Daulah (Baby Taj)",
      transport: "Nearest airport: Agra Airport (~13 km). Nearest railway station: Agra Cantt (~7 km)."
    }
  },
  {
    name: "Mathura & Vrindavan",
    details: {
      description: "Twin sacred towns considered the birthplace and childhood home of Lord Krishna. Mathura hosts the Krishna Janmabhoomi Temple, while Vrindavan is famous for the Banke Bihari Temple and ISKCON temple, both central to Krishna devotion.",
      timings: "Most temples open approximately 5:00 AM to 12:00 PM, then 4:00 PM to 9:00 PM (Banke Bihari Temple has a distinctive practice of periodically closing the curtain before the deity).",
      entryFee: "Free general darshan at most temples (donations welcome).",
      bestTime: "October to March; Janmashtami (August-September) and Holi (March) for major festival experiences",
      famousFood: "Mathura's famous Peda (milk sweet), Uttar Pradesh thali, Rabri",
      nearby: "Krishna Janmabhoomi Temple, Banke Bihari Temple, ISKCON Vrindavan",
      transport: "Nearest airport: Agra Airport (~60 km). Nearest railway station: Mathura Junction (~2 km from Mathura; Vrindavan is a further ~12 km)."
    }
  },
  {
    name: "Sarnath",
    details: {
      description: "One of Buddhism's four most sacred pilgrimage sites, where Buddha delivered his first sermon after attaining enlightenment. Home to the Dhamek Stupa and ruins that once housed a thriving monastic university.",
      timings: "Archaeological site: approximately 8:00 AM to 5:00 PM. Sarnath Museum: 10:00 AM to 5:00 PM, closed Fridays.",
      entryFee: "Indian nationals: approx. ₹25-40. Foreign nationals: approx. ₹300-500. Museum entry ticketed separately, nominal fee.",
      bestTime: "October to March",
      famousFood: "Uttar Pradesh thali, Varanasi's Kachori Sabzi and Lassi (short drive away)",
      nearby: "Dhamek Stupa, Sarnath Museum, Chaukhandi Stupa",
      transport: "Nearest airport: Lal Bahadur Shastri Airport, Varanasi (~30 km). Nearest railway station: Varanasi Junction (~13 km) or Sarnath's own small station."
    }
  },
  {
    name: "Lucknow Bara Imambara",
    details: {
      description: "An 18th-century architectural complex built by Nawab Asaf-ud-Daula, famous for the Bhulbhulaiya (a labyrinth of narrow passages), a massive central hall built without wooden or iron beam support, and the Rumi Darwaza gateway nearby.",
      timings: "Approximately 6:00 AM to 5:00 PM daily.",
      entryFee: "Composite ticket covering Bara Imambara, Bhulbhulaiya, and Baoli (stepwell): approx. ₹50 for Indian visitors, higher for foreign visitors. Guide fee for the Bhulbhulaiya maze typically included or charged separately (~₹100-200).",
      bestTime: "October to March",
      famousFood: "Lucknowi/Awadhi cuisine - Tunday Kababi's galouti kebabs, Lucknowi Biryani, Kulfi Faluda",
      nearby: "Rumi Darwaza, Chota Imambara, Hussainabad Clock Tower",
      transport: "Nearest airport: Chaudhary Charan Singh International Airport, Lucknow (~15 km). Nearest railway station: Lucknow Charbagh (~5 km)."
    }
  },

  // BATCH 26: Uttarakhand (all 7 places)
  {
    name: "Rishikesh",
    details: {
      description: "A sacred city on the banks of the Ganges, known as the 'Yoga Capital of the World'. A major pilgrimage and spiritual center, also popular for adventure sports like river rafting and bungee jumping.",
      timings: "Ghats and temples open all day; Ganga Aarti at Triveni Ghat and Parmarth Niketan held every evening around sunset (approx. 6:00-7:00 PM, seasonal).",
      entryFee: "Free access to ghats and most temples (donations welcome). Adventure activities like river rafting charged separately, typically ₹500-1,500 depending on route.",
      bestTime: "September to November, and February to April (avoid monsoon for rafting safety)",
      famousFood: "Pure vegetarian Sattvic food (no onion/garlic in most eateries), Chotiwala's famous thali, fresh Himalayan-style lassi",
      nearby: "Laxman Jhula, Ram Jhula, Beatles Ashram",
      transport: "Nearest airport: Jolly Grant Airport, Dehradun (~20 km). Nearest railway station: Rishikesh Railway Station (~2 km) or Haridwar Junction (~25 km)."
    }
  },
  {
    name: "Nainital Lake",
    details: {
      description: "A crescent-shaped natural lake at the heart of Nainital hill station, considered sacred (part of the Shakti Peetha legend) and surrounded by hills, popular for boating and as a base for exploring the wider Kumaon region.",
      timings: "Boating typically available 8:00 AM to 6:00 PM daily.",
      entryFee: "Free to view the lake; boating charged separately, typically ₹150-400 depending on boat type (rowboat vs. paddleboat) and duration.",
      bestTime: "March to June, and September to November",
      famousFood: "Kumaoni cuisine (Bhatt ki Churkani, Aloo ke Gutke), Nainital's famous candies and homemade chocolates",
      nearby: "Naina Devi Temple, Mall Road, Snow View Point",
      transport: "Nearest airport: Pantnagar Airport (~65 km). Nearest railway station: Kathgodam Railway Station (~35 km)."
    }
  },
  {
    name: "Valley of Flowers",
    details: {
      description: "A UNESCO World Heritage Site and high-altitude national park in the Western Himalayas, famous for its meadows of endemic alpine flowers that bloom spectacularly during monsoon, alongside rich biodiversity including rare fauna.",
      timings: "Open early June to early October (weather-dependent, closes for winter). Trek/park hours roughly 7:00 AM to 5:00 PM within the season.",
      entryFee: "Indian nationals: approx. ₹50-150 (varies by source; for 3 days validity). Foreign nationals: approx. ₹600-800. Camera fee may apply separately.",
      bestTime: "July to mid-August (peak flower bloom)",
      famousFood: "Garhwali cuisine (Kafuli, Chainsoo), basic supplies available at Ghangaria (base village)",
      nearby: "Hemkund Sahib (further trek from Ghangaria), Ghangaria village, Badrinath (day-trip distance)",
      transport: "Nearest airport: Jolly Grant Airport, Dehradun (~295 km). Trek begins from Govindghat, reached by road; a roughly 17 km trek to Ghangaria, then a further trek to the valley itself."
    }
  },
  {
    name: "Kedarnath Temple",
    details: {
      description: "One of the twelve Jyotirlinga shrines of Lord Shiva and part of the Char Dham pilgrimage circuit, situated at 3,583 metres in the Garhwal Himalayas. The temple closes each winter due to heavy snowfall and reopens in spring.",
      timings: "Open only during the pilgrimage season, typically late April to early November (exact opening/closing dates announced annually on Mahashivratri; in 2026, the temple opened 22 April). Daily darshan hours during the season: approximately 4:00 AM to 8:30-9:00 PM.",
      entryFee: "Free general darshan. Mandatory registration (a QR-coded Yatra E-Pass) is required for all pilgrims via the official Uttarakhand government portal or the Tourist Care Uttarakhand app before travel - carry it at all checkpoints along the route.",
      bestTime: "May-June, and September to early October (July-August sees heavy monsoon rain and landslide risk)",
      famousFood: "Garhwali cuisine, simple pilgrim-friendly meals at Gaurikund and along the trek route",
      nearby: "Gaurikund (trek starting point), Vasuki Tal (further trek), Bhairavnath Temple",
      transport: "Nearest airport: Jolly Grant Airport, Dehradun (~250 km from Gaurikund). Road connectivity up to Gaurikund/Sonprayag, then a 16-18 km trek (or helicopter service from Phata/Guptkashi/Sirsi) to reach the temple."
    }
  },
  {
    name: "Jim Corbett National Park",
    details: {
      description: "India's oldest national park, established in 1936, and one of the country's premier tiger reserves. Named after hunter-turned-conservationist Jim Corbett, known for its rich biodiversity across grasslands, rivers, and forests.",
      timings: "Safaris run in two daily slots, roughly 6:00-9:00 AM and 2:00-5:00 PM (seasonal shifts). Most zones closed mid-June to mid-November during monsoon (Jhirna and Dhela zones stay open year-round).",
      entryFee: "Safari costs vary by zone and vehicle type: typically ₹4,000-7,000+ per jeep (6-seater) including entry, vehicle, and guide fees - prices vary significantly by zone (Dhikala being the most sought-after) and require advance online booking, often weeks ahead for peak season.",
      bestTime: "November to June (mid-November to mid-June for most zones; Jhirna/Dhela year-round)",
      famousFood: "Kumaoni cuisine, forest-lodge meals near Ramnagar",
      nearby: "Corbett Waterfall, Garjiya Devi Temple, Ramnagar town",
      transport: "Nearest airport: Pantnagar Airport (~85 km). Nearest railway station: Ramnagar Railway Station (~2-12 km depending on the entry gate)."
    }
  },
  {
    name: "Badrinath Temple",
    details: {
      description: "One of the four sacred Char Dham pilgrimage sites and among the 108 Divya Desams of Vaishnavism, dedicated to Lord Vishnu (as Badrinarayan). Situated at 3,133 metres in the Garhwal Himalayas near the India-Tibet border region.",
      timings: "Open only during the pilgrimage season, typically late April to mid-November (in 2026, opened 23 April). Daily darshan hours during the season: approximately 4:30 AM to 1:00 PM, then 4:00 PM to 9:00 PM.",
      entryFee: "Free general darshan. Mandatory Char Dham Yatra registration required via the official Uttarakhand government portal before travel.",
      bestTime: "May-June, and September to mid-October",
      famousFood: "Garhwali cuisine, simple pilgrim meals available in Badrinath town",
      nearby: "Mana Village (last Indian village before the Tibet border), Vasudhara Falls, Tapt Kund hot springs",
      transport: "Nearest airport: Jolly Grant Airport, Dehradun (~317 km). Well connected by road (unlike Kedarnath, Badrinath has direct road access, no trekking required)."
    }
  },
  {
    name: "Mussoorie",
    details: {
      description: "A popular hill station known as the 'Queen of the Hills', close to Dehradun, famous for Mall Road, colonial-era architecture, waterfalls, and panoramic Himalayan views, especially from Gun Hill and Lal Tibba.",
      timings: "Open all day; individual attractions (Gun Hill ropeway, Kempty Falls) typically 8:00 AM to 6:00 PM.",
      entryFee: "Free to explore the town; Gun Hill ropeway approx. ₹150-250 round trip, Kempty Falls entry is free (parking/activities charge separately).",
      bestTime: "March to June, and September to November",
      famousFood: "North Indian and Tibetan-influenced cuisine, Mussoorie's famous homemade chocolates and Landour bakery treats",
      nearby: "Kempty Falls, Gun Hill, Lal Tibba (highest point)",
      transport: "Nearest airport: Jolly Grant Airport, Dehradun (~55 km). Nearest railway station: Dehradun Railway Station (~35 km)."
    }
  },

  // BATCH 27: West Bengal (all 6 places) - FINAL STATE
  {
    name: "Victoria Memorial",
    details: {
      description: "A grand white marble monument built in memory of Queen Victoria, inaugurated in 1921 and now one of India's largest cultural and historical museums, set amid 64 acres of gardens in central Kolkata.",
      timings: "Museum galleries: 10:00 AM to 6:00 PM, closed Mondays and national holidays. Gardens: 5:30 AM to 6:00 PM daily. Light and sound show held select evenings (Tue, Wed, Thu, Fri, Sun - language varies by day).",
      entryFee: "Museum: ₹30 for Indian nationals, ₹100 for SAARC nationals, ₹500 for other foreign nationals. Garden entry: ₹20 (separate ticket from museum). Light and sound show: ₹100. School children up to Class 12 in uniform with ID: free museum entry.",
      bestTime: "October to March",
      famousFood: "Bengali thali, Kolkata's famous street food (puchka, kathi rolls), sweets like Rosogolla and Sandesh",
      nearby: "St. Paul's Cathedral, Indian Museum, Maidan",
      transport: "Nearest airport: Netaji Subhas Chandra Bose International Airport (~18 km). Nearest railway station: Kolkata (Howrah Junction, ~7 km, or Sealdah, ~6 km)."
    }
  },
  {
    name: "Darjeeling Hills",
    details: {
      description: "A famous hill station in the Himalayan foothills, renowned worldwide for its tea plantations, the UNESCO-listed Darjeeling Himalayan Railway ('Toy Train'), and views of Kanchenjunga, the world's third-highest peak.",
      timings: "Open all day; Tiger Hill sunrise viewpoint best visited around 4:00-5:00 AM for sunrise over Kanchenjunga.",
      entryFee: "Free to explore the town; tea garden visits and the Toy Train ride charged separately (Toy Train joyride approx. ₹1,000-1,500 per person).",
      bestTime: "March to May, and October to November (clearest Kanchenjunga views)",
      famousFood: "Darjeeling tea, Momos, Thukpa, Tibetan and Nepali-influenced cuisine",
      nearby: "Tiger Hill, Batasia Loop, Padmaja Naidu Himalayan Zoological Park",
      transport: "Nearest airport: Bagdogra Airport (~68-90 km). Nearest railway station: New Jalpaiguri (NJP) (~70-88 km); the historic Darjeeling Himalayan Railway also connects from NJP/Siliguri."
    }
  },
  {
    name: "Sundarbans",
    details: {
      description: "The world's largest mangrove forest and a UNESCO World Heritage Site, spanning the Ganges-Brahmaputra delta. Home to the Royal Bengal Tiger and unique estuarine wildlife, explored primarily by boat safari.",
      timings: "Boat safaris typically run 7:00 AM to 5:00 PM; multi-day cruise packages common given the park's remote location.",
      entryFee: "Entry permit and boat safari together typically range from approx. ₹1,000-3,000+ per person depending on package length and boat type; overnight cruise packages cost significantly more (₹3,000-8,000+).",
      bestTime: "November to February",
      famousFood: "Bengali seafood, fresh river fish preparations, Bengali thali",
      nearby: "Sajnekhali Wildlife Sanctuary, Gosaba, Sundarban Tiger Reserve core areas",
      transport: "Nearest airport: Netaji Subhas Chandra Bose International Airport, Kolkata (~110 km to Godkhali/Sonakhali boarding points). Nearest railway station: Canning (~48 km from Kolkata, then boat/road to the sanctuary)."
    }
  },
  {
    name: "Howrah Bridge",
    details: {
      description: "An iconic cantilever bridge over the Hooghly River connecting Kolkata and Howrah, completed in 1943. One of the busiest cantilever bridges in the world and a defining symbol of the city's skyline.",
      timings: "Open 24 hours (vehicle and pedestrian traffic; best viewed at sunrise or sunset for photography, though photography ON the bridge itself is restricted for security reasons).",
      entryFee: "Free (it's a functioning traffic bridge, not a ticketed monument). Boat rides on the Hooghly River offering views of the bridge charged separately, typically ₹50-200.",
      bestTime: "October to March",
      famousFood: "Bengali street food near Howrah and Mullick Ghat Flower Market, Kolkata's famous street snacks",
      nearby: "Mullick Ghat Flower Market, Howrah Railway Station, BBD Bagh",
      transport: "Nearest airport: Netaji Subhas Chandra Bose International Airport (~20 km). Nearest railway station: Howrah Junction (adjacent to the bridge)."
    }
  },
  {
    name: "Kalimpong",
    details: {
      description: "A scenic hill town near Darjeeling known for its monasteries, flower nurseries (especially orchids and cacti), colonial-era architecture, and views of the Teesta River valley and Himalayan peaks.",
      timings: "Open all day; individual attractions (monasteries, gardens) typically 8:00 AM to 5:00 PM.",
      entryFee: "Free to explore the town; individual attractions like Durpin Monastery or flower nurseries have nominal or no entry fees.",
      bestTime: "March to May, and October to November",
      famousFood: "Kalimpong cheese, Momos, Thukpa, local Lepcha and Nepali-influenced cuisine",
      nearby: "Durpin Monastery, Deolo Hill, Cactus Nursery",
      transport: "Nearest airport: Bagdogra Airport (~80 km). Nearest railway station: New Jalpaiguri (NJP) (~78 km)."
    }
  },
  {
    name: "Dakshineswar Temple",
    details: {
      description: "A significant Kali temple on the banks of the Hooghly River, built in 1855 by Rani Rashmoni. Famous as the place where the revered 19th-century saint Ramakrishna Paramahamsa served as a priest and had his spiritual experiences.",
      timings: "Approximately 6:00 AM to 12:30 PM, then 3:00 PM to 8:30 PM daily (timings can shift slightly by season).",
      entryFee: "Free entry (donations welcome).",
      bestTime: "October to March",
      famousFood: "Bengali sweets and prasad near the temple, Kolkata street food",
      nearby: "Belur Math (across the river), Kolkata city center, Dakshineswar riverside ghats",
      transport: "Nearest airport: Netaji Subhas Chandra Bose International Airport (~20 km). Nearest railway station: Dakshineswar Railway Station (~1 km) or accessible via Kolkata Metro."
    }
  }
];

// Connect and run the updates
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected. Updating places...");

    for (const item of updates) {
      const result = await Place.updateOne(
        { name: item.name },
        { $set: item.details }
      );
      console.log(item.name, "- matched:", result.matchedCount, "modified:", result.modifiedCount);
    }

    console.log("Batch update complete.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error:", error);
  });