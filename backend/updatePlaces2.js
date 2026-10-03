// This script UPDATES existing places by name - it does NOT delete
// or duplicate anything. Safe to run independently of updatePlaces.js.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

// BATCH 12: Kerala (all 8 places)
const updates = [
  {
    name: "Alleppey Backwaters",
    details: {
      description: "A network of interconnected canals, lakes, and lagoons in Alappuzha, famous for houseboat cruises through palm-fringed waterways and traditional Kerala village life along the banks.",
      timings: "Houseboat check-in typically 12:00-1:00 PM, check-out the next day around 9:00-10:00 AM. Day cruises typically run 9:00 AM to 5:00 PM.",
      entryFee: "No general entry fee; houseboat rental costs vary widely, typically ₹6,000-15,000+ for an overnight stay depending on boat size and season.",
      bestTime: "November to February",
      famousFood: "Kerala Sadya (traditional thali), fish moilee, appam with stew",
      nearby: "Kumarakom Bird Sanctuary, Marari Beach, Krishnapuram Palace",
      transport: "Nearest airport: Cochin International Airport (~85 km). Nearest railway station: Alappuzha Railway Station (~3 km)."
    }
  },
  {
    name: "Munnar Tea Gardens",
    details: {
      description: "A hill station in the Western Ghats known for sprawling tea plantations, misty hills, and cool climate. Home to the Tata Tea Museum and Eravikulam National Park, habitat of the endangered Nilgiri Tahr.",
      timings: "Tea gardens generally viewable during daylight; Tata Tea Museum approx. 10:00 AM to 4:30 PM (closed Mondays).",
      entryFee: "Free to view most tea estates from the road; Tea Museum entry approx. ₹75-100. Eravikulam National Park entry approx. ₹90-125 for Indians, higher for foreigners.",
      bestTime: "September to March",
      famousFood: "Kerala Sadya, Munnar-grown tea, homemade chocolates (local specialty)",
      nearby: "Eravikulam National Park, Mattupetty Dam, Top Station viewpoint",
      transport: "Nearest airport: Cochin International Airport (~110 km). Nearest railway station: Aluva (~110 km)."
    }
  },
  {
    name: "Padmanabhaswamy Temple",
    details: {
      description: "One of the 108 Divya Desams sacred to Vaishnavism, dedicated to Lord Vishnu in his reclining form. Famous for a strict traditional dress code and for vaults beneath the temple believed to hold immense historic treasure. Entry is restricted to Hindu worshippers only.",
      timings: "Approximately 3:15 AM to 7:20 PM daily, with multiple darshan slots and a midday break (exact slots vary - check officially before visiting).",
      entryFee: "Free general darshan. Note: entry is restricted to Hindus only, and a strict traditional dress code is enforced - men must wear a mundu/dhoti (no shirt), women must wear a saree, mundum neriyathum, or similar traditional attire; Western clothing is not permitted.",
      bestTime: "November to February",
      famousFood: "Kerala Sadya, Thiruvananthapuram-style snacks near East Fort",
      nearby: "Napier Museum, Kanakakunnu Palace, Shanghumukham Beach",
      transport: "Nearest airport: Trivandrum International Airport (~6 km). Nearest railway station: Thiruvananthapuram Central (~1 km)."
    }
  },
  {
    name: "Fort Kochi",
    details: {
      description: "A historic coastal area blending Portuguese, Dutch, and British colonial influences, known for Chinese fishing nets, colonial architecture, and a laid-back arts and cafe scene.",
      timings: "Open all day; individual attractions (churches, museums) typically 9:00 AM to 5:00-6:00 PM.",
      entryFee: "Free to explore the area (individual sites like Mattancherry Palace charge a nominal fee, typically under ₹25).",
      bestTime: "October to March",
      famousFood: "Kerala seafood, Karimeen (pearl spot fish) fry, Kerala-style biryani",
      nearby: "Chinese Fishing Nets, Mattancherry Palace, Jew Town and Paradesi Synagogue",
      transport: "Nearest airport: Cochin International Airport (~35 km). Nearest railway station: Ernakulam Junction (~13 km)."
    }
  },
  {
    name: "Wayanad Hills",
    details: {
      description: "A mountainous district in the Western Ghats known for spice plantations, wildlife sanctuaries, waterfalls, and ancient rock-cut caves, offering a cooler, greener escape.",
      timings: "Open all day; individual attractions (falls, caves, wildlife sanctuary) typically 8:00 AM/9:00 AM to 5:00 PM.",
      entryFee: "Free to explore the region broadly; individual attractions like Edakkal Caves or Wayanad Wildlife Sanctuary charge separately (typically ₹30-300).",
      bestTime: "October to May",
      famousFood: "Kerala Sadya, Wayanad-style bamboo rice dishes, spiced local coffee",
      nearby: "Edakkal Caves, Chembra Peak, Banasura Sagar Dam",
      transport: "Nearest airport: Calicut (Kozhikode) International Airport (~95 km). Nearest railway station: Kozhikode Railway Station (~95 km)."
    }
  },
  {
    name: "Thekkady Wildlife Sanctuary",
    details: {
      description: "Also known as Periyar Wildlife Sanctuary, a tiger reserve centered on the scenic Periyar Lake, known for boat safaris offering chances to spot elephants, deer, and diverse birdlife along the shoreline.",
      timings: "Park open 6:00 AM to 7:00 PM daily. Boat cruises run in 5 daily slots, roughly 7:30 AM to 3:30 PM (each slot around 1.5 hours).",
      entryFee: "Park entry: approx. ₹45 for Indian adults, ₹15 for children; approx. ₹500 for foreign adults. Boat ride charged separately, approx. ₹225-255 per person. Camera fees apply separately.",
      bestTime: "October to March (afternoon boat slots better for wildlife sightings; mornings better for birdwatching)",
      famousFood: "Kerala Sadya, spice-plantation grown cardamom tea, local Idukki-region cuisine",
      nearby: "Mullaperiyar Dam, spice plantations, Thekkady Rose Park",
      transport: "Nearest airport: Madurai Airport, Tamil Nadu (~140 km) or Cochin International Airport (~150 km). Nearest railway station: Kottayam (~110 km)."
    }
  },
  {
    name: "Varkala Beach",
    details: {
      description: "A cliffside beach town known for dramatic red laterite cliffs overlooking the Arabian Sea, natural mineral springs, and a relaxed backpacker atmosphere with clifftop cafes.",
      timings: "Open 24 hours; cliff-edge cafes and shops typically operate through the evening.",
      entryFee: "Free entry to the beach.",
      bestTime: "September to March",
      famousFood: "Kerala seafood, fresh coconut water, clifftop cafe international fare",
      nearby: "Janardanaswamy Temple, Varkala Mineral Springs, Anjengo Fort",
      transport: "Nearest airport: Trivandrum International Airport (~50 km). Nearest railway station: Varkala Sivagiri Railway Station (~3 km)."
    }
  },
  {
    name: "Kovalam Beach",
    details: {
      description: "One of Kerala's earliest developed beach destinations, known for its crescent-shaped shoreline, lighthouse, and a mix of relaxed and lively beach areas suited to different travelers.",
      timings: "Open 24 hours; best visited during daylight and evening.",
      entryFee: "Free entry (Lighthouse Beach viewpoint may charge a nominal fee, typically under ₹25).",
      bestTime: "September to March",
      famousFood: "Kerala seafood, Karimeen fry, beachside cafe fare",
      nearby: "Vizhinjam Lighthouse, Halcyon Castle, Poovar Backwaters",
      transport: "Nearest airport: Trivandrum International Airport (~15 km). Nearest railway station: Thiruvananthapuram Central (~15 km)."
    }
  },

  // BATCH 13: Madhya Pradesh (all 7 places)
  {
    name: "Khajuraho Temples",
    details: {
      description: "A UNESCO World Heritage Site built by the Chandela dynasty between 950-1050 CE, famous for intricate stone carvings, including some of the finest examples of medieval Indian temple art. Of the original 85 temples, about 20 survive across Western, Eastern, and Southern groups.",
      timings: "Sunrise to sunset daily (approx. 8:00 AM to 6:00 PM for the ticketed Western Group). Light and sound show held after sunset in the Western Group, narrated by Amitabh Bachchan.",
      entryFee: "Western Group (ticketed): approx. ₹40 for Indian nationals, ₹600 for foreign nationals. Eastern and Southern Group temples: free entry. Light and sound show ticket charged separately.",
      bestTime: "October to March",
      famousFood: "Madhya Pradesh thali, Poha-Jalebi, Bhutte ka Kees",
      nearby: "Raneh Falls, Panna National Park, Khajuraho Archaeological Museum",
      transport: "Nearest airport: Khajuraho Airport (~5 km). Nearest railway station: Khajuraho Railway Station (~5 km)."
    }
  },
  {
    name: "Kanha National Park",
    details: {
      description: "One of India's largest and most well-managed tiger reserves, said to have inspired Rudyard Kipling's 'The Jungle Book'. Known for sal and bamboo forests, meadows, and the successful conservation of the rare Barasingha (swamp deer).",
      timings: "Safaris run in two slots, roughly sunrise to 11:00 AM and 3:00 PM to sunset (exact times shift seasonally). Park closed during monsoon, 1 July to mid-October.",
      entryFee: "Entry and jeep safari together typically range from ₹3,000-6,000+ per jeep depending on zone and day (weekends/holidays cost more), plus a guide fee. Costs and rules change seasonally - confirm before booking.",
      bestTime: "November to April (February-April best for tiger sightings)",
      famousFood: "Madhya Pradesh thali, Bafla, local forest-lodge meals",
      nearby: "Bamni Dadar (sunset point), Kanha Museum, Kisli and Mukki safari zones",
      transport: "Nearest airport: Jabalpur Airport (~165 km). Nearest railway station: Jabalpur Railway Station (~165 km)."
    }
  },
  {
    name: "Sanchi Stupa",
    details: {
      description: "A UNESCO World Heritage Site and one of the oldest stone structures in India, commissioned by Emperor Ashoka in the 3rd century BCE. The Great Stupa's elaborately carved gateways (toranas) depict scenes from the Buddha's life.",
      timings: "Sunrise to sunset daily, approximately 8:00 AM to 6:00 PM.",
      entryFee: "Indian nationals: approx. ₹30-40. Foreign nationals: approx. ₹500-600. Children under 15: free.",
      bestTime: "October to March",
      famousFood: "Madhya Pradesh thali, Poha, Dal Bafla",
      nearby: "Sanchi Archaeological Museum, Udayagiri Caves, Vidisha",
      transport: "Nearest airport: Raja Bhoj Airport, Bhopal (~55 km). Nearest railway station: Sanchi Railway Station (~1 km)."
    }
  },
  {
    name: "Bandhavgarh National Park",
    details: {
      description: "A tiger reserve in the Vindhya hills known for having one of the highest densities of tigers in India, along with the historic Bandhavgarh Fort overlooking the park and diverse wildlife across its zones (Tala, Magadhi, Khitauli).",
      timings: "Two daily safari slots - morning (starting around sunrise) and afternoon (after lunch until sunset), timing shifts seasonally. Closed 1 July to 30 September (monsoon), and Wednesday evenings.",
      entryFee: "Safari permit (covering entry, vehicle, and guide) commonly ranges from approx. ₹3,000 on weekdays to ₹5,000+ on weekends/holidays for Indian visitors per jeep (foreign visitor rates are higher) - prices vary by zone and change periodically, so confirm current rates when booking.",
      bestTime: "October to June (February-June often best for tiger sightings as vegetation thins)",
      famousFood: "Madhya Pradesh thali, Bafla, forest-lodge meals",
      nearby: "Bandhavgarh Fort, Chakradhara meadow, Umaria town",
      transport: "Nearest airport: Jabalpur Airport (~165 km). Nearest railway station: Umaria (~35 km)."
    }
  },
  {
    name: "Gwalior Fort",
    details: {
      description: "A massive hilltop fort described by Mughal emperor Babur as 'the pearl among fortresses of India', with a history spanning over a thousand years. Home to palaces, temples, and the ornately tiled Man Singh Palace.",
      timings: "Approximately 8:00 AM to 6:00 PM daily. Light and sound show held in the evening.",
      entryFee: "Nominal entry fee (typically ₹75-100 for Indian visitors, higher for foreigners); Man Singh Palace and light-and-sound show ticketed separately.",
      bestTime: "October to March",
      famousFood: "Madhya Pradesh thali, Gwalior's famous Bedai and Kachori, Gajak (sesame sweet)",
      nearby: "Jai Vilas Palace, Saas-Bahu Temples, Teli ka Mandir",
      transport: "Nearest airport: Gwalior Airport (~10 km). Nearest railway station: Gwalior Junction (~5 km)."
    }
  },
  {
    name: "Orchha",
    details: {
      description: "A former capital of the Bundela Rajputs on the banks of the Betwa River, known for well-preserved medieval palaces, cenotaphs (chhatris), and the Ram Raja Temple, unique for worshipping Lord Rama as a king.",
      timings: "Most monuments open approximately 9:00 AM to 5:00 PM; Ram Raja Temple has separate darshan hours, roughly 8:00 AM to 8:00 PM.",
      entryFee: "Combined ticket for Orchha's main monuments (Jahangir Mahal, Raj Mahal, etc.): approx. ₹40-250 depending on nationality and bundling; Ram Raja Temple entry is free.",
      bestTime: "October to March",
      famousFood: "Madhya Pradesh thali, Poha-Jalebi, Bundelkhandi cuisine",
      nearby: "Ram Raja Temple, Chhatris (Cenotaphs) of Orchha, Betwa River",
      transport: "Nearest airport: Khajuraho Airport (~175 km) or Gwalior Airport (~120 km). Nearest railway station: Orchha Railway Station or Jhansi Junction (~16 km)."
    }
  },
  {
    name: "Pachmarhi",
    details: {
      description: "The only hill station in Madhya Pradesh, nestled in the Satpura range, known as 'Satpura ki Rani' (Queen of Satpura). Features waterfalls, caves, viewpoints, and is part of the Pachmarhi Biosphere Reserve.",
      timings: "Open all day; individual attractions (falls, caves, viewpoints) typically 9:00 AM to 5:00 PM, with some requiring permits from the forest office.",
      entryFee: "Free to explore the town; individual attractions and the biosphere reserve may require a small entry/vehicle permit (typically under ₹100).",
      bestTime: "October to June (avoid peak monsoon for waterfall-area safety)",
      famousFood: "Madhya Pradesh thali, Bhutte ka Kees, local Satpura-region cuisine",
      nearby: "Bee Falls, Pandav Caves, Dhoopgarh (highest point in the Satpura range)",
      transport: "Nearest airport: Bhopal Airport (~195 km). Nearest railway station: Pipariya (~52 km)."
    }
  },

  // BATCH 14: Maharashtra (all 7 places)
  {
    name: "Ajanta & Ellora Caves",
    details: {
      description: "Two separate UNESCO World Heritage cave complexes near Aurangabad (Chhatrapati Sambhajinagar). Ajanta's 30 Buddhist caves (2nd century BCE-6th century CE) are famous for painted murals; Ellora's 34 caves (6th-10th century CE) uniquely combine Buddhist, Hindu, and Jain sites, including the massive rock-cut Kailasa Temple.",
      timings: "Ajanta: 9:00 AM to 5:30 PM, closed every Monday. Ellora: approximately 6:00 AM to 6:00 PM, closed every Tuesday. The two sites are about 100 km apart, so most visitors plan them on separate days.",
      entryFee: "Both sites: ₹40 for Indian/SAARC nationals, ₹600 for foreign nationals, free for children under 15. At Ajanta, private vehicles stop 4 km short and visitors take a shuttle bus (approx. ₹25-30 round trip).",
      bestTime: "October to March",
      famousFood: "Maharashtrian thali, Puran Poli, Aurangabad-style Naan Qalia",
      nearby: "Bibi Ka Maqbara, Daulatabad Fort, Grishneshwar Jyotirlinga Temple (near Ellora)",
      transport: "Nearest airport: Chhatrapati Sambhajinagar (Aurangabad) Airport (~40 km from Ellora, ~100 km from Ajanta). Nearest railway station: Aurangabad Railway Station."
    }
  },
  {
    name: "Gateway of India",
    details: {
      description: "An iconic arch monument built in 1924 overlooking the Arabian Sea, commemorating the visit of King George V and Queen Mary to Mumbai. One of the city's most photographed landmarks and a common starting point for harbour boat tours.",
      timings: "Open 24 hours (best visited in the early morning or evening to avoid crowds and heat).",
      entryFee: "Free entry (boat rides and harbour cruises from here are charged separately).",
      bestTime: "November to February",
      famousFood: "Mumbai street food (vada pav, bhel puri), Colaba Causeway cafes nearby",
      nearby: "Taj Mahal Palace Hotel, Elephanta Caves (via ferry), Colaba Causeway",
      transport: "Nearest airport: Chhatrapati Shivaji Maharaj International Airport (~25 km). Nearest railway station: Chhatrapati Shivaji Maharaj Terminus (~3 km)."
    }
  },
  {
    name: "Lonavala Hills",
    details: {
      description: "A popular hill station in the Sahyadri range between Mumbai and Pune, known for waterfalls, viewpoints, ancient caves, and its famous chikki (a jaggery-based sweet).",
      timings: "Open all day; individual viewpoints and caves typically accessible sunrise to sunset.",
      entryFee: "Free to explore the town (individual attractions like Karla Caves or Tiger's Point may have nominal entry fees, typically under ₹50).",
      bestTime: "June to September (monsoon, for lush greenery and waterfalls), October to February (pleasant weather)",
      famousFood: "Lonavala Chikki, Maharashtrian Vada Pav, Misal Pav",
      nearby: "Bhushi Dam, Karla and Bhaja Caves, Tiger's Point (Tiger Leap)",
      transport: "Nearest airport: Pune Airport (~65 km). Nearest railway station: Lonavala Railway Station (well connected to Mumbai and Pune)."
    }
  },
  {
    name: "Shirdi",
    details: {
      description: "A major pilgrimage town centered on the Sai Baba Temple (Samadhi Mandir), dedicated to the revered 19th-20th century spiritual figure Sai Baba, drawing millions of devotees from across India each year.",
      timings: "Approximately 4:00 AM to 11:00 PM daily (darshan slots vary; special aarti timings at fixed hours).",
      entryFee: "Free general darshan. VIP/paid darshan tickets available for faster access, typically ₹200 or with donation-linked passes.",
      bestTime: "October to March",
      famousFood: "Maharashtrian thali, free prasad (meals) at Sai Baba's Prasadalaya, local sweets",
      nearby: "Dwarkamai, Chavadi, Shani Shingnapur (day-trip distance)",
      transport: "Nearest airport: Shirdi Airport (~15 km). Nearest railway station: Sainagar Shirdi Railway Station (~4 km)."
    }
  },
  {
    name: "Mahabaleshwar",
    details: {
      description: "A popular hill station in the Western Ghats known for strawberry farms, viewpoints over deep valleys, and as the source of the Krishna River. A colonial-era summer retreat during British rule.",
      timings: "Open all day; individual viewpoints and Venna Lake typically accessible 8:00 AM to 6:00 PM.",
      entryFee: "Free to explore the town (Venna Lake boating and individual viewpoints charge nominal fees, typically ₹20-100).",
      bestTime: "October to June (avoid heavy monsoon for viewpoint visibility, though the region is lush green then)",
      famousFood: "Mahabaleshwar strawberries and strawberry-cream, Maharashtrian thali, local honey",
      nearby: "Venna Lake, Arthur's Seat viewpoint, Pratapgad Fort",
      transport: "Nearest airport: Pune Airport (~120 km). Nearest railway station: Satara Railway Station (~60 km)."
    }
  },
  {
    name: "Elephanta Caves",
    details: {
      description: "A UNESCO World Heritage Site on Elephanta Island in Mumbai Harbour, featuring rock-cut cave temples dedicated to Lord Shiva, dating to roughly the 5th-8th century CE, with the famous three-headed Trimurti sculpture as its centerpiece.",
      timings: "Caves: approximately 9:30 AM to 5:30 PM, closed Mondays. Ferries from Gateway of India: first ferry around 9:00 AM, last departure around 2:00 PM (return ferries until approx. 5:30 PM). Closed during heavy monsoon conditions.",
      entryFee: "Ferry (round trip): approx. ₹150-200 per person (varies by boat class). Cave entry: ₹40 for Indian/SAARC nationals, ₹600 for foreign nationals, free for children under 15. Additional small village entry fee (~₹10) and toy train fee (~₹10-18) apply.",
      bestTime: "November to February",
      famousFood: "Snacks and refreshment stalls on Elephanta Island; Mumbai street food back at Gateway of India",
      nearby: "Gateway of India (ferry departure point), Taj Mahal Palace Hotel, Colaba Causeway",
      transport: "Reached only by ferry from Gateway of India (~1 hour each way). Nearest airport: Chhatrapati Shivaji Maharaj International Airport (~25 km from Gateway of India)."
    }
  },
  {
    name: "Shaniwar Wada",
    details: {
      description: "A historic fortified palace in Pune, built in 1732 as the seat of the Peshwa rulers of the Maratha Empire. Though largely destroyed by a fire in the 19th century, its massive gates and walls remain a major heritage landmark.",
      timings: "Approximately 8:00 AM to 6:30 PM daily. Light and sound show held in the evening (roughly 7:15-8:45 PM, seasonal).",
      entryFee: "Nominal entry fee (typically ₹5-25 for Indian visitors, higher for foreign visitors); light and sound show ticketed separately.",
      bestTime: "October to March",
      famousFood: "Puneri Misal Pav, Bakarwadi, Maharashtrian thali",
      nearby: "Aga Khan Palace, Pataleshwar Cave Temple, Lal Mahal",
      transport: "Nearest airport: Pune Airport (~10 km). Nearest railway station: Pune Junction (~5 km)."
    }
  },

  // BATCH 15: Manipur (all 5 places)
  {
    name: "Loktak Lake",
    details: {
      description: "The largest freshwater lake in Northeast India, famous for its floating phumdis (masses of vegetation and soil) that support fishing villages and the unique Keibul Lamjao National Park - the world's only floating national park, home to the endangered Sangai (brow-antlered deer).",
      timings: "Approximately 8:00 AM to 6:00 PM daily. Keibul Lamjao National Park: roughly 9:00 AM to 4:00 PM.",
      entryFee: "Loktak Lake itself: free entry. Keibul Lamjao National Park: approx. ₹30-50 for Indian visitors, ₹300 for foreign visitors. Boat rides to Sendra Island charged separately, approx. ₹200-400. Note: Indian visitors from outside Manipur require an Inner Line Permit (ILP), available at Imphal airport or online.",
      bestTime: "October to March",
      famousFood: "Manipuri thali (Chak-hao black rice, Eromba, Singju), fresh lake fish preparations",
      nearby: "Keibul Lamjao National Park, Sendra Island, Moirang town",
      transport: "Nearest airport: Imphal Airport (~48-55 km). Reached by road from Imphal via Moirang."
    }
  },
  {
    name: "Kangla Fort",
    details: {
      description: "The historic seat of power of the Meitei kings of Manipur, considered a sacred site combining royal, religious, and cultural significance. Contains temples, a coronation platform, and the iconic Kangla-Sha (mythical dragon-lion) statues.",
      timings: "Approximately 9:30 AM to 4:30 PM, closed Mondays.",
      entryFee: "Free entry (Inner Line Permit required for Indian visitors from outside Manipur).",
      bestTime: "October to March",
      famousFood: "Manipuri thali, Chak-hao Kheer (black rice pudding), Singju",
      nearby: "Manipur State Museum, Ima Keithel Market, Bir Tikendrajit Park",
      transport: "Nearest airport: Imphal Airport (~8 km). Located in central Imphal city."
    }
  },
  {
    name: "Shirui Hills",
    details: {
      description: "A mountain range in Ukhrul district famous for the rare Shirui Lily, a flower found nowhere else in the world, which blooms for a short period each year, along with scenic trekking trails and views.",
      timings: "Open all day; best visited during daylight for trekking.",
      entryFee: "Nominal entry/permit fee for the Shirui Lily sanctuary area (typically under ₹50-100; Inner Line Permit required for Indian visitors from outside Manipur).",
      bestTime: "May to June (Shirui Lily blooming season, also when the Shirui Lily Festival is held)",
      famousFood: "Manipuri thali, Tangkhul-style tribal cuisine (Ukhrul region specialty)",
      nearby: "Ukhrul town, Khayang Peak, local Tangkhul Naga villages",
      transport: "Nearest airport: Imphal Airport (~85 km). Reached by road from Imphal via Ukhrul town."
    }
  },
  {
    name: "Khonghampat Orchidarium",
    details: {
      description: "A dedicated orchid sanctuary near Imphal, showcasing over a hundred species of orchids native to the biodiverse Northeast region, including many rare and endangered varieties.",
      timings: "Approximately 9:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically under ₹30-50).",
      bestTime: "March to April (peak orchid blooming season)",
      famousFood: "Manipuri thali, Eromba, Chak-hao Kheer",
      nearby: "Kangla Fort, Imphal city attractions, Loktak Lake (day-trip distance)",
      transport: "Nearest airport: Imphal Airport (~12 km). Located along the Imphal-Kohima highway."
    }
  },
  {
    name: "Ima Keithel Market",
    details: {
      description: "One of the world's largest all-women-run markets, operating in Imphal for centuries, where thousands of Meitei women vendors sell textiles, vegetables, fish, and handicrafts. A significant cultural and economic institution of Manipur.",
      timings: "Approximately 8:00 AM to 6:00 PM daily (closed on certain Manipuri festival days).",
      entryFee: "Free entry (a marketplace, not a ticketed site).",
      bestTime: "October to March",
      famousFood: "Fresh Manipuri produce, Chak-hao (black rice), local snacks and fermented foods sold by vendors",
      nearby: "Kangla Fort, Manipur State Museum, Shree Shree Govindajee Temple",
      transport: "Nearest airport: Imphal Airport (~9 km). Located in central Imphal city."
    }
  },

  // BATCH 16: Meghalaya (all 5 places)
  {
    name: "Living Root Bridges",
    details: {
      description: "Extraordinary bridges grown over decades by the Khasi and Jaintia people, who guide the roots of rubber fig trees across rivers until they form living, load-bearing structures. The famous Double Decker bridge near Nongriat village is the most iconic example.",
      timings: "Trek starts from Tyrna village; best started early morning to complete the roughly 4-6 hour round trip (about 3,500-3,600 steps each way) comfortably.",
      entryFee: "Approx. ₹10-50 entry fee at the Tyrna trailhead, plus a small camera fee (~₹20). Hiring a local guide costs approx. ₹500-700.",
      bestTime: "October to April (avoid heavy monsoon, May-September, when steps get very slippery)",
      famousFood: "Khasi cuisine (Jadoh, Tungrymbai), Maggi and basic snacks available at the trail and Nongriat village",
      nearby: "Rainbow Falls (further trek from the bridge), Nohkalikai Falls, Mawsmai Cave",
      transport: "Reached via Tyrna village (~20 km from Cherrapunji, ~74 km from Shillong), followed by the trek itself. Nearest airport: Shillong Airport (~90 km)."
    }
  },
  {
    name: "Cherrapunji Falls",
    details: {
      description: "Cherrapunji (Sohra) is home to several of India's most dramatic waterfalls, including Nohkalikai Falls (one of India's tallest) and Seven Sisters Falls, set against a backdrop of one of the wettest regions on Earth.",
      timings: "Approximately 9:00 AM to 5:00 PM for main viewpoints.",
      entryFee: "Nominal entry fee at ticketed viewpoints like Nohkalikai Falls (typically ₹20-30 for Indian visitors; camera fees may apply separately).",
      bestTime: "September to November (post-monsoon, for strong flow with clearer visibility); June-August has the most water but often heavy mist and rain",
      famousFood: "Khasi cuisine, local Cherrapunji orange marmalade and honey",
      nearby: "Living Root Bridges, Mawsmai Cave, Thangkharang Park",
      transport: "Nearest airport: Shillong Airport (~78 km). Nearest railway station: Guwahati Railway Station, Assam (~150 km)."
    }
  },
  {
    name: "Dawki River",
    details: {
      description: "A river on the India-Bangladesh border famous for its crystal-clear turquoise waters, so transparent that boats appear to float in mid-air. A popular spot for boating and swimming near the border town of Dawki.",
      timings: "Approximately 8:00 AM to 5:00 PM daily.",
      entryFee: "Free to visit the riverbank; boat rides charged separately, typically ₹500-1,500 depending on group size and duration (rates negotiable with local boatmen).",
      bestTime: "November to March (water is clearest and calmest in the dry season)",
      famousFood: "Khasi cuisine, fresh fish preparations from local river fish",
      nearby: "Shnongpdeng riverside camps, Krang Suri Falls, Mawlynnong village",
      transport: "Nearest airport: Shillong Airport (~85 km). Nearest railway station: Guwahati Railway Station, Assam (~170 km)."
    }
  },
  {
    name: "Shillong Peak",
    details: {
      description: "The highest point in Meghalaya at around 1,965 metres, offering panoramic views over Shillong city and the surrounding hills. Also home to an Indian Air Force radar station, with public viewing areas.",
      timings: "Approximately 8:30 AM to 5:00 PM daily (may close earlier or be restricted due to its proximity to the defence installation).",
      entryFee: "Nominal entry fee (typically under ₹30-50).",
      bestTime: "October to April",
      famousFood: "Khasi cuisine (Jadoh, pork dishes), Shillong-style momos and street food",
      nearby: "Shillong city center, Elephant Falls, Ward's Lake",
      transport: "Nearest airport: Shillong Airport (~30 km). Nearest railway station: Guwahati Railway Station, Assam (~105 km)."
    }
  },
  {
    name: "Mawsmai Cave",
    details: {
      description: "A limestone cave near Cherrapunji featuring dramatic stalactite and stalagmite formations, with a well-lit and relatively easy walking path suitable for most visitors, unlike more adventurous caves in the region.",
      timings: "Approximately 8:00 AM to 5:00 PM daily.",
      entryFee: "Nominal entry fee (typically ₹10-30 for Indian visitors; camera fees may apply separately).",
      bestTime: "October to April",
      famousFood: "Khasi cuisine, local snacks at stalls near the cave entrance",
      nearby: "Mawsmai Falls, Living Root Bridges, Thangkharang Park",
      transport: "Nearest airport: Shillong Airport (~80 km). Located about 6 km from Cherrapunji town."
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